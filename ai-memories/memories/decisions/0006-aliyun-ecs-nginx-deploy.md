# ADR-0006: 生产部署至阿里云 ECS + Nginx

- **状态**：已采纳
- **日期**：2026-07-10

## 背景

官网为 Vite MPA 静态站，图片已托管 OSS CDN。需将 `frontend/dist` 发布到可公网访问的环境，同时服务器上另有独立前后端（`/insoles/`、`/api/`），须路径隔离、互不影响。

## 决策

- **生产主机**：阿里云 ECS `47.76.112.33`（SSH：`ssh root@47.76.112.33`）
- **Web 根路径**：Nginx `location /` → `/var/www/corp/dist`（`try_files` SPA 回退 `index.html`）
- **发布方式**：本地 `npm run build` 后 `scp` 上传；脚本 `scripts/deploy.ps1` / `scripts/deploy.sh`
- **发布前备份**：`/var/www/backups/corp-dist-YYYYMMDD-HHMMSS`
- **权限**：`www-data:www-data`，目录 `755`、文件 `644`（否则 Nginx 403）
- **同机其他服务**（不随本仓库发布改动）：
  - `/insoles/` → `/var/www/insoles/dist/`
  - `/api/`、`/health` → `127.0.0.1:8000` FastAPI

Nginx 站点配置：`/etc/nginx/conf.d/magic-insoles.conf`。

## 备选方案

- **Cloudflare Pages**：无服务器、全球 CDN；甲方已有 ECS 且需与同机 API 共存，暂作备选
- **OSS 静态网站托管**：仅静态可行，但与同机 `/api` 反代不在同一入口

## 影响

- **正面**：一键脚本、备份可回滚、与 magic-insoles 路径隔离
- **负面**：需 SSH 密钥/网络可达；无 CI 自动发布（可后续加）
- **回滚**：`cp -a /var/www/backups/corp-dist-<ts> /var/www/corp/dist` 后 `nginx -t && systemctl reload nginx`
