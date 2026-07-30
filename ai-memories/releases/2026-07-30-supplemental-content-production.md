# GREENGAS 0730 补充内容生产发布总结

- **日期**：2026-07-30
- **状态**：已发布并通过验收
- **固定应用候选**：`820c0807016267d9f830d3711f4560228dba015d`
- **生产目标**：`root@8.134.94.247:/var/www/corp/dist`
- **关联任务**：`ai-memories/tasks/2026-07-30-stakeholder-supplemental-content.md`

## 发布内容

- 产品中心按工业空调、中央空调主机、中央空调末端、非标定制四个板块重排，并增加恒温恒湿机组大版头。
- 浩达工具案例将甲方标注的厂区外观图移至图库最后，卡片继续使用统一媒体比例。
- ISO 9001 与 CE 证书作为历史证书公开，并同步显示证载有效期，不主张当前有效。
- 发布 Airwave、Ascent Aircon、大韩冷冻水产食品安全管理院和 K-CELL 四家合作公司 Logo 与官网链接。
- 新闻归档新增团建、员工体检、CRH 2021、南非三级制冷蒸发冷机组四篇三语内容；2019 上海制冷展改用本次补充图片。
- K-CELL 使用 `补充.docx` 内嵌的正确 Logo；压缩包中误放的 Dongwon F&B 图片未使用。

## 素材发布

- 4 张合作公司 Logo、2 张历史证书、19 张补充新闻图片已转换并上传，共 25 个新增 WebP 对象。
- 25/25 新对象均返回 HTTP 200、`image/webp`，公开对象字节数与本地文件一致。
- 线上浏览器验收发现既有 `projects/industrial-ac-features.webp` 仍为历史 404；使用其已登记来源原图恢复并上传，恢复后返回 HTTP 200、`image/webp`、545046 字节。

## 候选验证

- `npm run typecheck`：通过。
- `npm test`：24/24 通过。
- `npm run build`：通过，产物 48 个文件。
- `git diff --check`：通过。
- 部署后下载生产 `dist`，与本地固定候选执行 `diff -rq` 无差异。

## 生产验收

- Nginx：`nginx -t` 通过，服务状态 `active`，服务器本机健康检查 HTTP 200。
- 公网路由：`/`、About、Products、Industries、Support、Cases、News、Contact、Certifications、Clients 共 10/10 返回 HTTP 200。
- Chrome 在线检查覆盖 Products、Certifications、Clients、News、Cases，宽度 390/1440px，并切换中英俄三语。
- 所有检查的浏览器标题均为“格灵空调”，语言状态正确，无横向溢出、无破图，目标内容存在。

## 回滚

- 部署前生产归档：`ignored/deployment-rollbacks/2026-07-30-pre-supplemental-content-dist.tar.gz`
- SHA-256：`4b0a25cb0548deb8ad83e3867af49f4ba0944167a88dd2047474776209ade933`
- 归档已通过 `gzip -t`，包含原生产 `dist` 树；如需回滚，重新部署该归档内容并 reload Nginx。

## 保留事项

- 域名解析未执行，继续等待公安备案完成。
- 浩达工具项目地点仍未提供，因此继续不生成地图点。
- EmailJS、最终产品技术参数和技术资料仍属于后续范围。
