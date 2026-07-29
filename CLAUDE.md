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
  `AUTOCONER_PARTS`, `AUTOCORO_PARTS`, `RIETER_PARTS`, `ZINSER_PARTS`, `ROTOR_CUP_BEARING`,
  `SOLID_ROTOR`). Loaded via `<script>` tag *before* `script.js`, so these are consumed as globals,
  not imports.
- `script.js` — vanilla JS in a single IIFE, wired up on `DOMContentLoaded`. No modules, no npm
  dependencies.
- `js/vendor/` — vendored GSAP runtime (`gsap.min.js`, `ScrollTrigger.min.js`), loaded from local
  files (not a CDN) *before* `data.js`/`script.js` so the site animates even when opened over
  `file://` offline. See "Motion layer" below.

There is no `package.json`, no linter, no test suite, and no build tooling — this is intentional,
not an oversight. To preview changes, open `index.html` directly in a browser or serve the folder
with any static file server; there is no compile/bundle step to run first.

For automated checking, headless Chrome works but has two gotchas on Windows: it **clamps the window
to roughly 500px minimum width**, so screenshots of the ≤640px breakpoints silently fail or render
at a wider viewport than requested (verify small screens in a real browser); and rapid successive
launches can fail to write the screenshot unless given their own `--user-data-dir`. `--dump-dom`
(after `--virtual-time-budget`) is the reliable way to verify the `data.js`-driven rendering, since
it returns the DOM after `script.js` has injected the catalog.

`.claude/skills/` holds installed Claude Code skills used when working on this site — GSAP guidance
(`gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-utils`, `gsap-performance`,
`gsap-plugins`), plus `design-taste-frontend` and `ui-ux-pro-max` design skills. These are editor
tooling, not shipped assets — never link them from the site.

## Architecture

### Category tab/panel system
The product catalog (`#products`) has 6 categories, in this display order: `rotors` (labelled
"Complete Rotors"), `autocoro`, `autoconer`, `ringframe` (labelled "Ring Frame"), `navels`,
`twindiscs`.
Each category is wired through **three places that must stay in sync** when adding, renaming or
reordering a category:
1. The nav "Products" dropdown links (`<a data-cat="...">` in the nav).
2. The `.cat-tab` buttons (`data-cat="..."`) in the products section.
3. The `.cat-panel` sections (`data-panel="..."`) holding each category's content.

`script.js`'s `activateCat(cat)` toggles `.is-active` on whichever tab/panel matches the given
`cat` value by attribute lookup — it doesn't care about DOM order, only matching `data-cat`/
`data-panel` strings. Reordering is therefore a pure markup move, no JS change.

The landing category is whichever tab/panel carries `is-active` **in the markup** — currently
`rotors`. Exactly one `.cat-tab` and one `.cat-panel` may carry it; zero leaves the catalog blank
until a tab is clicked, two stacks both panels. When reordering, move `is-active` to the new first
category rather than leaving it on the old one.

When moving a `.cat-panel` block, move it whole (including its preceding `<!-- -->` comment). The
panels contain the `id=` placeholders `script.js` renders into and the `data-target`/`data-count`
attributes pointing at them — a cut that clips a `</div>` breaks that category's search wiring
silently, with no console error.

### Header brand block & logo assets
The navbar brand (`a.logo`) is the ETS monogram **plus a live text wordmark** (`.logo-word`,
"Euro Textile Spares Pvt. Ltd." in `--ink`) — not a single image. The `<img>` therefore carries
`alt=""`: the visible text is the link's accessible name, and duplicating it in `alt` would make
screen readers announce the company twice.

Three logo files sit in `images/` and **the filenames are misleading** — check before swapping:
- `Logo_black.png` — the ETS mark alone, **transparent background**. This is the nav logo and the
  favicon. Despite the name, the artwork is brand blue, not black.
- `Logo_white.png` — the same blue mark but flattened onto an **opaque white** background. Unused,
  and unusable anywhere the backdrop isn't pure white; it renders as a visible white rectangle.
- `logo (1).png` — the original wide banner (mark + wordmark, 3300×1012, opaque white background).
  Still used for the **footer** logo, where `.footer-logo` gives it a deliberate white plate against
  the navy footer. Do not use it in the navbar.

**The nav collapses to the hamburger at `1100px`, not at the site's `900px` layout breakpoint.**
The wordmark widens the brand block enough that the inline nav links stop fitting below ~1100px, so
the nav-collapse rules live in their own `@media (max-width: 1100px)` block, separate from the
900px block that handles grid/layout collapse. Widening the brand block further (longer wordmark,
taller mark) means re-checking that boundary. Nothing in `script.js` hardcodes a breakpoint — the
hamburger is purely CSS-driven — so this is safe to move.

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

Two ambient infinite loops are **CSS keyframes**, not GSAP — that is the convention here:
- the clients marquee (`#clients`, `@keyframes scrollTrack`), which intentionally does **not** pause
  on hover;
- the rotor drawing's index ring (`.rotor-index`, `@keyframes rotorIndex`, one turn per 90s).

Both are stopped explicitly in the `@media (prefers-reduced-motion: reduce)` block rather than
relying on the blanket `animation-duration: .001ms` rule there. Note there is deliberately **no**
ScrollTrigger on the rotor figure: five of the six `.cat-panel`s are `display: none` at init, so a
trigger inside one resolves against a hidden element, and which panel carries `is-active` is a
markup decision that can move again.

### Two content patterns inside category panels
- **`.info-card`** (Complete Rotors, Twin Discs): a static hand-written icon + text
  card. Used where no real product photography exists yet.
- **`.panel-feature`** (Autoconer, Autocoro, Ring Frame): a two-column photo-left/copy-right layout
  showing a real machine photo (`images/machines/`) beside the category description. Use this
  pattern once real photography exists for a category currently on `.info-card`.

Complete Rotors is the landing panel and carries the most, in this order inside its `.rotor-tables`
wrapper below the `.info-card`: a hand-authored rotor drawing (`.rotor-spec`, see its own section
below), a `.coating-key` block decoding the D/DD/N/DN/DDN suffix, one search box, then the two
searchable type lists — a `.spec-table` of rotor cup/bearing types and a chip list of SolidRotor
types. Neither PhiComp range has per-SKU photography, so they render as `<tr>`s and `<li>`s rather
than photo `.part-card`s. See "Data-driven rendering" below.

**PhiComp's order numbers are deliberately not published.** They were removed from the markup *and*
from `data.js` — dropping the columns alone would have left all 53 numbers readable by anyone
opening `data.js`, which is served as plain text. Do not reintroduce them. Values identical on every
row (warranty, and SolidRotor's service life) live in a `.spec-foot` note beside each list rather
than as a column that repeats one value 37 times.

### Data-driven rendering (script.js)
`data.js` arrays are rendered into placeholder `<div>`s by ID (`navelGrid`, `autoconerParts`,
`autocoroParts`, `rieterParts`, `zinserParts`) via `renderNavels()`, `renderFlat()`, and
`renderGrouped()`. `renderGrouped()` is used where a part array carries a `group` field
(`AUTOCORO_PARTS`) and inserts a `.parts-group-title` heading whenever `group` changes — the array
order therefore determines the visual grouping, so entries sharing a `group` must stay adjacent.

Each part record is `{ en, img, code?, group? }`. `ROTOR_CUP_BEARING` (`{ type, speed }`) and
`SOLID_ROTOR` (`{ type }`) are the exception — no `img`. `renderRotorCupTable()` writes `<tr>`s into
the `<tbody id="rotorCupTable">`; `renderSolidRotorList()` writes `<li>` chips into the
`<ul id="solidRotorTable">` (the id keeps its `Table` name so the `data-target`/`data-count`
attributes still match). SolidRotor is a chip list rather than a table because every entry is
DD-coated for Autocoro 8–11, so the type is the only value that varies and a one-column table read
as empty. Both work with the same search because `wireSearch()`/`updateCount()`/`filterContainer()`
select on `[data-search]` generically and `setEmptyState()` falls back to the target element when
there is no `.table-scroll` wrapper.

Coating and expected service life are **derived from the type string, not stored**:
`coatingOf()` reads the suffix (`"C536/U-DN"` → `DN`, `"T 34 DDN"` → `DDN` — the regex lists the
longest alternatives first so `DDN`/`DD`/`DN` win over a bare `D`), and `serviceLife()` maps it via
the leaflet's rule `D: > 20'000 h, DD: > 35'000 h`, with `N` treated as a smooth top layer over the
same diamond coating so `DN` tracks `D` and `DDN` tracks `DD`. Adding a rotor type therefore needs
no coating field — but the suffix must be spelled correctly or the service-life column will be wrong.

The live search boxes (`.parts-search`) filter sibling elements carrying a `data-search` attribute
— `.part-card` divs, `<tr>`s in the rotor cup/bearing table, or `<li>` chips in the SolidRotor list
— by matching against a precomputed lowercased search string; no re-render happens on search, just
show/hide. `wireSearch()`/`updateCount()`/`filterContainer()` select generically on `[data-search]`
(not `.part-card`) specifically so all three patterns share one implementation — adding a fourth
needs no JS change, only the attribute. A single input can drive more than one container:
`data-target` takes a comma-separated list of element IDs (Rotors uses
`data-target="rotorCupTable,solidRotorTable"`, Ring Frame uses `"rieterParts,zinserParts"`) —
`wireSearch()` splits on the comma and re-runs the filter/count/empty-state logic per ID. Each
target needs its own `.parts-count[data-count="<id>"]`; without one, `updateCount()` returns early
and the count silently never appears. Matching also tries a
punctuation-stripped comparison (`normalizeSearch()`, strips everything but `a-z0-9` from both the
query and the stored string) alongside the raw substring match, so a query typed without spaces or
slashes (e.g. `"T34DD"`) still matches a stored value like `"t 34 dd"`. The "no results" message
(`.parts-empty`) is inserted as a sibling *after* the search target (or after its `.table-scroll`
wrapper, for `<tbody>` targets) rather than appended inside the target itself — appending a `<p>`
directly into a `<tbody>` would sit outside the valid table content model.

### Product photo pipeline (images/parts/)
The 280+ photos in `images/parts/` are **not individual photographs** — they were programmatically
cropped (via a headless-Chrome canvas script, not committed to this repo) from multi-part composite
spec-sheet page images that were themselves extracted from the manufacturer PDF catalogues in
`catalogues/`. The composite source pages are not part of this repo; only the final per-part crops
in `images/parts/` are committed. Practically: if a part photo is mis-cropped (wrong object,
cut off, overlapping a neighboring part), the fix is a new crop from the original PDF, not a
different source photo — there is no "clean" alternate image to swap in.

**The crops are not all square, and `.part-photo { min-height: 0 }` is load-bearing because of
that.** `.part-photo` sets `aspect-ratio: 1 / 1`, but it is also a flex item of the column-flex
`.part-card`, so its default `min-height: auto` resolves to its *content's* height — a portrait crop
(e.g. `246×579`) then stretches the box to ~403px and silently overrides the aspect ratio, leaving
the grid ragged with no error anywhere and the CSS still reporting `aspect-ratio: 1 / 1` as
computed. `min-height: 0` is what makes the square box actually hold. It reads like removable
tidying; it is not. Autoconer/Autocoro crops happen to be square, so the symptom only ever surfaced
in Ring Frame — meaning a regression here would again be invisible in the two biggest grids.
`.ring-grid` additionally sets `grid-auto-rows: 1fr` to level the residual row-height differences
that come from name length; do **not** line-clamp those names, as the four Rieter carrier parts
differ only by their `(Peg left/right · Gauge 70/75 mm)` suffix.

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
  `images/` root holds the company logo files — see "Header brand block & logo assets" above.

### Rotor spec-sheet drawing (Complete Rotors panel)
`.rotor-spec` is the site's second hand-authored inline SVG — a rotor drawn as a dimensioned section
in the vernacular of the PhiComp leaflet. Four things hold it together:

- **The 72 index ticks are one dashed circle, never 72 paths.** `pathLength="720"` makes the dash
  array read in 1/720ths regardless of radius, so `stroke-dasharray="1.6 8.4"` (sum 10) yields 72
  ticks and `"2 88"` (sum 90) yields the 8 majors at 45°. `stroke-width` is a tick's *radial length*
  and the dash is its *width* — confusing the two makes the majors read as blobs instead of longer
  ticks.
- **Both labels sit on the vertical centre line** (speed above, Ø below). An earlier version tucked
  them into the corners, which is exactly where the ring's outer edge (r 179) reaches, so they
  overlapped it — and worse once the ≤640px rules scale the type up. On the axis the ring is 179
  units away horizontally, which makes a collision geometrically impossible at any type size. Keep
  new labels on the axis rather than re-opening that problem.
- **The `viewBox` is x-offset** (`110 0 380 490`) instead of starting at 0, so the frame hugs the
  content (x 121–479) while staying centred on the rotor's `cx=300` (110 + 380/2). Moving `cx`/`cy`
  or the ring radii means recomputing it.
- **It is `aria-hidden`**, so every fact it draws is repeated as real text in the `<figcaption>`
  under it. Add a label to the drawing and you must add it to the caption too.

Only `.rotor-index` rotates, via `transform-box: fill-box; transform-origin: center` — both tick
circles are concentric, so the group's fill-box centre *is* the rotor centre and no coordinates are
duplicated in the CSS.

### About section stat-line
The About section (`#about`) is a two-column intro plus a hand-authored inline **SVG infographic**
(`.about-stats`): a curved `.stats-line` path whose cubic-segment anchors are the four `.stat-node`
points (so the node dots sit exactly on the curve). Editing a node means keeping its `<circle>`,
`.stat-drop` line, and `<text>` coordinates in sync with the path anchor. Below `820px` the SVG is
hidden and `.about-stats-grid` (a 2×2 card fallback) shows the same four stats — update both.
