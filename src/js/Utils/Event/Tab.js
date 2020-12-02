import BM from '../Core/BM'
import L from '../Listener/L'
/*

──────────────────────────────────────────
──────────────────────────────────────────
TAB
──────────────────────────────────────────
──────────────────────────────────────────

M.Tab.add(id, context)
M.Tab.remove(id)

*/
class Tab {
  constructor() {
    this.arr = []
    this.arrL = 0
    this.pause = 0
    BM(this, ['run'])
    L(document, 'a', 'visibilitychange', this.run)
  }
}

Tab.prototype = {
  add: function(id, cb) {
    this.arr.push([id, cb])
    this.arrL++
  },

  remove: function(id) {
    for (var i = 0; i < this.arrL; i++) {
      if (this.arr[i][0] === id) {
        this.arr.splice(i, 1)
        this.arrL--
      }
    }
  },

  run: function() {
    var now = performance.now()

    if (document.hidden) {
      this.pause = performance.now()
      for (var i = 0; i < this.arrL; i++) {
        this.arr[i][1].stop(true)
      }
    } else {
      var elapsed = now - this.pause
      for (var i = 0; i < this.arrL; i++) {
        this.arr[i][1].run(elapsed)
      }
    }
  }
}

export default Tab
