# TODO（AI 协作用）

> **用途：** 本文件仅供 AI / 协作者阅读，记录待办需求、已达成共识的方案与实现细节。  
> **维护：** 完成任务后更新状态；新增需求时追加章节，勿删除历史决策记录。

---

## [待办] Contact 页接入高德地图地址展示

**状态：** `pending`  
**提出时间：** 2026-06-24  
**优先级：** 中（Contact 页信息完整性，兼顾国内客户找厂址）

---

### 1. 用户需求（原文意图）

用户希望在当前 GREENGAS 官网 **Contact 页**（`/contact/`）增加**高德地图地址展示**，视觉效果参考竞品站点：

- 参考 URL：<http://www.entezl.com/contact>
- 参考效果特征：
  - 联系页除 Email / 电话 / 微信等渠道外，展示**公司物理地址文字**
  - 页面内嵌**可交互地图**（缩放、拖拽），标注公司位置
  - 典型国内 B2B 工业官网联系页布局（恩特制冷由易赛诺建站系统托管，地图多为高德 JS API 嵌入）

用户同时关心的架构问题（已澄清，见第 2 节）：

1. 是否只需接入高德 API？
2. 高德是否收费？
3. 是否必须把静态站改成动态站、增加后端？

---

### 2. 架构决策（已达成共识）

| 问题 | 结论 |
|------|------|
| 是否需要后端？ | **否**。固定厂址 + 地图标点属于纯前端能力。 |
| 是否要改成动态站 / SSR？ | **否**。保持现有 Vite MPA 静态构建，部署 Cloudflare Pages 不变。 |
| 是否违背第一阶段约束？ | **否**。`docs/AI开发指导.md` 明确第一阶段「勿自建后端」；地图与 EmailJS 表单同属客户端集成。 |
| 页面是否已具备「动态渲染」能力？ | **是**。Contact 页已由 TypeScript 在浏览器渲染（`frontend/src/pages/contact/index.ts`），加地图只是新增一个渲染模块。 |

**明确不做（本需求范围内）：**

- 不自建 Node / Cloudflare Worker 代理高德 API
- 不引入 CMS / 多门店后台
- 不做访客输入地址后的实时路线规划（若未来需要，再评估服务端代理或 Key 隔离）

---

### 3. 高德地图：接入范围与计费说明

#### 3.1 需要接入的能力

| API / 能力 | 是否必须 | 用途 |
|------------|----------|------|
| [地图 JS API 2.0](https://lbs.amap.com/api/javascript-api-v2/tutorails/display-a-map) | **是** | 页面内嵌交互地图、Marker、可选 InfoWindow |
| 地理编码（地址 → 经纬度） | **可选** | 仅当没有经纬度、只有地址文字时需要；**推荐人工查一次坐标写入 JSON，避免每次打开页面调 API** |
| 路径规划 / POI 搜索 / 定位 | **否** | Contact 页不需要 |

#### 3.2 开放平台准备（需甲方 / 运维完成，代码无法代填）

1. 注册 [高德开放平台](https://lbs.amap.com/) 开发者账号
2. 创建应用，申请 **Web 端（JS API）Key**
3. 配置 **域名白名单**（生产域名 + 本地开发 `localhost`）
4. 配置 **安全密钥（securityJsCode）** — JS API 2.0 强制要求，需在加载前设置 `window._AMapSecurityConfig`
5. 正式商用建议 **企业认证**，月配额高于个人开发者

#### 3.3 计费与配额（供评估，以控制台实时政策为准）

- 高德**非无限免费**，采用 **月配额 + 超出按量计费**（2025-05-20 起政策有调整，详见 [服务升级说明](https://lbs.amap.com/upgrade)）
- 企业官网 Contact 页：**低流量、单点标注、无搜索/路线**，通常落在免费配额内，实际费用多为 0 或极低
- 容易消耗配额的是：地理编码、搜索、路线规划等 **Web 服务 API**；纯展示地图 + Marker 消耗很小
- **实现策略：** 经纬度写死 → 不调地理编码 → 最省配额、最简单

#### 3.4 Key 安全

- Web Key 出现在前端 bundle 是**正常做法**（与 Google Maps 相同）
- 必须通过高德控制台 **域名白名单** 限制调用来源
- Key / securityJsCode **不得提交进 Git**；使用 Vite 环境变量（见第 5 节）

---

### 4. 目标用户与地图选型备注

项目主用户画像为 **北美工业买家**（见 `docs/用户画像-北美工业客户.md`、`README.md`）。

| 方案 | 国内访客 | 海外访客 | 建议 |
|------|----------|----------|------|
| 高德 JS API | 体验好 | 可能慢、数据偏国内 | 工厂在国内、需给国内客户看厂址时合理 |
| Google Maps 链接 / 嵌入 | 国内受限 | 体验好 | 可作补充「Open in Google Maps」外链 |
| 纯文字地址 | 通用 | 通用 | 最低成本兜底 |

**推荐组合（实现时可与甲方确认）：**

- 主展示：高德交互地图 + 中英俄地址文字（与现有多语言体系一致）
- 补充：地址旁增加「在 Google Maps 中打开」链接（`https://www.google.com/maps/search/?api=1&query=...`），服务北美访客
- 若甲方仅服务国内客户，可只做高德，不加 Google 链接

---

### 5. 推荐实现方案（技术细节）

#### 5.1 数据层：扩展 `company.json`

当前 `frontend/src/data/company.json` **无地址字段**，仅有 `contact` 渠道数组。建议新增：

```json
{
  "location": {
    "address": "Full address in English",
    "address_zh": "中文地址",
    "address_ru": "俄文地址（如需要）",
    "lng": 121.123456,
    "lat": 29.123456,
    "zoom": 15
  }
}
```

- `lng` / `lat`：高德坐标系为 **GCJ-02**（火星坐标），勿与 WGS-84 混用
- 坐标获取方式：高德开放平台「坐标拾取器」或一次性调用地理编码 API 后写入 JSON
- 同步更新 `frontend/src/types/index.ts` 中 `CompanyData` 接口，新增 `CompanyLocation` 类型

#### 5.2 组件层：新建地图模块

建议路径（二选一，保持与现有组件风格一致）：

- `frontend/src/components/contact-map/ContactMap.ts` — 推荐，与 `ContactForm.ts` 同级
- 或 `frontend/src/pages/contact/renderContactMap.ts` — 与 `renderContactChannels` 同级

**函数签名建议：**

```typescript
export function initContactMap(container: HTMLElement, location: CompanyLocation): void;
```

**实现要点：**

1. 使用官方 Loader（二选一）：
   - `@amap/amap-jsapi-loader`（npm 依赖，需评估是否新增 package）
   - 或 CDN `https://webapi.amap.com/loader.js` + 动态 import 模式
2. 加载前设置：
   ```typescript
   window._AMapSecurityConfig = { securityJsCode: import.meta.env.VITE_AMAP_SECURITY_CODE };
   ```
3. `AMapLoader.load({ key, version: '2.0' })` 后：
   - `new AMap.Map(container, { center: [lng, lat], zoom })`
   - `new AMap.Marker({ position: [lng, lat], title: company.name })`
   - 可选 `AMap.InfoWindow` 显示 `td(location, 'address')`
4. 容器需有明确高度（如 `min-height: 320px`），否则地图不显示
5. 地图仅在中国境外交互需求弱时，可设置 `resizeEnable: true`，监听容器尺寸
6. 加载失败时降级：显示文字地址 + 外链，勿白屏

#### 5.3 页面布局：修改 Contact 页

当前结构（`frontend/src/pages/contact/index.ts`）：

```
page-header
└── section.contact-layout
    ├── #contact-channels  （renderContactChannels）
    ├── contact-form       （createContactForm）
    └── faq-link
```

**建议布局（与 entezl 类站点对齐）：**

```
page-header
└── section（联系渠道 + 表单，保持现有 contact-layout）
└── section.contact-map-section（新增，全宽或 container 内）
    ├── section title（可选：「Visit Us」/「公司地址」）
    ├── #contact-map（地图容器）
    └── .contact-address（地址文字，支持 i18n）
```

或把地图放在 `contact-layout` 下方作为第二块 `section`，避免挤压表单双栏布局。具体样式参考 `website-design.mdc`：白底、克制、无花哨动效。

#### 5.4 样式

- 新建 `frontend/src/styles/components/_contact-map.scss`
- 在 `frontend/src/styles/main.scss` 中 `@use` 引入
- 地图容器：`border-radius` 与现有 card 一致；边框浅灰；移动端全宽

#### 5.5 国际化

在 `frontend/src/i18n/locales/{en,zh,ru}.json` 增加例如：

- `contact.map.eyebrow`
- `contact.map.title`
- `contact.map.openInGoogle`（若做 Google 外链）

地址正文来自 `company.json` 的 `td(location, 'address')`，与现有 `td()` 模式一致。

#### 5.6 环境变量

在 `frontend/` 下（不提交 `.env`）：

```env
VITE_AMAP_KEY=xxxxxxxx
VITE_AMAP_SECURITY_CODE=xxxxxxxx
```

- 在 `frontend/.env.example` 中留占位说明（可提交）
- 确保 `.gitignore` 已忽略 `.env`
- Cloudflare Pages 构建时在 Environment variables 配置同名变量

#### 5.7 依赖决策

| 方式 | 优点 | 缺点 |
|------|------|------|
| npm `@amap/amap-jsapi-loader` | 类型友好、与 Vite 打包一致 | 多一个依赖 |
| CDN loader.js | 零依赖、按需加载 | 需处理类型声明 `amap.d.ts` |

**倾向：** 若项目严格控制依赖，用 CDN + 轻量类型声明；否则 npm loader 更省心。

---

### 6. 轻量备选方案（若甲方不想注册高德）

按优先级：

1. **高德静态地图 API** — 一张图片 + 地址文字，几乎无交互，配额规则不同
2. **高德「分享到网页」iframe** — 最快，样式不可控，与品牌 UI 难统一
3. **仅文字地址 + Google Maps 搜索链接** — 零 API、零配额，海外友好

正式品牌站仍推荐 JS API 2.0 交互地图。

---

### 7. 实现检查清单（AI 执行时用）

- [ ] 甲方提供真实地址与 GCJ-02 经纬度（或确认使用占位地址）
- [ ] 高德 Key + securityJsCode 已申请，域名白名单已配置
- [ ] `company.json` 增加 `location` 字段
- [ ] `CompanyData` / `CompanyLocation` 类型更新
- [ ] `ContactMap.ts`（或 `renderContactMap.ts`）实现地图初始化与降级
- [ ] `contact/index.ts` 挂载地图区块
- [ ] `_contact-map.scss` 样式
- [ ] i18n 文案（en / zh / ru）
- [ ] `.env.example` 文档化环境变量
- [ ] 本地 `npm run dev` 验证地图渲染
- [ ] `npm run build` 验证生产构建无报错
- [ ] 确认 Key 未出现在 git diff 中
- [ ] （可选）Google Maps 外链
- [ ] （可选）页脚 About/Contact 同步展示地址

---

### 8. 相关文件索引

| 文件 | 说明 |
|------|------|
| `README.md` | 项目概述，第一阶段静态站定位 |
| `docs/AI开发指导.md` | 架构约束：MPA、JSON 驱动、勿自建后端 |
| `docs/用户画像-北美工业客户.md` | 地图选型需兼顾海外访客 |
| `.cursor/rules/website-design.mdc` | Contact 页应显著展示联系方式与地址 |
| `frontend/src/pages/contact/index.ts` | Contact 页入口，需挂载地图 |
| `frontend/src/pages/contact/renderContact.ts` | 现有渠道卡片渲染 |
| `frontend/src/data/company.json` | 需扩展地址与坐标 |
| `frontend/src/types/index.ts` | 需扩展 `CompanyData` |
| `frontend/src/components/contact-form/ContactForm.ts` | 并列组件参考 |
| `frontend/vite.config.ts` | MPA 入口含 `contact/index.html` |

---

### 9. 开放问题（实现前与甲方确认）

1. **真实厂址与坐标** — 当前 `company.json` 联系方式均为占位数据，地址 likewise 需甲方提供
2. **是否同时提供 Google Maps 外链** — 取决于北美客户占比与甲方意愿
3. **地图放置位置** — 表单下方独立 section vs. 与渠道卡片同栏（建议独立 section 全宽）
4. **是否企业认证高德账号** — 影响配额与商用合规
5. **多语言地址** — 是否需提供俄文/英文不同表述的地址（工厂在中国时通常中英即可）

---

## 变更日志

| 日期 | 变更 |
|------|------|
| 2026-06-24 | 创建本文件；记录 Contact 页高德地图需求与完整实现方案 |
