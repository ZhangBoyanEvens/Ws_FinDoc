import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

export function VetraHeroSignalCanvas() {
  const hostRef = useRef(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return undefined

    const params = {
      colorBg: '#000000',
      colorLine: '#4b4b72',
      colorSignal: '#bfc5ff',
      lineCount: 42,
      positionY: 0,
      spreadHeight: 30.33,
      spreadDepth: 0,
      curveLength: 50,
      straightLength: 100,
      curvePower: 0.8265,
      waveSpeed: 2.48,
      waveHeight: 0.145,
      lineOpacity: 0.84,
      signalCount: 44,
      speedGlobal: 0.36,
      trailLength: 5,
      bloomStrength: 1.35,
      bloomRadius: 0.2,
    }
    params.positionX = (params.curveLength - params.straightLength) / 2

    const segmentCount = 72
    const size = {
      w: host.clientWidth || window.innerWidth,
      h: host.clientHeight || window.innerHeight,
    }

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(params.colorBg)
    scene.fog = new THREE.FogExp2(params.colorBg, 0.002)

    const camera = new THREE.PerspectiveCamera(45, size.w / size.h, 1, 1000)
    camera.position.set(0, 0, 90)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(size.w, size.h)

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1))
    host.appendChild(renderer.domElement)

    const contentGroup = new THREE.Group()
    contentGroup.position.set(params.positionX, params.positionY, 0)
    scene.add(contentGroup)

    const renderScene = new RenderPass(scene, camera)
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(size.w, size.h), 1.5, 0.4, 0.85)
    bloomPass.threshold = 0
    bloomPass.strength = params.bloomStrength
    bloomPass.radius = params.bloomRadius

    const composer = new EffectComposer(renderer)
    composer.addPass(renderScene)
    composer.addPass(bloomPass)

    const getPathPoint = (t, lineIndex, time) => {
      const totalLen = params.curveLength + params.straightLength
      const currentX = -params.curveLength + t * totalLen
      let y = 0
      let z = 0
      const spreadFactor = (lineIndex / params.lineCount - 0.5) * 2

      if (currentX < 0) {
        const ratio = (currentX + params.curveLength) / params.curveLength
        let shapeFactor = (Math.cos(ratio * Math.PI) + 1) / 2
        shapeFactor = Math.pow(shapeFactor, params.curvePower)
        y = spreadFactor * params.spreadHeight * shapeFactor
        z = spreadFactor * params.spreadDepth * shapeFactor
        const wave = Math.sin(time * params.waveSpeed + currentX * 0.1 + lineIndex)
        y += wave * params.waveHeight * shapeFactor
      }
      return new THREE.Vector3(currentX, y, z)
    }

    let backgroundLines = []
    let signals = []
    const bgMaterial = new THREE.LineBasicMaterial({
      color: params.colorLine,
      transparent: true,
      opacity: params.lineOpacity,
      depthWrite: false,
    })
    const signalMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
      transparent: true,
    })
    const signalColorObj1 = new THREE.Color(params.colorSignal)

    const rebuildSignals = () => {
      signals.forEach((s) => {
        contentGroup.remove(s.mesh)
        s.mesh.geometry.dispose()
      })
      signals = []
      for (let i = 0; i < params.signalCount; i += 1) {
        const maxTrail = 150
        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(maxTrail * 3), 3))
        geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(maxTrail * 3), 3))

        const mesh = new THREE.Line(geometry, signalMaterial)
        mesh.frustumCulled = false
        mesh.renderOrder = 1
        contentGroup.add(mesh)

        signals.push({
          mesh,
          laneIndex: Math.floor(Math.random() * params.lineCount),
          speed: 0.2 + Math.random() * 0.5,
          progress: Math.random(),
          history: [],
          assignedColor: signalColorObj1,
        })
      }
    }

    const rebuildLines = () => {
      backgroundLines.forEach((l) => {
        contentGroup.remove(l)
        l.geometry.dispose()
      })
      backgroundLines = []

      for (let i = 0; i < params.lineCount; i += 1) {
        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(segmentCount * 3), 3))
        const line = new THREE.Line(geometry, bgMaterial)
        line.userData = { id: i }
        line.renderOrder = 0
        contentGroup.add(line)
        backgroundLines.push(line)
      }
      rebuildSignals()
    }
    rebuildLines()

    const clock = new THREE.Clock()
    let isActive = true
    let lastRenderTime = 0
    const targetFrameMs = 1000 / 30
    let raf = 0
    const animate = (now = 0) => {
      if (!isActive) {
        raf = requestAnimationFrame(animate)
        return
      }
      if (now - lastRenderTime < targetFrameMs) {
        raf = requestAnimationFrame(animate)
        return
      }
      lastRenderTime = now
      const time = clock.getElapsedTime()

      backgroundLines.forEach((line) => {
        const positions = line.geometry.attributes.position.array
        const lineId = line.userData.id
        for (let j = 0; j < segmentCount; j += 1) {
          const t = j / (segmentCount - 1)
          const vec = getPathPoint(t, lineId, time)
          positions[j * 3] = vec.x
          positions[j * 3 + 1] = vec.y
          positions[j * 3 + 2] = vec.z
        }
        line.geometry.attributes.position.needsUpdate = true
      })

      signals.forEach((sig) => {
        sig.progress += sig.speed * 0.005 * params.speedGlobal
        if (sig.progress > 1) {
          sig.progress = 0
          sig.laneIndex = Math.floor(Math.random() * params.lineCount)
          sig.history = []
          sig.assignedColor = signalColorObj1
        }
        const pos = getPathPoint(sig.progress, sig.laneIndex, time)
        sig.history.push(pos)
        if (sig.history.length > params.trailLength + 1) sig.history.shift()

        const positions = sig.mesh.geometry.attributes.position.array
        const colors = sig.mesh.geometry.attributes.color.array
        const drawCount = Math.max(1, params.trailLength)
        const currentLen = sig.history.length

        for (let i = 0; i < drawCount; i += 1) {
          let idx = currentLen - 1 - i
          if (idx < 0) idx = 0
          const p = sig.history[idx] || new THREE.Vector3()
          positions[i * 3] = p.x
          positions[i * 3 + 1] = p.y
          positions[i * 3 + 2] = p.z

          let alpha = 1
          if (params.trailLength > 0) alpha = Math.max(0, 1 - i / params.trailLength)
          colors[i * 3] = sig.assignedColor.r * alpha
          colors[i * 3 + 1] = sig.assignedColor.g * alpha
          colors[i * 3 + 2] = sig.assignedColor.b * alpha
        }
        sig.mesh.geometry.setDrawRange(0, drawCount)
        sig.mesh.geometry.attributes.position.needsUpdate = true
        sig.mesh.geometry.attributes.color.needsUpdate = true
      })

      composer.render()
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    const onResize = () => {
      const w = host.clientWidth || window.innerWidth
      const h = host.clientHeight || window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      composer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    const observer = new IntersectionObserver(
      ([entry]) => {
        isActive = Boolean(entry?.isIntersecting)
      },
      { threshold: 0.05 },
    )
    observer.observe(host)

    const onVisibilityChange = () => {
      isActive = !document.hidden
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
      backgroundLines.forEach((l) => l.geometry.dispose())
      signals.forEach((s) => s.mesh.geometry.dispose())
      bgMaterial.dispose()
      signalMaterial.dispose()
      composer.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={hostRef} className="vetraHeroSignalCanvas" aria-hidden="true" />
}
