import BM from '../Core/BM'
import Raf from '../Core/Raf'
import Detect from '../Core/Detect'
import Throttle from '../Core/Throttle'
import L from '../Listener/L'

/*

──────────────────────────────────────────
──────────────────────────────────────────
RESIZE & ORIENTATION
──────────────────────────────────────────
──────────────────────────────────────────

M.BM(this, ['resize'])

this.ro = new M.RO({cb: this.resize, throttleDelay: 100})

this.ro.on()

resize (event) {
    console.log(event)
}

this.ro.off()

*/
class RO {
  constructor(o) {
    this.cb = o.cb
    // Set eventType
    this.eT = Detect.isMobile ? 'orientationchange' : 'resize'
    // Set a tick flag
    this.tick = false
    // Bind funcs
    BM(this, ['gT', 'gRaf', 'run'])
    // Set throttle
    this.t = new Throttle({
      delay: o.throttleDelay,
      onlyAtEnd: true,
      cb: this.gRaf,
    })
    // Set rAF
    this.raf = new Raf(this.run)
  }

  // Add listener
  on() {
    this.l('a')
  }

  // Remove listener
  off() {
    this.l('r')
  }

  // Listener
  l(a) {
    L(window, a, this.eT, this.gT)
  }

  // GetThrottle
  gT(e) {
    // Get and set event object
    this.e = e
    // Run throttle
    this.t.run()
  }

  // GetRaf
  gRaf() {
    // If the rAF is not already running
    if (!this.tick) {
      // Set tick flag to true
      this.tick = true

      // Run rAF
      this.raf.run()
    }
  }

  run() {
    // Call callback and pass in the event object
    this.cb(this.e)

    // Cancel rAF
    this.raf.stop()

    // Reset tick flag
    this.tick = false
  }
}

export default RO
