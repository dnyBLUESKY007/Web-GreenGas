# web-greengas

GREENGAS 企业官方网站源码仓库。GREENGAS 面向企业 / 政府客户，提供**工业制冷与 HVAC 定制解决方案**；本站为静态企业官网，用于展示业务能力、工程案例与联系方式，引导潜在客户发起咨询。

---

## 站点页面

| 页面 | 路径 | 说明 |
|------|------|------|
| Home | `/` | Hero 轮播、产品种类、项目展示、工程能力与联系入口 |
| Solutions | `/solutions/` | 按场景分类：船用、工厂、高温、防爆等 |
| About | `/about/` | 公司简介、使命、团队与工厂 |
| News | `/news/` | 产品动态与公司新闻（低频更新） |
| FAQ | `/faq/` | 常见问题（独立页面） |
| Contact | `/contact/` | Email、电话、WhatsApp、微信、QQ 及咨询表单 |

站点支持 **三语切换（English / 中文 / Русский）**，语言偏好会在浏览器本地保存。

---

## 仓库结构

本仓库采用**核心应用 + 文档**双层布局：

```text
web-greengas/
├── frontend/       # 网站源码（Vite + TypeScript + SCSS）
├── docs/           # 项目文档、需求记录、AI 开发指导
├── templates/      # 第三方静态模板，仅作设计参考，不参与构建
└── .cursor/        # IDE 协作规则
```

| 目录 | 说明 |
|------|------|
| [`frontend/`](./frontend/) | 所有页面、组件、样式、数据与构建配置 |
| [`docs/`](./docs/) | [交流文档](./docs/交流文档.md)、[AI 开发指导](./docs/AI开发指导.md)、[用户画像](./docs/用户画像-北美工业客户.md) |
| [`templates/`](./templates/) | 开源 HTML 模板集合，供布局参考 |

---

## 技术栈

**当前阶段（第一阶段）**

- [Vite](https://vite.dev/) — 构建与开发
- TypeScript — 类型安全
- SCSS — 样式模块化
- JSON — 案例、产品、公司信息等结构化数据
- 多页静态站点（MPA），无 React / Vue 等 UI 框架
- 自研轻量 i18n 层 — EN / 中文 / Русский 三语，无第三方依赖

内容列表（案例、产品、FAQ 等）通过 JSON 驱动渲染，便于后续扩展而无需改动页面结构。

页面由可复用组件拼装（Navbar、Hero 轮播、产品/项目卡片、能力数据条、语言切换器、回到顶部等），UI 文案集中在 `src/i18n/locales/*.json`，结构化内容多语言字段以 `_zh` / `_ru` 后缀存放（缺省回退英文）。

---

## 本地开发

需安装 [Node.js](https://nodejs.org/)（建议 LTS）。

```bash
cd frontend
npm install
npm run dev       # 启动开发服务器
npm run build     # 生产构建，输出至 frontend/dist/
npm run preview   # 预览构建结果
```

---

## 部署（预留）

推荐 [Cloudflare Pages](https://pages.cloudflare.com/)：

- **Root directory：** `frontend`
- **Build command：** `npm run build`
- **Output directory：** `dist`

---

## 设计原则（摘要）

- **风格：** Modern Industrial Professional — 白底、克制、专业
- **品牌色：** `#163B31` · `#0F2E25` · `#A8FF60`
- **文案：** 面向北美工业买家的 Plain Business English；Show, don't claim
- **目标：** 10 秒内回答「做什么 / 能否解决我的问题 / 如何联系」

完整设计规范见 [`.cursor/rules/website-design.mdc`](./.cursor/rules/website-design.mdc) 与 [`docs/`](./docs/) 目录。

---

## 文档索引

- [交流文档](./docs/交流文档.md) — 立项背景、甲方需求与变更记录
- [AI 开发指导](./docs/AI开发指导.md) — 技术架构、目录约定与阶段约束（供 AI / 协作者阅读）
- [用户画像：北美工业客户](./docs/用户画像-北美工业客户.md) — 目标用户与信任模型

---

## 项目状态

当前处于**第一阶段**：页面骨架与核心组件已搭建，首页、Contact、FAQ 等页面完成改版，三语切换（EN / 中文 / Русский）已接入；部分内容与图片仍为占位素材。后续将替换真实素材、完善视觉细节，并按需接入 EmailJS 表单与 Cloudflare 部署。
