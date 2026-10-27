/**
 * SmoothScroll — virtual (transform) scrolling. No dependencies.
 *
 * Required CSS: a fixed viewport with overflow hidden; `wrapper` is in-flow
 * content whose height is taller than the window.
 *
 * Sections: mark page chunks with [data-scroll-section]. Each one is its own
 * compositor layer, the same pattern locomotive used. Translating one tall
 * #xhr instead made the splash and lerp hitch. If none are marked, the
 * wrapper itself moves.
 *
 *   const scroll = new SmoothScroll({
 *     wrapper: '#page',
 *   })
 *   scroll.refresh()
 *   scroll.on()
 *   scroll.when('#about', () => tl.play())
 *
 * Parallax: mark descendants with data-speed (Y) and/or data-speed-x (X).
 */

const isFirefox = /firefox/i.test(navigator.userAgent)

const qs = (el) => (typeof el === 'string' ? document.querySelector(el) : el)

const clamp = (n, min, max) => Math.max(min, Math.min(n, max))

export default class SmoothScroll {
  constructor({
    wrapper,
    sections,
    lerp = 0.08,
    touchMultiplier = 2,
    onUpdate,
  } = {}) {
    this.wrapperSel = wrapper
    this.sectionSels = sections
    this.lerp = lerp
    this.touchMultiplier = touchMultiplier
    this.onUpdate = onUpdate

    this.y = 0
    this.target = 0
    this.max = 0
    this.enabled = false
    this.moving = false

    this.wrapper = null
    this.sections = []
    this.sectionMetrics = []
    this.parallax = []
    this.triggers = []

    this.wheelEvent = 'onwheel' in document ? 'wheel' : 'mousewheel'

    this._onWheel = this._onWheel.bind(this)
    this._onKeyDown = this._onKeyDown.bind(this)
    this._onTouchStart = this._onTouchStart.bind(this)
    this._onTouchMove = this._onTouchMove.bind(this)
    this._tick = this._tick.bind(this)
  }

  refresh() {
    this.wrapper = qs(this.wrapperSel)
    this.sections = this._collectSections()
    this.parallax = this.wrapper
      ? [...this.wrapper.querySelectorAll('[data-speed], [data-speed-x]')]
      : []
    this.y = 0
    this.target = 0
    this.resize()
  }

  on({ reset = false } = {}) {
    if (reset) {
      this.y = 0
      this.target = 0
      this._draw()
    }
    if (this.enabled) return
    this.enabled = true
    this._listen(true)
    this._kick()
  }

  off() {
    this.enabled = false
    this._listen(false)
    this._stop()
    this._setMoving(false)
  }

  resize() {
    if (!this.wrapper) return
    this.max = Math.max(0, this.wrapper.offsetHeight - window.innerHeight)
    this.target = clamp(this.target, 0, this.max)
    this.y = clamp(this.y, 0, this.max)
    this._measureSections()
    this._measureTriggers()
    this._draw()
  }

  scrollTo(y, immediate = false) {
    this.target = clamp(y, 0, this.max)
    if (immediate) {
      this.y = this.target
      this._draw()
      return
    }
    this._kick()
  }

  scrollToHash(hash, immediate = false) {
    if (!hash || hash === '#' || hash === '#top') {
      this.scrollTo(0, immediate)
      return
    }

    const el = document.querySelector(hash)
    if (!el) return

    this.scrollTo(el.getBoundingClientRect().top + this.y, immediate)
  }

  /**
   * Play `callback` once when scrollY passes the element's trigger line.
   * `offset` 0.7 ≈ fire when the top sits 70% down the viewport.
   */
  when(el, callback, offset = 0.7) {
    const node = qs(el)
    if (!node) return
    this.triggers.push({ el: node, callback, offset, limit: 0, done: false })
    this._measureTriggers()
  }

  clearTriggers() {
    this.triggers = []
  }

  _collectSections() {
    if (this.sectionSels) {
      return this.sectionSels.map(qs).filter(Boolean)
    }
    const root = qs('#xhr') || this.wrapper
    if (!root) return []
    const marked = [...root.querySelectorAll('[data-scroll-section]')]
    const top = marked.filter(
      (el) => !el.parentElement.closest('[data-scroll-section]')
    )
    return top.length ? top : [root]
  }

  _measureSections() {
    this.sectionMetrics = this.sections.map((el) => ({
      el,
      top: el.getBoundingClientRect().top + this.y,
      height: el.offsetHeight,
      hidden: el.style.visibility === 'hidden',
    }))
  }

  _measureTriggers() {
    const winH = window.innerHeight
    for (const t of this.triggers) {
      const line = t.el.getBoundingClientRect().top + this.y - winH * t.offset
      /*
        An element close to the bottom of the page can sit past the furthest
        scrollable position, which would leave its trigger permanently unfired
        — and anything it reveals permanently invisible. Clamp to the end of
        the page so reaching the bottom always fires it.
      */
      t.limit = Math.min(line, this.max)
    }
  }

  _kick() {
    if (!this.enabled || this.raf) return
    this.raf = requestAnimationFrame(this._tick)
  }

  _stop() {
    if (!this.raf) return
    cancelAnimationFrame(this.raf)
    this.raf = null
  }

  _setMoving(on) {
    if (this.moving === on) return
    this.moving = on
    if (this.wrapper) this.wrapper.classList.toggle('is-scrolling', on)
  }

  _tick() {
    this.raf = null
    if (!this.enabled) return
    const delta = this.target - this.y
    if (Math.abs(delta) >= 0.1) {
      this._setMoving(true)
      this.y += delta * this.lerp
      this._draw()
      this._kick()
      return
    }
    if (this.y !== this.target) {
      this.y = this.target
      this._draw()
    }
    this._setMoving(false)
  }

  _draw() {
    const y = this.y
    const winH = window.innerHeight
    const pad = winH
    const t = `translate3d(0, ${-y}px, 0)`

    if (this.sectionMetrics.length) {
      for (const s of this.sectionMetrics) {
        s.el.style.transform = t
        const visTop = s.top - y
        const inView = visTop + s.height > -pad && visTop < winH + pad
        if (s.hidden === inView) {
          s.hidden = !inView
          s.el.style.visibility = inView ? 'visible' : 'hidden'
        }
      }
    } else {
      for (const el of this.sections) {
        el.style.transform = t
      }
    }

    this._parallax()
    this._runTriggers()
    if (this.onUpdate) this.onUpdate(y)
  }

  _runTriggers() {
    for (const t of this.triggers) {
      if (!t.done && this.y >= t.limit) {
        t.done = true
        t.callback()
      }
    }
  }

  _parallax() {
    if (!this.parallax.length) return
    const mid = window.innerHeight / 2
    for (const el of this.parallax) {
      const rect = el.getBoundingClientRect()
      const inView = rect.bottom > 0 && rect.top < window.innerHeight
      if (!inView) {
        el.style.transform = 'translate3d(0, 0, 0)'
        continue
      }
      const shift = rect.top - mid + el.offsetHeight
      const x = shift * (Number(el.dataset.speedX) || 0)
      const y = shift * (Number(el.dataset.speed) || 0)
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }
  }

  _listen(add) {
    const method = add ? 'addEventListener' : 'removeEventListener'
    const opts = { passive: false }
    document[method](this.wheelEvent, this._onWheel, opts)
    document[method]('keydown', this._onKeyDown, opts)
    document[method]('touchstart', this._onTouchStart, opts)
    document[method]('touchmove', this._onTouchMove, opts)
  }

  _onWheel(e) {
    if (e.cancelable) e.preventDefault()
    if (!this.enabled) return

    // wheelDeltaY / -deltaY is negative when scrolling down
    let delta = e.wheelDeltaY || -e.deltaY
    if (isFirefox && e.deltaMode === 1) delta *= 60
    if (e.type === 'wheel') delta *= 0.556

    this.target = clamp(this.target - delta, 0, this.max)
    this._kick()
  }

  _onKeyDown(e) {
    if (!this.enabled) return
    const { key, shiftKey } = e
    let step = 0
    if (key === 'ArrowUp') step = -100
    else if (key === 'ArrowDown') step = 100
    else if (key === ' ') step = (window.innerHeight - 40) * (shiftKey ? -1 : 1)
    else return

    e.preventDefault()
    this.target = clamp(this.target + step, 0, this.max)
    this._kick()
  }

  _onTouchStart(e) {
    this._touchY = e.targetTouches[0].pageY
    this._touchFrom = this.target
  }

  _onTouchMove(e) {
    if (e.cancelable) e.preventDefault()
    if (!this.enabled) return
    const dy = e.targetTouches[0].pageY - this._touchY
    this.target = clamp(
      this._touchFrom - dy * this.touchMultiplier,
      0,
      this.max
    )
    this._kick()
  }
}
