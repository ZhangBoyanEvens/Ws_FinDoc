import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { DualWaveAnimation } from './DualWaveAnimation'
import { preloadImages } from './utils'
import { GithubMarkIcon } from '../onScrollViewSwitch/FinDocOnScrollOverviewPage.jsx'
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
  const wrapperRef = useRef(null)
  const searchShellRef = useRef(null)
  const list = useMemo(() => [...BRANDS, ...BRANDS], [])
  const [navEntered, setNavEntered] = useState(false)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother)
    const htmlEl = document.documentElement
    const bodyEl = document.body
    htmlEl.classList.add('arbixWaveScroll')
    bodyEl.classList.add('arbixWaveScroll')

    const wrapper = wrapperRef.current
    if (!wrapper) {
      return () => {
        htmlEl.classList.remove('arbixWaveScroll')
        bodyEl.classList.remove('arbixWaveScroll')
      }
    }
    let animation = null
    let smoother = null
    let cancelled = false

    // 恢复原始 Codrops 惯性滚动手感：滚轮停止后继续滑动并渐停。
    if (typeof ScrollSmoother?.create === 'function') {
      smoother = ScrollSmoother.create({
        smooth: 1.5,
        normalizeScroll: true,
      })
    }

    preloadImages('.arbixWavePage .dual-wave-wrapper img').finally(() => {
      if (cancelled) return
      animation = new DualWaveAnimation(wrapper)
      animation.init()
      document.body.classList.remove('loading')
    })

    return () => {
      cancelled = true
      animation?.destroy()
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

  return (
    <div className="arbixWavePage">
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
          <div className="spacer" />
          <div
            ref={wrapperRef}
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

