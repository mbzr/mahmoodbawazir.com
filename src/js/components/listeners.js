import M from '@utils'
import SmoothScroll from './scroll'
import LazyLoader from './lazy-loader'
import Fx from './fx'
import Testimonials from './testimonials'

export default class Listeners {
  constructor() {
    this.m = MBZ
    this.nav = document.querySelector('.nav')
    this.prevY = 0

    this.fx = new Fx()
    this.testimonials = new Testimonials()
    this.scroll = new SmoothScroll({
      wrapper: '#page',
      sections: ['#ls', '#xhr'],
      onUpdate: this.onScroll,
    })
    this.m.scroll = this.scroll
    this.ro = new M.RO({
      cb: this.resize,
      throttleDelay: 150,
    })
  }

  init = () => {
    this.prevY = 0
    if (this.nav && !this.m.page.is.home) {
      this.nav.classList.add('is-visible', 'is-ready')
    }
    this.scroll.refresh()
    this.fx.init(this.scroll)
    this.testimonials.init()
    this.resize()
    this.ro.on()
  }

  resize = () => {
    this.setNavHeight()
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
    const dark = [...document.querySelectorAll('.bg-color-dark')].some((el) => {
      const rect = el.getBoundingClientRect()
      return rect.top <= probe && rect.bottom > probe
    })
    this.nav.classList.toggle('is-light', dark)
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
