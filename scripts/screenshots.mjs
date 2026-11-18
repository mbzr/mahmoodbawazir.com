/**
 * Captures above-the-fold screenshots of the live and archived versions of the
 * sites in the Work section, plus the Open Graph card.
 *
 * Raw PNGs land in scripts/.screenshots-raw/ (git ignored); only the converted
 * WebP files in static/media/work/ are meant to be committed.
 *
 *   npm run screenshots          # everything
 *   npm run screenshots -- og    # just the Open Graph image
 *   npm run screenshots -- puffy # only targets whose name matches "puffy"
 *
 * This only ever reads public pages. It clicks cookie banners and follows
 * navigation links, and deliberately never fills a form, logs in, adds
 * anything to a cart, or submits anything.
 */

import { chromium } from 'playwright'
import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '..')
const RAW_DIR = path.join(HERE, '.screenshots-raw')
const OUT_DIR = path.join(ROOT, 'static', 'media', 'work')
const OG_OUT = path.join(ROOT, 'static', 'media', 'images', 'open-graph.jpg')

// Keep these in sync with the $deskW/$mobW constants in
// layouts/_default/single.html, which hardcodes the resulting dimensions as
// width/height attributes.
const DESKTOP = { width: 1440, height: 900, scale: 2, maxWidth: 1600 }
const MOBILE = { width: 390, height: 844, scale: 3, maxWidth: 780 }

const MOBILE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1'

/* Some of these sites answer 403 to the default headless user agent while
   serving the same pages fine to a normal desktop one. */
const DESKTOP_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36'

const NETWORK_IDLE_TIMEOUT = 15_000
const ANIMATION_SETTLE = 2_000

/* Known chat widgets and floating popups. Deliberately specific: hiding every
   position:fixed element would also hide sticky headers, which belong in an
   above-the-fold shot. */
const HIDE_CSS = `
  #intercom-container, .intercom-lightweight-app, #hubspot-messages-iframe-container,
  #drift-widget, #drift-frame-controller, #drift-frame-chat,
  .zEWidget-launcher, #launcher, iframe#launcher, #webWidget,
  #tawkchat-container, iframe[title*="chat" i], iframe[title*="Chat"],
  #crisp-client, #chat-widget-container, .gorgias-chat-container,
  iframe[id^="gorgias"], .klaviyo-form, div[class*="needsclick"][class*="kl-private"],
  #onetrust-banner-sdk, #onetrust-consent-sdk, .ot-sdk-row,
  #CybotCookiebotDialog, #cookiescript_injected, .cc-window, #usercentrics-root,
  [class*="cookie-banner" i], [id*="cookie-banner" i],
  [aria-label*="chat" i][role="region"] {
    display: none !important;
    visibility: hidden !important;
  }
`

/* Ordered most to least specific. "ok" is last because it is the easiest to
   match on an unrelated dialog; \b keeps it from matching inside "cookie". */
const ACCEPT_PATTERNS = [
  /\b(accept all|allow all|accept cookies)\b/i,
  /\b(accept|agree|got it|allow)\b/i,
  /\b(okay|ok)\b/i,
]
const ACCEPT_ARABIC = ['قبول', 'موافق']
const ARABIC_SWITCH = /^(العربية|عربي|عربية|ar)$/i

const results = { captured: [], skipped: [] }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function settle(page) {
  try {
    await page.waitForLoadState('networkidle', {
      timeout: NETWORK_IDLE_TIMEOUT,
    })
  } catch {
    /* some sites keep a socket open forever; the fixed wait below is enough */
  }
  await sleep(ANIMATION_SETTLE)
}

async function dismissConsent(page) {
  const candidates = await page
    .locator(
      'button, [role="button"], a[class*="accept" i], input[type="button"]',
    )
    .all()
    .catch(() => [])

  /* Collect visible labels first, then click the best match, so a stray "OK"
     in an unrelated dialog can't beat a real "Accept all". */
  const visible = []
  for (const el of candidates) {
    try {
      if (!(await el.isVisible())) continue
      const label = (
        (await el.innerText()) ||
        (await el.getAttribute('aria-label')) ||
        ''
      ).trim()
      if (label && label.length <= 40) visible.push({ el, label })
    } catch {
      /* element detached while we looked at it */
    }
  }

  const tiers = [
    ...ACCEPT_PATTERNS.map((re) => (l) => re.test(l)),
    (l) => ACCEPT_ARABIC.some((w) => l.includes(w)),
  ]

  for (const matches of tiers) {
    for (const { el, label } of visible) {
      if (!matches(label)) continue
      try {
        await el.click({ timeout: 3_000, noWaitAfter: true })
        await sleep(600)
        return label
      } catch {
        /* banner may have vanished on its own */
      }
    }
  }
  return null
}

/**
 * Close interstitials that appear after the cookie banner, such as app-install
 * promos. Their close control is usually an icon with no text, so this matches
 * on accessible names instead. Only ever clicks close/dismiss affordances.
 */
async function dismissModals(page) {
  const closed = []
  const selector = [
    '[role="dialog"] [aria-label*="close" i]',
    '[aria-modal="true"] [aria-label*="close" i]',
    '[aria-label*="close" i]',
    '[aria-label*="dismiss" i]',
    '[aria-label*="إغلاق" i]',
    'button[class*="close" i]',
    'button[data-dismiss]',
  ].join(', ')

  for (let pass = 0; pass < 3; pass++) {
    let clicked = false
    const buttons = await page
      .locator(selector)
      .all()
      .catch(() => [])

    for (const el of buttons) {
      try {
        if (!(await el.isVisible())) continue
        const box = await el.boundingBox()
        if (!box || box.width > 120 || box.height > 120) continue // not an icon button
        await el.click({ timeout: 2_000, noWaitAfter: true })
        closed.push(await el.getAttribute('aria-label'))
        clicked = true
        await sleep(500)
        break
      } catch {
        /* already gone */
      }
    }
    if (!clicked) break
  }
  return closed
}

/**
 * Last resort for interstitials that survive the steps above: hide any large
 * fixed-position overlay still covering the viewport, plus its backdrop.
 *
 * Sticky headers and footers are deliberately preserved — they belong in an
 * above-the-fold shot — by exempting bars that hug an edge and are short.
 */
async function hideOverlays(page) {
  return page
    .evaluate(() => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const viewportArea = vw * vh
      const hidden = []

      for (const el of document.querySelectorAll('body *')) {
        const style = getComputedStyle(el)
        if (style.position !== 'fixed' || style.display === 'none') continue
        if (style.visibility === 'hidden' || parseFloat(style.opacity) === 0)
          continue

        const r = el.getBoundingClientRect()
        if (r.width < 1 || r.height < 1) continue

        const coverage = (r.width * r.height) / viewportArea
        if (coverage < 0.18) continue

        // A short bar pinned to the top or bottom edge is chrome, not a modal.
        const shortBar = r.height <= vh * 0.25
        if (shortBar && (r.top <= 2 || r.bottom >= vh - 2)) continue

        el.style.setProperty('display', 'none', 'important')
        hidden.push(
          `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''} ${Math.round(coverage * 100)}%`,
        )
      }

      // Modals often lock scrolling on <html>/<body>; undo that.
      for (const el of [document.documentElement, document.body]) {
        el.style.setProperty('overflow', 'visible', 'important')
        el.style.setProperty('position', 'static', 'important')
      }
      return hidden
    })
    .catch(() => [])
}

async function prepare(page) {
  await dismissConsent(page)
  await dismissModals(page)

  /* Second pass: promos and newsletter popups often fire on a timer, so they
     can appear after the first round of dismissals. */
  await sleep(2_500)
  await dismissConsent(page)
  await dismissModals(page)

  await page.addStyleTag({ content: HIDE_CSS }).catch(() => {})
  const hidden = await hideOverlays(page)
  if (hidden.length) console.log(`        hid overlay: ${hidden.join(', ')}`)

  await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {})
  await sleep(600)
}

async function capture(browser, { url, dir, name }) {
  const outDir = path.join(OUT_DIR, dir)
  await mkdir(outDir, { recursive: true })
  await mkdir(RAW_DIR, { recursive: true })

  for (const [variant, cfg] of [
    ['desktop', DESKTOP],
    ['mobile', MOBILE],
  ]) {
    const context = await browser.newContext({
      viewport: { width: cfg.width, height: cfg.height },
      deviceScaleFactor: cfg.scale,
      isMobile: variant === 'mobile',
      hasTouch: variant === 'mobile',
      userAgent: variant === 'mobile' ? MOBILE_UA : DESKTOP_UA,
    })
    const page = await context.newPage()

    try {
      const res = await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 45_000,
      })
      const status = res ? res.status() : 0
      if (status >= 400) throw new Error(`HTTP ${status}`)

      await settle(page)
      await prepare(page)

      const raw = path.join(RAW_DIR, `${name}-${variant}.png`)
      // No fullPage: this is an above-the-fold capture.
      await page.screenshot({ path: raw, animations: 'disabled' })

      const out = path.join(outDir, `${name}-${variant}.webp`)
      const info = await sharp(raw)
        .resize({ width: cfg.maxWidth, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(out)

      results.captured.push({
        name: `${name}-${variant}`,
        dir,
        url,
        file: path.relative(ROOT, out),
        size: `${info.width}x${info.height}`,
      })
      console.log(`  ok    ${name}-${variant}  ${info.width}x${info.height}`)
    } catch (err) {
      results.skipped.push({
        name: `${name}-${variant}`,
        url,
        reason: err.message,
      })
      console.log(`  SKIP  ${name}-${variant}  ${err.message}`)
    } finally {
      await context.close()
    }
  }
}

/* ------------------------------------------------------------------ */
/* URL resolution for targets that have to be reached by following a  */
/* link rather than by guessing a path.                               */
/* ------------------------------------------------------------------ */

async function withPage(browser, fn) {
  const context = await browser.newContext({
    viewport: { width: DESKTOP.width, height: DESKTOP.height },
    userAgent: DESKTOP_UA,
  })
  const page = await context.newPage()
  try {
    return await fn(page)
  } finally {
    await context.close()
  }
}

async function followLink(browser, from, pattern) {
  return withPage(browser, async (page) => {
    await page.goto(from, { waitUntil: 'domcontentloaded', timeout: 45_000 })
    await settle(page)
    await dismissConsent(page)

    const hrefs = await page.$$eval('a[href]', (as) =>
      as
        .filter((a) => a.offsetParent !== null || a.getClientRects().length)
        .map((a) => ({
          href: a.href,
          text: (a.innerText || a.getAttribute('aria-label') || '').trim(),
        })),
    )

    const hit =
      hrefs.find((a) => pattern.test(a.text)) ||
      hrefs.find((a) => pattern.test(a.href))
    if (!hit) throw new Error(`no link matching ${pattern}`)
    return hit.href
  })
}

async function resolveArabic(browser, base) {
  const origin = new URL(base).origin
  const candidates = ['/ar', '/ar/', '/ar-sa', '/ar-sa/']

  for (const candidate of candidates) {
    const url = origin + candidate
    const ok = await withPage(browser, async (page) => {
      const res = await page
        .goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 })
        .catch(() => null)
      if (!res || res.status() >= 400) return false
      return page
        .evaluate(() => {
          const html = document.documentElement
          return (
            (html.lang || '').toLowerCase().startsWith('ar') ||
            html.dir === 'rtl'
          )
        })
        .catch(() => false)
    })
    if (ok) return url
  }

  // Fall back to the on-page language switcher.
  return withPage(browser, async (page) => {
    await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 45_000 })
    await settle(page)
    await dismissConsent(page)

    const hrefs = await page.$$eval('a[href]', (as) =>
      as.map((a) => ({ href: a.href, text: (a.innerText || '').trim() })),
    )
    const hit = hrefs.find(
      (a) => ARABIC_SWITCH.test(a.text) || /\/ar(\/|$|\?)/.test(a.href),
    )
    if (!hit) throw new Error('no Arabic version found')
    return hit.href
  })
}

/**
 * Find a Wayback snapshot that actually renders. The `if_` suffix suppresses
 * the archive toolbar. Plenty of snapshots answer 200 but replay an empty
 * body, so each candidate is checked for real text before being accepted.
 *
 * The archive.org availability API is not used here: it rate-limits to 429
 * aggressively enough to be useless in a loop.
 */
async function resolveWayback(browser, site, stamps) {
  const failures = []

  for (const stamp of stamps) {
    const url = `https://web.archive.org/web/${stamp}if_/${site}`
    const length = await withPage(browser, async (page) => {
      const res = await page
        .goto(url, { waitUntil: 'domcontentloaded', timeout: 90_000 })
        .catch(() => null)
      if (!res || res.status() >= 400) return 0
      // Replays are slow and often JS-rendered, so give them room.
      await settle(page)
      return page
        .evaluate(() => document.body.innerText.trim().length)
        .catch(() => 0)
    })

    if (length > 400) return url
    failures.push(`${stamp} (${length} chars)`)
  }

  throw new Error(`no Wayback snapshot rendered: ${failures.join(', ')}`)
}

/* ------------------------------------------------------------------ */

async function openGraph(browser) {
  const context = await browser.newContext({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 2,
  })
  const page = await context.newPage()
  try {
    await page.goto(`file://${path.join(HERE, 'og-template.html')}`, {
      waitUntil: 'domcontentloaded',
    })
    await page.evaluate(() => document.fonts.ready).catch(() => {})
    await sleep(1200)

    await mkdir(RAW_DIR, { recursive: true })
    const raw = path.join(RAW_DIR, 'open-graph.png')
    await page.screenshot({ path: raw })

    const info = await sharp(raw)
      .resize({ width: 1200, height: 630, fit: 'cover' })
      .jpeg({ quality: 90, mozjpeg: true })
      .toFile(OG_OUT)

    results.captured.push({
      name: 'open-graph',
      file: path.relative(ROOT, OG_OUT),
      size: `${info.width}x${info.height}`,
    })
    console.log(`  ok    open-graph  ${info.width}x${info.height}`)
  } catch (err) {
    results.skipped.push({ name: 'open-graph', reason: err.message })
    console.log(`  SKIP  open-graph  ${err.message}`)
  } finally {
    await context.close()
  }
}

/**
 * Use Playwright's own Chromium when it is installed and runnable, otherwise
 * fall back to a locally installed Chrome. The fallback matters because
 * `playwright install` occasionally fetches a build for the wrong CPU
 * architecture, which only shows up as a spawn error at launch time.
 */
async function launchBrowser() {
  const attempts = [
    ['bundled chromium', {}],
    ['system chrome', { channel: 'chrome' }],
    ['system edge', { channel: 'msedge' }],
  ]

  const problems = []
  for (const [label, opts] of attempts) {
    try {
      const browser = await chromium.launch(opts)
      console.log(`browser: ${label} (${browser.version()})`)
      return browser
    } catch (err) {
      problems.push(`${label}: ${err.message.split('\n')[0]}`)
    }
  }
  throw new Error(`could not launch a browser.\n  ${problems.join('\n  ')}`)
}

/**
 * The Bayzat site was redesigned after 2020 and the Wayback replays of the
 * version in this case study come back without their stylesheets, so there is
 * nothing useful to capture live. The repo already holds full-page captures of
 * the 2020 build; crop the top of the homepage one to card proportions so the
 * Work section can show real work rather than a logo on a flat background.
 */
async function deriveBayzatCard() {
  const src = path.join(ROOT, 'content', 'bayzat', 'media', '1.jpg')
  const out = path.join(OUT_DIR, 'bayzat', 'bayzat-2020-home-card.webp')

  try {
    await mkdir(path.dirname(out), { recursive: true })
    const { width } = await sharp(src).metadata()
    const info = await sharp(src)
      .extract({ left: 0, top: 0, width, height: Math.round(width / 1.735) })
      .webp({ quality: 80 })
      .toFile(out)

    results.captured.push({
      name: 'bayzat-2020-home-card',
      dir: 'bayzat',
      file: path.relative(ROOT, out),
      size: `${info.width}x${info.height}`,
    })
    console.log(
      `  ok    bayzat-2020-home-card  ${info.width}x${info.height}  (cropped from ${path.relative(ROOT, src)})`,
    )
  } catch (err) {
    results.skipped.push({ name: 'bayzat-2020-home-card', reason: err.message })
    console.log(`  SKIP  bayzat-2020-home-card  ${err.message}`)
  }
}

async function main() {
  const filter = process.argv.slice(2).filter((a) => !a.startsWith('-'))
  const wants = (name) =>
    filter.length === 0 || filter.some((f) => name.includes(f))

  const browser = await launchBrowser()

  try {
    if (wants('og') || wants('open-graph')) {
      console.log('open graph')
      await openGraph(browser)
    }

    if (wants('bayzat')) {
      console.log('\nbayzat card')
      await deriveBayzatCard()
    }

    const SIXFLAGS = 'https://sixflagsqiddiyacity.com/'
    const AQUARABIA = 'https://aquarabiaqiddiyacity.com/'
    const PUFFY = 'https://puffy.com/'

    /** Each entry resolves a URL (possibly by navigating) then captures it. */
    const targets = [
      { dir: 'qiddiya', name: 'sixflags-home', url: () => SIXFLAGS },
      {
        dir: 'qiddiya',
        name: 'sixflags-tickets',
        url: () => followLink(browser, SIXFLAGS, /\/tickets-passes\/?$/i),
      },
      {
        dir: 'qiddiya',
        name: 'sixflags-home-ar',
        url: () => resolveArabic(browser, SIXFLAGS),
      },
      { dir: 'qiddiya', name: 'aquarabia-home', url: () => AQUARABIA },
      {
        dir: 'qiddiya',
        name: 'aquarabia-home-ar',
        url: () => resolveArabic(browser, AQUARABIA),
      },

      { dir: 'puffy', name: 'puffy-home', url: () => PUFFY },
      {
        dir: 'puffy',
        name: 'puffy-product',
        url: () =>
          followLink(browser, PUFFY, /\/products\/[a-z0-9-]*mattress/i),
      },
      {
        dir: 'puffy',
        name: 'puffy-2024-home',
        url: () =>
          resolveWayback(browser, 'https://puffy.com/', [
            '20240601',
            '20240101',
            '20231201',
          ]),
      },

      /* No Bayzat target: the repo already carries full-page captures of the
         2020 site in content/bayzat/media/, which are cleaner than anything
         the Wayback replay produces. Re-add a resolveWayback target here if
         those are ever lost. */
    ]

    for (const target of targets) {
      if (!wants(target.name) && !wants(target.dir)) continue
      console.log(`\n${target.name}`)
      let url
      try {
        url = await target.url()
        console.log(`  url   ${url}`)
      } catch (err) {
        results.skipped.push({ name: target.name, reason: err.message })
        console.log(`  SKIP  ${err.message}`)
        continue
      }
      await capture(browser, { url, dir: target.dir, name: target.name })
    }
  } finally {
    await browser.close()
  }

  await mkdir(RAW_DIR, { recursive: true })
  await writeFile(
    path.join(RAW_DIR, 'report.json'),
    JSON.stringify(results, null, 2),
  )

  console.log(
    `\n${results.captured.length} captured, ${results.skipped.length} skipped`,
  )
  for (const s of results.skipped)
    console.log(`  skipped ${s.name}: ${s.reason}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
