*本文档随项目阶段推进更新。进入第二阶段（Astro 迁移）时，须同步修订第 2、3、8、11 节。*

# GREENGAS 官网 — AI 开发指导

> **用途：** 供 Cursor、Claude Code、Copilot 等 AI 助手在维护本项目时阅读。  
> **当前阶段：** 第一阶段（开始阶段）— 优先完成框架搭建与基础内容实现。  
> **工作目录：** 网站源码在 `frontend/`；本文档与协作文档在 `docs/`。  
> **相关文档：** [交流文档](./交流文档.md) · [用户画像-北美工业客户](./用户画像-北美工业客户.md) · `.cursor/rules/website-design.mdc`

---

## 0. 仓库双层结构（必读）

本仓库采用**核心应用 + 文档**双层布局。AI 助手修改代码时必须在正确目录下操作：

```text
web-greengas/                    # 仓库根目录
├── frontend/                    # ★ 核心应用（Vite 工程，所有站点源码在此）
│   ├── index.html
│   ├── about/ | solutions/ | contact/ | news/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── docs/                        # ★ 文档（交流记录、AI 指导、用户画像等）
├── templates/                   # 第三方参考模板，不参与构建
└── .cursor/rules/               # IDE 设计规范（自动生效）
```

| 目录 | 用途 | AI 是否可改 |
|------|------|------------|
| `frontend/` | 官网源码、构建、静态资源 | ✅ 主要工作区 |
| `docs/` | 项目文档、需求、AI 指导 | ✅ 按任务更新 |
| `templates/` | 布局参考 | ❌ 只读参考 |
| `.cursor/` | 规则与技能 | ⚠️ 除非用户要求 |

**本地命令均在 `frontend/` 下执行：**

```bash
cd frontend
npm run dev      # 开发
npm run build    # 构建 → frontend/dist/
npm run preview  # 预览
```

**Cloudflare Pages 部署时**，构建根目录（Root directory）设为 `frontend`，输出目录为 `dist`。

## 1. 项目定位

GREENGAS 是一家面向企业 / 政府客户的**工业制冷 / HVAC 定制解决方案**供应商。官网本质是：

```text
展示内容 → 用户阅读 → 联系企业
```

**不是**复杂交互系统。不要引入不必要的框架、状态管理或过度工程化。

站点目标：建立信任、展示工程能力、引导潜在客户发起联系。设计原则见 `.cursor/rules/website-design.mdc`（Modern Industrial Professional，克制、白底、专业）。

---

## 2. 技术演进路线（三阶段）

AI 助手必须理解当前所处阶段，**不要提前引入后续阶段的技术**。

### 第一阶段 — 当前（快速交付高质量静态官网）

```text
Vite + TypeScript + SCSS
```

- **不引入** React、Vue、Next.js、Astro 等前端框架
- 纯静态站点工程，非「几个散落的 HTML 文件」
- 目标：框架搭建、页面骨架、基础组件、JSON 数据层、占位内容

### 第二阶段 — 未来约半年（内容扩展）

当需要以下能力时再升级至 **Astro**（非 React）：

- 案例 / 产品 / 新闻管理
- 多语言（i18n）
- 增强 SEO
- 博客

Astro 优势：纯静态 HTML 输出、SEO 友好、适合企业官网 / Blog / Docs，且可混用 HTML + 各框架组件。

### 第三阶段 — 远期（业务系统）

若发展成客户后台、CRM、订单系统等，再考虑 **Next.js** 或 **React**。

---

## 3. 当前技术栈（第一阶段）

| 类别 | 选型 | 说明 |
|------|------|------|
| 构建工具 | Vite | 开发体验与构建速度 |
| 语言 | TypeScript | 类型安全，遵循 `.cursor/rules/typescript-core.mdc` |
| 样式 | SCSS | 模块化样式，按 base / layout / components / pages 分层 |
| 数据 | JSON | 案例、产品、公司信息等结构化存储 |
| 表单（预留） | EmailJS | 无服务器发信，第一阶段可用 |
| 动效 | GSAP 或 AOS | 仅 Fade In、Slide Up、Counter；禁止 Three.js / 粒子 / WebGL |
| 部署（预留） | Cloudflare Pages | GitHub Push → 自动部署 |

**当前阶段禁止：**

- 引入 React / Vue / Svelte 等 UI 框架
- 搭建 CMS 后台
- 实现多语言路由
- 过度动画或装饰性动效
- 在 HTML 中硬编码可复用的列表型内容（案例、产品等）

---

## 4. 推荐目录结构

以下为 `frontend/` 内的应用结构（路径均相对于 `frontend/`）：

```text
frontend/
├── public/
│   ├── images/
│   │   ├── projects/      # 案例图
│   │   ├── solutions/     # 解决方案图
│   │   └── company/       # 公司 / 工厂图
│   ├── icons/
│   └── favicon.svg
├── src/
│   ├── pages/
│   │   ├── home/
│   │   ├── about/
│   │   ├── solutions/
│   │   ├── projects/      # 案例渲染模块（供 Home 等页复用）
│   │   ├── contact/
│   │   └── news/
│   ├── components/
│   │   ├── navbar/
│   │   ├── footer/
│   │   ├── hero/
│   │   ├── project-card/
│   │   ├── section-title/
│   │   └── contact-form/
│   ├── styles/
│   │   ├── base/
│   │   ├── layout/
│   │   ├── components/
│   │   └── pages/
│   ├── data/
│   │   ├── projects.json
│   │   ├── products.json
│   │   └── company.json
│   ├── config/
│   └── types/
├── index.html             # Home 入口
├── about/index.html
├── solutions/index.html
├── contact/index.html
├── news/index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

仓库根目录的 `templates/` 为第三方参考模板，**不参与 `frontend/` 构建**，仅作布局与样式参考。

---

## 5. 数据层原则

列表型、重复性内容**必须**来自 JSON，禁止写死在 HTML 中。

**示例 `projects.json`：**

```json
[
  {
    "name": "Factory Cooling Upgrade",
    "industry": "Manufacturing",
    "location": "Texas"
  }
]
```

页面通过 TypeScript 函数（如 `renderProjects()`）动态渲染。新增案例时只改 JSON，不改页面结构。

同理适用于：`products.json`（按场景分类的解决方案）、`company.json`（公司简介、联系方式、FAQ 等）。

---

## 6. 图片管理

**命名规范（语义化 + WebP 优先）：**

```text
factory-cooling-01.webp
data-center-02.webp
lab-hvac-01.webp
```

**禁止：** `IMG_20240616.jpg` 等相机原始文件名。

**目录：** 按用途分 `frontend/public/images/projects/`、`solutions/`、`company/`。必要展示位可先用占位图，后续替换为实拍素材（见 [交流文档](./交流文档.md)）。

---

## 7. 站点信息架构

与甲方需求及设计规则对齐，AI 修改页面时**不得随意增删顶层模块**。

| 页面 | 路径（建议） | 核心内容 |
|------|-------------|----------|
| Home | `/` | Hero（一句话业务）→ 产品种类 → 过往项目 → 优势 → 联系入口；**图为主、字少** |
| Solutions | `/solutions` | 按使用场景分类：船用、工厂、高温、防爆等；可展开案例详情（痛点 + 方案） |
| About | `/about` | 历史、使命、团队、工厂图 |
| Contact | `/contact` | Email、WhatsApp、微信、QQ、电话 + FAQ |
| News | `/news` | 低频更新（产品动态、公司新闻）；第一阶段可留骨架 |

首页模块顺序参考：`Hero → Solutions → Industries → Projects → Advantages → Contact`

---

## 8. 联系表单

### 第一阶段

```text
Visitor → Contact Form → EmailJS → 企业邮箱
```

无需自建服务器。

### 第二阶段（预留，当前不实现）

```text
Contact Form → Cloudflare Worker → Resend → 企业邮箱
```

---

## 9. SEO 预留

每个页面须预留完整 meta，即使第一阶段内容尚简：

```html
<title>Industrial HVAC Solutions | GREENGAS</title>
<meta name="description" content="..." />
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="..." />
```

目标关键词方向：`industrial cooling solutions`、`custom HVAC` 等。文案遵循 `.cursor/rules/website-design.mdc` 中的 Plain NA Business English 规范。

---

## 10. 动效规范

**允许：** Navbar 吸顶、Scroll Reveal（Fade In / Slide Up）、数字增长 Counter。

**禁止：** Three.js、粒子背景、WebGL、满屏装饰动画。工业客户关注专业与清晰，不关注炫技。

---

## 11. 部署架构（预留）

```text
GitHub → Push → Cloudflare Pages（Root: frontend/）→ Auto Deploy
```

第一阶段本地开发与构建优先；部署配置可在框架稳定后再接入。构建命令：`cd frontend && npm run build`，产物在 `frontend/dist/`。

---

## 12. 当前阶段工作重点

AI 助手在本阶段应**优先**完成以下事项（均在 `frontend/` 内）：

1. **维护 Vite + TypeScript + SCSS 工程**
2. **搭建 / 完善目录结构与构建配置**
3. **实现全局组件：** Navbar、Footer、SectionTitle
4. **实现各页面骨架**（Home / Solutions / About / Contact / News 占位）
5. **建立 JSON 数据层**（`frontend/src/data/`）及基础渲染逻辑
6. **引入品牌色与排版变量**（`#163B31`、`#0F2E25`、`#A8FF60`）
7. **预留 SEO meta 与表单接口位**
8. **使用占位图与占位文案**，保证页面可浏览、结构完整

**延后至第二阶段：** 多语言、CMS、Astro 迁移、Cloudflare Worker 表单、博客完整功能。

---

## 13. AI 协作文档体系

**代码在 `frontend/`，文档在 `docs/`**，二者分离、互相引用：

| 路径 | 用途 |
|------|------|
| `docs/交流文档.md` | 甲方沟通、立项背景、实时需求变更 |
| `docs/AI开发指导.md` | 本文件 — 技术栈、架构、阶段约束 |
| `docs/用户画像-北美工业客户.md` | 目标用户与信任模型 |
| `.cursor/rules/website-design.mdc` | 视觉、文案、信息架构设计原则（自动生效） |

未来可补充：`design-principles.md`、`brand-guidelines.md`、`website-structure.md`、`content-strategy.md`（内容可与上述文件合并或拆分，以不重复、易维护为准）。

---

## 14. 代码与协作约定

- 遵循 `.cursor/rules/` 下 TypeScript、命名、Git、文档、安全等规范
- 组件文件命名 PascalCase，Props 接口 `{ComponentName}Props`
- 函数保持精简（< 50 行），避免过度抽象
- 修改前先读周边代码，匹配现有风格
- **最小 diff：** 只改与任务相关的文件，不附带无关重构
- Git 提交格式：`<type>(<scope>): <subject>`，不自动 commit，等用户确认

---

## 15. 快速决策表

| 场景 | 当前阶段做法 |
|------|-------------|
| 新增案例展示 | 编辑 `frontend/src/data/projects.json` + 复用 `project-card` 组件 |
| 新增解决方案分类 | 编辑 `frontend/src/data/products.json` + Solutions 页渲染 |
| 修改品牌色 / 字体 | 改 `frontend/src/styles/base/` 下 SCSS 变量 |
| 访客提交询盘 | 第一阶段接 EmailJS；勿自建后端 |
| 需要 React 组件 | **拒绝**，用 TypeScript + DOM 或 HTML 模板 |
| 需要 CMS | **延后**，当前用 JSON |
| 参考布局 | 查阅根目录 `templates/`，不直接复制进 `frontend/src/` |
| 运行开发服务器 | `cd frontend && npm run dev` |

---

