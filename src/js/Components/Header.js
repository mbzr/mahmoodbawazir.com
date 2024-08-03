import gsap from 'gsap'

import M from '@/utils'

export default new (class Header {
  constructor() {
    this.nav = M.G.id('nav')
    this.navItems = M.G.class('nav__item')
    this.navItemsAnchors = M.G.class('nav__item__anchorContainer')
    this.navItemsL = this.navItems.length
    this.socialItems = M.G.class('nav__social__item')
    this.navUp = M.G.class('nav-up')
    this.menuOpen = false
    this.menuAnimating = false
    this.ease = 'text-up'

    gsap.set(this.navUp, {
      yPercent: 100,
    })

    this.tl = gsap.timeline({ paused: true })
    this.tl
      .to(this.nav, {
        duration: 0.5,
        autoAlpha: 1,
        display: 'flex',
      })
      .to(
        this.navUp,
        {
          yPercent: 0,
          duration: 1.5,
          ease: this.ease,
        },
        '-=.3'
      )

    M.BM(this, ['init', 'toggleMenu', 'closeMenu'])
  }

  init() {
    const hamburger = M.G.id('hamburger')
    M.L(hamburger, 'a', 'click', this.toggleMenu)
  }

  closeMenu() {
    if (this.menuOpen) {
      this.toggleMenu()
    }
  }

  toggleMenu() {
    this.m = MBZ

    if (this.menuOpen) {
      this.menuOpen = false

      this.tl.timeScale(2).reverse()
      this.m.html.classList.remove('menu-open')
    } else {
      this.menuOpen = true

      this.tl.timeScale(1).play()
      this.m.html.classList.add('menu-open')
    }
  }

  updateMenu(data) {
    const activeClass = 'nav__item--active'
    const item = M.G.class('nav__item')
    const itemL = item.length
    const currentItem = M.G.class(`${activeClass}`)[0]
    const nextPath = data.next.url.path
    const nextItem = M.G.qs(`.nav__item [href="${nextPath}"]`)

    if (currentItem) currentItem.classList.remove(activeClass)

    if (!nextItem) {
      for (let i = 0; i < itemL; i++) {
        item[i].classList.remove(activeClass)
      }
      return
    }
    nextItem.parentNode.classList.add(activeClass)
  }
})()
