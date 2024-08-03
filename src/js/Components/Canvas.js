import M from 'utils'

class Canvas {
  constructor() {
    this.m = MBZ
    this.activeIndex = null
    this.canvasEl = M.G.id('cv')
    this.canvasContext = this.canvasEl.getContext('2d')

    this.lastMousePosition = { x: null, y: null }
    this.mousePosition = { x: null, y: null }
    this.image = new Image()
  }

  listeners = (action) => {
    this.workItems = M.G.class('work__item__anchor')
    this.workItemsL = this.workItems.length

    M.L(window, action, 'mousemove', this.mm)
    M.L(document, action, 'mouseWheel', this.reset)

    for (let i = 0; i < this.workItemsL; i++) {
      M.L(this.workItems[i], action, 'mouseenter', (e) =>
        this.moE(i, e.currentTarget.getAttribute('data-img'))
      )
      M.L(this.workItems[i], action, 'mouseleave', this.moL)
    }
  }

  on = () => {
    this.listeners('a')
  }

  off = () => {
    this.listeners('r')
    setTimeout(() => {
      this.reset()
    }, 500)
  }

  resize = () => {
    this.canvasEl.width = this.m.win.w
    this.canvasEl.height = this.m.win.h
  }

  draw = () => {
    const { width, height } = this.image
    let halfWidth = width / 2
    let halfHeight = height / 2

    if (this.lastMousePosition.x !== null) {
      const distance = Math.floor(
        Math.sqrt(
          Math.pow(this.mousePosition.x - this.lastMousePosition.x, 2) +
            Math.pow(this.mousePosition.y - this.lastMousePosition.y, 2)
        )
      )

      for (let p = 1; p <= distance; p++) {
        const t = p / distance
        const x = (1 - t) * this.lastMousePosition.x + t * this.mousePosition.x
        const y = (1 - t) * this.lastMousePosition.y + t * this.mousePosition.y

        this.canvasContext.drawImage(
          this.image,
          x - halfWidth,
          y - halfHeight,
          halfWidth * 2,
          halfHeight * 2
        )
      }
    }
  }

  reset = () => {
    if (this.activeIndex !== null) {
      this.activeIndex = null
      this.image.src = ''
      this.canvasContext.clearRect(0, 0, this.m.win.w, this.m.win.h)
    }
  }

  moE = (index, img) => {
    this.activeIndex = index

    if (this.activeIndex !== null) {
      this.image.src = img
      this.draw()
    }
  }

  moL = () => {
    this.reset()
  }

  mm = ({ clientX, clientY }) => {
    if (this.activeIndex !== null) {
      this.lastMousePosition = this.mousePosition
      this.mousePosition = { x: clientX, y: clientY }
      this.draw()
    } else {
      this.lastMousePosition = { x: null, y: null }
      this.mousePosition = { x: null, y: null }
    }
  }
}

export default Canvas
