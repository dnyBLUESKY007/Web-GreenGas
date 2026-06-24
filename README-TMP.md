# README-TMP — 临时开发记录

> 本文档记录本次会话中的需求、编译方式、修改内容，方便后续 AI IDE 继续开发，也可供人工回看。

---

## 1. 需求：多版本同时预览

通过 Nginx 同时挂载一个网站的多个构建版本，方便对比不同迭代的效果。

- 本地访问 `http://localhost:8080/v1/` → v1 版本
- 本地访问 `http://localhost:8080/v2/` → v2 版本
- 本地访问 `http://localhost:8080/v3/` → v3 版本

构建产物分别放在 `ignored/nginx/v1/`、`ignored/nginx/v2/`、`ignored/nginx/v3/`。

---

## 2. Nginx 多版本配置

在 `server` 块中为每个版本配一个 `location`，关键配置是 `alias` + `try_files` 回退到单页应用的 `index.html`。

关键配置要点（详见 `ignored/nginx/conf/nginx.conf` 8080 端口 server 块）：

```nginx
server {
    listen       8080;
    server_name  localhost;

    location /v1/ {
        alias C:/Users/Junble/Desktop/web-greengas/ignored/nginx/v1/;
        index  index.html;
        try_files $uri $uri/ /v1/index.html;
    }

    # /v2/ ... /v3/ 同理
}
```

Nginx 路径使用正斜杠 `/`，Windows 下同样兼容。

---

## 3. 核心问题与解决方案

### 3.1 问题：子路径部署时链接跳转错误

在网页中点击导航（如 "Solutions"），浏览器跳转到 `/solutions/` 而非 `/v2/solutions/`，原因是所有链接在代码中写死为绝对路径（`href="/solutions/"`）。

### 3.2 尝试过的方案及放弃原因

| 方案 | 原理 | 结果 |
|---|---|---|
| `sub_filter` 替换 HTML | nginx 返回 HTML 前替换 `href="/"` → `href="/v2/"` | **无效**：导航链接是 JS 动态生成，nginx 替换不到 |
| Referer 头重定向 | nginx 根据 `Referer` 头判断来源版本，301 重定向 | **低兼容性**：依赖浏览器行为，无 Referer 时无法区分版本 |

### 3.3 最终方案：Vite `base` 配置 + `basePath()` 工具函数

1. 利用 Vite 的 `base` 配置：构建时设置 `process.env.VITE_BASE`，Vite 会将 `import.meta.env.BASE_URL` 替换为对应值。
2. 创建 `frontend/src/utils/path.ts`，提供 `basePath()` 函数自动拼接路径前缀。
3. 将所有硬编码绝对路径改为 `basePath('/xxx/')` 调用。

**构建命令：**

```powershell
# 普通构建（部署到根路径，不加任何前缀）
npm run build

# 子路径构建（部署到子路径时需要设置环境变量，然后复制到对应目录）
$env:VITE_BASE="/v1/"; npm run build   # 复制产物到 ignored/nginx/v1/
$env:VITE_BASE="/v2/"; npm run build   # 复制产物到 ignored/nginx/v2/
$env:VITE_BASE="/v3/"; npm run build   # 复制产物到 ignored/nginx/v3/
```

不设置 `VITE_BASE` 时自动默认为 `'/'`（`vite.config.ts` 中 `base: process.env.VITE_BASE || '/'`），日常开发不受影响。

---

## 4. 修改文件清单

| 文件 | 修改内容 |
|---|---|
| `frontend/src/utils/path.ts` | **新建** → `basePath()` 工具函数 |
| `frontend/src/config/navigation.ts` | 6 个导航项 href 改用 `basePath()` |
| `frontend/src/components/navbar/Navbar.ts` | brand 链接 + CTA 按钮改用 `basePath()` |
| `frontend/src/pages/home/index.ts` | 4 个 hero slide 的 `ctaHref` + 底部 CTA 改用 `basePath()` |
| `frontend/src/components/product-marquee/ProductMarquee.ts` | "更多产品" 链接改用 `basePath()` |
| `frontend/src/components/about-summary/AboutSummary.ts` | "更多" 链接 + badge 链接改用 `basePath()` |
| `frontend/src/pages/contact/index.ts` | FAQ 链接改用 `basePath()` |
| `frontend/src/data/solutions.json` | 移除 `href` 字段（JSON 无法使用 `import.meta.env`），由 TS 代码动态拼接 |
| `frontend/src/pages/home/renderSolutions.ts` | 链接改为动态调用 `basePath('/solutions/')` |
| `frontend/src/types/index.ts` | `Solution` 接口中移除 `href` 字段 |
| `ignored/nginx/conf/nginx.conf` | 新增 8080 端口 server 块，配置 v1/v2/v3 三个 location |

---

## 5. `basePath()` 工具函数

```typescript
// frontend/src/utils/path.ts

/**
 * Prepends the Vite base path to a site-relative path for sub-path deployments.
 *
 * @example
 *   basePath('/solutions/')  →  '/solutions/'   (base = '/')
 *   basePath('/solutions/')  →  '/v2/solutions/' (base = '/v2/')
 */
export function basePath(path: string): string {
  const base = import.meta.env.BASE_URL;
  const cleanPath = path.replace(/^\//, '');

  return `${base}${cleanPath}`;
}
```

所有需要生成链接的地方统一使用此函数。

---

## 6. 未来扩展：多语言子路径

如果将来要为每种语言构建独立页面（如 `/en/solutions/`、`/zh/solutions/`），有两种主流方案：

1. **独立构建**：每种语言单独构建一份，设置不同 `base`（`/en/`、`/zh/`），Nginx 三个 location 指向不同目录。现有 `basePath()` 函数无需修改。
2. **运行时解析**：只构建一份，Nginx 把 `/en/*`、`/zh/*` 都指向同一 `index.html`，前端 JS 从 `window.location.pathname` 中读取语言前缀并设置 `locale`。不需要 `base` 配置参与。

两种方案都在现有 `basePath()` 基础上扩展，无需推倒重来。

---

## 7. 操作备忘

- Nginx 配置修改后需 reload：`nginx -s reload`
- Vite 构建输出目录：`frontend/dist/`
- 构建产物复制命令（示例）：`Copy-Item -Recurse frontend/dist/* ignored/nginx/v2/`
- TypeScript 类型检查：`npx tsc --noEmit`（在 `frontend/` 目录下执行）

---

## 8. 已知会话中的问题

- **IDE 回档 bug**：本次会话中 IDE 的用户代码回档（Undo）功能曾误操作导致 `nginx.conf` 8080 端口 server 块整个丢失，已手动恢复。
- **`sub_filter_types text/html` 警告**：这是 `sub_filter` 的默认值，重复声明会导致 `duplicate MIME type "text/html"` 警告，直接删除该行即可。
