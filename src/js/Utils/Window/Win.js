export default {
  get w() {
      return innerWidth
  },
  get h() {
      return innerHeight
  },
  get path() {
      return location.pathname
  },
  get hostname() {
      return location.hostname
  },
  get href() {
      return location.href
  }
}