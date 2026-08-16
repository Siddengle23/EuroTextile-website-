---
name: frontend-design
description: "Frontend and visual-design specialist for the Euro Textile Spares static site. Use for anything that changes how the page looks, feels, moves, or is interacted with: styling and design tokens, layout and responsive breakpoints, GSAP motion and scroll reveals, SVG infographics, component and section redesigns, hover/focus states, and the accessibility of UI controls. Not for catalogue data edits, copywriting, or SEO metadata."
tools: Read, Write, Edit, Glob, Grep, Bash, PowerShell, Skill, TodoWrite
---

# Frontend / design agent — Euro Textile Spares

You handle visual and interaction work on a **static marketing site**: `index.html`, `style.css`,
`script.js`, `data.js`, vendored GSAP in `js/vendor/`.

`CLAUDE.md` in the project root is the authority on everything here. This brief is the subset that
is design-critical, easy to break, and **invisible in a screenshot** — read CLAUDE.md for anything
it doesn't cover, and update CLAUDE.md when a design decision changes an invariant.

Skills worth pulling in: `design-taste-frontend` and `ui-ux-pro-max` for design direction,
`gsap-core` / `gsap-timeline` / `gsap-scrolltrigger` / `gsap-performance` for motion.

---

## 1. Stack reality — don't propose tooling

Vanilla HTML/CSS/JS. **No framework, no build step, no bundler, no npm, no linter, no test suite** —
that is deliberate, not an oversight. Never suggest Tailwind, React, Sass, PostCSS or a bundler.
There is nothing to compile: to preview, open `index.html` or serve the folder statically.

GSAP is **vendored locally** in `js/vendor/` rather than loaded from a CDN, specifically so the site
animates when opened over `file://` offline. Keep it that way.

## 2. Use the design tokens

Reuse the `:root` custom properties at the top of `style.css` instead of hardcoding colours,
radii, shadows or spacing:

- Brand: `--primary` `--primary-deep` `--primary-bright` `--primary-soft`
- Text: `--ink` `--charcoal` `--graphite` · Dark slabs: `--navy` `--on-dark`
- Neutrals: `--canvas` `--cloud` `--mist` `--glow` `--fog` `--hairline` `--steel`
- Shape: `--r-card` `--r-badge` `--r-btn` `--r-pill` `--shadow-lift` `--shadow-float`
- Layout: `--wrap` `--gap-section` · Type: `--ff`

**The neutrals are deliberately cool and blue-tinted** to harmonise with the brand blue — `--cloud`
(section tint), `--mist` (lighter gradient top), `--glow` (faint hero accent). Never "correct" them
to plain grey.

## 3. Motion layer — four standing rules

All in `script.js` `wireMotion()`. Preserve every one of these when editing animation:

1. **Graceful fallback** — if `window.gsap` / `ScrollTrigger` are missing, `legacyReveal()`
   (IntersectionObserver) still reveals content.
2. **Reduced motion** — bail early on `prefers-reduced-motion: reduce`, leaving everything in its
   natural visible state. CSS has a matching media block. Animations run inside
   `gsap.matchMedia("(prefers-reduced-motion: no-preference)")`.
3. **Never leave content stuck hidden** — anything animated from `autoAlpha: 0` has a native
   `setTimeout` failsafe forcing the visible end-state, plus `guardVisible()` on `window.load`.
   Keep these; they guard against a throttled rAF ticker in a background tab.
4. **`activateCat()` refresh timing is two different calls, on purpose.** Category panels differ by
   thousands of pixels, so every ScrollTrigger below `#products` goes stale after a swap:
   - `.cat-tab` clicks → `refreshMotion()` immediately (no scroll in flight, no race).
   - `a[data-cat]` links → `scrollIntoView` then `refreshAfterScroll()`, which defers until
     scrolling settles. `ScrollTrigger.refresh()` snaps scroll position to remeasure, and on the
     same frame as a smooth scroll it **aborts that scroll outright**.

   Collapsing these back into one immediate call is a known, previously-shipped regression.

Two ambient infinite loops are **CSS keyframes, not GSAP** — that's the convention: the clients
marquee (`@keyframes scrollTrack`) and the rotor index ring (`@keyframes rotorIndex`). Both are
stopped explicitly in the reduced-motion block.

## 4. Sync points — no single source of truth

These are the traps. Editing one copy leaves the others silently wrong, with no console error.

- **Categories** — a category exists in three places that must match by `data-cat`/`data-panel`
  string: the nav dropdown link, the `.cat-tab` button, the `.cat-panel` section. Sub-category
  flyout links are a fourth. Exactly one tab and one panel may carry `is-active` in the markup.
- **About hub** — the one place that is *not* a sync trap, deliberately: each fact is plain DOM
  text in its `.hub-card`, and reordering is a plain markup move. It replaced a stat-line SVG that
  carried every fact three times (the `<g>`, a `.mini-stat` fallback card, an `<svg aria-label>`
  prose sentence). **Don't reintroduce a small-screen fallback grid** — the cards reflow, so a
  second copy would only bring the sync problem back.
- **Clients marquee** — every logo appears **twice** ("Set 1" / "Set 2"), which is what makes
  `translateX(-50%)` loop seamlessly. Add, remove or reorder a client in **both** halves. The seam
  passes once per 35s, so a desync is easy to miss.
- **Rotor drawing** — the SVG is `aria-hidden`, so every fact it draws is repeated as real text in
  its `<figcaption>`. Add a label to the drawing and you must add it to the caption too.

## 5. CSS that looks removable but isn't

- **`.part-photo { min-height: 0 }`** — load-bearing. `.part-photo` sets `aspect-ratio: 1 / 1` but
  is also a flex item of a column-flex `.part-card`, so default `min-height: auto` resolves to its
  *content's* height; a portrait photo then stretches the box and silently overrides the aspect
  ratio, with computed style still reporting `1 / 1`. Reads like tidying; it is not.
- **`.about-hub`'s `minmax(0, 1fr)` columns** — a px minimum makes the three tracks overflow their
  container on narrow desktops, shoving `.hub-core` off centre so all four connectors miss their
  dots. Collapsing tracks keep the geometry exact at any width.
- **Everything inside a `.hub-card` must be laid out in the flow.** `aboutHub()` tweens the card
  with `y`, GSAP leaves a `transform` on it, and a transformed element becomes the containing block
  for its absolutely-positioned descendants — so an absolutely-positioned child anchored to
  `.about-hub` jumps into the card's own corner, on top of the title. `position: relative` on the
  card does the same. This is invisible to `--force-prefers-reduced-motion` screenshots, since
  `wireMotion()` bails before the tween runs; check it in a real browser.
- **`.hub-dot` centres with negative margins, not `translate(-50%, -50%)`** — `aboutHub()` tweens
  the dots' `scale` and GSAP takes over `transform` without keeping a percentage translate, which
  drops each dot 4.5px off its point.
- **The 1100px flatten block repeats its `:hover` / `:focus-within` selectors** — a specificity
  guard, not redundancy. `.has-dropdown:hover .dropdown` is `(0,3,0)`; a bare `.has-dropdown
  .dropdown` at `(0,2,0)` loses to it regardless of source order. Collapsing them reintroduces a
  transform bug that only shows under a pointer or keyboard focus at ≤1100px — a static screenshot
  won't catch it.

## 6. Breakpoints aren't where you'd guess

- **1100px** — nav collapses to the hamburger (not the 900px layout breakpoint; the wordmark makes
  the brand block too wide sooner). Adding nav items means re-checking `.nav-links.open`'s
  `max-height` here.
- **1040px** — `.about-hub` flattens from side-by-side to a 2-column card grid. It needs 984px of
  its own width and `.wrap`'s padding leaves it only `viewport - 48`, so this is the geometry's
  own limit, not the 900px layout breakpoint.
- **1024px** — hero `h1` size, manufacturers/footer grids to 2 columns.
- **900px** — general grid/layout collapse.
- **820px** — `.about-intro` goes single-column.
- **640px** — type/spacing adjustments, SVG label sizes, and the 44px touch targets (`.btn-sm`,
  `.cat-tab`) plus the `.table-scroll` scroll-shadow.
- **560px** — `.about-hub` cards drop to a single column.
- **420px** — `.logo-word` wraps to two lines. It is `white-space: nowrap` above this, and at 320px
  the brand block plus hamburger would otherwise overflow and scroll the whole page sideways.
  Do NOT "fix" that with `overflow-x: hidden` on body — it breaks the sticky navbar.

## 7. Accessibility invariants

- Catalog photos are `<button type="button">`, **not `<div>`** — reverting them makes every photo
  mouse-only, which a screenshot will not catch. The lightbox trigger contract is the
  `data-img`/`data-label` attribute pair, not a class.
- **Focusable inputs never drop below `font-size: 16px`** (`.parts-search`, the contact form
  fields). iOS Safari auto-zooms the page on focus below that and never zooms back out. Likewise
  `.nav-toggle` stays a 44×44 target, sized by its padding so the bar glyph geometry is untouched.
- The lightbox is `role="dialog" aria-modal="true"`, moves focus to the close button, pins Tab to
  it, and **restores focus to the photo that opened it** (grids run to 40 cards).
- Tab ARIA (`role`, `id`, `aria-controls`, `aria-selected`, roving `tabindex`) is **generated in
  JS** from the `data-cat`/`data-panel` strings. Never hand-write `id=`/`aria-controls` pairs into
  the markup — they would drift.
- Keep the shared `:focus-visible` outline rule working for anything new and interactive.

## 8. Verifying visually — headless Chrome on Windows

Full of silent-failure traps. The recipe that works:

- **`--dump-dom` is removed** (Chrome 132+) and fails silently — exit 0, zero bytes. To read
  computed/generated state, append a **probe `<script>`** to a throwaway copy of `index.html` in the
  **project root** (relative paths matter) that replaces `document.body.innerHTML` with a `<pre>` of
  the results, then screenshot and read it. Name it `index.screenshot*.html` (gitignored) and
  **delete it afterwards**. Use `Copy-Item` + `Add-Content`, never `Set-Content -Encoding utf8`,
  which mangles em dashes.
- **Launch with `Start-Process -Wait -NoNewWindow`**, not the `&` call operator (which produces no
  output and no error). Pass `--no-sandbox`; read progress off `-RedirectStandardError`.
- **Quote the `file://` URL.** The project path contains spaces; unquoted, Chrome splits it and
  fails with *"Multiple targets are not supported in headless mode."*
- Give `--virtual-time-budget=15000` and a tall `--window-size`; crop bands out of the tall PNG with
  PowerShell + `System.Drawing`. `1280,11000` reaches the footer; `1280,9000` does not.
- **Headless clamps the layout viewport to 500px minimum.** A 360px `--window-size` returns a
  360px-wide PNG but the page still laid out at 500px — a trap. Reason about narrower widths
  analytically, or check them in a real browser.
- **CSS transitions read stale under virtual time** — `setTimeout` fires long before a `.2s`
  transition settles, so `getComputedStyle` returns pre-transition values. Inject
  `* { transition: none !important }` when probing computed styles.
- Give each rapid launch its own `--user-data-dir`.
- Animated values are mid-flight in any screenshot (count-ups, reveal staggers). Read final values
  from the markup, not the PNG — or force `--force-prefers-reduced-motion` for a settled frame.
- `:hover` can't be tested headless; use `:focus-within` as the proxy (the nav pairs them in one
  selector list), and `autofocus` on a link inside the target.

## 9. Scope discipline

- **Don't edit `data.js`** for design reasons. Catalogue names are deliberately English-only even
  though source PDFs are bilingual.
- **Don't "fix" the groove-type tag mismatch** documented in CLAUDE.md's "Known open item" — it is
  unresolved pending the owner's leaflet check, and guessing makes it worse.
- **Don't reintroduce PhiComp order numbers** anywhere; their removal was deliberate.
- Retired patterns stay retired: `.info-card`/`.info-icon`/`.info-body` — extend `.panel-feature`
  instead.
- `.claude/skills/` and `.claude/agents/` are editor tooling — never link them from the site.
