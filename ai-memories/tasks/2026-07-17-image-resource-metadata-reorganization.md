# Task: 图片资源元数据按目录拆分

- **日期**：2026-07-17
- **状态**：已完成
- **关联**：`systemPatterns.md` 图片资源工作流；`techContext.md` 图片资源工作流；ADR-0002

## Problem / 目标

现有 `frontend/src/data/image-resources.json` 集中保存全部图片的 CDN URL、原始路径和说明，文件过大且与原图目录脱节。用户已经重新组织 `ignored/resources_png/`：顶层目录现为 `web/`、`company/`、`projects/`、`products_v1/`、`products_v2/` 与 `prev_pic/`。需要将图片说明分散到各图片所在的二级目录中，并将旧原始路径映射集中到 `prev_pic/prev-name.yml`。

## 核心思路

以当前 `resources_png/` 中实际存在的文件为准，将旧资源清单按用户提供的重命名/移动记录映射至新文件名。对每个包含图片的二级目录创建 `resources.yml`，键为不带路径的图片文件名，值为原清单对应的 `description`。在 `prev_pic/prev-name.yml` 中，键为移入 `prev_pic/` 的图片文件名，值为原清单对应的 `originalPath`。不改动网页运行时代码或 OSS URL；旧 JSON 的删除或替换需作为后续、独立且经确认的迁移步骤。

## 受影响的文件 / 模块

- `ignored/resources_png/*/resources.yml` — 在每个含图片的二级目录写入图片描述
- `ignored/resources_png/prev_pic/prev-name.yml` — 写入旧图片的原始路径溯源
- `ai-memories/memories/{activeContext,progress,systemPatterns,techContext}.md` — 完成后更新工作流记录，移除旧 JSON 为唯一登记源的表述

## 分步计划

- [x] Step 1: 递归核对重命名后的图片目录、文件名和现有 YAML，记录无法从旧清单对应的文件。
- [x] Step 2: 解析旧 `image-resources.json`，按用户提供的移动/重命名关系建立新文件名到 `description` / `originalPath` 的映射。
- [x] Step 3: 在每个含图片的 `resources_png` 二级目录生成或更新 `resources.yml`；在 `prev_pic` 创建 `prev-name.yml`。
- [x] Step 4: 校验键覆盖：`web` 32/32、`company` 20/20、`projects` 14/14、`products_v1` 27/27、`products_v2` 86/86、`prev_pic` 43/43；`prev-name.yml` 43/43。未改动 `ai-memories/inputs/`。
- [x] Step 5: 保留旧 JSON 作为当前网页和 OSS 资源的历史登记；目录化 YAML 已成为原图侧的描述与历史路径元数据。

## Debug Notes

> 开发中遇到的重大 Bug、卡点、设计变更**即时追加**到这里（带时间戳）。

- 2026-07-17 目录检查：用户正文写作 `prev-pic`，当前实际目录为 `ignored/resources_png/prev_pic/`；计划以实际目录 `prev_pic` 为准。
- 2026-07-17 映射：`projects` 中 `proj-4-emperors-palace_org.png` 与 `proj-6-netcare-pinehaven_org.png` 没有独立旧登记，采用对应项目图的描述并明确标注为原始图。

## Lessons Learned

> 任务收尾时填写，供后续任务参考；重要结论应同步回 `ai-memories/memories/`。

- 图片原图目录可将说明随图片一同维护；网页仍只读取 TypeScript/JSON 内容数据与 OSS URL，目录内 YAML 不参与运行时加载。
