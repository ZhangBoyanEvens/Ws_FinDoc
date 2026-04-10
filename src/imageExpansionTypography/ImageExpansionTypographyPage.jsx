import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger.js'
import { Flip } from 'gsap/flip'
import imagesLoaded from 'imagesloaded'
import Lenis from '@studio-freight/lenis'
import { ExpandImageEffect as ExpandImageEffect2 } from '../../ImageExpansionTypography-main/js/effect-2/expandImageEffect.js'
import { ExpandImageEffect as ExpandImageEffect3 } from '../../ImageExpansionTypography-main/js/effect-3/expandImageEffect.js'
import { ExpandImageEffect as ExpandImageEffect4 } from '../../ImageExpansionTypography-main/js/effect-4/expandImageEffect.js'
import { ExpandImageEffect as ExpandImageEffect5 } from '../../ImageExpansionTypography-main/js/effect-5/expandImageEffect.js'
import { GithubMarkIcon } from '../onScrollViewSwitch/FinDocOnScrollOverviewPage.jsx'
import { VetraHeroSignalCanvas } from './VetraHeroSignalCanvas.jsx'
import { VetraScannerSection } from './VetraScannerSection.jsx'
import { VetraDifferenceCursor } from './VetraDifferenceCursor.jsx'
import '../../ImageExpansionTypography-main/css/base.css'

const MENU_RESTORE_DEMO_TO = '/menu?demo=1'

function preloadImagesIn(rootEl, selector = '.type__expand-img-inner') {
  return new Promise((resolve) => {
    imagesLoaded(rootEl.querySelectorAll(selector), { background: true }, resolve)
  })
}

export function ImageExpansionTypographyPage() {
  const rootRef = useRef(null)
  const jumpToStart = () => {
    const nextSection = document.querySelector('.content--center')
    nextSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    gsap.registerPlugin(ScrollTrigger, Flip)

    const htmlEl = document.documentElement
    const bodyEl = document.body
    const prevHtmlClass = htmlEl.className
    const prevBodyClass = bodyEl.className
    const prevGsap = globalThis.gsap
    const prevScrollTrigger = globalThis.ScrollTrigger
    const prevFlip = globalThis.Flip

    htmlEl.classList.add('js')
    bodyEl.className = 'demo-1 loading'

    /* Codrops effect 脚本读 globalThis.gsap / ScrollTrigger / Flip */
    globalThis.gsap = gsap
    globalThis.ScrollTrigger = ScrollTrigger
    globalThis.Flip = Flip

    const lenis = new Lenis({ lerp: 0.17 })
    const lenisTick = (time) => {
      lenis.raf(time * 1000)
    }
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(lenisTick)
    gsap.ticker.lagSmoothing(0)

    const existingTriggers = new Set(ScrollTrigger.getAll())
    let disposed = false

    preloadImagesIn(root).then(() => {
      if (disposed) return
      bodyEl.classList.remove('loading')

      const expandPairs = [
        ['[data-expand-2]', ExpandImageEffect2],
        ['[data-expand-3]', ExpandImageEffect3],
        ['[data-expand-4]', ExpandImageEffect4],
        ['[data-expand-5]', ExpandImageEffect5],
      ]
      for (const [selector, EffectCtor] of expandPairs) {
        root.querySelectorAll(selector).forEach((el) => {
          new EffectCtor(el)
        })
      }
    })

    return () => {
      disposed = true
      gsap.ticker.remove(lenisTick)
      lenis.destroy()

      ScrollTrigger.getAll().forEach((st) => {
        if (!existingTriggers.has(st)) st.kill()
      })

      htmlEl.className = prevHtmlClass
      bodyEl.className = prevBodyClass
      globalThis.gsap = prevGsap
      globalThis.ScrollTrigger = prevScrollTrigger
      globalThis.Flip = prevFlip
    }
  }, [])

  return (
    <main ref={rootRef} className="demoTitleOnScroll demoTitleOnScroll--vetra">
      <VetraDifferenceCursor scopeRef={rootRef} />
      <div className="demoTitleOnScroll__parallaxGuides" aria-hidden="true" />
      <header className="demoTitleOverview__bar demoTitleOnScroll__bar">
        <div className="demoTitleOnScroll__barStart">
          <Link
            to={MENU_RESTORE_DEMO_TO}
            className="link link--ersa demoTitleOnScroll__menuErsa"
            data-hover=""
          >
            <span>← Main</span>
          </Link>
          <div className="demoTitleOnScroll__heroTrack">
            <h1 className="frame__title-main onScrollViewSwitchMount__heroTitle">
              <a
                href="https://github.com/codrops/ImageExpansionTypography/"
                target="_blank"
                rel="noopener noreferrer"
                className="demoTitleOnScroll__heroGithubLink"
                aria-label="ImageExpansionTypography repository"
                data-hover=""
              >
                <GithubMarkIcon />
              </a>
            </h1>
          </div>
        </div>
      </header>
      <div className="content content--left content--hero" aria-label="Hero spacer">
        <div className="meta content--hero__meta" aria-hidden="true" />
        <div className="type content--hero__type">
          <VetraHeroSignalCanvas />
          <div className="vetraHeroTitleCluster">
            <div className="vetraHeroSignalCanvas__title">VETRA</div>
            <p className="vetraHeroSignalCanvas__subtitle">
              <span>Hunt Smarter.</span>
              <span>Decide Faster.</span>
            </p>
          </div>
          <button
            type="button"
            className="vetraHeroStartBtn shiny-cta"
            onClick={jumpToStart}
            data-hover=""
          >
            <span>
              Start <span aria-hidden="true">↓</span>
            </span>
          </button>
        </div>
        <div className="block content--hero__block" aria-hidden="true" />
      </div>

      <div className="content content--center">
        <h2 className="type" data-expand-2="">
          Hunting the
          <br />
          Hidden
          <br />
          <span className="type__expand type__expand--reveal type__expand--center">
            <span className="aright">Gems </span>
            <span className="type__expand-img">
              <span
                className="type__expand-img-inner"
                style={{
                  backgroundImage: 'url(/ImageExpansionTypography-main/img/vetra-partners-grid.png)',
                }}
              />
            </span>
            <span className="anim skewed">in the</span>
          </span>
          <br />
          Corporate Ocean,
        </h2>
        <p className="block block--vetraLead">
          Vetra intelligently slices through millions of companies, using strict filters and deep AI
          insight to surface only the rare, high-potential targets that truly matter.
        </p>
      </div>

      <div className="content content--right">

        <h2 className="type" data-expand-3="">
        Revealing the
          <br />
          Invisible Truth
          <br />
          <span className="type__expand type__expand--full">
            <span className="type__expand-img">
              <span
                className="type__expand-img-inner vetraExpandImgInner--noWhite"
                style={{
                  backgroundImage: 'url(/ImageExpansionTypography-main/img/secrets-found.svg)',
                }}
              />
            </span>
          </span>
          Behind
          <br />
          Every Company
        </h2>
        <p className="block block--vetraCommand">
          With one command, Vetra performs a full-spectrum scan and crafts rich, multi-layered
          intelligence reports that expose technology, finance, risks, and real power hidden beneath
          the surface
        </p>
      </div>

      <div className="content content--justify">
        <h2 className="type" data-expand-4="">
        Building 
          <span className="type__expand type__expand--stack">
            <span className="anim rotated">Unshakable</span>
            <span className="type__expand-img type__expand-img--small">
              <span
                className="type__expand-img-inner"
                style={{
                  backgroundImage: 'url(/ImageExpansionTypography-main/img/llm.svg)',
                }}
              />
            </span>
          </span>
          Trust
          <span className="type__expand type__expand--stack">
            <span >Though </span>
          </span>
          <span className="vetraTypePlaywriteEmphasis">Hallucination-Free</span>
          <br />
          and
          <span className="type__expand type__expand--stack">
            <span className="type__expand-img type__expand-img--small">
              <span
                className="type__expand-img-inner"
                style={{
                  backgroundImage: 'url(/ImageExpansionTypography-main/img/precision.svg)',
                }}
              />
            </span>
            <span className="anim rotated vetraTypePlaywriteEmphasis">Precision </span>
          </span>
          Scoring.
        </h2>
        <p className="block aright block--vetraCommand">
          Grounded in your custom weights and rigorous verification layers, Vetra delivers
          objective, trustworthy scores where every point is anchored in real, verifiable data.
        </p>
      </div>

      <div className="content content--line">
        <h2 className="type vetraTypeLineSmaller" data-expand-5="">
          <span className="type__expand type__expand--mini">
            <span className="type__expand-img type__expand-img--tiny">
              <span className="type__expand-img-inner vetraExpandTinyLabel vetraTypePlaywriteEmphasis">
                Vetra
              </span>
            </span>
          </span>
          transforms messy
          <span className="type__expand type__expand--mini">
          </span>
          company
          <br />
          data into crystal-
          <span className="type__expand type__expand--mini">
            <span className="type__expand-img type__expand-img--tiny">
              <span
                className="type__expand-img-inner vetraExpandTinyLabel vetraTypePlaywriteEmphasis"
                aria-hidden="true"
              >
                clear
              </span>
            </span>
          </span>
          intelligence,
          <br />
          then hands you a sharp decision
          <span className="type__expand type__expand--mini">
            <span className="type__expand-img type__expand-img--tiny">
              <span
                className="type__expand-img-inner vetraExpandTinyLabel vetraTypePlaywriteEmphasis"
                aria-hidden="true"
              >
                blade
              </span>
            </span>
          </span>
        
          <br />
          — so you can 
          <span className="type__expand type__expand--mini">
            <span className="type__expand-img type__expand-img--tiny">
              <span
                className="type__expand-img-inner vetraExpandTinyLabel vetraTypePlaywriteEmphasis"
                aria-hidden="true"
              >
                slice
              </span>
            </span>
          </span>
          through noise
          <br />
          and strike at the best opportunities.
        </h2>
      </div>
      <VetraScannerSection />
    </main>
  )
}
