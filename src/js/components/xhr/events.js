import M from '@utils'
import Xhr from './xhr'

class XhrEvents {
  constructor(controller) {
    this.getController = controller
    this.m = MBZ
    this.xhr = M.G.id('xhr')
    M.L(M.Dom.body, 'a', 'click', this.eventDelegation)
  }

  eventDelegation = (event) => {
    // event.preventDefault()
    console.log(event)
    console.log('eventDelegation')

    for (
      var win = window,
        target = event.target,
        isAnchor = false,
        isSubmitButton = false;
      target;

    ) {
      if (target.tagName === 'A') {
        isAnchor = true
        break
      }
      if (
        (target.tagName === 'INPUT' || target.tagName === 'BUTTON') &&
        target.type === 'submit'
      ) {
        isSubmitButton = true
        break
      }

      target = target.parentNode
    }

    // return

    if (isAnchor) {
      const href = target.href
      const url = new URL(href, win.location.href)

      if (target.classList.contains('no-xhr')) {
        event.preventDefault()
        win.open(href)
        return
      }

      if (url.protocol === 'mailto:' || url.protocol === 'tel:') {
        event.preventDefault()
        let emailWindow = win.open(href)
        setTimeout(() => {
          emailWindow.close()
        }, 300)
        return
      }

      const sameOrigin = url.origin === win.location.origin
      const samePath = url.pathname === win.location.pathname
      const hash = url.hash

      if (sameOrigin && (hash === '#top' || (samePath && hash))) {
        event.preventDefault()
        if (this.m.scroll) this.m.scroll.scrollToHash(hash)
        return
      }

      if (!sameOrigin) return

      event.preventDefault()

      if (this.m.outroIsOn) {
        this.path = {
          old: M.Win.path,
          new: href.replace(/^.*\/\/[^/]+/, ''),
        }

        if (this.path.old !== this.path.new) {
          this.m.outroIsOn = false
          this.target = target
          this.xhrReq()
        }
      }
    }
  }

  xhrReq = () => {
    const controller = this.getController()

    this.m.done = this.done
    this.m.target = this.target
    this.m.path = this.path
    this.m.is404 = false
    controller.outro()
  }

  done = () => {
    Xhr.controller(this.path.new, this.xhrCallback)
  }

  xhrCallback = (child) => {
    const controller = this.getController()

    this.m.xhr = {
      insertNew: () => {
        this.xhr.insertAdjacentHTML('beforeend', child)
      },
      removeOld: () => {
        const container = this.xhr.children[0]
        container.parentNode.removeChild(container)
      },
    }
    this.m.outroIsOn = true
    controller.intro()
  }
}

export default XhrEvents
