# Task: 合并 Sandcastle 技术支持资料库分支

- **日期**：2026-07-26
- **状态**：已完成
- **关联**：GitHub #8；`sandcastle/issue-8`；`ai-memories/memories/activeContext.md`

## Problem / 目标

将 `sandcastle/issue-8` 的技术支持资料库实现合并到当前 `main`，在保留此前已集成页面和共享契约的前提下解决冲突，通过类型检查与完整测试，并关闭对应 GitHub issue。

## 核心思路

按要求使用 `git merge sandcastle/issue-8 --no-edit`。冲突逐项比较当前分支与功能分支，新增支持资料库能力取功能分支，共享 locale、类型、路由及 Memory Bank 内容则合并保留双方有效变更；验证成功后创建一个汇总提交。

## 受影响的文件 / 模块

- `frontend/src/pages/support/`、`frontend/src/data/technical-support.json` — 技术支持资料库页面与数据
- `frontend/src/i18n/locales/`、`frontend/src/types/index.ts` — 三语文案与共享类型
- `frontend/src/styles/`、`frontend/tests/` — 页面样式与契约测试
- `ai-memories/` — 功能分支记录与本次集成记录

## 分步计划

- [x] Step 1: 合并 `sandcastle/issue-8` 并智能解决冲突
- [x] Step 2: 运行 `npm run typecheck` 与 `npm run test`，修复发现的问题
- [x] Step 3: 检查差异并创建单个汇总提交
- [x] Step 4: 使用指定评论关闭 GitHub #8
- [x] Step 5: 完成本任务记录并同步项目 Memory Bank

## Debug Notes

- 2026-07-26: 合并前 `gh issue view 8` 无法在当前推断仓库中解析 issue；本地合并验证后需确认远端仓库目标再关闭。
- 2026-07-26: 七处冲突均为共享聚合文件。locale 与 SCSS 保留既有 Cases/Industries 内容并追加 Support；三个目的地已有独立入口，因此旧 placeholder 页面集合清空；Memory Bank 累积保留全部里程碑。
- 2026-07-26: 根目录 `package.json` 不提供验证脚本；在实际前端包 `frontend/` 执行相同的 `npm run typecheck` 与 `npm run test`，类型检查及全部 15 项测试通过。
- 2026-07-26: `gh` 默认推断到 `upstream`，通过 `GH_REPO=dnyBLUESKY007/Web-GreenGas` 对 `origin` 执行指定关闭命令，GitHub #8 已关闭并附 `Completed by Sandcastle` 评论。

## Lessons Learned

- 多远端仓库中 `gh` 的默认推断可能不同于功能 Issue 所在仓库；执行 Issue 操作前应核对 `origin` 与 `gh repo view`，必要时用 `GH_REPO` 明确目标。
- 新内容分支与已实现页面发生 placeholder 列表冲突时，应以实际 HTML 入口为准；所有目的地已有独立入口后，不应保留会回退页面的占位标识。
