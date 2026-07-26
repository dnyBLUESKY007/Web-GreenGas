# GREENGAS Issue 16 Production Deployment

- **发布时间：** 2026-07-27 01:47 CST（2026-07-26 17:47 UTC）
- **源码提交：** `d47c49119caf977095c8abee367e19693d5188a2`
- **应用候选输入：** `411bb7badb198e9a6d7ddb61aa7eb2128d25eb6b`
- **部署目标：** `root@8.134.94.247:/var/www/corp/dist`
- **发布状态：** 成功

## 发布授权与边界

发布负责人在 2026-07-27 当前协作会话中选择“接受并发布”，接受最终资料报告已经披露的 25 个 OSS 图片 404、示例/待替换内容、`ISO140001` 待确认项和新一轮五宽度截图缺口；在计划列明部署步骤、目标和回滚方案后以“执行”明确授权 GitHub #16 生产操作。部署不表示这些缺口已经解决；EmailJS 继续由独立 GitHub #17 跟踪。

`d47c491` 相对 Issue #15 记录的集成应用源码提交只增加候选测试、报告和记忆记录，没有改变应用构建输入。

## 部署前验证

| 检查 | 结果 |
|---|---|
| `npm ci` | 通过；按锁文件安装 25 个包 |
| `npm run typecheck` | 通过 |
| `npm run test` | 23/23 通过 |
| `npm run build` | 通过；生成 46 个生产文件 |
| 依赖审计 | 保留候选已披露的 2 项高危传递性开发依赖告警 |

## 部署与线上验收

使用现有 `scripts/deploy.sh --skip-build` 替换远端 `dist`、上传本地验证后的生产构建、规范文件权限，并执行 Nginx 配置检查与 reload。服务器本地健康检查返回 HTTP 200。

| 线上检查 | 结果 |
|---|---|
| `/` | HTTP 200 |
| `/about/` | HTTP 200 |
| `/products/` | HTTP 200 |
| `/industries/` | HTTP 200 |
| `/support/` | HTTP 200 |
| `/cases/` | HTTP 200 |
| `/news/` | HTTP 200 |
| `/contact/` | HTTP 200 |
| 核心布局 JS/CSS | HTTP 200，大小与本地构建一致 |
| 本地/远端 46 文件聚合 SHA-256 | `714690c65c35d8b0234749629ada4fc40f2925053ec47532c94a97aef7b2d143`，完全一致 |
| Issue #15 根路径候选 SHA-256 | 线上以相同确定性 GNU tar 命令得到 `0ff5b44a3f07eaf09035949942f8f6e1f4a6c4558e88b5f71ce042c233b5cff5`，与已批准候选一致 |
| 三语切换 | Headless Chrome 在线依次切换 `en` / `zh` / `ru`；`document.lang`、`gg_locale`、激活按钮及首页标题均同步为对应语言 |
| 页面行为 | 部署前 23 项契约测试通过；线上使用完全一致的生产文件 |

## 回滚依据

部署前已下载原线上 `/var/www/corp/dist` 并生成临时归档：

- 路径：`ignored/deployment-rollbacks/2026-07-27-pre-issue-16-dist.tar.gz`（Git 忽略的本地持久资料目录）
- SHA-256：`5f8e79ee7ec0bcc36c02423445a4b2045600ecbece7d06dbebb2c199bcb3aa3d`

该归档由发布负责人保留到下一次成功生产发布完成并验证后，再决定归档或清理。本次部署全部验收通过，未触发回滚。如后续需要回退，可解压该归档并按现有脚本的上传、权限、Nginx reload 和健康检查步骤重新发布。
