# Task: 建立行业应用页面

- **日期**：2026-07-26
- **状态**：已完成
- **关联**：GitHub #7、父 PRD #1、`ai-memories/requirements/products-industries.spec.md`

## Problem / 目标

将 `/industries/` 从全局导航占位页改为独立行业应用入口。页面需覆盖 GREENGAS 来源支持的钢铁、化工、电力、制药、军工和特种设施，并让访客逐类查看运行环境、常见制冷挑战、应对方式、推荐设备类型和相关案例空间，同时避免把尚未批准的细节表述为事实。

## 核心思路

使用独立 JSON 保存六个带稳定标识和三语字段的行业记录，页面采用图标分类卡片加可直接锚定的详情区。已知行业分类来自 GREENGAS 旧站记录；详细场景、推荐映射和案例关联统一标记为 `example-placeholder`，并在总览及案例区域明确展示状态。产品和案例链接由 TypeScript 通过 `basePath()` 生成，不引入未批准图片或竞争对手内容。

## 受影响的文件 / 模块

- `frontend/industries/index.html` — 切换到行业页面入口。
- `frontend/src/data/industries.json` — 六类行业的稳定标识、三语内容和关联标识。
- `frontend/src/pages/industries/index.ts` — 渲染分类总览、详情、状态和跨页面链接。
- `frontend/src/styles/components/_industries-page.scss`、`frontend/src/styles/main.scss` — 响应式行业页面样式。
- `frontend/src/i18n/locales/*.json` — 页面级三语标签。
- `frontend/src/types/index.ts` — 行业结构化数据契约。
- `frontend/tests/industries-page.test.mjs` — 可观察页面和数据契约。
- `ai-memories/memories/activeContext.md`、`ai-memories/memories/progress.md` — 当日完成记录。

## 分步计划

- [x] Step 1: 编写失败的行业页面契约测试，覆盖入口、六类稳定 ID、三语字段、状态和 base-path-safe 链接。
- [x] Step 2: 实现 JSON 驱动的行业总览和详情展示，补齐三语文案和响应式样式。
- [x] Step 3: 运行类型检查、测试、根路径与子路径生产构建，并修复发现的问题。
- [x] Step 4: 更新任务与 Memory Bank 记录，审查变更后提交。

## Debug Notes

> 开发中遇到的重大 Bug、卡点、设计变更**即时追加**到这里（带时间戳）。

- 2026-07-26 16:10 素材台账将现有行业分类、解决方案和案例分别标为示例占位或待审批；因此本页不使用案例图片和客户名称，所有细节记录统一保持示例占位状态。

## Lessons Learned

> 任务收尾时填写，供后续任务参考；重要结论应同步回 `ai-memories/memories/`。

- 当行业分类本身有 GREENGAS 来源、但详细工况和项目映射未获批准时，可保留分类框架并对整条记录及关联案例同时标记示例状态，避免局部标签造成事实误读。
- 使用稳定查询参数标识配合 `basePath()`，可让行业页先建立产品/案例契约，后续详情 Issue 无需回改行业数据结构。
- `npm ci` 报告两个现有 high severity 审计项；本任务未改依赖，后续应在独立依赖维护任务中评估。
