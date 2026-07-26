# Website Restructure Requirements

本目录保存 2026-07-26 网站改版的稳定需求文档。实现细节和每日进度不写入规格正文，而由任务记录和 GitHub Issues 维护。

## 文档索引

- `website-restructure-prd.md`：改版总纲、用户故事、全局决策和范围边界。
- `global-home.spec.md`：全站导航、品牌、元数据、旧路由和首页。
- `products-industries.spec.md`：产品导航和行业应用。
- `content-centers.spec.md`：技术支持、案例中心和新闻中心。
- `company-contact.spec.md`：关于我们、FAQ 和联系我们。

## 使用规则

1. 先阅读根目录 `CONTEXT.md`，使用其中定义的术语和来源优先级。
2. 实现 Issue 以对应分域规格为验收依据，并同时满足总纲要求。
3. 规格与实现冲突时，先核对当前利益相关方确认记录；不能自行用竞品内容填补事实。
4. 资料不足时使用明确标识的 Example Placeholder，并将替换需求写入每日总结。
5. 每个 Issue 完成前必须执行生产构建和对应页面的浏览器行为验收。
