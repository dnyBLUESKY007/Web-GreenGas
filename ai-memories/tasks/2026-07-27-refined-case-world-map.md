# Task: 精细化案例世界地图视觉与交互

- **日期**：2026-07-27
- **状态**：已完成并部署
- **关联**：GitHub #24、`ai-memories/tasks/2026-07-26-layered-case-world-map.md`、`ai-memories/tasks/2026-07-26-website-restructure-planning.md`

## Problem / 目标

当前首页和案例中心复用的世界地图仅以六条手绘 SVG 路径表示大陆，并使用 `preserveAspectRatio="none"` 拉伸，轮廓、比例、点位层级、标签和移动端呈现均不足。最初的地图专项参考是三一日本首页的全球布局；需要恢复其轻量本地底图、百分比点位、分层标记和定向标签思路，同时保留 GREENGAS 已建立的证据边界、三语、键盘、触控和案例互通能力。

## 核心思路

使用 Natural Earth 公共领域陆地数据生成并优化本地 SVG，不复制或热链三一日本的地图 PNG。地图保持固定坐标系和原始比例，继续以百分比坐标叠加七个点位；已核实案例使用更显著的实心圆和常驻短标签，市场覆盖使用空心菱形和较弱层级。通过显式标签方向处理南非、澳大利亚重叠；移动端只保留选中标签和下方详情，不缩小触控区域或依赖悬停。

## 受影响的文件 / 模块

- `frontend/src/assets/maps/world-map.svg` — Natural Earth 派生的精细本地底图
- `frontend/src/components/case-map/CaseMap.ts` — 底图、分层点位、标签和选中交互
- `frontend/src/data/case-map.json`、`frontend/src/data/caseMap.ts`、`frontend/src/types/index.ts` — 点位和标签布局契约
- `frontend/src/styles/components/_cases-page.scss` — 三一参考构图、品牌层级和响应式表现
- `frontend/tests/case-center.test.mjs` — 地图资源、比例、交互和无 SDK 契约
- `ai-memories/memories/activeContext.md`、`ai-memories/memories/progress.md` — 完成状态与可复用结论

## 分步计划

- [x] Step 1: 建立精细底图来源与失败契约测试。
- [x] Step 2: 实现本地 SVG、分层点位、定向标签与选中详情。
- [x] Step 3: 完成移动端、键盘、触控、三语和 reduced-motion 样式。
- [x] Step 4: 运行类型检查、测试、构建和代表性页面检查。
- [x] Step 5: 完成代码审查并更新项目记忆。

## Debug Notes

- 2026-07-27：复核确认三一日本首页 `index-map` 才是地图专项参考；Altermind 仅提供全站深绿色与克制视觉基调。三一使用 959×547 PNG、百分比 HTML 点位、固定/脉冲两级标记及手工标签方向，但缺少键盘、触控详情和移动端信息保留，不能直接复制。
- 2026-07-27：Natural Earth 1:50m 陆地数据经 0.18px 容差简化为 247124 字节本地 SVG（gzip 81.32kB），保留 1000×570 固定坐标系；资源使用 intrinsic size、lazy、async decoding 和 low fetch priority，不增加运行时地图依赖。
- 2026-07-27：初次审查发现南非同国双点的 44px 地图触控区在小屏重叠。保留地理点位的同时新增 <=1024px 横向点位选择条，七个点均有同步 `aria-pressed` 的独立 44px 控件；市场覆盖脉冲改为仅选中时出现。
- 2026-07-27：类型检查、全部 23 项测试和生产构建通过；Chrome 在 320/390/768/1024/1440px 的首页、案例中心和案例详情共 15 组检查及中英俄切换通过。390px 与 1440px 地图截图人工复核无变形、溢出或标签遮挡。未部署或关闭 GitHub Issue。
- 2026-07-27：固定候选 `9c6460d` 已发布至生产；Nginx、20 组线上视口/路由、三语、地图资源哈希及公开状态文案扫描均通过。部署证据见 `ai-memories/releases/2026-07-27-issue-24-production.md`。

## Lessons Learned

- 参考站点应拆分为“结构/交互参考”和“全站视觉参考”记录；三一日本决定地图构图，Altermind 只决定品牌氛围，不能互相替代。
- 精细静态地图不需要地图 SDK：优化后的本地矢量底图、百分比点位和原生按钮足以覆盖当前七个点，同时比第三方 API 更稳定。
- 地理上重叠的语义点不应靠篡改坐标解决；在小屏提供同步选择控件，可同时保持地图真实性和可触达性。
