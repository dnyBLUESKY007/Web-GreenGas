# GREENGAS Issue 23 Production Deployment

- **发布时间：** 2026-07-27 18:44 CST（2026-07-27 10:44 UTC）
- **部署记录提交前 HEAD：** `b549620bfa23fd4693bb572b98137e0f4bfd82e2`
- **固定应用候选输入：** `9742d1ba7998c37e0239f63bedb80f6822320d10`
- **部署目标：** `root@8.134.94.247:/var/www/corp/dist`
- **发布状态：** 成功

## 部署前保护

替换生产目录前，已将原 `/var/www/corp/dist` 下载并保存为可验证的本地回滚归档：

- 路径：`ignored/deployment-rollbacks/2026-07-27-pre-issue-23-dist.tar.gz`
- SHA-256：`2fd890b9e36cb0f49ff3963f54971b1fdb0ac87aec9426c410072fbff428eef5`
- 完整性：`tar -tzf` 通过

回滚时应解压该归档，并按现有部署脚本的上传、权限、Nginx 检查/reload 和健康检查步骤重新发布。

## 部署输入

从空 `dist/` 和按锁文件重装的依赖生成根路径生产构建。部署前验证结果：

| 检查 | 结果 |
|---|---|
| `npm ci` | 通过；安装 25 个包 |
| `npm run typecheck` | 通过 |
| `npm run test` | 23/23 通过 |
| `npm run build` | 通过；47 个文件 |
| Issue #22 根候选 SHA-256 | `2062378ee7358e80d5de16de332b23b42b1d4d6516811f588908d3ad291f9902` |

部署首次尝试在服务器变更前因脚本无可执行位而停止。随后发现 iCloud 在生成目录创建了 `node_modules/@types/estree 2/`，并且旧 `dist/` 混有陈旧散列文件；删除这两个生成目录、重新执行 `npm ci` 和完整验证后，使用 `bash scripts/deploy.sh --skip-build` 发布干净的 47 文件候选。上述两次问题均发生在生产目录替换前，未触发回滚。

## 部署与线上验收

现有部署脚本完成远端目录替换、上传、`www-data` 权限规范化、Nginx 配置检查/reload 和服务器本地健康检查。

| 线上检查 | 结果 |
|---|---|
| Nginx 配置与 reload | 通过 |
| 服务器本地 `/` | HTTP 200 |
| 八项公开路由 | `/`、`/about/`、`/products/`、`/industries/`、`/support/`、`/cases/`、`/news/`、`/contact/` 全部 HTTP 200 |
| 多视口页面 | Chrome 150 在 320、390、768、1024、1440px 检查首页、About、案例列表和布里斯班案例详情，共 20 个组合无页面级横向溢出 |
| 首页与案例地图 | 首页 4 张案例卡、3 个已核实点和地图列表/详情链接有效；案例中心 4 张卡与 3 个点有效 |
| 浏览器标题与页脚 | 标题为“格灵空调”；共用页脚无 tagline |
| ISO 编号 | About 显示 `ISO14001`，不含 `ISO140001` |
| 三语切换 | `en`、`zh`、`ru` 的文档语言、本地存储和激活状态同步 |
| 新增 OSS 图片 | 23/23 返回 HTTP 200 和 `image/webp` |
| 本地/远端文件 | 均为 47 个文件；C locale 排序的逐文件 SHA-256 清单聚合均为 `2579a61731eaa74f91e72f4cd27e70a56ca8e4d2459f90af2e4b0b3043d69f24` |

全部核心验收通过，未触发回滚。浩达工具案例地点仍待甲方补充，当前按已批准证据边界不展示地图点。
