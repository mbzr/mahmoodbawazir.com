import L from '../Listener/L'
/*

──────────────────────────────────────────
──────────────────────────────────────────
WHEEL & TOUCH PREVENT
──────────────────────────────────────────
──────────────────────────────────────────

M.WTP.on()
M.WTP.off()

*/

const WTP = {
  p: function(e) {
    if (e.cancelable) {
      e.preventDefault()
    }
  },

  l: function(a) {
    var d = document

    L(d, a, 'mouseWheel', this.p)
    L(d, a, 'touchmove', this.p)
  },

  on: function () {
    console.log('WTP ON')
    this.l('a')
  },

  off: function () {
    console.log('WTP OFF')
    
    this.l('r')
  }
}

export default WTP
