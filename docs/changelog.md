# Changelog

## Reorganize 2026-06-22

### 重组范围

| Hash | 原 Subject | 判定 |
|------|------------|------|
| `5179e93` | final | 非规范格式 |
| `2b11ab8` | bugfix1 | 非规范格式 |
| `efda1e6` | tmp | 临时标记 |

**保留不动**（已符合规范且语义清晰）：

| Hash | Subject |
|------|---------|
| `1c625f0` | chore(frontend): allow ngrok-free.dev host in dev server |
| `a9736eb` | chore(templates): archive scraped content from old cn.greennb.com |

基线（重组 parent）：`1c625f0c59ba1ca7afdbaedbc8dceff9b9f214ea` (`1c625f0`)

### 变更总结

- **首页 Hero 轮播**：新增 `HeroCarousel` 组件，替换静态 Hero；4 张幻灯片、自动轮播（6s）、Tab 进度条、悬停暂停；配套 i18n 文案（en/zh/ru）。
- **顶栏滚动行为**：`initNavbarScroll` 扩展为下滑隐藏、上滑显示（阈值 100px），保留 scrolled 状态样式。
- **回到顶部**：新增白色 `ScrollToTop` 按钮，滚动超过 400px 显示，点击平滑回顶；在 `mountLayout` 全局挂载。
- **布局与视觉调整**：页脚改为浅色背景；容器 CTA 区块配色同步；section 增加 `--compact` 变体；navbar 隐藏动画样式。
- **模块依赖**：组件实现 → 首页接入 → 全局 layout 挂载 → SCSS 样式；`bugfix1` / `final` 为轮播与 scroll-to-top 的迭代修复，应 squash 入主功能 commit。

### 涉及文件（按模块）

- `frontend/src/components/hero-carousel/`: 新建轮播组件
- `frontend/src/components/scroll-to-top/`: 新建回到顶部按钮
- `frontend/src/components/navbar/initNavbarScroll.ts`: 下滑隐藏顶栏
- `frontend/src/pages/home/index.ts`: 接入轮播、紧凑 section
- `frontend/src/utils/mountLayout.ts`: 全局挂载 scroll-to-top
- `frontend/src/i18n/locales/*.json`: 轮播文案
- `frontend/src/styles/`: hero-carousel、scroll-to-top、footer、navbar、container 样式

### 目标 commit 列表（分组）

| 顺序 | 推荐 Message | 原 Commit 集合 | 涉及模块 | 排序理由 |
|------|--------------|----------------|----------|----------|
| 1 | `feat(frontend): add home hero carousel and layout chrome` | `efda1e6`, `2b11ab8`, `5179e93` | frontend | 同一功能迭代，合并为一条 |

### 推荐 commit message

**目标 commit 1 — 首选**

```
feat(frontend): add home hero carousel and layout chrome
```

**目标 commit 1 — 备选**

```
feat(frontend): add hero carousel, hide-on-scroll navbar, scroll-to-top
```

### 重组方案

**策略**：soft reset 重提（仅整理 3 条临时 commit，保留其前 2 条规范 commit）

| 原 Hash | 操作 | 说明 |
|---------|------|------|
| `a9736eb` | 保留 | 已规范 |
| `1c625f0` | 保留 | 已规范，作为重组基线 |
| `efda1e6` | → commit 1 | soft reset 后一次性 add + commit |
| `2b11ab8` | → commit 1 | 与上合并 |
| `5179e93` | → commit 1 | 与上合并 |

```bash
git reset --soft 1c625f0
git add frontend/
git commit -m "feat(frontend): add home hero carousel and layout chrome"
```

预期：5 个 commit → 3 个 commit（顺序不变：templates → ngrok → feat）

### 风险

- 分支 `main` 领先 `origin/main` 5 个 commit，**尚未 push**；重组后需 `git push`（无需 force）。
- 工作区当前干净，无未提交改动。

### 状态

- [x] 用户已确认 changelog
- [x] 用户已选定各组 commit message（首选）
- [x] 用户已授权执行重组
- [x] 重组执行完成
- [x] 最终 git log 已对照预期

**执行结果**：`ca58ef6` feat(frontend): add home hero carousel and layout chrome

---
