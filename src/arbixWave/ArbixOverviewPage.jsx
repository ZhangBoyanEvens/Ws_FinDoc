import { useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { DualWaveAnimation } from './DualWaveAnimation'
import { preloadImages } from './utils'
import './arbixWave.css'

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
  const list = useMemo(() => [...BRANDS, ...BRANDS], [])

  useEffect(() => {
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
    let cancelled = false

    preloadImages('.arbixWavePage .dual-wave-wrapper img').finally(() => {
      if (cancelled) return
      animation = new DualWaveAnimation(wrapper)
      animation.init()
      document.body.classList.remove('loading')
    })

    return () => {
      cancelled = true
      animation?.destroy()
      htmlEl.classList.remove('arbixWaveScroll')
      bodyEl.classList.remove('arbixWaveScroll')
    }
  }, [])

  return (
    <div className="arbixWavePage">
      <header className="frame">
        <h1 className="frame__title">Arbix Dual Wave Overview</h1>
        <Link className="frame__back" to="/menu?demo=1">
          Menu
        </Link>
        <a className="frame__github" href="https://github.com/codrops/" target="_blank" rel="noreferrer">
          Source
        </a>
      </header>
      <main className="container">
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
      </main>
    </div>
  )
}

