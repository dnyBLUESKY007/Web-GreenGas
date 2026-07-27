# Task: Restrict case labels to placeholder content

- **日期**：2026-07-27
- **状态**：已完成
- **关联**：GitHub #18、#20、#25；`ai-memories/tasks/2026-07-27-case-home-production-refresh.md`

## Problem / 目标

案例中心和首页当前为所有案例公开显示内容状态，导致四项正式案例均带有“已核实内容”徽标。公开界面不需要为正式内容重复声明核实状态；只有示例占位内容需要显式警示，以免访客将其误认为最终资料。

目标是在保留内部 `verified | example` 数据模型和地图证据语义的前提下，从案例列表、案例详情和首页案例卡移除正式内容徽标，并只为 `example` 案例显示明确的三语占位标记。

## 核心思路

保留 `Project.status`，因为它仍是未来占位数据的判别依据。三个案例渲染入口都使用显式 `project.status === 'example'` 条件生成徽标，不再动态拼接正式状态文案。删除未使用的 `cases.status.verified` 三语键和正式状态样式，将占位文案改成明确包含“占位”的措辞。

地图中的 `verified-case` 和“已核实案例点”描述的是地点证据层级，不属于内容徽标，本任务不修改。

## 受影响的文件 / 模块

- `frontend/src/components/project-card/ProjectCard.ts` — 案例列表仅渲染占位徽标。
- `frontend/src/pages/cases/detail/index.ts` — 案例详情仅渲染占位徽标。
- `frontend/src/components/case-carousel/CaseCarousel.ts` — 首页案例卡仅渲染占位徽标。
- `frontend/src/i18n/locales/*.json` — 删除正式状态文案并明确三语占位文案。
- `frontend/src/styles/components/_cases-page.scss` — 删除正式状态样式，保留占位警示样式。
- `frontend/src/styles/components/_case-carousel.scss` — 为首页占位徽标增加明确样式。
- `frontend/tests/case-center.test.mjs`、`frontend/tests/home-page.test.mjs` — 固定条件渲染和三语契约。
- `ai-memories/releases/2026-07-27-summary.md`、`ai-memories/memories/` — 记录今日完成情况并清理过期阻塞。

## 分步计划

- [x] Step 1: 增加案例中心和首页状态徽标契约测试。
- [x] Step 2: 实现三个入口的占位条件渲染及三语文案、样式调整。
- [x] Step 3: 生成今日总结并同步当前状态与进度记录。
- [x] Step 4: 运行定向测试、类型检查、完整测试和生产构建。
- [x] Step 5: 审查最终差异并记录经验。

## Debug Notes

- 2026-07-27 现有四项生产案例全部为 `verified`，没有占位案例可供浏览器直接触发；因此通过源码契约测试固定条件分支，同时保留数据层正式状态断言。

## Lessons Learned

- 内容状态和地点证据状态虽然都使用“已核实”概念，但面向访客的目的不同；公开徽标政策应与地图证据契约分开维护。
- 当前生产数据没有占位案例时，条件渲染必须由显式契约测试保护，不能依赖人工浏览现有页面发现回归。
