# Tech Context（技术栈与环境）

## Current production deployment (2026-07-20)

| Item | Value |
|------|-------|
| SSH target | `ssh web-server` (root login configured in the local SSH alias) |
| Operating system | Ubuntu 24.04.4 LTS |
| Web server | Nginx, enabled with systemd |
| Static root | `/var/www/corp/dist` |
| Nginx site | `/etc/nginx/sites-available/corp` → `/etc/nginx/sites-enabled/corp` |
| Firewall | UFW installed but inactive; no rules were added or changed |

`scripts/deploy.ps1` and `scripts/deploy.sh` default to `web-server`. They remove and recreate the remote static directory before upload, then apply `www-data:www-data` ownership, `755` directory permissions and `644` file permissions. Per-deployment server backups are temporarily disabled. To roll back, deploy a retained prior build artifact. See ADR-0007.

> 让 AI/新成员能快速把项目跑起来、并了解技术约束。

## 技术栈

- **语言 / 运行时**：TypeScript 5.8、浏览器原生 DOM（无 UI 框架）
- **构建**：Vite 6 + SCSS（sass）
- **数据**：JSON 文件（`frontend/src/data/`）
- **生产部署**：阿里云 ECS + Nginx（`scripts/deploy.ps1` / `scripts/deploy.sh`）
- **备选部署**：Cloudflare Pages

## 本地开发

```bash
cd frontend
npm install
npm run dev       # 开发服务器
npm run build     # 生产构建 → frontend/dist/
npm run preview   # 预览构建结果
npx tsc --noEmit  # 类型检查
```

## 环境与配置

| 变量 | 用途 | 默认 |
|------|------|------|
| `VITE_BASE` | 子路径部署前缀 | `/` |
| `VITE_AMAP_KEY` | 高德地图 Web Key（预留） | — |
| `VITE_AMAP_SECURITY_CODE` | 高德 securityJsCode（预留） | — |

- 环境变量文件在 `frontend/.env`（不提交）；参考 `frontend/.env.example`
- 图片 CDN 基址：`frontend/src/config/assets.ts` → `CDN_BASE`
- 体验与信息验收原则见 `projectbrief.md`。

## 技术约束

- **Phase 1 当前**：Vite + TypeScript + SCSS MPA，勿引入 React/Vue/Next/Astro
- **三阶段演进**：Phase 1 静态站 → Phase 2 Astro（内容扩展）→ Phase 3 Next.js（业务系统）
- 动效仅允许 Navbar 吸顶、Scroll Reveal、Counter；禁止 Three.js / 粒子 / WebGL
- 子路径构建：`$env:VITE_BASE="/v2/"; npm run build`（PowerShell）

## Nginx 多版本对比预览（本地）

通过 Nginx 同时挂载 v1/v2/v3 构建版本，便于对比不同迭代效果：

- `http://localhost:8080/v1/` → `ignored/nginx/v1/`
- `http://localhost:8080/v2/` → `ignored/nginx/v2/`
- `http://localhost:8080/v3/` → `ignored/nginx/v3/`

构建与复制（PowerShell 示例）：

```powershell
$env:VITE_BASE="/v2/"; npm run build
Copy-Item -Recurse frontend/dist/* ignored/nginx/v2/
nginx -s reload   # 配置变更后 reload
```

关键 nginx 配置（`ignored/nginx/conf/nginx.conf` 8080 端口）：每个版本一个 `location`，使用 `alias` + `try_files $uri $uri/ /vN/index.html`。详见 ADR-0004。

## 生产部署（阿里云 ECS）

| 项 | 值 |
|----|-----|
| SSH | `ssh web-server` |
| 站点 URL | 由 `web-server` SSH 别名对应的生产入口提供；尚未登记域名 |
| 静态根目录 | `/var/www/corp/dist` |
| 备份 | 暂时关闭服务器端逐次发布备份 |
| Nginx 配置 | `/etc/nginx/sites-available/corp`（启用链接位于 `sites-enabled/corp`） |

**一键发布**（仓库根目录）：

```powershell
# Windows
.\scripts\deploy.ps1
.\scripts\deploy.ps1 -SkipBuild    # 仅上传已有 dist
.\scripts\deploy.ps1 -DryRun       # 预览步骤
```

```bash
# Linux / macOS / WSL
chmod +x scripts/deploy.sh
./scripts/deploy.sh
./scripts/deploy.sh --skip-build
./scripts/deploy.sh --dry-run
```

环境变量可覆盖默认值：`DEPLOY_HOST`、`DEPLOY_USER`、`DEPLOY_REMOTE_DIR`。

脚本流程：build → 清理并创建远程目录 → `scp` 上传 → `chown/chmod` → `nginx -t && reload` → 本机 `curl` 健康检查。

**回滚**：重新部署保留的已知可用构建产物到 `/var/www/corp/dist`，再 reload nginx。

当前新主机仅配置本站根路径 `/`；部署脚本不修改站点配置。详见 ADR-0007。

## 图片资源工作流

素材与 WebP 产物均在 `ignored/`（不进 git）；线上走阿里云 OSS。

| 步骤 | 路径 / 工具 | 说明 |
|------|-------------|------|
| 1. 原图 | `ignored/resources_png/` | 实拍与 AI 生成图都放这里，按类别子目录（`hero/`、`capacity/` 等） |
| 2. 转 WebP | `ignored/libwebp/convert_to_webp.py`（及 `trim_images.py`） | 输出到 `ignored/resources/`，目录结构与原图对齐 |
| 3. 上传 | 手动上传 OSS bucket | `web-greengas.oss-cn-qingdao.aliyuncs.com/resources/...` |
| 4. 登记 | `frontend/src/data/image-resources.json` | **有文件增删改时必须更新**：CDN URL → `originalPath` + `description` |

代码侧通过 `frontend/src/config/assets.ts` 的 `cdnUrl()` 引用；溯源与说明以 `image-resources.json` 为准。详见 ADR-0002、`systemPatterns.md`。

## 外部依赖 / 集成

- **阿里云 OSS**：图片 CDN（`web-greengas.oss-cn-qingdao.aliyuncs.com`）
- **EmailJS**（预留）：无服务器联系表单
- **高德地图 JS API 2.0**（待做，见 issue-0001）：Contact 页地址展示
