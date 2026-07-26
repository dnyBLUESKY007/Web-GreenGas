# Task: 审查并整理产品导航实现

- **日期**：2026-07-26
- **状态**：已完成
- **关联**：GitHub #6、`ai-memories/tasks/2026-07-26-product-navigation-detail.md`

## Problem / 目标

审查 `sandcastle/issue-6` 的产品导航与通用详情实现，在保持现有页面内容、结构顺序、链接、回退逻辑和交互行为不变的前提下，提高代码清晰度、一致性、类型准确性和后续维护安全性。

## 核心思路

保留现有数据和视觉契约，将新页面中插入动态文案与数据的 HTML 字符串改为显式 DOM 构造，避免内容中的 HTML 特殊字符破坏结构，并复用产品状态标记构造逻辑。仅收紧当前数据与渲染已经要求的类型字段、改善参数表语义和契约测试；不改变应用描述回退、下载启用条件或占位内容政策。

## 受影响的文件 / 模块

- `frontend/src/pages/products/` — 整理列表与详情 DOM 构造并复用状态标记
- `frontend/src/types/index.ts` — 使产品必需字段与页面及测试契约一致
- `frontend/src/styles/components/_products-page.scss` — 保持参数行表头的现有视觉样式
- `frontend/tests/product-navigation.test.mjs` — 验证状态翻译与编码后的路由契约
- `ai-memories/tasks/2026-07-26-product-navigation-review.md` — 记录审查与验证结果

## 分步计划

- [x] Step 1: 将列表页动态内容改为显式 DOM 构造并抽取共享状态标记
- [x] Step 2: 将详情页动态内容改为显式 DOM 构造并改善参数表语义
- [x] Step 3: 收紧产品类型和契约测试，保持当前输出与行为不变
- [x] Step 4: 运行类型检查、测试及根路径/子路径构建，审查最终差异并提交

## Debug Notes

> 开发中遇到的重大 Bug、卡点、设计变更**即时追加**到这里（带时间戳）。

- 2026-07-26 仓库中不存在任务引用的 `.sandcastle/CODING_STANDARDS.md`；本次审查采用根目录 `AGENTS.md` 和现有 TypeScript/SCSS 约定。
- 2026-07-26 保留缺失 application 时回退到 description、存在 href 时启用下载的原行为，避免在代码整理中混入产品契约变更。
- 2026-07-26 类型检查、4 项契约测试、根路径构建和 `/corp/` 子路径构建均通过。

## Lessons Learned

> 任务收尾时填写，供后续任务参考；重要结论应同步回 `ai-memories/memories/`。

- JSON 与翻译内容进入页面时使用 `textContent` 和元素属性，比 HTML 字符串插值更适合后续逐项替换批准资料，也不会让特殊字符改变 DOM 结构。
- 列表与详情共用状态标记构造器可确保 class 和翻译键保持一致；参数名称使用行表头可在不改变视觉的情况下改善表格语义。
