import anime from 'animejs/lib/anime.es'

import M from '@utils'
import Transitions from './transitions'
import splitLines from '@utils/el/split-lines'

const duration = 1800
const easing = 'easeOutExpo'
/* Matches the homepage hero so both entrances move at the same speed. */
const INTRO_DURATION = 2000
/* Gap between one project-page row joining the entrance and the next. The
   homepage hero steps by the same amount, so both entrances share a pulse. */
const ROW_STEP = 140
/*
  Revealed on its own, a row reads as the rule wiping in with the copy
  following a moment behind. Rows that arrive as part of the entrance skip
  that gap and move on a single beat instead: holding the copy back left a
  hole in the middle of the entrance while the labels had already landed,
  which is what put the whole thing out of rhythm.
*/
const COPY_GAP = 400

class Fx {
  constructor() {
    this.m = MBZ
  }

  init = (scroll) => {
    this.scroll = scroll
    this.scroll.clearTriggers()

    const run = () => {
      if (this.m.page.is.home) {
        this.work()
        this.about()
        this.experience()
        this.testimonials()
        this.footer()
      } else {
        this.case()
      }
      this.scroll.resize()
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(run)
    } else {
      run()
    }
  }

  play = (el, build, offset) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const tl = anime.timeline({ autoplay: false })
    build(tl)
    this.scroll.when(el, () => tl.play(), offset)
  }

  about = () => {
    const heading = M.G.class('txt-up', M.G.class('about-heading')[0])
    const subheading = M.G.class('about-subheading')[0]
    const leadTxt = splitLines(subheading)

    this.play(M.G.class('about-intro')[0], (tl) => {
      tl.add({
        targets: heading,
        translateY: ['101%', 0],
        easing,
        duration,
      })
      tl.add(
        {
          targets: leadTxt,
          translateY: ['101%', 0],
          easing,
          duration,
          delay: (_, i) => i * 100,
        },
        '-=1600'
      )
    })

    const items = M.G.class('about-item')
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const line = M.G.class('about-item-line', item)
      const number = M.G.class('txt-up', M.G.class('about-item-number', item)[0])
      const title = M.G.class('txt-up', M.G.class('about-item-title', item)[0])
      const desc = splitLines(M.G.class('about-item-desc', item)[0])

      this.play(item, (tl) => {
        tl.add({
          targets: line,
          translateX: ['-100%', 0],
          duration: 2000,
          easing,
        })
        tl.add(
          {
            targets: [number, title],
            translateY: ['101%', 0],
            duration: 2000,
            easing,
          },
          '-=2000'
        )
        tl.add(
          {
            targets: desc,
            translateY: ['101%', 0],
            duration: 2000,
            easing,
            delay: (_, i) => i * 100,
          },
          '-=1600'
        )
      })
    }

    const stack = M.G.class('about-stack')[0]
    if (stack) {
      const tags = [...M.G.class('tag', stack)]
      this.play(stack, (tl) => {
        tl.add({
          targets: tags,
          translateY: [16, 0],
          opacity: [0, 1],
          easing,
          duration,
          delay: (_, i) => i * 80,
        })
      })
    }
  }

  /* Same beat as an About row: the rule wipes in and the copy clips up. */
  experience = () => {
    const section = M.G.id('experience')
    if (!section) return

    const heading = M.G.class('experience-heading', section)[0]
    this.play(heading, (tl) => {
      tl.add({
        targets: M.G.class('txt-up', heading),
        translateY: ['101%', 0],
        easing,
        duration,
      })
    })

    const items = M.G.class('experience-item', section)
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const line = M.G.class('experience-item-line', item)
      const desc = M.G.class('txt-up', M.G.class('experience-item-desc', item)[0])
      const copy = [...M.G.class('txt-up', item)].filter((el) => el !== desc[0])

      this.play(item, (tl) => {
        tl.add({
          targets: line,
          translateX: ['-100%', 0],
          duration: 2000,
          easing,
        })
        tl.add(
          {
            targets: copy,
            translateY: ['101%', 0],
            duration: 2000,
            easing,
          },
          '-=2000'
        )
        tl.add(
          {
            targets: desc,
            translateY: ['101%', 0],
            duration: 2000,
            easing,
          },
          '-=1600'
        )
      })
    }
  }

  work = () => {
    const splash = M.G.qs('.work-splash')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    /*
      The sheet covers the section and slides up by its own height. It stays
      in the page, parked above the section. On a phone it starts with the
      hero type and clears as the last intro line lands, so the two read as
      one sequence. The visible edge only opens at the end of the slide,
      which is why this is shorter than the desktop one.
    */
    if (reduce) return

    if (splash) {
      const phone = window.matchMedia('(max-width: 767px)').matches
      const play = () => {
        splash.style.opacity = '1'
        anime({
          targets: splash,
          translateY: [0, '-100%'],
          easing,
          duration: 1500,
          complete: () => {
            splash.style.willChange = 'auto'
            if (this.m.listeners) this.m.listeners.updateNavTheme()
          },
        })
      }
      if (phone && Transitions.opening) Transitions.opening.then(play)
      else play()
    }

    const header = M.G.class('work-header')[0]
    const heading = M.G.class('txt-up', M.G.class('section-heading', header)[0])
    const phone = window.matchMedia('(max-width: 767px)').matches

    const onScreen = (el) => {
      const r = el.getBoundingClientRect()
      return r.bottom > 0 && r.top < window.innerHeight
    }

    /* The heading starts translated out of its clip. A scroll trigger at 70%
       of the screen never fires for it on a short phone, where it is already
       visible at the bottom, so the sheet lifts onto an empty black block. */
    const revealHeading = () => {
      const build = (tl) => {
        tl.add({
          targets: heading,
          translateY: ['101%', 0],
          easing,
          duration,
        })
      }
      if (phone && onScreen(header)) {
        const tl = anime.timeline({ autoplay: true })
        build(tl)
      } else {
        this.play(header, build)
      }
    }

    const revealItem = (item) => {
      const overlay = M.G.class('work-item-overlay', item)[0]
      const title = M.G.class('txt-up', M.G.class('work-item-title', item)[0])
      const desc = M.G.class('txt-up', M.G.class('work-item-description', item)[0])
      const build = (tl) => {
        tl.add({
          targets: overlay,
          translateY: ['0%', '-100%'],
          easing,
          duration: 1500,
        })
        tl.add(
          {
            targets: [title, desc],
            translateY: ['101%', 0],
            easing,
            duration,
            delay: anime.stagger(80),
          },
          '-=1200'
        )
      }
      if (phone && onScreen(item)) {
        const tl = anime.timeline({ autoplay: true })
        build(tl)
      } else {
        this.play(item, build)
      }
    }

    const revealCopy = () => {
      revealHeading()
      const items = M.G.class('work-item')
      for (let i = 0; i < items.length; i++) revealItem(items[i])
    }

    if (phone && Transitions.opening) Transitions.opening.then(revealCopy)
    else revealCopy()
  }

  /**
   * Project pages, using the same vocabulary as the homepage: text clips up
   * out of a hidden wrapper and rules wipe in from the left.
   *
   * Rows already on screen at load join one intro timeline so they cascade
   * out of the title instead of being revealed before it. Everything further
   * down waits for its own scroll trigger. The intro timeline is left for
   * Transitions to play once the splash has revealed the page.
   */
  case = () => {
    this.introTL = null

    const root = M.G.id('case')
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const intro = anime.timeline({ autoplay: false })
    const eyebrow = M.G.class('case-eyebrow', root)[0]
    const title = M.G.class('case-title', root)[0]
    const subtitle = M.G.class('case-subtitle', root)[0]

    /*
      Like the homepage hero, the whole first screen arrives together rather
      than one piece at a time: eyebrow and title start on the same beat, and
      each following row joins a step behind.
    */
    if (eyebrow) {
      intro.add(
        {
          targets: M.G.class('txt-up', eyebrow),
          translateY: ['101%', 0],
          easing,
          duration: INTRO_DURATION,
        },
        0
      )
    }

    if (title) {
      intro.add(
        {
          targets: splitLines(title),
          translateY: ['101%', 0],
          easing,
          duration: INTRO_DURATION,
          delay: (_, i) => i * 100,
        },
        0
      )
    }

    if (subtitle) {
      intro.add(
        {
          targets: M.G.class('txt-up', subtitle),
          translateY: ['101%', 0],
          easing,
          duration: INTRO_DURATION,
        },
        0
      )
    }

    const onScreen = (el) =>
      el.getBoundingClientRect().top < window.innerHeight * 0.85

    let cascade = ROW_STEP
    const queue = (el, build, offset) => {
      if (onScreen(el)) {
        build(intro, cascade, 0)
        cascade += ROW_STEP
      } else {
        this.play(el, (tl) => build(tl, 0), offset)
      }
    }

    /* The media joins the cascade like a row: it fades up a step behind the
       title, the same move as the stack pills. */
    const media = M.G.class('case-media', root)[0]
    if (media) {
      queue(media, (tl, at = 0) => {
        tl.add(
          {
            targets: media,
            opacity: [0, 1],
            translateY: [16, 0],
            duration: INTRO_DURATION,
            easing,
          },
          at
        )
      })
    }

    const blocks = M.G.class('case-block', root)
    for (let i = 0; i < blocks.length; i++) {
      queue(blocks[i], this.caseRow(blocks[i]))
    }

    /* Sits at the very end of the page, so reveal it as soon as it peeks in. */
    const nav = M.G.id('case-nav')
    if (nav) queue(nav, this.caseRow(nav), 0.95)

    this.introTL = intro
  }

  /**
   * One detail row, on the same beat as an About item on the homepage: the
   * rule wipes in under the label, and the copy follows a moment later.
   *
   * Offsets are absolute rather than relative because several rows share the
   * intro timeline, and anime resolves a relative offset against the end of
   * the whole timeline — which would push each row further out of step.
   */
  caseRow = (row) => (tl, at = 0, copyGap = COPY_GAP) => {
    const line = M.G.class('case-block-line', row)
    const labelEl = M.G.class('case-block-title', row)[0]
    const label = labelEl ? M.G.class('txt-up', labelEl) : []
    const body = M.G.qs('.case-role, .case-built', row)
    const bodyLines = body ? splitLines(body) : []
    const links = M.G.qsa('.case-link .txt-up, .case-nav-link .txt-up', row)
    const tags = [...M.G.class('tag', row)]
    const copyAt = at + copyGap

    tl.add(
      { targets: line, translateX: ['-100%', 0], duration: 2000, easing },
      at
    )

    if (label.length) {
      tl.add(
        { targets: label, translateY: ['101%', 0], duration: 2000, easing },
        at
      )
    }

    if (bodyLines.length) {
      tl.add(
        {
          targets: bodyLines,
          translateY: ['101%', 0],
          duration: 2000,
          easing,
          delay: (_, i) => i * 100,
        },
        copyAt
      )
    }

    if (links.length) {
      tl.add(
        {
          targets: links,
          translateY: ['101%', 0],
          duration: 2000,
          easing,
          delay: anime.stagger(100),
        },
        copyAt
      )
    }

    if (tags.length) {
      tl.add(
        {
          targets: tags,
          opacity: [0, 1],
          translateY: [16, 0],
          duration: 2000,
          easing,
          delay: (_, i) => i * 80,
        },
        copyAt
      )
    }
  }

  testimonials = () => {
    const heading = M.G.class('txt-up', M.G.class('testimonials-heading')[0])

    /*
      Every slide is split, not only the one on screen: .testimonial-quote
      starts hidden and it is splitLines' .is-split class that brings it back,
      so an unsplit quote stays invisible once the slider reaches it.
    */
    const lines = [...M.G.class('testimonial-quote')].map((quote) => {
      quote.style.textWrap = 'unset'
      return splitLines(quote)
    })
    const [active = [], ...queued] = lines
    const waiting = queued.flat()

    const author = M.G.class('testimonial-author--fx')[0]
    const controls = M.G.class('testimonials-controls')[0]
    /* Absolute, so revealing the waiting slides cannot shift what follows:
       anime resolves a relative offset against the end of the whole
       timeline, which the extra lines would push out. */
    const quoteAt = duration - 1600

    this.play(M.G.id('testimonials'), (tl) => {
      tl.add({
        targets: heading,
        translateY: ['101%', 0],
        easing,
        duration,
      })
      tl.add(
        {
          targets: active,
          translateY: ['101%', 0],
          easing,
          duration,
          delay: (_, i) => i * 80,
        },
        quoteAt
      )
      /* The slides queued off to the right only need to be in place by the
         time they are asked for; the track's CSS transition moves them. */
      if (waiting.length) {
        tl.add(
          {
            targets: waiting,
            translateY: ['101%', 0],
            easing,
            duration,
          },
          quoteAt
        )
      }
      tl.add(
        {
          targets: [author, controls].filter(Boolean),
          translateY: [16, 0],
          opacity: [0, 1],
          easing,
          duration,
        },
        '-=1500'
      )
    })
  }

  skills = () => {
    const title = M.G.id('skills-title')
    const titleTxt = M.G.class('txt-up', title)
    const desc = M.G.class('skills__desc')[0]
    const items = M.G.class('skills__item')

    this.play(M.G.class('skills__header')[0], (tl) => {
      tl.add({ targets: titleTxt, translateY: ['100%', 0], easing, duration })
      tl.add(
        {
          targets: desc,
          translateY: ['20px', 0],
          opacity: [0, 1],
          easing,
          duration,
        },
        '-=1500'
      )
    })

    for (let i = 0; i < items.length; i++) {
      this.play(items[i], (tl) => {
        tl.add({ targets: items[i], opacity: [0, 1], easing, duration })
      })
    }
  }

  contact = () => {
    const blocks = M.G.class('contact__block')
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i]
      const title = M.G.class('contact__title-text', block)
      const label = M.G.class('contact__label', block)

      this.play(
        block,
        (tl) => {
          tl.add({
            targets: label,
            translateY: ['15px', 0],
            opacity: [0, 1],
            easing,
            duration,
          })
          tl.add(
            {
              targets: title,
              translateY: ['100%', 0],
              easing,
              duration,
              delay: (_, i) => (i === 0 ? 0 : 100),
            },
            '-=1500'
          )
        },
        0.9
      )
    }
  }

  footer = () => {
    const heading = M.G.class('footer-cta-heading')[0]
    const headingLines = splitLines(heading)
    const availability = M.G.class('footer-availability')[0]
    const ctaLink = M.G.class('txt-up', M.G.class('footer-cta-link')[0])
    const divider = M.G.class('footer-divider-line')[0]
    const cols = M.G.class('footer-columns')[0]
    const colTxt = cols ? M.G.class('txt-up', cols) : []
    const wordmark = M.G.class('footer-wordmark')[0]

    this.play(
      M.G.id('footer'),
      (tl) => {
        tl.add({
          targets: headingLines,
          translateY: ['101%', 0],
          easing,
          duration,
          delay: (_, i) => i * 100,
        })
        tl.add(
          {
            targets: [availability, ctaLink].filter(Boolean),
            translateY: ['101%', 0],
            opacity: [0, 1],
            easing,
            duration,
          },
          '-=1800'
        )
        tl.add(
          {
            targets: divider,
            translateX: ['-100%', 0],
            duration: 2000,
            easing,
          },
          '-=1600'
        )
        tl.add(
          {
            targets: colTxt,
            translateY: ['101%', 0],
            easing,
            duration,
            delay: anime.stagger(50),
          },
          '-=1800'
        )
        tl.add(
          {
            targets: wordmark,
            translateY: ['40%', 0],
            opacity: [0, 1],
            easing,
            duration: 2000,
          },
          '-=1600'
        )
      },
      0.9
    )
  }
}

export default Fx
