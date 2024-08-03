/*

──────────────────────────────────────────
──────────────────────────────────────────
THROTTLE
──────────────────────────────────────────
──────────────────────────────────────────

const throttle = new M.Throttle({
    delay: 200,
    onlyAtEnd: true,
    cb: callback
})

throttle.run()

*/
class Throttle {
  constructor(options) {
    // Get options
    this.delay = options.delay
    this.onlyAtEnd = options.onlyAtEnd
    this.cb = options.cb
    // Set vars
    this.last = null
    this.timeout = null
    // Bind funcs
    this.run = this.run.bind(this)
  }

  run() {
    let firstTime = true
    let now = Date.now()

    // If last isn't undefined and initial date is less than timeout date + delay
    if ((this.last && now < this.last + this.delay) || firstTime) {
      firstTime = false
      // Start with clearing timeout
      clearTimeout(this.timeout)
      // Run timeout
      this.timeout = setTimeout(() => {
        this.last = now
        this.cb()
      }, this.delay)
    } else {
      this.last = now
      if (!this.onlyAtEnd) {
        firstTime = false
        this.cb()
      }
    }
  }
}

export default Throttle
