import anime from 'animejs/lib/anime.es.js'

import M from '@utils'
import Transitions from './transitions'
import Listeners from './listeners'
import PathListener from './path-listener'

class Loader {
  constructor() {
    this.m = MBZ
  }

  run = () => {
    this.m.outroIsOn = false
    this.m.page = PathListener.run()
    const years = M.G.class('ls__years')[0],
      scroll = M.G.class('ls__scroll')[0],
      logo = M.G.class('ls__logo')[0],
      duration = 2000,
      easing = 'easeOutExpo',
      delay = this.m.page.is.home ? 500 : 0
    this.rsTl = anime.timeline({ autoplay: false })
    this.rsTl.add({
      targets: logo,
      translateY: [15, 0],
      opacity: [0, 1],
      duration,
      easing,
      delay,
    })
    this.rsTl.add(
      {
        targets: [years, scroll],
        translateX: [100, 0],
        rotate: [180, 180],
        easing,
        duration,
        delay: anime.stagger(150),
      },
      '-=2400'
    )

    this.m.listeners = new Listeners()
    this.loading()
  }

  loading = () => {
    this.intro()

    this.anim()
  }

  intro = () => {
    setTimeout(() => {
      this.rsTl.play()
      /* Landing on the site, so play the full reveal. */
      Transitions.run(true)
    }, 400)
  }

  anim = () => {
    let delay = this.m.page.is.home ? 1500 : 500
    setTimeout(() => {
      this.hideCb()
    }, delay)
  }

  hideCb = () => {
    this.m.listeners.init()
    /*
      Everything but the scroller starts now. The entrance owns the first
      screen, so scrolling only joins once it has landed — otherwise a flick
      of the wheel pulls the page away mid-reveal.
    */
    this.m.listeners.on({ scroll: false })
    Transitions.settled.then(() => this.m.listeners.scroll.on({ reset: true }))
    this.m.outroIsOn = true
  }
}

export default Loader
