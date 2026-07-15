# Task: 关于与新闻页面重设计

- **日期**：2026-07-15
- **状态**：已完成
- **关联**：`.cursor/memories/activeContext.md`、`.cursor/memories/systemPatterns.md`

## Problem / 目标

迁移旧站的公司介绍、团队与六篇新闻内容，重建 About 和 News 页面，使其使用真实工程资料、已有 OSS 图片和三语内容，而不是当前的简略介绍与占位新闻。

## 核心思路

About 以公司定位、能力与行业、团队、发展资料、可信入口组织内容。旧站发展图片未提供可核验的文字年份，保留为资料图而不虚构时间线。News 以一份 JSON 驱动列表和统一详情页，避免六套重复页面；中文按来源校订，英文和俄文提供默认翻译。

## 受影响的文件 / 模块

- `frontend/src/data/company.json` — 公司与团队资料
- `frontend/src/data/news.json` — 六篇新闻与图集
- `frontend/src/pages/about/` — About 页面渲染
- `frontend/src/pages/news/`、`frontend/news/detail/` — 新闻列表与详情
- `frontend/src/styles/components/` — About/News 响应式样式
- `frontend/src/i18n/locales/` — 页面 UI 文案

## 分步计划

- [x] Step 1: 整理旧站 About/News 内容与 OSS 图片映射。
- [x] Step 2: 重构 About 的数据、结构与样式。
- [x] Step 3: 实现 JSON 新闻列表、筛选及详情页。
- [x] Step 4: 补齐三语 UI 与内容翻译。
- [x] Step 5: 构建与页面验收，更新项目记忆。

## Debug Notes

- 2026-07-15 18:18 旧站“发展历程”只有两张图片资料，正文没有可核验的年份或事件节点；不创建推测性时间轴。

## Lessons Learned

- 旧站内容应保留来源可验证的事实；没有文字来源支撑的时间线不应由文件名或图片推断。
- 新闻正文、图集与三语字段集中在 JSON，可通过统一详情入口扩展，避免维护重复页面。
- `npm run build` 已通过（TypeScript + Vite 全部 MPA 入口）；改动文件无 IDE 诊断。
