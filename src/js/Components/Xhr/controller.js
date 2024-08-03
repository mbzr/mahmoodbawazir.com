import PathListener from '../PathListener'
import M from '@/utils'
import anime from 'animejs/lib/anime.es'
import Transitions from '../Transitions'

export default new (class XhrController {
  constructor() {
    this.pageSplash = M.G.id('page-splash')
  }

  outro = () => {
    console.log('XhrController outro')
    this.m = MBZ
    this.m.listeners.off()
    this.m.page = PathListener.run()
    const tl = anime.timeline({
      autoplay: false,
    })
    tl.add({
      targets: this.pageSplash,
      opacity: [0, 1],
      duration: 500,
      easing: 'linear',
      complete: this.m.done,
    })
    tl.play()
  }

  intro = () => {
    console.log('XhrController intro')
    this.m = MBZ
    this.m.outroIsOn = false
    this.m.xhr.removeOld()
    this.m.xhr.insertNew()
    this.m.listeners.init()
    const tl = anime.timeline({
      autoplay: false,
    })
    tl.add({
      targets: this.pageSplash,
      opacity: [1, 0],
      duration: 500,
      easing: 'linear',
      complete: this.introCb,
    })
    tl.play()
  }

  introCb = () => {
    this.m.listeners.on()
    Transitions.run()
    this.m.outroIsOn = true
  }
})()
