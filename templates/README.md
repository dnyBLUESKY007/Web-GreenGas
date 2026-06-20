# templates

本目录存放若干**静态前端页面模板**，作为未来开发 web-greengas 项目时可能参考的布局与样式方案。这些模板均为第三方开源主题，**不参与主项目构建**，仅作设计参考与局部复用（布局结构、组件样式、响应式方案等）。

## 内容分布

| 来源 | 模板 | 页面数 | 技术栈 |
|------|------|--------|--------|
| [Start Bootstrap](https://startbootstrap.com/) | `startbootstrap-small-business-gh-pages` | 1 | Bootstrap 5 |
| [HTML5 UP](https://html5up.net/) | `html5up-telephasic` | 4 | 原生 HTML + SCSS + jQuery |
| [HTML5 UP](https://html5up.net/) | `html5up-halcyonic` | 5 | 原生 HTML + SCSS + jQuery |
| [HTML5 UP](https://html5up.net/) | `html5up-helios` | 5 | 原生 HTML + SCSS + jQuery |

共 **4 套模板、15 个 HTML 页面**。HTML5 UP 系列占主体，每套模板自带 `LICENSE.txt`（CCA 3.0 许可）。

```
templates/
├── README.md
├── startbootstrap-small-business-gh-pages/   # Bootstrap 小企业站
├── html5up-telephasic/                       # 现代锐利风格
├── html5up-halcyonic/                        # 多栏布局变体
└── html5up-helios/                           # 宽屏展示 + 滚动动效
```

---

## 各模板结构说明

### `startbootstrap-small-business-gh-pages`

面向小型企业/业务展示的单页模板，结构最简，适合快速参考 Bootstrap 栅格与组件用法。

```
startbootstrap-small-business-gh-pages/
├── index.html          # 唯一页面：导航 + Hero + CTA + 三列卡片 + 页脚
├── css/
│   └── styles.css      # 含 Bootstrap 核心样式的编译产物
└── js/
    └── scripts.js      # Bootstrap 交互脚本
```

**页面结构：** 顶部响应式 `navbar` → 图文 Hero 行 → 全宽 CTA 卡片 → 三列 `card` 内容区 → 深色 `footer`。

---

### `html5up-telephasic`

锐利、现代的视觉风格，大量使用 SVG 装饰，支持多种侧边栏布局。

```
html5up-telephasic/
├── index.html              # 首页（含 Hero、特性区、页脚）
├── left-sidebar.html       # 左栏布局
├── right-sidebar.html      # 右栏布局
├── no-sidebar.html         # 无侧栏布局
└── assets/
    ├── css/
    │   ├── main.css        # 编译后的主样式
    │   └── images/         # 导航、页眉/页脚等 SVG 装饰
    ├── sass/
    │   ├── main.scss       # SCSS 源文件
    │   └── libs/           # 断点、栅格、混入等工具
    ├── js/
    │   ├── main.js         # 主题交互（下拉菜单、移动端导航等）
    │   ├── util.js         # 通用工具函数
    │   ├── jquery.min.js
    │   ├── breakpoints.min.js
    │   ├── browser.min.js
    │   └── jquery.dropotron.min.js
    └── webfonts/           # Font Awesome 图标字体
```

**页面结构：** `#page-wrapper` 包裹全局 → `#header-wrapper`（Logo + 下拉导航 + Hero）→ 主内容 `<section>` → `#footer-wrapper`。首页带 `homepage is-preload` body 类用于入场动画。

---

### `html5up-halcyonic`

强调**多栏内容布局**的响应式模板，提供从单栏到三栏的多种页面变体，风格偏商务、结构清晰。

```
html5up-halcyonic/
├── index.html              # 首页（Banner + 特性 + 内容区）
├── onecolumn.html          # 单栏布局
├── twocolumn1.html         # 双栏布局 #1
├── twocolumn2.html         # 双栏布局 #2
├── threecolumn.html        # 三栏布局
└── assets/
    ├── css/
    │   ├── main.css
    │   └── images/         # 按钮、移动端导航等 SVG
    ├── sass/
    │   ├── main.scss
    │   └── libs/
    └── js/
        ├── main.js
        ├── util.js
        ├── jquery.min.js
        ├── breakpoints.min.js
        └── browser.min.js
```

**页面结构：** `#page-wrapper` → `#header`（Logo + 水平导航 + `#banner` 横幅区）→ `#features` 特性区 → 主内容区（各变体按 1/2/3 栏划分 `col-*` 栅格）→ `#footer`。

---

### `html5up-helios`

面向**宽屏展示**的单页/多页模板，含视差滚动（Scrollex）与全屏 Hero，适合产品展示或落地页参考。

```
html5up-helios/
├── index.html              # 首页（全屏 Hero + 滚动区块 + 作品集等）
├── left-sidebar.html       # 左栏布局
├── right-sidebar.html      # 右栏布局
├── no-sidebar.html         # 无侧栏布局
└── assets/
    ├── css/
    │   ├── main.css
    │   ├── noscript.css    # 无 JS 时的降级样式
    │   └── images/
    ├── sass/
    │   ├── main.scss
    │   ├── noscript.scss
    │   └── libs/
    ├── js/
    │   ├── main.js
    │   ├── util.js
    │   ├── jquery.min.js
    │   ├── jquery.scrollex.min.js   # 滚动视口检测
    │   ├── jquery.scrolly.min.js    # 平滑滚动
    │   ├── jquery.dropotron.min.js
    │   ├── breakpoints.min.js
    │   └── browser.min.js
    └── webfonts/           # Font Awesome
```

**页面结构：** `#page-wrapper` → 全屏 `#header`（居中 Logo + `scrolly` 按钮）→ 固定 `#nav` → `#banner` 及各内容 `<section>`（滚动进入视口时触发动画）→ `#footer`。相比 Telephasic，侧栏变体页面结构类似，但首页更侧重单页滚动叙事。

---

## 使用说明

- 直接在浏览器中打开各模板根目录下的 `index.html` 即可预览（HTML5 UP 模板需通过本地服务器打开以避免部分资源路径问题）。
- 修改样式时，HTML5 UP 系列应编辑 `assets/sass/main.scss` 后重新编译；Start Bootstrap 可直接改 `css/styles.css`。
- 各模板许可与归属见各自目录内的 `README.txt` / `LICENSE.txt`，商用或分发前请确认许可条款。
