import anime from 'animejs/lib/anime.es'

import M from '@utils'
import splitLines from '@utils/el/split-lines'

const duration = 1800
const easing = 'easeOutExpo'

class Fx {
  constructor() {
    this.m = MBZ
  }

  init = (scroll) => {
    this.scroll = scroll
    this.scroll.clearTriggers()
    if (!this.m.page.is.home) return

    const run = () => {
      this.work()
      this.about()
      this.testimonials()
      this.footer()
      this.scroll.resize()
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(run)
    } else {
      run()
    }
  }

  play = (el, build, offset) => {
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
      const desc = M.G.class('txt-up', M.G.class('about-item-desc', item)[0])

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
          },
          '-=1600'
        )
      })
    }
  }

  work = () => {
    const header = M.G.class('work-header')[0]
    const heading = M.G.class('txt-up', M.G.class('section-heading', header)[0])
    const subheading = M.G.class('txt-up', M.G.class('section-subheading', header)[0])

    this.play(header, (tl) => {
      tl.add({
        targets: heading,
        translateY: ['101%', 0],
        easing,
        duration,
      })
      tl.add(
        {
          targets: subheading,
          translateY: ['101%', 0],
          easing,
          duration,
        },
        '-=1600'
      )
    })

    const items = M.G.class('work-item')
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const overlay = M.G.class('work-item-overlay', item)[0]
      const title = M.G.class('txt-up', M.G.class('work-item-title', item)[0])
      const desc = M.G.class('txt-up', M.G.class('work-item-description', item)[0])

      this.play(item, (tl) => {
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
      })
    }
  }

  testimonials = () => {
    const heading = M.G.class('txt-up', M.G.class('testimonials-heading')[0])
    const quote = M.G.class('testimonial-quote')[0]
    if (quote) quote.style.textWrap = 'unset'
    const quoteLines = splitLines(quote)
    const author = M.G.class('testimonial-author--fx')[0]
    const controls = M.G.class('testimonials-controls')[0]

    this.play(M.G.id('testimonials'), (tl) => {
      tl.add({
        targets: heading,
        translateY: ['101%', 0],
        easing,
        duration,
      })
      tl.add(
        {
          targets: quoteLines,
          translateY: ['101%', 0],
          easing,
          duration,
          delay: (_, i) => i * 80,
        },
        '-=1600'
      )
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
            targets: ctaLink,
            translateY: ['101%', 0],
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
