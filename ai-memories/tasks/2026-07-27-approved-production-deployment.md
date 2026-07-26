# Task: Deploy the approved release candidate to production

- **日期**：2026-07-27
- **状态**：已完成
- **关联**：GitHub #1、GitHub #16、`ai-memories/releases/2026-07-26-issue-15-rc.md`

## Problem / 目标

Issue #2-#15 已完成，发布负责人已明确接受候选中披露的资料、OSS 图片、ISO 编号和浏览器截图缺口。需要将与 Issue #15 候选应用输入一致的 `main` 生产构建统一部署到现有 Ubuntu/Nginx 站点，完成线上验收并记录可用回滚来源。

## 核心思路

部署前重新执行锁文件安装、类型检查、测试和根路径生产构建，并下载当前线上 `dist` 作为本次操作的临时回滚产物。使用现有 `scripts/deploy.sh` 和临时 SSH agent 发布到 `root@8.134.94.247:/var/www/corp/dist`，不修改无关服务器配置。只有 Nginx、HTTP、八项导航路由、静态资源和三语契约全部通过后才关闭 #16 和父任务 #1。

本次批准允许保留最终资料报告中已披露的 25 个 OSS 图片 404、示例/待替换内容、`ISO140001` 待确认项和新一轮五宽度截图缺口；部署不表示这些缺口已经解决。EmailJS #17 是独立非阻塞任务。

## 受影响的文件 / 模块

- `frontend/dist/` — 按当前锁文件重新生成并部署，不纳入 Git
- `ai-memories/releases/2026-07-27-issue-16-production.md` — 记录生产发布时间、候选提交、验证和回滚依据
- `ai-memories/memories/activeContext.md` — 更新当前发布状态和下一步
- `ai-memories/memories/progress.md` — 记录生产发布里程碑
- `ai-memories/tasks/2026-07-27-approved-production-deployment.md` — 跟踪计划、发现与结论

## 分步计划

- [x] Step 1: 确认工作区、候选应用输入和发布授权。
- [x] Step 2: 执行 `npm ci`、类型检查、测试和根路径生产构建。
- [x] Step 3: 下载当前线上 `dist`，生成临时回滚归档和摘要。
- [x] Step 4: 使用现有部署脚本发布到生产服务器。
- [x] Step 5: 验证 Nginx、HTTP、八项导航路由、静态资源和三语契约。
- [x] Step 6: 记录结果、更新项目记忆、提交记录并关闭 GitHub #16 与 #1。

## Debug Notes

> 开发中遇到的重大 Bug、卡点、设计变更**即时追加**到这里（带时间戳）。

- 2026-07-27: 历史 SSH alias `web-server` 在当前主机未配置；发布负责人提供 `8.134.94.247` 和仓库上一级目录中的 PEM 私钥。只读预检确认私钥权限为 `600`，Nginx 配置有效、服务 active、服务器本地 HTTP 返回 200。
- 2026-07-27: 部署前以临时目录保留原线上 `dist`，归档 SHA-256 为 `5f8e79ee7ec0bcc36c02423445a4b2045600ecbece7d06dbebb2c199bcb3aa3d`。
- 2026-07-27: 现有脚本部署成功；Nginx 检查/reload、服务器本地健康检查、八项公网路由和核心资源均通过。线上 46 个文件与本地构建的聚合 SHA-256 同为 `714690c65c35d8b0234749629ada4fc40f2925053ec47532c94a97aef7b2d143`。
- 2026-07-27: 收尾审查发现关闭 issue 被提前勾选、活动上下文残留旧状态、回滚包位于临时目录及线上三语证据不足。关闭前已撤回完成标记，将回滚包转存到 `ignored/deployment-rollbacks/`，并用 Headless Chrome 在生产站点验证英中俄切换。
- 2026-07-27: 线上构建使用 Issue #15 相同的确定性 GNU tar 命令得到根候选 SHA-256 `0ff5b44a3f07eaf09035949942f8f6e1f4a6c4558e88b5f71ce042c233b5cff5`，与批准记录完全一致。

## Lessons Learned

> 任务收尾时填写，供后续任务参考；重要结论应同步回 `ai-memories/memories/`。

- 替换式静态部署必须在删除远端目录前保留一份可验证的当前线上产物，尤其是在服务器端备份暂时禁用时。
- 比较按路径排序的逐文件 SHA-256 聚合值，可以确认上传结果与已验证的本地构建逐字节一致，而不依赖 tar 实现或文件元数据。
