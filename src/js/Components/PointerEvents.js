import { N } from './Scroll/lib'

class PointerEvents {
  constructor() {
    this.m = MBZ
    this.isM = this.m.isMobile
    this.m.sIsRunning = false
    this.timer = new N.Delay(() => {
      this.m.sIsRunning = false
      this.p('none')
    }, 300)
  }

  init = () => {
    this.isM || (this.el = N.G.id("_p"));
  }

  run = () => {
    this.isM ||
            (this.timer.stop(),
            this.m.sIsRunning ||
              ((this.m.sIsRunning = !0), this.p("all")),
            this.timer.run());
  }

  p = (t) => {
    N.PE[t](this.el);
  }
}

export default PointerEvents