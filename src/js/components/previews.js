/**
 * Preview clips on work cards. Hugo always prints the same markup; after
 * mount we decide whether to keep the video, which src to load, and whether
 * playback is hover or in-view.
 *
 * The mp4 src is left off the tag until it is needed so nothing is
 * downloaded on load.
 */

const HOVER = '(hover: hover) and (pointer: fine)'
const REDUCE = '(prefers-reduced-motion: reduce)'
const FADE_MS = 300
const MOBILE_MAX = 768

const saveDataOn = () =>
  Boolean(navigator.connection && navigator.connection.saveData)

export default class Previews {
  init = () => {
    this.teardown()

    this.reduceMQ = window.matchMedia(REDUCE)
    this.hoverMQ = window.matchMedia(HOVER)
    this.initWork()
    this.initCase()
  }

  teardown = () => {
    if (this.nearIo) {
      this.nearIo.disconnect()
      this.nearIo = null
    }
    if (this.viewIo) {
      this.viewIo.disconnect()
      this.viewIo = null
    }
    if (this.caseIo) {
      this.caseIo.disconnect()
      this.caseIo = null
    }
    if (this.ac) {
      this.ac.abort()
      this.ac = null
    }
  }

  initWork = () => {
    const videos = [...document.querySelectorAll('.work-item-preview')]
    if (!videos.length) return

    /* Same HTML from the server for every client. Reduced motion and
       Save-Data drop the <video> here so only the still remains. */
    if (this.reduceMQ.matches || saveDataOn()) {
      for (const video of videos) {
        const pane = video.closest('.work-item-image')
        video.remove()
        if (pane) pane.classList.remove('work-item-image--preview')
      }
      return
    }

    const touch = !this.hoverMQ.matches
    this.ac = new AbortController()
    const { signal } = this.ac

    if (touch) {
      this.viewIo = new IntersectionObserver(this.onView, { threshold: 0.6 })
    } else {
      this.nearIo = new IntersectionObserver(this.onNear, { rootMargin: '200px' })
    }

    for (const video of videos) {
      const card = video.closest('.work-item')
      const link = video.closest('.work-item-link')
      if (!card || !link) continue

      video.addEventListener(
        'playing',
        () => {
          video.classList.add('is-playing')
        },
        { signal }
      )

      if (touch) {
        this.viewIo.observe(card)
      } else {
        link.addEventListener('mouseenter', () => this.play(video), { signal })
        link.addEventListener('focus', () => this.play(video), { signal })
        link.addEventListener('mouseleave', () => this.stop(video), { signal })
        link.addEventListener('blur', () => this.stop(video), { signal })
        this.nearIo.observe(link)
      }
    }
  }

  /*
    The clip at the top of a project page. The browser picks the mobile or
    desktop <source> itself; this only starts and stops it. Reduced motion
    (and Save-Data) keep the poster and hand the visitor the controls.
  */
  initCase = () => {
    const videos = [...document.querySelectorAll('[data-case-media]')]
    if (!videos.length) return

    if (this.reduceMQ.matches || saveDataOn()) {
      for (const video of videos) video.controls = true
      return
    }

    this.caseIo = new IntersectionObserver(this.onCaseView, { threshold: 0.25 })
    for (const video of videos) this.caseIo.observe(video)
  }

  onCaseView = (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) entry.target.play().catch(() => {})
      else entry.target.pause()
    }
  }

  onNear = (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      const video = entry.target.querySelector('.work-item-preview')
      if (video) this.load(video)
    }
  }

  onView = (entries) => {
    for (const entry of entries) {
      const video = entry.target.querySelector('.work-item-preview')
      if (!video) continue
      if (entry.intersectionRatio >= 0.6) this.play(video)
      else this.pause(video)
    }
  }

  src = (video) => {
    if (window.innerWidth <= MOBILE_MAX && video.dataset.previewMobile) {
      return video.dataset.previewMobile
    }
    return video.dataset.previewSrc
  }

  load = (video) => {
    if (video.getAttribute('src')) return
    video.src = this.src(video)
    video.load()
  }

  play = (video) => {
    if (this.reduceMQ.matches || saveDataOn()) return
    if (video._fadeTimer) {
      clearTimeout(video._fadeTimer)
      video._fadeTimer = 0
    }
    this.load(video)
    video.play().catch(() => {})
  }

  pause = (video) => {
    video.classList.remove('is-playing')
    if (video._fadeTimer) clearTimeout(video._fadeTimer)
    video._fadeTimer = setTimeout(() => {
      video.pause()
      video._fadeTimer = 0
    }, FADE_MS)
  }

  stop = (video) => {
    video.classList.remove('is-playing')
    if (video._fadeTimer) clearTimeout(video._fadeTimer)
    video._fadeTimer = setTimeout(() => {
      video.pause()
      try {
        video.currentTime = 0
      } catch (err) {
        /* currentTime throws if the media is not ready */
      }
      video._fadeTimer = 0
    }, FADE_MS)
  }
}
