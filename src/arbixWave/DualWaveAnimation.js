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

    this.config = {
      waveNumber,
      waveSpeed,
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
    const maxLeftTextWidth = Math.max(...this.leftTexts.map((t) => t.offsetWidth))
    const maxRightTextWidth = Math.max(...this.rightTexts.map((t) => t.offsetWidth))

    this.leftRange = {
      minX: 0,
      maxX: this.leftColumn.offsetWidth - maxLeftTextWidth,
    }
    this.rightRange = {
      minX: 0,
      maxX: this.rightColumn.offsetWidth - maxRightTextWidth,
    }
  }

  setInitialPositions(texts, range, multiplier) {
    const rangeSize = range.maxX - range.minX
    texts.forEach((text, index) => {
      const initialPhase = this.config.waveNumber * index - Math.PI / 2
      const initialWave = Math.sin(initialPhase)
      const initialProgress = (initialWave + 1) / 2
      const startX = (range.minX + initialProgress * rangeSize) * multiplier
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
    const rangeSize = range.maxX - range.minX
    texts.forEach((text, index) => {
      const finalX =
        this.calculateWavePosition(index, progress, range.minX, rangeSize) * multiplier
      setters[index](finalX)
      text.classList.toggle('focused', index === focusedIndex)
    })
  }

  updateThumbnail(thumbnail, focusedText) {
    if (!thumbnail || !focusedText) return
    const newImage = focusedText.dataset.image
    if (newImage && this.currentImage !== newImage) {
      this.currentImage = newImage
      thumbnail.src = newImage
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
    return minX + cycleProgress * range
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

