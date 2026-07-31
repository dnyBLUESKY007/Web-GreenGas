# GREENGAS 导航与内容清理生产发布总结

- **日期**：2026-07-31
- **状态**：已发布并通过验收
- **固定应用候选**：`5935b8400edd6eff9ffa45be3769af4f82068c9f`
- **生产目标**：`root@8.134.94.247:/var/www/corp/dist`
- **关联任务**：`ai-memories/tasks/2026-07-31-navigation-certificates-contact-cleanup.md`

## 发布内容

- 左侧品牌在 390–2000px 保持稳定；中文顶部导航从 1024px 显示，英文和俄文分别从 1080px、1152px 显示，英俄标签在 14–17px 间平滑变化。
- 首页与案例中心的四个代表性项目按布里斯班机场、毛里塔尼亚国会大楼、Netcare Pine Haven、浩达工具完整反序。
- ISO 9001 与 CE 使用 0731 甲方高清原图派生 WebP，证书页与两篇相关新闻统一引用新 OSS 资源。
- Contact 删除已取消的留言表单、EmailJS 文案、样式与未来接入计划，保留 FAQ 和已批准直接联系渠道。

## 验证

- `npm run typecheck`：通过。
- `npm test`：24/24 通过。
- `npm run build`：通过。
- `git diff --check`：通过。
- Nginx：配置有效、服务 active、服务器本机 HTTP 200。
- 公网路由：首页、产品、证书、新闻列表、新闻详情、案例、合作公司、联系页共 8/8 返回 HTTP 200。
- 新 ISO/CE OSS 对象返回 HTTP 200 与 `image/webp`，长度分别为 538448 和 181812 字节。
- 生产 `dist` 下载后与本地固定候选执行 `diff -rq` 无差异。
- 在线 Chrome 验收：中文 1024px、英文 1080px、俄文 1151/1152px 菜单边界正确且无横向溢出；首页项目顺序正确；证书自然尺寸为 1588×2244 和 1079×1502；390px Contact 显示 6 组 FAQ 和直接渠道，不存在表单。

## 回滚

- 部署前生产归档：`ignored/deployment-rollbacks/2026-07-31-pre-navigation-content-cleanup-dist.tar.gz`
- SHA-256：`ac7e2644f0bc20259b992103b8fcc3e31a0ea85d5d6dc670b4e7c1d2b80fd403`
- 归档已通过 `gzip -t`，包含部署前生产 `dist` 树。

## 部署备注

- 本机 `web-server` 别名在发布时无法解析，使用已存在 known_hosts 记录且连接验证通过的固定生产 IP `8.134.94.247` 完成同一目标部署。
- `scripts/deploy.sh` 未设置可执行位，本次通过 `bash scripts/deploy.sh --skip-build` 执行已验证构建。
