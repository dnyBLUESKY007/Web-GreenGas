# Progress（进展与里程碑）

> 2026-07-17: Completed page-content adjustments — News card metadata layout fix, stable Solutions product-tab order, homepage solution cards without page navigation, a fourth international-partnership statistic, and no homepage section eyebrows. Production build passed.

> 项目的“状态快照”：已完成、待办、已知问题。细节可随时间模糊化，只保留结论。
> 最近更新：2026-07-17

## 已完成

- 项目脚手架 + 6 页面骨架（Home / Solutions / About / Contact / FAQ / News）
- EN / 中文 / Русский 自研 i18n 层
- Hero 轮播、Navbar 滚动隐藏、ScrollToTop 全局挂载
- Contact 页改版 + 独立 FAQ 路由
- 全量图片迁移阿里云 OSS CDN（77 张，`cdnUrl()` 集中管理）
- 子路径部署（`basePath()` + `VITE_BASE`）
- 运行时主题切换（3 accent scheme）
- 协作记录结构初始化
- 数字记忆（Memory Bank）初始化填实
- **首页信息架构改版**（Solutions 交互面板、环形 Capability、ProductGrid、About 收束；Cert/Clients 子页）
- Solutions 四场景图接入 OSS CDN（`scene/` 类别）+ `image-resources.json` 资源说明表（85 条）
- **生产部署**：阿里云 ECS + Nginx；`scripts/deploy.ps1` / `deploy.sh` 一键发布
- **Solutions 双路径改版**：四类应用场景及经典案例路径、四大产品系列及 14 个代表设备；`products_v2` 86 张 OSS WebP 已登记溯源
- **About / News 重设计**：About 迁移公司、团队与发展资料；News 迁移 6 篇旧站新闻，支持分类筛选与统一详情页，复用已登记 OSS 图片并补齐三语内容
- **移动端适配**：1024px 以下抽屉导航、320px 单列产品、Hero/触控热区、Contact/FAQ 全宽、Solutions 横向 Tab 提示与三语窄屏验证

## 进行中

- 占位内容 → 甲方真实素材替换

## 待办

- [ ] Contact 页高德地图（issue-0001）
- [ ] EmailJS 联系表单
- [ ] （可选）Cloudflare Pages / CI 自动发布
- [ ] SEO meta 完善

## 已知问题 / 技术债

- 部分联系方式与公司信息仍为占位数据
- EmailJS 尚未接入
- 无自动化 CI 发布（当前为本地脚本 + SSH）

## 里程碑记录

| 日期 | 里程碑 | 摘要 |
|------|--------|------|
| 2026-06-18 | 立项 | 甲方需求 + 品牌色确立 |
| 2026-06-21 | 框架优先 | 先搭骨架，三语 scope 确认 |
| 2026-06-22 | 首页交互 | Hero 轮播 + layout chrome |
| 2026-06-24 | 首页重建 | catalog sections + trust modules |
| 2026-06-28 | CDN 迁移 | 全量图片上 OSS |
| 2026-07-01 | 多版本预览 | basePath + nginx v1/v2/v3 |
| 2026-07-03 | 皮肤合并 | v3 fusion 为生产基线 + 主题切换 |
| 2026-07-04 | 协作记录 | 工作流重组 + 数字记忆初始化 |
| 2026-07-05 | 首页 IA 改版 | 5 屏信息流、Solutions 面板、环形能力、ProductGrid、About 子页 |
| 2026-07-05 | 场景图 + 资源表 | Solutions 四场景图 OSS 接入；`image-resources.json` 溯源表 |
| 2026-07-10 | ECS 生产部署 | 站点上线 `47.76.112.33`；deploy 脚本 + ADR-0006 |
| 2026-07-15 | Solutions 双路径 | 场景/案例与系列/产品双入口；86 张产品图资源登记、14 张代表图接入 |
| 2026-07-15 | About / News 重设计 | 旧站公司与新闻内容迁移；JSON 驱动 6 篇新闻分类与详情页 |
| 2026-07-17 | 协作记录审计 | 修复残留旧路径与失效链接；数字记忆改为自包含的工具无关记录 |
| 2026-07-17 | 移动端适配 | 完成导航断点重构与主要页面小屏布局优化；生产构建和多宽度浏览器检查通过 |
