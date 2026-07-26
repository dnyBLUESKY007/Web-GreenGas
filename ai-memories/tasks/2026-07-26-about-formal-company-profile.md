# Task: 按正式公司描述重建关于我们

- **日期**：2026-07-26
- **状态**：已完成
- **关联**：GitHub #4、父 PRD #1、`ai-memories/requirements/company-contact.spec.md`、`templates/previous/company/发展历程.md`

## Problem / 目标

当前 About 页面仅展示两段简化介绍，未完整表达已批准的四段公司描述、技术/节能/质量/服务管理理念、产品范围、重点行业和国内外经验。现有公司、团队、厂房及证书图片尚未获得公开批准，不能作为已核实证据直接展示。

## 核心思路

以正式中文来源逐段建立三语结构化内容，保留待确认的 `ISO140001` 原文，并将管理理念、产品范围、行业和市场经验组织为可扫描的页面区块。市场覆盖只按正式描述呈现，不生成未经核实的具体案例。尚未批准的公司媒体使用明确的“待资料替换”占位，保留团队、发展历程、资质和行业证据入口。

## 受影响的文件 / 模块

- `frontend/src/data/company.json` — 四段正式描述、三语翻译、管理理念、产品/行业/经验数据
- `frontend/src/types/index.ts` — About 结构化数据类型
- `frontend/src/pages/about/index.ts` — About 页面信息架构与明确占位
- `frontend/src/styles/components/_about-page.scss` — 三语和代表性断点布局
- `frontend/src/i18n/locales/*.json` — About 区块和占位文案
- `frontend/tests/about-page.test.mjs` — 正式内容与展示边界契约
- `ai-memories/memories/activeContext.md`、`progress.md` — 当日总结与资料缺口

## 分步计划

- [x] Step 1: 添加失败的 About 内容与页面边界契约测试。
- [x] Step 2: 录入完整三语正式描述和配套结构化公司数据。
- [x] Step 3: 重建 About 页面结构、明确媒体占位并完成响应式样式。
- [x] Step 4: 运行 typecheck、测试和生产构建，审查并重构。
- [x] Step 5: 更新任务与 Memory Bank 记录并提交。

## Debug Notes

- 2026-07-26 现有素材台账将公司、团队、厂房和证书图片统一标记为 `review-required`；本任务不把“已存在于 OSS”误当作公开批准，改用明确占位。
- 2026-07-26 首次 typecheck 因当前工作区未安装依赖而报 `tsc: not found`；按 `package-lock.json` 执行 `npm ci` 后，typecheck、测试与生产构建均通过。安装审计报告 2 个既有高危依赖问题，本任务未改锁文件或扩大范围处理。
- 2026-07-26 收尾审查发现资质子页仍直接展示待审批证书并使用“国际权威认证”表述；增加公开状态门控和待替换占位，同时移除 About metadata 中无正式来源支持的“15+ 年”描述。

## Lessons Learned

- 正式公司文案应以结构化三语段落保存，并用契约测试直接对照最高优先级中文来源，防止后续润色丢段或静默修正编号。
- OSS 中已有图片并不等于获准公开；页面应由显式公开状态决定渲染真实媒体还是待替换占位。
- 市场覆盖和设备供应经验必须附带边界说明，不能自动转化为可公开的具名案例或精确案例点。
