# Task: 合并 Sandcastle 内容分支

- **日期**：2026-07-26
- **状态**：已完成
- **关联**：GitHub issues #4、#5、#6、#9、#11、#12；`ai-memories/memories/activeContext.md`

## Problem / 目标

按指定顺序将 `sandcastle/issue-12`、`sandcastle/issue-11`、`sandcastle/issue-9`、`sandcastle/issue-6`、`sandcastle/issue-5`、`sandcastle/issue-4` 合并到当前分支，解决共享数据、类型、样式、翻译和项目记忆文件中的冲突，并在每次合并后通过类型检查与测试。最终建立一条汇总提交并关闭对应 GitHub issues。

## 核心思路

严格使用用户指定的 `git merge <branch> --no-edit` 顺序。冲突解决以各分支新增功能都被保留、现有稳定路由契约不回退、JSON 数据与 TypeScript 类型一致、分支专属合同测试全部通过为准。每次合并完成后运行 `npm run typecheck` 与 `npm run test`，避免累积问题到后续分支。

## 受影响的文件 / 模块

- `frontend/src/` — 合并合作方 Logo、新闻、案例、产品、联系页 FAQ 和关于页功能
- `frontend/tests/` — 合并并执行各功能合同测试
- `frontend/vite.config.ts` — 合并新增详情页入口
- `ai-memories/` — 保留各分支任务记录并同步当前里程碑
- Git history / GitHub issues — 生成合并历史、汇总提交并关闭 #4、#5、#6、#9、#11、#12

## 分步计划

- [x] Step 1: 依次合并六个分支，逐次解决冲突
- [x] Step 2: 每次合并后运行 typecheck 和完整测试并修复失败
- [x] Step 3: 审查最终状态和差异，更新任务与项目记忆
- [x] Step 4: 创建单条汇总提交并关闭六个 GitHub issues

## Debug Notes

> 开发中遇到的重大 Bug、卡点、设计变更**即时追加**到这里（带时间戳）。

- 2026-07-26 合并 #11、#9、#6、#5、#4 时，`activeContext.md` 与 `progress.md` 均因各分支追加同一里程碑区而冲突；解决方式为保留全部独立里程碑并更新累计状态。
- 2026-07-26 合并 #6 时，三语 locale 的合作公司文案与产品文案位于同一冲突块；保留 #12 的待批准合作公司契约，同时加入完整产品键。
- 2026-07-26 合并 #4 时，三语 locale 的 About/合作公司/证书文案冲突；保留 #12 的合作公司语义、#6 的产品键和 #4 更准确的证书待审批状态，并加入 About 新键。
- 2026-07-26 `gh issue close` 默认选择了 `upstream` 的 `Junble19768/Web-GreenGas`，该仓库无对应 issues；显式指定 `--repo dnyBLUESKY007/Web-GreenGas` 后成功关闭全部六项。

## Lessons Learned

> 任务收尾时填写，供后续任务参考；重要结论应同步回 `ai-memories/memories/`。

- 并行内容分支会频繁触碰扁平 locale JSON 和累计 Memory Bank 文件；冲突解决必须合并功能命名空间与里程碑，而不能直接选择 ours/theirs。
- 每个分支自带的合同测试能有效验证跨分支手工合并未丢失路由、数据状态或文案契约。最终组合状态通过 TypeScript 检查和 12 项测试。
