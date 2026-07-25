# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static marketing website for Euro Textile Spares Pvt. Ltd. (a Pune-based importer/distributor of
European and Taiwanese textile-machinery spare parts). No framework, no build step, no bundler.

- `index.html` — all page markup/structure.
- `style.css` — all styling. Custom-property design system defined in `:root` at the top
  (`--primary`, `--navy`, `--r-card`, `--shadow-lift`, etc.) — reuse these tokens rather than
  hardcoding colors/spacing. Neutrals are deliberately cool/blue-tinted to harmonize with the brand
  blue: `--cloud` (section tint), `--mist` (lighter gradient top), `--glow` (faint hero accent) —
  do not revert these to plain greys.
- `data.js` — catalog data as plain global `const` arrays (`NAVELS`, `NAVEL_MACHINES`,
  `AUTOCONER_PARTS`, `AUTOCORO_PARTS`, `RIETER_PARTS`, `ZINSER_PARTS`). Loaded via `<script>` tag
  *before* `script.js`, so these are consumed as globals, not imports.
- `script.js` — vanilla JS in a single IIFE, wired up on `DOMContentLoaded`. No modules, no npm
  dependencies.
- `js/vendor/` — vendored GSAP runtime (`gsap.min.js`, `ScrollTrigger.min.js`), loaded from local
  files (not a CDN) *before* `data.js`/`script.js` so the site animates even when opened over
  `file://` offline. See "Motion layer" below.

There is no `package.json`, no linter, no test suite, and no build tooling — this is intentional,
not an oversight. To preview changes, open `index.html` directly in a browser or serve the folder
with any static file server; there is no compile/bundle step to run first.

`.claude/skills/` holds installed Claude Code skills used when working on this site — GSAP guidance
(`gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-utils`, `gsap-performance`,
`gsap-plugins`), plus `design-taste-frontend` and `ui-ux-pro-max` design skills. These are editor
tooling, not shipped assets — never link them from the site.

## Architecture

### Category tab/panel system
The product catalog (`#products`) has 7 categories (`rotors`, `cups`, `navels`, `autoconer`,
`autocoro`, `ringframe`, `twindiscs`). Each category is wired through **three places that must stay
in sync** when adding/renaming a category:
1. The nav "Products" dropdown links (`<a data-cat="...">` in the nav).
2. The `.cat-tab` buttons (`data-cat="..."`) in the products section.
3. The `.cat-panel` sections (`data-panel="..."`) holding each category's content.

`script.js`'s `activateCat(cat)` toggles `.is-active` on whichever tab/panel matches the given
`cat` value by attribute lookup — it doesn't care about DOM order, only matching `data-cat`/
`data-panel` strings.

### Motion layer (script.js `wireMotion()`)
GSAP drives the site's animation: a hero-entrance timeline, `ScrollTrigger.batch` scroll-reveals
over `REVEAL_SEL` (`.section-head, .about-intro, .mfr-card, .cap-card, .value-item` — one batched
trigger, **never one per part-card**, to keep the 290+ catalog smooth), a hero credential count-up,
and the About stat-line draw-in (`aboutCurve()`). Three rules this layer follows — keep them when
editing:
1. **Graceful fallback** — if `window.gsap`/`ScrollTrigger` are absent, it calls `legacyReveal()`
   (IntersectionObserver + `.reveal-hidden`/`.reveal-visible`), so content still appears.
2. **Reduced motion** — it bails early on `prefers-reduced-motion: reduce`, leaving everything in its
   natural fully-visible state; the CSS has a matching `@media (prefers-reduced-motion: reduce)`
   block. Animations use `gsap.matchMedia("(prefers-reduced-motion: no-preference)")`.
3. **Never leave content stuck hidden** — anything animated with `.from()`/`autoAlpha:0` that is
   above the fold has a native `setTimeout` failsafe forcing the visible end-state (guards against a
   throttled rAF ticker in a background tab). Preserve these failsafes.

The clients marquee (`#clients`) is a **CSS keyframe** loop (`@keyframes scrollTrack`), not GSAP,
and intentionally does **not** pause on hover.

### Two content patterns inside category panels
- **`.info-card`** (Rotors, Rotor Cups & Bearings, Twin Discs): a static hand-written icon + text
  card. Used where no real product photography exists yet.
- **`.panel-feature`** (Autoconer, Autocoro, Ring Frame): a two-column photo-left/copy-right layout
  showing a real machine photo (`images/machines/`) beside the category description. Use this
  pattern once real photography exists for a category currently on `.info-card`.

### Data-driven rendering (script.js)
`data.js` arrays are rendered into placeholder `<div>`s by ID (`navelGrid`, `autoconerParts`,
`autocoroParts`, `rieterParts`, `zinserParts`) via `renderNavels()`, `renderFlat()`, and
`renderGrouped()`. `renderGrouped()` is used where a part array carries a `group` field
(`AUTOCORO_PARTS`) and inserts a `.parts-group-title` heading whenever `group` changes — the array
order therefore determines the visual grouping, so entries sharing a `group` must stay adjacent.

Each part record is `{ en, img, code?, group? }`. The live search boxes (`.parts-search`) filter
sibling `.part-card` elements by matching against a precomputed `data-search` string (English name
+ code + group, lowercased) — no re-render happens on search, just show/hide.

### Product photo pipeline (images/parts/)
The 280+ photos in `images/parts/` are **not individual photographs** — they were programmatically
cropped (via a headless-Chrome canvas script, not committed to this repo) from multi-part composite
spec-sheet page images that were themselves extracted from the manufacturer PDF catalogues in
`catalogues/`. The composite source pages are not part of this repo; only the final per-part crops
in `images/parts/` are committed. Practically: if a part photo is mis-cropped (wrong object,
cut off, overlapping a neighboring part), the fix is a new crop from the original PDF, not a
different source photo — there is no "clean" alternate image to swap in.

### English-only data convention
Catalog part names in `data.js` are deliberately English-only, even though the source PDF
catalogues are bilingual (German/English). When adding new catalogue-derived entries, translate
or strip German rather than keeping bilingual strings like `"Driver / Mitnehmer"`.

### Reference material vs. served assets
- `catalogues/` — source manufacturer PDF catalogues (Samatex, Emil Broell, etc.). Reference only;
  not linked from the site.
- `docs/` — one PDF (`Autocoro338_Parts_list_revised.pdf`) that *is* linked from the Autocoro panel
  ("Additional Parts" button).
- `images/catalogue/` — Broell navel photos (16). `images/machines/` — the 3 category hero photos.
  `images/manufacturers/` — 4 partner logos. `images/parts/` — the cropped product photos described
  above. `images/clients/` — client logos for the "Our Clients" marquee (SVG/PNG; note
  `vardhman.svg` is the trimmed icon-only mark, paired with hand-set brand text in the markup).

### About section stat-line
The About section (`#about`) is a two-column intro plus a hand-authored inline **SVG infographic**
(`.about-stats`): a curved `.stats-line` path whose cubic-segment anchors are the four `.stat-node`
points (so the node dots sit exactly on the curve). Editing a node means keeping its `<circle>`,
`.stat-drop` line, and `<text>` coordinates in sync with the path anchor. Below `820px` the SVG is
hidden and `.about-stats-grid` (a 2×2 card fallback) shows the same four stats — update both.
