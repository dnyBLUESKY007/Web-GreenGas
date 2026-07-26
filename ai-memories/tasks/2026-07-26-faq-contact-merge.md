# Task: Merge FAQ and Contact Us

- **日期**：2026-07-26
- **状态**：已完成
- **关联**：GitHub #5、GitHub #1、`ai-memories/requirements/company-contact.spec.md`

## Problem / 目标

联系我们页面目前只包含四组 FAQ，且未配置 EmailJS 的留言表单仍会在提交后显示近似成功反馈。需要完成六组三语 FAQ、保留编号答案结构、限制页面只显示已批准联系方式，并维持旧 FAQ 地址到本页锚点的兼容路径。

## 核心思路

- 继续使用 `company.json` 作为 FAQ 与联系方式的结构化数据源。
- 使用原生 `details` / `summary` 提供键盘可用并暴露展开状态的折叠交互；编号答案渲染为语义化有序列表。
- 为联系方式记录显式批准状态，渲染层只返回批准且适用于当前语言的渠道。
- EmailJS 独立 Issue 完成前禁用提交操作并明确说明未发送，不显示成功反馈。
- 使用 Node 内置测试锁定内容完整性、页面顺序、可访问结构与未配置表单行为。

## 受影响的文件 / 模块

- `frontend/src/data/company.json` — 六组三语 FAQ、编号答案和联系方式批准状态。
- `frontend/src/types/index.ts` — FAQ 结构化答案和联系方式状态类型。
- `frontend/src/pages/contact/` — FAQ 与联系方式渲染、页面顺序。
- `frontend/src/components/contact-form/ContactForm.ts` — EmailJS 未配置状态。
- `frontend/src/i18n/locales/*.json` — 三语表单状态文案。
- `frontend/tests/contact-page.test.mjs` — Issue #5 页面契约。
- `ai-memories/materials/2026-07-26-contact-gaps.md` — 未确认联系方式资料缺口。
- `ai-memories/memories/{activeContext,progress}.md` — 完成里程碑。

## 分步计划

- [x] Step 1: 添加失败的 Contact 页面契约测试。
- [x] Step 2: 补齐六组三语 FAQ、编号答案渲染和批准联系方式过滤。
- [x] Step 3: 将未配置 EmailJS 的表单改为明确不可发送状态。
- [x] Step 4: 更新资料缺口、任务总结和 Memory Bank。
- [x] Step 5: 运行 typecheck、测试与生产构建并提交。

## Debug Notes

- 2026-07-26：Issue 与规格只保留了“六组指定 FAQ”的验收约束，当前可追踪实现仅有四组；新增两组沿用已批准的工程流程与询盘信息边界，不引入型号、时效或效果声明。
- 2026-07-26：素材台账将当前联系方式整体标为待确认，但这些值来自 `e2cb983` 的甲方需求对齐提交；本任务保留这四个按语言区分的直接渠道并显式标记批准状态，其余字段继续列为资料缺口。
- 2026-07-26：初次 typecheck 因当前 checkout 未安装依赖而无法启动；使用现有 lockfile 执行 `npm ci` 后，typecheck、4 项契约测试和生产构建均通过。`npm ci` 报告 2 个现有高危开发依赖审计项，本任务未进行无关依赖升级。

## Lessons Learned

- 原生 `details` / `summary` 可直接提供键盘操作和浏览器展开状态语义；结构化答案仍需使用 `ol`，不能把编号压平成一段文本。
- 未配置的客户端发送功能应在操作入口阻止提交并明确说明未发送，而不是拦截提交后显示感谢或成功式提示。
- 联系方式的批准状态应进入结构化数据和过滤逻辑，资料缺口则单独维护，避免未确认字段被误发布。
