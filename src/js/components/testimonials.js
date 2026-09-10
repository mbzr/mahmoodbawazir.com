/**
 * Testimonials slider. No dependencies.
 *
 * Each slide is almost the full width of the container so the next one peeks
 * in on the right. The active slide is opaque, the rest are dimmed in CSS via
 * [aria-hidden] and taken out of the tab order with `inert`.
 *
 * Resize is driven by Listeners.resize(), so there is no listener here.
 */

import M from '@utils'

const SWIPE = 40

export default class Testimonials {
  init = () => {
    const root = M.G.qs('[data-testimonials]')
    this.track = root && M.G.qs('[data-testimonials-track]', root)
    this.slides = this.track ? [...this.track.children] : []
    if (this.slides.length < 2) return

    this.prev = M.G.qs('[data-testimonials-prev]', root)
    this.next = M.G.qs('[data-testimonials-next]', root)
    this.last = this.slides.length - 1
    this.index = 0

    this.prev.addEventListener('click', () => this.go(this.index - 1))
    this.next.addEventListener('click', () => this.go(this.index + 1))
    root.addEventListener('keydown', this.onKeyDown)
    this.track.addEventListener('touchstart', this.onTouchStart, {
      passive: true,
    })
    this.track.addEventListener('touchend', this.onTouchEnd, { passive: true })

    this.draw()
  }

  go = (i) => {
    const next = M.Clamp(i, 0, this.last)
    if (next === this.index) return
    this.index = next
    this.draw()
  }

  // offsetLeft ignores the track's transform, so it already includes the gap
  draw = () => {
    const step = this.slides[1].offsetLeft - this.slides[0].offsetLeft
    this.track.style.transform = `translate3d(${-this.index * step}px, 0, 0)`

    this.slides.forEach((slide, i) => {
      const active = i === this.index
      slide.setAttribute('aria-hidden', String(!active))
      slide.inert = !active
    })

    this.prev.disabled = this.index === 0
    this.next.disabled = this.index === this.last
  }

  resize = () => {
    if (this.slides && this.slides.length > 1) this.draw()
  }

  onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') this.go(this.index - 1)
    else if (e.key === 'ArrowRight') this.go(this.index + 1)
  }

  onTouchStart = (e) => {
    this.startX = e.touches[0].clientX
  }

  onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - this.startX
    if (dx <= -SWIPE) this.go(this.index + 1)
    else if (dx >= SWIPE) this.go(this.index - 1)
  }
}
