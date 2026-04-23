import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { GithubMarkIcon } from '../onScrollViewSwitch/FinDocOnScrollOverviewPage.jsx'
import { DualWaveAnimation } from './DualWaveAnimation'
import { preloadImages } from './utils'
import './arbixWave.css'

const MENU_RESTORE_DEMO_TO = '/menu?demo=1'
const BRANDS = [
  ['Tesla', 'tesla.webp'],
  ['Chanel', 'chanel.webp'],
  ['Apple', 'apple.webp'],
  ['BMW', 'BMW.webp'],
  ['Saint Laurent', 'YSL.webp'],
  ['Nike', 'nike.webp'],
  ['Hermes', 'hermes.webp'],
  ['Adidas', 'adidas.webp'],
  ['Prada', 'prada.webp'],
  ['Google', 'google.webp'],
  ['Polestar', 'polestar.webp'],
  ['Balenciaga', 'balenciaga.webp'],
  ['Audi', 'audi.webp'],
  ['Valentino', 'valentino.webp'],
  ['Samsung', 'samsung.webp'],
  ['Bottega Veneta', 'bottega.webp'],
  ['Sony', 'sony.webp'],
  ['Aesop', 'aesop.webp'],
  ['Dior', 'dior.webp'],
  ['Porsche', 'porsche.webp'],
  ['Microsoft', 'microsoft.webp'],
  ['Lexus', 'lexus.webp'],
  ['Mercedes-Benz', 'mercedes.webp'],
  ['Huawei', 'huawei.webp'],
]

export function ArbixOverviewPage() {
  const rootRef = useRef(null)
  const dualWaveWrapperRef = useRef(null)
  const searchShellRef = useRef(null)
  const navDragRef = useRef({
    active: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
  })
  const list = useMemo(() => [...BRANDS, ...BRANDS], [])
  const [navEntered, setNavEntered] = useState(false)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother)
    const htmlEl = document.documentElement
    const bodyEl = document.body
    htmlEl.classList.add('arbixWaveScroll')
    bodyEl.classList.add('arbixWaveScroll')

    const root = rootRef.current
    if (!root) {
      return () => {
        document.body.classList.remove('loading')
        htmlEl.classList.remove('arbixWaveScroll')
        bodyEl.classList.remove('arbixWaveScroll')
      }
    }

    let smoother = null
    const parallaxTimelines = []
    let waveAnimation = null
    let cancelled = false

    if (typeof ScrollSmoother?.create === 'function') {
      smoother = ScrollSmoother.create({
        smooth: 1.5,
        normalizeScroll: true,
      })
    }

    root.querySelectorAll('[data-parallax-layers]').forEach((triggerElement) => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: '0% 0%',
          end: '100% 0%',
          scrub: 0,
        },
      })
      const layers = [
        { layer: '1', yPercent: 70 },
        { layer: '2', yPercent: 55 },
        { layer: '3', yPercent: 40 },
        { layer: '4', yPercent: 10 },
      ]
      layers.forEach((layerObj, idx) => {
        timeline.to(
          triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`),
          { yPercent: layerObj.yPercent, ease: 'none' },
          idx === 0 ? undefined : '<',
        )
      })
      parallaxTimelines.push(timeline)
    })

    const dualWaveWrapper = dualWaveWrapperRef.current
    if (dualWaveWrapper) {
      preloadImages('.arbixWavePage .dual-wave-wrapper img').finally(() => {
        if (cancelled) return
        waveAnimation = new DualWaveAnimation(dualWaveWrapper)
        waveAnimation.init()
        document.body.classList.remove('loading')
      })
    } else {
      document.body.classList.remove('loading')
    }

    return () => {
      cancelled = true
      parallaxTimelines.forEach((tl) => tl.kill())
      waveAnimation?.destroy()
      smoother?.kill()
      htmlEl.classList.remove('arbixWaveScroll')
      bodyEl.classList.remove('arbixWaveScroll')
    }
  }, [])

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setNavEntered(true)
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    const shell = searchShellRef.current
    if (!shell) return undefined

    const drag = navDragRef.current

    const handlePointerDown = (event) => {
      if (event.button !== 0 || !event.isPrimary) return
      const interactiveTarget = event.target instanceof Element
        ? event.target.closest('a, button')
        : null
      if (interactiveTarget) return
      drag.active = true
      drag.pointerId = event.pointerId
      drag.startX = event.clientX - drag.offsetX
      drag.startY = event.clientY - drag.offsetY
      shell.classList.add('arbixWaveSearchShell--dragging')
      shell.setPointerCapture(event.pointerId)
      event.preventDefault()
    }

    const handlePointerMove = (event) => {
      if (!drag.active || event.pointerId !== drag.pointerId) return
      drag.offsetX = event.clientX - drag.startX
      drag.offsetY = event.clientY - drag.startY
      shell.style.setProperty('--drag-x', `${drag.offsetX}px`)
      shell.style.setProperty('--drag-y', `${drag.offsetY}px`)
    }

    const stopDragging = (event) => {
      if (!drag.active || event.pointerId !== drag.pointerId) return
      drag.active = false
      drag.pointerId = null
      shell.classList.remove('arbixWaveSearchShell--dragging')
      if (shell.hasPointerCapture(event.pointerId)) {
        shell.releasePointerCapture(event.pointerId)
      }
    }

    shell.addEventListener('pointerdown', handlePointerDown)
    shell.addEventListener('pointermove', handlePointerMove)
    shell.addEventListener('pointerup', stopDragging)
    shell.addEventListener('pointercancel', stopDragging)

    return () => {
      shell.removeEventListener('pointerdown', handlePointerDown)
      shell.removeEventListener('pointermove', handlePointerMove)
      shell.removeEventListener('pointerup', stopDragging)
      shell.removeEventListener('pointercancel', stopDragging)
      shell.classList.remove('arbixWaveSearchShell--dragging')
    }
  }, [])

  return (
    <div ref={rootRef} className="arbixWavePage">
      <header className="arbixWaveNav" aria-label="search navigation">
        <div
          ref={searchShellRef}
          className={`arbixWaveSearchShell ${navEntered ? 'arbixWaveSearchShell--entered' : ''}`}
        >
          <div className="arbixWaveNavItems" aria-label="expanded links">
            <Link to={MENU_RESTORE_DEMO_TO} className="link link--ersa demoTitleOnScroll__menuErsa arbixWaveNavItem">
              <span>Main</span>
            </Link>
            <Link to="/ArbiX" className="link link--ersa demoTitleOnScroll__menuErsa arbixWaveNavItem">
              <span>/ArbiX</span>
            </Link>
            <a
              href="https://github.com/codrops/"
              target="_blank"
              rel="noopener noreferrer"
              className="demoTitleOnScroll__heroGithubLink arbixWaveNavItem arbixWaveNavItem--github"
              aria-label="GitHub repository"
              data-hover=""
            >
              <GithubMarkIcon />
            </a>
            <a
              href="https://cloud.dify.ai/app/099f655e-ad31-4d73-8368-8dec674af179/workflow"
              target="_blank"
              rel="noopener noreferrer"
              className="link link--ersa demoTitleOnScroll__menuErsa arbixWaveNavItem"
              aria-label="Open Dify workflow"
            >
              <span>Dify</span>
            </a>
            <a
              href="https://platform.deepseek.com/top_up"
              target="_blank"
              rel="noopener noreferrer"
              className="link link--ersa demoTitleOnScroll__menuErsa arbixWaveNavItem"
              aria-label="Open DeepSeek top up"
            >
              <span>DeepSeek</span>
            </a>
          </div>
        </div>
      </header>
      <main id="smooth-wrapper" className="container">
        <div id="smooth-content">
          <div className="parallax">
            <section className="parallax__header">
              <div className="parallax__visuals">
                <div className="parallax__black-line-overflow" />
                <div data-parallax-layers className="parallax__layers">
                  <img
                    src="https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795be09b462b2e8ebf71_osmo-parallax-layer-3.webp"
                    loading="eager"
                    data-parallax-layer="1"
                    alt=""
                    className="parallax__layer-img"
                  />
                  <img
                    src="https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795b4d5ac529e7d3a562_osmo-parallax-layer-2.webp"
                    loading="eager"
                    data-parallax-layer="2"
                    alt=""
                    className="parallax__layer-img"
                  />
                  <div data-parallax-layer="3" className="parallax__layer-title">
                    <h2 className="parallax__title">Parallax</h2>
                  </div>
                  <img
                    src="https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795bb5aceca85011ad83_osmo-parallax-layer-1.webp"
                    loading="eager"
                    data-parallax-layer="4"
                    alt=""
                    className="parallax__layer-img"
                  />
                </div>
                <div className="parallax__fade" />
              </div>
            </section>
            <section className="parallax__content">
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 160 160" fill="none" className="osmo-icon-svg">
                <path d="M94.8284 53.8578C92.3086 56.3776 88 54.593 88 51.0294V0H72V59.9999C72 66.6273 66.6274 71.9999 60 71.9999H0V87.9999H51.0294C54.5931 87.9999 56.3777 92.3085 53.8579 94.8283L18.3431 130.343L29.6569 141.657L65.1717 106.142C67.684 103.63 71.9745 105.396 72 108.939V160L88.0001 160L88 99.9999C88 93.3725 93.3726 87.9999 100 87.9999H160V71.9999H108.939C105.407 71.9745 103.64 67.7091 106.12 65.1938L106.142 65.1716L141.657 29.6568L130.343 18.3432L94.8284 53.8578Z" fill="currentColor" />
              </svg>
            </section>
          </div>
          <div className="osmo-credits">
            <p className="osmo-credits__p">
              Resource by{' '}
              <a
                target="_blank"
                href="https://www.osmo.supply?utm_source=codepen&utm_medium=pen&utm_campaign=parallax-image-layers"
                className="osmo-credits__p-a"
                rel="noreferrer"
              >
                Osmo
              </a>
            </p>
          </div>
          <div className="spacer" />
          <div
            ref={dualWaveWrapperRef}
            className="dual-wave-wrapper"
            data-animation="dual-wave"
            data-wave-number="12"
            data-wave-speed="1"
          >
            <div className="wave-column wave-column-left">
              {list.map(([name, image], idx) => (
                <div key={`l-${name}-${idx}`} className="animated-text" data-image={`/arbix-wave/${image}`}>
                  {name}
                </div>
              ))}
            </div>
            <div className="image-thumbnail-wrapper">
              <img src="/arbix-wave/tesla.webp" alt="brand preview" className="image-thumbnail" />
            </div>
            <div className="wave-column wave-column-right">
              {list.map(([name], idx) => (
                <div key={`r-${name}-${idx}`} className="animated-text">
                  {name}
                </div>
              ))}
            </div>
          </div>
          <div className="spacer-bottom" />
        </div>
      </main>
    </div>
  )
}
