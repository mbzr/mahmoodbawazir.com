import BM from './BM'
import Tab from '../Event/Tab'

/*
──────────────────────────────────────────
──────────────────────────────────────────
RAF
──────────────────────────────────────────
──────────────────────────────────────────

this.raf = new M.Raf(this.loop)

this.raf.run()
this.raf.stop()

loop (elapsed) {
    console.log(elapsed)
}
*/

const Raf = function(c) {
  //get callback
  this.cb = c

  //flag to track if rAF is running
  this.running = false

  this.c = this
  this.id = Raf.RafId
  this.tab = new Tab()
  Raf.RafId++

  BM(this, ['loop'])
}

Raf.RafId = 0

Raf.prototype = {
  run: function(tabT) {
    if (tabT) {
      this.sT += tabT
    } else {
      this.tab.add(this.id, this.c)
      this.sT = 0
    }

    //get rAF
    this.gR()
    //set running flag to true
    this.running = true
  },

  stop: function(tab) {
    //reset running flag
    this.running = false
    //cancel rAF
    cancelAnimationFrame(this.raf)
    if (!tab) {
      this.tab.remove(this.id)
    }
  },
  //getRaf
  gR: function() {
    //initiazlie rAF
    this.raf = requestAnimationFrame(this.loop)
  },

  loop: function(n) {
    this.time(n)

    if (this.running) {
      this.gR()
    }
  },

  time: function(n) {
    if (!this.sT) this.sT = n
    var elapsed = n - this.sT

    this.cb(elapsed, this.id)
  }
}

export default Raf
