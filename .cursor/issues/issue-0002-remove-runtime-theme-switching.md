---
id: 0002
status: open
priority: low
tags: [ui, theme, cleanup, frontend]
created: 2026-07-11
related: [0005-runtime-theme-switching.md]
---
# 移除运行时主题切换（废弃功能清理）

- **现象**：导航栏主题切换按钮（`theme-switcher__btn`）已下线，站点固定使用品牌青绿主题 `emerald-lime`；但 `ThemeSwitcher` 组件、`theme/index.ts` 多主题 API、`onThemeChange` 订阅、SCSS 多 scheme 变量与 i18n 文案仍留在代码库中
- **期待**：彻底删除运行时主题切换能力，CSS 变量与 HTML `data-theme` 收敛为单一品牌配色；移除 dead code 与 `localStorage` 键 `gg_theme`
- **背景**：ADR-0005 为 v2/v3 演示对比而引入 accent 切换；生产已选定 `emerald-lime`（主色 `#163B31` + 点缀 `#A8FF60`），多主题无业务价值且增加维护面

## 清理清单

- [ ] 删除 `frontend/src/components/theme-switcher/`
- [ ] 删除 `frontend/src/styles/components/_theme-switcher.scss` 及 `main.scss` 引用
- [ ] 简化 `frontend/src/theme/index.ts`（或整模块删除，改由 `_variables.scss` 静态定义）
- [ ] 移除 `Theme` 联合类型及 `emerald-steel` / `emerald-gold` CSS 块
- [ ] 移除 `mountLayout.ts` 中 `onThemeChange` 订阅
- [ ] 移除 i18n `theme.lime` / `theme.steel` / `theme.gold`
- [ ] 各页 `index.html` 去掉 `data-theme` 属性（或保留单一值）
- [ ] 归档或更新 ADR-0005 为「已退役」
