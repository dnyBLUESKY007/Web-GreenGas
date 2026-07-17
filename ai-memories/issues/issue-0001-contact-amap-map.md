---
id: 0001
status: open
priority: medium
tags: [contact, map, frontend]
created: 2026-06-24
related: [productContext.md, techContext.md]
---
# Contact 页接入高德地图地址展示

- **现象**：Contact 页（`/contact/`）仅有 Email / 电话 / 微信等渠道卡片，缺少公司物理地址文字与可交互地图
- **期待**：页面内嵌高德 JS API 2.0 交互地图（缩放、拖拽、Marker）+ 三语地址文字；可选「在 Google Maps 中打开」外链服务北美访客
- **参考**：http://www.entezl.com/contact（国内 B2B 工业官网联系页：地址文字 + 内嵌交互地图）
- **背景**：纯前端能力，无需后端；工厂在国内，兼顾国内客户找厂址；经纬度写死 JSON 最省配额

## 架构约束

| 问题 | 结论 |
|------|------|
| 是否需要后端？ | **否** |
| 是否改成 SSR/动态站？ | **否**，保持 Vite MPA + Cloudflare Pages |
| Key 安全 | Vite env（`VITE_AMAP_KEY` / `VITE_AMAP_SECURITY_CODE`），**不得提交 Git**；高德控制台配置域名白名单 |

## 地图选型（兼顾北美访客）

| 方案 | 国内访客 | 海外访客 | 建议 |
|------|----------|----------|------|
| 高德 JS API | 体验好 | 可能慢、数据偏国内 | 工厂在国内时合理 |
| Google Maps 链接 / 嵌入 | 国内受限 | 体验好 | 可作「Open in Google Maps」外链 |
| 纯文字地址 | 通用 | 通用 | 最低成本兜底 |

**推荐组合**：高德交互地图 + 三语地址文字 + 可选 Google Maps 外链（`https://www.google.com/maps/search/?api=1&query=...`）

## 高德开放平台准备

1. 注册 [高德开放平台](https://lbs.amap.com/) 开发者账号
2. 创建应用，申请 **Web 端（JS API）Key**
3. 配置 **域名白名单**（生产域名 + `localhost`）
4. 配置 **安全密钥（securityJsCode）** — JS API 2.0 强制要求
5. 正式商用建议 **企业认证**，月配额高于个人开发者

**计费**：月配额 + 超出按量计费；Contact 页低流量、单点标注、无搜索/路线，通常落在免费配额内。经纬度写死 → 不调地理编码 → 最省配额。

## Implementation Notes

### 数据层

扩展 `frontend/src/data/company.json` 新增 `location` 字段（`address` / `address_zh` / `address_ru`、`lng`、`lat`、`zoom`）；坐标系 **GCJ-02**。同步更新 `CompanyData` / `CompanyLocation` 类型。

### 组件层

新建 `frontend/src/components/contact-map/ContactMap.ts`（或 `renderContactMap.ts`），签名：

```typescript
export function initContactMap(container: HTMLElement, location: CompanyLocation): void;
```

加载前设置 `window._AMapSecurityConfig`；`AMapLoader.load({ key, version: '2.0' })` 后初始化 Map + Marker；加载失败降级为文字地址 + 外链。

**依赖选择**：npm `@amap/amap-jsapi-loader`（类型友好）或 CDN `loader.js` + 轻量 `amap.d.ts`（零依赖）。

### 页面布局

在 `contact/index.ts` 现有 `contact-layout` 下方新增 `section.contact-map-section`（全宽地图 + 地址文字），避免挤压表单双栏。

### 样式 / i18n / env

- `_contact-map.scss` → `main.scss` 引入
- `i18n/locales/{en,zh,ru}.json` 增加 `contact.map.*` 文案
- `frontend/.env.example` 文档化 `VITE_AMAP_KEY` / `VITE_AMAP_SECURITY_CODE`

## 轻量备选（若甲方不想注册高德）

1. **高德静态地图 API** — 图片 + 地址文字，几乎无交互
2. **高德「分享到网页」iframe** — 最快，样式不可控
3. **仅文字地址 + Google Maps 搜索链接** — 零 API、零配额，海外友好

正式品牌站仍推荐 JS API 2.0 交互地图。

## 实现检查清单

- [ ] 甲方提供真实地址与 GCJ-02 经纬度（或确认使用占位地址）
- [ ] 高德 Key + securityJsCode 已申请，域名白名单已配置
- [ ] `company.json` 增加 `location` 字段
- [ ] `CompanyData` / `CompanyLocation` 类型更新
- [ ] `ContactMap.ts` 实现地图初始化与降级
- [ ] `contact/index.ts` 挂载地图区块
- [ ] `_contact-map.scss` 样式
- [ ] i18n 文案（en / zh / ru）
- [ ] `.env.example` 文档化环境变量
- [ ] 本地 `npm run dev` 验证地图渲染
- [ ] `npm run build` 验证生产构建无报错
- [ ] 确认 Key 未出现在 git diff 中
- [ ] （可选）Google Maps 外链
- [ ] （可选）页脚 About/Contact 同步展示地址

## 开放问题（实现前与甲方确认）

1. 真实厂址与坐标 — 当前联系方式均为占位数据
2. 是否同时提供 Google Maps 外链
3. 地图放置位置 — 建议表单下方独立 section 全宽
4. 是否企业认证高德账号
5. 多语言地址 — 工厂在中国时通常中英即可
