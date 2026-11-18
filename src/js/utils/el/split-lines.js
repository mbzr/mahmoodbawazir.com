/**
 * Split an element's text into visual lines (GSAP SplitText-style).
 * Each line is wrapped in .txt-up-wrap > .txt-up for clip-up animation.
 *
 * If the element is preceded by a floated .text-indent, the first line
 * keeps that indent after wrapping.
 *
 * Line breaks depend on the width and the vw-based root font size, so
 * resplitAll() rebuilds every split element after a resize. Animate lines
 * with revealLines() rather than passing the returned spans to anime as
 * targets: it reads whatever lines exist on each frame, so a resplit in the
 * middle of (or before) a reveal picks up the new spans.
 */

const split = new Set()

const clamp = (n, min, max) => Math.max(min, Math.min(n, max))
/* Same curve as anime's easeOutExpo. */
const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))

function build(el) {
  const s = el._split
  /* The float has to be in the flow while words are measured, or the first
     line comes out longer than it can be once the indent is applied.
     Reusing its exact pixel width for the first line's indent keeps the two
     in step; the CSS equivalents resolve their em component against
     different font sizes and drifted apart enough to clip the first line. */
  if (s.indent) s.indent.style.display = ''
  const indentWidth = s.indent ? s.indent.offsetWidth : 0

  el.textContent = ''
  const wordEls = s.words.map((word) => {
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

  if (s.indent) s.indent.style.display = 'none'

  s.lines = lines.map((lineWords, i) => {
    const wrap = document.createElement('span')
    wrap.className = 'txt-up-wrap'
    if (s.indent && i === 0) {
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

  if (s.apply) s.apply()
}

export default function splitLines(el) {
  if (!el) return []
  if (!el._split) {
    const indent = el.previousElementSibling
    el._split = {
      words: el.textContent.trim().split(/\s+/),
      indent:
        indent && indent.classList.contains('text-indent') ? indent : null,
      lines: [],
      apply: null,
    }
  }
  build(el)
  split.add(el)
  return el._split.lines
}

/* Every element goes back to plain text before any is measured. Lines are
   nowrap, so a neighbour still holding its old, wider lines can stretch a
   shared grid track and squeeze the element being measured. */
export function resplitAll() {
  const els = [...split].filter((el) => {
    if (el.isConnected) return true
    split.delete(el)
    return false
  })
  for (const el of els) {
    const s = el._split
    if (s.indent) s.indent.style.display = ''
    el.textContent = s.words.join(' ')
  }
  for (const el of els) build(el)
}

/**
 * anime params that clip an element's lines up into place, one `stagger` ms
 * after another. Add to a timeline like any other step:
 *
 *   tl.add(revealLines(el, { duration: 2000, stagger: 100 }), '-=1600')
 */
export function revealLines(
  el,
  { duration, stagger = 0, from = 101, opacity = false } = {},
) {
  const s = el && el._split
  const count = s ? s.lines.length : 0
  const total = duration + Math.max(0, count - 1) * stagger
  const state = { t: 0 }

  const apply = () => {
    if (!s) return
    /* A resplit can leave more lines than the timeline made room for. Close
       the stagger up so the last one still lands when this step ends. */
    const n = s.lines.length
    const step = n > 1 ? Math.min(stagger, (total - duration) / (n - 1)) : 0
    s.lines.forEach((line, i) => {
      const e = easeOutExpo(clamp((state.t - i * step) / duration, 0, 1))
      line.style.transform = `translate3d(0, ${(1 - e) * from}%, 0)`
      if (opacity) line.style.opacity = String(e)
    })
  }

  if (s) {
    s.apply = apply
    apply()
  }

  return {
    targets: state,
    t: [0, total],
    duration: total,
    easing: 'linear',
    update: apply,
  }
}
