# Active Context（当前焦点）

> 更新最频繁的文件。每次里程碑或换方向时刷新，保证“下一步一目了然”。
> 最近更新：2026-07-04

## 当前焦点

数字大脑（Memory Bank）初始化完成；站点处于 **Phase 1 内容完善阶段**——骨架与核心组件已就绪，待替换占位素材并接入 Contact 地图与 EmailJS。

## 近期变更

- 2026-07-04 文档整理：`docs/`、`TODO/`、`README-TMP.md` 迁入 `.cursor/memories/` 与 issue，冗余文件已删除
- 2026-07-04 workflow 脚手架与 rules/skills 重组（`.cursor/bakup` 归档旧版）
- 2026-07-03 Hero viewport 重建 + 轮播交互优化；v3 modern fusion 皮肤合并为生产基线
- 2026-07-02 运行时主题切换（emerald-lime / emerald-steel / emerald-gold）
- 2026-06-28 全量图片迁移至阿里云 OSS CDN
- 2026-06-27 子路径部署支持（`basePath()` + `VITE_BASE`，nginx 多版本预览）

## 下一步

- [ ] 替换占位文案/图片为甲方真实素材
- [ ] Contact 页高德地图（[issue-0001](../issues/issue-0001-contact-amap-map.md)）
- [ ] EmailJS 表单接入
- [ ] Cloudflare Pages 部署
- [ ] SEO meta 完善

## 进行中的任务 Plan

- 无（数字大脑初始化本次收尾）

## 待决问题 / 阻塞

- 甲方真实厂址与 GCJ-02 经纬度（Contact 地图依赖）
- 是否同时提供 Google Maps 外链（北美访客）
- 高德开放平台企业认证与 Key 申请（需甲方/运维）
