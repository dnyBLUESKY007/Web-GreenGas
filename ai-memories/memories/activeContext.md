# Active Context（当前焦点）

> 2026-07-17: Completed page-content adjustments — News card metadata layout fix, stable Solutions product-tab order, homepage solution cards without page navigation, a fourth international-partnership statistic, and no homepage section eyebrows. Production build passed.

> 更新最频繁的文件。每次里程碑或换方向时刷新，保证“下一步一目了然”。
> 最近更新：2026-07-17

## 当前焦点

About 与 News 已按旧站归档重建：About 采用公司、团队、发展资料与可信入口；News 已迁移 6 篇真实内容，提供分类列表与统一详情页。生产环境已部署至阿里云 ECS（`http://47.76.112.33/`），本地一键发布脚本就绪。

## 近期变更

- 2026-07-17 移动端适配：新增 1024px 以下可访问抽屉导航；首页 Hero/卡片、Solutions 横向 Tab、Contact/FAQ 宽度与安全区完成小屏优化。已实测 320/390/768/820/1024px 的主要页面及中俄长文案，生产构建通过。

- 2026-07-17 协作记录审计：修复迁移后残留路径与失效文档链接；数字记忆已改为自包含的工具无关记录，网站验收原则已沉淀到 `projectbrief.md`。人工输入中的历史记录保持原样，仅标注其旧路径已过时。
- 2026-07-15 About / News：迁移旧站公司介绍、团队和 6 篇新闻；新增 JSON 驱动新闻分类、`/news/detail/?id=` 统一详情、中文校订及英俄默认翻译，复用已登记 OSS 图片
- 2026-07-15 Solutions 产品中心：接入 `products_v2` 86 张 OSS WebP 溯源记录；页面按“场景 + 经典案例”与“四大系列 + 具体产品”双路径重构，14 个产品使用已修代表图
- 2026-07-11 五页 page-header 背景：接入 `page-headers/01–05.webp`（Solutions/About/News/FAQ/Contact），`image-resources.json` 已登记；需上传 OSS 后线上可见
- 2026-07-11 工程核心能力：接入 `capacity/1–5.webp` 与 `capacity/background.webp`，替换卡片媒体占位符与区段背景
- 2026-07-11 图片资源工作流固化：`resources_png`（原图/AI）→ `libwebp` → `resources` → OSS 上传；有改动须同步 `image-resources.json`（见 techContext / systemPatterns / ADR-0002）
- 2026-07-11 首页工程核心能力：由深色环形流程改为浅色统计栏 + 五步工程卡片；桌面横向、移动端纵向布局。
- 2026-07-10 生产部署：站点发布至 ECS `47.76.112.33`（Nginx `/` → `/var/www/corp/dist`）；新增 `scripts/deploy.ps1` / `deploy.sh`；ADR-0006
- 2026-07-05 Solutions 场景图：四张 scene 图上传 OSS，`solutions.json` + `cdnUrl('scene')` 接入；新增 `image-resources.json` 图片资源说明表（85 条）
- 2026-07-05 首页视口高度节奏：统一 `--home-screen-*` 变量，桌面端按 TALK-0002 比例约束各屏（75/25、60、60/40、70/30、100% About）
- 2026-07-05 首页改版：重排模块顺序；Solutions 交互面板；CapabilityBand 环形流程；ProductGrid；About 整合联系渠道
- 2026-07-04 文档整理：`docs/`、`TODO/`、`README-TMP.md` 的有效内容已迁入项目记忆与待办记录，冗余文件已删除
- 2026-07-04 协作记录结构完成重组并初始化
- 2026-07-03 Hero viewport 重建 + 轮播交互优化；v3 modern fusion 皮肤合并为生产基线

## 下一步

- [ ] 将 `ignored/resources/page-headers/` 五张图上传 OSS `resources/page-headers/`
- [ ] 用户审阅首页及 About / News 视觉（Solutions 尖角贴合、五步工程能力区实图、About 布局）
- [ ] 替换其余占位文案/图片为甲方真实素材
- [ ] Contact 页高德地图（[issue-0001](../issues/issue-0001-contact-amap-map.md)）
- [ ] EmailJS 表单接入
- [ ] （可选）Cloudflare Pages 或 CI 自动发布

## 进行中的任务 Plan

- 无

## 待决问题 / 阻塞

- 甲方真实厂址与 GCJ-02 经纬度（Contact 地图依赖）
