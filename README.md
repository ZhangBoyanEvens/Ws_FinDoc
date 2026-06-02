# EvenS Studio

<p align="center">
  <a href="#readme-zh"><strong>中文</strong></a>
  &nbsp;·&nbsp;
  <a href="#readme-en"><strong>English</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61dafb?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8-646cff?logo=vite" alt="Vite 8" />
  <img src="https://img.shields.io/badge/GSAP-3-88ce02" alt="GSAP 3" />
</p>

---

<a id="readme-zh"></a>

## 中文

一套可浏览的 **EvenS Studio** 交互壳层：从 Hero 与菜单进入多条产品线，每条线配有独立主题的 **Overview 叙事页** 与 **Dashboard 交互原型**。仓库会随作品迭代更新；新增产品线时主要扩展路由注册与对应模块即可。

### 浏览路径

```
/HERO          全屏入口（Hero / 视觉实验）
    ↓
/menu          产品菜单（帘幕、横滑选线）
    ↓
各产品线
  · /findoc | /vetra | /arbix              → Dashboard
  · /FinDocOverviewPage 等                 → Overview（风格各异）
```

菜单 URL 带 **`?demo=1`** 时，从菜单进入各线会优先打开 **Overview**，便于对外展示叙事页；从 Overview 返回菜单会保留该参数。

### 产品线

| 线 | 主题 | Overview | Dashboard |
|----|------|----------|-----------|
| **FinDoc** | 绿 · 文档自动化 | [On Scroll View Switch](https://tympanus.net/codrops/2023/01/18/on-scroll-view-switch/) 改编 · 深色编辑风、网格/列表切换 | 多 Stage 向导、Outcome 编辑、进度与下载等 |
| **Vetra** | 蓝 · 企业筛选 / 尽调 | [Image Expansion Typography](https://tympanus.net/codrops/2024/06/19/image-expansion-typography-animation/) + 自研 Hero / Scanner | 四象限筛选、国家省联动、公司列表、模拟运行进度 |
| **Arbix** | 红（壳层）· Overview 紫灰科技风 | 自研 `arbixWave`：视差、波浪、玻璃卡、滑动解锁 | 维护中占位（主题与路由已接） |

### 实现要点

- **React 19 + Vite 8 + React Router 7**，按产品/功能分目录；Overview 样式尽量限定在挂载容器内。
- **动效**：GSAP（Timeline、ScrollTrigger、ScrollSmoother、Flip）、Lenis、SVG 帘幕、Canvas 拖尾、Splitting 等。
- **3D / 视觉**：R3F、自定义 shader（`hero/`、`codropsPixel/`）。
- **界面**：多主题 CSS 变量、container query、受控表单与必选/可选逻辑、Mock 数据与静态 KB（如 `vetra/countryRegionKb.js`）。
- **集成**：第三方 Codrops Demo 经 `useLayoutEffect` 挂载/卸载，并恢复 `document` class 与全局 GSAP 引用。

### 技术栈

| 类别 | 选用 |
|------|------|
| 框架 | React 19、React Router 7 |
| 构建 | Vite 8 |
| 动效 | GSAP 3、Splitting、Lenis |
| 3D | Three.js、@react-three/fiber、@react-three/drei |
| 其他 | imagesloaded、html2canvas（按需） |

### 本地运行

```bash
npm install
npm run dev      # 开发，默认 http://localhost:5173
npm run build
npm run preview
npm run lint
```

建议路径：`/HERO` → `/menu?demo=1` → 各 Overview → 各 Dashboard。

### 目录（精简）

```
src/
├── App.jsx / App.css       # 路由、菜单、主题壳、Vetra Dashboard 等
├── hero/                   # /HERO
├── findoc/                 # FinDoc Dashboard 模块
├── imageExpansionTypography/   # Vetra Overview
├── onScrollViewSwitch/     # FinDoc Overview
├── arbixWave/              # Arbix Overview
├── vetra/                  # Vetra 数据（国家/地区 KB）
└── assets/
```

### 路由

| 路径 | 说明 |
|------|------|
| `/` | → `/HERO` |
| `/HERO` | 入口 |
| `/menu` | 菜单（`?demo=1`） |
| `/findoc` `/vetra` `/arbix` | Dashboard |
| `/FinDocOverviewPage` `/VetraOverviewPage` `/ArbixOverviewPage` | Overview |
| `/ArbiX` `/ImageExpansionTypography` | Overview 别名 |

扩展新产品：改 `MENU_ITEMS`，并实现 `renderOverviewElement` / `ThemedDocPage` 对应分支。

### 致谢

改编或参考（请遵守原作者许可）：[Codrops On Scroll View Switch](https://tympanus.net/codrops/2023/01/18/on-scroll-view-switch/)、[Image Expansion Typography](https://tympanus.net/codrops/2024/06/19/image-expansion-typography-animation/)、[Codrops](https://tympanus.net/codrops/) 相关示例、[undraw](https://undraw.co/)、Unsplash 等。

### 路线图

- [ ] 新产品线接入 `MENU_ITEMS`
- [ ] Arbix Dashboard 可交互原型
- [ ] 各线 Design Token 与 a11y / 动效降级
- [ ] 线上 Demo 与部署说明

---

<a id="readme-en"></a>

## English

An explorable **EvenS Studio** shell: enter from Hero and the menu into multiple product lines, each with its own **Overview story page** and **Dashboard interaction prototype**. The repo evolves with the portfolio; new lines are added mainly by extending route registration and feature modules.

### Flow

```
/HERO          Full-screen entry (Hero / visual experiments)
    ↓
/menu          Product menu (curtain, horizontal picker)
    ↓
Per product line
  · /findoc | /vetra | /arbix              → Dashboard
  · /FinDocOverviewPage etc.               → Overview (distinct look & feel each)
```

With **`?demo=1`** on the menu URL, navigation into a line opens **Overview** first (ideal for walkthroughs). Returning to the menu keeps the query flag.

### Product lines

| Line | Theme | Overview | Dashboard |
|------|-------|----------|-----------|
| **FinDoc** | Green · report automation | [On Scroll View Switch](https://tympanus.net/codrops/2023/01/18/on-scroll-view-switch/) — dark editorial, grid/list switch | Multi-stage wizard, outcome editor, progress & download UI |
| **Vetra** | Blue · screening / due diligence | [Image Expansion Typography](https://tympanus.net/codrops/2024/06/19/image-expansion-typography-animation/) + custom hero / scanner | Quad filters, country–region KB, company list, simulated run progress |
| **Arbix** | Red (chrome) · purple-grey overview | Custom `arbixWave`: parallax, waves, glass cards, slide-to-unlock | Maintenance placeholder (theme & routes wired) |

### Implementation highlights

- **React 19 + Vite 8 + React Router 7**, split by product/feature; Overview styles scoped to mount roots where possible.
- **Motion**: GSAP (Timeline, ScrollTrigger, ScrollSmoother, Flip), Lenis, SVG curtain morph, canvas trail, Splitting.
- **3D / visuals**: R3F, custom shaders (`hero/`, `codropsPixel/`).
- **UI**: Theme CSS variables, container queries, controlled forms with required/optional rules, mock data & static KB (e.g. `vetra/countryRegionKb.js`).
- **Integration**: Codrops demos mounted via `useLayoutEffect` with teardown and restored `document` classes / global GSAP refs.

### Stack

| Area | Choice |
|------|--------|
| UI | React 19, React Router 7 |
| Tooling | Vite 8 |
| Motion | GSAP 3, Splitting, Lenis |
| 3D | Three.js, @react-three/fiber, @react-three/drei |
| Other | imagesloaded, html2canvas (as needed) |

### Run locally

```bash
npm install
npm run dev      # dev server, usually http://localhost:5173
npm run build
npm run preview
npm run lint
```

Suggested path: `/HERO` → `/menu?demo=1` → each Overview → each Dashboard.

### Structure (short)

```
src/
├── App.jsx / App.css       # routes, menu, themed shell, Vetra dashboard, etc.
├── hero/                   # /HERO
├── findoc/                 # FinDoc dashboard module
├── imageExpansionTypography/   # Vetra overview
├── onScrollViewSwitch/     # FinDoc overview
├── arbixWave/              # Arbix overview
├── vetra/                  # Vetra data (country/region KB)
└── assets/
```

### Routes

| Path | Page |
|------|------|
| `/` | redirect → `/HERO` |
| `/HERO` | entry |
| `/menu` | menu (`?demo=1`) |
| `/findoc` `/vetra` `/arbix` | dashboards |
| `/FinDocOverviewPage` `/VetraOverviewPage` `/ArbixOverviewPage` | overviews |
| `/ArbiX` `/ImageExpansionTypography` | overview aliases |

To add a line: extend `MENU_ITEMS` and wire `renderOverviewElement` / `ThemedDocPage`.

### Credits

Adapted or referenced (respect upstream licenses): [Codrops On Scroll View Switch](https://tympanus.net/codrops/2023/01/18/on-scroll-view-switch/), [Image Expansion Typography](https://tympanus.net/codrops/2024/06/19/image-expansion-typography-animation/), other [Codrops](https://tympanus.net/codrops/) demos, [undraw](https://undraw.co/), Unsplash, etc.

### Roadmap

- [ ] New lines in `MENU_ITEMS`
- [ ] Arbix dashboard prototype
- [ ] Design tokens & a11y / reduced-motion pass
- [ ] Live demo & deploy notes

---

<p align="center">
  <sub>EvenS Studio · <a href="#readme-zh">中文</a> · <a href="#readme-en">English</a></sub>
</p>
