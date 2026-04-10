import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'

function lerp(a, b, n) {
  return (1 - n) * a + n * b
}

/**
 * 差分混合跟随圆点光标（React 化），悬停 [data-hover] 时放大。
 * 仅在精细指针设备启用。
 */
export function VetraDifferenceCursor({ scopeRef }) {
  const canvasRef = useRef(null)

  useLayoutEffect(() => {
    if (!matchMedia('(pointer: fine)').matches) return undefined

    const canvas = canvasRef.current
    const scope = scopeRef?.current
    if (!canvas || !scope) return undefined

    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    let width = 0
    let height = 0
    const circle = { lastX: 0, lastY: 0, radius: 10 }
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let rafId = 0
    let lastFrame = 0
    const frameMinMs = 1000 / 30

    const resize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const loop = (now) => {
      if (now - lastFrame < frameMinMs) {
        rafId = requestAnimationFrame(loop)
        return
      }
      lastFrame = now
      circle.lastX = lerp(circle.lastX, mouseX, 0.25)
      circle.lastY = lerp(circle.lastY, mouseY, 0.25)
      ctx.clearRect(0, 0, width, height)
      ctx.beginPath()
      ctx.arc(circle.lastX, circle.lastY, circle.radius, 0, Math.PI * 2, false)
      ctx.fillStyle = '#ffffff'
      ctx.fill()
      rafId = requestAnimationFrame(loop)
    }

    resize()
    circle.lastX = mouseX
    circle.lastY = mouseY

    const tween = gsap.to(circle, {
      radius: 30,
      duration: 0.25,
      ease: 'power1.inOut',
      paused: true,
    })

    const elems = [...scope.querySelectorAll('[data-hover]')]
    const cleanups = elems.map((el) => {
      const onEnter = () => tween.play()
      const onLeave = () => tween.reverse()
      el.addEventListener('mouseenter', onEnter, false)
      el.addEventListener('mouseleave', onLeave, false)
      return () => {
        el.removeEventListener('mouseenter', onEnter, false)
        el.removeEventListener('mouseleave', onLeave, false)
      }
    })

    scope.classList.add('vetraDiffCursor--active')
    window.addEventListener('resize', resize, false)
    window.addEventListener('mousemove', onMove, false)
    rafId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize, false)
      window.removeEventListener('mousemove', onMove, false)
      tween.kill()
      cleanups.forEach((fn) => fn())
      scope.classList.remove('vetraDiffCursor--active')
    }
  }, [scopeRef])

  return <canvas ref={canvasRef} className="vetraDiffCursor" aria-hidden="true" />
}
