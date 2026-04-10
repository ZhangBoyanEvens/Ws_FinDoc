import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const CODE_CHARS =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789(){}[]<>;:,._-+=!@#$%^&*|\\/\"'`~?"

function randomChar() {
  return CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
}

function buildAscii(width, height) {
  let out = ''
  for (let y = 0; y < height; y += 1) {
    let line = ''
    for (let x = 0; x < width; x += 1) line += randomChar()
    out += y === height - 1 ? line : `${line}\n`
  }
  return out
}

export function VetraScannerSection() {
  const particleCanvasRef = useRef(null)
  const scannerCanvasRef = useRef(null)
  const cardLineRef = useRef(null)
  const sectionRef = useRef(null)
  const controllerRef = useRef(null)
  const activeRef = useRef(true)

  useEffect(() => {
    const section = sectionRef.current
    const particleCanvas = particleCanvasRef.current
    const scannerCanvas = scannerCanvasRef.current
    const cardLine = cardLineRef.current
    if (!section || !particleCanvas || !scannerCanvas || !cardLine) return undefined

    let rafId = 0
    const cleanupFns = []

    // 1) Populate cards
    const cardImages = [
      'https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b55e654d1341fb06f8_4.1.png',
      'https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5a080a31ee7154b19_1.png',
      'https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5c1e4919fd69672b8_3.png',
      'https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5f6a5e232e7beb4be_2.png',
      'https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5bea2f1b07392d936_4.png',
    ]
    cardLine.innerHTML = ''
    const baseCount = 8
    for (let i = 0; i < baseCount * 2; i += 1) {
      const wrapper = document.createElement('div')
      wrapper.className = 'vetraScanner__card-wrapper'

      const normal = document.createElement('div')
      normal.className = 'vetraScanner__card vetraScanner__card-normal'
      const img = document.createElement('img')
      img.className = 'vetraScanner__card-image'
      img.src = cardImages[i % cardImages.length]
      img.alt = 'Card'
      normal.appendChild(img)

      const ascii = document.createElement('div')
      ascii.className = 'vetraScanner__card vetraScanner__card-ascii'
      const asciiContent = document.createElement('pre')
      asciiContent.className = 'vetraScanner__ascii-content'
      asciiContent.textContent = buildAscii(44, 12)
      ascii.appendChild(asciiContent)

      wrapper.appendChild(normal)
      wrapper.appendChild(ascii)
      cardLine.appendChild(wrapper)
    }

    const wrapperEls = [...cardLine.querySelectorAll('.vetraScanner__card-wrapper')]

    // 2) Card stream motion controller
    const stream = { v: 120 }
    controllerRef.current = stream
    cardLine.classList.add('vetraScannerSection__card-line--auto')

    // 3) Three.js particle lane
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(
      -window.innerWidth / 2,
      window.innerWidth / 2,
      125,
      -125,
      1,
      1000,
    )
    camera.position.z = 100
    const renderer = new THREE.WebGLRenderer({
      canvas: particleCanvas,
      alpha: true,
      antialias: false,
      powerPreference: 'low-power',
    })
    renderer.setSize(window.innerWidth, 250)
    renderer.setClearColor(0x000000, 0)

    const count = 36
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const velocities = new Float32Array(count)
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * window.innerWidth * 2
      positions[i * 3 + 1] = (Math.random() - 0.5) * 250
      sizes[i] = Math.random() * 2.6 + 1.3
      velocities[i] = Math.random() * 0.9 + 0.35
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    const material = new THREE.PointsMaterial({
      color: 0xc4b5fd,
      transparent: true,
      opacity: 0.58,
      size: 2.2,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const points = new THREE.Points(geometry, material)
    scene.add(points)

    // 4) Scanner canvas
    const sctx = scannerCanvas.getContext('2d')
    scannerCanvas.width = window.innerWidth
    scannerCanvas.height = 300

    const renderScanner = () => {
      if (!sctx) return
      sctx.clearRect(0, 0, scannerCanvas.width, scannerCanvas.height)
      const x = scannerCanvas.width / 2
      const grad = sctx.createLinearGradient(x - 5, 0, x + 5, 0)
      grad.addColorStop(0, 'rgba(0,255,255,0)')
      grad.addColorStop(0.5, 'rgba(0,255,255,0.95)')
      grad.addColorStop(1, 'rgba(0,255,255,0)')
      sctx.fillStyle = grad
      sctx.fillRect(x - 5, 0, 10, scannerCanvas.height)
    }

    const updateClip = () => {
      const centerX = window.innerWidth / 2
      wrapperEls.forEach((w) => {
        const rect = w.getBoundingClientRect()
        const left = rect.left
        const width = rect.width
        const normal = w.querySelector('.vetraScanner__card-normal')
        const ascii = w.querySelector('.vetraScanner__card-ascii')
        if (!normal || !ascii) return
        if (centerX >= left && centerX <= left + width) {
          const percent = ((centerX - left) / width) * 100
          normal.style.setProperty('--clip-right', `${percent}%`)
          ascii.style.setProperty('--clip-left', `${percent}%`)
        } else if (left + width < centerX) {
          normal.style.setProperty('--clip-right', '100%')
          ascii.style.setProperty('--clip-left', '100%')
        } else {
          normal.style.setProperty('--clip-right', '0%')
          ascii.style.setProperty('--clip-left', '0%')
        }
      })
    }

    let lastRenderTime = 0
    let lastClipTime = 0
    const targetFrameMs = 1000 / 24
    const tick = (frameNow = 0) => {
      if (activeRef.current && frameNow - lastRenderTime < targetFrameMs) {
        rafId = requestAnimationFrame(tick)
        return
      }
      if (!activeRef.current) {
        lastRenderTime = frameNow
        rafId = window.setTimeout(() => {
          rafId = requestAnimationFrame(tick)
        }, 140)
        return
      }
      lastRenderTime = frameNow
      for (let i = 0; i < count; i += 1) {
        positions[i * 3] += velocities[i]
        if (positions[i * 3] > window.innerWidth / 2 + 120) {
          positions[i * 3] = -window.innerWidth / 2 - 120
          positions[i * 3 + 1] = (Math.random() - 0.5) * 250
        }
      }
      geometry.attributes.position.needsUpdate = true
      renderer.render(scene, camera)
      renderScanner()
      if (frameNow - lastClipTime > 1000 / 15) {
        updateClip()
        lastClipTime = frameNow
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    const onResize = () => {
      renderer.setSize(window.innerWidth, 250)
      camera.left = -window.innerWidth / 2
      camera.right = window.innerWidth / 2
      camera.updateProjectionMatrix()
      scannerCanvas.width = window.innerWidth
    }
    window.addEventListener('resize', onResize)
    cleanupFns.push(() => window.removeEventListener('resize', onResize))

    const observer = new IntersectionObserver(
      ([entry]) => {
        activeRef.current = Boolean(entry?.isIntersecting)
      },
      { threshold: 0.05 },
    )
    observer.observe(section)
    cleanupFns.push(() => observer.disconnect())

    const onVisibilityChange = () => {
      activeRef.current = !document.hidden
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    cleanupFns.push(() => document.removeEventListener('visibilitychange', onVisibilityChange))

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(rafId)
      cleanupFns.forEach((fn) => fn())
      renderer.dispose()
      geometry.dispose()
      material.dispose()
    }
  }, [])

  const resetPosition = () => {
    const cardLine = cardLineRef.current
    if (!cardLine) return
    cardLine.classList.remove('vetraScannerSection__card-line--auto')
    // Force reflow, then re-attach animation to restart from initial position
    void cardLine.offsetWidth
    cardLine.classList.add('vetraScannerSection__card-line--auto')
  }

  return (
    <section className="vetraScannerSection" ref={sectionRef}>
      <div className="vetraScannerSection__controls">
        <button
          className="vetraScannerSection__btn"
          onClick={resetPosition}
          type="button"
          data-hover=""
        >
          ↻
        </button>
      </div>

      <div className="vetraScannerSection__container">
        <canvas id="particleCanvas" ref={particleCanvasRef} />
        <canvas id="scannerCanvas" ref={scannerCanvasRef} />
        <div className="vetraScannerSection__scanner" />
        <div className="vetraScannerSection__card-stream" id="cardStream">
          <div className="vetraScannerSection__card-line" id="cardLine" ref={cardLineRef} />
        </div>
      </div>

      <div className="vetraScannerSection__credit">
        Inspired by{' '}
        <a href="https://evenss.com/" target="_blank" rel="noreferrer" data-hover="">
          @evenss.com
        </a>
      </div>
    </section>
  )
}
