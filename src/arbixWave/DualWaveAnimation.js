import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export class DualWaveAnimation {
  constructor(wrapper, options = {}) {
    this.wrapper = wrapper instanceof Element ? wrapper : document.querySelector(wrapper)

    const waveNumber = this.wrapper?.dataset.waveNumber
      ? Number.parseFloat(this.wrapper.dataset.waveNumber)
      : 2
    const waveSpeed = this.wrapper?.dataset.waveSpeed
      ? Number.parseFloat(this.wrapper.dataset.waveSpeed)
      : 1
    const waveAmplitude = this.wrapper?.dataset.waveAmplitude
      ? Number.parseFloat(this.wrapper.dataset.waveAmplitude)
      : 1

    this.config = {
      waveNumber,
      waveSpeed,
      waveAmplitude,
      ...options,
    }

    this.currentImage = null
  }

  init() {
    if (!this.wrapper) return

    this.leftColumn = this.wrapper.querySelector('.wave-column-left')
    this.rightColumn = this.wrapper.querySelector('.wave-column-right')
    if (!this.leftColumn || !this.rightColumn) return

    this.setupAnimation()
  }

  setupAnimation() {
    this.leftTexts = gsap.utils.toArray(this.leftColumn.querySelectorAll('.animated-text'))
    this.rightTexts = gsap.utils.toArray(this.rightColumn.querySelectorAll('.animated-text'))
    this.thumbnail = this.wrapper.querySelector('.image-thumbnail')

    if (this.leftTexts.length === 0 || this.rightTexts.length === 0) return

    this.leftQuickSetters = this.leftTexts.map((text) =>
      gsap.quickTo(text, 'x', { duration: 0.6, ease: 'power4.out' }),
    )
    this.rightQuickSetters = this.rightTexts.map((text) =>
      gsap.quickTo(text, 'x', { duration: 0.6, ease: 'power4.out' }),
    )

    this.calculateRanges()
    this.setInitialPositions(this.leftTexts, this.leftRange, 1)
    this.setInitialPositions(this.rightTexts, this.rightRange, -1)
    this.setupScrollTrigger()

    this.resizeHandler = () => {
      this.calculateRanges()
    }
    window.addEventListener('resize', this.resizeHandler)
  }

  calculateRanges() {
    this.leftRange = {
      minX: 0,
      maxX: this.leftColumn.offsetWidth,
    }
    this.rightRange = {
      minX: 0,
      maxX: this.rightColumn.offsetWidth,
    }
  }

  setInitialPositions(texts, range, multiplier) {
    texts.forEach((text, index) => {
      const textRange = Math.max(0, range.maxX - range.minX - text.offsetWidth)
      const initialPhase = this.config.waveNumber * index - Math.PI / 2
      const initialWave = Math.sin(initialPhase)
      const initialProgress = (initialWave + 1) / 2
      const startX = (range.minX + initialProgress * textRange) * multiplier
      gsap.set(text, { x: startX })
    })
  }

  setupScrollTrigger() {
    this.scrollTrigger = ScrollTrigger.create({
      trigger: this.wrapper,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => this.handleScroll(self),
    })
  }

  handleScroll(self) {
    const globalProgress = self.progress
    const focusedIndex = this.findClosestToViewportCenter()
    this.updateColumn(
      this.leftTexts,
      this.leftQuickSetters,
      this.leftRange,
      globalProgress,
      focusedIndex,
      1,
    )
    this.updateColumn(
      this.rightTexts,
      this.rightQuickSetters,
      this.rightRange,
      globalProgress,
      focusedIndex,
      -1,
    )
    this.updateThumbnail(this.thumbnail, this.leftTexts[focusedIndex])
  }

  updateColumn(texts, setters, range, progress, focusedIndex, multiplier) {
    texts.forEach((text, index) => {
      const textRange = Math.max(0, range.maxX - range.minX - text.offsetWidth)
      const finalX =
        this.calculateWavePosition(index, progress, range.minX, textRange) * multiplier
      setters[index](finalX)
      text.classList.toggle('focused', index === focusedIndex)
    })
  }

  updateThumbnail(thumbnail, focusedText) {
    if (!thumbnail || !focusedText) return
    const score = Number.parseFloat(focusedText.dataset.score || '0')
    const color = score > 30 ? '#ef4444' : score > 20 ? '#3b82f6' : score > 10 ? '#22c55e' : '#6b7280'
    const sizeRem = Math.max(1.6, Math.min(4.4, 1.2 + score * 0.08))
    if (this.currentImage !== String(score)) {
      this.currentImage = String(score)
      thumbnail.innerHTML = `<span class="image-thumbnail__score">${score}%</span>`
      thumbnail.style.setProperty('--thumbnail-accent', color)
      thumbnail.style.setProperty('--thumbnail-score-size', `${sizeRem}rem`)
    }

    const wrapperRect = this.wrapper.getBoundingClientRect()
    const viewportCenter = window.innerHeight / 2
    const thumbnailHeight = thumbnail.offsetHeight
    const wrapperHeight = this.wrapper.offsetHeight
    const idealY = viewportCenter - wrapperRect.top - thumbnailHeight / 2
    const minY = -thumbnailHeight / 2
    const maxY = wrapperHeight - thumbnailHeight / 2
    const clampedY = Math.max(minY, Math.min(maxY, idealY))
    gsap.set(thumbnail, { y: clampedY })
  }

  calculateWavePosition(index, globalProgress, minX, range) {
    const phase =
      this.config.waveNumber * index +
      this.config.waveSpeed * globalProgress * Math.PI * 2 -
      Math.PI / 2
    const wave = Math.sin(phase)
    const cycleProgress = (wave + 1) / 2
    const centeredProgress = (cycleProgress - 0.5) * this.config.waveAmplitude + 0.5
    const clampedProgress = Math.max(0, Math.min(1, centeredProgress))
    return minX + clampedProgress * range
  }

  findClosestToViewportCenter() {
    const viewportCenter = window.innerHeight / 2
    let closestIndex = 0
    let minDistance = Number.POSITIVE_INFINITY
    this.leftTexts.forEach((text, index) => {
      const rect = text.getBoundingClientRect()
      const elementCenter = rect.top + rect.height / 2
      const distance = Math.abs(elementCenter - viewportCenter)
      if (distance < minDistance) {
        minDistance = distance
        closestIndex = index
      }
    })
    return closestIndex
  }

  destroy() {
    if (this.scrollTrigger) this.scrollTrigger.kill()
    if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler)
  }
}

