import BM from './BM'

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

  BM(this, ['loop'])
}

Raf.prototype = {
  run: function() {
    //run rAF
    this.gR()
    //set running flag to true
    this.running = true
  },
  stop: function(tab) {
    //reset running flag
    this.running = false
    //cancel rAF
    cancelAnimationFrame(this.raf)
  },
  //getRaf
  gR: function() {
    //initialize rAF
    this.raf = requestAnimationFrame(this.loop)
  },
  loop: function() {
    //call the callback
    this.cb()

    //if rAF is set to run
    if (this.running) {
      //run rAF
      this.gR()
    }
  }
}

export default Raf
