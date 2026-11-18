const qs = (el) => (typeof el === 'string' ? document.querySelector(el) : el)

const clamp = (n, min, max) => Math.max(min, Math.min(n, max))

export default class SmoothScroll {
  constructor({
    wrapper,
    sections,
    lerp = 0.1,
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
    this.listening = false
    this.keyboardFocus = false

    this.wrapper = null
    this.sections = []
    this.parallax = []
    this.triggers = []

    this.lerpDefault = lerp
    this.reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)')
    this.wheelEvent = 'onwheel' in document ? 'wheel' : 'mousewheel'

    this._onWheel = this._onWheel.bind(this)
    this._onKeyDown = this._onKeyDown.bind(this)
    this._onFocusIn = this._onFocusIn.bind(this)
    this._onPointerDown = this._onPointerDown.bind(this)
    this._onNativeScroll = this._onNativeScroll.bind(this)
    this._onTouchStart = this._onTouchStart.bind(this)
    this._onTouchMove = this._onTouchMove.bind(this)
    this._onTouchEnd = this._onTouchEnd.bind(this)
    this._onReduceChange = this._onReduceChange.bind(this)
    this._tick = this._tick.bind(this)

    this._syncReduce()
    this.reduceMQ.addEventListener('change', this._onReduceChange)
  }

  refresh() {
    this.wrapper = qs(this.wrapperSel)
    this.sections = this._collectSections()
    this.parallax = this.wrapper
      ? [...this.wrapper.querySelectorAll('[data-speed], [data-speed-x]')]
      : []
    for (const el of this.sections) {
      el.style.visibility = ''
    }
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
    this._resetNative()
    this.enabled = true
    this._listen(true)
    this.resize()
    this._kick()
  }

  // Ignore input while the intro is playing.
  lock() {
    this.enabled = false
    this._listen(true)
    this._resetNative()
  }

  off() {
    this.enabled = false
    this._listen(false)
    this._stop()
  }

  resize() {
    if (!this.wrapper) return
    this.max = Math.max(0, this.wrapper.offsetHeight - window.innerHeight)
    this.target = clamp(this.target, 0, this.max)
    this.y = clamp(this.y, 0, this.max)
    this._measureTriggers()
    this._draw()
  }

  scrollTo(y, immediate = false) {
    this.target = clamp(y, 0, this.max)
    if (immediate || this.lerp >= 1) {
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

    // Also focus the section, or the next Tab keeps going from the nav.
    if (el.hasAttribute('tabindex')) el.focus({ preventScroll: true })

    this.scrollTo(el.getBoundingClientRect().top + this.y, immediate)
  }

  // `offset` 0.7 fires once the top is about 70% down the screen.
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
      (el) => !el.parentElement.closest('[data-scroll-section]'),
    )
    return top.length ? top : [root]
  }

  _syncReduce() {
    this.lerp = this.reduceMQ.matches ? 1 : this.lerpDefault
  }

  _onReduceChange() {
    this._syncReduce()
    if (this.reduceMQ.matches) {
      this.y = this.target
      this._draw()
    }
  }

  _measureTriggers() {
    const winH = window.innerHeight
    for (const t of this.triggers) {
      const line = t.el.getBoundingClientRect().top + this.y - winH * t.offset
      // Stuff near the bottom can sit past the last scroll position.
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
    this.last = 0
  }

  _tick(now) {
    this.raf = null
    if (!this.enabled) return
    if (this.lerp >= 1) {
      this.y = this.target
      this._draw()
      return
    }
    const delta = this.target - this.y
    if (Math.abs(delta) >= 0.5) {
      const prev = this.last || now - 16.67
      const dt = Math.min(Math.max(now - prev, 0), 48)
      this.last = now
      // Same ease at 60Hz and 120Hz, and a dropped frame doesn't stall the next one.
      const step = 1 - Math.pow(1 - this.lerp, dt / 16.67)
      this.y += delta * step
      this._draw()
      this._kick()
      return
    }
    this.last = 0
    if (this.y !== this.target) {
      this.y = this.target
      this._draw()
    }
  }

  _draw() {
    const y = this.y
    const t = `translate3d(0, ${-y}px, 0)`

    for (const el of this.sections) {
      el.style.transform = t
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
    if (this.reduceMQ.matches) {
      for (const el of this.parallax) {
        el.style.transform = 'translate3d(0, 0, 0)'
      }
      return
    }
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

  _resetNative() {
    window.scrollTo(0, 0)
    const app = document.getElementById('app')
    if (app) app.scrollTop = 0
  }

  _listen(add) {
    if (this.listening === add) return
    this.listening = add
    const method = add ? 'addEventListener' : 'removeEventListener'
    const opts = { passive: false }
    document[method](this.wheelEvent, this._onWheel, opts)
    document[method]('keydown', this._onKeyDown, opts)
    document[method]('focusin', this._onFocusIn)
    document[method]('pointerdown', this._onPointerDown, true)
    document[method]('scroll', this._onNativeScroll, true)
    document[method]('touchstart', this._onTouchStart, opts)
    document[method]('touchmove', this._onTouchMove, opts)
    document[method]('touchend', this._onTouchEnd)
    document[method]('touchcancel', this._onTouchEnd)
  }

  _onPointerDown() {
    this.keyboardFocus = false
    this.focusAimed = false
  }

  // Focus and find-in-page can still scroll for real. Fold that into our position.
  _onNativeScroll() {
    const app = document.getElementById('app')
    const top = (app ? app.scrollTop : 0) + window.scrollY
    if (!top) return
    this._resetNative()
    if (!this.enabled) return
    this.y = clamp(this.y + top, 0, this.max)
    if (!this.focusAimed) this.target = clamp(this.target + top, 0, this.max)
    this.focusAimed = false
    this._draw()
    this._kick()
  }

  _onWheel(e) {
    if (e.cancelable) e.preventDefault()
    if (!this.enabled) return

    let delta = e.deltaY
    if (e.deltaMode === 1) delta *= 16
    else if (e.deltaMode === 2) delta *= window.innerHeight
    if (e.type === 'wheel') delta *= 0.5

    this.target = clamp(this.target + delta, 0, this.max)
    this._kick()
  }

  _onKeyDown(e) {
    this.keyboardFocus = true
    if (e.ctrlKey || e.metaKey || e.altKey) return

    const el = e.target
    if (el instanceof Element) {
      const tag = el.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (el.isContentEditable) return
      if (el.closest('video, audio')) return
      if (tag === 'BUTTON' && e.key === ' ') return
    }

    const { key, shiftKey } = e
    const page = window.innerHeight - 40
    let next
    if (key === 'ArrowUp') next = this.target - 100
    else if (key === 'ArrowDown') next = this.target + 100
    else if (key === ' ') next = this.target + page * (shiftKey ? -1 : 1)
    else if (key === 'PageDown') next = this.target + page
    else if (key === 'PageUp') next = this.target - page
    else if (key === 'Home') next = 0
    else if (key === 'End') next = this.max
    else return

    e.preventDefault()
    if (!this.enabled) return
    this.scrollTo(next)
  }

  // Keyboard only. Clicking a section shouldn't jump the page.
  _onFocusIn(e) {
    if (!this.enabled || !this.keyboardFocus) return
    const el = e.target
    if (!(el instanceof Element)) return
    if (el.closest('.nav, #ls, #page-splash')) return
    if (el.getAttribute('tabindex') === '-1') return

    const rect = el.getBoundingClientRect()
    const margin = 120
    const winH = window.innerHeight
    if (rect.top >= margin && rect.bottom <= winH) return

    this.focusAimed = true
    this.scrollTo(this.y + rect.top - margin)
  }

  _onTouchStart(e) {
    const y = e.targetTouches[0].pageY
    this._touchY = y
    this._lastY = y
    this._lastT = performance.now()
    this._vel = 0
    this._touchFrom = this.target
  }

  _onTouchMove(e) {
    if (e.target instanceof Element && e.target.closest('video, audio')) return
    if (e.cancelable) e.preventDefault()
    if (!this.enabled) return
    const y = e.targetTouches[0].pageY
    const now = performance.now()
    const dt = now - this._lastT
    if (dt > 0) this._vel = (y - this._lastY) / dt
    this._lastY = y
    this._lastT = now
    this.target = clamp(
      this._touchFrom - (y - this._touchY) * this.touchMultiplier,
      0,
      this.max,
    )
    this._kick()
  }

  // A little coast when the finger lifts. Capped so a flick doesn't fly the page.
  _onTouchEnd() {
    if (!this.enabled) return
    const cap = window.innerHeight * 0.45
    const coast = clamp(-this._vel * 240, -cap, cap)
    this._vel = 0
    if (Math.abs(coast) < 12) return
    this.target = clamp(this.target + coast, 0, this.max)
    this._kick()
  }
}
