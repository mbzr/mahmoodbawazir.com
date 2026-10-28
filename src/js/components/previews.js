/**
 * Work-card hover clips. The mp4 src is left off the tag until first hover
 * (or until the card is near the viewport) so nothing is downloaded on load.
 */

const HOVER = '(hover: hover) and (pointer: fine)'
const REDUCE = '(prefers-reduced-motion: reduce)'

export default class Previews {
  init = () => {
    if (this.io) {
      this.io.disconnect()
      this.io = null
    }

    this.reduceMQ = window.matchMedia(REDUCE)
    this.hoverMQ = window.matchMedia(HOVER)
    this.videos = [...document.querySelectorAll('[data-preview-src]')]
    if (!this.videos.length) return
    if (this.reduceMQ.matches || !this.hoverMQ.matches) return

    this.io = new IntersectionObserver(this.onNear, { rootMargin: '200px' })

    for (const video of this.videos) {
      const link = video.closest('.work-item-link')
      if (!link) continue
      link.addEventListener('mouseenter', () => this.play(video))
      link.addEventListener('focus', () => this.play(video))
      link.addEventListener('mouseleave', () => this.stop(video))
      link.addEventListener('blur', () => this.stop(video))
      video.addEventListener('playing', () => video.classList.add('is-playing'))
      this.io.observe(link)
    }
  }

  onNear = (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      const video = entry.target.querySelector('[data-preview-src]')
      if (video) this.load(video)
    }
  }

  load = (video) => {
    if (video.getAttribute('src')) return
    video.src = video.dataset.previewSrc
    video.load()
  }

  play = (video) => {
    if (this.reduceMQ.matches || !this.hoverMQ.matches) return
    this.load(video)
    const play = video.play()
    if (play && play.catch) play.catch(() => {})
  }

  stop = (video) => {
    video.classList.remove('is-playing')
    video.pause()
    try {
      video.currentTime = 0
    } catch (err) {
      /* currentTime throws if the media is not ready */
    }
  }
}
