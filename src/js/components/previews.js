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
  }

  teardown = () => {
    clearTimeout(this.queueTimer)
    if (this.viewIo) {
      this.viewIo.disconnect()
      this.viewIo = null
    }
    if (this.ac) {
      this.ac.abort()
      this.ac = null
    }
  }

  initWork = () => {
    const videos = [...document.querySelectorAll('.work-item-preview')]
    if (!videos.length) return

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
        { signal },
      )

      if (touch) {
        this.viewIo.observe(card)
      } else {
        link.addEventListener('mouseenter', () => this.play(video), { signal })
        link.addEventListener('focus', () => this.play(video), { signal })
        link.addEventListener('mouseleave', () => this.stop(video), { signal })
        link.addEventListener('blur', () => this.stop(video), { signal })
      }
    }
  }

  onView = (entries) => {
    for (const entry of entries) {
      const video = entry.target.querySelector('.work-item-preview')
      if (!video) continue
      if (entry.intersectionRatio >= 0.6) this.queue(video)
      else {
        if (this.queued === video) this.queued = null
        this.pause(video)
      }
    }
  }

  queue = (video) => {
    this.queued = video
    clearTimeout(this.queueTimer)
    this.queueTimer = setTimeout(() => {
      if (this.queued === video) this.play(video)
    }, 200)
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
      } catch {
        /* currentTime throws if the media is not ready */
      }
      video._fadeTimer = 0
    }, FADE_MS)
  }
}
