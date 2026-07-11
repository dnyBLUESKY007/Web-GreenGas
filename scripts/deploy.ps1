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
    [switch]$DryRun
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

function Invoke-Remote {
    param([string]$Command)
    if ($DryRun) {
        Write-Host "[dry-run] ssh $SshTarget $Command"
        return
    }
    ssh $SshTarget $Command
    if ($LASTEXITCODE -ne 0) {
        throw "Remote command failed (exit $LASTEXITCODE): $Command"
    }
}

function Invoke-RemoteScript {
    param([string]$Script)
    $unixScript = $Script -replace "`r`n", "`n" -replace "`r", "`n"
    if ($DryRun) {
        Write-Host "[dry-run] ssh $SshTarget bash -s"
        Write-Host $unixScript
        return ''
    }
    $prevErrorAction = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        $output = $unixScript | ssh $SshTarget 'bash -s' 2>&1 | Out-String
    }
    finally {
        $ErrorActionPreference = $prevErrorAction
    }
    if ($LASTEXITCODE -ne 0) {
        throw "Remote script failed (exit $LASTEXITCODE)"
    }
    return $output
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
    scp -r $Source "${SshTarget}:$Destination"
    if ($LASTEXITCODE -ne 0) {
        throw "scp failed (exit $LASTEXITCODE): $Source -> $Destination"
    }
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
    throw "Missing $DistDir\index.html — run build first or remove -SkipBuild"
}

$backupScript = @'
set -e
TS=$(date +%Y%m%d-%H%M%S)
REMOTE_DIR='__REMOTE_DIR__'
BACKUP_DIR='__BACKUP_DIR__'
mkdir -p "$BACKUP_DIR"
if [ -d "$REMOTE_DIR" ] && [ "$(ls -A "$REMOTE_DIR" 2>/dev/null || true)" ]; then
  BACKUP_PATH="$BACKUP_DIR/corp-dist-$TS"
  cp -a "$REMOTE_DIR" "$BACKUP_PATH"
  echo "backup:$BACKUP_PATH"
else
  echo "backup:none"
fi
rm -rf "$REMOTE_DIR"
mkdir -p "$REMOTE_DIR"
'@ -replace '__REMOTE_DIR__', $RemoteDir -replace '__BACKUP_DIR__', $BackupDir

Write-Step 'Backing up remote dist and preparing target directory'
$backupOutput = if ($DryRun) {
    Write-Host '[dry-run] backup + prepare remote dir'
    'backup:(dry-run)'
}
else {
    Invoke-RemoteScript -Script $backupScript
}
if ($backupOutput -match 'backup:(.+)') {
    Write-Host "Backup: $($Matches[1].Trim())"
}

Write-Step 'Uploading dist to server'
Invoke-Scp -Source $DistDir -Destination $RemoteParent

$postDeployScript = @'
set -e
REMOTE_DIR='__REMOTE_DIR__'
chown -R www-data:www-data "$REMOTE_DIR"
find "$REMOTE_DIR" -type d -exec chmod 755 {} \;
find "$REMOTE_DIR" -type f -exec chmod 644 {} \;
nginx -t
systemctl reload nginx
CODE=$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1/)
echo "health:$CODE"
'@ -replace '__REMOTE_DIR__', $RemoteDir

Write-Step 'Fixing permissions, reloading nginx, health check'
if ($DryRun) {
    Write-Host '[dry-run] chown/chmod + nginx reload + curl'
}
else {
    $healthOutput = Invoke-RemoteScript -Script $postDeployScript
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
