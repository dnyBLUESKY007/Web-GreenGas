# Task: 为案例中心增加双层世界地图

- **日期**：2026-07-26
- **状态**：已完成
- **关联**：GitHub #10、父 PRD #1、`ai-memories/requirements/website-restructure-prd.md`、`ai-memories/requirements/content-centers.spec.md`

## Problem / 目标

案例中心已有稳定案例标识、诚实精度的地理字段、筛选列表和通用详情，但缺少帮助访客区分具体项目证据与更广泛市场经验的地图。需要增加无需密钥的轻量世界地图，以不同形状和填充展示已核实案例点与市场覆盖点；点位须支持键盘、触摸和三语，并在有具体案例时与详情及当前可见卡片互通。

## 核心思路

保留 Vite MPA、原生 TypeScript DOM、JSON 数据和 SCSS 架构。新增独立地图点位数据：已核实层仅引用 `projects.json` 中具备国家或省级精度的三个稳定案例；市场覆盖层仅引用正式公司描述支持的南非、澳大利亚、韩国和俄罗斯，并明确声明不代表具体项目。使用本地绘制的简化 SVG 世界轮廓作为无语义背景，以原生按钮覆盖点位并通过持久信息面板提供名称、类型、精度和操作；用实心圆与空心菱形确保区分不只依赖颜色。

## 受影响的文件 / 模块

- `frontend/src/data/case-map.json`、`frontend/src/data/caseMap.ts`、`frontend/src/types/index.ts` — 双层点位、稳定案例引用与运行时完整性检查
- `frontend/src/components/case-map/CaseMap.ts` — 本地 SVG、可访问点位、图例和信息面板
- `frontend/src/pages/cases/index.ts` — 地图接入、筛选后的案例点与可见卡片互通
- `frontend/src/i18n/locales/*.json` — 中英俄地图、图例、精度与市场边界文案
- `frontend/src/styles/components/_cases-page.scss` — 双层形状、触摸目标、焦点、信息面板与响应式布局
- `frontend/tests/case-center.test.mjs` — 点位数据、来源边界、可访问交互与无第三方依赖契约
- `ai-memories/memories/activeContext.md`、`ai-memories/memories/progress.md` — 完成状态与可复用结论

## 分步计划

- [x] Step 1: 添加失败测试，固定三项可绘制案例、四项市场覆盖、双层语义、稳定引用和来源边界。
- [x] Step 2: 建立地图数据与类型边界，拒绝未知案例、地点未注明案例及越界坐标。
- [x] Step 3: 实现本地 SVG 地图、原生按钮、图例、持久信息面板及案例详情/列表链接。
- [x] Step 4: 接入案例筛选并完成中英俄和 320–1440px 响应式样式。
- [x] Step 5: 运行类型检查、测试、根路径与子路径构建，更新任务和 Memory Bank 后提交。

## Debug Notes

> 开发中遇到的重大 Bug、卡点、设计变更**即时追加**到这里（带时间戳）。

- 2026-07-26 Issue 与 #9 数据复核确认：`south-africa-three-stage-cooling` 只证明客户来自南非，不能作为南非项目点；其案例卡保留，但地图已核实层必须排除。
- 2026-07-26 正式公司描述支持南非、澳大利亚、韩国、俄罗斯的设备供应/市场经验；这些点只能进入市场覆盖层，且不得携带案例标识或具体项目措辞。
- 2026-07-26 地图点位使用归一化 SVG 展示坐标而非经纬度，并在三语界面持续说明其仅是国家/省级代表位置；筛选会同步移除不可见案例点，避免“定位到可见卡片”链接失真。
- 2026-07-26 沙箱初始未安装前端依赖；`npm ci` 后类型检查、13 项测试、根路径构建和 `VITE_BASE=/v2/` 子路径构建全部通过。安装过程报告现有依赖树有 2 个 high severity audit 项，本任务未升级依赖或扩大范围。

## Lessons Learned

> 任务收尾时填写，供后续任务参考；重要结论应同步回 `ai-memories/memories/`。

- 地图展示坐标应与事实地理精度分离：坐标只负责在示意图上排布，公开文案和数据精度才定义可作出的地理声明。
- 同一国家可以同时存在已核实案例和市场覆盖，但必须用不同形状、独立焦点目标和不同详情语义展示，不能将覆盖陈述自动关联到案例。
- 原生按钮配合持久信息面板即可同时覆盖键盘、触摸和鼠标，无需地图 SDK 或专门的触摸事件。
