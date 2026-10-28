/**
 * Preview clips on work cards. The mp4 src is left off the tag until it is
 * needed so nothing is downloaded on load.
 */

const HOVER = '(hover: hover) and (pointer: fine)'
const REDUCE = '(prefers-reduced-motion: reduce)'
const FADE_MS = 350

export default class Previews {
  init = () => {
    if (this.io) {
      this.io.disconnect()
      this.io = null
    }

    this.reduceMQ = window.matchMedia(REDUCE)
    this.hoverMQ = window.matchMedia(HOVER)
    this.initWork()
  }

  initWork = () => {
    const videos = [...document.querySelectorAll('.work-item-preview')]
    if (!videos.length) return
    if (this.reduceMQ.matches || !this.hoverMQ.matches) return

    this.io = new IntersectionObserver(this.onNear, { rootMargin: '200px' })

    for (const video of videos) {
      const link = video.closest('.work-item-link')
      if (!link) continue
      link.addEventListener('mouseenter', () => this.play(video))
      link.addEventListener('focus', () => this.play(video))
      link.addEventListener('mouseleave', () => this.stop(video))
      link.addEventListener('blur', () => this.stop(video))
      video.addEventListener('playing', () => {
        video.classList.add('is-playing')
      })
      this.io.observe(link)
    }
  }

  onNear = (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      const video = entry.target.querySelector('.work-item-preview')
      if (video) this.load(video)
    }
  }

  load = (video) => {
    if (video.getAttribute('src')) return
    video.src = video.dataset.previewSrc
    video.load()
  }

  play = (video) => {
    if (this.reduceMQ.matches) return
    if (video._fadeTimer) {
      clearTimeout(video._fadeTimer)
      video._fadeTimer = 0
    }
    this.load(video)
    const play = video.play()
    if (play && play.catch) play.catch(() => {})
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
