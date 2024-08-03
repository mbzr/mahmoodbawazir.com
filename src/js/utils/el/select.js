import Is from '../core/is'
import G from './get-element-by'
/*

──────────────────────────────────────────
──────────────────────────────────────────
SELECT
──────────────────────────────────────────
──────────────────────────────────────────

const el[0] = M.Select.el(selector)
const type = M.Select.type(selector)
const name = M.Select.name(selector)

*/

export default {
  el: function (s) {
    var el = []
    if (Is.str(s)) {
      var elName = s.substring(1)
      if (s.charAt(0) === '#') {
        el[0] = G.id(elName)
      } else {
        el = G.class(elName)
      }
    } else {
      el[0] = s
    }
    return el
  },

  type: function (s) {
    return s.charAt(0) === '#' ? 'id' : 'class'
  },

  name: function (s) {
    return s.substring(1)
  },
}
