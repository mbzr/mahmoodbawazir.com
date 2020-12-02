import Is from '../Core/Is'
/**
 * Translate
 * @param {string} el element
 * @param {number} x translateX
 * @param {number} y translateY
 * @param {string} u unity
 */

/*

──────────────────────────────────────────
──────────────────────────────────────────
TRANSLATE
──────────────────────────────────────────
──────────────────────────────────────────

M.T(element, translateX, translateY, unity)

►►►  unity → 'px' or '%' by default

*/

export default function(el, x, y, u) {
  var uN = Is.und(u) ? '%' : u
  el.style.transform = 'translate3d(' + x + uN + ',' + y + uN + ',0)'
}
