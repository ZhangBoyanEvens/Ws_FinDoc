import { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'
import { gsap } from 'gsap'
import Splitting from 'splitting'
import 'splitting/dist/splitting.css'
import 'splitting/dist/splitting-cells.css'
import './App.css'

/** 与 MorphSVG 示例同构：始终用一条二次贝塞尔 `Q`，顶缘为平滑弧线，不做多边形插值 */
function demoCurtainPathD(ySide, yPeak) {
  return `M 0 100 V ${ySide} Q 50 ${yPeak} 100 ${ySide} V 100 z`
}

const DEMO_PATH_HIDDEN = demoCurtainPathD(100, 100)
const DEMO_PATH_FULL = demoCurtainPathD(0, 0)

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

function ThemedDocPage({ brandName, themeClass, trailColor }) {
  const canvasRef = useRef(null)

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
            <a className="finNavLink button button--pan" href="#">
              <span>Features</span>
            </a>
            <a className="finNavLink button button--pan" href="#">
              <span>Docs</span>
            </a>
          </nav>
        </div>
      </header>

      {/* 按你要求：main 区域不添加任何内容 */}
      <main className="finMain" />
    </div>
  )
}

function MenuPage() {
  const menuRef = useRef(null)
  const cursorRef = useRef(null)
  const searchInputRef = useRef(null)
  const searchCountRef = useRef(null)
  const rafRef = useRef(0)
  const turbulenceTlRef = useRef(null)
  const enterTlsRef = useRef([])
  const leaveTlsRef = useRef([])
  const [demoMode, setDemoMode] = useState(false)
  const [curtainVisible, setCurtainVisible] = useState(false)
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
      setCurtainVisible(true)
      setDemoMode(true)
      queueMicrotask(() => {
        const p = demoPathRef.current
        if (!p) return
        p.setAttribute('d', DEMO_PATH_HIDDEN)
        curtainTlRef.current = playDemoCurtainIn(p, () => {
          curtainTlRef.current = null
        })
      })
      return
    }

    setDemoMode(false)
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

        leaveTlsRef.current.forEach((tl) => tl.kill())
        const tl = gsap
          .timeline({
            defaults: {
              duration: 0.06,
              ease: 'power3',
              x: () => gsap.utils.random(-12, 12),
              y: () => gsap.utils.random(-14, 8),
              rotation: () => gsap.utils.random(-4, 4),
              color: () =>
                gsap.utils.random(0, 3) < 0.5 ? colorFinal : colorInitial,
            },
          })
          .to(chars, { repeat: 1, repeatRefresh: true }, 0)
          .to(chars, { x: 0, y: 0, rotation: 0, color: colorFinal, duration: 0.12 }, '+=0.02')
        enterTlsRef.current.push(tl)
      }

      const onLeave = () => {
        const colorInitial = demoModeRef.current ? '#000000' : '#ffffff'
        const tl = gsap.to(chars, {
          duration: 0.4,
          ease: 'power3',
          color: colorInitial,
        })
        leaveTlsRef.current.push(tl)
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
      enterTlsRef.current.forEach((tl) => tl.kill())
      leaveTlsRef.current.forEach((tl) => tl.kill())
      menuEnterHandlers.forEach(([el, fn]) => el.removeEventListener('mouseenter', fn))
      menuLeaveHandlers.forEach(([el, fn]) => el.removeEventListener('mouseleave', fn))
      allLinks.forEach((el) => {
        el.removeEventListener('mouseenter', onLinkEnter)
        el.removeEventListener('mouseleave', onLinkLeave)
      })
    }
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

  return (
    <main
      className={`menuPage menuShell${demoMode || curtainVisible ? ' menuShell--demoMode' : ''}`}
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

        <nav
          className="menu"
          aria-label="city menu"
          aria-hidden={curtainVisible && !demoMode}
        >
            <Link
              to="/findoc"
              className="menu__item"
              data-title="FinDoc"
              data-subtitle="Report Automation"
            >
              <span data-splitting="" className="menu__item-title">
                FinDoc
              </span>
              <span data-splitting="" className="menu__item-sub menu__item-sub--findoc">
                Report Automation
              </span>
            </Link>
            <Link
              to="/vetra"
              className="menu__item"
              data-title="Vetra"
              data-subtitle="Enterprise Screening and Due Diligence"
            >
              <span data-splitting="" className="menu__item-title">
                Vetra
              </span>
              <span data-splitting="" className="menu__item-sub menu__item-sub--vetra">
                Enterprise Screening & Due Diligence
              </span>
            </Link>
            <Link
              to="/arbix"
              className="menu__item"
              data-title="Arbix"
              data-subtitle="Cross Platform Price Arbitrage Monitor"
            >
              <span data-splitting="" className="menu__item-title">
                Arbix
              </span>
              <span data-splitting="" className="menu__item-sub menu__item-sub--arbix">
                Cross-Platform Price Arbitrage Monitor
              </span>
            </Link>
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
    </main>
  )
}

function FindocPage() {
  return (
    <ThemedDocPage
      brandName="FinDoc"
      themeClass="theme-findoc"
      trailColor="rgba(22, 163, 74, 0.55)"
    />
  )
}

function VetraPage() {
  return (
    <ThemedDocPage
      brandName="Vetra"
      themeClass="theme-vetra"
      trailColor="rgba(37, 99, 235, 0.55)"
    />
  )
}

function ArbixPage() {
  return (
    <ThemedDocPage
      brandName="Arbix"
      themeClass="theme-arbix"
      trailColor="rgba(220, 38, 38, 0.55)"
    />
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/menu" replace />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/findoc" element={<FindocPage />} />
        <Route path="/vetra" element={<VetraPage />} />
        <Route path="/arbix" element={<ArbixPage />} />
      </Routes>
    </BrowserRouter>
  )
}
