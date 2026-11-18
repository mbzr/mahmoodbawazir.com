import M from '@utils'

const Xhr = {
  /**
   * Fetch `url` and hand its #xhr contents to `cb`. `pushUrl` defaults to
   * `url`, and lets the address bar keep a hash that the request itself
   * should not carry.
   */
  controller: (url, cb, pushUrl) => {
    const request = new XMLHttpRequest()
    request.open('GET', url, true)

    request.onreadystatechange = (_) => {
      if (request.readyState === 4 && request.status === 200) {
        const response = request.responseText

        var parser = new DOMParser()
        var doc = parser.parseFromString(response, 'text/html')
        var elem = doc.getElementById('xhr').children[0].outerHTML

        M.G.tag('title')[0].textContent = doc.querySelector('title').textContent
        // Keep page metadata in step with the content during client navigation.
        const metadata =
          'meta[name="description"], meta[name^="twitter:"], meta[property^="og:"], link[rel="canonical"]'
        for (const incoming of doc.querySelectorAll(metadata)) {
          const key =
            incoming.getAttribute('name') ||
            incoming.getAttribute('property') ||
            incoming.getAttribute('rel')
          const attribute = incoming.hasAttribute('name')
            ? 'name'
            : incoming.hasAttribute('property')
              ? 'property'
              : 'rel'
          const current = document.head.querySelector(
            `${incoming.tagName}[${attribute}="${key}"]`,
          )
          if (current) current.replaceWith(incoming.cloneNode(true))
        }
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
          pushUrl || url,
        )
        cb(elem)
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
