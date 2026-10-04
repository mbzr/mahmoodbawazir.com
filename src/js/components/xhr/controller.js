import anime from 'animejs/lib/anime.es'

import M from '@utils'
import PathListener from '../path-listener'
import Transitions from '../transitions'

const FADE = 350

/*
  Page-to-page transitions crossfade the content only. #page-splash is the
  light page background and stays where it is, so navigating never drops back
  to the black underneath it — that black belongs to the first load, before
  the splash has animated up.
*/
export default new (class XhrController {
  constructor() {
    this.content = M.G.id('xhr')
  }

  outro = () => {
    this.m = MBZ
    this.m.listeners.off()
    this.m.page = PathListener.run()
    anime({
      targets: this.content,
      opacity: [1, 0],
      duration: FADE,
      easing: 'linear',
      complete: this.m.done,
    })
  }

  intro = () => {
    this.m = MBZ
    this.m.outroIsOn = false
    this.m.xhr.removeOld()
    this.m.xhr.insertNew()
    this.m.listeners.init()
    anime({
      targets: this.content,
      opacity: [0, 1],
      duration: FADE,
      easing: 'linear',
      complete: this.introCb,
    })
  }

  introCb = () => {
    this.m.listeners.on()

    /*
      Has to come after listeners.on(), which sends the scroller back to the
      top. Jumping rather than scrolling keeps it to a single paint, so a link
      like /#about from a project page arrives already at that section.
    */
    if (this.m.hash) {
      this.m.scroll.scrollToHash(this.m.hash, true)
      this.m.hash = ''
    }

    Transitions.run()
    this.m.outroIsOn = true
  }
})()
