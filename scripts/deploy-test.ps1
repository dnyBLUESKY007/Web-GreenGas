#Requires -Version 5.1
<#
.SYNOPSIS
  Verbose diagnostic / dry probe for the same path as deploy.ps1.

.DESCRIPTION
  Walks the deploy pipeline with timed, step-by-step logging so hangs are visible.
  Default mode is READ-ONLY (no remote rm/cp backup, no scp overwrite, no nginx reload).

  Override via environment variables (same as deploy.ps1):
    DEPLOY_HOST, DEPLOY_USER, DEPLOY_REMOTE_DIR, DEPLOY_BACKUP_DIR

.EXAMPLE
  .\scripts\deploy-test.ps1
  .\scripts\deploy-test.ps1 -SshVerbose
  .\scripts\deploy-test.ps1 -Deploy -SkipBuild
  .\scripts\deploy-test.ps1 -TimeoutSec 20
#>
[CmdletBinding()]
param(
    [switch]$SkipBuild,
    [switch]$Deploy,
    [switch]$SshVerbose,
    [int]$TimeoutSec = 25
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$FrontendDir = Join-Path $RepoRoot 'frontend'
$DistDir = Join-Path $FrontendDir 'dist'

$DeployHost = if ($env:DEPLOY_HOST) { $env:DEPLOY_HOST } else { '47.76.112.33' }
$DeployUser = if ($env:DEPLOY_USER) { $env:DEPLOY_USER } else { 'root' }
$RemoteDir = if ($env:DEPLOY_REMOTE_DIR) { $env:DEPLOY_REMOTE_DIR } else { '/var/www/corp/dist' }
$BackupDir = if ($env:DEPLOY_BACKUP_DIR) { $env:DEPLOY_BACKUP_DIR } else { '/var/www/backups' }
$RemoteParent = Split-Path $RemoteDir -Parent
$SshTarget = "${DeployUser}@${DeployHost}"

$script:PassCount = 0
$script:FailCount = 0
$script:WarnCount = 0
$script:Sw = [System.Diagnostics.Stopwatch]::StartNew()

function Write-Banner {
    param([string]$Title)
    Write-Host ''
    Write-Host ('=' * 64) -ForegroundColor DarkGray
    Write-Host "  $Title" -ForegroundColor Cyan
    Write-Host ('=' * 64) -ForegroundColor DarkGray
}

function Write-Info {
    param([string]$Message)
    $t = '{0:mm\:ss\.fff}' -f $script:Sw.Elapsed
    Write-Host "[$t] $Message"
}

function Write-Ok {
    param([string]$Message)
    $script:PassCount++
    Write-Host "  OK  $Message" -ForegroundColor Green
}

function Write-Warn {
    param([string]$Message)
    $script:WarnCount++
    Write-Host "  WARN  $Message" -ForegroundColor Yellow
}

function Write-Fail {
    param([string]$Message)
    $script:FailCount++
    Write-Host "  FAIL  $Message" -ForegroundColor Red
}

function Get-SshBaseArgs {
    $args = @(
        '-o', 'BatchMode=yes'
        '-o', "ConnectTimeout=$TimeoutSec"
        '-o', 'ServerAliveInterval=5'
        '-o', 'ServerAliveCountMax=3'
        '-o', 'GSSAPIAuthentication=no'
        '-o', 'NumberOfPasswordPrompts=0'
    )
    if ($SshVerbose) {
        $args = @('-v') + $args
    }
    return $args
}

function Invoke-TimedSsh {
    param(
        [string]$Label,
        [string]$RemoteCommand,
        [int]$WaitMs = 0
    )
    if ($WaitMs -le 0) {
        $WaitMs = ($TimeoutSec + 20) * 1000
    }

    Write-Info "SSH start: $Label"
    Write-Host "       target : $SshTarget" -ForegroundColor DarkGray
    $remotePreview = ($RemoteCommand -replace "`r`n", ' / ' -replace "`n", ' / ' -replace "`r", ' / ')
    if ($remotePreview.Length -gt 120) {
        $remotePreview = $remotePreview.Substring(0, 117) + '...'
    }
    Write-Host "       remote : $remotePreview" -ForegroundColor DarkGray
    Write-Host "       wait   : ${WaitMs}ms (ConnectTimeout=${TimeoutSec}s + ServerAlive)" -ForegroundColor DarkGray

    $sshArgs = (Get-SshBaseArgs) + @($SshTarget, $RemoteCommand)
    $stdoutPath = [System.IO.Path]::GetTempFileName()
    $stderrPath = [System.IO.Path]::GetTempFileName()
    $stepSw = [System.Diagnostics.Stopwatch]::StartNew()

    try {
        $proc = Start-Process -FilePath 'ssh' `
            -ArgumentList $sshArgs `
            -NoNewWindow -PassThru `
            -RedirectStandardOutput $stdoutPath `
            -RedirectStandardError $stderrPath

        if (-not $proc.WaitForExit($WaitMs)) {
            try { $proc.Kill() } catch {}
            Write-Fail "$Label timed out after $($stepSw.Elapsed.TotalSeconds.ToString('0.0'))s (process killed)"
            Write-Host '------- stderr (tail) -------' -ForegroundColor DarkGray
            Get-Content $stderrPath -ErrorAction SilentlyContinue | Select-Object -Last 40 | ForEach-Object { Write-Host $_ }
            Write-Host '-----------------------------' -ForegroundColor DarkGray
            return $null
        }

        # Timed WaitForExit can leave ExitCode unset until the parameterless call.
        $proc.WaitForExit()
        $stdout = Get-Content $stdoutPath -Raw -ErrorAction SilentlyContinue
        $stderr = Get-Content $stderrPath -Raw -ErrorAction SilentlyContinue
        $exit = 0
        if ($null -ne $proc.ExitCode) {
            $exit = [int]$proc.ExitCode
        }
        $elapsed = $stepSw.Elapsed.TotalSeconds.ToString('0.00')

        if ($exit -eq 0) {
            Write-Ok "$Label finished in ${elapsed}s (exit $exit)"
        }
        else {
            Write-Fail "$Label finished in ${elapsed}s (exit $exit)"
        }

        if ($stdout) {
            Write-Host '------- stdout -------' -ForegroundColor DarkGray
            ($stdout.TrimEnd() -split "`r?`n") | ForEach-Object { Write-Host "  | $_" }
            Write-Host '----------------------' -ForegroundColor DarkGray
        }
        else {
            Write-Host '  (stdout empty)' -ForegroundColor DarkGray
        }

        if ($SshVerbose -and $stderr) {
            Write-Host '------- stderr (ssh -v) -------' -ForegroundColor DarkGray
            ($stderr.TrimEnd() -split "`r?`n") | Select-Object -Last 50 | ForEach-Object { Write-Host "  | $_" }
            Write-Host '--------------------------------' -ForegroundColor DarkGray
        }
        elseif ($exit -ne 0 -and $stderr) {
            Write-Host '------- stderr -------' -ForegroundColor DarkGray
            ($stderr.TrimEnd() -split "`r?`n") | Select-Object -Last 30 | ForEach-Object { Write-Host "  | $_" }
            Write-Host '----------------------' -ForegroundColor DarkGray
        }

        if ($exit -ne 0) {
            return $null
        }
        return $stdout
    }
    finally {
        Remove-Item $stdoutPath, $stderrPath -ErrorAction SilentlyContinue
    }
}

function Invoke-TimedScp {
    param(
        [string]$Source,
        [string]$Destination
    )
    Write-Info "SCP start: $Source -> ${SshTarget}:$Destination"
    $scpArgs = @(
        '-r'
        '-o', 'BatchMode=yes'
        '-o', "ConnectTimeout=$TimeoutSec"
        '-o', 'ServerAliveInterval=5'
        '-o', 'ServerAliveCountMax=3'
        '-o', 'GSSAPIAuthentication=no'
        $Source
        "${SshTarget}:$Destination"
    )
    $stdoutPath = [System.IO.Path]::GetTempFileName()
    $stderrPath = [System.IO.Path]::GetTempFileName()
    $stepSw = [System.Diagnostics.Stopwatch]::StartNew()
    $waitMs = [Math]::Max(($TimeoutSec + 120) * 1000, 180000)

    try {
        $proc = Start-Process -FilePath 'scp' `
            -ArgumentList $scpArgs `
            -NoNewWindow -PassThru `
            -RedirectStandardOutput $stdoutPath `
            -RedirectStandardError $stderrPath

        if (-not $proc.WaitForExit($WaitMs)) {
            try { $proc.Kill() } catch {}
            Write-Fail "scp timed out after $($stepSw.Elapsed.TotalSeconds.ToString('0.0'))s"
            return $false
        }

        $proc.WaitForExit()
        $elapsed = $stepSw.Elapsed.TotalSeconds.ToString('0.00')
        $scpExit = 0
        if ($null -ne $proc.ExitCode) {
            $scpExit = [int]$proc.ExitCode
        }
        if ($scpExit -eq 0) {
            Write-Ok "scp finished in ${elapsed}s (exit $scpExit)"
            return $true
        }
        Write-Fail "scp exit $scpExit after ${elapsed}s"
        Get-Content $stderrPath -ErrorAction SilentlyContinue | Select-Object -Last 20 | ForEach-Object { Write-Host "  | $_" }
        return $false
    }
    finally {
        Remove-Item $stdoutPath, $stderrPath -ErrorAction SilentlyContinue
    }
}

# ---------------------------------------------------------------------------
Write-Banner 'deploy-test.ps1 - verbose deploy probe'
Write-Info "Mode      : $(if ($Deploy) { 'DEPLOY (writes remote)' } else { 'PROBE (read-only)' })"
Write-Info "Target    : ${SshTarget}:${RemoteDir}"
Write-Info "BackupDir : $BackupDir"
Write-Info "Timeout   : ConnectTimeout=${TimeoutSec}s, ServerAlive 5s x 3"
Write-Info "SshVerbose: $SshVerbose"
Write-Info "SkipBuild : $SkipBuild"
Write-Info "DistDir   : $DistDir"
Write-Info "RepoRoot  : $RepoRoot"

# ---------------------------------------------------------------------------
Write-Banner '1) Local prerequisites'

$sshCmd = Get-Command ssh -ErrorAction SilentlyContinue
$scpCmd = Get-Command scp -ErrorAction SilentlyContinue
if ($sshCmd) { Write-Ok "ssh found: $($sshCmd.Source)" } else { Write-Fail 'ssh not found in PATH' }
if ($scpCmd) { Write-Ok "scp found: $($scpCmd.Source)" } else { Write-Fail 'scp not found in PATH' }

$keyCandidates = @(
    (Join-Path $env:USERPROFILE '.ssh\id_ed25519'),
    (Join-Path $env:USERPROFILE '.ssh\id_rsa'),
    (Join-Path $env:USERPROFILE '.ssh\id_ecdsa')
)
$foundKey = $false
foreach ($k in $keyCandidates) {
    if (Test-Path $k) {
        Write-Ok "private key: $k ($((Get-Item $k).Length) bytes)"
        $foundKey = $true
    }
}
if (-not $foundKey) {
    Write-Warn "no standard private key under $env:USERPROFILE\.ssh (BatchMode may fail)"
}

$indexHtml = Join-Path $DistDir 'index.html'
if (Test-Path $indexHtml) {
    $distSize = (Get-ChildItem $DistDir -Recurse -File -ErrorAction SilentlyContinue |
        Measure-Object -Property Length -Sum).Sum
    $distFiles = (Get-ChildItem $DistDir -Recurse -File -ErrorAction SilentlyContinue | Measure-Object).Count
    Write-Ok "local dist OK: $distFiles files, $([Math]::Round($distSize/1KB, 1)) KB, index.html present"
}
else {
    if ($Deploy -and -not $SkipBuild) {
        Write-Warn "dist missing - will build in next step"
    }
    elseif ($Deploy) {
        Write-Fail "missing $indexHtml (run without -SkipBuild or build first)"
    }
    else {
        Write-Warn "missing $indexHtml (probe continues; -Deploy would need a build)"
    }
}

# ---------------------------------------------------------------------------
Write-Banner '2) Network reachability'

Write-Info "Ping $DeployHost ..."
$ping = Test-Connection -ComputerName $DeployHost -Count 2 -Quiet -ErrorAction SilentlyContinue
if ($ping) { Write-Ok 'ICMP ping succeeded' } else { Write-Warn 'ICMP ping failed or filtered (not fatal for SSH)' }

Write-Info "TCP connect ${DeployHost}:22 ..."
try {
    $tcp = Test-NetConnection -ComputerName $DeployHost -Port 22 -WarningAction SilentlyContinue
    if ($tcp.TcpTestSucceeded) {
        Write-Ok "port 22 open (RemoteAddress=$($tcp.RemoteAddress))"
    }
    else {
        Write-Fail 'port 22 closed or filtered'
    }
}
catch {
    Write-Fail "Test-NetConnection failed: $_"
}

Write-Info "HTTP GET http://${DeployHost}/ ..."
try {
    $resp = Invoke-WebRequest -Uri "http://${DeployHost}/" -UseBasicParsing -TimeoutSec 10
    Write-Ok "HTTP $($resp.StatusCode), body $($resp.RawContentLength) bytes"
}
catch {
    Write-Warn "HTTP check failed: $($_.Exception.Message)"
}

# ---------------------------------------------------------------------------
Write-Banner '3) SSH auth + simple remote exec (this is where deploy.ps1 often hung)'

$echoOut = Invoke-TimedSsh -Label 'echo OK' -RemoteCommand 'echo OK; date -Is; whoami; hostname'
if (-not $echoOut) {
    Write-Host ''
    Write-Host 'SSH remote exec is hanging or failing.' -ForegroundColor Red
    Write-Host 'deploy.ps1 backup step uses the same channel - fix the server first.' -ForegroundColor Yellow
    Write-Host 'Try Aliyun VNC/Workbench: check df -h, apt locks, /etc/update-motd.d, MaxSessions.' -ForegroundColor Yellow
    Write-Banner "Summary: PASS=$script:PassCount  WARN=$script:WarnCount  FAIL=$script:FailCount"
    exit 2
}

# ---------------------------------------------------------------------------
Write-Banner '4) Remote environment (read-only - mirrors deploy preconditions)'

$probeScript = @'
set -e
echo '--- uptime ---'
uptime
echo '--- disk ---'
df -h / /var/www 2>/dev/null || df -h /
echo '--- remote dist ---'
if [ -d '__REMOTE_DIR__' ]; then
  du -sh '__REMOTE_DIR__' 2>/dev/null || true
  echo -n 'files: '
  find '__REMOTE_DIR__' -type f 2>/dev/null | wc -l
  ls -la '__REMOTE_DIR__' | head -n 15
else
  echo 'missing: __REMOTE_DIR__'
fi
echo '--- backups ---'
mkdir -p '__BACKUP_DIR__'
du -sh '__BACKUP_DIR__' 2>/dev/null || true
ls -1t '__BACKUP_DIR__' 2>/dev/null | head -n 8 || true
echo '--- nginx ---'
nginx -t 2>&1 || true
systemctl is-active nginx 2>/dev/null || true
echo '--- local http ---'
curl -s -o /dev/null -w 'health:%{http_code}\n' http://127.0.0.1/ || echo 'health:curl-failed'
echo '--- probe done ---'
'@ -replace '__REMOTE_DIR__', $RemoteDir -replace '__BACKUP_DIR__', $BackupDir

$probeUnix = $probeScript -replace "`r`n", "`n" -replace "`r", "`n"
$probeEncoded = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($probeUnix))
$probeCmd = "echo $probeEncoded | base64 -d | bash"

$probeOut = Invoke-TimedSsh -Label 'remote probe' -RemoteCommand $probeCmd -WaitMs (($TimeoutSec + 40) * 1000)
if (-not $probeOut) {
    Write-Banner "Summary: PASS=$script:PassCount  WARN=$script:WarnCount  FAIL=$script:FailCount"
    exit 2
}

# ---------------------------------------------------------------------------
if (-not $Deploy) {
    Write-Banner '5) Deploy steps (skipped - probe mode)'
    Write-Info 'Would run (same as deploy.ps1):'
    Write-Host '  1. npm run build (unless -SkipBuild)'
    Write-Host "  2. backup $RemoteDir -> $BackupDir/corp-dist-<ts>"
    Write-Host "  3. rm -rf $RemoteDir; mkdir -p $RemoteDir"
    Write-Host "  4. scp -r $DistDir ${SshTarget}:$RemoteParent"
    Write-Host '  5. chown/chmod + nginx -t + systemctl reload nginx'
    Write-Host '  6. curl health check'
    Write-Host ''
    Write-Host 'Re-run with -Deploy to execute those steps with the same timed logging:' -ForegroundColor Cyan
    Write-Host '  .\scripts\deploy-test.ps1 -Deploy -SkipBuild'
    Write-Banner "Summary: PASS=$script:PassCount  WARN=$script:WarnCount  FAIL=$script:FailCount  elapsed=$([Math]::Round($script:Sw.Elapsed.TotalSeconds,1))s"
    exit 0
}

# ---------------------------------------------------------------------------
Write-Banner '5) Build (deploy mode)'

if (-not $SkipBuild) {
    Write-Info 'Running npm run build ...'
    $buildSw = [System.Diagnostics.Stopwatch]::StartNew()
    Push-Location $FrontendDir
    try {
        npm run build
        if ($LASTEXITCODE -ne 0) {
            Write-Fail "npm run build exit $LASTEXITCODE"
            exit 1
        }
        Write-Ok "build finished in $($buildSw.Elapsed.TotalSeconds.ToString('0.00'))s"
    }
    finally {
        Pop-Location
    }
}
else {
    Write-Info 'Skipping build (-SkipBuild)'
}

if (-not (Test-Path $indexHtml)) {
    Write-Fail "missing $indexHtml"
    exit 1
}

# ---------------------------------------------------------------------------
Write-Banner '6) Remote backup + prepare target (WRITES - same as deploy.ps1)'

$backupScript = @'
set -e
echo 'backup:start'
TS=$(date +%Y%m%d-%H%M%S)
REMOTE_DIR='__REMOTE_DIR__'
BACKUP_DIR='__BACKUP_DIR__'
echo "backup:ts=$TS"
echo "backup:remote=$REMOTE_DIR"
echo "backup:dir=$BACKUP_DIR"
mkdir -p "$BACKUP_DIR"
if [ -d "$REMOTE_DIR" ] && [ "$(ls -A "$REMOTE_DIR" 2>/dev/null || true)" ]; then
  BACKUP_PATH="$BACKUP_DIR/corp-dist-$TS"
  echo "backup:copying -> $BACKUP_PATH"
  cp -a "$REMOTE_DIR" "$BACKUP_PATH"
  echo "backup:$BACKUP_PATH"
else
  echo 'backup:none (empty or missing dist)'
fi
echo 'backup:removing old dist'
rm -rf "$REMOTE_DIR"
mkdir -p "$REMOTE_DIR"
echo 'backup:ready'
'@ -replace '__REMOTE_DIR__', $RemoteDir -replace '__BACKUP_DIR__', $BackupDir

# Prefer base64|bash over stdin pipe (deploy.ps1's bash -s) so hangs surface as timeouts
$backupEncoded = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes(($backupScript -replace "`r`n", "`n" -replace "`r", "`n")))
$backupRemote = "echo $backupEncoded | base64 -d | bash"
$backupOut = Invoke-TimedSsh -Label 'backup+prepare' -RemoteCommand $backupRemote -WaitMs 180000
if (-not $backupOut) {
    Write-Fail 'backup step failed - aborting before upload'
    exit 1
}

# ---------------------------------------------------------------------------
Write-Banner '7) Upload dist via scp'

if (-not (Invoke-TimedScp -Source $DistDir -Destination $RemoteParent)) {
    Write-Fail 'scp failed - remote dist may be empty; restore from /var/www/backups if needed'
    exit 1
}

Write-Info 'Verifying remote index after upload ...'
$verifyOut = Invoke-TimedSsh -Label 'verify upload' -RemoteCommand "test -f '$RemoteDir/index.html' && ls -la '$RemoteDir/index.html' && du -sh '$RemoteDir'"
if (-not $verifyOut) {
    Write-Fail 'upload verification failed'
    exit 1
}

# ---------------------------------------------------------------------------
Write-Banner '8) Permissions + nginx reload + health'

$postScript = @'
set -e
REMOTE_DIR='__REMOTE_DIR__'
echo 'post:chown'
chown -R www-data:www-data "$REMOTE_DIR"
echo 'post:chmod'
find "$REMOTE_DIR" -type d -exec chmod 755 {} \;
find "$REMOTE_DIR" -type f -exec chmod 644 {} \;
echo 'post:nginx-t'
nginx -t
echo 'post:reload'
systemctl reload nginx
echo 'post:curl'
CODE=$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1/)
echo "health:$CODE"
'@ -replace '__REMOTE_DIR__', $RemoteDir
$postEncoded = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes(($postScript -replace "`r`n", "`n" -replace "`r", "`n")))
$postRemote = "echo $postEncoded | base64 -d | bash"
$healthOut = Invoke-TimedSsh -Label 'post-deploy' -RemoteCommand $postRemote -WaitMs 120000
if (-not $healthOut) {
    Write-Fail 'post-deploy failed'
    exit 1
}
if ($healthOut -match 'health:(\d+)') {
    $code = $Matches[1]
    if ($code -eq '200') {
        Write-Ok "Health check: HTTP $code"
    }
    else {
        Write-Fail "Health check: HTTP $code (expected 200)"
        exit 1
    }
}
else {
    Write-Warn 'could not parse health:NNN from remote output'
}

Write-Info "Public URL: http://${DeployHost}/"
Write-Banner "DONE  PASS=$script:PassCount  WARN=$script:WarnCount  FAIL=$script:FailCount  elapsed=$([Math]::Round($script:Sw.Elapsed.TotalSeconds,1))s"
exit 0
