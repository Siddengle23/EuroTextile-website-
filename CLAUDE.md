# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static marketing website for Euro Textile Spares Pvt. Ltd. (a Pune-based importer/distributor of
European and Taiwanese textile-machinery spare parts). No framework, no build step, no bundler.

- `index.html` — all page markup/structure. The `<head>` also carries the canonical link, the
  Open Graph / Twitter card block and a JSON-LD `Organization` script; every value in the JSON-LD
  is duplicated from visible page content (contact section, manufacturers grid) and must stay in
  sync with it.
- `style.css` — all styling. Custom-property design system defined in `:root` at the top
  (`--primary`, `--navy`, `--r-card`, `--shadow-lift`, etc.) — reuse these tokens rather than
  hardcoding colors/spacing. Neutrals are deliberately cool/blue-tinted to harmonize with the brand
  blue: `--cloud` (section tint), `--mist` (lighter gradient top), `--glow` (faint hero accent) —
  do not revert these to plain greys.
- `data.js` — catalog data as plain global `const` arrays (`NAVELS`, `NAVEL_MACHINES`,
  `AUTOCONER_PARTS`, `AUTOCORO_PARTS`, `RIETER_PARTS`, `ZINSER_PARTS`, `ROTOR_CUP_BEARING`,
  `SOLID_ROTOR`, `TWIN_DISCS`, `FRICTION_DISC`, `PU_FRICTION_WHEEL`). Loaded via `<script>` tag
  *before* `script.js`, so these are consumed as globals, not imports.
- `robots.txt` / `sitemap.xml` / `images/og-image.jpg` — SEO and social-preview assets. The
  absolute URLs in the `<head>` meta block, in `robots.txt` and in `sitemap.xml` all assume the
  site is served from `https://www.eurotextilespares.com/` (inferred from the contact email
  domain, **not confirmed**). `og:url`/`og:image` must stay absolute — relative paths are ignored
  by WhatsApp/LinkedIn/Facebook. `og-image.jpg` is 1200×630, generated with PowerShell +
  `System.Drawing` from `images/Logo_black.png`; the generator is not committed.
- `.gitignore` — keeps the raw source-photo folders out of the repo. See "Reference material vs.
  served assets".
- `script.js` — vanilla JS in a single IIFE, wired up on `DOMContentLoaded`. No modules, no npm
  dependencies.
- `js/vendor/` — vendored GSAP runtime (`gsap.min.js`, `ScrollTrigger.min.js`), loaded from local
  files (not a CDN) *before* `data.js`/`script.js` so the site animates even when opened over
  `file://` offline. See "Motion layer" below.

There is no `package.json`, no linter, no test suite, and no build tooling — this is intentional,
not an oversight. To preview changes, open `index.html` directly in a browser or serve the folder
with any static file server; there is no compile/bundle step to run first.

For automated checking, headless Chrome works, with several Windows gotchas:

- **`--dump-dom` is gone.** It went with old headless, removed in Chrome 132 (local Chrome is 150).
  It fails silently — exit code 0, zero bytes, no error. Verify `data.js`-driven rendering from a
  `--screenshot` instead.
- **Launch it with `Start-Process -Wait -NoNewWindow`, not the `&` call operator.** Under `&` in this
  sandbox Chrome produces no output at all and writes no file, again with no error; the same argument
  list via `Start-Process` works. Pass `--no-sandbox`, and read the progress line ("N bytes written
  to file …") off `-RedirectStandardError`.
- It **clamps the window to roughly 500px minimum width**, so screenshots of the ≤640px breakpoints
  render wider than requested — 500px still exercises the ≤640px rules, but verify true phone widths
  in a real browser.
- Rapid successive launches can fail to write the screenshot unless each gets its own
  `--user-data-dir`.
- Give `--virtual-time-budget` ~15000 and an explicit tall `--window-size`. **`1280,9000` is not
  enough for the whole page** — the landing (Complete Rotors) view runs to roughly 9,600px, so the
  footer falls outside a 9000px frame and the crop comes back empty navy. Use `1280,11000` when you
  need the footer; `1280,9000` is fine for anything above it. Crop bands out of the tall PNG with
  `System.Drawing`, same as the image pipeline below.
- **The count-up numbers are mid-animation in any screenshot.** `countUp()` animates `.cred-num`
  from 0, so the hero credentials capture as arbitrary intermediate values (`2458+`, `38%`, `2`).
  That is not a bug and not a data error — read the final values from `index.html`, not the PNG.
- **If the page scrolls itself, the screenshot goes unreliable.** Loading a URL with a hash that
  lands inside a `.cat-panel` (see `wireHashDeepLink()`) scrolls the document, and a
  viewport-sized `--window-size` then captures a blank or misaligned frame. Use the tall window
  and crop for the band that actually holds content — the scroll offset shifts where that band
  is, so find it rather than assuming a fixed y.
- **Headless has no pointer, so `:hover` cannot be tested — use `:focus-within` as the proxy.**
  The nav's dropdown rules pair the two in one selector list
  (`.has-dropdown:hover .dropdown, .has-dropdown:focus-within .dropdown`), so putting `autofocus`
  on a link inside the dropdown exercises the identical declaration block. That is how the mobile
  transform bug documented under "Category tab/panel system" was reproduced and then confirmed
  fixed. It only works where the target is already visible: an element that starts
  `visibility: hidden` (the desktop dropdown) cannot take focus, so the trick is mobile-only and
  desktop hover still needs a real browser.
- Forcing a state for a screenshot means a **throwaway copy of `index.html` in the project root**,
  not the scratchpad — `style.css`, `script.js` and `images/` are all relative. Delete it straight
  after; nothing about it should ever be committed (`.gitignore` covers `index.screenshot*.html`
  as a backstop, so prefer that name). Note PowerShell's `Set-Content -Encoding utf8`
  mangles the em dashes into mojibake in that copy, which is cosmetic but makes the screenshot
  confusing to read — the real files are untouched. **`Copy-Item` + `Add-Content` avoids that
  entirely**: copying is byte-exact and appending only adds bytes at the end, so the original
  UTF-8 is never rewritten.
- **The replacement for `--dump-dom` is a probe script appended to that throwaway copy.** Append a
  `<script>` that runs on `load`, reads whatever computed/generated state you need, and replaces
  `document.body.innerHTML` with a `<pre>` of the results — then screenshot it and read the text.
  This is how the generated tab ARIA, the rendered card/row counts and the `[data-img]` trigger
  count were all verified in one shot, none of which is visible in a normal screenshot. Appending
  after `</html>` still executes. Use a short `setTimeout` (~900ms) so `DOMContentLoaded` rendering
  and the GSAP init have finished first.
- **A hash deep-link is a reliable way to force a non-landing panel** for a screenshot, without
  editing anything: `index.html#sub-twin-discs` makes `wireHashDeepLink()` activate that panel.
  Combine with the tall window and hunt for the band, per the scrolling caveat above.

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

**The tabs implement the WAI-ARIA tabs pattern, and all of it is generated in JS from the
`data-cat`/`data-panel` strings — deliberately, so it adds no new markup to keep in sync.**
`wireTabAria()` stamps `role="tab"`, `id="cat-tab-<cat>"` and `aria-controls` onto each
button and `role="tabpanel"`, `id="cat-panel-<cat>"`, `aria-labelledby` and `tabindex="0"` onto
each panel; `activateCat()` maintains `aria-selected` plus a **roving `tabindex`** (the active tab
is `0`, the rest `-1`, so the strip is one Tab stop); `wireTabKeys()` handles Left/Right/Home/End.
Adding a category still needs no ARIA attributes in the markup. Do not hand-write `id=`/
`aria-controls` pairs into `index.html` — they would drift. The markup keeps only
`role="tablist"` on `.cat-tabs`, which is what the generated roles hang off.

**`wireTabs()` calls `activateCat()` once at init**, on whichever tab carries `.is-active` in the
markup. That is not redundant with the markup class: the landing category's `aria-selected` and
roving `tabindex` exist only in JS, so without this call the page loads with all six tabs in the
Tab order and none announced as selected until the user clicks something. Purely an ARIA-state
sync — it toggles the same classes that are already correct.

**Category links are wired by `a[data-cat]`, not by location.** `wireTabs()` binds *every* anchor
carrying `data-cat` — the nav dropdown, its `.subdropdown` sub-links, and the footer's Products
column all run through the same listener, so a new category link anywhere on the page works just
by being an `<a>` with `data-cat`. The selector is `a[data-cat]` and not `[data-cat]` specifically
because `.cat-tab` is a `<button>`: tabs are handled separately and must *not* also scroll.

The landing category is whichever tab/panel carries `is-active` **in the markup** — currently
`rotors`. Exactly one `.cat-tab` and one `.cat-panel` may carry it; zero leaves the catalog blank
until a tab is clicked, two stacks both panels. When reordering, move `is-active` to the new first
category rather than leaving it on the old one.

When moving a `.cat-panel` block, move it whole (including its preceding `<!-- -->` comment). The
panels contain the `id=` placeholders `script.js` renders into and the `data-target`/`data-count`
attributes pointing at them — a cut that clips a `</div>` breaks that category's search wiring
silently, with no console error.

**Sub-categories are a fourth sync point.** Four of the six categories carry a `.subdropdown`
flyout in the nav (`<li class="has-sub">`): Complete Rotors → rotor cup & bearing / SolidRotor,
Ring Frame → Rieter / Zinser, Navels → the four Broell series, Twin Discs → twin discs / friction
disc / friction wheel. Autocoro and Autoconer have none. Each sub-link is
`<a href="#<id>" data-cat="<category>" data-sub="<id>">`, and `<id>` must match an `id=` on a
heading **inside that category's panel** — `sub-rotor-cup`, `sub-solid-rotor`, `sub-rieter-ring`,
`sub-zinser-ring`, `sub-twin-discs`, `sub-friction-disc`, `sub-friction-wheel` sit on hand-written
headings in the markup; the four `sub-navel-*` ids are **generated** by `renderNavels()` from the
`NAVEL_SERIES` map in `script.js` (see "Data-driven rendering"). A typo'd id fails silently — the
panel still switches, the page just doesn't scroll.

The scroll itself is the **browser's own hash jump**, not `scrollIntoView`: a click listener runs
before the default action, so `activateCat()` has already un-hidden the panel by the time the
anchor resolves. That is why `wireTabs()` skips its `scrollIntoView` when `data-sub` is present —
two scrolls to different targets on one frame would fight, and the native one wins. It still calls
`refreshAfterScroll()` on both paths (see "Motion layer"). `.parts-group-title, .ring-group-title`
carry `scroll-margin-top: 100px` to clear the sticky 84px navbar; a new anchor on some other
element needs its own. `wireHashDeepLink()` handles the cold-load case (a copied/bookmarked
sub-link), where the target's panel is `display:none` and the browser skips the jump entirely.

Adding nav items also means re-checking `.nav-links.open`'s `max-height` in the 1100px block — the
flyouts flatten into a static indented list below that width, and the 11 sub-items already pushed
the open menu past the old 720px cap (now `85vh`, with the `overflow-y: auto` that was already
there).

**The 1100px flatten rules deliberately repeat their `:hover` / `:focus-within` selectors — that
is a specificity guard, not redundancy.** `.has-dropdown:hover .dropdown` is `(0,3,0)` because a
pseudo-class counts as a class, so the plain `.has-dropdown .dropdown` override at `(0,2,0)` loses
to it regardless of sitting later and inside a media query. The desktop
`transform: translateX(-50%)` then came back on hover and slid the flattened list half its width
out of the menu — and `.nav-links.open` only overrides `overflow-y`, leaving `overflow-x: hidden`
from the closed state's `overflow: hidden` shorthand, so it was clipped rather than scrollable:
text off-screen, white gap where the menu should be. The override lists all three selectors
(`.has-dropdown .dropdown, .has-dropdown:hover .dropdown, .has-dropdown:focus-within .dropdown`)
to match at `(0,3,0)` and win on source order, and does the same for
`.has-sub:hover > .subdropdown` (keep the child combinator — changing it changes what matches).
Collapsing either back to a single bare selector reintroduces the bug, and only under a pointer or
keyboard focus at ≤1100px, so a static screenshot won't catch it.

### Photo lightbox (`script.js` `wireLightbox()`)
Clicking a catalog photo zooms it in `#lightbox`. **The trigger contract is the `data-img` /
`data-label` attribute pair, not a class** — one delegated listener on `document` matches
`[data-img]`, which is how the same code serves both `.part-photo` (written by `partCard()`) and
`.navel-photo` (written by `renderNavels()`). A renderer that stops emitting those two attributes
silently loses zoom, with no console error. Adding zoom to a third photo type needs no JS change,
only the attributes.

Both photo elements are `<button type="button">`, **not `<div>`** — they are interactive, so they
must be reachable and operable from the keyboard. `style.css` carries the matching
border/background/font resets on `.part-photo` and `.navel-photo`; the shared `button:focus-visible`
rule already gives them a focus ring. Reverting either to a `<div>` makes every catalog photo
mouse-only again, which a screenshot will not catch.

The lightbox is a `role="dialog" aria-modal="true"` that moves focus to `.lb-close` on open,
restores focus to the photo that opened it on close (important — the grids run to 40 cards, so
dropping focus to the top of the document strands keyboard users), and pins Tab to the close
button while open. **It zooms one photo; it is deliberately not a gallery** — there is no
prev/next control, and `.lb-counter` is reused to show the part label rather than "3 / 40".

### Contact form (`script.js` `wireForm()`)
Posts to **formsubmit.co** (`https://formsubmit.co/ajax/dengle@eurotextilespares.com`) via
`fetch`, not a native form POST — `wireForm()` calls `preventDefault()`, checks
`form.checkValidity()` (the form is `novalidate`, so this is the only validation), and writes
outcome text into `.form-status[role="status"][aria-live="polite"]`. There is **no backend in this
repo**; the hidden `_subject` / `_template` / `_captcha` inputs are formsubmit.co's own
configuration fields, and `_honey` is its spam honeypot (kept `display:none` and
`tabindex="-1"` — do not "fix" it into a visible field).

**formsubmit.co requires a one-time email activation before it will deliver anything.** Until that
is completed, the endpoint can still return OK and the visitor sees the success message while no
mail arrives. If inquiries are reported missing, test with a real submission before debugging the
JS — the front end is almost certainly fine.

### Clients marquee — the logo list is hand-duplicated
`#clients`' `.slider-track` contains **every client logo twice** ("Set 1" / "Set 2" in the markup).
That is what makes `@keyframes scrollTrack`'s `translateX(-50%)` loop seamlessly: at -50% the
track has scrolled exactly the first copy's width, so it lands back on an identical frame.
**Adding, removing or reordering a client means editing both copies identically.** Editing only
one desynchronises the halves and the loop visibly jumps once per cycle — and because the seam
passes by only every 35s, it is easy to miss in a quick check.

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
over `REVEAL_SEL` (`.section-head, .about-intro, .mfr-card, .cap-card` — batched
triggers, **never one per part-card**, to keep the 100-card catalog smooth), a hero credential count-up,
and the About stat-line draw-in (`aboutCurve()`). Four rules this layer follows — keep them when
editing:
1. **Graceful fallback** — if `window.gsap`/`ScrollTrigger` are absent, it calls `legacyReveal()`
   (IntersectionObserver + `.reveal-hidden`/`.reveal-visible`), so content still appears.
2. **Reduced motion** — it bails early on `prefers-reduced-motion: reduce`, leaving everything in its
   natural fully-visible state; the CSS has a matching `@media (prefers-reduced-motion: reduce)`
   block. Animations use `gsap.matchMedia("(prefers-reduced-motion: no-preference)")`.
3. **Never leave content stuck hidden** — anything animated with `.from()`/`autoAlpha:0` that is
   above the fold has a native `setTimeout` failsafe forcing the visible end-state (guards against a
   throttled rAF ticker in a background tab). `guardVisible()` extends the same idea below the fold:
   on `window.load`, it sweeps `REVEAL_SEL` and forces `autoAlpha:1` on anything inside the viewport
   still computed `visibility:hidden` — a last-resort net for a trigger left stale by a layout change
   the code below didn't refresh for. Preserve all of these failsafes.
4. **`scrollReveals()` uses two batches, not one** — `REVEAL_BASE` (`start:"top 85%"`, 0.7s,
   stagger 0.12) for everything, and `REVEAL_FAST` (`start:"top 92%"`, 0.55s, stagger 0.08) for just
   `#capabilities`. Capabilities is a common nav jump target ("Capabilities" link) that sits right
   below the tall product catalog, so a slower reveal reads as the page being stuck; the rest of the
   page keeps the original rhythm. Both run through a shared `revealBatch(gsap, ST, els, cfg)`
   helper — add a third timing tier by partitioning into a third array and calling it again, not by
   forking the batch logic itself.

**`activateCat()` must trigger a `ScrollTrigger.refresh()` after every category swap, but the two
call sites need different timing.** Panel heights differ by thousands of pixels (Complete Rotors
runs past 7000px, Autocoro 40 cards, Autoconer 27, Twin Discs 4 cards plus two short tables), so
every trigger below `#products` — Manufacturers, Capabilities — goes stale after a swap unless
refreshed; without this, some swaps left Capabilities'
cards permanently invisible (wrong cached trigger position). But `ScrollTrigger.refresh()` briefly
snaps scroll position to remeasure, and if that happens on the same frame as an in-flight
`scrollIntoView({behavior:"smooth"})`, it aborts the smooth scroll outright (any direct scroll write
cancels a CSS smooth scroll per spec) — this is exactly what broke the Products dropdown links
(tab/panel switched correctly, but the page never scrolled there). The fix, in `wireTabs()`:
- `.cat-tab` clicks call `refreshMotion()` immediately — no scroll happens here, so there's no race.
- `a[data-cat]` clicks (nav dropdown, sub-links, footer) call `scrollIntoView` then
  `refreshAfterScroll()`, which defers the
  refresh until scrolling actually settles (`scrollend` event, with a 700ms `setTimeout` fallback for
  browsers without it) instead of firing on the same frame.

Both helpers live next to `REVEAL_SEL`. Don't collapse them back into one immediate call — that's
the exact regression this documents.

Two ambient infinite loops are **CSS keyframes**, not GSAP — that is the convention here:
- the clients marquee (`#clients`, `@keyframes scrollTrack`), which intentionally does **not** pause
  on hover;
- the rotor drawing's index ring (`.rotor-index`, `@keyframes rotorIndex`, one turn per 90s).

Both are stopped explicitly in the `@media (prefers-reduced-motion: reduce)` block rather than
relying on the blanket `animation-duration: .001ms` rule there. Note there is deliberately **no**
ScrollTrigger on the rotor figure: five of the six `.cat-panel`s are `display: none` at init, so a
trigger inside one resolves against a hidden element, and which panel carries `is-active` is a
markup decision that can move again.

### One content pattern inside category panels: `.panel-feature`
All 6 categories now share the same header: `.panel-feature`, a two-column photo-left/copy-right
layout showing a machine photo (`images/machines/`) beside the category description. This used to
be split between `.panel-feature` (Autoconer, Autocoro, Ring Frame, which had real machine photos)
and `.info-card` (Complete Rotors, Twin Discs — a static icon + text card, used only because no
photo existed yet). `.info-card`/`.info-icon`/`.info-body` are retired now that all 6 categories
have a photo — don't reintroduce them for a future category; extend `.panel-feature` instead.

Complete Rotors, Navels, and Twin Discs sell components fitted *inside* open-end/rotor-spinning
machines (Rieter R-series, Schlafhorst/Saurer SE/BD/Autocoro, Suessen SC-series, Taitan, Rifa) —
none of them is a standalone machine the way Autoconer/Autocoro/Ring Frame are. Their photos
(`Rotors Machine.jpg`, `Navels Machine.jpg`, `Twin Discs Machine.jpg`) are therefore illustrative
host-machine shots, not photos of the exact part being sold. `Rotors Machine.jpg` and
`Navels Machine.jpg` are real photography supplied directly (matching the `-v2-` parts-photo
convention below) — close/cropped enough that no manufacturer nameplate is visible. **Their `alt`
text must describe the frame, not name a model**: no nameplate is visible in either, so an alt
asserting a specific machine is unverifiable. (The Navels alt did read "Rieter R 70…", copy-pasted
from the Twin Discs one, which is the only photo actually sourced from Rieter.)
`Twin Discs Machine.jpg` is still a cropped still from Rieter's official product photography
(rieter.com), used on the reasoning that Euro Textile Spares is an authorized distributor for
these OEMs, pending real photography for that category too; free/CC-licensed photography of this
specific equipment doesn't meaningfully exist (checked Wikimedia Commons, Unsplash, Pexels,
Pixabay — only an old 1987 archive photo or generic unrelated textile-machine stock turned up).
Whichever source, keep the frame tight enough to exclude visible brand nameplates/logos on the
machine housing — that's a deliberate choice, not an accident of cropping.

Complete Rotors is the landing panel and carries the most, in this order inside its `.rotor-tables`
wrapper below the `.panel-feature` block: a hand-authored rotor drawing (`.rotor-spec`, see its own section
below), a `.coating-key` block decoding the D/DD/N/DN/DDN suffix, one search box, then the two
searchable type lists — a `.spec-table` of rotor cup/bearing types and a chip list of SolidRotor
types — each preceded by a `.rotor-photo-pair` of two real product photos. Neither PhiComp range has
*per-SKU* photography (four photos against 37 + 16 types), so the lists themselves still render as
`<tr>`s and `<li>`s rather than photo `.part-card`s; the pairs are illustrative examples, which is
why each is followed by a `.panel-note` saying so and pointing at the full list below. See
"Data-driven rendering" below.

`.rotor-photo-pair` is **static markup, deliberately not `data.js`-driven** — the figures carry no
`data-search` attribute, so the panel's search box leaves them alone. That is the point: filtering
the type table should not blank out the illustrations above it. If a future category wants the same
pattern, copy the markup; there is nothing to register in `script.js`.

**PhiComp's order numbers are deliberately not published.** They were removed from the markup *and*
from `data.js` — dropping the columns alone would have left all 53 numbers readable by anyone
opening `data.js`, which is served as plain text. Do not reintroduce them. Values identical on every
row (warranty, and SolidRotor's service life) live in a `.spec-foot` note beside each list rather
than as a column that repeats one value 37 times.

### Data-driven rendering (script.js)
`data.js` arrays are rendered into placeholder `<div>`s by ID (`navelGrid`, `autoconerParts`,
`autocoroParts`, `rieterParts`, `zinserParts`) via `renderNavels()` and `renderFlat()`. All four part
grids render flat now — `AUTOCORO_PARTS` used to carry a `group` field and render through a
`renderGrouped()` that inserted a `.parts-group-title` heading per machine subsystem, but that was
retired when the Autocoro photos were replaced (see "Product photo pipeline" below): far fewer
parts have real photography than the old cropped set, so the subsystem grouping was dropped in
favour of one flat list, matching Autoconer. The Rotors panel's coating-key and
rotor-cup/SolidRotor headings are hand-written instances of `.parts-group-title`.

`renderNavels()` is the one renderer that still generates `.parts-group-title` headings: it emits
one whenever `series` changes while mapping `NAVELS` (already in catalogue order, 4 per series),
so the navel grid reads as four labelled groups. The heading's `id` and short label come from the
`NAVEL_SERIES` map beside the function, which maps the catalogue's series string
(`"Quality — high performance"`) to the anchor the nav's Navels flyout links at
(`sub-navel-high-performance` / "High Performance") — keep the two in sync. A series missing from
the map still renders its cards under the raw series string, just with no `id` to link to. The
headings sit *inside* `#navelGrid` rather than between grids because `.parts-group-title` is
`grid-column: 1 / -1`; each card also still repeats its full series wording in `.navel-info .series`.

Each part record is `{ en, img, code?, group? }`, though no live array currently populates `code` or
`group` — both remain supported for a future dataset that needs them. `ROTOR_CUP_BEARING`
(`{ type, speed }`) and
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

Twin Discs (`data-panel="twindiscs"`) mixes both approaches in one panel: `TWIN_DISCS` (`{ en,
img }`) has real per-type photography, so it renders as a `.parts-grid` via the same generic
`renderFlat()`; `FRICTION_DISC` (`{ type, od, thickness, bore }`) and `PU_FRICTION_WHEEL` (`{ type,
code, od }`) have no per-SKU photography (the CPU catalogue shows one composite cluster photo per
family, several variants bunched into a single shot, not one clean image per lettered type) and
render as `<tr>` rows via `renderFrictionDiscTable()`/`renderPUFrictionWheelTable()` — same shape as
`renderRotorCupTable()`. Unlike the pure-text PhiComp tables, though, each of these two *does* get a
representative photo: a `<figure class="rotor-spec">`/`<figcaption class="rotor-spec-cap">` (the
same classes the rotor spec-sheet drawing uses, extended with a plain `.rotor-spec img` rule since
that class was originally SVG-only) sits above each table, showing the cropped catalogue photo with
a caption restating the facts (hardness/compatible machines for Friction Disc) as real text — same
principle as the rotor drawing's aria-hidden SVG plus its figcaption, just photo instead of SVG.

`#twinDiscParts` overrides the shared `.parts-grid` column rule with its own
(`grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))`, right after the shared rule in
style.css): Autoconer/Autocoro/Ring Frame render dozens of cards so the shared `auto-fill,
minmax(158px, 1fr)` fills the row naturally, but Twin Discs only ever has 4, and `auto-fill` still
reserves empty 158px tracks instead of letting those 4 stretch — hence the scoped, larger override
rather than changing the shared rule.

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
`images/parts/` holds two generations of photos, both committed:

- **`autoconer-NNN.jpg` / `autocoro-NNN.jpg` / `rieter-NN.jpg` / `zinser-NN.jpg`** (~281 files) —
  the original photos, **not individual photographs**: they were programmatically cropped (via a
  headless-Chrome canvas script, not committed to this repo) from multi-part composite spec-sheet
  page images extracted from the manufacturer PDF catalogues in `catalogues/`. **No longer
  referenced by `data.js`** as of 2026-07 (superseded by real photography, below) — kept on disk
  deliberately rather than deleted, in case they're needed again. The composite source pages
  themselves are not part of this repo.
- **`autoconer-v2-NN.jpg` / `autocoro-v2-NN.jpg` / `rieter-v2-NN.jpg` / `zinser-v2-NN.jpg`** (96
  files) — real product photography, supplied directly (not derived from the PDF catalogues) and
  currently live in `data.js`. Far fewer parts have a photo this way than the old cropped set
  (27/40/15/14 vs. 124/124/17/16), which is why Autocoro dropped its subsystem grouping (see
  "Data-driven rendering" above) and why Ring Frame's Rieter/Zinser split is now maintained by
  hand-classifying each photo rather than reading a `code` prefix (no live entry has a `code` field
  any more). Source files ranged 0.4–10MB each (~274MB total) straight from the camera/upload —
  resized to a 1200px-max-dimension JPEG at quality 82 (~10–180KB each) before committing, via
  PowerShell + .NET `System.Drawing` (`Add-Type -AssemblyName System.Drawing`), since this
  environment has no ImageMagick/Python/sharp available. Any transparency in the source is
  flattened onto white during that resize, since JPEG has no alpha channel.

Practically: if an *old* crop is mis-cropped, the fix is a new crop from the original PDF — there
is no clean alternate image for that generation. If a *new* (`-v2-`) photo has a quality issue,
it needs a re-shoot/re-upload; there's no PDF to re-crop from for these.

- **`twindisc-01.jpg`…`twindisc-04.jpg`** / **`friction-disc.jpg`** / **`pu-friction-wheel.jpg`** —
  all real photography supplied directly (the latter two were originally a PDF crop from
  `catalogues/CPU Main Catalogue.pdf`, then replaced with the user's own cropped photos of the
  same two product families), same treatment as the `-v2-` generation above.
- **`rotor-cup-bearing.jpg`** / **`rotor-cups.jpg`** / **`solidrotor-pair.jpg`** /
  **`solidrotor-t636.jpg`** — the Complete Rotors panel's four photos, real PhiComp product
  photography supplied directly, resized from `images/Rotors/` (the raw source folder, reference-only
  like `images/Autocoro/`). Descriptive names rather than the `-v2-NN` serial convention, matching
  `friction-disc.jpg`/`pu-friction-wheel.jpg`: like those, they are referenced **by hand from
  `index.html`**, not generated from `data.js`, so a readable name beats a serial.

  **The laser-etched PhiComp codes in these photos stay unretouched — this is deliberate, not an
  oversight.** `T34 D-DBS-181817`, `T633 DD-MS-181954` and `T636 DD-MS-181954` are legible on the
  parts. That was weighed against the "order numbers are not published" rule two paragraphs up and
  cleared by the owner: that rule targets a machine-readable 53-row list in plain-text `data.js`, and
  the type prefixes (`T 34 D`, `T 633 DD`, `T 636 DD`) are already public in the tables directly
  below the photos. Don't blur or re-crop them to "fix" a rule violation — there isn't one.

If a future catalogue-derived category needs a photo pulled from a PDF with no per-SKU
photography and no text layer: this environment has neither `pdftoppm`/poppler (so the Read tool
can't rasterize a PDF page) nor a working headless-Chrome PDF viewer (blank output in headless
mode). Worth trying first — a composite catalogue page is often embedded as one large JPEG inside
the PDF, extractable by scanning the PDF's raw bytes for the JPEG SOI (`FF D8 FF`) / EOI (`FF D9`)
markers, then cropped with PowerShell + `System.Drawing` same as everything else here. Only falls
back to page rasterization (which this environment can't do anyway) if the PDF doesn't embed the
page as a single image.

**Not all photos are square, and `.part-photo { min-height: 0 }` is load-bearing because of
that.** (`.part-photo` is a `<button>` — see "Photo lightbox" — so its rule also carries the
`width/border/font` reset; that part is cosmetic, the `min-height` is not.)
It sets `aspect-ratio: 1 / 1`, but it is also a flex item of the column-flex
`.part-card`, so its default `min-height: auto` resolves to its *content's* height — a portrait
photo (e.g. `246×579`) then stretches the box to ~403px and silently overrides the aspect ratio,
leaving the grid ragged with no error anywhere and the CSS still reporting `aspect-ratio: 1 / 1` as
computed. `min-height: 0` is what makes the square box actually hold. It reads like removable
tidying; it is not. The original crops happened to be pre-cropped square, so the symptom only
surfaced in Ring Frame; the `-v2-` real-photography set (resized preserving aspect ratio, not
forced square — see "Product photo pipeline" above) makes this fix load-bearing everywhere, not
just Ring Frame. `.ring-grid` additionally sets `grid-auto-rows: 1fr` to level the residual
row-height differences that come from name length; do **not** line-clamp those names.

### English-only data convention
Catalog part names in `data.js` are deliberately English-only, even though the source PDF
catalogues are bilingual (German/English). When adding new catalogue-derived entries, translate
or strip German rather than keeping bilingual strings like `"Driver / Mitnehmer"`.

### Reference material vs. served assets
- `catalogues/` — source manufacturer PDF catalogues (Samatex, Emil Broell, CPU, etc.), **linked
  from the site** via a "Browse Catalogue ↗" button (`target="_blank"`, native browser PDF viewer —
  no custom viewer built) on the Autoconer, Autocoro and Ring Frame panels only. Autoconer's
  catalogue file is literally named `Autconer Catalogue Euro Textile.pdf` (typo in the file itself)
  — the href matches it exactly; don't "fix" the spelling without renaming the actual file to
  match. `BROELL_Navel catalogue.pdf` and `CPU Main Catalogue.pdf` are reference-only, like the
  source photos below — on disk for provenance/future cropping, not linked from the Navels or Twin
  Discs panels.
- `docs/` — one PDF (`Autocoro338_Parts_list_revised.pdf`) that's also linked from the Autocoro
  panel, as a **second**, separate button ("Additional Parts ↗") alongside "Browse Catalogue ↗" —
  the two are different documents (a supplementary parts list vs. the manufacturer catalogue) and
  both stay.
- **The raw source-photo folders are `.gitignore`d, not committed.** `images/Autocoro/`,
  `images/Autoconor/`, `images/Ringframe/`, `images/Rotors/` and `images/Twin Disc/` hold the
  full-resolution originals (~275 MB) behind the `-v2-` and named photo generations. They were
  previously tracked, which meant any static deploy shipped 273 MB of files the site never
  loads — and their filenames carry the Samatex order numbers (`146-006-600 Prisma DS1.png`),
  which the site deliberately does not publish. They are now untracked (`git rm --cached`, files
  untouched on disk) and listed in `.gitignore`. **They still exist in git history**, so clone
  size is unchanged until history is rewritten — that has not been done. Do not re-add them.
- `images/catalogue/` — Broell navel photos (16). `images/machines/` — the 6 category hero photos,
  **all JPEG**; the four that were PNG (`AutoCoro Machine`, `AutoConer Machine`,
  `Ringframe Autodoffing`, `Rotors Machine`) were photographs in a lossless format, 2.3 MB
  between them, and are now 494 KB total at quality 82. They were verified to carry no real
  transparency before conversion — worth re-checking with a pixel scan if any is ever re-sourced,
  since `.panel-photo` shows `--cloud` through a transparent PNG but white through a JPEG. Only
  the landing panel's `Rotors Machine.jpg` loads eagerly; the other five are `loading="lazy"`
  because their panels are `display: none` at first paint.
  `images/manufacturers/` — 4 partner logos. `images/parts/` — the product photos, both generations
  described in "Product photo pipeline" above. `images/clients/` — client logos for the "Our
  Clients" marquee (SVG/PNG/JPG; note `vardhman.svg` is the trimmed icon-only mark, paired with
  hand-set brand text in the markup). `sri-bhagirath.jpg` is a second instance of this pattern for a
  different reason: the only logo image findable for that client is actually the "S B Rander Group"
  mark (what the company itself uses on its own directory listings), not literally the client's own
  name — so it's paired with an explicit `.client-logo-name` span reading "Sri Bhagirath Textiles",
  same markup pattern as Nahar Spinning Mills. `gimatex.png` was cropped from a much wider source
  image that had the real logo content only in its left ~200px (the rest opaque white, not
  transparent — a plain crop, not a `min-height:0`-style aspect-ratio bug); if it ever needs
  re-sourcing, expect the same wide-canvas issue and crop before using it, or it'll render with a
  large dead-space gap next to it in the marquee. `images/` root holds the company logo files (see
  "Header brand block & logo assets" above) plus `og-image.jpg`, the generated 1200×630 social
  preview. For the raw source-photo folders — `images/Autocoro/`, `images/Autoconor/` (folder name
  is a typo in the folder itself; it holds the *Autoconer* category's photos), `images/Ringframe/`,
  `images/Rotors/`, `images/Twin Disc/` — see the `.gitignore` bullet above; the
  resized/compressed copies actually served live in `images/parts/`.

### Rotor spec-sheet drawing (Complete Rotors panel)
`.rotor-spec` is the site's second hand-authored inline SVG — a rotor drawn as a dimensioned **plan
view**, looking straight into the open end of the cup, in the vernacular of the PhiComp leaflet. It
is seven concentric circles plus a centre-mark, *not* a cut profile with hatching, so the figcaption
reads "seen from the open end". It used to say "shown in section", which was simply wrong — don't
reintroduce that wording without actually redrawing the SVG as a section. Four things hold it
together:

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

### Known open item — groove-type tags vs. the data
The Complete Rotors `.info-tags` summary in `index.html` does **not** match what's actually in
`data.js`, and this is unresolved (owner is checking the PhiComp leaflet — do not "fix" it by
guessing):

- The SolidRotor tag lists `Ts`, but `SOLID_ROTOR` has **`Tx`** (`Tx 633 DD`) and no `Ts` at all.
- The cup/bearing tag lists `T · V · Z · R · Tc · U · Tr`, while `ROTOR_CUP_BEARING` also carries
  `Ts` (`Ts 36 D`), `Vs` (`Vs 34 DN`) and an `S` groove (`C248/S-D`).

Two possibilities, both plausible: the tag is a deliberate marketing simplification, or it is a
typo. **Separately, the stated groove Ø ranges may be narrower than the data.** If the trailing
digits of a type code are the groove diameter, then `C250`/`C254`/`C248` put cup/bearing at up to
54 mm and `S 652` puts SolidRotor at 52 mm — against the published "30–46 mm (cup/bearing) ·
28–46 mm (SolidRotor)". That reading is unconfirmed. Resolve against the leaflet, not the codes.

(The related inconsistency that *was* fixed: the rotor drawing's `dim-label` and figcaption said
"Ø 28–46 mm" while sitting under a heading reading "Rotor cup & bearing" — 28–46 is the SolidRotor
range. Both now read 30–46 mm, matching the info tag. Per the SVG's `aria-hidden` rule, the label
and the caption always change together.)

### About section stat-line
The About section (`#about`) is a two-column intro plus a hand-authored inline **SVG infographic**
(`.about-stats`): a curved `.stats-line` path whose cubic-segment anchors are the four `.stat-node`
points (so the node dots sit exactly on the curve). Editing a node means keeping its `<circle>`,
`.stat-drop` line, and `<text>` coordinates in sync with the path anchor. Below `820px` the SVG is
hidden and `.about-stats-grid` (a 2×2 card fallback) shows the same four stats — update both.
