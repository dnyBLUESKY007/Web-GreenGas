# GREENGAS Issue 24 Production Deployment

- **发布时间：** 2026-07-27 21:09 CST（2026-07-27 13:09 UTC）
- **固定应用候选：** `9c6460d59321b9ba00b1bbf7e9084acf18f09d67`
- **部署目标：** `root@8.134.94.247:/var/www/corp/dist`
- **发布状态：** 成功
- **GitHub Issue：** #24 已关闭

## 部署前保护

替换生产目录前，已将原 `/var/www/corp/dist` 下载并保存为本地回滚归档：

- 路径：`ignored/deployment-rollbacks/2026-07-27-pre-issue-24-dist.tar.gz`
- SHA-256：`df02a888784577309d10a2b737540f2c2e3dd2ff838def1e868c9a1ff8323859`
- 完整性：`tar -tzf` 通过

部署脚本默认的 `web-server` 别名在本机未配置，并被代理 DNS 解析到无效地址。未修改全局 SSH 配置；改用真实服务器地址 `8.134.94.247` 和临时 `ssh-agent` 执行同一部署脚本。首次调用因 `deploy.sh` 无可执行位在本地停止，服务器未改变；随后使用 `bash scripts/deploy.sh --skip-build` 成功发布。

## 部署输入

从固定提交构建并验证生产候选：

| 检查 | 结果 |
|---|---|
| `npm run typecheck` | 通过 |
| `npm run test` | 24/24 通过 |
| `npm run build` | 通过；48 个文件 |
| 精细世界地图 | Natural Earth 本地 SVG，247124 字节，gzip 81.32kB |

## 部署与线上验收

| 线上检查 | 结果 |
|---|---|
| Nginx 配置与 reload | 通过 |
| 服务器本地 `/` | HTTP 200 |
| 远端静态文件 | 48 个文件 |
| 多视口页面 | 320、390、768、1024、1440px 检查首页、About、案例列表和案例详情，共 20 个组合通过 |
| 三语切换 | `en`、`zh`、`ru` 的文档语言、本地存储和激活状态同步 |
| 地图与案例 | 首页及案例中心地图、3 个案例项目点、详情与列表链接有效 |
| 公开状态文案 | 13 个主要路由 × 3 种语言共 39 组正文、`aria-label`、`title` 扫描通过，仅保留占位/待替换提醒 |
| 地图资源一致性 | 本地与线上 SHA-256 均为 `e8dccf840bd4afa6aa3dd82d488031acd5e2cb3f1c76f3472c8c0a1102e33bdf` |
| 浏览器标题、页脚、ISO | 标题、无 tagline、`ISO14001` 契约通过 |

全部验收通过，未触发回滚。浩达工具地点仍待甲方提供，因此继续不生成地图点。
