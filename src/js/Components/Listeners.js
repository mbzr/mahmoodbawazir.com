import M from 'utils'
import ScrollEvents from './Scroll/events'
import Canvas from './Canvas'
import LazyLoader from './LazyLoader'

const parallax = {
  home: [
    {
      id: 'ls',
    },
    {
      id: 'intro',
    },
    {
      id: 'about',
    },
    {
      id: 'work',
    },
    {
      id: 'skills',
    },
    {
      id: 'contact',
    },
    {
      id: 'footer',
    },
  ],
  case: [
    {
      id: 'ls',
    },
    {
      id: 'case-banner',
    },
    {
      id: 'case-media',
    },
    {
      id: 'case-next',
    },
  ],
}

export default class Listeners {
  constructor() {
    this.m = MBZ
    this.isDesktop = this.m.device === 'desktop'

    this.canvas = new Canvas()
    this.ro = new M.RO({
      cb: this.resize,
      throttleDelay: 150,
    })
    this.m.scroll = new ScrollEvents()
    this.raf = new M.Raf(this.loop)
  }

  init = () => {
    this.canvasOn =
      this.m.page.is.home || (this.m.page.is.case && this.m.path.new === '/')
    console.log(this.m.page.is.case, this.m.path.new)
    const parallaxArr = this.m.page.is.home ? parallax.home : parallax.case
    this.m.scroll.init(parallaxArr)
    this.resize()
    this.ro.on()
  }

  resize = () => {
    this.m.scroll.resize()

    if (this.isDesktop) {
      this.canvasOn && this.canvas.resize()
    }
  }

  on = () => {
    this.raf.run()
    this.m.scroll.on({
      reset: true,
    })
    if (this.isDesktop) {
      this.canvasOn && this.canvas.on()
    }
    LazyLoader.run()
  }

  off = () => {
    this.m.scroll.off()
    this.raf.stop()
    if (this.isDesktop) {
      this.m.page.is.home && this.canvas.off()
    }
  }

  loop = () => {
    this.m.scroll.loop()
  }
}
