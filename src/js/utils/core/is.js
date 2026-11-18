/*

──────────────────────────────────────────
──────────────────────────────────────────
IS
──────────────────────────────────────────
──────────────────────────────────────────

const isString = M.Is.str(valueToCheck)
const isObject = M.Is.obj(valueToCheck)

*/

export default {
  str: function (v) {
    return typeof v === 'string'
  },

  obj: function (v) {
    return v === Object(v)
  },

  arr: function (v) {
    return v.constructor === Array
  },

  def: function (v) {
    return v !== undefined
  },

  und: function (v) {
    return v === undefined
  },
}
