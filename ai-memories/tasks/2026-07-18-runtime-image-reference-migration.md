# Task: 运行时图片引用迁移至重构后的资源目录

- **日期**：2026-07-18
- **状态**：计划中
- **关联**：`2026-07-17-image-resource-metadata-reorganization.md`；ADR-0002

## Problem / 目标

原图目录已重构为 `web/`、`company/`、`projects/`、`products_v1/`、`products_v2/` 与 `prev_pic/`，但前端仍使用原有 OSS 分类和文件名。需要扫描所有 `cdnUrl(category, filename)` 调用及完整 OSS URL，并按重构规则迁移运行时引用，避免前端与资源工作流脱节。

## 核心思路

以 2026-07-17 创建的目录内 `resources.yml` 和 `prev_pic/prev-name.yml` 为映射依据：网页视觉资产迁移至 `web/`，公司/联系/资质迁移至 `company/`，当前项目案例迁移至 `projects/`，第一代产品迁移至 `products_v1/`，第二代产品保留在 `products_v2/`，历史项目图片迁移至 `prev_pic/`。集中改造 `cdnUrl()` 调用参数、JSON 中完整 CDN URL 和数据里的类别字段；不会引用 `_org` 原始图。随后构建校验并报告待转换/上传 OSS 的新路径。

## 受影响的文件 / 模块

- `frontend/src/config/assets.ts` 及各页面/组件 — `cdnUrl()` 类别与文件名
- `frontend/src/data/{products,projects,solutions,about,news}.json`（以实际命中为准）— 完整 CDN URL 或图片分类字段
- `frontend/src/data/image-resources.json` — 如继续保留，更新为与新运行时路径一致的登记结构
- `ai-memories/memories/*` — 完成后更新图片工作流路径约定

## 分步计划

- [ ] Step 1: 导出所有运行时图片引用，按旧 URL/类别关联到重构后的原图目录和目录 YAML。
- [ ] Step 2: 更新页面与组件中的显式 `cdnUrl()` 调用，以及 JSON 驱动类别字段。
- [ ] Step 3: 更新产品、项目等 JSON 中的完整 OSS URL；仅保留实际页面使用的资源路径。
- [ ] Step 4: 处理或缩减 `image-resources.json`，使其不再成为集中式图片元数据来源，并确认没有残留旧资源分类。
- [ ] Step 5: 运行类型检查和生产构建；报告需要按新目录结构转换并上传 OSS 的图片。

## Debug Notes

> 开发中遇到的重大 Bug、卡点、设计变更**即时追加**到这里（带时间戳）。

- 2026-07-18 初步扫描发现：显式 `cdnUrl()` 位于首页、About、工程能力、认证和场景渲染；完整 OSS URL 主要位于 `products.json` 与 `projects.json`。`image-resources.json` 本身不参与运行时渲染。

## Lessons Learned

> 任务收尾时填写，供后续任务参考；重要结论应同步回 `ai-memories/memories/`。

- 待完成。
