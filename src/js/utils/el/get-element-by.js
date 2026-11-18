/*

──────────────────────────────────────────
──────────────────────────────────────────
GET ELEMENT BY
──────────────────────────────────────────
──────────────────────────────────────────

const content = M.G.id('content')
const btn = M.G.class('btn')
const span = M.G.tag('span')

CHILD OF ELEMENT
────────────────

const elements = M.G.class('elementClassName', parentEl)

*/

export default {
  p: function (p) {
    return p ? p : document
  },

  id: function (el, p) {
    return this.p(p).getElementById(el)
  },

  class: function (el, p) {
    return this.p(p).getElementsByClassName(el)
  },

  tag: function (el, p) {
    return this.p(p).getElementsByTagName(el)
  },

  qs: function (el, p) {
    return this.p(p).querySelector(el)
  },

  qsa: function (el, p) {
    return this.p(p).querySelectorAll(el)
  },
}
