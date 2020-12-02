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
    //set eventType
    this.eT = Detect.isMobile ? 'orientationchange' : 'resize'
    //set a tick flag
    this.tick = false
    //bind funcs
    BM(this, ['gT', 'gRaf', 'run'])
    //set throttle
    this.t = new Throttle({
      delay: o.throttleDelay,
      onlyAtEnd: true,
      cb: this.gRaf
    })
    //set rAF
    this.raf = new Raf(this.run)
  }
}

RO.prototype = {
  //add listener
  on: function() {
    this.l('a')
  },
  //remove listener
  off: function() {
    this.l('r')
  },
  //listener
  l: function(a) {
    L(window, a, this.eT, this.gT)
  },
  //getThrottle
  gT: function(e) {
    //get and set event object
    this.e = e
    //run throttle
    this.t.run()
  },
  //getRaf
  gRaf: function() {
    //if the rAF is not already running
    if (!this.tick) {
      //set tick flag to true
      this.tick = true

      //run rAF
      this.raf.run()
    }
  },

  run: function() {
    //call callback and pass in the event object
    this.cb(this.e)

    //cancel rAF
    this.raf.stop()

    //reset tick flag
    this.tick = false
  }
}

export default RO
