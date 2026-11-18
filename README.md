# mahmoodbawazir.com

Personal portfolio of **Mahmood Bawazir**, Senior Frontend Developer.

**Live site:** [mahmoodbawazir.com](https://mahmoodbawazir.com)

## Stack

- [Hugo](https://gohugo.io/) for pages and content
- Webpack for JS and SCSS
- [anime.js](https://animejs.com/) for motion
- No UI framework — custom components and utilities

## Notable pieces

- **Virtual smooth scrolling** — transform-based scroller with wheel, touch, keyboard focus, and reduced-motion support
- **XHR page transitions** — client-side navigation that crossfades content without a full reload
- **Split-line text reveals** — lines are measured after fonts load and re-split when the viewport width changes
- **Work previews** — still posters with on-demand hover/touch video; lighter `preview-mobile.mp4` under 768px

## Develop

```bash
npm install
npm start
```

Site runs at [http://localhost:1313](http://localhost:1313).

## Build

```bash
npm run build
```

Output lands in `dist/`.

## Project layout

```
content/     # Hugo page bundles (projects, media)
layouts/     # Templates and partials
src/js/      # Site JS (scroll, transitions, FX, previews)
src/scss/    # Styles
static/      # Static assets (fonts, CV, icons)
scripts/     # Screenshot helpers
```

## License

Code in this repository is available under the MIT License (see `LICENSE`).

Site copy, images, and video belong to Mahmood Bawazir and may not be reused without permission. Client project media remains the property of the respective owners.
