/**
 * Get element's siblings.
 *
 * @param {HTMLElement} element DOM element to find siblings
 * @returns {Array} siblings
 */

export default function (element) {
  return [...element.parentNode.children].filter((child) => child !== element)
}
