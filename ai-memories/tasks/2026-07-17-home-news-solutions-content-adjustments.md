# Task: 首页、新闻与解决方案内容调整

- **日期**：2026-07-17
- **状态**：已完成
- **关联**：`ai-memories/memories/activeContext.md`

## Problem / 目标

修复新闻列表卡片的分类标签与发布日期重叠问题；按指定名称和顺序调整解决方案页的四大产品系列；移除首页 Solutions 卡片跳转到解决方案页的交互；在首页核心能力统计中补充“10+跨国合作经验”；移除首页所有 section 的 eyebrow 文案区域。

## 核心思路

先定位新闻卡片、解决方案产品数据和首页各 section 的渲染及样式来源。产品系列名称与顺序优先保留在 JSON 数据层，交互移除仅限首页对应卡片，避免影响其他导航入口；eyebrow 仅从首页 section 输出中删除，不改变其他页面。

## 受影响的文件 / 模块

- `frontend/src/pages/news/*`：新闻卡片布局与分类/日期展示。
- `frontend/src/pages/solutions/*`、`frontend/src/data/*`：产品系列名称与排序。
- `frontend/src/pages/home/*`、`frontend/src/components/*`、`frontend/src/i18n/locales/*`：首页卡片交互、核心能力数据和 eyebrow 输出。
- `ai-memories/memories/activeContext.md`、`progress.md`：完成后记录里程碑。

## 分步计划

- [x] Step 1: 定位各页面渲染、数据和样式来源，确认现有交互边界。
- [x] Step 2: 修复新闻卡片分类和日期的布局重叠。
- [x] Step 3: 调整解决方案页的产品系列名称与顺序。
- [x] Step 4: 移除首页 Solutions 卡片的跳转，补充核心能力统计，并删除首页 section eyebrow。
- [x] Step 5: 执行类型检查和生产构建；更新任务记录与 Memory Bank。

## Debug Notes

> 开发中遇到的重大 Bug、卡点、设计变更即时追加到这里（带时间戳）。

- 2026-07-17 构建首次在沙箱内被 Vite 配置加载权限阻止；在获准的受限外构建中验证通过。

## Lessons Learned

> 任务收尾时填写，重要结论同步回 `ai-memories/memories/`。

- 产品系列应以稳定的 ID 排序，避免展示顺序依赖 JSON 文件的历史排列；首页的方案卡片可使用 button 保留内容切换，而无需承担页面导航职责。
