import anime from 'animejs/lib/anime.es'

import M from '@utils'

class Fx {
  constructor() {
    this.m = MBZ
    this.trigger = []
    this.sensibility = []
    this.tl = []
    this.isInViewport = []
    this.limit = []
  }

  init = () => {
    const duration = 1800,
      easing = 'easeOutExpo',
      tlOpts = { autoplay: false }

    if (this.m.page.is.home) {
      let idx = 0

      //About
      const aboutTitle = M.G.id('about-title'),
        aboutDescs = M.G.class('about__desc')
      this.trigger[idx] = M.G.id('about')
      this.tl[idx] = anime.timeline(tlOpts)
      this.tl[idx].add({
        targets: aboutTitle,
        translateY: ['101%', 0],
        easing,
        duration,
      })
      this.tl[idx].add(
        {
          targets: aboutDescs,
          translateY: [15, 0],
          opacity: [0, 1],
          easing,
          duration,
          delay: anime.stagger(150),
        },
        '-=1500'
      )
      idx++

      //Work
      const workTitle = M.G.id('work-title'),
        workTitleTxt = M.G.class('txt-up', workTitle),
        workDesc = M.G.class('work__desc')[0],
        workItems = M.G.class('work__item')
      this.trigger[idx] = M.G.class('work__header')[0]
      this.tl[idx] = anime.timeline(tlOpts)
      this.tl[idx].add({
        targets: workTitleTxt,
        translateY: ['100%', 0],
        easing,
        duration,
      })
      this.tl[idx].add(
        {
          targets: workDesc,
          translateY: ['20px', 0],
          opacity: [0, 1],
          easing,
          duration,
        },
        '-=1500'
      )
      idx++

      for (let i = 0; i < workItems.length; i++) {
        const item = workItems[i],
          line = M.G.class('work__item__line', item),
          name = M.G.class('work__item__name', item),
          year = M.G.class('work__item__year', item)

        this.trigger[idx] = item
        this.tl[idx] = anime.timeline(tlOpts)
        this.tl[idx].add({
          targets: line,
          translateX: ['-100%', 0],
          transformOrigin: [0, 0],
          duration: 2000,
          easing,
        })
        this.tl[idx].add(
          {
            targets: name,
            translateY: ['100%', 0],
            duration: 2000,
            easing,
          },
          '-=2000'
        )
        this.tl[idx].add(
          {
            targets: year,
            translateY: ['100%', 0],
            duration: 2000,
            easing,
          },
          '-=1600'
        )
        idx++
      }

      //Skills
      const skillsTitle = M.G.id('skills-title'),
        skillsTitleTxt = M.G.class('txt-up', skillsTitle),
        skillsDesc = M.G.class('skills__desc')[0],
        skillsItems = M.G.class('skills__item')

      this.trigger[idx] = M.G.class('skills__header')[0]
      this.tl[idx] = anime.timeline(tlOpts)
      this.tl[idx].add({
        targets: skillsTitleTxt,
        translateY: ['100%', 0],
        easing,
        duration,
      })
      this.tl[idx].add(
        {
          targets: skillsDesc,
          translateY: ['20px', 0],
          opacity: [0, 1],
          easing,
          duration,
        },
        '-=1500'
      )
      idx++

      for (let i = 0; i < skillsItems.length; i++) {
        this.trigger[idx] = skillsItems[i]
        this.tl[idx] = anime.timeline(tlOpts)
        this.tl[idx].add({
          targets: this.trigger[idx],
          opacity: [0, 1],
          easing,
          duration,
        })
        idx++
      }

      //Contact
      const contactBlocks = M.G.class('contact__block')
      for (let i = 0; i < contactBlocks.length; i++) {
        this.trigger[idx] = contactBlocks[i]
        const contactTitleText = M.G.class(
            'contact__title-text',
            this.trigger[idx]
          ),
          contactLabel = M.G.class('contact__label', this.trigger[idx])
        this.sensibility[idx] = 0.9
        this.tl[idx] = anime.timeline(tlOpts)
        this.tl[idx].add({
          targets: contactLabel,
          translateY: ['15px', 0],
          opacity: [0, 1],
          easing,
          duration,
        })
        this.tl[idx].add(
          {
            targets: contactTitleText,
            translateY: ['100%', 0],
            easing,
            duration,
            delay: (_, i) => (i === 0 ? 0 : 100),
          },
          '-=1500'
        )
        idx++
      }

      //Footer
      const footerItems = M.G.class('footer__anchor'),
        footerLink = M.G.class('footer__link')[0],
        footerCopy = M.G.class('footer__copy')[0]
      this.trigger[idx] = M.G.id('footer')
      this.tl[idx] = anime.timeline(tlOpts)
      this.sensibility[idx] = 0.9

      this.tl[idx].add({
        targets: footerItems,
        translateY: ['100%', 0],
        duration,
        easing,
        delay: anime.stagger(100),
      })
      this.tl[idx].add(
        {
          targets: [footerLink, footerCopy].filter(Boolean),
          translateY: ['100%', 0],
          duration,
          easing,
          delay: anime.stagger(150),
        },
        '-=1500'
      )
      idx++

      this.triggerL = idx
      for (var u = 0; u < this.triggerL; u++) {
        this.isInViewport[u] = false
      }
    }
  }

  resize = () => {
    let sy = this.m.s.y,
      wh = this.m.win.h

    for (let e = 0; e < this.triggerL; e++) {
      0 !== this.trigger[e] &&
        (this.limit[e] =
          this.trigger[e].getBoundingClientRect().top +
          sy -
          wh * (this.sensibility[e] || 0.7))
    }
  }

  run = () => {
    let sy = this.m.s.y

    for (let i = 0; i < this.triggerL; i++) {
      sy > this.limit[i] &&
        !this.isInViewport[i] &&
        ((this.isInViewport[i] = true), this.tl[i].play())
    }
  }
}

export default Fx
