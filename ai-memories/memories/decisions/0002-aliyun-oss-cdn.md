# ADR-0002: 图片托管阿里云 OSS CDN

- **状态**：已采纳
- **日期**：2026-06-28

## 背景

站点含 77+ 张工程/产品/案例图片（WebP），若全部放入 `frontend/public/` 会显著增大 repo 体积、拖慢 clone 与 CI，且不利于非开发人员独立管理素材。

## 决策

图片统一上传至 **阿里云 OSS**（`web-greengas.oss-cn-qingdao.aliyuncs.com`），代码通过 `cdnUrl(category, filename)` 集中引用，**不写死 URL 字符串**。

## 备选方案

- **本地 `public/images/`**：简单但 repo 膨胀、素材更新需 commit
- **Cloudflare R2**：与 Pages 部署同生态 — 甲方已有 OSS 且国内访问更优
- **Git LFS**：仍增加 clone 成本，不适合频繁换图

## 影响

- **正面**：repo 轻量、CDN 加速、素材与代码解耦
- **负面**：需单独维护本地转换 + 上传流程；换图后要同步 `image-resources.json`
- **现行工作流**（2026-07-11 固化）：
  1. 原图 → `ignored/resources_png/`（含 AI 图）
  2. `ignored/libwebp/` 脚本 → `ignored/resources/`（WebP）
  3. 上传 OSS `resources/`
  4. 更新 `frontend/src/data/image-resources.json`
- **后续**：换 bucket 或 CDN 只需改 `assets.ts` 一处
