import anime from 'animejs/lib/anime.es.js'

import M from '@utils'
import splitLines from '@utils/el/split-lines'

export default new (class Transitions {
  run() {
    this.m = MBZ

    this.m.page.is.home ? this.homeIntro() : null
  }

  homeIntro = () => {
    const play = () => {
      const pageSplash = M.G.id('page-splash'),
        nav = M.G.class('nav')[0],
        lead = M.G.class('intro__lead')[0],
        leadTxt = splitLines(lead),
        titleTxt = M.G.class('txt-up', M.G.class('intro__title')[0]),
        cta = M.G.class('intro-cta-wrap')[0],
        scrollTxt = M.G.class('link-block')[0],
        duration = 2000,
        easing = 'easeOutExpo',
        splashDur = 1500,
        contentAt = splashDur - 400

      if (nav) {
        nav.classList.add('is-intro')
        nav.classList.remove('is-visible', 'is-ready', 'is-light')
      }

      this.introTL = anime.timeline({
        autoplay: false,
        complete: () => {
          if (!nav) return
          nav.classList.add('is-visible', 'is-ready')
          nav.style.removeProperty('transform')
          nav.classList.remove('is-intro')
        },
      })

      this.introTL.add(
        {
          targets: pageSplash,
          opacity: [0, 1],
          translateY: ['100%', 0],
          easing,
          duration: splashDur,
        },
        0
      )

      this.introTL.add(
        {
          targets: nav,
          translateY: ['-110%', '0%'],
          easing,
          duration,
        },
        contentAt
      )

      this.introTL.add(
        {
          targets: leadTxt,
          opacity: [0, 1],
          translateY: ['100%', 0],
          easing,
          duration,
          delay: (_, i) => i * 100,
        },
        contentAt
      )

      this.introTL.add(
        {
          targets: titleTxt,
          translateY: ['100%', 0],
          easing,
          duration,
          delay: (_, i) => i * 100,
        },
        contentAt
      )

      this.introTL.add(
        {
          targets: [cta, scrollTxt].filter(Boolean),
          opacity: [0, 1],
          translateY: [16, 0],
          easing,
          duration,
          delay: anime.stagger(120),
        },
        contentAt
      )

      this.introTL.play()
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(play)
    } else {
      play()
    }
  }
})()
