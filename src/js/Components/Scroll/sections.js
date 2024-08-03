import M from '@/utils'

export default class ScrollSections {
  constructor() {
    this.m = MBZ
  }

  init = (opts) => {
    this.cb = opts.cb
    this.arr = opts.arr
    this.arrL = this.arr.length

    // const pageChildren = M.G.id('xhr').children,
    //   pageChildrenL = pageChildren.length
    // this.arr = []
    // for (let i = 0; i < pageChildrenL; i++) {
    //   this.arr[i] = {
    //     dom: pageChildren[i]
    //   }
    // }

    this.skillsParallax = []
    const skillsItems = M.G.class('skills__item')
    for (let i = 0; i < skillsItems.length; i++) {
      const el = skillsItems[i]
      this.skillsParallax[i] = {
        el,
        speed: i % 2 === 0 ? -0.1 : 0.1,
      }
    }
    this.skillsParallaxL = this.skillsParallax.length

    for (let n = 0; n < this.arrL; n++) {
      const el = this.arr[n]
      el.dom = M.Select.el(`#${el.id}`)[0]
      el.isOut = true
      el.inside = {}
    }
  }

  resize = () => {
    const sY = this.m.s.y,
      winH = this.m.win.h

    for (let i = 0; i < this.arrL; i++) {
      const el = this.arr[i]
      this.draw(el, sY)
      const elTop = el.dom.getBoundingClientRect().top,
        elHeight = elTop + el.dom.offsetHeight

      el.inside.top = elTop - winH + sY
      el.inside.bottom = elHeight + sY
    }
  }

  run = () => {
    const sY = this.m.s.y
    for (let i = 0; i < this.arrL; i++) {
      let el = this.arr[i]
      sY >= el.inside.top && sY <= el.inside.bottom
        ? (el.isOut && (el.isOut = false), this.draw(el, sY))
        : el.isOut || ((el.isOut = true), this.draw(el, sY))

      if (el.dom.id === 'skills') {
        for (let j = 0; j < this.skillsParallaxL; j++) {
          let offset = this.skillsParallax[j].el.getBoundingClientRect().top,
            height = this.skillsParallax[j].el.offsetHeight,
            scrollTop = this.skillsParallax[j].el.scrollTop,
            speed = this.skillsParallax[j].speed,
            total = (offset - this.m.win.h / 2 + height - scrollTop) * speed

          el.isOut
            ? M.T(this.skillsParallax[j].el, 0, 0, 'px')
            : M.T(this.skillsParallax[j].el, total, 0, 'px')
        }
      }
    }
  }

  draw = (el, sY) => {
    this.cb(el.dom, sY)
  }
}
