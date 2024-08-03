import M from 'utils/index'

export default class Support {
  constructor() {
    this.detect = M.Detect
    this.m = MBZ

    this.ro = new M.RO({
      cb: this.resize,
    })
    this.ro.on()
    this.init()
    this.resize()
  }
  init = () => {
    this.m.html = M.Dom.html
    this.m.body = M.Dom.body
    this.m.isMobile = this.detect.isMobile
    this.m.isFirefox = this.detect.isFirefox
    this.m.isSafari = this.detect.isSafari
    this.m.isIE = this.detect.isIE
    this.m.isTouch = this.detect.isTouch
    this.m.device = this.m.isMobile ? 'mobile' : 'desktop'

    this.m.html.className = `is-${this.m.device}`

    this.detect.isIEolderThan11 ||
      (this.detect.isSafariOlderThan8 &&
        this.m.html.classList.add('old-browser'))
  }

  resize = () => {
    this.m.over500 = window.matchMedia('(min-width: 501px)').matches
    this.m.over500Prop = this.m.over500 ? 'over500' : 'under500'
    this.m.win = {
      w: window.innerWidth,
      h: window.innerHeight,
    }
    this.m.winDemi = {
      w: this.m.win.w / 2,
      h: this.m.win.h / 2,
    }
    const w = {
      psd: {
        over500: {
          w: 1680,
          h: 992,
        },
        under500: {
          w: 414,
          h: 736,
        },
      },
    }
    this.m.psd = {
      h: w.psd[this.m.over500Prop].h,
      w: w.psd[this.m.over500Prop].w,
    }
    this.m.winWpsdW = this.m.win.w / this.m.psd.w
    this.m.winHpsdH = this.m.win.h / this.m.psd.h
    this.m.psdWwinW = this.m.psd.w / this.m.win.w
  }
}
