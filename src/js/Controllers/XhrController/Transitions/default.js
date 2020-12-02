import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LocomotiveScroll from 'locomotive-scroll'
import ResizeObserver from 'resize-observer-polyfill'

import Header from '../../../Components/Header'
import Cursor from '../../../Components/Cursor'
import M from '../../../../Utils'
import Button from '../../../Components/Button'

let locoScroll
let resizeObserver
const locoScrollClass = '.page-scroller'

gsap.registerPlugin(ScrollTrigger)

ScrollTrigger.config({ limitCallbacks: true })
ScrollTrigger.defaults({ scroller: locoScrollClass, start: 'top 90%' })

const initLocoScroll = (container) => {
  const locoScrollEl = container.querySelector(locoScrollClass)
  locoScroll = new LocomotiveScroll({
    el: locoScrollEl,
    smooth: true,
    lerp: 0.1
  })

  locoScroll.on('scroll', ScrollTrigger.update)

  // observer for when content height changes
  resizeObserver = new ResizeObserver(
    (_) => (locoScroll.update(), ScrollTrigger.update())
  )

  locoScroll.scrollTo(0)

  // tell ScrollTrigger to use these proxy methods for the ".page-scroller" element since Locomotive Scroll is hijacking things
  ScrollTrigger.scrollerProxy(locoScrollEl, {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, 0, 0)
        : locoScroll.scroll.instance.scroll.y
    }, // we don't have to define a scrollLeft because we're only scrolling vertically.
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight
      }
    },
    // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
    pinType: locoScrollEl.style.transform ? 'transform' : 'fixed'
  })

  // each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll.
  ScrollTrigger.addEventListener('refresh', () => locoScroll.update())

  // after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
  ScrollTrigger.refresh()
}

const DefaultTransition = (() => ({
  name: 'default-transition',
  // sync: true,
  once: ({ next }) => {
    // init on page load
    Cursor.init()
    setTimeout(() => {
      initLocoScroll(next.container)
      Button.init()
    }, 200)
  },
  leave({ current }) {
    M.WTP.on()
    Header.closeMenu()
    Cursor.destroy()
    resizeObserver.unobserve(document.body)

    setTimeout(function () {
      document.querySelector('#page-splash').classList.add('active')
    }, 50)

    return gsap.to(current.container, {
      opacity: 0
    })
  },
  enter({ next }) {
    setTimeout(() => {
      Cursor.init()
      locoScroll.destroy()
      initLocoScroll(next.container)

      document.querySelector('#page-splash').classList.remove('active')
    }, 1000)

    setTimeout(() => {
      locoScroll.update()
      resizeObserver.observe(document.body)
      Button.init()
      M.WTP.off()
    }, 1050)

    return gsap.from(next.container, {
      opacity: 0,
      delay: 0.5
    })
  }
}))()

export default DefaultTransition
