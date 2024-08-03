import M from '@utils'

class Scroll {
  constructor(opts) {
    const optCb = opts.cb
    this.cbY = optCb.y
    this.m = MBZ
    this.isOn = false
    this.y = 0
    this.isFirefox = this.m.isFirefox
  }

  listeners = (action) => {
    const events = ['mouseWheel', 'keydown', 'touchmove']
    const eventsL = events.length
    M.L(document, action, 'touchstart', this.touchStart)
    for (let i = 0; i < eventsL; i++) {
      M.L(document, action, events[i], this.raf)
    }
  }

  on = (opts) => {
    if (opts.reset) {
      this.y = 0
      this.tick = false
      this.isOn = true
      this.listeners('a')
    }
  }

  off = () => {
    this.isOn = false
    this.listeners('r')
  }

  scrollTo = (pos) => {
    this.y = -pos
  }

  resize = (max) => {
    this.max = max
    this.spaceGap = this.m.win.h - 40
    this.getCb()
  }

  raf = (mE) => {
    // mouse event
    this.mE = mE
    this.mEType = mE.type
    this.mEKey = mE.key

    !mE.cancelable ||
      ('keydown' === this.mEType && 'Tab' !== this.mEKey) ||
      mE.preventDefault(),
      this.isOn &&
        ((this.m.takeScroll = !0),
        this.tick || (requestAnimationFrame(this.run), (this.tick = !0)))
  }

  run = () => {
    const type = this.mEType
    // type === 'wheel' ? this.wheel() : type === 'mousewheel' ? this.mouseWheel() : type === 'keydown' && this.keyDown() ? type === 'touchmove' && this.touchMove() : ''
    'wheel' === type
      ? this.wheel()
      : 'mousewheel' === type
      ? this.mouseWheel()
      : 'touchmove' === type
      ? this.touchMove()
      : 'keydown' === type && this.keyDown()
  }

  mouseWheel = () => {
    let delta = this.mE.wheelDeltaY ? this.mE.wheelDeltaY : this.mE.wheelDelta
    this.y += delta
    this.getCb()
  }

  wheel = () => {
    let delta = this.mE.wheelDeltaY || -1 * this.mE.deltaY

    this.isFirefox && 1 === this.mE.deltaMode && (delta *= 60),
      (delta *= 0.556),
      (this.y += delta),
      this.getCb()
  }

  keyDown = () => {
    const key = this.mEKey,
      isArrowUp = key === 'ArrowUp',
      isArrowDown = key === 'ArrowDown',
      isSpace = key === ' '

    if (isArrowUp || isArrowDown || isSpace) {
      let step = 0
      if (isArrowUp) {
        step = 100
      } else if (isArrowDown) {
        step = -100
      } else if (isSpace) {
        const isShift = this.mE.shiftKey ? 1 : -1
        step = this.spaceGap * isShift
      }
      this.y += step
      this.getCb()
    } else {
      this.tick = false
    }
  }

  touchStart = (e) => {
    this.prevMove = this.y
    this.start = e.targetTouches[0].pageY
    console.log('touchStaer')
  }

  touchMove = () => {
    console.log('touchMove')
    ;(this.y =
      2 * (this.mE.targetTouches[0].pageY - this.start) + this.prevMove),
      this.getCb()
  }

  getCb = () => {
    if (this.tick) {
      this.y = M.R(M.Clamp(this.y, -this.max, 0))
      this.cbY(-this.y)
      this.tick = false
    }
  }
}

export default Scroll
