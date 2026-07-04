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

本仓库采用**核心应用 + 数字大脑**双层布局：

```text
web-greengas/
├── frontend/       # 网站源码（Vite + TypeScript + SCSS）
├── templates/      # 第三方静态模板，仅作设计参考，不参与构建
└── .cursor/        # IDE 协作规则、记忆库、任务与 issue
```

| 目录 | 说明 |
|------|------|
| [`frontend/`](./frontend/) | 所有页面、组件、样式、数据与构建配置 |
| [`.cursor/memories/`](./.cursor/memories/) | 项目记忆库（架构、进展、甲方需求、参考站点等） |
| [`templates/`](./templates/) | 开源 HTML 模板集合，供布局参考 |

---

## 图片资源

### OSS 存储

图片统一托管在阿里云 OSS，CDN 基址通过 `frontend/src/config/assets.ts` 集中管理：

```ts
// frontend/src/config/assets.ts
export const CDN_BASE = 'https://web-greengas.oss-cn-qingdao.aliyuncs.com/resources';
export function cdnUrl(category: string, filename: string): string {
  return `${CDN_BASE}/${category}/${filename}`;
}
```

代码中引用图片时统一使用 `cdnUrl(category, filename)`，**不写死 URL 字符串**，便于迁移 CDN 或切换 OSS bucket。

### 目录分类

OSS 上按类别分目录，路径格式为 `{CDN_BASE}/{category}/{filename}.webp`：

| 类别（category） | 文件数 | 用途 |
|---|---|---|
| `hero` | 4 | 首页 Hero 轮播背景图 |
| `products` | 27 | 所有产品图片（中央空调 + 工业空调） |
| `projects` | 43 | 过往项目照片与案例素材 |
| `company` | 2 | 公司外观（实拍图 + 渲染图） |
| `company-info` | 3 | 团队合照、发展历程时间轴图片 |
| `certifications` | 2 | CE 认证、ISO9001 认证扫描件 |

### 产品图片命名规则

产品图片文件名与该产品在 `products.json` 中的 `id` 字段对齐。多角度图片用 `-01`、`-02` 后缀区分，有室内/室外区分的用 `-indoor` / `-outdoor` 后缀：

| products.json `id` | OSS 文件名 | 说明 |
|---|---|---|
| `variable-speed-air-cooled-chiller` | `variable-speed-air-cooled-chiller-01.webp` | 多角度（3张），列表取第一张 |
| `water-cooled-screw-unit` | `water-cooled-screw-unit.webp` | 单张 |
| `air-handling-unit` | `air-handling-unit-01.webp` | 多角度（3张），列表取第一张 |
| `magnetic-bearing-chiller` | `magnetic-bearing-chiller-01.webp` | 多角度（气悬浮1/2） |
| `energy-recovery-unit` | `energy-recovery-unit-01.webp` | 多角度（能量回收1/2） |
| `industrial-air-cooled-cabinet` | `industrial-air-cooled-cabinet-indoor.webp` | 室内/室外均有 |
| `constant-temp-humidity-unit` | `constant-temp-humidity-unit-indoor.webp` | 室内/室外均有 |
| `high-temperature-ac` | `high-temperature-ac-indoor.webp` | 室内/室外均有 |

### 添加新图片

1. 将新图片放入 `ignored/resources/{category}/`
2. 更新 `ignored/image-rename-map.json`（完整映射表，77 条）
3. 运行 `python ignored/rename_images.py` 重命名并复制到新结构
4. 上传到 OSS `resources/{category}/`
5. 在代码中通过 `cdnUrl(category, new-filename.webp)` 引用

映射表备份在 `ignored/image-rename-map.json`，具有中英文完整对照。

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

完整设计规范见 [`.cursor/rules/project-related/website-design.mdc`](./.cursor/rules/project-related/website-design.mdc)。

---

## 文档索引（`.cursor/memories/`）

- [activeContext.md](./.cursor/memories/activeContext.md) — 当前焦点与下一步
- [stakeholder-comms.md](./.cursor/memories/stakeholder-comms.md) — 立项背景、甲方需求与变更记录
- [productContext.md](./.cursor/memories/productContext.md) — 目标用户与信任模型
- [techContext.md](./.cursor/memories/techContext.md) — 技术栈、环境变量与本地开发
- [systemPatterns.md](./.cursor/memories/systemPatterns.md) — 架构模式与 ADR 索引

---

## 项目状态

当前处于**第一阶段**：页面骨架与核心组件已搭建，首页、Contact、FAQ 等页面完成改版，三语切换（EN / 中文 / Русский）已接入；部分内容与图片仍为占位素材。后续将替换真实素材、完善视觉细节，并按需接入 EmailJS 表单与 Cloudflare 部署。
