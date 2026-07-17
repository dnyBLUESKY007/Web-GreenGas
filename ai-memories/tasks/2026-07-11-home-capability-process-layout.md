# Task: Home capability process layout

- **日期**：2026-07-11
- **状态**：已完成
- **关联**：`.cursor/memories/activeContext.md`、`.cursor/memories/systemPatterns.md`

## Problem / 目标

将首页「工程核心能力」模块从当前的深色环形流程重构为用户提供参考图中的浅色横向工程流程：居中标题、三项数据、五张依次连接的流程卡片。每张卡片暂以清晰的图片占位区呈现，方便后续替换为真实工程素材。

## 核心思路

保留现有 `company.json` 的工作流和统计数据、`createCapabilityBand()` 的调用方式以及多语言文案。仅替换组件内部 DOM 和对应 SCSS，不引入框架或外部资源。图片暂采用本地 CSS 占位容器，不配置不存在的 CDN 文件，避免产生失效请求；真实素材到位后可在同一媒体区域接入。

移动端改为纵向流程卡片，隐藏横向连接箭头，保证内容可读；桌面端保持参考图的五列横向结构。

## 受影响的文件 / 模块

- `frontend/src/components/capability-band/CapabilityBand.ts` — 重建能力区的结构和流程卡片。
- `frontend/src/styles/components/_capability-band.scss` — 实现浅色背景、统计栏、流程卡片、连接器及响应式布局。
- `frontend/src/styles/layout/_home-screen.scss` — 如实际内容高度需要，调整能力区的视口高度约束。
- `.cursor/memories/activeContext.md` — 完成后更新当前视觉审阅进度。

## 分步计划

- [x] Step 1: 审阅当前能力模块、数据模型和主页高度约束，确定可复用的数据及布局边界。
- [x] Step 2: 重写 `CapabilityBand` 为统计栏与五步流程卡片，添加语义化图片占位区。
- [x] Step 3: 编写桌面五列与移动纵向布局样式，并控制连接器、卡片媒体区和轻量背景装饰。
- [x] Step 4: 运行前端构建与静态检查，修正发现的问题。
- [x] Step 5: 更新任务记录与 active context；Git 提交留待用户明确要求时执行。

## Debug Notes

> 开发中遇到的重大 Bug、卡点、设计变更**即时追加**到这里（带时间戳）。

- 2026-07-11 12:03: 参考图为桌面五列横向流程；真实工程图片尚未提供，决定先使用不发起网络请求的 CSS 占位媒体区。
- 2026-07-11 12:08: `npm run build`（TypeScript + Vite）通过；编辑文件无 IDE lint 错误。

## Lessons Learned

> 任务收尾时填写，供后续任务参考；重要结论应同步回 `.cursor/memories/`。

- 图片占位区应保持在组件结构中，真实工程图片到位后仅需替换媒体区内容，不影响流程卡片和响应式布局。
