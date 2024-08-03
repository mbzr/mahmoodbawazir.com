import Is from '../core/is'
import Detect from '../core/detect'
import Select from '../el/select'

/**
 * Event Listener
 * @param {string} el element
 * @param {string} a action
 * @param {string} t type
 * @param {function} cb callback
 */

/*
──────────────────────────────────────────
──────────────────────────────────────────
LISTENER
──────────────────────────────────────────
──────────────────────────────────────────

ADD
───

M.L(element, 'a', 'click', callback)

REMOVE
──────

M.L(element, 'r', 'click', callback)

EXAMPLE
───────

listen (action) {
    M.L(element, action, 'click', callback)
}

this.listen('a')
this.listen('r')

*/

export default function (el, a, e, cb) {
  const d = document
  var el = Select.el(el)
  const elL = el.length
  let type = e
  const w = 'wheel'
  const m = 'move'
  const mo = 'mouse'
  const to = 'touch'
  //passiveEvents
  const pE = ['scroll', mo + 'Wheel', mo + m, to + m, to + 'start']
  const o = pE.indexOf(e) === -1 ? false : { passive: false }

  //if type is scroll
  if (e === pE[1]) {
    //check for cross browser event and set the type accordingly
    type =
      'onwheel' in d ? w : Is.def(d.onmousewheel) ? mo + w : 'DOMMouseScroll'
  } else if (e === 'focusOut') {
    type = Detect.isFirefox ? 'blur' : 'focusout'
  }
  //set action
  const action = a === 'a' ? 'add' : 'remove'
  for (let i = 0; i < elL; i++) {
    //set add/remove listener according to the action passed
    el[i][action + 'EventListener'](type, cb, o)
  }
}
