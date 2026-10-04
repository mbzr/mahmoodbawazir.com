import M from '@utils'
import SmoothScroll from './scroll'
import Canvas from './canvas'
import LazyLoader from './lazy-loader'
import Fx from './fx'
import Testimonials from './testimonials'

export default class Listeners {
  constructor() {
    this.m = MBZ
    this.isDesktop = this.m.device === 'desktop'
    this.nav = document.querySelector('.nav')
    this.prevY = 0

    this.canvas = new Canvas()
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
    this.canvasOn =
      this.m.page.is.home || (this.m.page.is.case && this.m.path.new === '/')
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
    this.scroll.resize()
    this.testimonials.resize()
    this.updateNavTheme()

    if (this.isDesktop) {
      this.canvasOn && this.canvas.resize()
    }
  }

  onScroll = (y) => {
    this.updateNav(y)
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

  on = () => {
    this.scroll.on({
      reset: true,
    })
    if (this.isDesktop) {
      this.canvasOn && this.canvas.on()
    }
    LazyLoader.run()
  }

  off = () => {
    this.scroll.off()
    if (this.isDesktop) {
      this.m.page.is.home && this.canvas.off()
    }
  }
}
