# Task: 公开页面仅保留占位状态提醒

- **日期**：2026-07-27
- **状态**：已完成并部署
- **关联**：GitHub #24、`ai-memories/tasks/2026-07-27-case-placeholder-labels.md`、`ai-memories/tasks/2026-07-27-refined-case-world-map.md`

## Problem / 目标

案例卡和详情已不再为正式内容显示“已核实”徽标，但首页及案例中心地图仍公开显示“已核实案例点”，行业占位说明仍以“不得视为已核实”表达，产品与合作组件也保留未来可重新渲染“已核实内容”的状态分支。公开界面应只对示例占位或待替换内容显示提醒，正式内容不显示状态徽标。

## 核心思路

保留内部 `verified` / `verified-content` 数据值用于来源、下载门控和地图证据校验，但不将其翻译为公开状态。地图使用中性的“案例项目点 / Project point”；行业直接声明当前详细内容属于占位；产品、合作公司及首页技术资料摘要仅在状态为示例占位或待替换时创建状态节点。认证新闻及公开许可确认等正常事实语义不属于状态徽标，本任务不改写。

## 受影响的文件 / 模块

- `frontend/src/i18n/locales/*.json` — 删除 verified 状态键并改写地图、行业和产品状态式文案
- `frontend/src/components/case-map/CaseMap.ts` — 使用中性项目点标签
- `frontend/src/components/product-status/ProductStatus.ts` 及调用方 — 正式内容不创建状态节点
- `frontend/src/components/client-logos/ClientLogos.ts`、`service-strip/ServiceStrip.ts` — 仅渲染占位/待替换状态
- `frontend/src/data/industries.json`、`products.json` — 移除占位正文中的状态式 verified 表达
- `frontend/tests/` — 增加公开状态文案和渲染门控契约

## 分步计划

- [x] Step 1: 增加失败契约，枚举需删除的公开 verified 状态文案。
- [x] Step 2: 清理地图、行业和产品三语文案。
- [x] Step 3: 收紧产品、合作与技术摘要状态组件。
- [x] Step 4: 执行类型、测试、构建和浏览器全文核查。
- [x] Step 5: 更新项目记忆并刷新本地验收预览。

## Debug Notes

- 2026-07-27：只读核查确认案例卡、详情和首页案例卡已正确做到只为 `example` 显示占位提醒；遗留公开状态主要来自地图及可复用产品/合作状态组件。
- 2026-07-27：代码审查发现行业详情和首页行业预览会在未来正式内容下直接显示内部 `verified-content`，俄文地图眉题也仍带确认状态含义；均已改为仅在 `example-placeholder` 时创建状态节点，并统一中性文案。
- 2026-07-27：类型检查、24 项测试和生产构建通过；Chrome 五宽度 15 组页面回归通过，13 个主要路由 × 中英俄三语的正文、`aria-label` 和 `title` 共 39 组全文扫描无遗留状态式 verified 文案。未部署。
- 2026-07-27：随固定候选 `9c6460d` 发布；线上 13 路由 × 三语共 39 组公开文案扫描再次通过。

## Lessons Learned

- 不显示正式状态不能只靠当前数据碰巧为占位；所有可复用渲染器都必须显式拒绝把内部正式状态转换为公开节点。
- 内部来源/审批/可用性状态仍有业务价值，正确边界是保留数据与门控、移除面向访客的自我认证标签。
