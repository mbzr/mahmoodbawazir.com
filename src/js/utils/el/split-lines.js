/**
 * Split an element's text into visual lines (GSAP SplitText-style).
 * Each line is wrapped in .txt-up-wrap > .txt-up for clip-up animation.
 *
 * If the element is preceded by a floated .text-indent, the first line
 * keeps that indent after wrapping.
 */
export default function splitLines(el) {
  if (!el) return []

  const indent = el.previousElementSibling
  const hasIndent = indent && indent.classList.contains('text-indent')
  /* Measure the float before hiding it. Reusing its exact pixel width for the
     first line's indent keeps the two in step; the CSS equivalents resolve
     their em component against different font sizes and drifted apart enough
     to clip the first line. */
  const indentWidth = hasIndent ? indent.offsetWidth : 0

  const words = el.textContent.trim().split(/\s+/)
  el.textContent = ''

  const wordEls = words.map((word) => {
    const span = document.createElement('span')
    span.style.display = 'inline-block'
    span.textContent = word
    el.appendChild(span)
    el.appendChild(document.createTextNode(' '))
    return span
  })

  const lines = []
  let line = []
  let top = null

  for (let i = 0; i < wordEls.length; i++) {
    const y = Math.round(wordEls[i].offsetTop)
    if (top === null || y === top) {
      line.push(wordEls[i].textContent)
      top = y
    } else {
      lines.push(line)
      line = [wordEls[i].textContent]
      top = y
    }
  }
  if (line.length) lines.push(line)

  el.textContent = ''
  el.classList.add('is-split')

  if (hasIndent) indent.style.display = 'none'

  return lines.map((lineWords, i) => {
    const wrap = document.createElement('span')
    wrap.className = 'txt-up-wrap'
    if (hasIndent && i === 0) {
      wrap.classList.add('txt-up-wrap--indent')
      wrap.style.marginLeft = `${indentWidth}px`
    }
    const inner = document.createElement('span')
    inner.className = 'txt-up'
    inner.textContent = lineWords.join(' ')
    wrap.appendChild(inner)
    el.appendChild(wrap)
    return inner
  })
}
