# Task: 建立产品导航与通用产品详情模板

- **日期**：2026-07-26
- **状态**：已完成
- **关联**：GitHub #6、父 PRD #1、`ai-memories/requirements/products-industries.spec.md`

## Problem / 目标

现有 `/products/` 仍复用旧 Solutions 场景与案例页面，产品卡片也没有详情入口、内容状态或可扩展的详情数据。需要建立独立的三语产品导航和通用详情模板，并在最终资料不足时明确区分示例内容与待替换资料。

## 核心思路

沿用 Vite MPA、原生 TypeScript DOM、JSON 数据、自研 i18n 与 `basePath()`。将产品系列和产品记录作为稳定数据契约，列表按系列浏览；详情通过 `/products/detail/?id=<product-id>` 读取同一产品记录，支持特点、参数、行业、下载和咨询区域。现有型号、图片及新增示例字段统一显示 Example Placeholder，技术资料入口标为 Pending Replacement，不发布未经批准的文件。

## 受影响的文件 / 模块

- `frontend/src/data/products.json`、`product-series.json` — 产品详情字段和内容状态
- `frontend/src/pages/products/` — 产品导航和通用详情渲染
- `frontend/products/`、`frontend/vite.config.ts` — MPA 列表/详情入口
- `frontend/src/i18n/locales/` — 中英俄产品页面文案
- `frontend/src/styles/components/` — 产品列表和详情响应式样式
- `frontend/tests/product-navigation.test.mjs` — Issue #6 外部契约
- `ai-memories/memories/` — 当日进展和产品资料缺口

## 分步计划

- [x] Step 1: 以契约测试定义路由、结构化数据、状态标识、详情和未找到恢复行为
- [x] Step 2: 实现独立产品导航、系列筛选和产品卡片
- [x] Step 3: 实现通用产品详情、三语内容、示例/待替换标识与安全链接
- [x] Step 4: 完成响应式样式、类型检查、测试及根路径/子路径生产构建
- [x] Step 5: 更新 Memory Bank、审查改动并提交 Issue #6

## Debug Notes

> 开发中遇到的重大 Bug、卡点、设计变更**即时追加**到这里（带时间戳）。

- 2026-07-26 初次类型检查因工作区未安装 `node_modules` 而无法启动；使用锁文件执行 `npm ci` 后，类型检查、测试及两种 base 的生产构建均通过。
- 2026-07-26 现有产品图片和名称虽来自旧站资源，但尚无本轮公开审批证明，因此统一按 Example Placeholder 展示；下载仅显示 Pending Replacement，不发布未经批准的技术文件。

## Lessons Learned

> 任务收尾时填写，供后续任务参考；重要结论应同步回 `ai-memories/memories/`。

- 列表和详情共享单一产品记录，并让详情字段可选，可在不改页面结构的前提下逐项替换和补齐批准资料。
- 通用详情中的缺失区段必须保持可见的待替换状态，避免空白区域被误解为没有相关能力或资料。
