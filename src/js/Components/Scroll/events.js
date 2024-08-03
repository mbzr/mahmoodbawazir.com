import M from 'utils'
import Scroll from './index'
import ScrollSections from './sections'
// import PointerEvents from '../PointerEvents'

import Fx from '../Fx'

class ScrollEvents {
  constructor() {
    this.m = MBZ
    this.scrollSections = new ScrollSections()
    this.fx = new Fx()
    // this.pointerEvents = new PointerEvents()
    this.m.s = {
      y: 0,
    }
    this.m.takeScroll = false
    this.a = {
      pause: (t) => {},
    }
    this.s = {
      y: {},
    }
    this.vScroll = new Scroll({
      cb: {
        y: this.scrollY,
      },
    })
  }

  init = (arr) => {
    this.fx.init()
    // this.pointerEvents.init()
    this.scrollUp(0)
    this.scrollSections.init({
      cb: this.draw,
      arr: arr,
    })
  }

  resize = () => {
    const h = M.G.id('page').offsetHeight - this.m.win.h
    this.vScroll.resize(h)

    this.scrollUp(M.Clamp(this.s.y.targ, 0, h))
    this.scrollSections.resize()
    this.fx.resize()
  }

  on = (opts) => {
    this.scrollToListener('a')
    this.vScroll.on(opts)
  }

  off = () => {
    this.scrollToListener('r')
    this.vScroll.off()
  }

  scrollY = (currentTarget) => {
    if (this.m.takeScroll) {
      this.a.pause()
      this.s.y.targ = M.R(currentTarget)
      // this.pointerEvents.run()
    }
  }

  loop = () => {
    if (this.s.y.currR !== this.s.y.targ) {
      const difference = this.s.y.targ - this.s.y.curr
      this.s.y.curr += 0.08 * difference
      this.s.y.currR = M.R(this.s.y.curr)
      this.m.s.y = this.s.y.currR
      this.fx.run()
      this.scrollSections.run()
    }
  }

  draw = (el, val) => {
    M.T(el, 0, -val, 'px')
  }

  scrollUp = (val) => {
    console.log('scrollUp', val)
    this.s.y.targ = val
    this.s.y.curr = val
    this.s.y.currR = val
    this.m.s.y = this.s.y.targ
  }

  scrollToListener = (action) => {
    // M.L('#s-top', action, 'click', this.scrollTo)
  }

  scrollTo = () => {
    this.m.takeScroll = !1
    this.a.play()
  }
}

export default ScrollEvents
