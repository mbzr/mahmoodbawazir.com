import anime from 'animejs/lib/anime.es'

import M from 'utils'

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
      //About
      const aboutTitle = M.G.id('about-title'),
        aboutDescs = M.G.class('about__desc')
      this.trigger[0] = M.G.id('about')
      this.tl[0] = anime.timeline(tlOpts)
      this.tl[0].add({
        targets: aboutTitle,
        translateY: ['101%', 0],
        easing,
        duration,
      })
      this.tl[0].add(
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

      //Work
      const workTitle = M.G.id('work-title'),
        workTitleTxt = M.G.class('txt-up', workTitle),
        workDesc = M.G.class('work__desc')[0]
      this.trigger[1] = M.G.class('work__header')[0]
      this.tl[1] = anime.timeline(tlOpts)
      this.tl[1].add({
        targets: workTitleTxt,
        translateY: ['100%', 0],
        easing,
        duration,
      })
      this.tl[1].add(
        {
          targets: workDesc,
          translateY: ['20px', 0],
          opacity: [0, 1],
          easing,
          duration,
        },
        '-=1500'
      )

      for (let i = 0; i < 5; i++) {
        this.trigger[2 + i] = M.G.class('work__item')[i]
      }

      for (let j = 0; j < 5; j++) {
        let index = 2 + j,
          line = M.G.class('work__item__line', this.trigger[index]),
          name = M.G.class('work__item__name', this.trigger[index]),
          year = M.G.class('work__item__year', this.trigger[index])

        this.tl[index] = anime.timeline(tlOpts)
        this.tl[index].add({
          targets: line,
          translateX: ['-100%', 0],
          transformOrigin: [0, 0],
          duration: 2000,
          easing,
        })
        this.tl[index].add(
          {
            targets: name,
            translateY: ['100%', 0],
            duration: 2000,
            easing,
          },
          '-=2000'
        )
        this.tl[index].add(
          {
            targets: year,
            translateY: ['100%', 0],
            duration: 2000,
            easing,
          },
          '-=1600'
        )
      }

      //Skills
      const skillsTitle = M.G.id('skills-title'),
        skillsTitleTxt = M.G.class('txt-up', skillsTitle),
        skillsDesc = M.G.class('skills__desc')[0]

      this.trigger[7] = M.G.class('skills__header')[0]
      this.tl[7] = anime.timeline(tlOpts)
      this.tl[7].add({
        targets: skillsTitleTxt,
        translateY: ['100%', 0],
        easing,
        duration,
      })
      this.tl[7].add(
        {
          targets: skillsDesc,
          translateY: ['20px', 0],
          opacity: [0, 1],
          easing,
          duration,
        },
        '-=1500'
      )

      for (let l = 0; l < 5; l++) {
        this.trigger[8 + l] = M.G.class('skills__item')[l]
      }

      for (let m = 0; m < 5; m++) {
        let index = 8 + m
        this.tl[index] = anime.timeline(tlOpts)
        this.tl[index].add({
          targets: this.trigger[index],
          opacity: [0, 1],
          easing,
          duration,
        })
      }

      //Contact
      for (let k = 0; k < 2; k++) {
        let index = 13 + k
        this.trigger[index] = M.G.class('contact__block')[k]
        let contactTitleText = M.G.class(
          'contact__title-text',
          this.trigger[index]
        )
        let contactLabel = M.G.class('contact__label', this.trigger[index])
        this.sensibility[index] = 0.9
        this.tl[index] = anime.timeline(tlOpts)
        this.tl[index].add({
          targets: contactLabel,
          translateY: ['15px', 0],
          opacity: [0, 1],
          easing,
          duration,
        })
        this.tl[index].add(
          {
            targets: contactTitleText,
            translateY: ['100%', 0],
            easing,
            duration,
            delay: (_, i) => (i === 0 ? 0 : 100),
          },
          '-=1500'
        )
      }

      //Footer
      const footerItems = M.G.class('footer__anchor'),
        footerLink = M.G.class('footer__link')[0],
        footerCopy = M.G.class('footer__copy')[0]
      this.trigger[15] = M.G.id('footer')
      this.tl[15] = anime.timeline(tlOpts)
      this.sensibility[15] = 0.9

      this.tl[15].add({
        targets: footerItems,
        translateY: ['100%', 0],
        duration,
        easing,
        delay: anime.stagger(100),
      })
      this.tl[15].add(
        {
          targets: [footerLink, footerCopy],
          translateY: ['100%', 0],
          duration,
          easing,
          delay: anime.stagger(150),
        },
        '-=1500'
      )
      //set triggers
      this.triggerL = this.trigger.length
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
