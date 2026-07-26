# Task: 全局壳代码审查整理

- **日期**：2026-07-26
- **状态**：已完成
- **关联**：GitHub #3；`ai-memories/tasks/2026-07-26-global-navigation-legacy-routes.md`

## Problem / 目标

审查 GitHub #3 的实现，在不改变导航、路由、布局、焦点行为或页面输出的前提下，清理已经失效的内部契约并提高控制流可读性。

## 核心思路

仅处理可以证明为不可达的旧翻译键、描述显然代码的注释，以及含义不明确的布尔控制参数。保留现有源代码契约测试和所有用户可见行为，不借审查扩大为功能修复或内容调整。

## 受影响的文件 / 模块

- `frontend/src/components/navbar/Navbar.ts` — 明确 Escape 关闭并恢复焦点的控制流
- `frontend/src/pages/contact/index.ts` — 删除重复描述 DOM 构造的注释
- `frontend/src/i18n/locales/*.json` — 删除标题统一和 FAQ 内嵌后不可达的旧键
- `frontend/tests/global-shell.test.mjs` — 同步焦点恢复契约的可读名称

## 分步计划

- [x] Step 1: 确认待删除翻译键在源代码中无引用。
- [x] Step 2: 完成行为不变的导航控制流与文案资源整理。
- [x] Step 3: 运行测试、类型检查、生产构建和差异检查。
- [x] Step 4: 记录结论并提交独立审查整理 commit。

## Debug Notes

> 开发中遇到的重大 Bug、卡点、设计变更**即时追加**到这里（带时间戳）。

- 2026-07-26 审查中发现的响应式面板边界和占位内容标识涉及行为或页面输出，不属于本次“保持精确功能”整理范围，因此未修改。
- 2026-07-26 用户引用的 `.sandcastle/CODING_STANDARDS.md` 在当前工作区不存在；实现遵循仓库根 `AGENTS.md` 与既有 TypeScript 风格。

## Lessons Learned

> 任务收尾时填写，供后续任务参考；重要结论应同步回 `ai-memories/memories/`。

- 页面元数据契约从按页标题改为固定品牌标题时，应同步删除三语资源中的旧 `meta.*.title` 键，避免资源文件继续表达已失效的能力。
- 对可访问性交互，命名明确的 `closePanelAndRestoreFocus()` 比布尔参数 `closePanel(true)` 更容易在审查中确认意图，同时保持相同控制流。
