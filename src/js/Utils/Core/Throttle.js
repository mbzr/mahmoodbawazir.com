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
    //get options
    this.delay = options.delay
    this.onlyAtEnd = options.onlyAtEnd
    this.cb = options.cb
    //set vars
    this.last
    this.timeout
    //bind funcs
    this.run = this.run.bind(this)
  }
}

Throttle.prototype = {
  run: function() {
    let firstTime = true
    let now = Date.now()

    //if last isnt undefined and initial date is less than timeout date + delay
    if ((this.last && now < this.last + this.delay) || firstTime) {
      firstTime = false
      //start with clearing timeout
      clearTimeout(this.timeout)
      //run timeout
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
