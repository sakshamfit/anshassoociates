# ANSH ASSOCIATES — Premium Real Estate

A static, dependency-light landing page. No build step.

## Run it

```bash
npm start          # serves on http://0.0.0.0:4173
npm test           # verify.mjs (assets / module graph / i18n / render / HTTP) + smoke-boot.mjs
```

## What was broken (and is now fixed)

The committed page rendered as a **blank cream screen**. The audit below
repaired every one of these; each is asserted by `scripts/verify.mjs` and
`scripts/smoke-boot.mjs` so it cannot silently regress.

### Fatal: nothing ever ran, nothing ever showed

1. **The intro overlay never left.** `#intro` is `position:fixed; z-index:999`
   and opaque; no rule or script ever hid it. The page was a cream rectangle
   forever. `css/supplement.css` now reveals the page and `js/main.js` dismisses
   the overlay on a failsafe timer. A `<noscript>` guard hides it without JS.
2. **`#hero` was `opacity:0; visibility:hidden` with no rule ever reversing it.**
   `supplement.css` now shows it.
3. **The module graph could not resolve, so `js/main.js` never evaluated.**
   `scroll-animations.js` imported `./vendor/gsap.min.js` from the wrong folder,
   and `knowledge-visualization.js` imported the bare specifier `three`, which is
   neither vendored nor import-mapped. GSAP is now read from the global scope and
   the three.js module is deliberately not imported (it was dead code — no
   `#knowledge-graph` container exists).
4. **`js/vendor/lenis.min.js` was referenced but missing**, so `new Lenis(...)`
   threw and killed every handler. Replaced by the dependency-free
   `js/smooth-scroll.js`, which drives the real scroll offset on the GSAP ticker
   (keeping ScrollTrigger in sync) and honours `prefers-reduced-motion`.
5. **The grids were empty and never filled.** `#propGrid` had no data source wired
   up (`js/property-data.js` was never loaded by a `<script>` tag), and
   `#serviceWall` had nothing at all. `js/render.js` now populates properties,
   services and testimonials from `js/data.js`.

### Markup / CSS drift

6. **A malformed tag `<div="cin">`** (line 402) — invalid HTML that broke the
   contact grid. Now `<div class="cin">`.
7. **50+ classes used with no matching CSS** (`#logo-header`, `.prop-florals`,
   `.serv-blossoms`, `.about-media`, `.cin-link`, `.ci-social`, …). Several wrap
   `<img>` ornaments and rendered as full-size images in the flow. Styled in
   `supplement.css`.
8. **Naming drift** — About markup used `.abt-*` vs CSS `.about-*`; Testimonials
   `.tst-*` vs `.test-*`; Contact used `.cin-info` for the container and `.cin-block`
   for the cards while CSS styles `.cin-info` as the card. Markup aligned to CSS.
9. **A stray `@property-card:hover` at-rule** in `base.css` made the parser drop the
   whole hover block. Removed.
10. **`--logo-land-d` was used but never defined**, so the header logo slot had no size.
    Defined in `supplement.css`.

### Dead links & unfinished features

11. Four links pointed at pages that don't exist (`account.html`, `wishlist.html`,
    `cart.html`, `properties.html`). They now resolve to in-page behaviour: wishlist
    hearts + header counter (localStorage), enquiries/account jump to the form,
    and a live header search that filters the grid (locale-independent).
12. **The English/हिन्दी switch was cosmetic** — it toggled a class and wrote to
    localStorage, and no translation layer existed. `js/i18n.js` now implements it
    (83 keys, both locales), including placeholders, aria-labels and select options.
    Hindi sets its own typeface.
13. Form submit used a blocking `alert()`; now a non-blocking toast.
14. `history.pushState(null,'','#'+ '#properties')` produced `##properties`; now
    `replaceState`.

### Added

- Open Graph + JSON-LD `RealEstateAgent` structured data.
- All 15 missing images (9 photographic, 6 vector: logo, florals, blossoms, leaves, map).
- `package.json` so `npm start` / `npm test` work.
