import gsap from 'gsap'

import M from '../../Utils'

export default new (class Cursor {
  constructor() {
    this.cursor = M.G.id('cursor')
    this.cursorActiveClass = 'cursor--active'

    this.speed = 0.1
    this.pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    this.mouse = { x: this.pos.x, y: this.pos.y }

    gsap.set(this.cursor, { left: -50, top: -50 })

    this.setX = gsap.quickSetter(this.cursor, 'left', 'px')
    this.setY = gsap.quickSetter(this.cursor, 'top', 'px')

    M.BM(this, [
      'init',
      'destroy',
      'listeners',
      'updateCursorPosition',
      'refreshCursorPosition',
      'hoverEvents'
    ])
  }

  init() {
    this.listeners('a')
  }

  destroy() {
    this.listeners('r')
  }

  listeners(action) {
    M.L(window, action, 'mousemove', this.refreshCursorPosition)
    gsap.ticker[action === 'a' ? 'add' : 'remove'](this.updateCursorPosition)
    this.hoverEvents(action)
  }

  updateCursorPosition() {
    const dt = 1.0 - Math.pow(1.0 - this.speed, gsap.ticker.deltaRatio())

    this.pos.x += (this.mouse.x - this.pos.x) * dt
    this.pos.y += (this.mouse.y - this.pos.y) * dt
    this.setX(this.pos.x - 11)
    this.setY(this.pos.y - 11)
  }

  refreshCursorPosition(e) {
    this.mouse.x = e.x
    this.mouse.y = e.y
  }

  hoverEvents(action) {
    this.anchorElements = M.G.tag('a')
    this.anchorElementsL = this.anchorElements.length

    for (let i = 0; i < this.anchorElementsL; i++) {
      M.L(this.anchorElements[i], action, 'mouseenter', () =>
        this.cursor.classList.add(this.cursorActiveClass)
      )
      M.L(this.anchorElements[i], action, 'mouseleave', () =>
        this.cursor.classList.remove(this.cursorActiveClass)
      )
    }
  }
})()
