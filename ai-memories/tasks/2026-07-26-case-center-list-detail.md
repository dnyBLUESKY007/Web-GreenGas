# Task: 建立案例列表与通用详情页

- **日期**：2026-07-26
- **状态**：已完成
- **关联**：GitHub #9、父 PRD #1、`ai-memories/requirements/website-restructure-prd.md`、`ai-memories/requirements/content-centers.spec.md`

## Problem / 目标

当前 `/cases/` 仅是路由占位页，`projects.json` 中六项示例还包含缺少来源支持的地点、面积、节能比例和设备描述。需要优先迁移官方 GREENGAS 旧站中可识别的项目，建立可筛选案例列表、状态明确的卡片、通用详情页和未知标识恢复状态，并为后续 #10 地图保留稳定标识及诚实精度的地理字段。

## 核心思路

保留 Vite MPA、TypeScript DOM、JSON 驱动、轻量 i18n 和 OSS 图片模式。只纳入旧站中可识别为具体项目且具备地点依据的四项内容，排除产品介绍与仅能证明市场覆盖的记录；案例数据以国家/省级地理字段表达来源支持的精度。列表提供行业和地区筛选，卡片与详情统一显示内容状态，详情通过 `?id=` 复用单一页面并在未知 ID 时返回案例列表入口。#10 的地图不在本任务实现。

## 受影响的文件 / 模块

- `frontend/src/data/projects.json`、`frontend/src/types/index.ts` — 迁移旧站案例并定义状态、详情、图库、相关案例及地图预留字段
- `frontend/src/pages/cases/`、`frontend/cases/`、`frontend/vite.config.ts` — 案例列表、筛选、通用详情入口及未知状态
- `frontend/src/components/project-card/`、首页案例组件和 Solutions 案例引用 — 适配统一案例数据和详情链接
- `frontend/src/i18n/locales/*.json` — 中英俄案例中心界面文案
- `frontend/src/styles/components/`、`frontend/src/styles/main.scss` — 案例列表与详情响应式样式
- `frontend/tests/case-center.test.mjs` — 案例数据及页面行为契约
- `ai-memories/memories/activeContext.md`、`ai-memories/memories/progress.md` — 记录完成状态和后续地图依赖

## 分步计划

- [x] Step 1: 添加失败的案例中心契约测试，固定来源、数据状态、筛选、详情、未知恢复和路由要求。
- [x] Step 2: 用四项可识别旧站项目替换无依据示例数据，并扩展类型及复用卡片。
- [x] Step 3: 实现案例列表筛选、通用详情、相关案例与三语界面。
- [x] Step 4: 添加移动端到桌面端响应式样式，保持俄语长文案可换行。
- [x] Step 5: 完成类型检查、测试、根路径/子路径生产构建和记录更新。

## Debug Notes

> 开发中遇到的重大 Bug、卡点、设计变更**即时追加**到这里（带时间戳）。

- 2026-07-26 旧站八项归档中仅四项可明确识别为项目；三项是产品说明，一项仅支持澳洲市场覆盖陈述，均不作为本次案例卡片迁移内容。
- 2026-07-26 南非旧站记录只证明客户来自南非，不能证明项目安装地点；保留案例正文但将地理精度标为 `unspecified`，避免后续地图生成误导点位。
- 2026-07-26 `CONTEXT.md` 将 GREENGAS 官方旧站定义为 Verified Content 来源；案例 `verified` 表示内容来源已核实，不替代素材台账中的公开许可复核。

## Lessons Learned

> 任务收尾时填写，供后续任务参考；重要结论应同步回 `ai-memories/memories/`。

- 案例中心与首页、产品场景中的案例预览应共享同一份结构化数据和详情链接，避免同一案例在不同入口产生状态或事实差异。
- 客户所属国家不能自动当作项目地点；地图数据必须允许 `unspecified`，只有来源明确时才使用国家或省级精度。
- 根路径构建通过不代表 HTML 入口有效，契约测试应同时检查详情文档以 doctype 开始，防止入口进入 quirks mode。
