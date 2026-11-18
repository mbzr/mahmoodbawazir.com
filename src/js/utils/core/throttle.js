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
    this.delay = options.delay
    this.onlyAtEnd = options.onlyAtEnd
    this.cb = options.cb
    this.last = null
    this.timeout = null
    this.run = this.run.bind(this)
  }

  run() {
    const now = Date.now()

    if (this.onlyAtEnd || (this.last && now < this.last + this.delay)) {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.last = now
        this.cb()
      }, this.delay)
      return
    }

    this.last = now
    this.cb()
  }
}

export default Throttle
