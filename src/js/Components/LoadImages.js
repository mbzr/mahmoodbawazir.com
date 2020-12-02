import M from '../../Utils/index'

class LoadImages {
  run(t, o) {
    function h(t, e) {
      var i = new Image()
      return (
        (i.onload = function (t) {
          e()
        }),
        (i.crossOrigin = 'anonymous'),
        (i.src = t),
        i
      )
    }
    !(function (t) {
      for (
        var s = [],
          r = t.length,
          n = r,
          e = function () {
            --r
            var t,
              e = M.G.id('loader-counter'),
              i = Math.floor(100 - ((r + 1) / n) * 100)
            // ;(e.textContent = ((t = i) < 10 ? '0' + t : t) + '.'),
            0 === r && o(s)
          },
          i = 0;
        i < r;
        ++i
      ) {
        var a = h(t[i], e)
        s.push(a)
      }
    })(t)
  }
}

export default LoadImages
