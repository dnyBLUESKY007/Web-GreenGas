# Task: 对齐旧站新闻内容与新闻展示

- **日期**：2026-07-26
- **状态**：已完成
- **关联**：GitHub #11、父 PRD #1、`ai-memories/requirements/content-centers.spec.md`

## Problem / 目标

现有 News 已有六篇 JSON 驱动的列表和通用详情，但正文是旧站官方归档的缩写，数据没有保留来源 URL，也没有供后续首页直接选择精选新闻的结构化标记。需逐篇对齐官方 GREENGAS 归档，并固化列表、详情、未知 ID 恢复、三语和响应式展示契约。

## 核心思路

继续以 `news.json` 作为唯一新闻源，为每篇记录补充官方来源和精选标记，按归档恢复完整中文正文并提供等价英俄内容。保留现有通用列表/详情实现，通过 Node 内置测试验证公开数据和可观察页面契约，不引入浏览器测试框架或首页重复数据源。

## 受影响的文件 / 模块

- `frontend/src/data/news.json` — 对齐六篇旧站新闻内容、来源及精选标记
- `frontend/src/types/index.ts` — 声明新闻来源与精选字段
- `frontend/src/pages/news/` — 保持列表、详情和未知 ID 恢复契约
- `frontend/src/styles/components/_news-page.scss` — 校验并修正代表性断点表现
- `frontend/tests/news-archive.test.mjs` — 旧站内容与展示契约测试
- `ai-memories/memories/activeContext.md`、`progress.md` — 记录完成状态与素材结论

## 分步计划

- [x] Step 1: 以六份旧站 Markdown/原始 HTML 为准建立失败的数据与页面契约测试
- [x] Step 2: 补齐数据字段、三语正文和类型，使列表/详情/精选数据契约通过
- [x] Step 3: 检查列表、未知 ID 恢复和 320/390/768/1024/1440 响应式规则并最小修正
- [x] Step 4: 运行 typecheck、test、build，更新任务与 Memory Bank 后提交

## Debug Notes

- 2026-07-26 发现当前六篇记录数量、日期和图片均与官方归档一致，但正文普遍缩写，且缺少来源 URL 与首页精选标记；旧站归档未发现额外新闻图片缺口。
- 2026-07-26 发现新闻 JSON 的 `prev_pic` 和旧 `company` 图片路径与 `image-resources.json` 登记不一致；统一改用已登记的 `projects` 与 `certifications` OSS 路径，并以测试逐图校验。

## Lessons Learned

- 旧站内容迁移不能只核对图片文件名；应把页面实际组合出的 CDN URL 与资源登记表逐项校验，避免迁移后分类目录变化造成静默破图。
- 首页精选需求可在同一 JSON 记录上使用显式 `featured` 字段，后续首页直接筛选，无需维护第二份新闻数据。
