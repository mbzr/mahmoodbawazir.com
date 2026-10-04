import anime from 'animejs/lib/anime.es.js'

import M from '@utils'
import splitLines from '@utils/el/split-lines'

const DURATION = 2000
const EASING = 'easeOutExpo'
/* The light sheet rising over the black background to become the page. */
const SPLASH_DURATION = 1500
/* On a cold load the content follows while the sheet is still settling. */
const CONTENT_AT = SPLASH_DURATION - 400
/* Gap between one piece of the hero joining the entrance and the next. */
const STEP = 140
/*
  easeOutExpo covers nearly all of its distance in the first third, so the
  entrance reads as over — and the page is handed back to the scroller — well
  before the last tween formally ends.
*/
const SETTLE = 700
/* Webfonts may never report ready; the page must never stay locked. */
const SETTLE_CAP = 6000

export default new (class Transitions {
  /**
   * `isFirstLoad` separates the two entrances. Landing on the site plays the
   * full reveal: black, then the splash up, then the nav and content. Moving
   * between pages leaves the background and nav alone — XhrController has
   * already crossfaded the content — so only the content animates, and
   * without the splash's head start.
   */
  run(isFirstLoad = false) {
    this.m = MBZ
    this.isFirstLoad = isFirstLoad
    this.contentAt = isFirstLoad ? CONTENT_AT : 0
    this.settled = new Promise((resolve) => (this.settle = resolve))
    setTimeout(this.settle, SETTLE_CAP)
    this.m.page.is.home ? this.homeIntro() : this.caseIntro()
  }

  /**
   * Resolves `settled` once the piece that starts at `lastAt` has landed.
   * Loader holds the scroller until then, so nothing can be scrolled out
   * from under the entrance while it plays.
   */
  settleAfter = (lastAt) => setTimeout(this.settle, lastAt + SETTLE)

  /** Waits for webfonts, since splitLines measures where the lines break. */
  whenReady = (play) => {
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(play)
    else play()
  }

  reveal = (nav) => {
    const tl = anime.timeline({
      autoplay: false,
      complete: () => {
        if (!nav) return
        nav.classList.add('is-visible', 'is-ready')
        nav.style.removeProperty('transform')
        nav.classList.remove('is-intro')
      },
    })

    if (!this.isFirstLoad) return tl

    if (nav) {
      nav.classList.add('is-intro')
      nav.classList.remove('is-visible', 'is-ready', 'is-light')
    }

    tl.add(
      {
        targets: M.G.id('page-splash'),
        opacity: [0, 1],
        translateY: ['100%', 0],
        easing: EASING,
        duration: SPLASH_DURATION,
      },
      0
    )

    tl.add(
      {
        targets: nav,
        translateY: ['-110%', '0%'],
        easing: EASING,
        duration: DURATION,
      },
      CONTENT_AT
    )

    return tl
  }

  homeIntro = () => {
    this.whenReady(() => {
      const nav = M.G.class('nav')[0],
        lead = M.G.class('intro__lead')[0],
        leadTxt = splitLines(lead),
        titleTxt = M.G.class('txt-up', M.G.class('intro__title')[0]),
        availability = M.G.qs('.intro-meta .availability'),
        scrollTxt = M.G.class('link-block')[0],
        at = this.contentAt

      this.introTL = this.reveal(nav)

      this.introTL.add(
        {
          targets: leadTxt,
          opacity: [0, 1],
          translateY: ['100%', 0],
          easing: EASING,
          duration: DURATION,
          delay: (_, i) => i * 100,
        },
        at
      )

      this.introTL.add(
        {
          targets: titleTxt,
          translateY: ['100%', 0],
          easing: EASING,
          duration: DURATION,
          delay: (_, i) => i * 100,
        },
        at
      )

      /*
        The lead and the name arrive together, then the availability line and
        the scroll cue follow a step apart.
      */
      this.introTL.add(
        {
          targets: availability,
          opacity: [0, 1],
          translateY: [16, 0],
          easing: EASING,
          duration: DURATION,
        },
        at + STEP
      )

      this.introTL.add(
        {
          targets: scrollTxt,
          opacity: [0, 1],
          translateY: [16, 0],
          easing: EASING,
          duration: DURATION,
        },
        at + STEP * 2
      )

      this.introTL.play()
      this.settleAfter(at + STEP * 2)
    })
  }

  /**
   * Fx builds the timeline for a project page's own content but leaves it to
   * be played here, so it always starts in step with the entrance.
   */
  caseIntro = () => {
    this.whenReady(() => {
      const at = this.contentAt
      this.introTL = this.reveal(M.G.class('nav')[0])
      this.introTL.play()

      /*
        Read the timeline when the delay fires rather than now: Fx and this
        both wait on document.fonts, and on a cold load this runs first.
      */
      const start = () => {
        const content = this.m.listeners && this.m.listeners.fx.introTL
        if (content) content.play()
      }
      at ? setTimeout(start, at) : start()

      /* The eyebrow and title are the first screen; the rows cascading in
         behind them are free to keep moving once scrolling is live. */
      this.settleAfter(at)
    })
  }
})()
