# Task: 重构全站导航、标签标题与旧路由

- **日期**：2026-07-26
- **状态**：已完成
- **关联**：GitHub #3；父 PRD #1；`ai-memories/requirements/global-home.spec.md`

## Problem / 目标

当前全站仍使用六项导航、重复的桌面联系我们按钮和页面级浏览器标题；旧 `/solutions/` 与 `/faq/` 入口也尚未迁移到新版信息架构。需要建立八项全局导航及稳定的新路由契约，并确保旧入口在根路径和 `VITE_BASE` 子路径部署下可继续使用。

## 核心思路

采用 `/products/`、`/industries/`、`/support/`、`/cases/` 作为四个新增主目的地的简洁稳定路径。将现有 Solutions 页面迁至 Product Navigation，给其余下游页面提供可访问的轻量路由壳；旧入口使用 `basePath()` 与 `location.replace()` 跳转。FAQ 先复用现有结构化数据嵌入 Contact 并建立 `#faq` 锚点，最终六问内容仍由依赖本任务的 #5 完成。

## 受影响的文件 / 模块

- `frontend/src/config/`、`frontend/src/types/`、`frontend/src/i18n/locales/` — 八项导航、页面元数据与三语标签
- `frontend/src/components/navbar/`、`frontend/src/styles/` — 桌面布局、品牌安全边距与移动键盘焦点
- `frontend/{products,industries,support,cases,solutions,faq,contact}/`、`frontend/vite.config.ts` — 新路由入口、旧入口跳转与 FAQ 锚点
- `frontend/tests/`、`frontend/package.json` — 无新增依赖的全局壳契约测试
- `ai-memories/memories/` — 当日完成项、路由决策与后续内容边界

## 分步计划

- [x] Step 1: 添加失败的全局壳契约测试，固定导航顺序、标题和兼容路由要求。
- [x] Step 2: 实现八项三语导航、桌面布局和移动菜单键盘焦点行为。
- [x] Step 3: 统一静态与运行时标签标题，建立新路由与 base-path-safe 旧入口跳转。
- [x] Step 4: 将现有 FAQ 嵌入 Contact 的 `#faq` 锚点并清理旧内部链接。
- [x] Step 5: 运行 typecheck、test、根路径及子路径 build，完成响应式检查并更新记忆。
- [x] Step 6: 审查差异并提交仅属于 GitHub #3 的变更。

## Debug Notes

- 2026-07-26 现有仓库没有 `npm test` 或测试框架；按 PRD 不引入浏览器测试框架，使用 Node 内置测试运行器验证构建入口与源代码中的公共路由契约。
- 2026-07-26 PRD 未规定新增页面 slug；采用短且常规的 `/products/`、`/industries/`、`/support/`、`/cases/`，供下游 #6-#9 作为稳定契约。
- 2026-07-26 八项俄语标签在原 1024px 桌面断点无法可靠容纳；导航在 1344px 以下使用现有移动操作坞，在 1440px 使用放大的完整桌面导航，覆盖要求中的各代表宽度而不缩小俄语文字。
- 2026-07-26 环境没有可用 Chromium/Firefox，未执行截图级浏览器检查；Node 契约测试覆盖三语标签、断点、焦点恢复、标题和路由，根路径与 `/greengas-preview/` 生产构建均通过。
- 2026-07-26 `npm ci` 报告现有依赖树有 2 个 high severity audit findings；本任务未擅自升级构建依赖。
- 2026-07-26 最终审计发现 1344px 以上隐藏整个操作坞会同时隐藏唯一的语言切换入口；桌面端现仅保留语言按钮，隐藏移动菜单和重复的回顶按钮。

## Lessons Learned

- 对超出中型视口宽度预算的多语言主导航，保留可访问的移动模式比压缩字体或允许溢出更稳健。
- 兼容入口应保留为独立 Vite MPA input，并在运行时通过 `basePath()` 生成目标；这样根路径和子路径构建使用同一实现。
- 下游内容页尚未实施时，应先提供明确的轻量路由壳，避免全局导航发布死链，同时不越界实现后续 Issue 内容。
- 响应式隐藏组合控件时应逐项区分移动专属操作，避免随容器一起隐藏跨端必需功能。
