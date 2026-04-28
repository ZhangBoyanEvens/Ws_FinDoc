import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { GithubMarkIcon } from '../onScrollViewSwitch/FinDocOnScrollOverviewPage.jsx'
import dualIcon from '../assets/Dual.svg'
import heatVisionIcon from '../assets/heat vision.svg'
import noiseKillerIcon from '../assets/noise killer.svg'
import zeroFrictionIcon from '../assets/zero friction.svg'
import { DualWaveAnimation } from './DualWaveAnimation'
import { preloadImages } from './utils'
import './arbixWave.css'

const MENU_RESTORE_DEMO_TO = '/menu?demo=1'
const PARALLAX_ASCII_ART = String.raw`
                                                             ./czcczrI       <xXzczv1,-jczccunnxxxucu,
                                                           )zY:      xz\   xcf      +zc}           'vx
                                                          vv           /cjX{          ^zu\_^     ^jzr~+>!'
                                                         nf             1z~             nzczzczccc)]+~<>-1rzv}
                                                        \z                               zvcu?l(uzu?         nr
                                                        c1                               fY Iuu:  ~nzv+    <vx.
                                                       ,X<         vzj             ccx   {X   ]c|    (vcxvzz{"
                                    i)):                z}         zzn             Xcu   tY     cz\`    >vcu+}tuvcz\
                           '~|xuXx]^   ^ci              rY         Xcu             zcu   X|      uv      -zcl     ]c\
                   \`+(fncf+.            "c             /cc/        ']   ]z<         ]'  ur        /X;      \zt     xn
               )c\_,      ;_(nzx}        v-           xz- cn           |cxz]           vu          zu       >cvl-xc|
              c!       f1>\`   "+/uut}-n" ]j          tz>   1Xj^      )ct   rv]      ;nz-            vj       ^czcczcj-
              c.       +jvuf(+\`       _n  v,        (c(      !fucczux-       {rvXzcn/:              <c>        xc+  "|nc:
              j[  vn|<                 v^ ]r       :zx                                               cn         uz]    rz
              ,c  X,                   t{  c\`      /c:               <        }                      :z_         jv;  jv[
               f{ ]\                   In  c]     'zz                X[      <z"                      xx          czcz?
               +v  v^           .i{|(f  f< ;u     (z-                xz      /v                       [v\`         ;zn]uc}
                c, \{     -))t :I;_1}({ >z  x~    nz                 ,z(    ?c?                       :X_          \z-  /v^
                )| Ir  r\` )~~<;.r_{u]+j  v: ?r    uu                   |zzccf                          z\           vz\` ]c:
                 c  ul ;?'I\-!\ /ff}l I: /)  c^  .cr                                                   cu           ?Xnzx
                 \) in  |:~f<\t""\"       c  f{  .cf                                                   nc           \`cccc]
                 >n  v, ~I+               \1  z   vr                                                   nv            jz_,c\
                  vI f{                   !c  f]  nz                                                   cv            ~zn_z}   <)frnxr|,
                  _n 'n                    c; ?n|uzz-                                             +zcczcccc\~         zzccnczcx)+i::ljz?
                   v\` f-               'l-|z'  z\I;zz                                            }c/      ;}cz[     .jzcx{l          |z?
                   \) iv        "+jvvj(<       (t  /cl                                           lzu         1z]     >\`            1zz-
                   Iv  v1[xcux/>                c^ ,zu                                            <zu"       !z/               ,rzcn~
                    r~           v1?c           x}  \zf                                             jcz}    :ccI            |cvzf
                    >z           x)1c         \`ncczczuz}                                            ,Xrczzzzz/     )\        ^uv,
                     u:                <{tuzr}Ilx?    fz)                                           nu           1ccucr:      .zc
                     |t        l[/uvt{~I:i?|xcx[       )zt                                         vu          (cc~  .|zc\!    fc,
                     'ccvxvnt1+I,l-\nvj(-I              ivu^                                      tX,       :fzx!       ^{nzzzzc[
                      Ic\i-tvux/}I                        tzj                                    xv.      }cct
                                                            xzc'                                vc^    ]vzu~
                                                              (czf                            ,ct  :tvzc<
                                                                ^\zvu(I                      )zurczX/,
                                                                    !(czvcx|]>;^      .,!-|nczzn[I
                                                                         ">])trnvcczcvvxf(]i'
`
const PARALLAX_ASCII_ART_RIGHT = String.raw`
                                                                                                  -1{1{1{1{1{1{1]\`
                                                                                                rxrxrxrxrxrxrxrxrxx<
                                                                                               nrxrxrxrxrxrxrxrxrrrx
                                                                                               xrxrxrxrxrxrxrxrxrxxr
                                            ,IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII+xrxrxrxrxrxrxrxrxrxrx
                                      -nrxrxrrxrrrxrrrxrrrxrrrxrrrxrrrxrrrxrrrxrrrxrrrxrrrxrrrxrxrxrxrxrxrxrxrxrxrx|
                                   +xxrxrxrxrxrxxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxxrxrxrxrxrxrxrxrxrxrxrxrx[
                                 'xrxrxrxrxrxrxrrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrrxrxrxrxrxrxrxrxrxrxrxrxrxrxr
                                1rxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrrxrxrxrrxrrxrxrxrxrxr[
                               [xrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxx;
                               xrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxx
                              ;rxrxrxrxrxrrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrrxrxrxrxrxrrxrxrrx;
                              [rxrxrxrrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrx|~,          "~|xrxrxrxrxrxrxrxrxrxrxrxrxrxrrxrxrxrxr}
                              {xrxrxrxrxrxrxrxrrxrxrxrxrxrxrxrxrj<                       ,xrxrxrxrxrrxrxrxrxrxrxrxrxxrxrxrxrx)
                              {rxrxrxrxrxrxrxrxrxrxrxrrxrxrxx?                            -xrxrxrxrxrxrxrxrxrxrxrxrrxrxrxrxrx1
                              {xrxrxrxrxrxrxrxrxrxrxrxrxrx1                               xxrxrxrrxrxrxrxrxrxrxrxrxrxrxrxrxrx)
                              {rxrxrxrxrxrxrxrxrxrxrxrxx!                                 rxrxrrx|-(xrxrxrxrxrxrxrxrxrxrxrxrr)
                              {xrxrxrxrxrxrxrxrxrxrxrri                                  xrxrxr{     fxrxrrxrxrxrxrxrxrxrxrxr)
                              {rxrxrxrxrxrxrxrxrxrxr)                                   :xrxrr       ^rxrxrxrxrxrxrxrxrxrxrxr)
                              {xrxrxrrxrrxrxrxrxrxr                                     rrxxl        xrxrxrxrxrrxrxrxrxrxrxrx)
                              {rxrxrxrxrxrxrxrrxrj                      [uxrxrxrxxn}  {rxrr        \rrxrxrxrxrxrxrxrxrxrrxrxr)
                              {xrxrxrxrxrxrxrxrxf                   frxrxrrxrxrxrxrxrxrxrn       lrxrxrxrxrxrxrxrxrxrxrxrxrxr)
                              {rxrxrxrxrxrxrxrx|                 -xrxrxrxrxrxrxrxrxrxrxrxrx     rrxrxrxf[  +rrxrxrxrxrxrxrxrx1
                              {xrxrxrxrxrxrxrxx                Ixrxrxrxrxrxrxrxrxrxrxrxrxrrxrxxrxrxf[        xxrxrxrrxrxrxrxr)
                              {rxrxrxrxrxrxrxx                xxrxrxrxrxrxrxrxrxrxrxrxrxrxrxxrxxf            nrxrxrxrxrxrxrxr)
                              {xrxrxrxrxrxrxr|               xxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrrxr|           <xrxrxrxrxrxrxrxrx)
                              {rxrxrrxrxrxrrx               jrxrxrxrxrxrxrxrxrxrrxrxrxrxrxrxrxrr       >xxrxrxrxrxrxrxrxrxrxr)
                              {xrxrxrxrxrrxx(              xrxrxrxrxrxrxrxrxrxrxrxrxrrxrxrxrxrxrxx{/xxrrxrxrxrxrxrxrxrxrxrxrr)
                              {rxrxrxrxrxrxr,              xrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxr)
                              {xrxrxrxrxrxrx              ;xrxrxrxrxrxrxrxrrxrxrxrxrxrxrxrxrxrxrxrx           (rxrxrxrxrxrxrx)
                              {rxrxrxrxrxrxr              [rxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrx/              rxrxrxrxrrxrr)
                              {xrxrxrxrxrxrx              ]xrxrxrxrxrxrrxrxrxrxrxrxrxrxrxrxrxrxrrr              xrxrxrrxrxrxx1
                              {rxrxrxrxrxrxr              :rxrxrxrxrrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxr1         "fxrxrxrxrxrxrxr)
                              {xrxrxrxrxrxrx:              rxrxrxrrxrxrxrxrxrxrxrrxrxrxrxrxrxrxrxrxxrxrxrxrxrxrxrxrxrxrxrxrxr)
                              {rxrxrxrrxrrxr/              /rxrxrxrxrxrxrxrxrxrrxxrxrxrxrrxrrxrxr}  trxrxrxrxrxrxrxrxrxrxrxrx)
                              {xrxrxrxrxrxrxx               /rxrxrxrxrxrxrxrxrxxrrxrxrrxrxrxrxrt        txrxrxrxrxrxrxrxrxrxr)
                              {rxrxrxrxrxrxrx|               xrxrxrxrxrxrxrxrxrrxrxrxrxrxrxrxrx\            rrxrxrxrxrxrxrxrx1
                              {xrxrxrxrxrxrxrx                rrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrj            nrxrxrxrxrxrxrxr)
                              {rxrxrxrxrxrxrxrx                 xxrxrxrxrxrxrxrxrxrxrxrxrxrxnjxxxrxx|^       xrxrxrrxrxrxrxrx)
                              {xrxrxrxrxrxrxrxrf                  rxrxrxrxrrxrxrxrxrxrxrxr|     /xrrxrxx(!I1xrxrxrxrxrxrrxrxr)
                              {rxrxrrxrxrxrxrxrxj                   ixxrxrxrxrxrxrxrxrxrxx        xrxrrxrrxrxrxrxrxrxrxrxrxrr)
                              {xrxrxrxrxrxrxrxrxrx                       [xnxxrxnn[    xrxx        [rxrxrxrxrxrxrxrxrxrxrxrxr)
                              {rxrxrxrxrxrxrxrxrxrx!                                    frrx[        xxrxrxrxrxrxrxrxrxrxrxrx)
                              {xrxrxrxrxrxrxrxrxrxrxt                                   'xrxrx       .xrxrxrxrxrxrxrxrxrxrxrr)
                              {rxrxrxrxrxrrxrxrxrxrrrx{                                  trxrxr/     rxrxrxrxrxrxrxrxrxrxrxrx)
                              {xrxrxrxrxrxrxrxrxrxrxxrxr{                                 xrxrxrxrtxrxrxrxrxrxrxrxrxrxrxrxrxr)
                              {rxrxrxrxrxrxrxrxrxrxrxrxrxrf                               frxrxrxrxrxrxrxrxrxrxrxrxrxrxrrxrxr)
                              {xrxrxrxrrxrxrxrrxrxrxrxrxrxrxr/                            {xrxrxrxrxrxrxrxrxrxrxrxrxrrxrxrxrx)
                              {rxrxrxrxrxrxrxrxrxrxrxrxrxrxrxxrxx\`                      -rxrxrxrxrxrxrxrxrxrxrrxrxrxrxrxrxrr)
                              ?xrxrxrxrxrxrxrxrxrxrxrxrxrxrxrrxrrrxrxxnt?I.       I-/nxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrx}
                               rxrxrrxrxrxrxrxrxrxrrxrxrxrxrxrxrxxrxrrrrxrxrxrxrxrxxrrxrxrxrxrxrxrxrxrxrxrxrrxrxrxrxrxrxrxrxrI
                               xxrxrxrxrxrxrxrxrxrxrxrxrrxrxrxrxrxrxrxxrxrxrxrxrxrrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxr
                                xrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrrxrxrrxrxrxrxrxrxrxrxrxrxrxrxrxxi
                                ;xrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxr]
                                  xxrxrxrxrrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrxrrxrx
                                   "xrxrxrxrxrxrrxrxrxrxrxrxrxrxrxrxrrxrxrxrxrxrxrxrxrxrxrrxrxrxrxrxrxrxrrxrxrxrxrrxrxrr\`
                                      irrxrxrxrxrxrxrxrxrxrxrxrrxrxrxrxrxrrxrxrxrxrxrxrxrxrxrxrxrxrxrrxrxrxrxrrxxx/"
`
const BRANDS = [
  { name: 'Yamaha', score: 38 },
  { name: 'Gibson', score: 38 },
  { name: 'Fender', score: 35 },
  { name: 'Martin', score: 33 },
  { name: 'Taylor', score: 33 },
  { name: 'Roland', score: 28 },
  { name: 'Apple', score: 15 },
  { name: 'Sony', score: 20 },
  { name: 'Bose', score: 20 },
  { name: 'DJI', score: 22 },
  { name: 'Canon', score: 17 },
  { name: 'Nikon', score: 17 },
  { name: 'Rolex', score: 25 },
  { name: 'Omega', score: 22 },
  { name: 'Tudor', score: 18 },
  { name: 'Seiko', score: 15 },
  { name: 'Casio', score: 13 },
  { name: 'Tag Heuer', score: 17 },
  { name: 'Hermès', score: 40 },
  { name: 'Chanel', score: 35 },
  { name: 'Louis Vuitton', score: 30 },
  { name: 'Gucci', score: 26 },
  { name: 'Dior', score: 29 },
  { name: 'Prada', score: 22 },
  { name: 'Sennheiser', score: 28 },
  { name: 'Bowers & Wilkins', score: 24 },
  { name: 'Marshall', score: 20 },
  { name: 'Shure', score: 25 },
  { name: 'Audio-Technica', score: 20 },
  { name: 'Leica', score: 40 },
  { name: 'Fujifilm', score: 22 },
  { name: 'Dyson', score: 20 },
]

function getScoreColor(score) {
  if (score > 30) return '#ef4444'
  if (score > 20) return '#3b82f6'
  if (score > 10) return '#22c55e'
  return '#6b7280'
}

function getScoreScale(score) {
  return 0.8 + score / 50
}

export function ArbixOverviewPage() {
  const navigate = useNavigate()
  const rootRef = useRef(null)
  const dualWaveWrapperRef = useRef(null)
  const searchShellRef = useRef(null)
  const unlockRef = useRef(null)
  const unlockHandleRef = useRef(null)
  const unlockFillRef = useRef(null)
  const navDragRef = useRef({
    active: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
  })
  const list = useMemo(() => {
    const extraCount = Math.floor(BRANDS.length / 3)
    return [...BRANDS, ...BRANDS.slice(0, extraCount)]
  }, [])
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
        smooth: 0.9,
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

    const parallaxContent = root.querySelector('.parallax__content')
    if (parallaxContent) {
      const contentMaskTimeline = gsap.to(parallaxContent, {
        '--parallax-content-mask': '0%',
        ease: 'none',
        scrollTrigger: {
          trigger: parallaxContent,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
        },
      })
      parallaxTimelines.push(contentMaskTimeline)

      const asciiLayer = parallaxContent.querySelector('.parallax__asciiLayer')
      if (asciiLayer) {
        const asciiRevealTween = gsap.to(asciiLayer, {
          '--arbix-ascii-reveal': 1,
          ease: 'none',
          scrollTrigger: {
            trigger: parallaxContent,
            start: 'top 85%',
            end: 'bottom 25%',
            scrub: 0.53,
          },
        })
        parallaxTimelines.push(asciiRevealTween)
      }
    }

    const whatIsSection = root.querySelector('.arbixWhatIs')
    if (whatIsSection) {
      const leftText = whatIsSection.querySelector('.arbixWhatIs__left')
      const brandText = whatIsSection.querySelector('.arbixWhatIs__brand')
      const markText = whatIsSection.querySelector('.arbixWhatIs__mark')

      if (leftText && brandText && markText) {
        gsap.set(brandText, { opacity: 0, scaleX: 0.25, scaleY: 0.7, y: 20, filter: 'blur(10px)' })
        gsap.set([leftText, markText], { x: 0 })

        const whatIsTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: whatIsSection,
            start: 'top+=10rem 82%',
            end: 'top+=10rem 56%',
            scrub: 1.05,
          },
        })

        whatIsTimeline
          .to(leftText, { x: '-0.62em', ease: 'none' }, 0)
          .to(markText, { x: '0.62em', ease: 'none' }, 0)
          .to(
            brandText,
            {
              opacity: 1,
              scaleX: 1,
              scaleY: 1,
              y: 0,
              filter: 'blur(0px)',
              ease: 'none',
            },
            0,
          )

        parallaxTimelines.push(whatIsTimeline)
      }
    }

    const introSection = root.querySelector('.arbixIntroSection')
    if (introSection) {
      gsap.set(introSection, {
        '--intro-top-line-reveal': 0,
        '--intro-bottom-line-reveal': 0,
        '--intro-left-line-reveal': 0,
        '--intro-right-line-reveal': 0,
      })
      const introLineReveal = gsap.to(introSection, {
        '--intro-top-line-reveal': 1,
        '--intro-bottom-line-reveal': 1,
        '--intro-left-line-reveal': 1,
        '--intro-right-line-reveal': 1,
        ease: 'none',
        scrollTrigger: {
          trigger: introSection,
          start: 'center 75%',
          end: 'center 40%',
          scrub: 1.01,
        },
      })
      parallaxTimelines.push(introLineReveal)
    }

    const glassCards = root.querySelectorAll('.arbixGlassDeck__card')
    if (glassCards.length) {
      gsap.set(glassCards, { y: 120, opacity: 0.2 })
      const glassCardsReveal = gsap.to(glassCards, {
        y: 0,
        opacity: 1,
        ease: 'none',
        stagger: 0.06,
        scrollTrigger: {
          trigger: '.arbixGlassDeck',
          start: 'top 88%',
          end: 'top 56%',
          scrub: 0.95,
        },
      })
      parallaxTimelines.push(glassCardsReveal)
    }

    const dualWaveWrapper = dualWaveWrapperRef.current
    if (dualWaveWrapper) {
      const waveImage = dualWaveWrapper.querySelector('.image-thumbnail-wrapper')
      if (waveImage) {
        gsap.set(waveImage, { opacity: 0 })
        const waveImageFade = gsap.to(waveImage, {
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: dualWaveWrapper,
            start: 'top 85%',
            end: 'top 35%',
            scrub: 0.9,
          },
        })
        parallaxTimelines.push(waveImageFade)
      }

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
    const track = unlockRef.current
    const handle = unlockHandleRef.current
    const fill = unlockFillRef.current
    if (!track || !handle || !fill) return undefined

    const state = { progress: 0 }
    let activePointerId = null
    let dragStart = 0
    let dragBase = 0
    let maxProgress = 0
    let unlocked = false

    const computeMax = () => Math.max(0, track.clientWidth - handle.offsetWidth - 8)
    const applyProgress = (next) => {
      state.progress = Math.max(0, Math.min(next, maxProgress))
      handle.style.transform = `translateX(${state.progress}px)`
      fill.style.width = `${Math.max(0, state.progress + handle.offsetWidth * 0.5)}px`
    }

    const snapBack = () => {
      gsap.to(state, {
        progress: 0,
        duration: 0.3,
        ease: 'power2.out',
        onUpdate: () => applyProgress(state.progress),
      })
    }

    const onPointerDown = (event) => {
      if (unlocked || (event.button !== 0 && event.pointerType !== 'touch')) return
      maxProgress = computeMax()
      activePointerId = event.pointerId
      dragStart = event.clientX
      dragBase = state.progress
      handle.setPointerCapture(event.pointerId)
      track.classList.add('arbixEndBlock__unlock--dragging')
      event.preventDefault()
    }

    const onPointerMove = (event) => {
      if (event.pointerId !== activePointerId || unlocked) return
      applyProgress(dragBase + (event.clientX - dragStart))
    }

    const releasePointer = (event) => {
      if (event.pointerId !== activePointerId) return
      if (handle.hasPointerCapture(event.pointerId)) {
        handle.releasePointerCapture(event.pointerId)
      }
      activePointerId = null
      track.classList.remove('arbixEndBlock__unlock--dragging')

      if (maxProgress > 0 && state.progress >= maxProgress * 0.95) {
        unlocked = true
        applyProgress(maxProgress)
        track.classList.add('arbixEndBlock__unlock--done')
        window.setTimeout(() => navigate('/ArbiX'), 120)
      } else {
        snapBack()
      }
    }

    const onResize = () => {
      maxProgress = computeMax()
      applyProgress(state.progress)
    }

    maxProgress = computeMax()
    applyProgress(0)
    handle.addEventListener('pointerdown', onPointerDown)
    handle.addEventListener('pointermove', onPointerMove)
    handle.addEventListener('pointerup', releasePointer)
    handle.addEventListener('pointercancel', releasePointer)
    window.addEventListener('resize', onResize)

    return () => {
      handle.removeEventListener('pointerdown', onPointerDown)
      handle.removeEventListener('pointermove', onPointerMove)
      handle.removeEventListener('pointerup', releasePointer)
      handle.removeEventListener('pointercancel', releasePointer)
      window.removeEventListener('resize', onResize)
    }
  }, [navigate])

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
                    <h2 className="parallax__title">ArbiX</h2>
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
              <div className="parallax__asciiLayer" aria-hidden="true">
                <pre className="parallax__asciiArt parallax__asciiArt--left">{PARALLAX_ASCII_ART}</pre>
                <pre className="parallax__asciiArt parallax__asciiArt--right">{PARALLAX_ASCII_ART_RIGHT}</pre>
              </div>
            </section>
          </div>
          
          <section className="arbixWhatIs" aria-label="What is ArbiX section">
            <p className="arbixWhatIs__eyebrow">See the spread. Seize the profit.</p>
            <h2 className="arbixWhatIs__title">
              <span className="arbixWhatIs__left">What is</span>
              <span className="arbixWhatIs__brand">ArbiX</span>
              <span className="arbixWhatIs__mark">?</span>
            </h2>
          </section>
          <div className="spacer" />
          <div
            ref={dualWaveWrapperRef}
            className="dual-wave-wrapper"
            data-animation="dual-wave"
            data-wave-number="12"
            data-wave-speed="0.85"
            data-wave-amplitude="1.15"
          >
            <p className="arbixWave__eyebrow">Arbitrage Intelligence
              <br />We Compare, You Trade
            </p>
            <div className="wave-column wave-column-left">
              <div className="wave-column__region wave-column__region--left">China</div>
              {list.map(({ name, score }, idx) => (
                <div
                  key={`l-${name}-${idx}`}
                  className="animated-text"
                  data-brand={name}
                  data-score={score}
                >
                  {name}
                </div>
              ))}
            </div>
            <div className="image-thumbnail-wrapper">
              <div className="image-thumbnail image-thumbnail--score" aria-label="brand score preview" />
            </div>
            <div className="wave-column wave-column-right">
              <div className="wave-column__region wave-column__region--right">Singapore</div>
              {list.map(({ name, score }, idx) => (
                <div key={`r-${name}-${idx}`} className="animated-text">
                  {name}
                </div>
              ))}
            </div>
          </div>
          <p className="waveDataDisclaimer">
            Data as of 20/3/2026, for reference only.
          </p>
          <section className="arbixIntroSection" aria-label="Arbix intro section">
            <span className="arbixIntroSection__edge arbixIntroSection__edge--left" aria-hidden="true" />
            <span className="arbixIntroSection__edge arbixIntroSection__edge--right" aria-hidden="true" />
            <div className="arbixIntroSection__backdrop" aria-hidden="true" />
            <div className="arbixIntroSection__card">
              <div className="arbixIntroSection__copy">
                <span className="arbixIntroSection__badge">INTRO</span>
                <p className="arbixIntroSection__text">
                  ArbiX scans cross-market spreads in real time and highlights executable opportunities
                  with ranked confidence, so your team can act faster with clearer signals.
                </p>
              </div>
              <div className="arbixIntroSection__stat">
                <span className="arbixIntroSection__statValue">20+</span>
                <span className="arbixIntroSection__statLabel">Key data dimensions tracked</span>
              </div>
            </div>
          </section>
          <section className="arbixGlassDeck" aria-label="Arbix glass cards">
            <article className="arbixGlassDeck__card">
              <div className="arbixGlassDeck__cardInner">
                <div className="arbixGlassDeck__face arbixGlassDeck__face--front">
                  <img className="arbixGlassDeck__icon" src={dualIcon} alt="" aria-hidden="true" />
                  <span className="arbixGlassDeck__label">Dual-Market Radar</span>
                </div>
                <div className="arbixGlassDeck__face arbixGlassDeck__face--back">
                  <h3 className="arbixGlassDeck__backTitle">Dual-Market Radar</h3>
                  <ul className="arbixGlassDeck__backList">
                    <li>One keyword.</li>
                    <li>Two markets.</li>
                    <li>Zero blind spots.</li>
                  </ul>
                </div>
              </div>
            </article>
            <article className="arbixGlassDeck__card">
              <div className="arbixGlassDeck__cardInner">
                <div className="arbixGlassDeck__face arbixGlassDeck__face--front">
                  <img className="arbixGlassDeck__icon" src={noiseKillerIcon} alt="" aria-hidden="true" />
                  <span className="arbixGlassDeck__label">Noise Killer</span>
                </div>
                <div className="arbixGlassDeck__face arbixGlassDeck__face--back">
                  <h3 className="arbixGlassDeck__backTitle">Noise Killer</h3>
                  <ul className="arbixGlassDeck__backList">
                    <li>Filters fakes.</li>
                    <li>Blocks banned words.</li>
                    <li>Removes outliers.</li>
                    <li>You get clean data.</li>
                  </ul>
                </div>
              </div>
            </article>
            <article className="arbixGlassDeck__card">
              <div className="arbixGlassDeck__cardInner">
                <div className="arbixGlassDeck__face arbixGlassDeck__face--front">
                  <img className="arbixGlassDeck__icon" src={heatVisionIcon} alt="" aria-hidden="true" />
                  <span className="arbixGlassDeck__label">Heat Vision</span>
                </div>
                <div className="arbixGlassDeck__face arbixGlassDeck__face--back">
                  <h3 className="arbixGlassDeck__backTitle">Heat Vision</h3>
                  <ul className="arbixGlassDeck__backList">
                    <li>AI reads sell-through speed.</li>
                    <li>Tells you hot or not.</li>
                    <li>Before you buy.</li>
                  </ul>
                </div>
              </div>
            </article>
            <article className="arbixGlassDeck__card">
              <div className="arbixGlassDeck__cardInner">
                <div className="arbixGlassDeck__face arbixGlassDeck__face--front">
                  <img className="arbixGlassDeck__icon" src={zeroFrictionIcon} alt="" aria-hidden="true" />
                  <span className="arbixGlassDeck__label">Zero Friction</span>
                </div>
                <div className="arbixGlassDeck__face arbixGlassDeck__face--back">
                  <h3 className="arbixGlassDeck__backTitle">Zero Friction</h3>
                  <ul className="arbixGlassDeck__backList">
                    <li>No login.</li>
                    <li>No setup.</li>
                    <li>Open the page.</li>
                    <li>Read the table.</li>
                  </ul>
                </div>
              </div>
            </article>
          </section>
          <section className="spacer-bottom arbixEndBlock" aria-label="End block">
            <h2 className="arbixEndBlock__title">
              <span>WHEN</span>
              <span>WILL</span>
              <span>WE</span>
              <span className="arbixEndBlock__lastLine">
                <span>MEET</span>
                <span className="arbixEndBlock__mark">?</span>
              </span>
            </h2>
            <span className="arbixEndBlock__launchTag">Launch in 
              July</span>
            <div ref={unlockRef} className="arbixEndBlock__unlock" aria-label="Slide to unlock">
              <div ref={unlockFillRef} className="arbixEndBlock__unlockFill" aria-hidden="true" />
              <span className="arbixEndBlock__unlockText">Slide to try Demo ArbiX</span>
              <button
                ref={unlockHandleRef}
                type="button"
                className="arbixEndBlock__unlockHandle"
                aria-label="Drag to unlock and open ArbiX"
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
