# Task: 建立合作公司 Logo 展示

- **日期**：2026-07-26
- **状态**：已完成
- **关联**：GitHub #12；父 PRD #1；`ai-memories/requirements/website-restructure-prd.md`；`ai-memories/requirements/global-home.spec.md`

## Problem / 目标

现有 `ClientLogos` 仅把六个行业名称渲染为文本卡片，既不是合作公司 Logo 数据模型，也没有内容状态、图片替代文本或资料审批边界。当前素材盘点确认没有获准公开的合作公司名称和 Logo，因此本任务需先建立可供首页复用的安全展示结构，不虚构合作关系。

## 核心思路

采用静态分组网格而非自动轮播，避免引入无必要的暂停和键盘控制。结构化数据显式记录 `pending-replacement` 状态；在正式资料获批前只展示中性占位卡和可见状态标签。组件预留经 OSS 发布的 Logo 图片字段并要求三语替代文本，不接受任意外链。

## 受影响的文件 / 模块

- `frontend/src/data/clients.json` — 改为合作公司分组、状态和可选 Logo 元数据。
- `frontend/src/types/index.ts` — 定义合作公司与 Logo 数据契约。
- `frontend/src/components/client-logos/ClientLogos.ts` — 渲染可复用、可访问的分组 Logo 网格。
- `frontend/src/styles/components/_client-logos.scss` — 三语与代表性断点下的响应式样式。
- `frontend/src/i18n/locales/*.json` — 合作展示和占位状态三语文案。
- `frontend/tests/partner-logos.test.mjs` — 验证数据状态、来源边界、三语与组件契约。
- `ai-memories/materials/2026-07-26-partner-logo-inventory.md` — Logo 缺口和获批替换要求。
- `ai-memories/materials/2026-07-26-material-summary.md` — 当日实施状态。
- `ai-memories/memories/activeContext.md`、`progress.md` — 记录完成状态和后续资料依赖。

## 分步计划

- [x] Step 1: 以失败契约测试固定结构化状态、禁止热链、三语标识和可访问图片要求。
- [x] Step 2: 实现合作公司数据契约、分组网格组件、三语文案和响应式样式。
- [x] Step 3: 更新 Logo 资料清单、当日总结与 Memory Bank。
- [x] Step 4: 运行 typecheck、测试和生产构建并提交。

## Debug Notes

- 2026-07-26 现有素材台账明确标记 `partner-logos` 为 `pending-replacement` / `unavailable`；Git 忽略素材目录复查也未发现合作公司 Logo 文件，因此本轮不能发布真实合作名称或图片。
- 2026-07-26 首轮 typecheck/build 因本地缺少 `node_modules` 报 `tsc: not found`；按 lockfile 执行 `npm install` 后，typecheck、4 项测试和生产构建均通过。安装报告现有依赖树有 2 项 high severity audit 告警，本任务未越界升级依赖。

## Lessons Learned

- 对尚未获批的关系型内容，中性 `pending-replacement` 展示位比虚构示例公司更安全；状态必须同时进入结构化数据和可见 UI。
- 静态响应式网格满足当前内容量且避免轮播的暂停、焦点和键盘控制成本；组件仍可直接接入后续获批 OSS Logo。
