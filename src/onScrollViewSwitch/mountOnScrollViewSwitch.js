import { preloadImages, isInViewport } from './utils'
import { Item } from './item'
import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/flip'

gsap.registerPlugin(ScrollTrigger, Flip)

/**
 * @param {{
 *   surface: HTMLElement
 *   main: HTMLElement
 *   grid: HTMLElement
 *   heading: HTMLElement
 *   headingMain: HTMLElement
 *   switchGrid: HTMLButtonElement
 *   switchList: HTMLButtonElement
 * }} refs
 * @returns {() => void}
 */
export function mountOnScrollViewSwitch(refs) {
  const { surface, main, grid, heading: headingEl, headingMain, switchGrid, switchList } = refs
  if (!surface || !main || !grid) {
    return () => {}
  }

  /** @type {Item[]} */
  const items = []
  ;[...main.querySelectorAll('.content .item')].forEach((item) => {
    items.push(new Item(item))
  })

  /** @type {InstanceType<typeof Lenis> | null} */
  let lenis = null
  /** @type {number | null} */
  let rafId = null
  /** @type {ReturnType<typeof setTimeout> | null} */
  let preloadFallbackTimer = null

  const onLenisScroll = () => {
    ScrollTrigger.update()
  }

  const heading = {
    el: headingEl,
    main: headingMain,
  }

  const getDOMElements = () => {
    const inViewportItems = items.filter((item) => isInViewport(item.DOM.el))
    const outViewportItems = items.filter((n) => !inViewportItems.includes(n))

    return {
      allImages: items.map((item) => item.DOM.image),
      allImagesInner: items.map((item) => item.DOM.imageInner),
      inViewportItems,
      outViewportItems,
      inViewportImagesInner: inViewportItems.map((item) => item.DOM.imageInner),
      outViewportImagesInner: outViewportItems.map((item) => item.DOM.imageInner),
      inViewportDescription: inViewportItems.map((item) => item.DOM.description),
      outViewportDescription: outViewportItems.map((item) => item.DOM.description),
      inViewportTitlesInner: inViewportItems.map((item) => item.DOM.titleInner),
      outViewportTitlesInner: outViewportItems.map((item) => item.DOM.titleInner),
      inViewportNumbersInner: inViewportItems.map((item) => item.DOM.numberInner),
      outViewportNumbersInner: outViewportItems.map((item) => item.DOM.numberInner),
    }
  }

  const showGrid = () => {
    surface.classList.add('grid-open')

    if (lenis) lenis.stop()

    const Alltrigger = ScrollTrigger.getAll()
    for (let i = 0; i < Alltrigger.length; i++) {
      Alltrigger[i].disable(false)
    }

    const DOM = getDOMElements()

    const flipstate = Flip.getState(DOM.allImages)
    grid.append(...DOM.allImages)

    const staggerConfig = {
      grid: 'auto',
      from: DOM.inViewportItems.length ? items.indexOf(DOM.inViewportItems[0]) : 0,
      amount: 0.06,
    }

    Flip.from(flipstate, {
      duration: 0.7,
      ease: 'power3.inOut',
      scale: true,
      stagger: staggerConfig,
    })
      .to(
        DOM.inViewportImagesInner,
        {
          duration: 0.7,
          ease: 'power3.inOut',
          scaleX: 1,
          scaleY: 1,
          opacity: 1,
          stagger: staggerConfig,
        },
        0,
      )
      .set(
        DOM.outViewportImagesInner,
        {
          scaleX: 1,
          scaleY: 1,
          opacity: 1,
        },
        0,
      )
      .to(
        [DOM.inViewportTitlesInner, DOM.inViewportNumbersInner],
        {
          duration: 0.4,
          ease: 'power3.inOut',
          yPercent: -100,
          opacity: 0,
        },
        0,
      )
      .to(
        DOM.inViewportDescription,
        {
          duration: 0.4,
          ease: 'power3.inOut',
          opacity: 0,
        },
        0,
      )
      .set(
        [DOM.outViewportTitlesInner, DOM.outViewportNumbersInner, DOM.outViewportDescription],
        {
          opacity: 0,
        },
        0,
      )
      .to(
        heading.el,
        {
          duration: 0.7,
          ease: 'power3.inOut',
          yPercent: -100,
          x: -100,
        },
        0,
      )
  }

  const hideGrid = () => {
    surface.classList.remove('grid-open')

    if (lenis) lenis.start()

    const DOM = getDOMElements()

    const flipstate = Flip.getState([DOM.allImages, DOM.allImagesInner], { props: 'opacity' })

    DOM.allImages.forEach((image, pos) => {
      items[pos].DOM.imageWrap.appendChild(image)
    })

    const Alltrigger = ScrollTrigger.getAll()
    for (let i = 0; i < Alltrigger.length; i++) {
      Alltrigger[i].enable(false)
    }

    Flip.from(flipstate, {
      duration: 0.7,
      ease: 'power3.inOut',
      scale: true,
    })
      .to(
        [DOM.inViewportTitlesInner, DOM.inViewportNumbersInner, DOM.inViewportDescription],
        {
          duration: 0.4,
          ease: 'power3.inOut',
          startAt: { opacity: 0 },
          opacity: 1,
        },
        0,
      )
      .set(
        [DOM.outViewportTitlesInner, DOM.outViewportNumbersInner, DOM.outViewportDescription],
        {
          opacity: 1,
        },
        0,
      )
      .to(
        heading.el,
        {
          duration: 0.7,
          ease: 'power3.inOut',
          yPercent: 0,
          x: 0,
        },
        0,
      )
  }

  const onGridClick = () => {
    switchGrid.classList.add('switch__button--hidden', 'switch__button--current')
    switchList.classList.remove('switch__button--hidden', 'switch__button--current')
    showGrid()
  }

  const onListClick = () => {
    switchList.classList.add('switch__button--hidden', 'switch__button--current')
    switchGrid.classList.remove('switch__button--hidden', 'switch__button--current')
    hideGrid()
  }

  const initSmoothScrolling = () => {
    lenis = new Lenis({
      lerp: 0.1,
      smooth: true,
    })
    lenis.on('scroll', onLenisScroll)
    const scrollFn = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(scrollFn)
    }
    rafId = requestAnimationFrame(scrollFn)
  }

  const animateOnScroll = () => {
    for (const item of items) {
      /* 图在右：锚在图右侧；04 图在左：锚在左侧，横向放大时远离文案 */
      const imageFirst = item.DOM.el.classList.contains('item--imageFirst')
      gsap.set(item.DOM.imageInner, {
        transformOrigin: imageFirst ? '0% 50%' : '100% 50%',
      })

      gsap
        .timeline({
          scrollTrigger: {
            trigger: item.DOM.el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
        .addLabel('start', 0)
        .to(
          item.DOM.imageInner,
          {
            ease: 'none',
            scaleY: 1.85,
            scaleX: 1.06,
            opacity: 0,
          },
          'start',
        )
        .to(
          [item.DOM.title, item.DOM.number],
          {
            ease: 'none',
            yPercent: -150,
          },
          'start',
        )
        .to(
          [item.DOM.titleInner, item.DOM.numberInner],
          {
            scrollTrigger: {
              trigger: item.DOM.el,
              start: 'top bottom',
              end: 'top 20%',
              scrub: true,
            },
            ease: 'expo.in',
            yPercent: -100,
          },
          'start',
        )
    }

    let windowWidth = window.innerWidth
    gsap.to(heading.main, {
      scrollTrigger: {
        start: 0,
        end: 'max',
        scrub: true,
      },
      ease: 'none',
      x: () =>
        -heading.main.offsetWidth -
        ((13.25 * windowWidth) / 100 + (25 * windowWidth) / 100 + windowWidth / 100) +
        windowWidth,
    })
  }

  const onResize = () => {
    ScrollTrigger.refresh()
  }

  let destroyed = false

  let didStart = false
  const start = () => {
    if (destroyed) return

    surface.classList.remove('loading')

    initSmoothScrolling()
    animateOnScroll()
    window.addEventListener('resize', onResize)

    switchGrid.addEventListener('click', onGridClick)
    switchList.addEventListener('click', onListClick)

    ScrollTrigger.refresh()
  }

  const tryStart = () => {
    if (destroyed || didStart) return
    didStart = true
    if (preloadFallbackTimer != null) {
      clearTimeout(preloadFallbackTimer)
      preloadFallbackTimer = null
    }
    start()
  }

  preloadImages('.item__image-inner img', main).then(tryStart).catch(tryStart)
  preloadFallbackTimer = setTimeout(tryStart, 8000)

  const destroy = () => {
    destroyed = true
    if (preloadFallbackTimer != null) {
      clearTimeout(preloadFallbackTimer)
      preloadFallbackTimer = null
    }

    switchGrid.removeEventListener('click', onGridClick)
    switchList.removeEventListener('click', onListClick)
    window.removeEventListener('resize', onResize)

    if (surface.classList.contains('grid-open')) {
      surface.classList.remove('grid-open')
      if (lenis) lenis.start()
      const DOM = getDOMElements()
      DOM.allImages.forEach((image, pos) => {
        const wrap = items[pos]?.DOM.imageWrap
        if (wrap) wrap.appendChild(image)
      })
    }

    ScrollTrigger.getAll().forEach((t) => t.kill())
    gsap.killTweensOf(heading.el)
    gsap.killTweensOf(heading.main)
    items.forEach((item) => {
      gsap.killTweensOf([
        item.DOM.imageInner,
        item.DOM.title,
        item.DOM.number,
        item.DOM.titleInner,
        item.DOM.numberInner,
        item.DOM.description,
      ])
    })

    if (rafId != null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    if (lenis) {
      lenis.off('scroll', onLenisScroll)
      lenis.destroy()
      lenis = null
    }

    surface.classList.remove('grid-open', 'loading')

    if (heading.el) gsap.set(heading.el, { clearProps: 'all' })
    if (heading.main) gsap.set(heading.main, { clearProps: 'all' })
    items.forEach((item) => {
      gsap.set(
        [
          item.DOM.imageInner,
          item.DOM.title,
          item.DOM.number,
          item.DOM.titleInner,
          item.DOM.numberInner,
        ],
        { clearProps: 'all' },
      )
    })
  }

  return destroy
}
