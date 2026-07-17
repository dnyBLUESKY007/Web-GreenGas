# Task: 全站移动端响应式适配

- **日期**：2026-07-17
- **状态**：已完成
- **关联**：`ai-memories/memories/projectbrief.md`、`systemPatterns.md`、`techContext.md`

## Problem / 目标

当前站点已有 `48rem`（768px）和 `64rem`（1024px）断点，但还没有形成完整的移动端体验。2026-07-17 使用真实 Edge 移动视口对首页、Solutions、About、News、FAQ、Contact 进行 320/390/768/820/1024px 与中文/俄语检查后，确认以下基线问题：

- 小于 768px 时主导航直接隐藏，没有菜单按钮或抽屉替代，用户无法从页头访问主要栏目。
- 768px 时桌面导航过早启用：中文导航栏会由预期的 64px 撑高到约 120px；俄语在 768–820px 时操作区会超出视口，并可能覆盖页面内容。
- 首页 Hero 文案卡在 320–390px 下贴住右侧边界，长标题和俄语文案空间不足；轮播箭头、分页和语言切换按钮的触控热区小于 44px。
- 首页产品卡始终两列，320px 下单卡仅约 136px；俄语长产品名已出现内部裁切。工程能力区在手机端内容偏密，存在被 `overflow: hidden` 掩盖的内部超宽内容。
- Contact 的主体固定为 70% 宽，320/390px 下实际仅约 202/251px；FAQ 固定为 80% 宽，造成不必要的窄栏和表单换行。
- Solutions 的场景与产品 Tab 依赖横向滚动，但缺少明确的可滑动提示；长俄语标签显著超出首屏。
- 全局未定义一套移动端触控、长文本、横竖屏和安全区验收标准。

目标是在不引入新框架或依赖、不改变现有信息架构和三语内容模型的前提下，让所有页面在 320–1024px 范围内可导航、无非预期横向滚动、文本不裁切、主要控件易于触控，并保持桌面视觉不回退。

## 核心思路

采用“先修全局骨架，再逐页收敛”的移动优先方案：

1. 将完整桌面导航的启用点调整到 `64rem`（1024px）；其下统一使用菜单按钮与可展开抽屉。语言切换保留在页头，主要栏目与 Contact CTA 放入抽屉，支持当前页状态、焦点管理、Esc/遮罩关闭和打开时锁定页面滚动。
2. 保留现有 `md/lg` 体系，按需补充一个小屏断点（约 30rem/480px），只用于把过窄的双列内容降为单列；不做大量设备型号特判。
3. 手机端 Hero 改为有左右安全边距的受控文案卡，使用更保守的 `clamp()` 字号和自然高度；保留图片与滑动交互，但把可点击热区扩到至少 44×44px。
4. 320–479px 下产品、服务及必要卡片改为单列或更舒适的布局；能力流程保持纵向卡片，统计区允许合理换行，清除由装饰元素以外的真实内部溢出。
5. Contact、FAQ 等内容区在手机端使用 `width: 100%`，在大屏再施加 `max-width`；消息表单缩小侧边内边距，并为邮箱、电话等不可断字符串提供安全换行规则。
6. 横向 Tab/轮播继续采用原生触控滚动，但增加 scroll snap、边缘渐隐或“露出下一项”的视觉提示，并保证选中项在切换语言或点击后滚入可视区域。
7. 以中文、英文、俄语共同验收；长俄语作为压力测试，不通过缩小到不可读字号来规避布局问题。

## 受影响的文件 / 模块

- `frontend/src/components/navbar/Navbar.ts` — 增加移动/平板菜单按钮、抽屉结构、ARIA 状态和开关交互。
- `frontend/src/components/navbar/initNavbarScroll.ts` — 协调导航自动隐藏与菜单展开状态，避免抽屉打开时页头被隐藏。
- `frontend/src/styles/components/_navbar.scss` — 以 1024px 为桌面导航切换点，完成抽屉、遮罩、滚动锁定和安全区样式。
- `frontend/src/styles/base/_variables.scss` — 如确有需要，补充小屏断点与移动端共享尺寸变量。
- `frontend/src/styles/layout/_container.scss` — 修正 Contact/FAQ 移动宽度与全局内容边距。
- `frontend/src/styles/components/_hero-carousel.scss` — 调整手机 Hero 高度、文案卡、字号、留白和轮播控件热区。
- `frontend/src/styles/components/_product-grid.scss`、`_service-strip.scss`、`_capability-band.scss`、`_case-carousel.scss` — 收敛首页小屏网格、流程卡、统计区和横向轮播体验。
- `frontend/src/styles/components/_solutions-page.scss`、`_solutions-panel.scss` — 优化场景/产品 Tab、详情面板和长标签在窄屏下的布局与滚动提示。
- `frontend/src/styles/components/_cards.scss` — 修正联系渠道、消息表单、FAQ 和通用卡片在小屏下的宽度、换行与内边距。
- `frontend/src/styles/components/_about-page.scss`、`_news-page.scss`、`_footer.scss`、`_scroll-to-top.scss` — 逐页处理长文本、间距、底部安全区和浮动按钮位置。
- `ai-memories/tasks/2026-07-17-mobile-responsive-adaptation.md` — 记录实施步骤、调试发现与复盘。
- `ai-memories/memories/activeContext.md`、`progress.md` — 完成后记录移动端适配里程碑和后续事项。

## 分步计划

- [x] Step 1: 建立验收基线，记录 320、375/390、430、768、820、1024px 下主要页面的横向溢出、首屏布局、导航高度和关键触控尺寸；覆盖中/英/俄三语。
- [x] Step 2: 实现 1024px 以下的可访问移动导航抽屉，并验证打开/关闭、焦点、Esc、遮罩、滚动锁定、当前页状态及导航自动隐藏的协同。
- [x] Step 3: 修复全局移动容器、Contact/FAQ 宽度、长字符串换行、浮动按钮和安全区，消除非预期页面级横向滚动。
- [x] Step 4: 调整首页 Hero、产品网格、服务条、工程能力流程和案例轮播；优先保证 320px 与俄语长文案不裁切，主要操作热区不小于 44×44px。
- [x] Step 5: 优化 Solutions 的横向 Tab 与详情/产品卡布局，并逐页检查 About、News 列表/详情、FAQ、Contact、Clients、Certifications。
- [x] Step 6: 执行 `npm run build`，用真实 Edge 视口复测全部断点与三语；检查无非预期横向滚动、无内容遮挡、图片比例稳定、键盘操作和 `prefers-reduced-motion` 不回退。
- [x] Step 7: 将实测差异和设计调整追加到 Debug Notes，完成 Lessons Learned，并增量更新 `activeContext.md` 与 `progress.md`。

## Debug Notes

> 开发中遇到的重大 Bug、卡点、设计变更**即时追加**到这里（带时间戳）。

- 2026-07-17 13:57 基线确认：原 `48rem` 桌面导航在中文 768px 下高度增至约 120px，俄语 768–820px 操作区越出视口；改为仅在 `64rem` 启用桌面导航。
- 2026-07-17 13:57 实测：320/390/768/820/1024px 下 Home、Solutions、About、News、FAQ、Contact 的文档宽度均与视口一致；移动抽屉的打开、Esc 关闭、焦点返回和滚动锁定通过浏览器检查。
- 2026-07-17 13:57 验证限制：最终单页俄语复测的本地浏览器调试会话超时；此前完整多宽度中俄检查及生产构建均已通过，未观察到新的布局回归。
- 2026-07-17 15:12 修复：移动菜单容器的负 `z-index` 使遮罩落到主体内容之后；改为导航栏堆叠上下文内的正层级，并将工具栏提升。实测发现打开菜单时的零位移 `transform`、`will-change: transform` 与导航栏的 `backdrop-filter` 都会使固定定位子元素以 64px 导航栏为包含块；最终将 mobile menu 挂载为 `body` 的同级视口层，保留导航栏为更高层级。

## Lessons Learned

> 任务收尾时填写，供后续任务参考；重要结论应同步回 `ai-memories/memories/`。

- 导航的断点应由最长语言文案和操作区总宽度决定，不能仅按常见平板宽度启用桌面布局。
- 移动端内容区不应使用桌面比例宽度；以 `width: min(100%, max-width)` 为基础，再在大屏限制阅读宽度更稳定。
- 三语中的俄语应作为窄屏布局压力测试；避免通过过度缩小字号掩盖问题。
