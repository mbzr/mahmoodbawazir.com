/*

──────────────────────────────────────────
──────────────────────────────────────────
BIND MAKER
──────────────────────────────────────────
──────────────────────────────────────────

M.BM(this, ['bindFunction1', 'bindFunction2', 'bindFunction3'])

*/

export default function(c, a) {
  var arrL = a.length

  for (var i = 0; i < arrL; i++) {
    c[a[i]] = c[a[i]].bind(c)
  }
}
