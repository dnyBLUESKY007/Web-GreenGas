# ADR-0004: 子路径部署 via basePath() + VITE_BASE

- **状态**：已采纳
- **日期**：2026-07-01

## 背景

需要在本机 Nginx 同时挂载 v1/v2/v3 三个构建版本对比效果。站点链接原为绝对路径（`href="/solutions/"`），子路径部署时跳转到根路径而非 `/v2/solutions/`。

## 决策

1. Vite `base` 配置读取 `VITE_BASE` 环境变量
2. 新建 `basePath()` 工具函数，所有站内链接统一调用
3. JSON 数据中的 `href` 字段移除，改由 TS 层动态拼接

## 备选方案

- **nginx `sub_filter` 替换 HTML**：导航链接由 JS 动态生成，nginx 替换不到 — **无效**
- **Referer 头重定向**：依赖浏览器行为，无 Referer 时失效 — **低兼容性**
- **每版本独立域名**：可行但本地对比不便

## 影响

- **正面**：构建时确定 base，运行时零开销；支持任意子路径深度
- **负面**：所有新链接须记得用 `basePath()`，JSON 不能直接写 href
- **后续**：若 Phase 2 做 per-locale 独立构建，现有 `basePath()` 无需修改
