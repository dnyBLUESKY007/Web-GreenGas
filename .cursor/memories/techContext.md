# Tech Context（技术栈与环境）

> 让 AI/新成员能快速把项目跑起来、并了解技术约束。

## 技术栈

- **语言 / 运行时**：TypeScript 5.8、浏览器原生 DOM（无 UI 框架）
- **构建**：Vite 6 + SCSS（sass）
- **数据**：JSON 文件（`frontend/src/data/`）
- **部署（预留）**：Cloudflare Pages

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
- 设计规范：`.cursor/rules/project-related/website-design.mdc`

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

## 外部依赖 / 集成

- **阿里云 OSS**：图片 CDN（`web-greengas.oss-cn-qingdao.aliyuncs.com`）
- **EmailJS**（预留）：无服务器联系表单
- **高德地图 JS API 2.0**（待做，见 issue-0001）：Contact 页地址展示
