#Requires -Version 5.1
<#
.SYNOPSIS
  Build frontend and deploy static site to Aliyun ECS (Nginx).

.DESCRIPTION
  1. npm run build (frontend/dist)
  2. Backup remote /var/www/corp/dist
  3. scp dist to server
  4. Fix permissions + reload nginx
  5. Health check via SSH curl

  Override via environment variables:
    DEPLOY_HOST, DEPLOY_USER, DEPLOY_REMOTE_DIR, DEPLOY_BACKUP_DIR

.EXAMPLE
  .\scripts\deploy.ps1
  .\scripts\deploy.ps1 -SkipBuild
  .\scripts\deploy.ps1 -DryRun
#>
[CmdletBinding()]
param(
    [switch]$SkipBuild,
    [switch]$DryRun,
    [int]$TimeoutSec = 180
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

function Write-Step {
    param([string]$Message)
    Write-Host "`n==> $Message" -ForegroundColor Cyan
}

function Get-SshOpts {
    @(
        '-o', 'BatchMode=yes'
        '-o', 'ConnectTimeout=25'
        '-o', 'ServerAliveInterval=5'
        '-o', 'ServerAliveCountMax=3'
        '-o', 'GSSAPIAuthentication=no'
        '-o', 'NumberOfPasswordPrompts=0'
    )
}

function Invoke-ProcessCapture {
    param(
        [string]$FilePath,
        [string[]]$ArgumentList,
        [int]$WaitMs,
        [string]$FailLabel
    )

    $stdoutPath = [System.IO.Path]::GetTempFileName()
    $stderrPath = [System.IO.Path]::GetTempFileName()
    try {
        $proc = Start-Process -FilePath $FilePath `
            -ArgumentList $ArgumentList `
            -NoNewWindow -PassThru `
            -RedirectStandardOutput $stdoutPath `
            -RedirectStandardError $stderrPath

        if (-not $proc.WaitForExit($WaitMs)) {
            try { $proc.Kill() } catch {}
            $tail = Get-Content $stderrPath -ErrorAction SilentlyContinue | Select-Object -Last 20
            if ($tail) {
                Write-Host ($tail -join "`n") -ForegroundColor DarkGray
            }
            throw "$FailLabel timed out after $([Math]::Round($WaitMs / 1000))s"
        }

        # Timed WaitForExit can leave ExitCode unset until the parameterless call.
        $proc.WaitForExit()
        $exit = 0
        if ($null -ne $proc.ExitCode) {
            $exit = [int]$proc.ExitCode
        }

        $stdout = Get-Content $stdoutPath -Raw -ErrorAction SilentlyContinue
        $stderr = Get-Content $stderrPath -Raw -ErrorAction SilentlyContinue
        if ($exit -ne 0) {
            if ($stderr) {
                Write-Host $stderr.TrimEnd() -ForegroundColor DarkGray
            }
            throw "$FailLabel failed (exit $exit)"
        }
        if (-not $stdout) {
            return ''
        }
        return $stdout
    }
    finally {
        Remove-Item $stdoutPath, $stderrPath -ErrorAction SilentlyContinue
    }
}

function Invoke-RemoteScript {
    param(
        [string]$Script,
        [string]$Label = 'remote script',
        [int]$WaitSec = 0
    )
    $unixScript = $Script -replace "`r`n", "`n" -replace "`r", "`n"
    if ($DryRun) {
        Write-Host "[dry-run] ssh $SshTarget (base64|bash)  # $Label"
        Write-Host $unixScript
        return ''
    }

    if ($WaitSec -le 0) {
        $WaitSec = $TimeoutSec
    }

    # Avoid PowerShell stdin pipe to `ssh ... bash -s` (hangs on Windows OpenSSH).
    $encoded = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($unixScript))
    $remote = "echo $encoded | base64 -d | bash"
    $sshArgs = (Get-SshOpts) + @($SshTarget, $remote)

    Write-Host "    running $Label (timeout ${WaitSec}s) ..." -ForegroundColor DarkGray
    return Invoke-ProcessCapture `
        -FilePath 'ssh' `
        -ArgumentList $sshArgs `
        -WaitMs ($WaitSec * 1000) `
        -FailLabel $Label
}

function Invoke-Scp {
    param(
        [string]$Source,
        [string]$Destination
    )
    if ($DryRun) {
        Write-Host "[dry-run] scp -r $Source ${SshTarget}:$Destination"
        return
    }

    $scpArgs = @('-r') + (Get-SshOpts) + @($Source, "${SshTarget}:$Destination")
    $waitMs = [Math]::Max(($TimeoutSec + 120) * 1000, 180000)
    Write-Host "    scp -r (timeout $([Math]::Round($waitMs / 1000))s) ..." -ForegroundColor DarkGray
    [void](Invoke-ProcessCapture `
        -FilePath 'scp' `
        -ArgumentList $scpArgs `
        -WaitMs $waitMs `
        -FailLabel 'scp')
}

Write-Step "Deploy target: ${SshTarget}:${RemoteDir}"

if (-not $SkipBuild) {
    Write-Step 'Building frontend (npm run build)'
    if (-not $DryRun) {
        Push-Location $FrontendDir
        try {
            npm run build
            if ($LASTEXITCODE -ne 0) {
                throw "npm run build failed (exit $LASTEXITCODE)"
            }
        }
        finally {
            Pop-Location
        }
    }
}
else {
    Write-Step 'Skipping build (-SkipBuild)'
}

if (-not $DryRun -and -not (Test-Path (Join-Path $DistDir 'index.html'))) {
    throw "Missing $DistDir\index.html - run build first or remove -SkipBuild"
}

$backupScript = @'
set -e
echo 'backup:start'
TS=$(date +%Y%m%d-%H%M%S)
REMOTE_DIR='__REMOTE_DIR__'
BACKUP_DIR='__BACKUP_DIR__'
echo "backup:ts=$TS"
mkdir -p "$BACKUP_DIR"
if [ -d "$REMOTE_DIR" ] && [ "$(ls -A "$REMOTE_DIR" 2>/dev/null || true)" ]; then
  BACKUP_PATH="$BACKUP_DIR/corp-dist-$TS"
  echo "backup:copying -> $BACKUP_PATH"
  cp -a "$REMOTE_DIR" "$BACKUP_PATH"
  echo "backup:$BACKUP_PATH"
else
  echo "backup:none"
fi
echo 'backup:removing old dist'
rm -rf "$REMOTE_DIR"
mkdir -p "$REMOTE_DIR"
echo 'backup:ready'
'@ -replace '__REMOTE_DIR__', $RemoteDir -replace '__BACKUP_DIR__', $BackupDir

Write-Step 'Backing up remote dist and preparing target directory'
$backupOutput = if ($DryRun) {
    Write-Host '[dry-run] backup + prepare remote dir'
    'backup:(dry-run)'
}
else {
    Invoke-RemoteScript -Script $backupScript -Label 'backup' -WaitSec $TimeoutSec
}
if ($backupOutput) {
    ($backupOutput.TrimEnd() -split "`r?`n") | ForEach-Object {
        if ($_) { Write-Host "    $_" }
    }
}
if ($backupOutput -match 'backup:(.+)') {
    Write-Host "Backup: $($Matches[1].Trim())"
}

Write-Step 'Uploading dist to server'
Invoke-Scp -Source $DistDir -Destination $RemoteParent

$postDeployScript = @'
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
CODE=$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1/)
echo "health:$CODE"
'@ -replace '__REMOTE_DIR__', $RemoteDir

Write-Step 'Fixing permissions, reloading nginx, health check'
if ($DryRun) {
    Write-Host '[dry-run] chown/chmod + nginx reload + curl'
}
else {
    $healthOutput = Invoke-RemoteScript -Script $postDeployScript -Label 'post-deploy' -WaitSec 120
    if ($healthOutput) {
        ($healthOutput.TrimEnd() -split "`r?`n") | ForEach-Object {
            if ($_) { Write-Host "    $_" }
        }
    }
    if ($healthOutput -match 'health:(\d+)') {
        $code = $Matches[1]
        if ($code -ne '200') {
            throw "Health check failed: HTTP $code (expected 200)"
        }
        Write-Host "Health check: HTTP $code" -ForegroundColor Green
    }
}

Write-Host "`nDeploy complete: http://${DeployHost}/" -ForegroundColor Green
Write-Host 'Rollback: restore latest backup under /var/www/backups/ then reload nginx.'
