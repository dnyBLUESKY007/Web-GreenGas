# Task: 合并 Sandcastle 发布候选资料缺口报告分支

- **日期**：2026-07-26
- **状态**：已完成
- **关联**：GitHub #15；`sandcastle/issue-15`；`ai-memories/memories/activeContext.md`

## Problem / 目标

将 `sandcastle/issue-15` 的发布候选与最终资料缺口报告合并到当前 `main`，保留此前已集成的全站回归结论，解决共享 Memory Bank 冲突，通过类型检查与完整测试，并关闭对应 GitHub issue。

## 核心思路

按要求使用 `git merge sandcastle/issue-15 --no-edit`。若共享记录冲突，合并保留 issue #14 的回归结果与 issue #15 的发布候选审计结论；验证成功后创建一个汇总提交，记录集成与验证结果。

## 受影响的文件 / 模块

- `ai-memories/materials/`、`ai-memories/releases/` — 最终资料缺口报告与发布候选记录
- `ai-memories/memories/` — 当前焦点和项目进度
- `ai-memories/tasks/` — 功能任务与本次集成任务记录
- `frontend/tests/release-candidate-report.test.mjs` — 发布候选报告契约测试

## 分步计划

- [x] Step 1: 合并 `sandcastle/issue-15` 并智能解决冲突
- [x] Step 2: 运行 `npm run typecheck` 与 `npm run test`，修复发现的问题
- [x] Step 3: 检查差异并创建单个汇总提交
- [x] Step 4: 使用指定评论关闭 GitHub #15
- [x] Step 5: 完成本任务记录并同步项目 Memory Bank

## Debug Notes

- 2026-07-26: `git merge sandcastle/issue-15 --no-edit` 直接快进到功能分支，无内容冲突；此前 issue #14 的回归记录和全部站点契约均保留。
- 2026-07-26: 在实际前端包 `frontend/` 执行要求的 `npm run typecheck` 与 `npm run test`，类型检查及全部 23 项测试通过。
- 2026-07-26: 以 `GH_REPO=dnyBLUESKY007/Web-GreenGas` 执行指定关闭命令，GitHub #15 已关闭并附 `Completed by Sandcastle` 评论。

## Lessons Learned

- 纯审计交付分支仍需运行完整应用验证，因为新增契约测试会加入组合测试集，也可能暴露此前记录与当前代码状态不一致。
- 快进合并不生成 merge commit；独立汇总提交应只包含集成任务记录和 Memory Bank 里程碑，避免改写功能分支的候选证据。
