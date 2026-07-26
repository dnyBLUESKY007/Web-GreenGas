# Task: 合并 Sandcastle 首页重编排分支

- **日期**：2026-07-26
- **状态**：已完成
- **关联**：GitHub #13；`sandcastle/issue-13`；`ai-memories/memories/activeContext.md`

## Problem / 目标

将 `sandcastle/issue-13` 的首页全部板块重编排合并到当前 `main`，保留此前已集成的全站页面、共享数据与路由契约，解决冲突，通过类型检查与完整测试，并关闭对应 GitHub issue。

## 核心思路

按要求使用 `git merge sandcastle/issue-13 --no-edit`。冲突逐项比较当前分支与功能分支：首页布局和预览组件采用功能分支的目标实现，共享 locale、类型、样式入口及 Memory Bank 内容则合并保留双方有效变更；验证成功后创建一个汇总提交。

## 受影响的文件 / 模块

- `frontend/src/pages/home/`、`frontend/src/components/` — 首页编排与各板块预览组件
- `frontend/src/i18n/`、`frontend/src/styles/` — 三语文案、共享翻译配置与首页样式
- `frontend/tests/home-page.test.mjs` — 首页契约测试
- `ai-memories/` — 功能分支记录与本次集成记录

## 分步计划

- [x] Step 1: 合并 `sandcastle/issue-13` 并智能解决冲突
- [x] Step 2: 运行 `npm run typecheck` 与 `npm run test`，修复发现的问题
- [x] Step 3: 检查差异并创建单个汇总提交
- [x] Step 4: 使用指定评论关闭 GitHub #13
- [x] Step 5: 完成本任务记录并同步项目 Memory Bank

## Debug Notes

- 2026-07-26: `git merge sandcastle/issue-13 --no-edit` 直接快进到功能分支，无内容冲突；此前集成的共享页面和路由契约均保留。
- 2026-07-26: 根目录 `package.json` 只提供 Sandcastle 脚本；在实际前端包 `frontend/` 执行要求的 `npm run typecheck` 与 `npm run test`，类型检查及全部 17 项测试通过。
- 2026-07-26: `gh` 可能从 `upstream` 推断错误仓库，因此以 `GH_REPO=dnyBLUESKY007/Web-GreenGas` 执行指定关闭命令；GitHub #13 已关闭并附 `Completed by Sandcastle` 评论。

## Lessons Learned

- 当功能分支是当前分支的直接后继时，要求的 merge 可能成为快进而不生成 merge commit；仍应通过独立集成记录和汇总提交保留验证与关闭 issue 的审计轨迹。
- 多远端仓库中的 GitHub issue 操作应显式指定目标仓库，避免 `gh` 根据错误远端推断 issue 所在位置。
