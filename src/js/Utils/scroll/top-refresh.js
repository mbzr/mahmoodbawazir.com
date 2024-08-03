/*

──────────────────────────────────────────
──────────────────────────────────────────
SCROLL TOP WHEN REFRESH BROWSER
──────────────────────────────────────────
──────────────────────────────────────────

M.TopRefresh()

*/

export default function() {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'
  } else {
    window.onbeforeunload = function() {
      window.scrollTo(0, 0)
    }
  }
}
