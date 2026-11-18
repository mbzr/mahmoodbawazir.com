import anime from 'animejs/lib/anime.es.js'

import M from '@utils'
import splitLines, { revealLines } from '@utils/el/split-lines'

const DURATION = 2000
const EASING = 'easeOutExpo'
const SPLASH_DURATION = 1500
/* First-load content starts while the splash is still settling. */
const CONTENT_AT = SPLASH_DURATION - 400
const STEP = 140
/* Unlock scroll before easeOutExpo formally ends (most motion is early). */
const SETTLE = 700
/* Cap so a hung fonts.ready never leaves the page locked. */
const SETTLE_CAP = 6000

export default new (class Transitions {
  /** First load: splash + content. Later navigations: content only. */
  run(isFirstLoad = false) {
    this.m = MBZ
    this.isFirstLoad = isFirstLoad
    this.contentAt = isFirstLoad ? CONTENT_AT : 0
    this.settled = new Promise((resolve) => (this.settle = resolve))
    setTimeout(this.settle, SETTLE_CAP)
    this.revealed = new Promise((resolve) => (this.revealSplash = resolve))
    if (!isFirstLoad) this.revealSplash()
    this.opening = new Promise((resolve) => (this.openWork = resolve))
    setTimeout(this.openWork, SETTLE_CAP)
    if (!this.m.page.is.home) this.openWork()

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.showFinal()
      return
    }

    this.m.page.is.home ? this.homeIntro() : this.caseIntro()
  }

  /** Instant final state when the visitor has asked for no motion. */
  showFinal = () => {
    const splash = M.G.id('page-splash')
    if (splash) splash.classList.add('is-settled')
    const nav = M.G.class('nav')[0]
    if (nav) {
      nav.classList.add('is-visible', 'is-ready')
      nav.classList.remove('is-intro')
      nav.style.removeProperty('transform')
    }
    this.revealSplash()
    this.openWork()
    this.settle()
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

    const splash = M.G.id('page-splash')
    const phone = window.matchMedia('(max-width: 767px)').matches

    let landed = false
    const land = () => {
      if (landed) return
      landed = true
      if (phone) {
        const work = M.G.qs('.work-splash')
        if (work) work.style.opacity = '1'
      }
      if (splash) splash.classList.add('is-settled')
      this.revealSplash()
    }

    tl.add(
      {
        targets: splash,
        translateY: ['100%', '0%'],
        easing: EASING,
        duration: SPLASH_DURATION,
        update: phone
          ? (anim) => {
              if (anim.currentTime >= CONTENT_AT) land()
            }
          : undefined,
        complete: land,
      },
      0,
    )

    tl.add(
      {
        targets: nav,
        translateY: ['-110%', '0%'],
        easing: EASING,
        duration: DURATION,
      },
      CONTENT_AT,
    )

    return tl
  }

  homeIntro = () => {
    this.whenReady(() => {
      const nav = M.G.class('nav')[0],
        lead = M.G.class('intro__lead')[0],
        titleTxt = M.G.class('txt-up', M.G.class('intro__title')[0]),
        availability = M.G.qsa('.intro-meta .availability, .intro-cv'),
        scrollTxt = M.G.class('link-block')[0],
        at = this.contentAt

      this.introTL = this.reveal(nav)

      splitLines(lead)
      this.introTL.add(
        revealLines(lead, {
          duration: DURATION,
          stagger: 100,
          from: 100,
          opacity: true,
        }),
        at,
      )

      this.introTL.add(
        {
          targets: titleTxt,
          translateY: ['100%', 0],
          easing: EASING,
          duration: DURATION,
          delay: (_, i) => i * 100,
        },
        at,
      )

      this.introTL.add(
        {
          targets: availability,
          opacity: [0, 1],
          translateY: [16, 0],
          easing: EASING,
          duration: DURATION,
        },
        at + STEP,
      )

      this.introTL.add(
        {
          targets: scrollTxt,
          opacity: [0, 1],
          translateY: [16, 0],
          easing: EASING,
          duration: DURATION,
        },
        at + STEP * 2,
      )

      this.introTL.play()
      this.settleAfter(at + STEP * 2)
      setTimeout(this.openWork, at + STEP * 2)
    })
  }

  /** Play the project-page timeline in step with the entrance. */
  caseIntro = () => {
    this.whenReady(() => {
      const at = this.contentAt
      this.introTL = this.reveal(M.G.class('nav')[0])
      this.introTL.play()

      /* Fx also waits on fonts; read the timeline when the delay fires. */
      const start = () => {
        const content = this.m.listeners && this.m.listeners.fx.introTL
        if (content) content.play()
      }
      at ? setTimeout(start, at) : start()

      this.settleAfter(at)
    })
  }
})()
