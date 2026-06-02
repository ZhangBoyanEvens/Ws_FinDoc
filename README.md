# EvenS Studio

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61dafb?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8-646cff?logo=vite" alt="Vite 8" />
  <img src="https://img.shields.io/badge/GSAP-3-88ce02" alt="GSAP 3" />
</p>

An explorable **EvenS Studio** shell: enter from Hero and the menu into multiple product lines, each with its own **Overview story page** and **Dashboard interaction prototype**. The repo evolves with the portfolio; new lines are added mainly by extending route registration and feature modules.

## Flow

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

## Product lines

| Line | Theme | Overview | Dashboard |
|------|-------|----------|-----------|
| **FinDoc** | Green · report automation | [On Scroll View Switch](https://tympanus.net/codrops/2023/01/18/on-scroll-view-switch/) — dark editorial, grid/list switch | Multi-stage wizard, outcome editor, progress & download UI |
| **Vetra** | Blue · screening / due diligence | [Image Expansion Typography](https://tympanus.net/codrops/2024/06/19/image-expansion-typography-animation/) + custom hero / scanner | Quad filters, country–region KB, company list, simulated run progress |
| **Arbix** | Red (chrome) · purple-grey overview | Custom `arbixWave`: parallax, waves, glass cards, slide-to-unlock | Maintenance placeholder (theme & routes wired) |

## Implementation highlights

- **React 19 + Vite 8 + React Router 7**, split by product/feature; Overview styles scoped to mount roots where possible.
- **Motion**: GSAP (Timeline, ScrollTrigger, ScrollSmoother, Flip), Lenis, SVG curtain morph, canvas trail, Splitting.
- **3D / visuals**: R3F, custom shaders (`hero/`, `codropsPixel/`).
- **UI**: Theme CSS variables, container queries, controlled forms with required/optional rules, mock data & static KB (e.g. `vetra/countryRegionKb.js`).
- **Integration**: Codrops demos mounted via `useLayoutEffect` with teardown and restored `document` classes / global GSAP refs.

## Stack

| Area | Choice |
|------|--------|
| UI | React 19, React Router 7 |
| Tooling | Vite 8 |
| Motion | GSAP 3, Splitting, Lenis |
| 3D | Three.js, @react-three/fiber, @react-three/drei |
| Other | imagesloaded, html2canvas (as needed) |

## Run locally

```bash
npm install
npm run dev      # dev server, usually http://localhost:5173
npm run build
npm run preview
npm run lint
```

Suggested path: `/HERO` → `/menu?demo=1` → each Overview → each Dashboard.

## Structure

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

## Routes

| Path | Page |
|------|------|
| `/` | redirect → `/HERO` |
| `/HERO` | entry |
| `/menu` | menu (`?demo=1`) |
| `/findoc` `/vetra` `/arbix` | dashboards |
| `/FinDocOverviewPage` `/VetraOverviewPage` `/ArbixOverviewPage` | overviews |
| `/ArbiX` `/ImageExpansionTypography` | overview aliases |

To add a line: extend `MENU_ITEMS` and wire `renderOverviewElement` / `ThemedDocPage`.

## Credits

Adapted or referenced (respect upstream licenses): [Codrops On Scroll View Switch](https://tympanus.net/codrops/2023/01/18/on-scroll-view-switch/), [Image Expansion Typography](https://tympanus.net/codrops/2024/06/19/image-expansion-typography-animation/), other [Codrops](https://tympanus.net/codrops/) demos, [undraw](https://undraw.co/), Unsplash, etc.

## Roadmap

- [ ] New lines in `MENU_ITEMS`
- [ ] Arbix dashboard prototype
- [ ] Design tokens & a11y / reduced-motion pass
- [ ] Live demo & deploy notes
