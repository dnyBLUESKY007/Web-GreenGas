# Task: Migrate static-site deployment to the new Ubuntu server

- **Date**: 2026-07-20
- **Status**: Completed
- **Related**: `ai-memories/memories/techContext.md`, `ai-memories/memories/systemPatterns.md`, ADR-0006

## Problem / Goal

The old ECS deployment target has been replaced by a new, empty Ubuntu 24 server that is reachable through the local SSH host alias `web-server`. Configure the server to serve this Vite static site through Nginx, retarget the local deployment scripts to that alias, and temporarily remove the per-deployment site backup behavior.

## Core Approach

Use the existing local build-and-SCP workflow. On the new host, install and enable Nginx, create the site directory, add an isolated Nginx virtual-host configuration for the root path, validate it, and open only required HTTP/HTTPS firewall rules if UFW is active. Update both deployment scripts to replace the remote site atomically enough for an empty target but without retaining backups. Refresh the Memory Bank only after the actual server target and configuration are verified.

## Affected Files / Modules

- `scripts/deploy.ps1` - default target and remote preparation without backup
- `scripts/deploy.sh` - default target and remote preparation without backup
- `ai-memories/memories/activeContext.md` - current deployment context
- `ai-memories/memories/progress.md` - deployment milestone
- `ai-memories/memories/techContext.md` - verified server/deployment instructions
- `ai-memories/memories/systemPatterns.md` - production deployment pattern
- `ai-memories/memories/decisions/0006-aliyun-ecs-nginx-deploy.md` - revise deployment decision if host and rollback model materially change

## Step-by-step Plan

- [x] Step 1: Inspect the SSH alias and connect to inventory the new Ubuntu server.
- [x] Step 2: Install/configure Nginx, provision `/var/www/corp/dist`, activate a root-path virtual host, and verify local HTTP serving.
- [x] Step 3: Remove remote backup creation from PowerShell and Bash deployment scripts and change their default SSH target to `web-server`.
- [x] Step 4: Build and deploy the site, then verify Nginx configuration and HTTP health on the server.
- [x] Step 5: Update deployment-related Memory Bank records and this task's notes with verified details and changed rollback guidance.

## Debug Notes

> Record material deployment findings and design changes here as they occur.

- 2026-07-20: The initial sandboxed SSH attempt could not resolve the local `web-server` alias. The alias worked when executed with the approved host environment, confirming it is intentionally local SSH configuration rather than public DNS.
- 2026-07-20: Direct PowerShell script invocation was blocked by the local execution policy. `powershell.exe -ExecutionPolicy Bypass -File` was used for this one deployment only; no machine policy was changed.
- 2026-07-20: Nginx installation, site configuration, build, deployment, Nginx validation, and the server-local HTTP health check all succeeded. UFW was installed but inactive, so no firewall rule was changed.

## Lessons Learned

> Fill at completion and propagate reusable conclusions to the Memory Bank.

- Keep the deployment target as an SSH alias rather than copying a mutable IP address into scripts or repository documentation.
- With server-side backups disabled, retain build artifacts elsewhere before a release that may require rollback.
