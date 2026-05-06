import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useSearchParams,
} from 'react-router-dom'
import { gsap } from 'gsap'
import Splitting from 'splitting'
import 'splitting/dist/splitting.css'
import 'splitting/dist/splitting-cells.css'
import undrawNewsEditor from './assets/undraw_news-editor_5nnl.svg'
import undrawWebSearch from './assets/undraw_web-search_7oif.svg'
import undrawData from './assets/undraw_data_25jw.svg'
import {
  FinDocOnScrollOverviewPage,
  GithubMarkIcon,
} from './onScrollViewSwitch/FinDocOnScrollOverviewPage.jsx'
import { ImageExpansionTypographyPage } from './imageExpansionTypography/ImageExpansionTypographyPage.jsx'
import { ArbixOverviewPage } from './arbixWave/ArbixOverviewPage.jsx'
import { HeroBayerCirclesPage } from './hero/HeroBayerCirclesPage.jsx'
import './App.css'
import './onScrollViewSwitch/ersaLink.css'

/** 与 MorphSVG 示例同构：始终用一条二次贝塞尔 `Q`，顶缘为平滑弧线，不做多边形插值 */
function demoCurtainPathD(ySide, yPeak) {
  return `M 0 100 V ${ySide} Q 50 ${yPeak} 100 ${ySide} V 100 z`
}

const DEMO_PATH_HIDDEN = demoCurtainPathD(100, 100)
const DEMO_PATH_FULL = demoCurtainPathD(0, 0)

/**
 * 三张同系办公室底图 + 各 undraw：FinDoc news-editor，Vetra web-search，Arbix data
 */
const MENU_DEMO_OFFICE_BACKGROUNDS = [
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1440&h=1080&fit=crop&q=80',
  'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=1440&h=1080&fit=crop&q=80',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1440&h=1080&fit=crop&q=80',
]
const MENU_DEMO_BG_CAROUSEL = [
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1440&h=1080&fit=crop&q=80',
  'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=1440&h=1080&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1440&h=1080&fit=crop&q=80',
  'https://images.unsplash.com/photo-1462899006636-339e08d1844e?w=1440&h=1080&fit=crop&q=80',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1440&h=1080&fit=crop&q=80',
  'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1440&h=1080&fit=crop&q=80',
  'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=1440&h=1080&fit=crop&q=80',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1440&h=1080&fit=crop&q=80',
  'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1440&h=1080&fit=crop&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1440&h=1080&fit=crop&q=80',
]
const MENU_ITEMS = [
  {
    id: 'findoc',
    title: 'FinDoc',
    subtitle: 'Report Automation',
    subtitleText: 'Report Automation',
    themeClass: 'theme-findoc',
    trailColor: 'rgba(22, 163, 74, 0.55)',
    overviewPath: '/FinDocOverviewPage',
    basePath: '/findoc',
    slideClass: 'menuDemoLandscape__slide--findoc',
    undraw: { src: undrawNewsEditor, width: 787, height: 389 },
  },
  {
    id: 'vetra',
    title: 'Vetra',
    subtitle: 'Enterprise Screening and Due Diligence',
    subtitleText: 'Enterprise Screening & Due Diligence',
    themeClass: 'theme-vetra',
    trailColor: 'rgba(37, 99, 235, 0.55)',
    overviewPath: '/VetraOverviewPage',
    basePath: '/vetra',
    slideClass: 'menuDemoLandscape__slide--vetra',
    undraw: { src: undrawWebSearch, width: 960, height: 770 },
  },
  {
    id: 'arbix',
    title: 'Arbix',
    subtitle: 'Cross Platform Price Arbitrage Monitor',
    subtitleText: 'Cross-Platform Price Arbitrage Monitor',
    themeClass: 'theme-arbix',
    trailColor: 'rgba(220, 38, 38, 0.55)',
    overviewPath: '/ArbixOverviewPage',
    basePath: '/arbix',
    slideClass: 'menuDemoLandscape__slide--arbix',
    undraw: { src: undrawData, width: 960, height: 601 },
  },
]

/** 从 overview 等返回菜单时带上 ?demo=1，MenuPage 据此恢复 Demo 开关与帘幕终态 */
const MENU_DEMO_QUERY = 'demo'
const MENU_DEMO_QUERY_VALUE = '1'
const MENU_RESTORE_DEMO_TO = `/menu?${MENU_DEMO_QUERY}=${MENU_DEMO_QUERY_VALUE}`
const COPYRIGHT_TEXT = `© ${new Date().getFullYear()} EvenSStudio. All rights reserved.`
const FINDOC_STAGE_ITEMS = [
  { id: 1, title: 'Upload Project File' },
  { id: 2, title: 'Project Template Settings' },
  { id: 3, title: 'Detail Summary' },
  { id: 4, title: 'Outcome' },
]

const FINDOC_OUTCOME_WELCOME_TEXT = 'Welcome To FinDoc!'
const FINDOC_HEADING_TRANSITION_MS = 400

function findocStageTitle(stageId) {
  return FINDOC_STAGE_ITEMS.find((s) => s.id === stageId)?.title ?? ''
}

function readDemoParamFromWindow() {
  if (typeof window === 'undefined') return false
  try {
    return new URLSearchParams(window.location.search).get(MENU_DEMO_QUERY) === MENU_DEMO_QUERY_VALUE
  } catch {
    return false
  }
}

/** 与标题中线对齐；用 vh 写入，避免 px，resize 时由 ResizeObserver 再同步 */
function syncMenuDemoLandscapeTop(shell, titleEl) {
  if (!shell || !titleEl) return
  const r = titleEl.getBoundingClientRect()
  const ih = window.innerHeight
  if (ih <= 0) return
  const centerY = r.top + r.height / 2
  shell.style.setProperty('--menu-demo-landscape-top', `${(centerY / ih) * 100}vh`)
}

function flushCurtainPath(pathEl, ySide, yPeak) {
  pathEl.setAttribute(
    'd',
    demoCurtainPathD(Math.round(ySide * 100) / 100, Math.round(yPeak * 100) / 100),
  )
}

function playDemoCurtainIn(pathEl, onComplete) {
  const o = { ySide: 100, yPeak: 100 }
  flushCurtainPath(pathEl, o.ySide, o.yPeak)
  return gsap
    .timeline({ onComplete })
    .to(o, {
      ySide: 50,
      yPeak: 0,
      duration: 0.4,
      ease: 'power2.in',
      onUpdate: () => flushCurtainPath(pathEl, o.ySide, o.yPeak),
    })
    .to(o, {
      ySide: 0,
      yPeak: 0,
      duration: 0.5,
      ease: 'power2.out',
      onUpdate: () => flushCurtainPath(pathEl, o.ySide, o.yPeak),
    })
}

function playDemoCurtainOut(pathEl, onComplete) {
  const o = { ySide: 0, yPeak: 0 }
  flushCurtainPath(pathEl, o.ySide, o.yPeak)
  return gsap
    .timeline({ onComplete })
    .to(o, {
      ySide: 50,
      yPeak: 0,
      duration: 0.35,
      ease: 'power2.in',
      onUpdate: () => flushCurtainPath(pathEl, o.ySide, o.yPeak),
    })
    .to(o, {
      ySide: 100,
      yPeak: 100,
      duration: 0.45,
      ease: 'power2.out',
      onUpdate: () => flushCurtainPath(pathEl, o.ySide, o.yPeak),
    })
}

function ThemedDocPage({ brandName, themeClass, trailColor, featuresTo }) {
  const canvasRef = useRef(null)
  const stageFourEditorRef = useRef(null)
  const [activeStage, setActiveStage] = useState(1)
  const [outcomeProgressKey, setOutcomeProgressKey] = useState(0)
  const [stageInputState, setStageInputState] = useState({
    projectNamed: '',
    projectFile: '',
    templateFile: '',
    referenceLink: '',
    view: '',
  })
  const wheelLockRef = useRef(false)
  const stageItemRefs = useRef([])
  const arrowDragRef = useRef({
    active: false,
    pointerId: null,
    startY: 0,
    startArrowTop: 0,
    centers: [],
  })
  const [isArrowDragging, setIsArrowDragging] = useState(false)
  const [stageFrameStyle, setStageFrameStyle] = useState({
    top: 0,
    height: 0,
    opacity: 0,
    arrowTop: 0,
  })
  const settledStageRef = useRef(activeStage)
  const headingTransitionRef = useRef(null)
  const [headingPair, setHeadingPair] = useState(null)
  const [idleHeadingStageId, setIdleHeadingStageId] = useState(activeStage)

  useEffect(() => {
    if (themeClass !== 'theme-findoc') return undefined

    if (headingTransitionRef.current && headingTransitionRef.current.in === activeStage) {
      return undefined
    }

    if (activeStage === settledStageRef.current && !headingTransitionRef.current) {
      return undefined
    }

    if (headingTransitionRef.current && headingTransitionRef.current.in !== activeStage) {
      settledStageRef.current = headingTransitionRef.current.in
    }

    const out = settledStageRef.current
    const inn = activeStage

    if (out === inn) {
      headingTransitionRef.current = null
      setHeadingPair(null)
      setIdleHeadingStageId(inn)
      return undefined
    }

    headingTransitionRef.current = { out, in: inn }
    setHeadingPair({ out, in: inn })

    const t = window.setTimeout(() => {
      settledStageRef.current = inn
      headingTransitionRef.current = null
      setHeadingPair(null)
      setIdleHeadingStageId(inn)
    }, FINDOC_HEADING_TRANSITION_MS)

    return () => window.clearTimeout(t)
  }, [activeStage, themeClass])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let mouseMoved = false
    let rafId = 0
    const pointer = {
      x: 0.5 * window.innerWidth,
      y: 0.5 * window.innerHeight,
    }

    const params = {
      pointsNumber: 40,
      widthFactor: 0.3,
      spring: 0.4,
      friction: 0.5,
    }

    const trail = new Array(params.pointsNumber).fill(null).map(() => ({
      x: pointer.x,
      y: pointer.y,
      dx: 0,
      dy: 0,
    }))

    const updateMousePosition = (x, y) => {
      pointer.x = x
      pointer.y = y
    }

    const onClick = (e) => updateMousePosition(e.pageX, e.pageY)
    const onMouseMove = (e) => {
      mouseMoved = true
      updateMousePosition(e.pageX, e.pageY)
    }
    const onTouchMove = (e) => {
      if (!e.targetTouches?.[0]) return
      mouseMoved = true
      updateMousePosition(e.targetTouches[0].pageX, e.targetTouches[0].pageY)
    }

    const setupCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const update = (t) => {
      if (!mouseMoved) {
        pointer.x =
          (0.5 + 0.3 * Math.cos(0.002 * t) * Math.sin(0.005 * t)) *
          window.innerWidth
        pointer.y =
          (0.5 + 0.2 * Math.cos(0.005 * t) + 0.1 * Math.cos(0.01 * t)) *
          window.innerHeight
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      trail.forEach((p, idx) => {
        const prev = idx === 0 ? pointer : trail[idx - 1]
        const spring = idx === 0 ? 0.4 * params.spring : params.spring
        p.dx += (prev.x - p.x) * spring
        p.dy += (prev.y - p.y) * spring
        p.dx *= params.friction
        p.dy *= params.friction
        p.x += p.dx
        p.y += p.dy
      })

      ctx.strokeStyle = trailColor
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()
      ctx.moveTo(trail[0].x, trail[0].y)

      for (let i = 1; i < trail.length - 1; i += 1) {
        const xc = 0.5 * (trail[i].x + trail[i + 1].x)
        const yc = 0.5 * (trail[i].y + trail[i + 1].y)
        ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc)
        ctx.lineWidth = params.widthFactor * (params.pointsNumber - i)
        ctx.stroke()
      }

      ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y)
      ctx.stroke()

      rafId = window.requestAnimationFrame(update)
    }

    setupCanvas()
    rafId = window.requestAnimationFrame(update)
    window.addEventListener('resize', setupCanvas)
    window.addEventListener('click', onClick)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    return () => {
      window.cancelAnimationFrame(rafId)
      window.removeEventListener('resize', setupCanvas)
      window.removeEventListener('click', onClick)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [trailColor])

  useEffect(() => {
    if (themeClass !== 'theme-findoc') return

    const syncActiveFrame = () => {
      const target = stageItemRefs.current[activeStage - 1]
      if (!target) return
      setStageFrameStyle({
        top: target.offsetTop,
        height: target.offsetHeight,
        opacity: 1,
        arrowTop: target.offsetTop + target.offsetHeight * 0.5,
      })
    }

    syncActiveFrame()
    window.addEventListener('resize', syncActiveFrame)
    return () => window.removeEventListener('resize', syncActiveFrame)
  }, [activeStage, themeClass])

  useEffect(() => {
    if (themeClass !== 'theme-findoc' || activeStage !== 4) return
    setOutcomeProgressKey((k) => k + 1)
  }, [activeStage, themeClass])

  useEffect(() => {
    if (themeClass !== 'theme-findoc' || activeStage !== 4) return undefined

    let cancelled = false
    let charTimeoutId = 0

    const startDelayId = window.setTimeout(() => {
      const el = stageFourEditorRef.current
      if (!el || cancelled) return
      el.textContent = ''
      let i = 0
      const typeNext = () => {
        if (cancelled || !stageFourEditorRef.current) return
        if (i >= FINDOC_OUTCOME_WELCOME_TEXT.length) return
        el.textContent += FINDOC_OUTCOME_WELCOME_TEXT[i]
        i += 1
        charTimeoutId = window.setTimeout(typeNext, 110)
      }
      typeNext()
    }, 620)

    return () => {
      cancelled = true
      window.clearTimeout(startDelayId)
      window.clearTimeout(charTimeoutId)
    }
  }, [activeStage, themeClass])

  const handleStageWheel = (event) => {
    if (themeClass !== 'theme-findoc') return
    event.preventDefault()
    if (wheelLockRef.current) return

    const direction = Math.sign(event.deltaY)
    if (direction === 0) return

    wheelLockRef.current = true
    setActiveStage((prev) => {
      const next = prev + direction
      if (next < 1) return 1
      if (next > 4) return 4
      return next
    })

    window.setTimeout(() => {
      wheelLockRef.current = false
    }, 430)
  }

  const handleStageInputChange = (key) => (event) => {
    const value = event?.target?.value ?? ''
    setStageInputState((prev) => ({ ...prev, [key]: value }))
  }

  const runEditorCommand = (command) => () => {
    const editor = stageFourEditorRef.current
    if (!editor) return
    editor.focus()
    document.execCommand(command, false)
  }

  const handleStageFileChange = (key) => (event) => {
    const fileName = event?.target?.files?.[0]?.name ?? ''
    setStageInputState((prev) => ({ ...prev, [key]: fileName }))
  }

  const handleArrowPointerDown = (event) => {
    if (themeClass !== 'theme-findoc') return
    if (event.button !== 0 && event.pointerType !== 'touch') return

    const centers = stageItemRefs.current
      .filter(Boolean)
      .map((item) => item.offsetTop + item.offsetHeight * 0.5)
    if (!centers.length) return

    const currentArrowTop = stageFrameStyle.arrowTop || centers[Math.max(0, activeStage - 1)]
    arrowDragRef.current = {
      active: true,
      pointerId: event.pointerId,
      startY: event.clientY,
      startArrowTop: currentArrowTop,
      centers,
    }
    setIsArrowDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
    event.preventDefault()
  }

  const handleArrowPointerMove = (event) => {
    const drag = arrowDragRef.current
    if (!drag.active || event.pointerId !== drag.pointerId) return

    const min = drag.centers[0]
    const max = drag.centers[drag.centers.length - 1]
    const nextArrowTop = Math.max(min, Math.min(max, drag.startArrowTop + (event.clientY - drag.startY)))
    setStageFrameStyle((prev) => ({
      ...prev,
      arrowTop: nextArrowTop,
      opacity: 1,
    }))
  }

  const handleArrowPointerUp = (event) => {
    const drag = arrowDragRef.current
    if (!drag.active || event.pointerId !== drag.pointerId) return

    const railArrowTop = stageFrameStyle.arrowTop || drag.startArrowTop
    let nearestIdx = 0
    let nearestDistance = Number.POSITIVE_INFINITY
    drag.centers.forEach((center, idx) => {
      const distance = Math.abs(center - railArrowTop)
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestIdx = idx
      }
    })

    const nearestStage = nearestIdx + 1
    const target = stageItemRefs.current[nearestIdx]
    setActiveStage(nearestStage)
    setStageFrameStyle((prev) => ({
      ...prev,
      top: target ? target.offsetTop : prev.top,
      height: target ? target.offsetHeight : prev.height,
      arrowTop: drag.centers[nearestIdx],
      opacity: 1,
    }))

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    arrowDragRef.current.active = false
    arrowDragRef.current.pointerId = null
    setIsArrowDragging(false)
  }

  return (
    <div className={`finDocShell ${themeClass}`}>
      <canvas ref={canvasRef} className="finCursorCanvas" aria-hidden="true" />
      <header className="finNav">
        <div className="finNavInner">
          <div className="finBrand" aria-label={brandName}>
            {brandName}
          </div>

          <nav className="finNavLinks" aria-label="Main navigation">
            <Link
              className="finNavBack button button--pan"
              to="/menu"
              aria-label="Back to menu"
            >
              <span>← Menu</span>
            </Link>
            <a className="finNavLink button button--pan" href="#">
              <span>Overview</span>
            </a>
            {featuresTo ? (
              <Link className="finNavLink button button--pan" to={featuresTo}>
                <span>Features</span>
              </Link>
            ) : (
              <a className="finNavLink button button--pan" href="#">
                <span>Features</span>
              </a>
            )}
            <a className="finNavLink button button--pan" href="#">
              <span>Docs</span>
            </a>
          </nav>
        </div>
      </header>

      <main className="finMain finMain--dashboard">
        <section
          className={`finDocMaintenance finDocMaintenance--${themeClass.replace('theme-', '')}`}
          role="status"
          aria-live="polite"
          aria-label={`${brandName} maintenance notice`}
        >
          {themeClass === 'theme-findoc' ? (
            <div className="finDocDashPlaceholder" aria-label="FinDoc dashboard placeholder">
              <aside className="finDocDashPlaceholder__left" aria-label="Progress stages">
                <div className="finDocStageRail" role="list" aria-label="Dashboard stages">
                  <span className="finDocStageRail__line" aria-hidden="true" />
                  <span
                    className={`finDocStageRail__activeArrow ${isArrowDragging ? 'is-dragging' : ''}`}
                    aria-hidden="true"
                    style={{
                      top: `${stageFrameStyle.arrowTop || stageFrameStyle.top + stageFrameStyle.height * 0.5}px`,
                      opacity: stageFrameStyle.opacity,
                    }}
                    onPointerDown={handleArrowPointerDown}
                    onPointerMove={handleArrowPointerMove}
                    onPointerUp={handleArrowPointerUp}
                    onPointerCancel={handleArrowPointerUp}
                  />
                  {FINDOC_STAGE_ITEMS.map((stage) => (
                    <button
                      key={stage.id}
                      ref={(el) => {
                        stageItemRefs.current[stage.id - 1] = el
                      }}
                      type="button"
                      className={`finDocStageRail__item ${activeStage === stage.id ? 'is-active' : ''}`}
                      role="listitem"
                      onClick={() => setActiveStage(stage.id)}
                      aria-label={`Select stage ${stage.id}`}
                      aria-pressed={activeStage === stage.id}
                    >
                      <span className="finDocStageRail__dot" aria-hidden="true" />
                      <span className="finDocStageRail__label">Stage {stage.id}</span>
                    </button>
                  ))}
                </div>
              </aside>
              <div className="finDocDashPlaceholder__right">
                <h2
                  className="finDocStageHeadingWrap"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {headingPair ? (
                    <>
                      <span
                        className="finDocStageHeading__layer finDocStageHeading__layer--exit"
                        key={`heading-out-${headingPair.out}`}
                        aria-hidden="true"
                      >
                        {findocStageTitle(headingPair.out)}
                      </span>
                      <span
                        className="finDocStageHeading__layer finDocStageHeading__layer--enter"
                        key={`heading-in-${headingPair.in}`}
                      >
                        {findocStageTitle(headingPair.in)}
                      </span>
                    </>
                  ) : (
                    <span className="finDocStageHeading__layer finDocStageHeading__layer--static">
                      {findocStageTitle(idleHeadingStageId)}
                    </span>
                  )}
                </h2>
                <div className="finDocDashPlaceholder__mainShell">
                  <div className="finDocDashPlaceholder__main">
                    <div className="finDocStageViewport" aria-live="polite" onWheel={handleStageWheel}>
                    <div
                      className="finDocStageTrack"
                      style={{ transform: `translateY(-${(activeStage - 1) * 100}%)` }}
                    >
                    {FINDOC_STAGE_ITEMS.map((stage) => (
                      <article
                        key={stage.id}
                        className={`finDocStagePanel${stage.id === 4 ? ' finDocStagePanel--outcome' : ''}`}
                        aria-label={`Stage ${stage.id} panel`}
                      >
                        {stage.id === 1 ? (
                          <div className="finDocUploadCard" aria-label="Project file upload panel">
                            <label
                              className="finDocUploadCard__dropzone"
                              htmlFor={`findoc-project-upload-${stage.id}`}
                            >
                              <input
                                id={`findoc-project-upload-${stage.id}`}
                                type="file"
                                className="finDocUploadCard__input"
                                onChange={handleStageFileChange('projectFile')}
                              />
                              <span className="finDocUploadCard__headline">Drop your project file here</span>
                              <span className="finDocUploadCard__sub">or click to browse</span>
                            </label>
                            <ul className="finDocUploadCard__list" aria-label="Uploaded files list">
                              <li>
                                <span>template-q2.xlsx</span>
                                <span>Ready</span>
                              </li>
                              <li>
                                <span>client-mapping.csv</span>
                                <span>Ready</span>
                              </li>
                              <li>
                                <span>notes.docx</span>
                                <span>Pending</span>
                              </li>
                            </ul>
                          </div>
                        ) : stage.id === 2 ? (
                          <div className="finDocUploadCard" aria-label="Project file upload panel">
                            <label
                              className="finDocUploadCard__dropzone"
                              htmlFor={`findoc-project-upload-${stage.id}`}
                            >
                              <input
                                id={`findoc-project-upload-${stage.id}`}
                                type="file"
                                className="finDocUploadCard__input"
                                onChange={handleStageFileChange('templateFile')}
                              />
                              <span className="finDocUploadCard__headline">Drop your Template file here</span>
                              <span className="finDocUploadCard__sub">or click to browse</span>
                            </label>
                            <div className="finDocUploadCard__fields" aria-label="Input fields">
                              <label className="finDocUploadCard__field">
                                <span>Reference Link</span>
                                <input
                                  type="text"
                                  placeholder="Paste reference link..."
                                  value={stageInputState.referenceLink}
                                  onChange={handleStageInputChange('referenceLink')}
                                />
                              </label>
                              <label className="finDocUploadCard__field">
                                <span>View</span>
                                <input
                                  type="text"
                                  placeholder="Type view name..."
                                  value={stageInputState.view}
                                  onChange={handleStageInputChange('view')}
                                />
                              </label>
                            </div>
                          </div>
                        ) : stage.id === 3 ? (
                          <section className="finDocSummaryCard" aria-label="Summary of user inputs">
                            <label className="finDocSummaryCard__projectField">
                              <span>Project Named</span>
                              <input
                                type="text"
                                placeholder="Type project name..."
                                value={stageInputState.projectNamed}
                                onChange={handleStageInputChange('projectNamed')}
                              />
                            </label>
                            <dl className="finDocSummaryCard__list">
                              <div>
                                <dt>Project File</dt>
                                <dd>{stageInputState.projectFile || 'Not uploaded'}</dd>
                              </div>
                              <div>
                                <dt>Template File</dt>
                                <dd>{stageInputState.templateFile || 'Not uploaded'}</dd>
                              </div>
                              <div>
                                <dt>Reference Link</dt>
                                <dd>{stageInputState.referenceLink || 'Not provided'}</dd>
                              </div>
                              <div>
                                <dt>View</dt>
                                <dd>{stageInputState.view || 'Not provided'}</dd>
                              </div>
                            </dl>
                          </section>
                        ) : stage.id === 4 ? (
                          <div className="finDocOutcomeEditorBlock">
                            <section className="finDocEditorCard" aria-label="Text editor panel">
                              <div className="finDocEditorCard__toolbar" aria-label="Editor toolbar">
                                <button type="button" onClick={runEditorCommand('bold')}>B</button>
                                <button type="button" onClick={runEditorCommand('italic')}>I</button>
                                <button type="button" onClick={runEditorCommand('underline')}>U</button>
                                <button type="button" onClick={runEditorCommand('insertUnorderedList')}>
                                  • List
                                </button>
                                <button type="button" onClick={runEditorCommand('insertOrderedList')}>
                                  1. List
                                </button>
                              </div>
                              <div
                                ref={stageFourEditorRef}
                                className="finDocEditorCard__editor"
                                contentEditable
                                suppressContentEditableWarning
                                role="textbox"
                                aria-multiline="true"
                                data-placeholder="Type your final notes here..."
                              />
                            </section>
                            <div
                              className={`finDocOutcomeProgress ${activeStage === 4 ? 'finDocOutcomeProgress--active' : ''}`}
                              aria-hidden="true"
                            >
                              <div className="finDocOutcomeProgress__track">
                                <div
                                  key={outcomeProgressKey}
                                  className="finDocOutcomeProgress__fill"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <h1>Stage {stage.id}</h1>
                        )}
                        {stage.id !== 4 ? (
                          <div className="finDocStagePanel__actions" aria-label={`Stage ${stage.id} navigation`}>
                            <button
                              type="button"
                              className="finDocStagePanel__btn"
                              onClick={() => setActiveStage((prev) => Math.max(1, prev - 1))}
                              disabled={stage.id === 1}
                            >
                              Previous
                            </button>
                            <button
                              type="button"
                              className="finDocStagePanel__btn"
                              onClick={() => setActiveStage((prev) => Math.min(4, prev + 1))}
                              disabled={stage.id === 4}
                            >
                              Next
                            </button>
                          </div>
                        ) : null}
                      </article>
                    ))}
                    </div>
                  </div>
                  </div>
                  {activeStage === 4 ? (
                    <button
                      type="button"
                      className="finDocOutcomeDownload"
                      aria-label="Download"
                    >
                      <svg
                        className="finDocOutcomeDownload__icon"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      <span className="finDocOutcomeDownload__label">download</span>
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ) : (
            <h1>Under maintenance</h1>
          )}
        </section>
        <footer className="siteCopyrightNote" aria-label="Copyright notice">
          {COPYRIGHT_TEXT}
        </footer>
      </main>
    </div>
  )
}

function MenuPage() {
  const location = useLocation()
  const [, setSearchParams] = useSearchParams()
  const menuRef = useRef(null)
  const vetraTitleRef = useRef(null)
  const cursorRef = useRef(null)
  const searchInputRef = useRef(null)
  const searchCountRef = useRef(null)
  const rafRef = useRef(0)
  const turbulenceTlRef = useRef(null)
  const [demoMode, setDemoMode] = useState(readDemoParamFromWindow)
  const [curtainVisible, setCurtainVisible] = useState(readDemoParamFromWindow)
  /** 默认 1 = Vetra，与竖直锚点对齐；离开菜单栏时回中间张 */
  const [landscapeSlideIndex, setLandscapeSlideIndex] = useState(1)
  const [bgCarouselIndex, setBgCarouselIndex] = useState(0)
  const demoModeRef = useRef(demoMode)
  const demoPathRef = useRef(null)
  const curtainTlRef = useRef(null)
  const titleColorTlRef = useRef(null)

  useEffect(() => {
    return () => {
      curtainTlRef.current?.kill()
      titleColorTlRef.current?.kill()
    }
  }, [])

  useEffect(() => {
    demoModeRef.current = demoMode
  }, [demoMode])

  useLayoutEffect(() => {
    const q = new URLSearchParams(location.search).get(MENU_DEMO_QUERY)
    if (q !== MENU_DEMO_QUERY_VALUE) return
    curtainTlRef.current?.kill()
    curtainTlRef.current = null
    flushSync(() => {
      setDemoMode(true)
      setCurtainVisible(true)
    })
    const p = demoPathRef.current
    if (p) p.setAttribute('d', DEMO_PATH_FULL)
    requestAnimationFrame(() => {
      const chars = menuRef.current?.querySelectorAll('.menu__item-title .char')
      if (chars?.length) {
        titleColorTlRef.current?.kill()
        gsap.set(chars, { color: '#000000' })
      }
    })
  }, [location.search])

  const onDemoModeChange = (e) => {
    const next = e.target.checked
    const path = demoPathRef.current
    curtainTlRef.current?.kill()
    curtainTlRef.current = null

    const root = menuRef.current
    const chars = root?.querySelectorAll?.('.menu__item-title .char')
    const targetTitleColor = next ? '#000000' : '#ffffff'

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const applyTitleColor = () => {
      if (!chars?.length) return
      titleColorTlRef.current?.kill()
      if (reduced) {
        gsap.set(chars, { color: targetTitleColor })
        return
      }
      titleColorTlRef.current = gsap.to(chars, {
        color: targetTitleColor,
        duration: 0.42,
        ease: 'power2.inOut',
        overwrite: 'auto',
      })
    }

    if (reduced) {
      setDemoMode(next)
      setCurtainVisible(next)
      if (path) path.setAttribute('d', next ? DEMO_PATH_FULL : DEMO_PATH_HIDDEN)
      applyTitleColor()
      return
    }

    applyTitleColor()

    if (next) {
      flushSync(() => {
        setCurtainVisible(true)
        setDemoMode(true)
      })
      const p = demoPathRef.current
      if (p) {
        p.setAttribute('d', DEMO_PATH_HIDDEN)
        curtainTlRef.current = playDemoCurtainIn(p, () => {
          curtainTlRef.current = null
        })
      }
      return
    }

    setDemoMode(false)
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.delete(MENU_DEMO_QUERY)
        return next
      },
      { replace: true },
    )
    if (!path) {
      setCurtainVisible(false)
      return
    }
    path.setAttribute('d', DEMO_PATH_FULL)
    curtainTlRef.current = playDemoCurtainOut(path, () => {
      curtainTlRef.current = null
      setCurtainVisible(false)
    })
  }

  useEffect(() => {
    const root = menuRef.current
    const cursor = cursorRef.current
    if (!root || !cursor) return

    Splitting({ target: root.querySelectorAll('[data-splitting]') })

    syncMenuDemoLandscapeTop(root, vetraTitleRef.current)

    const menuLinks = root.querySelectorAll('.menu__item')
    const allLinks = root.querySelectorAll('a')
    const [lineHorizontal, lineVertical] = cursor.querySelectorAll('.cursor__line')
    const turbulenceX = root.querySelector('#filter-noise-x > feTurbulence')
    const turbulenceY = root.querySelector('#filter-noise-y > feTurbulence')
    if (!lineHorizontal || !lineVertical || !turbulenceX || !turbulenceY) return

    let mouse = { x: 0, y: 0 }
    let isRendered = false
    const rendered = {
      tx: { previous: 0, current: 0, amt: 0.15 },
      ty: { previous: 0, current: 0, amt: 0.15 },
    }
    const primitive = { turbulence: 0 }

    gsap.set([lineHorizontal, lineVertical], { opacity: 0 })

    const noiseTl = gsap
      .timeline({
        paused: true,
        onStart: () => {
          lineHorizontal.style.filter = 'url(#filter-noise-x)'
          lineVertical.style.filter = 'url(#filter-noise-y)'
        },
        onUpdate: () => {
          turbulenceX.setAttribute('baseFrequency', String(primitive.turbulence))
          turbulenceY.setAttribute('baseFrequency', String(primitive.turbulence))
        },
        onComplete: () => {
          lineHorizontal.style.filter = 'none'
          lineVertical.style.filter = 'none'
        },
      })
      .to(primitive, {
        duration: 0.5,
        ease: 'power1',
        startAt: { turbulence: 1 },
        turbulence: 0,
      })
    turbulenceTlRef.current = noiseTl

    const renderCursor = () => {
      rendered.tx.current = mouse.x
      rendered.ty.current = mouse.y
      rendered.tx.previous =
        (1 - rendered.tx.amt) * rendered.tx.previous +
        rendered.tx.amt * rendered.tx.current
      rendered.ty.previous =
        (1 - rendered.ty.amt) * rendered.ty.previous +
        rendered.ty.amt * rendered.ty.current

      lineVertical.style.transform = `translate3d(${rendered.tx.previous}px,0,0)`
      lineHorizontal.style.transform = `translate3d(0,${rendered.ty.previous}px,0)`
      rafRef.current = requestAnimationFrame(renderCursor)
    }

    const onMove = (ev) => {
      mouse = { x: ev.clientX, y: ev.clientY }
      if (!isRendered) {
        isRendered = true
        rendered.tx.previous = rendered.tx.current = mouse.x
        rendered.ty.previous = rendered.ty.current = mouse.y
        gsap.to([lineHorizontal, lineVertical], {
          duration: 0.9,
          ease: 'power3.out',
          opacity: 1,
        })
        rafRef.current = requestAnimationFrame(renderCursor)
      }
    }

    window.addEventListener('mousemove', onMove)

    const onLinkEnter = () => {
      noiseTl.restart()
    }
    const onLinkLeave = () => {
      noiseTl.progress(1).pause()
      lineHorizontal.style.filter = 'none'
      lineVertical.style.filter = 'none'
    }

    const menuEnterHandlers = []
    const menuLeaveHandlers = []

    menuLinks.forEach((el) => {
      const chars = el.querySelectorAll('.menu__item-title .char')

      const onEnter = () => {
        const colorInitial = demoModeRef.current ? '#000000' : '#ffffff'
        const colorFinal = demoModeRef.current ? '#38bdf8' : '#f87171'

        gsap.killTweensOf(chars)
        gsap.set(chars, { color: colorInitial })
        gsap
          .timeline()
          .to(
            chars,
            {
              repeat: 1,
              repeatRefresh: true,
              duration: 0.06,
              ease: 'power3',
              x: () => gsap.utils.random(-12, 12),
              y: () => gsap.utils.random(-14, 8),
              rotation: () => gsap.utils.random(-4, 4),
            },
            0,
          )
          .to(
            chars,
            { x: 0, y: 0, rotation: 0, color: colorFinal, duration: 0.12, ease: 'power3.out' },
            '+=0.02',
          )
      }

      const onLeave = () => {
        const colorInitial = demoModeRef.current ? '#000000' : '#ffffff'
        gsap.killTweensOf(chars)
        gsap.to(chars, {
          duration: 0.28,
          ease: 'power3.out',
          color: colorInitial,
          x: 0,
          y: 0,
          rotation: 0,
        })
      }

      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
      menuEnterHandlers.push([el, onEnter])
      menuLeaveHandlers.push([el, onLeave])
    })

    allLinks.forEach((el) => {
      el.addEventListener('mouseenter', onLinkEnter)
      el.addEventListener('mouseleave', onLinkLeave)
    })

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', onMove)
      turbulenceTlRef.current?.kill()
      gsap.killTweensOf(root.querySelectorAll('.menu__item-title .char'))
      menuEnterHandlers.forEach(([el, fn]) => el.removeEventListener('mouseenter', fn))
      menuLeaveHandlers.forEach(([el, fn]) => el.removeEventListener('mouseleave', fn))
      allLinks.forEach((el) => {
        el.removeEventListener('mouseenter', onLinkEnter)
        el.removeEventListener('mouseleave', onLinkLeave)
      })
    }
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setBgCarouselIndex((prev) => (prev + 1) % MENU_DEMO_BG_CAROUSEL.length)
    }, 3000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const root = menuRef.current
    const input = searchInputRef.current
    const count = searchCountRef.current
    if (!root || !input || !count) return

    const items = [...root.querySelectorAll('.menu__item')]

    const normalize = (v) => v.toLowerCase().trim()
    let filterRaf = 0
    const paintResult = () => {
      const query = normalize(input.value)
      let matches = 0

      items.forEach((el) => {
        const title = normalize(el.dataset.title || '')
        const subtitle = normalize(el.dataset.subtitle || '')
        const target = `${title} ${subtitle}`
        const hit = !query || target.includes(query)
        if (hit) matches += 1

        el.classList.toggle('menu__item--match', hit)
        el.classList.toggle('menu__item--dim', !hit)
      })

      count.textContent = query
        ? `${matches} / ${items.length} matches`
        : `Type to filter (${items.length} items)`
    }

    const schedulePaint = () => {
      cancelAnimationFrame(filterRaf)
      filterRaf = requestAnimationFrame(() => {
        filterRaf = 0
        paintResult()
      })
    }

    const onInput = () => schedulePaint()
    const onKey = (e) => {
      if (e.key === '/' && document.activeElement !== input) {
        e.preventDefault()
        input.focus()
      }
      if (e.key === 'Escape' && document.activeElement === input) {
        input.value = ''
        paintResult()
        input.blur()
      }
    }

    input.addEventListener('input', onInput)
    window.addEventListener('keydown', onKey)
    paintResult()

    return () => {
      cancelAnimationFrame(filterRaf)
      input.removeEventListener('input', onInput)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  useLayoutEffect(() => {
    const shell = menuRef.current
    const titleEl = vetraTitleRef.current
    if (!shell || !titleEl) return

    const syncLandscapeTop = () => {
      syncMenuDemoLandscapeTop(shell, titleEl)
    }

    syncLandscapeTop()

    const menuNav = shell.querySelector('.menu')
    const menuMain = shell.querySelector('.menuMain')
    const ro = new ResizeObserver(syncLandscapeTop)
    ro.observe(titleEl)
    if (menuNav) ro.observe(menuNav)

    window.addEventListener('resize', syncLandscapeTop)
    menuMain?.addEventListener('scroll', syncLandscapeTop, { passive: true })
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', syncLandscapeTop)
      menuMain?.removeEventListener('scroll', syncLandscapeTop)
    }
  }, [])

  return (
    <main
      className={`menuPage menuShell${
        demoMode || curtainVisible ? ' menuShell--demoChrome' : ''
      }${demoMode ? ' menuShell--demoShift' : ''}`}
      ref={menuRef}
      aria-label="menu page"
    >
      <div className="menuMain">
        <div
          className={`menuDemoCurtain${curtainVisible ? ' menuDemoCurtain--visible' : ''}`}
          aria-hidden={!curtainVisible}
        >
          <svg
            className="menuDemoCurtain__svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMin slice"
          >
            <defs>
              <linearGradient
                id="menuDemoCurtainGrad"
                x1="0"
                y1="0"
                x2="99"
                y2="99"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.2" stopColor="rgb(255, 135, 9)" />
                <stop offset="0.7" stopColor="rgb(247, 189, 248)" />
              </linearGradient>
            </defs>
            <path
              ref={demoPathRef}
              className="menuDemoCurtain__path"
              fill="url(#menuDemoCurtainGrad)"
              d={DEMO_PATH_HIDDEN}
            />
          </svg>
        </div>
        <div className="menuNeonWrap">
          <input
            type="checkbox"
            className="neon"
            checked={demoMode}
            onChange={onDemoModeChange}
            aria-label={demoMode ? 'Demo mode on, switch to work mode' : 'Work mode on, switch to demo mode'}
            title={demoMode ? 'Demo mode' : 'Work mode'}
          />
          <span className="menuNeonModeLabel" aria-live="polite">
            {demoMode ? 'Demo mode' : 'Work mode'}
          </span>
        </div>
        <div className="menuTopBar">
            <label className="menuSearch" aria-label="Search menu">
              <svg
                className="menuSearch__icon"
                viewBox="0 0 24 24"
                fill="none"
                role="presentation"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
                <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <input
                ref={searchInputRef}
                className="menuSearch__input"
                type="search"
                name="menu-search"
                placeholder="Search products, capabilities, use cases..."
                autoComplete="off"
              />
              <kbd className="menuSearch__kbd">/</kbd>
            </label>
            <div className="menuSearch__meta" ref={searchCountRef} />
          </div>

        <div className="menuDemoLandscape" aria-hidden="true">
          <div className="menuDemoLandscape__bgCarousel">
            <div
              className="menuDemoLandscape__bgTrack"
              style={{ transform: `translateX(-${bgCarouselIndex * 10}%)` }}
            >
              {MENU_DEMO_BG_CAROUSEL.map((src, idx) => (
                <img
                  key={`${idx}-${src}`}
                  className="menuDemoLandscape__staticBg"
                  src={src}
                  alt=""
                  width={1440}
                  height={1080}
                  decoding="async"
                />
              ))}
            </div>
            <div className="menuDemoLandscape__bgNav">
              <button
                type="button"
                className="menuDemoLandscape__bgArrow"
                onClick={() =>
                  setBgCarouselIndex(
                    (prev) => (prev - 1 + MENU_DEMO_BG_CAROUSEL.length) % MENU_DEMO_BG_CAROUSEL.length,
                  )
                }
                aria-label="Previous office photo"
              >
                &larr;
              </button>
              <button
                type="button"
                className="menuDemoLandscape__bgArrow"
                onClick={() => setBgCarouselIndex((prev) => (prev + 1) % MENU_DEMO_BG_CAROUSEL.length)}
                aria-label="Next office photo"
              >
                &rarr;
              </button>
            </div>
          </div>
          <div
            className="menuDemoLandscape__track"
            style={{
              transform: `translateY(calc(${-landscapeSlideIndex} * 100% / 3))`,
            }}
          >
            {MENU_ITEMS.map((item) => (
              <div className={`menuDemoLandscape__slide ${item.slideClass}`} key={`${item.id}-slide`}>
                <div className="menuDemoLandscape__slideFore">
                  <img
                    className="menuDemoLandscape__undraw"
                    src={item.undraw.src}
                    alt=""
                    width={item.undraw.width}
                    height={item.undraw.height}
                    decoding="async"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <nav
          className="menu"
          aria-label="city menu"
          aria-hidden={curtainVisible && !demoMode}
          onMouseLeave={() => setLandscapeSlideIndex(1)}
        >
          {MENU_ITEMS.map((item, idx) => (
            <Link
              key={item.id}
              to={getMenuItemTarget(item, demoMode)}
              className="menu__item"
              data-title={item.title}
              data-subtitle={item.subtitle}
              onMouseEnter={() => setLandscapeSlideIndex(idx)}
            >
              <span
                ref={item.id === 'vetra' ? vetraTitleRef : undefined}
                data-splitting=""
                className="menu__item-title"
              >
                {item.title}
              </span>
              <span data-splitting="" className={`menu__item-sub menu__item-sub--${item.id}`}>
                {item.subtitleText}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="cursor" ref={cursorRef}>
        <svg
          className="cursor__line cursor__line--horizontal"
          viewBox="0 0 200 20"
          preserveAspectRatio="none"
        >
          <defs>
            <filter
              id="filter-noise-x"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
              filterUnits="objectBoundingBox"
            >
              <feTurbulence type="fractalNoise" baseFrequency="0" numOctaves="1" result="warp" />
              <feOffset dx="-30" result="warpOffset" />
              <feDisplacementMap
                xChannelSelector="R"
                yChannelSelector="G"
                scale="30"
                in="SourceGraphic"
                in2="warpOffset"
              />
            </filter>
          </defs>
          <line
            className="cursor__line-element"
            x1="0"
            y1="10"
            x2="200"
            y2="10"
            shapeRendering="crispEdges"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <svg
          className="cursor__line cursor__line--vertical"
          viewBox="0 0 20 200"
          preserveAspectRatio="none"
        >
          <defs>
            <filter
              id="filter-noise-y"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
              filterUnits="objectBoundingBox"
            >
              <feTurbulence type="fractalNoise" baseFrequency="0" numOctaves="1" result="warp" />
              <feOffset dy="-30" result="warpOffset" />
              <feDisplacementMap
                xChannelSelector="R"
                yChannelSelector="G"
                scale="30"
                in="SourceGraphic"
                in2="warpOffset"
              />
            </filter>
          </defs>
          <line
            className="cursor__line-element"
            x1="10"
            y1="0"
            x2="10"
            y2="200"
            shapeRendering="crispEdges"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
      <footer className="siteCopyrightNote" aria-label="Copyright notice">
        {COPYRIGHT_TEXT}
      </footer>
    </main>
  )
}

/** Demo 模式下各 title 独立 overview，暂时留白，仅保留返回菜单入口 */
function DemoTitleOverviewPage({ title }) {
  return (
    <div className="demoTitleOnScroll demoTitleOnScroll--overviewPlaceholder">
      <div className="demoTitleOnScroll__parallaxGuides" aria-hidden="true" />
      <header className="demoTitleOverview__bar demoTitleOnScroll__bar">
        <div className="demoTitleOnScroll__barStart">
          <Link
            to={MENU_RESTORE_DEMO_TO}
            className="link link--ersa demoTitleOnScroll__menuErsa"
          >
            <span>← Menu</span>
          </Link>
          <div className="demoTitleOnScroll__heroTrack">
            <h1 className="frame__title-main onScrollViewSwitchMount__heroTitle">
              <span
                className="demoTitleOnScroll__heroGithubStatic"
                aria-hidden="true"
              >
                <GithubMarkIcon />
              </span>
            </h1>
          </div>
        </div>
      </header>
      <div className="demoTitleOnScroll__stage">
        <main
          className="demoTitleOverview__main"
          aria-label={`${title} overview (placeholder)`}
        />
      </div>
      <footer className="siteCopyrightNote" aria-label="Copyright notice">
        {COPYRIGHT_TEXT}
      </footer>
    </div>
  )
}

function getMenuItemTarget(item, demoMode) {
  return demoMode ? item.overviewPath : item.basePath
}

function renderOverviewElement(item) {
  if (item.id === 'findoc') return <FinDocOnScrollOverviewPage />
  if (item.id === 'vetra') return <ImageExpansionTypographyPage />
  if (item.id === 'arbix') return <ArbixOverviewPage />
  return <DemoTitleOverviewPage title={item.title} />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/HERO" replace />} />
        <Route path="/HERO" element={<HeroBayerCirclesPage />} />
        <Route path="/menu" element={<MenuPage />} />
        {MENU_ITEMS.map((item) => (
          <Route
            key={item.id}
            path={item.basePath}
            element={
              <ThemedDocPage
                brandName={item.title}
                themeClass={item.themeClass}
                trailColor={item.trailColor}
                featuresTo={item.overviewPath}
              />
            }
          />
        ))}
        {MENU_ITEMS.map((item) => (
          <Route
            key={`${item.id}-overview`}
            path={item.overviewPath}
            element={renderOverviewElement(item)}
          />
        ))}
        <Route path="/ArbiX" element={<ArbixOverviewPage />} />
        <Route path="/ImageExpansionTypography" element={<ImageExpansionTypographyPage />} />
      </Routes>
    </BrowserRouter>
  )
}
