# Task: 导航、证书、案例顺序与联系页清理

- **日期**：2026-07-31
- **状态**：已部署并通过线上验收
- **关联**：`ai-memories/tasks/2026-07-31-stakeholder-visual-content-corrections.md`

## Problem / 目标

当前桌面顶部导航在 1344px 以下隐藏，导致 1080px 宽设备只能使用右下角菜单；代表性项目展示顺序需要完全反转；0731 新增的高清 ISO、CE 证书需要替换证书页及相关新闻旧图；甲方已取消 EmailJS 留言需求，联系页不应继续展示禁用表单。

## 核心思路

保持左侧品牌排版稳定；中文导航从 1024px 以完整字号显示，英文和俄文分别从 1080px、1152px 显示，并以连续函数在 14–17px 间缩放。在共享项目数据源中反转项目，避免各消费者分别排序；将新证书转换为 WebP 并沿用 OSS 与资源台账；完整删除留言组件、样式、翻译和当前文档中的未来 EmailJS 计划，同时保留 FAQ 与直接联系渠道。

## 受影响的文件 / 模块

- `frontend/src/styles/base/_variables.scss`、`frontend/src/styles/components/_navbar.scss` — 导航断点与紧凑样式
- `frontend/src/data/projects.ts` — 代表性项目顺序
- `frontend/src/data/certifications.json`、`frontend/src/data/news.json`、`frontend/src/data/image-resources.json` — 高清证书资源
- `frontend/src/pages/contact/index.ts`、`frontend/src/components/contact-form/`、相关样式和三语文案 — 删除留言功能
- `frontend/tests/*.test.mjs` — 回归契约
- `README.md`、`ai-memories/memories/` — 更新当前状态

## 分步计划

- [x] Step 1: 更新回归测试并实现导航与案例顺序变更
- [x] Step 2: 转换、上传和登记两张高清证书，统一证书页及新闻引用
- [x] Step 3: 删除留言模块及相关样式、翻译和当前文档
- [x] Step 4: 完成类型、测试、构建、浏览器验收和本地预览

## Debug Notes

- 2026-07-31：确认当前 `$breakpoint-nav-desktop: 84rem` 是 1344px 隐藏阈值；新源图 ISO 为 1588×2244 PNG，CE 为 1079×1502 JPEG，本机已有原生 `cwebp` 和 `ossutil`。
- 2026-07-31：初版紧凑样式在 1024px 俄文环境仍超出约 9px；将紧凑档字号降至 13px、品牌字距降至 0.02em 并缩小间距后，最终链接右侧在 1024/1080/1343/1344px 均保留 16px。
- 2026-07-31：ISO 使用无损 WebP，CE 使用 quality 92 WebP；新 OSS 对象分别为 538448 和 181812 字节，公开 URL 均返回 HTTP 200 与 `image/webp`，浏览器自然尺寸保持 1588×2244 和 1079×1502。
- 2026-07-31：类型检查、24 项测试、根路径与 `/verification/` 子路径构建通过；390/1440px 证书与 Contact、1023/1024/1080/1343/1344px 三语导航及首页项目顺序通过本地 Chrome 验收。生产环境未部署。
- 2026-07-31：根据本地视觉反馈取消紧凑档对左侧品牌的字号、字距和副标题覆盖。浏览器复核确认品牌主标题 18px、副标题 15.75px 在 390–2000px 不变；中文 1024px 留白约 234px，英文 1080px 留白约 106px，俄文 1152px 留白约 26px；英俄导航在 1200–1800px 从 14px 连续增长至 17px，全部无溢出。
- 2026-07-31：固定候选 `5935b84` 已推送并部署生产。部署前回滚包 SHA-256 为 `ac7e2644…fd403`；Nginx、8 个公网路由、两张 OSS 证书、生产/本地 `dist` 一致性及在线 Chrome 三语导航、项目、证书与 Contact 检查全部通过。

## Lessons Learned

- 响应式断点不能只按容器理论宽度决定，必须用最长语言在断点边界测量最后一个链接的实际右边界。
- 证书小字素材优先使用无损 WebP；同时记录源尺寸、派生字节数和公开对象响应，才能区分布局清晰度与源图清晰度问题。
