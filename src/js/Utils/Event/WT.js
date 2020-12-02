import BM from '../Core/BM'
import Detect from '../Core/Detect'
import L from '../Listener/L'
/*

──────────────────────────────────────────
──────────────────────────────────────────
WHEEL & TOUCH
──────────────────────────────────────────
──────────────────────────────────────────

M.BM(this, ['wtCb'])

this.WT = new M.WT(this.wtCb)

this.WT.on()
this.WT.off()

wtCb (delta, type, event) {

}

type → 'scroll' or 'touch'

*/
class WT {
  constructor(cb) {
    this.cb = cb
    this.tick = false
    BM(this, ['tS', 'gRaf', 'run'])
  }
}

WT.prototype = {
  on: function() {
    this.l('a')
  },

  off: function() {
    this.l('r')
  },

  l: function(a) {
    var d = document
    L(d, a, 'mouseWheel', this.gRaf)
    L(d, a, 'touchstart', this.tS)
    L(d, a, 'touchmove', this.gRaf)
  },

  gRaf: function(e) {
    this.e = e
    if (this.e.cancelable) {
      this.e.preventDefault()
    }

    if (!this.tick) {
      this.tick = true
      requestAnimationFrame(this.run)
    }
  },

  run: function() {
    var eType = this.e.type

    if (eType === 'wheel') {
      this.onWheel()
    } else if (eType === 'mousewheel') {
      this.onMWheel()
    } else if (eType === 'touchmove') {
      this.tM()
    }
  },

  onWheel: function() {
    this.type = 'scroll'
    this.delta = this.e.wheelDeltaY || this.e.deltaY * -1

    // deltamode === 1 -> wheel mouse, not touch pad
    // https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent#Delta_modes
    if (Detect.isFirefox && this.e.deltaMode === 1) {
      this.delta *= 40
    }

    this.gCb()
  },

  onMWheel: function() {
    this.type = 'scroll'
    this.delta = this.e.wheelDeltaY ? this.e.wheelDeltaY : this.e.wheelDelta

    this.gCb()
  },

  tS: function(e) {
    this.start = e.targetTouches[0].pageY
  },

  tM: function() {
    this.type = 'touch'
    this.delta = this.e.targetTouches[0].pageY - this.start

    this.gCb()
  },

  gCb: function() {
    this.cb(this.delta, this.type, this.e)
    this.tick = false
  }
}

export default WT
