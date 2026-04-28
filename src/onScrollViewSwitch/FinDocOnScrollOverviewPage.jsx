import { useEffect, useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { mountOnScrollViewSwitch } from './mountOnScrollViewSwitch'
import { SCROLL_ITEMS } from './data'
import './scrollStyles.css'
import './ersaLink.css'

const MENU_RESTORE_DEMO_TO = '/menu?demo=1'
const FUNDOC_REPO_URL = 'https://github.com/ZhangBoyanEvens/Ws_FinDoc'
const TYPEKIT_LINK_ID = 'typekit-onscroll-codrops'
/** 顶栏入场后再挂 ScrollTrigger，避免与 xPercent 入场冲突 */
const HEADER_SCROLL_SETUP_DELAY_MS = 1020

function GridIcon() {
  return (
    <svg width="18px" height="18px" viewBox="0 0 45 45">
      <rect x="0" y="0" width="20" height="20" />
      <rect x="25" y="0" width="20" height="20" />
      <rect x="0" y="25" width="20" height="20" />
      <rect x="25" y="25" width="20" height="20" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg width="18px" height="18px" viewBox="0 0 43 43">
      <rect x="0" y="0" width="11" height="11" />
      <rect x="16" y="0" width="25" height="11" />
      <rect x="16" y="16" width="25" height="11" />
      <rect x="16" y="32" width="25" height="11" />
      <rect x="0" y="16" width="11" height="11" />
      <rect x="0" y="32" width="11" height="11" />
    </svg>
  )
}

/** 描述内最多一段 `**重点**`，渲染为高亮点 */
function ItemCaptionDescription({ text }) {
  const re = /\*\*([^*]+)\*\*/
  const m = typeof text === 'string' ? text.match(re) : null
  if (!m || m.index === undefined) {
    return <p className="item__caption-description">{text}</p>
  }
  const before = text.slice(0, m.index)
  const after = text.slice(m.index + m[0].length)
  return (
    <p className="item__caption-description">
      {before}
      <strong className="item__caption-descriptionEmphasis">{m[1]}</strong>
      {after}
    </p>
  )
}

/** GitHub Octocat 标（单 path，随 `color` / currentColor 填色） */
export function GithubMarkIcon() {
  return (
    <svg
      className="onScrollViewSwitchMount__heroGithubSvg"
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.416-4.042-1.416C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
      />
    </svg>
  )
}

/** Codrops OnScrollViewSwitch 整页，嵌在 /FinDocOverviewPage；样式限定在 .onScrollViewSwitchMount */
export function FinDocOnScrollOverviewPage() {
  const surfaceRef = useRef(null)
  const mainRef = useRef(null)
  const gridRef = useRef(null)
  const headingRef = useRef(null)
  const headingMainRef = useRef(null)
  const switchGridRef = useRef(null)
  const switchListRef = useRef(null)
  const heroTitleRef = useRef(null)
  const headingMainEnterRef = useRef(null)
  const menuBackLinkRef = useRef(null)
  const parallaxGuidesRef = useRef(null)

  useLayoutEffect(() => {
    const hero = heroTitleRef.current
    const headingEnter = headingMainEnterRef.current
    const targets = [hero, headingEnter].filter(Boolean)
    if (!targets.length) return
    gsap.killTweensOf(targets)
    if (hero) {
      gsap.fromTo(
        hero,
        { xPercent: -115, force3D: true },
        {
          xPercent: 0,
          duration: 0.95,
          ease: 'power3.out',
          delay: 0.06,
        },
      )
    }
    if (headingEnter) {
      gsap.fromTo(
        headingEnter,
        { xPercent: 115, force3D: true },
        {
          xPercent: 0,
          duration: 0.95,
          ease: 'power3.out',
          delay: 0.06,
        },
      )
    }
    return () => {
      gsap.killTweensOf(targets)
    }
  }, [])

  useEffect(() => {
    let link = document.getElementById(TYPEKIT_LINK_ID)
    if (!link) {
      link = document.createElement('link')
      link.id = TYPEKIT_LINK_ID
      link.rel = 'stylesheet'
      link.href = 'https://use.typekit.net/eur8cof.css'
      document.head.appendChild(link)
    }
  }, [])

  useEffect(() => {
    const htmlEl = document.documentElement
    const bodyEl = document.body
    htmlEl.classList.add('finDocOverviewScroll')
    bodyEl.classList.add('finDocOverviewScroll')
    return () => {
      htmlEl.classList.remove('finDocOverviewScroll')
      bodyEl.classList.remove('finDocOverviewScroll')
    }
  }, [])

  useEffect(() => {
    const surface = surfaceRef.current
    const main = mainRef.current
    const grid = gridRef.current
    const heading = headingRef.current
    const headingMain = headingMainRef.current
    const switchGrid = switchGridRef.current
    const switchList = switchListRef.current
    if (!surface || !main || !grid || !heading || !headingMain || !switchGrid || !switchList) return

    return mountOnScrollViewSwitch({
      surface,
      main,
      grid,
      heading,
      headingMain,
      switchGrid,
      switchList,
    })
  }, [])

  useEffect(() => {
    const main = mainRef.current
    const hero = heroTitleRef.current
    const menu = menuBackLinkRef.current
    const guides = parallaxGuidesRef.current
    if (!main || !hero || !menu) return

    gsap.registerPlugin(ScrollTrigger)

    /** @type {gsap.core.Tween | undefined} */
    let tweenHero
    /** @type {gsap.core.Tween | undefined} */
    let tweenMenu
    /** @type {gsap.core.Tween | undefined} */
    let tweenGuides

    const maxDocScroll = () =>
      Math.max(1, document.documentElement.scrollHeight - window.innerHeight)

    /** 比原先的 bottom bottom 区间短 4 倍；标题 / 辅助线共用 */
    const headerParallaxScrollTrigger = () => ({
      trigger: main,
      start: 'top top',
      end: () => `+=${maxDocScroll() / 4}`,
      scrub: 1,
      invalidateOnRefresh: true,
    })

    /** Menu 竖移再用 1/2 滚动距离跑完同样 4em，约快 1 倍 */
    const menuLinkScrollTrigger = () => ({
      trigger: main,
      start: 'top top',
      end: () => `+=${maxDocScroll() / 8}`,
      scrub: 1,
      invalidateOnRefresh: true,
    })

    const timer = window.setTimeout(() => {
      const stBase = headerParallaxScrollTrigger()

      tweenHero = gsap.to(hero, {
        xPercent: -115,
        ease: 'none',
        scrollTrigger: stBase,
      })

      tweenMenu = gsap.to(menu, {
        y: '4em',
        ease: 'none',
        scrollTrigger: menuLinkScrollTrigger(),
      })

      if (guides) {
        tweenGuides = gsap.to(guides, {
          y: -120,
          ease: 'none',
          scrollTrigger: {
            ...stBase,
            scrub: 1.15,
          },
        })
      }

      ScrollTrigger.refresh()
    }, HEADER_SCROLL_SETUP_DELAY_MS)

    return () => {
      window.clearTimeout(timer)
      tweenHero?.scrollTrigger?.kill()
      tweenHero?.kill()
      tweenMenu?.scrollTrigger?.kill()
      tweenMenu?.kill()
      tweenGuides?.scrollTrigger?.kill()
      tweenGuides?.kill()
    }
  }, [])

  return (
    <div className="demoTitleOnScroll">
      <div
        ref={parallaxGuidesRef}
        className="demoTitleOnScroll__parallaxGuides"
        aria-hidden="true"
      />
      <header className="demoTitleOverview__bar demoTitleOnScroll__bar">
        <div className="demoTitleOnScroll__barStart">
          <Link
            ref={menuBackLinkRef}
            to={MENU_RESTORE_DEMO_TO}
            className="link link--ersa demoTitleOnScroll__menuErsa"
          >
            <span>← Menu</span>
          </Link>
          <div className="demoTitleOnScroll__heroTrack">
            <h1
              ref={heroTitleRef}
              className="frame__title-main onScrollViewSwitchMount__heroTitle"
            >
              <a
                href={FUNDOC_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="demoTitleOnScroll__heroGithubLink"
                aria-label="Ws_FinDoc 仓库（在新标签页打开）"
              >
                <GithubMarkIcon />
              </a>
            </h1>
          </div>
        </div>
      </header>
      <div
        ref={surfaceRef}
        className="onScrollViewSwitchMount js loading demoTitleOnScroll__stage"
      >
        <main ref={mainRef}>
          <div className="frame">
            <div className="frame__title">
            </div>
          </div>
          <div className="heading" ref={headingRef}>
            <div
              ref={headingMainEnterRef}
              className="onScrollViewSwitchMount__headingMainEnter"
            >
              <h2 className="heading__main" ref={headingMainRef}>
                Projects * FinDoc * Projects * FinDoc * Projects * FinDoc * Projects
              </h2>
            </div>
            <span className="heading__sub">March 2026 - August 2026</span>
          </div>
          <div className="switch">
            <button
              type="button"
              className="unbutton switch__button switch__button--grid"
              ref={switchGridRef}
              aria-label="Grid view"
            >
              <GridIcon />
            </button>
            <button
              type="button"
              className="unbutton switch__button switch__button--list switch__button--current"
              ref={switchListRef}
              aria-label="List view"
            >
              <ListIcon />
            </button>
          </div>
          <div className="content">
            {SCROLL_ITEMS.map((item, index) => (
              <figure
                className={
                  item.number === '04' || item.number === '08'
                    ? 'item item--imageFirst'
                    : 'item'
                }
                key={item.number}
              >
                <figcaption className="item__caption">
                  <span className="item__caption-number oh">
                    <span className="oh__inner">{item.number}</span>
                  </span>
                  <h2 className="item__caption-title oh">
                    <span className="oh__inner">{item.title}</span>
                  </h2>
                  <ItemCaptionDescription text={item.description} />
                </figcaption>
                <div className="item__image-wrap">
                  <div className="item__image">
                    <div className="item__image-inner">
                      <img
                        src={item.imageSrc}
                        alt={item.imageAlt ?? ''}
                        decoding="async"
                        loading={index === 0 ? 'eager' : 'lazy'}
                        referrerPolicy="no-referrer-when-downgrade"
                        className={
                          item.imageTone === 'invertWhite'
                            ? 'item__image--invertWhite'
                            : undefined
                        }
                        style={
                          item.imageObjectFit
                            ? { objectFit: item.imageObjectFit }
                            : undefined
                        }
                      />
                    </div>
                  </div>
                </div>
              </figure>
            ))}
          </div>
          <div className="grid" ref={gridRef} />
        </main>
      </div>
    </div>
  )
}
