# Task: Solutions 双路径改版

- **日期**：2026-07-15
- **状态**：已完成
- **关联**：`ai-memories/memories/activeContext.md`、`ai-memories/memories/systemPatterns.md`

## Problem / 目标

现有 Solutions 页面仅展示旧的两类产品平铺列表，无法同时回答访客“我的应用场景是否适配”和“有哪些具体设备”两类问题。新版需要接入已上传 OSS 的 `products_v2` 产品图，并按“应用场景 + 经典案例”与“四大产品系列 + 具体产品”两条路径组织内容。

## 核心思路

保持 Vite MPA、TypeScript DOM、JSON 驱动和三语内容架构不变。场景与案例复用现有数据，产品模型扩展为四系列、14 个实际产品；图片资源完整登记，但页面每个产品只选择一张已修代表图。页面采用双入口导航、场景详情、案例证明、系列 tab 与响应式产品网格。

## 受影响的文件 / 模块

- `frontend/src/data/image-resources.json` — 登记 86 张 `products_v2` OSS 图片
- `frontend/src/data/products.json` — 四系列与 14 个产品数据
- `frontend/src/types/index.ts` — 扩展产品系列模型
- `frontend/src/pages/solutions/` — 重构页面及渲染模块
- `frontend/src/styles/components/_solutions-page.scss` — Solutions 专属响应式样式
- `frontend/src/i18n/locales/*.json` — 三语页面文案
- `ai-memories/memories/activeContext.md`、`ai-memories/memories/progress.md` — 里程碑回写

## 分步计划

- [x] Step 1: 登记 OSS 图片并校验本地映射
- [x] Step 2: 重构产品模型与三语数据
- [x] Step 3: 实现场景、案例与产品双路径页面
- [x] Step 4: 完成响应式、可访问性与构建验证
- [x] Step 5: 更新任务总结与项目记忆

## Debug Notes

> 开发中遇到的重大 Bug、卡点、设计变更即时追加到这里（带时间戳）。

## Lessons Learned

> 任务收尾时填写，供后续任务参考；重要结论同步回 `ai-memories/memories/`。

- `image-resources.json` 是资源溯源登记表而非运行时索引；每个 OSS 产品图 URL 仍须由内容 JSON 明确引用。
- 产品系列与具体产品分离为两个 JSON 数据源：系列承载定位与应用说明，产品承载多语言名称、说明与代表图，后续扩展无需修改页面结构。
