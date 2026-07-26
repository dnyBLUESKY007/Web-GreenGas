# Task: Website content and navigation restructure planning

- **日期**：2026-07-26
- **状态**：已完成规划，等待后续实现
- **关联**：`CONTEXT.md`、`ai-memories/requirements/website-restructure-prd.md`

## Problem / 目标

将现有 GREENGAS 多页静态网站重组为八个清晰的主导航栏目，补齐产品导航、行业应用、技术支持和案例中心，并按已确认来源重建首页、关于我们、新闻中心以及合并后的联系我们页面。

本任务只负责形成可持续维护的需求记录和可由后续 session 独立执行的 GitHub Issues，不在本任务内实施页面代码或生产发布。

## 核心思路

- 使用一份总纲 PRD 和四份分域规格统一范围与验收标准。
- 使用 `CONTEXT.md` 固化容易混淆的业务术语和内容状态。
- 将实现工作拆成单个 session 可完成的纵向 Issue，每个 Issue 同时覆盖数据、页面、三语、响应式和验收。
- 已核实内容与示例占位必须在数据和界面上可区分。
- 参考网站只用于布局与交互研究，不复制其图片、文案、参数或客户声明。
- 每个实现 session 完成后更新任务记录或当日总结，持续列出完成项、未完成项、占位项和待提供资料。

## 受影响的文件 / 模块

- `CONTEXT.md`：网站内容域术语与来源优先级。
- `ai-memories/requirements/`：总纲和四份分域规格。
- `ai-memories/tasks/2026-07-26-website-restructure-planning.md`：规划过程、Issue 索引和今日总结。
- GitHub Issues：父任务和 16 个后续执行任务。

## 分步计划

- [x] 盘点当前技术栈、页面、数据、旧站归档和压缩资料。
- [x] 核对日高、格灵旧站、锐劲特和三一日本等参考页面的信息结构。
- [x] 通过 grill-with-docs 明确内容状态、来源优先级、地图语义、页面层级和发布边界。
- [x] 确认需求文档采用“1 份总纲 + 4 份分域规格”。
- [x] 确认 16 个单 session 可执行的纵向 Issue 及其依赖关系。
- [x] 创建 GitHub 父 Issue 和 16 个执行 Issue，并在下方回填链接。
- [ ] 后续 session 按依赖顺序实现。
- [ ] 全部实现通过后生成发布候选并单独批准生产发布。

## 已确认决策

- 主导航固定为：首页、关于我们、产品导航、行业应用、技术支持、案例中心、新闻中心、联系我们。
- 浏览器标签页统一显示 `GREENGAS 格灵空调`。
- 商标贴近浏览器左边缘，导航最右侧重复“联系我们”按钮删除。
- 中文、英文和俄文同步提供；第一版英俄文允许机器翻译直接上线。
- 示例占位允许公开展示，但必须明确标识，不能伪装成真实型号、参数或项目事实。
- 案例地图区分“已核实案例点”和“市场覆盖点”。
- `/solutions/` 内容拆入产品导航和行业应用，旧地址保留兼容跳转。
- `/faq/` 合并至联系我们，旧地址在任意部署 base path 下均须跳转并定位到联系我们页面的 FAQ 区域。
- 技术资料公开下载文件托管于 OSS，仓库维护结构化索引和 URL。
- 产品第一版包含分类页和通用详情模板。
- 案例第一版包含地图、列表和通用详情页。
- EmailJS 作为独立阻塞 Issue，不计入本轮统一发布的必需 Issue；未配置时表单不得声称发送成功。
- 单个实现 Issue 不自动部署，全部集成验收后统一发布。
- 统一验收接缝为 `npm run build` 加浏览器页面行为验收，不新增测试框架。纳入本轮发布范围的实现 Issue 全部通过这两类检查后，才能创建统一发布任务。
- GitHub 原生 Issue dependencies 是唯一阻塞关系来源，不使用 `blocked` 标签或正文 `Blocked by` 段落表达阻塞状态。
- `ready-for-agent` / `ready-for-human` 只表达执行责任，不表达当前是否被阻塞。#2 至 #15 由 Agent 执行；父任务 #1、生产发布 #16 和 EmailJS 配置 #17 需要人工操作、批准或凭据。

## GitHub Issue 索引

- 父任务：[#1 Restructure the GREENGAS website](https://github.com/dnyBLUESKY007/Web-GreenGas/issues/1)
- [#2 建立素材清单与替换台账](https://github.com/dnyBLUESKY007/Web-GreenGas/issues/2)。依赖：无。
- [#3 重构全站导航、标签标题与旧路由](https://github.com/dnyBLUESKY007/Web-GreenGas/issues/3)。依赖：无。
- [#4 按正式公司描述重建关于我们](https://github.com/dnyBLUESKY007/Web-GreenGas/issues/4)。依赖：#2。
- [#5 合并常见问题与联系我们](https://github.com/dnyBLUESKY007/Web-GreenGas/issues/5)。依赖：#3。
- [#6 建立产品导航与通用产品详情模板](https://github.com/dnyBLUESKY007/Web-GreenGas/issues/6)。依赖：#2、#3。
- [#7 建立行业应用页面](https://github.com/dnyBLUESKY007/Web-GreenGas/issues/7)。依赖：#2、#3。
- [#8 建立技术支持资料库](https://github.com/dnyBLUESKY007/Web-GreenGas/issues/8)。依赖：#2、#3。
- [#9 建立案例列表与通用详情页](https://github.com/dnyBLUESKY007/Web-GreenGas/issues/9)。依赖：#2、#3。
- [#10 为案例中心增加双层世界地图](https://github.com/dnyBLUESKY007/Web-GreenGas/issues/10)。依赖：#9。
- [#11 对齐旧站新闻内容与新闻展示](https://github.com/dnyBLUESKY007/Web-GreenGas/issues/11)。依赖：#2、#3。
- [#12 建立合作公司 Logo 展示](https://github.com/dnyBLUESKY007/Web-GreenGas/issues/12)。依赖：#2。
- [#13 重新编排首页全部板块](https://github.com/dnyBLUESKY007/Web-GreenGas/issues/13)。依赖：#4、#6、#7、#8、#9、#11、#12。
- [#14 执行全站三语与响应式回归验收](https://github.com/dnyBLUESKY007/Web-GreenGas/issues/14)。依赖：#3 至 #13。
- [#15 生成发布候选与最终资料缺口报告](https://github.com/dnyBLUESKY007/Web-GreenGas/issues/15)。依赖：#14。
- [#16 统一部署已批准版本](https://github.com/dnyBLUESKY007/Web-GreenGas/issues/16)。依赖：#15 和明确发布授权。
- [#17 接入 EmailJS 留言发送](https://github.com/dnyBLUESKY007/Web-GreenGas/issues/17)。依赖：#5 和外部账号配置；不阻塞 #15、#16。

## Debug Notes

- 2026-07-26：规划时 `全资料.rar` 在 iCloud 路径上读取超时；随后已完整下载并迁移至 `ignored/source-archives/全资料.rar`，解压内容位于 `ignored/extracted/全资料/`。
- 2026-07-26：`dnyBLUESKY007/Web-GreenGas` 初始关闭了 Issues，用户随后已启用并经 `gh` 验证。
- 2026-07-26：仓库没有 `ready-for-agent` 标签，发布执行 Issue 前需创建。
- 2026-07-26：初始 Issue 使用正文依赖和 `blocked` 标签，Sandcastle 运行时又因未指定 `--repo` 而由 `gh` 默认查询 `Junble19768/Web-GreenGas`，导致 Planner 收到空数组。已将 #4 至 #17 迁移为 GitHub 原生 dependencies，删除 `blocked` 标签和正文依赖段落，并将 Sandcastle 本地查询固定到 `dnyBLUESKY007/Web-GreenGas`。
- 2026-07-26：Sandcastle 查询改用 REST API 的 `issue_dependencies_summary.blocked_by` 过滤原生未阻塞任务。确定性检查返回 `[2,3]`，与当前依赖图一致。

## Lessons Learned

- 当前代码已有旧站新闻和案例归档，后续应优先迁移可核实内容，而不是继续使用示例项目。
- 产品、行业、案例和技术支持虽然共享资料，但应保持不同的用户任务边界，避免重新形成含混的“解决方案”页面。
- 对缺失资料建立显式内容状态，比在页面中留下无法追踪的临时文案更利于后续替换。

## 2026-07-26 每日总结

### 今日完成

- 盘点现有 Vite MPA 架构、页面、导航、数据文件、旧站归档和压缩资料。
- 确认八项主导航及首页、关于我们、产品、行业、技术、案例、新闻、联系页面的目标结构。
- 确认三语、示例占位、案例地图、旧路由兼容、OSS 下载和统一发布策略。
- 完成一份总纲、四份分域规格和 16 个执行 Issue 的拆分设计。
- 确认 GitHub Issues 已在 `dnyBLUESKY007/Web-GreenGas` 启用。
- 将 Issue 阻塞关系迁移为 GitHub 原生 dependencies，并按执行责任完成 `ready-for-agent` / `ready-for-human` 分类。
- 修复 Sandcastle 查询错误仓库且不读取原生依赖的问题；当前可领取队列为 #2、#3。

### 验证结果

- 当前工作树在文档生成前为干净状态。
- GitHub Issues 功能已启用，当前没有既有 Issue。
- 现有项目构建命令为 `npm run build`，后续所有实现 Issue 均以此作为统一自动检查。

### 尚未完成

- 尚未实施页面代码改造。
- 尚未完成 #2 的素材清单和公开状态分类；三个压缩包的本地归档与解压已完成。
- 尚未上传技术支持公开文件到 OSS。
- 尚未接入 EmailJS 留言发送。
- 尚未执行生产发布。

### 占位内容

- 产品型号、参数、下载资料和部分产品图片允许使用带标识的示例占位。
- 缺少正式资料的案例和合作公司允许使用带标识的示例占位。
- 地图中只有市场描述、没有具体案例证据的国家使用“市场覆盖点”，不得显示为“已核实案例点”。

### 待提供资料

- 正式产品系列、产品型号、技术参数、选型表和产品图片。
- 可公开的技术手册、安装说明、维护资料和下载文件清单。
- 案例项目名称、行业、地点、设备、摘要、正文和图片。
- 合作公司正式名称、Logo 文件和公开展示许可。
- 公司团队、厂房、生产、检测和资质证书高清素材。
- 完整且最终确认的公司地址、座机、手机、邮箱、微信或 WhatsApp 信息。
- **待确认：公司描述中的 `ISO140001` 是否应为 `ISO14001`。**

### 下一步

- 发布父 Issue 和 16 个执行 Issue。
- 后续 session 优先完成素材清单与全站导航两个无阻塞任务。
