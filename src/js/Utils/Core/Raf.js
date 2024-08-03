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

class Raf {
  constructor(c) {
    // Get callback
    this.cb = c

    // Flag to track if rAF is running
    this.running = false

    this.c = this

    BM(this, ['loop'])
  }

  run() {
    // Run rAF
    this.gR()
    // Set running flag to true
    this.running = true
  }

  stop(tab) {
    // Reset running flag
    this.running = false
    // Cancel rAF
    cancelAnimationFrame(this.raf)
  }

  // GetRaf
  gR() {
    // Initialize rAF
    this.raf = requestAnimationFrame(this.loop)
  }

  loop() {
    // Call the callback
    this.cb()

    // If rAF is set to run
    if (this.running) {
      // Run rAF
      this.gR()
    }
  }
}

export default Raf
