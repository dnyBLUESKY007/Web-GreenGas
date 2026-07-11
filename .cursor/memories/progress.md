# Progress（进展与里程碑）

> 项目的“状态快照”：已完成、待办、已知问题。细节可随时间模糊化，只保留结论。
> 最近更新：2026-07-10

## 已完成

- 项目脚手架 + 6 页面骨架（Home / Solutions / About / Contact / FAQ / News）
- EN / 中文 / Русский 自研 i18n 层
- Hero 轮播、Navbar 滚动隐藏、ScrollToTop 全局挂载
- Contact 页改版 + 独立 FAQ 路由
- 全量图片迁移阿里云 OSS CDN（77 张，`cdnUrl()` 集中管理）
- 子路径部署（`basePath()` + `VITE_BASE`）
- 运行时主题切换（3 accent scheme）
- AI workflow 脚手架（rules / skills / memories 目录结构）
- 数字大脑（Memory Bank）初始化填实
- **首页信息架构改版**（Solutions 交互面板、环形 Capability、ProductGrid、About 收束；Cert/Clients 子页）
- Solutions 四场景图接入 OSS CDN（`scene/` 类别）+ `image-resources.json` 资源说明表（85 条）
- **生产部署**：阿里云 ECS + Nginx；`scripts/deploy.ps1` / `deploy.sh` 一键发布

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
| 2026-07-04 | Workflow | rules/skills 重组 + 数字大脑初始化 |
| 2026-07-05 | 首页 IA 改版 | 5 屏信息流、Solutions 面板、环形能力、ProductGrid、About 子页 |
| 2026-07-05 | 场景图 + 资源表 | Solutions 四场景图 OSS 接入；`image-resources.json` 溯源表 |
| 2026-07-10 | ECS 生产部署 | 站点上线 `47.76.112.33`；deploy 脚本 + ADR-0006 |
