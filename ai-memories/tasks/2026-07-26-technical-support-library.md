# Task: 建立技术支持资料库

- **日期**：2026-07-26
- **状态**：已完成
- **关联**：GitHub #8；父 PRD #1；`ai-memories/requirements/content-centers.spec.md`；`ai-memories/materials/2026-07-26-material-ledger.csv`

## Problem / 目标

将 `/support/` 从路由占位页改为可维护的三语技术支持资料库，覆盖技术手册、产品样本、安装、调试、维护、故障、售前选型和售后服务分类，并展示标题、分类、关联产品、语言、文件类型、版本或日期及下载状态。当前素材盘点没有已批准且已上传 OSS 的技术文件，因此首版必须明确呈现空状态和未就绪状态，不能生成断链或将归档存在误作公开许可。

## 核心思路

使用 JSON 保存分类和资料元数据，由独立 Support 页面渲染分类筛选、资料条目与空状态。数据层明确区分内容状态和公开状态；仅 `approved` 且具有 HTTPS OSS URL 的条目渲染下载链接。以可见的示例条目验证页面框架，但不提供虚假下载；其余分类根据当前真实盘点显示暂无可公开资料。

## 受影响的文件 / 模块

- `frontend/src/data/technical-support.json` — 技术资料分类与状态化条目
- `frontend/src/pages/support/index.ts` — 三语筛选、卡片、空状态与安全下载渲染
- `frontend/src/styles/components/_support-page.scss` — 响应式资料库布局
- `frontend/src/i18n/locales/*.json` — 中英俄支持页文案
- `frontend/support/index.html` — 切换到 Support 独立入口
- `frontend/tests/technical-support.test.mjs` — 分类、元数据、公开下载和页面接线契约
- `ai-memories/materials/2026-07-26-material-summary.md` — 当日未公开资料清单更新
- `ai-memories/memories/activeContext.md`、`progress.md` — 里程碑记录

## 分步计划

- [x] Step 1: 先添加失败的技术支持数据与页面契约测试。
- [x] Step 2: 创建状态化 JSON 数据、类型和独立 Support 页面，接入三语与分类筛选。
- [x] Step 3: 添加 320–1440px 可用的响应式样式和安全下载状态。
- [x] Step 4: 更新当日资料总结、任务记录和 Memory Bank。
- [x] Step 5: 运行 typecheck、测试和生产构建，审查差异后提交。

## Debug Notes

> 开发中遇到的重大 Bug、卡点、设计变更**即时追加**到这里（带时间戳）。

- 2026-07-26: GitHub 默认仓库查询无法解析 #8；根据项目上下文改为显式查询 `dnyBLUESKY007/Web-GreenGas`，确认父 PRD 为 #1。
- 2026-07-26: 素材台账和已挂载的忽略目录均已核对；当前不存在获批且具有 OSS URL 的技术下载，因此页面首版只提供明确标识的示例条目和不可下载状态。
- 2026-07-26: 完成实现后审查未发现高严重度问题；补充独立的 OSS 可访问性核验状态，并在筛选重渲染后恢复按钮焦点、为结果区添加 live region。

## Lessons Learned

> 任务收尾时填写，供后续任务参考；重要结论应同步回 `ai-memories/memories/`。

- 公开状态与文件可访问状态必须独立记录；只有二者均确认且 URL 通过 HTTPS OSS 域名校验时才能生成下载链接。
- 当真实资料尚未获批时，状态化空分类和不可下载的示例条目可以完成信息架构，同时避免将归档文件误作公开内容。
- 分类筛选重建 DOM 时需恢复触发按钮焦点，并让结果区域通过 live region 通知辅助技术。
