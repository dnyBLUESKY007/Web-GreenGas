# Active Context（当前焦点）

> 更新最频繁的文件。每次里程碑或换方向时刷新，保证“下一步一目了然”。
> 最近更新：2026-07-11

## 当前焦点

首页信息架构改版已完成；生产环境已部署至阿里云 ECS（`http://47.76.112.33/`），本地一键发布脚本就绪。工程核心能力区已按横向五步流程重构，待用户审阅视觉细节并替换其余占位素材。

## 近期变更

- 2026-07-11 图片资源工作流固化：`resources_png`（原图/AI）→ `libwebp` → `resources` → OSS 上传；有改动须同步 `image-resources.json`（见 techContext / systemPatterns / ADR-0002）
- 2026-07-11 首页工程核心能力：由深色环形流程改为浅色统计栏 + 五步工程卡片，卡片媒体区保留 CSS 图片占位符；桌面横向、移动端纵向布局。
- 2026-07-10 生产部署：站点发布至 ECS `47.76.112.33`（Nginx `/` → `/var/www/corp/dist`）；新增 `scripts/deploy.ps1` / `deploy.sh`；ADR-0006
- 2026-07-05 Solutions 场景图：四张 scene 图上传 OSS，`solutions.json` + `cdnUrl('scene')` 接入；新增 `image-resources.json` 图片资源说明表（85 条）
- 2026-07-05 首页视口高度节奏：统一 `--home-screen-*` 变量，桌面端按 TALK-0002 比例约束各屏（75/25、60、60/40、70/30、100% About）
- 2026-07-05 首页改版：重排模块顺序；Solutions 交互面板；CapabilityBand 环形流程；ProductGrid；About 整合联系渠道
- 2026-07-04 文档整理：`docs/`、`TODO/`、`README-TMP.md` 迁入 `.cursor/memories/` 与 issue，冗余文件已删除
- 2026-07-04 workflow 脚手架与 rules/skills 重组（`.cursor/bakup` 归档旧版）
- 2026-07-03 Hero viewport 重建 + 轮播交互优化；v3 modern fusion 皮肤合并为生产基线

## 下一步

- [ ] 用户审阅首页视觉（Solutions 尖角贴合、五步工程能力区、About 布局）
- [ ] 替换占位文案/图片为甲方真实素材
- [ ] Contact 页高德地图（[issue-0001](../issues/issue-0001-contact-amap-map.md)）
- [ ] EmailJS 表单接入
- [ ] （可选）Cloudflare Pages 或 CI 自动发布

## 进行中的任务 Plan

- 无

## 待决问题 / 阻塞

- 甲方真实厂址与 GCJ-02 经纬度（Contact 地图依赖）
