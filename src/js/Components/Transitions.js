import anime from 'animejs/lib/anime.es.js'
import M from 'utils'

export default new (class Transitions {
  run() {
    this.m = MBZ

    this.m.page.is.home ? this.homeIntro() : null
  }

  homeIntro = () => {
    this.introTL = anime.timeline({
      autoplay: false,
    })

    const title = M.G.class('intro__title')[0],
      titleTxt = M.G.class('txt-up', title),
      duration = 2000,
      easing = 'easeOutExpo'

    this.introTL.add({
      targets: titleTxt,
      translateY: ['100%', 0],
      easing,
      duration,
      delay: (_, i) => (0 === i ? 0 : i * 100),
    })

    this.introTL.play()
  }
})()
