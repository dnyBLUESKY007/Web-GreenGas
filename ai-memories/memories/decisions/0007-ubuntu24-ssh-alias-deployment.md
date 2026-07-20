# ADR-0007: Deploy the static site to the Ubuntu 24 SSH-alias host

- **Status**: Accepted
- **Date**: 2026-07-20
- **Supersedes in practice**: the production-host and backup portions of ADR-0006

## Context

The previous ECS server was replaced with an empty Ubuntu 24.04 server. Local SSH configuration exposes it as `web-server`. The existing website is a Vite static build and needs an uncomplicated Nginx deployment workflow that continues to work from Windows, Linux, macOS, and WSL.

## Decision

- Nginx is installed and enabled on the new host.
- The root site serves `/var/www/corp/dist` through `/etc/nginx/sites-available/corp`, enabled from `sites-enabled`; client-side routes fall back to `index.html`.
- Deployment scripts default to `root@web-server`, while retaining `DEPLOY_HOST`, `DEPLOY_USER`, and `DEPLOY_REMOTE_DIR` overrides.
- Each deployment removes and recreates `/var/www/corp/dist`, uploads the new local build, fixes Nginx-readable permissions, validates Nginx, reloads it, and checks `http://127.0.0.1/` for HTTP 200.
- Remote backups are temporarily disabled. Rollback is performed by redeploying a known-good retained build artifact.
- UFW remains inactive; no firewall policy was enabled or altered during provisioning.

## Consequences

- Deployment requires the local `web-server` SSH alias and its authentication configuration.
- No server-side historical release copy is retained, so release artifacts must be retained elsewhere if rollback may be needed.
- HTTPS is intentionally out of scope until a production domain and certificate approach are supplied.
