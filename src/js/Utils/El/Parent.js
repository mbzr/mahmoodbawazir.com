/**
 * Get element's siblings.
 *
 * @param {HTMLElement} el DOM element to find siblings
 * @returns {Array} siblings
 */

const Parent = (el, s) => {
  if (!el.parentNode || typeof el.parentNode.matches !== 'function') {
    return undefined
  }

  if (el.parentNode.matches(s)) {
    return el.parentNode
  }

  return Parent(el.parentNode, s)
}

export default Parent
