# Task: 合并 Sandcastle 地图与行业分支

- **日期**：2026-07-26
- **状态**：已完成
- **关联**：GitHub issues #10、#7；`ai-memories/memories/activeContext.md`

## Problem / 目标

按指定顺序将 `sandcastle/issue-10` 和 `sandcastle/issue-7` 合并到当前分支，解决与已完成案例、产品、About、Contact、News 等功能的冲突，并在每次合并后通过类型检查与完整测试。最终创建一条汇总提交并关闭对应 GitHub issues。

## 核心思路

严格执行 `git merge <branch> --no-edit`。冲突解决以保留当前稳定页面与数据契约为前提，接入 #10 的案例双层世界地图和 #7 的行业应用页面；不接受旧分支基线对已完成功能的删除。每次合并后分别运行 `npm run typecheck` 与 `npm run test`，及时修复组合问题。

## 受影响的文件 / 模块

- `frontend/src/components/case-map/`、`frontend/src/pages/cases/` — 接入案例双层世界地图
- `frontend/src/pages/industries/`、`frontend/src/data/industries.json` — 接入行业应用页面
- `frontend/src/i18n/locales/`、`frontend/src/styles/`、`frontend/src/types/` — 合并共享文案、样式和类型
- `frontend/tests/` — 合并并执行案例地图和行业页面合同测试
- `ai-memories/` — 保留分支任务记录并同步当前里程碑
- Git history / GitHub issues — 生成汇总提交并关闭 #10、#7

## 分步计划

- [x] Step 1: 合并 #10，解决冲突并通过 typecheck/test
- [x] Step 2: 合并 #7，保留当前功能并通过 typecheck/test
- [x] Step 3: 审查最终状态，更新任务与项目记忆
- [x] Step 4: 创建汇总提交并关闭 GitHub issues #10、#7

## Debug Notes

> 开发中遇到的重大 Bug、卡点、设计变更**即时追加**到这里（带时间戳）。

- 2026-07-26 首次执行 #10 合并时遇到遗留的空 `.git/index.lock`；确认无其他 Git 进程后删除锁文件，重试后正常快进。
- 2026-07-26 #7 基于较早基线，与累计 Memory Bank、三语 locale 和样式入口冲突；解决时保留全部现有功能命名空间并追加行业页面内容。
- 2026-07-26 #7 自动合并在 `types/index.ts` 产生重复 `ContentStatus`，并保留了旧的列表页 query 链接；删除重复类型并改用稳定的 `/products/detail/`、`/cases/detail/` 路由。

## Lessons Learned

> 任务收尾时填写，供后续任务参考；重要结论应同步回 `ai-memories/memories/`。

- 较早页面分支应按功能增量合并，不能接受其相对当前基线显示的大量删除；共享 locale、Memory Bank 和入口样式必须累计保留。
- 合并通过不仅要求分支自身测试成功，还要校验其跨页链接仍符合后来建立的稳定路由契约。最终 TypeScript 检查与 14 项组合测试均通过。
