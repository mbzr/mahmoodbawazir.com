import M from '@utils'
import { resplitAll } from '@utils/el/split-lines'
import SmoothScroll from './scroll'
import LazyLoader from './lazy-loader'
import Fx from './fx'
import Testimonials from './testimonials'
import Previews from './previews'

export default class Listeners {
  constructor() {
    this.m = MBZ
    this.nav = document.querySelector('.nav')
    this.prevY = 0

    this.fx = new Fx()
    this.testimonials = new Testimonials()
    this.previews = new Previews()
    this.scroll = new SmoothScroll({
      wrapper: '#page',
      onUpdate: this.onScroll,
    })
    /* Block native scroll from the first paint so a wheel during the
       entrance cannot steal the page before the scroller is unlocked. */
    this.scroll.lock()
    this.darkEls = []
    this.splashEls = []
    this.m.scroll = this.scroll
    this.ro = new M.RO({
      cb: this.resize,
      throttleDelay: 150,
    })
    this.width = window.innerWidth
    /* Content height also changes without a window resize: webfonts, images,
       lines resplitting. The scroll length has to follow or the end of the
       page becomes unreachable. */
    this.pageRO =
      'ResizeObserver' in window
        ? new ResizeObserver(() => this.scroll.resize())
        : null
  }

  init = () => {
    this.prevY = 0
    if (this.nav && !this.m.page.is.home) {
      this.nav.classList.add('is-visible', 'is-ready')
    }
    this.scroll.refresh()
    this.darkEls = [...document.querySelectorAll('.bg-color-dark')]
    this.splashEls = [...document.querySelectorAll('.work-splash')]
    this.fx.init(this.scroll)
    this.testimonials.init()
    this.previews.init()
    this.width = window.innerWidth
    this.resize()
    this.ro.on()
    if (this.pageRO && this.scroll.wrapper) {
      this.pageRO.disconnect()
      this.pageRO.observe(this.scroll.wrapper)
    }
  }

  resize = () => {
    this.setNavHeight()
    /* Lines break by width and the root font size follows the viewport
       width. Height-only resizes (a phone's URL bar) leave them alone. */
    if (window.innerWidth !== this.width) {
      this.width = window.innerWidth
      resplitAll()
    }
    this.scroll.resize()
    this.testimonials.resize()
    this.updateNavTheme()
  }

  onScroll = (y) => {
    this.updateNav(y)
  }

  /*
    The hero sizes itself to one screen minus the nav, which sits above it in
    flow. Measured rather than hard-coded because the nav's height follows
    the root font size, which scales with the viewport.
  */
  setNavHeight = () => {
    if (!this.nav) return
    const h = this.nav.offsetHeight
    document.documentElement.style.setProperty('--nav-h', `${h}px`)
  }

  updateNav = (y) => {
    if (!this.nav || !this.nav.classList.contains('is-ready')) return

    const dy = y - this.prevY
    this.prevY = y

    if (y < 24) {
      this.nav.classList.add('is-visible')
    } else if (dy > 1.2) {
      this.nav.classList.remove('is-visible')
    } else if (dy < -1.2) {
      this.nav.classList.add('is-visible')
    }

    this.updateNavTheme()
  }

  updateNavTheme = () => {
    if (!this.nav) return
    const probe = 24
    const under = (el) => {
      const rect = el.getBoundingClientRect()
      return rect.top <= probe && rect.bottom > probe
    }
    const dark = this.darkEls.some(under)
    /* The work sheet is cream. While it still covers the probe, the section
       behind it is dark but the nav is sitting on the sheet. */
    const covered = this.splashEls.some(under)
    this.nav.classList.toggle('is-light', dark && !covered)
  }

  on = ({ scroll = true } = {}) => {
    if (scroll) {
      this.scroll.on({
        reset: true,
      })
    }
    LazyLoader.run()
  }

  off = () => {
    this.scroll.off()
  }
}
