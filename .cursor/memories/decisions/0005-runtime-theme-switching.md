# ADR-0005: 运行时 CSS 变量主题切换

- **状态**：已采纳
- **日期**：2026-07-03

## 背景

开发过程中实验了 v2（Chinese industrial power skin）和 v3（modern fusion skin）两个独立构建变体，通过 nginx 多版本对比选型。v3 被采纳为生产基线，但甲方仍希望保留 accent 色切换能力供演示。

## 决策

将 v2/v3 的差异**合并为运行时主题切换**：主色 `#163B31` / `#0F2E25` 固定，accent 通过 CSS 自定义属性在 `emerald-lime` / `emerald-steel` / `emerald-gold` 三 scheme 间切换，偏好存 `localStorage`。

## 备选方案

- **维持 v1/v2/v3 独立构建产物**：可精确对比但维护三套代码/构建成本高
- **仅保留 v3 单主题**：最简单但失去演示灵活性
- **Tailwind dark mode 类方案**：需引入 Tailwind — 与现有 SCSS 体系冲突

## 影响

- **正面**：单构建产物、即时切换、nginx 多版本预览可退役
- **负面**：主题差异限于 accent 色，无法做布局级皮肤差异
- **后续**：若需完全不同的首页布局，再评估独立页面变体
