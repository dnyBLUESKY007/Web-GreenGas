#!/usr/bin/env bash
# Build frontend and deploy static site to the Ubuntu Nginx host.
#
# Usage:
#   ./scripts/deploy.sh
#   ./scripts/deploy.sh --skip-build
#   ./scripts/deploy.sh --dry-run
#
# Override via environment variables:
#   DEPLOY_HOST, DEPLOY_USER, DEPLOY_REMOTE_DIR

set -euo pipefail

SKIP_BUILD=0
DRY_RUN=0

for arg in "$@"; do
  case "$arg" in
    --skip-build) SKIP_BUILD=1 ;;
    --dry-run) DRY_RUN=1 ;;
    -h|--help)
      sed -n '2,12p' "$0"
      exit 0
      ;;
    *)
      echo "Unknown option: $arg" >&2
      exit 1
      ;;
  esac
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
FRONTEND_DIR="$REPO_ROOT/frontend"
DIST_DIR="$FRONTEND_DIR/dist"

DEPLOY_HOST="${DEPLOY_HOST:-web-server}"
DEPLOY_USER="${DEPLOY_USER:-root}"
REMOTE_DIR="${DEPLOY_REMOTE_DIR:-/var/www/corp/dist}"
REMOTE_PARENT="$(dirname "$REMOTE_DIR")"
SSH_TARGET="${DEPLOY_USER}@${DEPLOY_HOST}"

step() {
  printf '\n==> %s\n' "$1"
}

remote() {
  if [[ "$DRY_RUN" -eq 1 ]]; then
    printf '[dry-run] ssh %s %s\n' "$SSH_TARGET" "$1"
    return 0
  fi
  ssh "$SSH_TARGET" "$1"
}

scp_dist() {
  if [[ "$DRY_RUN" -eq 1 ]]; then
    printf '[dry-run] scp -r %s %s:%s\n' "$DIST_DIR" "$SSH_TARGET" "$REMOTE_PARENT"
    return 0
  fi
  scp -r "$DIST_DIR" "${SSH_TARGET}:${REMOTE_PARENT}/"
}

step "Deploy target: ${SSH_TARGET}:${REMOTE_DIR}"

if [[ "$SKIP_BUILD" -eq 0 ]]; then
  step 'Building frontend (npm run build)'
  if [[ "$DRY_RUN" -eq 0 ]]; then
    (cd "$FRONTEND_DIR" && npm run build)
  fi
else
  step 'Skipping build (--skip-build)'
fi

if [[ "$DRY_RUN" -eq 0 && ! -f "$DIST_DIR/index.html" ]]; then
  echo "Missing $DIST_DIR/index.html — run build first or remove --skip-build" >&2
  exit 1
fi

step 'Replacing remote dist and preparing target directory'
PREPARE_OUTPUT="$(
  remote "set -e
rm -rf '$REMOTE_DIR'
mkdir -p '$REMOTE_DIR'
echo prepare:ready"
)"

if [[ "$PREPARE_OUTPUT" =~ prepare:(.*) ]]; then
  echo "Remote directory: ${BASH_REMATCH[1]}"
fi

step 'Uploading dist to server'
scp_dist

step 'Fixing permissions, reloading nginx, health check'
HEALTH_OUTPUT="$(
  remote "set -e
chown -R www-data:www-data '$REMOTE_DIR'
find '$REMOTE_DIR' -type d -exec chmod 755 {} \\;
find '$REMOTE_DIR' -type f -exec chmod 644 {} \\;
nginx -t
systemctl reload nginx
CODE=\$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1/)
echo health:\$CODE"
)"

if [[ "$DRY_RUN" -eq 0 ]]; then
  if [[ "$HEALTH_OUTPUT" =~ health:([0-9]+) ]]; then
    CODE="${BASH_REMATCH[1]}"
    if [[ "$CODE" != "200" ]]; then
      echo "Health check failed: HTTP $CODE (expected 200)" >&2
      exit 1
    fi
    echo "Health check: HTTP $CODE"
  fi
fi

printf '\nDeploy complete: http://%s/\n' "$DEPLOY_HOST"
echo 'Rollback: deploy a previously built artifact again, then reload nginx.'
