import M from '@/utils'

const Xhr = {
  controller: (url, cb, o) => {
    const request = new XMLHttpRequest()
    request.open('GET', url, true)

    request.onreadystatechange = (_) => {
      if (request.readyState === 4 && request.status === 200) {
        const response = request.responseText

        var parser = new DOMParser()
        var doc = parser.parseFromString(response, 'text/html')
        var elem = doc.getElementById('xhr').children[0].outerHTML

        M.G.tag('title')[0].textContent = doc.querySelector('title').textContent
        /**
         * history.pushState(state, title [, url])
         * state: The state object is a JavaScript object which is associated with the new history entry created by pushState(). Whenever the user navigates to the new state, a popstate event is fired, and the state property of the event contains a copy of the history entry's state object.
         * title: Most browsers currently ignore this parameter, although they may use it in the future. Passing the empty string here should be safe against future changes to the method.
         * url: The new history entry's URL is given by this parameter.
         */
        history.pushState(
          {
            key: 'value',
          },
          'title',
          url
        )
        cb(elem, o)
      }
    }
    request.send(null)
  },
  onPopstate: () => {
    const doc = document,
      win = window

    let status = 'complete',
      isIncomplete = doc.readyState !== status

    M.L(win, 'a', 'load', () => {
      setTimeout(() => {
        isIncomplete = false
      }, 0)
    })
    M.L(win, 'a', 'popstate', (e) => {
      if (isIncomplete && doc.readyState === status) {
        e.preventDefault()
        e.stopImmediatePropagation()
      }
    })
    win.onpopstate = () => {
      win.location.href = M.Win.path
    }
  },
}

export default Xhr
