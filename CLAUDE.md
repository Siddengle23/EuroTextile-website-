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
  `AUTOCONER_PARTS`, `AUTOCORO_PARTS`, `RIETER_PARTS`, `ZINSER_PARTS`, `RIETER_STEEL_BELTS`,
  `ROTOR_CUP_BEARING`, `SOLID_ROTOR`, `TWIN_DISCS`, `FRICTION_DISC`, `PU_FRICTION_WHEEL`).
  Loaded via `<script>` tag *before* `script.js`, so these are consumed as globals, not imports.
- `robots.txt` / `sitemap.xml` / `images/og-image.jpg` — SEO and social-preview assets. The
  absolute URLs in the `<head>` meta block, in `robots.txt` and in `sitemap.xml` all assume the
  site is served from `https://www.eurotextilespares.in/` — **confirmed by the owner at launch.**
  Note the `.in`: the host was previously guessed as `.com` from the contact email domain, and that
  guess was wrong. The contact email *does* stay `dengle@eurotextilespares.com`, so the two domains
  deliberately differ — do not "align" them, and in particular never bulk-replace the domain, since
  the contact form's endpoint is `formsubmit.co/ajax/dengle@eurotextilespares.com` and repointing it
  would silently send submissions to an unactivated address.
  `og:url`/`og:image` must stay absolute — relative paths are ignored
  by WhatsApp/LinkedIn/Facebook. `og-image.jpg` is 1200×630, generated with PowerShell +
  `System.Drawing` from `images/Logo_black.png`; the generator is not committed.
- `.gitignore` — keeps the raw source-photo folders out of the repo. See "Reference material vs.
  served assets".
- `script.js` — vanilla JS in a single IIFE, wired up on `DOMContentLoaded`. No modules, no npm
  dependencies.
- `js/vendor/` — vendored GSAP runtime (`gsap.min.js`, `ScrollTrigger.min.js`), loaded from local
  files (not a CDN) *before* `data.js`/`script.js` so the site animates even when opened over
  `file://` offline. See "Motion layer" below.
- `README.md` — the GitHub landing page. **It is a front door, not a second copy of this file**:
  what the site is, the stack, how to run it, a file map, and a pre-deploy checklist, then it points
  here for anything deeper. Keep it that way — depth added there is depth that will drift out of
  sync with this file. Three things in it *are* duplicated from here and must be updated together:
  the `https://www.eurotextilespares.in/` host, the formsubmit.co activation caveat, and
  the note that the raw photo folders still sit in git history. It also quotes two measured figures
  (~24 MB working tree against a ~311 MB `git clone`) — re-measure rather than trusting them if the
  history is ever rewritten. There is deliberately **no LICENSE file**: the repo carries the
  manufacturer catalogue PDFs, the manufacturer marks and the client logos, none of which are the
  company's to license, so an open-source licence would over-grant. The README says so explicitly;
  don't "fix" the omission by adding MIT.

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
- **`--virtual-time-budget` never fires `requestAnimationFrame`, so GSAP's ticker never runs** —
  anything animated with `.from()` stays stuck at its *start* state (invisible) in the screenshot.
  `REVEAL_SEL` elements are rescued by `guardVisible()`'s native `setTimeout` on `window.load`, the
  hero by `heroIntro()`'s own timer, and the About hub by `GUARD_EXTRA` — but anything animated
  outside all three lists captures at its invisible start state. That is a capture artifact, not a
  broken page.
  **Add `--force-prefers-reduced-motion` to see the true final state**: `wireMotion()` then bails
  early by design and every element renders in its natural, fully-visible form. This is the
  reliable way to screenshot anything GSAP touches. (It also means a screenshot can never show
  the animation itself — only the resting state; use a real browser for motion.)
- **CSS smooth scrolling and `scrollIntoView({behavior:"smooth"})` also don't animate** under
  virtual time, for the same reason. To measure a real scroll landing position, override
  `html{scroll-behavior:auto}` and patch `Element.prototype.scrollIntoView` to force
  `behavior:"auto"` in the throwaway probe copy — then the final position is exact and immediate.
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

### Page section order
`hero → clients → about → manufacturers → products → capabilities → contact`.

**Manufacturers sits above Products deliberately** — the owner asked for the narrative to introduce
the OEM partners before the parts they make. It used to sit between Products and Capabilities, so
don't "restore" it there. Three things follow from the position and are easy to get wrong:

- The nav order matches the page order (`About · Manufacturers · Products ▾ · Capabilities ·
  Contact`). Moving a section means moving its nav item too; the footer's Company column already
  lists Manufacturers first.
- **`.mfr-card` is in `REVEAL_SEL` and is now *above* `#products`**, so category swaps no longer
  invalidate its ScrollTrigger — which is why the refresh note under "Motion layer" now names
  Capabilities alone (Contact has no `.section-head`, so it carries no reveal trigger at all).
  Move Manufacturers back below the catalog and it needs that refresh again.
- Section backgrounds alternate loosely rather than strictly: `.manufacturers` has no background
  rule (so `--canvas`, white) while `.about` / `.products` / `.capabilities` share the same
  `mist → cloud` gradient. One adjacent gradient pair (`products | capabilities`) is expected; it
  was `about | products` before the move. Not worth "fixing" with a fourth background.

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
Ring Frame → Rieter Ring / Rieter Steel Belts / Zinser Ring / Zinser Steel Belts, Navels → the
four Broell series, Twin Discs → supporting discs / friction disc / friction wheel. Autocoro and
Autoconer have none. Each sub-link is
`<a href="#<id>" data-cat="<category>" data-sub="<id>">`, and `<id>` must match an `id=` on a
heading **inside that category's panel** — `sub-rotor-cup`, `sub-solid-rotor`, `sub-rieter-ring`,
`sub-rieter-belts`, `sub-zinser-ring`, `sub-zinser-belts`, `sub-twin-discs`, `sub-friction-disc`,
`sub-friction-wheel` sit on hand-written
headings in the markup; the four `sub-navel-*` ids are **generated** by `renderNavels()` from the
`NAVEL_SERIES` map in `script.js` (see "Data-driven rendering"). A typo'd id fails silently — the
panel still switches, the page just doesn't scroll.

**A sub-link's visible label and its `<id>` are independent, and one pair deliberately disagrees.**
Twin Discs' first sub-link reads "Supporting Discs" while its `href`, `data-sub` and target heading
id all stay `sub-twin-discs`. The label was changed so the flyout stops repeating its own parent
("Twin Discs → Twin Discs"); the id was left alone because renaming it means renaming the heading
id in the panel to match, which is exactly the silent-failure case above. Don't "fix" the id to
agree with the label.

**The scroll is driven entirely by JS, not the browser's native hash jump.** Every `a[data-cat]`
click handler (category-level or sub-link — same code, no branching on `data-sub`) calls
`e.preventDefault()`, runs `activateCat()`, updates the URL with
`history.pushState(null, "", href)` (keeps the link bookmarkable without itself triggering a
scroll), then scrolls to `document.querySelector(href)` via `scrollIntoView({behavior:"smooth"})`
inside a `requestAnimationFrame` — deferred one frame so the panel's freshly-toggled `display` and
its `.cat-panel.is-active` entrance animation (see "Motion layer") have settled before the target's
position is measured. It calls `refreshAfterScroll()` on every `a[data-cat]` click (see "Motion
layer"). `.parts-group-title, .ring-group-title` carry `scroll-margin-top: 100px` to clear the
sticky 84px navbar; a new anchor on some other element needs its own. `wireHashDeepLink()` handles
the cold-load case (a copied/bookmarked sub-link), where the target's panel is `display:none` and a
native jump would skip it entirely.

**`a.blur()` in that same handler is load-bearing — it is what closes the menu after a click.**
`preventDefault()` suppresses the browser's fragment navigation, and that navigation is also what
used to move focus off the clicked link (for a non-focusable target like an `<h4>`, focus resets to
the document). A real mouse press focuses the link, so without the blur focus simply stays there,
and `.has-dropdown:focus-within .dropdown` / `.has-sub:focus-within > .subdropdown` (style.css) keep
the dropdown *and* its sub-flyout visible indefinitely — the nav stops behaving as a hover menu and
the two flyouts sit overlapping on top of the page. The fix is the blur, **not** deleting those
`:focus-within` selectors: they are what makes the menu usable by keyboard at all. Note this is a
desktop-pointer bug, so a screenshot won't catch it — and it can't be reproduced headlessly either
(the links start `visibility: hidden`, which blocks both focus and, in practice, any attempt to
force them visible from script), so verify it in a real browser.

**This went through two broken designs before landing here — don't reintroduce either.** First, a
manual `scrollIntoView()` alongside an un-prevented native jump double-scrolled to the same target
(fixed by relying on the native jump alone). Then the native-jump-alone version turned out to be
unreliable specifically for sub-links: their scroll distance is far more variable than the
top-level jump to `#products`, so `refreshAfterScroll()`'s fallback timer could fire — and
`ScrollTrigger.refresh()` cancels an in-flight smooth scroll — before a long native scroll had
actually finished, stopping it visibly short of the section. `preventDefault()` plus a single
JS-driven `scrollIntoView()` is what actually removes the race: one deterministic scroll driver,
measured only after layout has settled.

Adding nav items also means re-checking `.nav-links.open`'s `max-height` in the 1100px block — the
flyouts flatten into a static indented list below that width, and the 13 sub-items already pushed
the open menu past the old 720px cap (now `85vh`, with the `overflow-y: auto` that was already
there). Being a viewport fraction rather than a pixel figure, it absorbs new sub-items on its own
— the open menu simply scrolls — but confirm that rather than assuming it.

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
mail arrives. If enquiries are reported missing, test with a real submission before debugging the
JS — the front end is almost certainly fine.

**The success check reads the response *body*, not just `res.ok` — that is the fix for the trap
above, not ceremony.** formsubmit.co's `/ajax/` endpoint answers **200** with
`{"success": "false", "message": …}` for a form it will not deliver (unactivated address, or a post
it scored as spam), so a status-only check hands the visitor the thank-you line while nothing is
sent. Two details that look wrong and aren't: `success` comes back as the **string** `"true"` /
`"false"`, so it is compared (`String(data.success) === "false"`) rather than tested — `!data.success`
passes every declined submission, because `"false"` is truthy. And a response that isn't JSON at all
falls through to success on purpose, keeping the old benefit-of-the-doubt behaviour.

**The `.catch()` logs the error via `console.warn` before showing the generic sentence.** It is
deliberately the only place the real cause survives: the visitor-facing message is identical for
every failure, but the two modes are not — a request blocked before it left the browser (a privacy
extension or blocklist hitting `formsubmit.co`, a corporate firewall, offline) rejects with a
`TypeError`, while an HTTP error or a declined submission carries the text thrown upstream. Without
the log every "something went wrong" report is unfalsifiable. Don't quieten it.

**User-facing copy uses the British spelling — "enquiry" / "Enquire", never "inquiry".** The catalog
CTAs ("Enquire about complete rotors"), the submit button ("Send Enquiry"), the `_subject` value and
the search-empty and success strings in `script.js` all follow it.

### Clients marquee — the logo list is hand-duplicated
`#clients`' `.slider-track` contains **every client logo twice** ("Set 1" / "Set 2" in the markup).
That is what makes `@keyframes scrollTrack`'s `translateX(-50%)` loop seamlessly: at -50% the
track has scrolled exactly the first copy's width, so it lands back on an identical frame.
**Adding, removing or reordering a client means editing both copies identically.** Editing only
one desynchronises the halves and the loop visibly jumps once per cycle — and because the seam
passes by only every 35s, it is easy to miss in a quick check.

**`.client-logo` carries `flex: 0 0 auto`, and `.slider-container`'s edge mask is narrowed on
phones.** Both fix the same reported symptom — "some logos just disappear as they move left":
- The track is `width: max-content`, which *should* mean no slide is ever compressed, but WebKit
  resolves `max-content` unreliably on a flex container inside an `overflow: hidden` ancestor, and
  the default `flex-shrink: 1` then squeezes slides until logos collapse or clip. Pinning the basis
  makes the loop geometry independent of how the engine resolves the track width, and keeps the two
  hand-duplicated halves exactly equal — which is what makes `translateX(-50%)` seamless.
- The mask is a **fixed 24px ramp**, and **there is deliberately no per-breakpoint override.** It
  used to be a percentage (`10%`, briefly `4%` on phones), which is the wrong unit: a percentage
  scales the fade *up* with the container, so it was a soft ~120px ramp on desktop but ~82px on an
  iPad and ~39px on a phone — on the smaller screens it dissolved a logo well before it reached the
  edge. Fixing the distance makes every width behave identically. The `-webkit-mask-image` and
  `mask-image` declarations are a pair; edit them together (Safari uses the prefixed one).
  Re-adding a percentage, or a `≤640px` mask override, is the exact bug this replaced.

**A continuous marquee clips at the viewport edge by definition — the mask is not the lever for
that.** When the complaint is "the logos are always half cut off" on a phone rather than "they fade
out early", the cause is slide width: at ≤640px each slide is the logo plus `.client-logo`'s
horizontal padding, and with the widest marks near 300px only about one and a half fit a 390px
screen, so something is always straddling an edge. The `≤640px` padding is `22px` (down from 36px)
for exactly that reason. The next lever after padding is `.client-logo-img`'s 40px height, not more
padding. Making a logo *never* partially visible is not achievable here at all — that needs a
stepped/paged carousel rather than a continuous scroll.

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

**`.navbar` deliberately has no `backdrop-filter`.** It used to carry
`saturate(140%) blur(6px)` over an `rgba(255,255,255,.96)` background — 96% opaque, so the blur was
imperceptible anyway — and `backdrop-filter` on a `position: sticky` element is a known
compositing-failure combination on both WebKit and Blink that can blank the bar's own children
while scrolling. It was one of the suspects behind the "I can't see the menu icon" report. The
background is now plain `#fff`, which is visually identical and removes the whole bug class. Don't
re-add the filter as a polish touch.

Below 1100px the hamburger is a **visible bordered plate** (`--cloud` fill, hairline border,
`--r-badge` corners, `--navy` bars) rather than three bare bars on white — the owner reported not
being able to find it. See the `.nav-toggle` entries under "Mobile & touch invariants" for the
padding arithmetic that border forces.

### Mobile & touch invariants
Nine rules that a desktop-only check will not catch. All were regressions found in a mobile audit;
none of them shows up in a screenshot.

- **Any focusable input stays at `font-size: 16px` or larger.** iOS Safari auto-zooms the page when
  a focused input is under 16px and never zooms back out. This binds `.parts-search` and
  `.contact-form input, .contact-form textarea`. Shrinking either to fit a layout breaks the page
  on every iPhone.
- **A `flex-basis` written for a row becomes a *height* the moment that container turns into a
  column.** `.parts-search` is `flex: 1 1 320px` for the desktop `.parts-toolbar` row, where 320px
  is a width; the `@media (max-width: 640px)` block flips the toolbar to `flex-direction: column`,
  which moved the main axis to vertical and rendered every catalogue search box as a **320px-tall
  slab** with the placeholder floating in its middle. The `≤640px` block therefore re-states
  `.parts-search { flex: 0 0 auto }`. Any future `flex: … <basis>` on an element whose container
  changes direction at a breakpoint needs the same treatment. Note the fix must not touch
  `font-size` — see the 16px floor above.
- **Under the global `border-box`, `max-height: 0` cannot collapse a box that has padding or a
  border.** The closed mobile `.nav-links` kept `padding: 8px 0` + `border-bottom: 1px` alongside
  `max-height: 0`, so it sat **17px tall, white and shadowed**, pinned at `top: 100%` of the sticky
  navbar at every width ≤1100px — present on cold load, not just after closing the menu, which is
  what made it read as "the menu didn't close properly". The padding, border-width and box-shadow
  now live on `.nav-links.open`; the closed rule keeps only `border-bottom: 0 solid` so the
  width can animate back. Don't move them back onto the base rule.
- **`.nav-toggle` is 44×44 and the *padding* is what does the work — the border counts too.** Under
  the global `border-box` the content box must stay exactly 34×28, which is what the three bars and
  the `.nav-toggle.open` X animation are drawn against — its `translateY(±9px)` values are tuned to
  that 28px height. The base rule is `padding: 8px 5px`; the ≤1100px block adds a 1px border for
  the visible button plate and drops the padding to `7px 4px` to compensate, keeping 34×28. Resize
  via the padding, never the height, and re-do that arithmetic if the border width changes.
- **`.nav-toggle` needs `flex: 0 0 auto`, and its bars need an explicit `width`.** As a flex item of
  `.nav-inner` the button defaults to `flex-shrink: 1`, and because its three `<span>`s are *empty*
  its `min-content` width is 0 — while `.logo` beside it is unshrinkable (`.logo-word` is
  `white-space: nowrap` from 421px up). Under width pressure the flex algorithm therefore collapses
  the hamburger to nothing rather than the logo. Separately the bars set only `height: 3px` and
  relied on `align-items: stretch` for their 34px width, which Safari drops when a `<button>` fails
  to act as a flex container — 0px-wide invisible bars inside a button still occupying its 44px.
  Both were reported as "the menu icon is white/invisible on mobile" and **neither reproduces in
  headless Chrome**, which renders the button correctly.
- **`wireNav()` closes the menu on *every* link tap, `.dropdown-toggle` included.** It used to skip
  the Products parent, which is right on desktop (a hover flyout must stay open) and wrong on
  mobile, where the dropdown is already flattened to a permanently visible list: the tap is pure
  navigation and the 85vh menu was left covering the section just jumped to. No breakpoint test is
  needed, and **that is deliberate** — `closeMenu()` no-ops unless `.nav-links` carries `.open`, and
  `.open` is only ever set by the hamburger, which is `display: none` above 1100px. Adding a
  `matchMedia` check would work but would put the first hardcoded breakpoint into `script.js` and
  couple it to the CSS; don't.
- **Never add `overflow-x: hidden` to `html`/`body` as an overflow backstop.** `.navbar` is
  `position: sticky`, and `overflow` on an ancestor re-parents a sticky element's scroll container —
  the blanket rule silently breaks the sticky header. Fix the element that is actually too wide.
  The one real candidate is the brand block: `.logo-word` is `white-space: nowrap`, and at 320px the
  mark + gap + wordmark plus the 44px hamburger leaves no margin inside `.wrap`'s 24px padding.
  Hence the **`@media (max-width: 420px)`** block, which lets the wordmark wrap to two lines.
- **`body.no-scroll`** is toggled by the lightbox's `open()`/`close()` and by the hamburger /
  `closeMenu()`. Without it, dragging over either overlay scrolls the page behind it on touch, so
  closing the lightbox drops the user somewhere else. It is the 90% fix; watertight iOS handling
  needs the `position: fixed` + scroll-restore dance, deliberately not done here.
- **Touch targets are 44px at ≤640px**, which is where `.btn-sm` (the "Enquire about …" /
  "Browse Catalogue ↗" buttons) and `.cat-tab` get their larger padding. Their desktop sizes are
  smaller on purpose; don't unify them.
- **The page declares `color-scheme: only light`** — in `:root` *and* as a `<meta name="color-scheme">`
  in the `<head>`. There is one palette and no dark theme, and without the declaration Android
  Chrome's Auto Dark Theme force-darkens the page, characteristically lightening `var(--ink)` text
  while leaving `rgba()` white backgrounds alone (i.e. white on white). The two declarations are a
  pair — change both or neither.
- **The utility strip shows the tagline on phone portrait, not the phone number and email.** The
  `≤640px` block hides `.util-contacts` and shows `.util-tagline`; the contacts are already in the
  Contact section and the footer, and the positioning line is the more useful thing to lead with.
  Width alone is the test — phone landscape is wider than 640px — so **don't add an
  `orientation: portrait` query**; a second breakpoint axis would compete with the width one. The
  block also relaxes `.util-inner`'s fixed `height: 38px` to `min-height`, because the tagline wraps
  to two lines below ~400px and a fixed height would clip the second.

`.table-scroll` also carries a scroll-shadow background at ≤640px so a table that continues
off-screen says so. It is self-hiding — the `local` white covers move with the content, the
`scroll` radial shadows are pinned to the box — so a table that fits shows nothing at all.

**Headless Chrome cannot verify any of the widths that matter here.** It clamps `innerWidth` to
500px even when asked for 360 (confirmed, not folklore), so 320–390px behaviour — the 420px block
above especially — has to be checked in a real browser's responsive mode or on a device.

### Hero brand lockup (the `<h1>`)
The hero headline is a **brand lockup**, not plain text: `<h1 class="hero-lockup">` contains an
`<img class="lockup-mark">` (the ETS mark, `images/Logo_black.png`) followed by
`<span class="lockup-name">` holding the company name. The `<img>` sits *inside* the `<h1>` on
purpose — the heading's accessible name stays the real text "Euro Textile Spares Pvt. Ltd.", so
nothing is lost to SEO or screen readers, and the mark carries `alt=""` because that text already
names the company (same reasoning as the nav logo's `alt=""`).

Three things hold it together:

- **`.lockup-mark` is sized in `em`, not px** (`width: 1.55em`). 1em is the `<h1>`'s own font-size,
  which already steps 54 → 44 → 34px across the 900px and 640px breakpoints, so the mark rescales
  with the headline at every width with no extra media query. Switching it to px means adding — and
  maintaining — three of them.
- **Both name spans are `display: block`, and that is a fix, not decoration.** Left to wrap freely
  the name breaks wherever the column runs out; at 500px that split "Pvt." from "Ltd." across two
  lines. Blocking them pins the break after the company name, and `.lockup-name`'s
  `line-height: 1.04` keeps the two lines reading as one lockup beside the mark.
- **`.hero-lockup .h1-brand` deliberately overrides the brand blue to `--ink`.** The lockup is
  meant to read blue mark + near-black wordmark, matching the supplied logo animation. Deleting
  that single rule restores the blue headline.

It animates as **two beats inside the existing hero timeline** (`heroIntro()`): the mark pops in
(`scale`, `back.out`), then the name unfurls rightward from beside it (`x: -20`). Both selectors
must stay listed in `HERO_SEL` — that array is what the `setTimeout` failsafe sweeps, so dropping
either half silently leaves it uncovered if the rAF ticker is throttled. Because the beats live in
the one timeline, reduced-motion handling needs no special case: `heroIntro()` only runs inside
`gsap.matchMedia("(prefers-reduced-motion: no-preference)")`, and `.from()` ends at the natural
state, so the lockup simply renders static.

**`images/ETS Logo GIF.gif` is reference-only and deliberately not referenced by the site.** It is
the supplied 500×191 logo animation (72 frames: the mark draws in, then the company name appears
**below** it, then a light sweep, resting on the final frame; 3.08s of animation plus a 2.2s hold).
The lockup rebuilds that idea as mark-left/name-right instead, which the GIF can't provide — its
text stacks underneath and it can't be cropped to a mark-only clip without re-encoding. It is on
disk for provenance; don't wire it in assuming it was forgotten.

### Motion layer (script.js `wireMotion()`)
GSAP drives the site's animation: a hero-entrance timeline, `ScrollTrigger.batch` scroll-reveals
over `REVEAL_SEL` (`.section-head, .about-intro, .mfr-card, .cap-card` — batched
triggers, **never one per part-card**, to keep the 100-card catalog smooth), a hero credential count-up,
and the About hub entrance (`aboutHub()`). Four rules this layer follows — keep them when
editing:
1. **Graceful fallback** — if `window.gsap`/`ScrollTrigger` are absent, it calls `legacyReveal()`
   (IntersectionObserver + `.reveal-hidden`/`.reveal-visible`), so content still appears.
2. **Reduced motion** — it bails early on `prefers-reduced-motion: reduce`, leaving everything in its
   natural fully-visible state; the CSS has a matching `@media (prefers-reduced-motion: reduce)`
   block. Animations use `gsap.matchMedia("(prefers-reduced-motion: no-preference)")`.
3. **Never leave content stuck hidden** — anything animated with `.from()`/`autoAlpha:0` that is
   above the fold has a native `setTimeout` failsafe forcing the visible end-state (guards against a
   throttled rAF ticker in a background tab). `guardVisible()` extends the same idea below the fold:
   on `window.load`, it sweeps `REVEAL_SEL` **plus `GUARD_EXTRA`** (the About hub, which is
   choreographed rather than batch-revealed, so `REVEAL_SEL` doesn't cover it) and forces
   `autoAlpha:1` on anything inside the viewport still computed `visibility:hidden` — a last-resort
   net for a trigger left stale by a layout change the code below didn't refresh for. Anything
   animated with a new `.from()` belongs in one of those lists. Preserve all of these failsafes.
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
every trigger below `#products` — Capabilities, the only one left there — goes stale after a swap unless
refreshed; without this, some swaps left Capabilities'
cards permanently invisible (wrong cached trigger position). But `ScrollTrigger.refresh()` briefly
snaps scroll position to remeasure, and if that happens on the same frame as an in-flight smooth
scroll, it aborts that scroll outright (any direct scroll write cancels a CSS smooth scroll per
spec). The fix, in `wireTabs()`:
- `.cat-tab` clicks call `refreshMotion()` immediately — no scroll happens here, so there's no race.
- `a[data-cat]` clicks (nav dropdown, sub-links, footer) call `refreshAfterScroll()`, which defers
  the refresh until scrolling actually settles (`scrollend` event, with a ~1000ms `setTimeout`
  fallback for browsers without it) instead of firing on the same frame.

Both helpers live next to `REVEAL_SEL`. Don't collapse them back into one immediate call — that's
the exact regression this documents.

**`a[data-cat]` clicks drive their own scroll in JS — `preventDefault()` plus a single, deferred
`scrollIntoView()` — rather than trusting the browser's native hash jump.** This went through two
broken designs first; both are worth knowing so neither comes back:
1. A category-level link (`href="#products"`) used to *also* call
   `products.scrollIntoView({behavior:"smooth"})` in the click handler, without `preventDefault()`
   — so the un-prevented native jump fired too, both animating the same target. The native jump
   restarting mid-flight fired a spurious `scrollend`, letting `refreshAfterScroll()`'s deferred
   `ST.refresh()` land while the browser's own scroll was still moving and knock it off target: the
   first click landed short, a second click (less contention in flight) landed correctly. Fixed by
   deleting the manual `scrollIntoView()` call and letting the native jump alone handle it — matching
   how sub-links ("two scrolls to different targets on one frame would fight, and native one wins")
   already worked.
2. That "native jump alone" version then turned out to be unreliable for **sub-links** specifically:
   `activateCat()` swaps `.cat-panel` visibility (and its `translateY(8px)→0` entrance animation,
   see `.cat-panel.is-active` below) synchronously, in the same tick the browser is about to measure
   where to scroll — and a sub-link's target can be much farther from the current scroll position
   than the top-level `#products` jump, so a long native smooth scroll had more opportunity to
   still be in flight when `refreshAfterScroll()`'s fallback timer fired and `ST.refresh()` cut it
   short. Intermittent by nature — it only bit when actual distance/settle time outran whichever of
   `scrollend`/timeout resolved first.

The fix that actually holds: `preventDefault()` so JS is the *only* scroll driver (nothing left to
race), `history.pushState(null, "", href)` to keep the link bookmarkable without itself triggering a
scroll, then `scrollIntoView({behavior:"smooth"})` on `document.querySelector(href)` inside a
`requestAnimationFrame` — deferred one frame past `activateCat()` so layout has already settled
before the target's position is measured. Applies uniformly to every `a[data-cat]` link, category
or sub-level; there's no branching on `data-sub` any more.

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

**`.panel-intro` can hold more than one `<p>` — Rotors is the only panel that currently does.** Its
intro splits into two paragraphs (Rotor cup & bearing, then SolidRotor) so the two product lines
read as visually distinct rather than one dense block. `.panel-intro p + p { margin-top: 14px; }`
supplies the gap — the site's `* { margin: 0 }` reset means splitting the markup into two `<p>`s
alone produces zero visible space; 14px matches `.panel-note`'s own bottom margin. The rule is
inert on the other five panels, which still have exactly one `<p>` — a panel that grows a second
paragraph gets the spacing for free, no new class needed.

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
than as a column that repeats one value 37 times. Both `.spec-foot` notes carry a hard `<br>`
immediately before `Warranty:` so that sentence starts its own line instead of running on after the
service-life caveat — deliberate spacing, not a stray tag to clean up.

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

**Ring Frame carries a third target on top of its two photo grids: `RIETER_STEEL_BELTS` →
`renderSteelBeltTable()` → `<tbody id="steelBeltTable">`.** Same shape as `renderRotorCupTable()`,
but nine columns: name, part number, then the six dimension letters `A`–`F` off the RSM.R100
drawing above it, then a Coating column. The letters are **positions on that drawing, not
attributes with names of their own** — `A` end offset, `B` pitch between hole rows, `C` length of
the hole rows, `D` total length, `E` number of hole rows, `F` number of distances — so the
`.panel-note` legend beside the figure is what makes the header row readable; don't rename the
columns to guesses. The three `Lock` rows dimension the joint piece in the drawing's detail view
instead and carry `a`/`b` only; `beltCell()` renders the empty strings as an em dash rather than
leaving blank cells. `coated: true` renders "With emery coating" and puts `"with emery coating"`
in the row's `data-search`, so the catalogue's own wording finds those 8 rows.

**The catalogue's numbers are internally redundant, which is the check to run if these 29 rows are
ever re-keyed:** on every one of the 26 strip rows, `C = B × F`, `E = F + 1`, `D = C + 2A + 20 mm`,
and `A` is always exactly 14 or 16.5 mm (the page says so in a standalone ATTENTION line). A
transcription slip breaks at least one of those. Decimal commas in the scan (`16,5mm`,
`1941,5mm`) are points in `data.js`, per the English-only convention — the catalogue's own
ATTENTION line already writes `16.5 mm`.

Two CSS notes that go with those two belt sections:

- **`.rotor-spec.spec-wide` (max-width 980px) exists because `.rotor-spec` is 420px.** That width
  suits the square rotor SVG and the portrait product photos; the belt drawings are landscape
  catalogue pages at roughly 3:2, and at 420px their dimension letters and `(number of hole rows)`
  annotations are unreadable. It's a scoped override of `max-width` only — `.rotor-spec img`'s
  `width:100%; height:auto; border-radius` still applies.
- **`.ring-group-title`'s top margin is no longer keyed off DOM position.** It used to be
  `.ring-group-title:nth-of-type(2), .parts-grid + .ring-group-title { margin-top: 34px; }`, which
  worked only while the panel had exactly two headings, both right after a grid. There are four
  now and they follow different things (a grid, a `.spec-foot` note, a figure), so the gap moved
  onto the base rule with `.ring-group-title:first-of-type` pulling the first one back to 8px.
  Don't reintroduce the positional form — it fails silently, as a missing gap.

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
`data-target="rotorCupTable,solidRotorTable"`, Ring Frame drives three with
`"rieterParts,zinserParts,steelBeltTable"` — two photo grids and a table, mixed freely) —
`wireSearch()` splits on the comma and re-runs the filter/count/empty-state logic per ID. Each
target needs its own `.parts-count[data-count="<id>"]`; without one, `updateCount()` returns early
and the count silently never appears. Matching also tries a
punctuation-stripped comparison (`normalizeSearch()`, strips everything but `a-z0-9` from both the
query and the stored string) alongside the raw substring match, so a query typed without spaces or
slashes (e.g. `"T34DD"`) still matches a stored value like `"t 34 dd"`. The "no results" message
(`.parts-empty`) is inserted as a sibling *after* the search target (or after its `.table-scroll`
wrapper, for `<tbody>` targets) rather than appended inside the target itself — appending a `<p>`
directly into a `<tbody>` would sit outside the valid table content model.

**Not every panel has a search box, and the `.parts-count` badges work regardless.** Twin Discs
deliberately has none — 4 cards plus two short tables didn't justify one — yet all three of its
counts still read "N parts shown", because `updateCount()` is called by the renderers themselves
(`renderFlat()`, `renderRotorCupTable()`, `renderSolidRotorList()`,
`renderFrictionDiscTable()`, `renderPUFrictionWheelTable()` each end with it), not only by
`wireSearch()`'s `input` handler. So a `.parts-count` with no matching `.parts-search` is correct,
not an orphan — don't delete it, and don't re-add a search box to "make it work". `wireSearch()`
iterates `.parts-search` elements, so a panel without one is simply skipped.

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

- **`steel-belt-rieter.png`** / **`steel-belt-zinser.png`** — the Ring Frame panel's two
  dimensioned belt drawings (`RSM.R100`, `RSM.Z000`), the only **PNGs** in `images/parts/`: black
  line art on white, where JPEG ringing on the thin dimension lines shows. ~223 KB each at
  1600px wide, hand-referenced from `index.html` like the `friction-disc.jpg` group.
  **They are edited catalogue pages, not fresh artwork.** Pages 5 and 9 of
  `RIETER Zinser Ringspinning Parts Euro Textile.pdf`, each: rotated 270°
  (`RotateFlipType.Rotate270FlipNone` — the drawings are printed sideways in the PDF), the
  German half of every bilingual label painted out in white and the English redrawn in Arial at
  the measured size/baseline/colour (`46,46,46`), the sideways page header (`SPARE PARTS FOR …
  RING`, which the rotation leaves running up the left edge) cropped off, then autocropped to
  content. Re-cropping or fixing one means going back to the PDF and redoing that — there is no
  layered source. **`lenght`/`Lenght` in the Zinser legend are typos in the catalogue itself**,
  corrected to `length` while redrawing; don't "restore" them.
- **`steel-belts-range.jpg`** — the five-plate product shot from the top of catalogue page 10,
  in the same Zinser section. **JPEG, not PNG like the two drawings beside it** — this one is
  photography with a smooth gradient backdrop, where PNG buys nothing and costs several times the
  size (55 KB at q82, 1400×681). The crop starts **below the title printed into the photo**
  (page-10 ink ends at y 238; the crop is y 248–1132, full page width): `index.html` renders that
  same line as an `<h4 class="parts-group-title">` directly above the figure, so a re-crop that
  includes the printed title shows the heading twice — and as pixels it stops being searchable or
  screen-reader-readable. Page 10 also carries a second, unrelated photo lower down (blue/red
  bobbin pegs) that belongs to no section here.

If a future catalogue-derived category needs a photo pulled from a PDF with no per-SKU
photography and no text layer: this environment has neither `pdftoppm`/poppler (so the Read tool
can't rasterize a PDF page) nor a working headless-Chrome PDF viewer (blank output in headless
mode). Worth trying first — a composite catalogue page is often embedded as one large JPEG inside
the PDF, extractable by scanning the PDF's raw bytes for the JPEG SOI (`FF D8 FF`) / EOI (`FF D9`)
markers, then cropped with PowerShell + `System.Drawing` same as everything else here. Only falls
back to page rasterization (which this environment can't do anyway) if the PDF doesn't embed the
page as a single image.

**`RIETER Zinser Ringspinning Parts Euro Textile.pdf` is a pure scan — every one of its 12 pages
is a single full-page JPEG with no text layer**, so nothing in it can be copied as text; it all
has to be read off the extracted images. The extraction that worked: index every `N 0 obj … endobj`
in the raw bytes, walk `/Type /Pages` → `/Kids` for page order, then pull each page's
`/XObject << /ImageN … >>` stream straight out (they are `DCTDecode`, i.e. already JPEG — no
inflate needed). One page nests its image one level down inside a `/Subtype /Form` XObject, so a
page whose `/XObject` entry isn't an image needs following through to that form's own
`/Resources`. The `/Font` entries are decoys: the content streams are nothing but `/ImageN Do`.

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
  no custom viewer built) on the Autoconer, Autocoro and Ring Frame panels only. The Ring Frame
  one is additionally the source of four pages now transcribed onto the page itself — the belt
  size table and the two RSM.R100/RSM.Z000 drawings; see "Product photo pipeline" for how to get
  images out of it and "Data-driven rendering" for the table. Autoconer's
  catalogue file is literally named `Autconer Catalogue Euro Textile.pdf` (typo in the file itself)
  — the href matches it exactly; don't "fix" the spelling without renaming the actual file to
  match. `BROELL_Navel catalogue.pdf` and `CPU Main Catalogue.pdf` are reference-only, like the
  source photos below — on disk for provenance/future cropping, not linked from the Navels or Twin
  Discs panels.
  There is no `docs/` folder. It held one PDF (`Autocoro338_Parts_list_revised.pdf`) behind a
  second Autocoro button ("Additional Parts ↗") next to "Browse Catalogue ↗"; both the button and
  the 7.9 MB file were removed on request, so every panel that links a PDF now links exactly one.
  The file is still recoverable from git history if it's ever wanted back.
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
  preview, and two supplied assets the site does **not** load:
  `ETS Logo GIF.gif` (see "Hero brand lockup" for why) and
  `Euro Textile Spares Pvt.Ltd Banner.png`, a 1600×400 navy banner (mark + wordmark + tagline +
  partner logos) kept for provenance. For the raw source-photo folders — `images/Autocoro/`, `images/Autoconor/` (folder name
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

### Partner count — the hero is scoped to Europe on purpose
There are **four** OEM partners: Phicomp (CH), Emil Broell (AT), Samatex (DE) and CPU (Taiwan). The
top of the page deliberately talks about only the **three European** ones:

- The hero eyebrow reads `Germany · Austria · Switzerland → India`.
- The first hero credential is `3` / "European OEM manufacturing partners", with the three countries
  on their own line below it as a `.cred-countries` row — one `.cred-country` chip per country,
  each an existing `.flag` swatch plus the country name as real text. The names used to be a
  run-on tail of `.cred-label`. The flags carry no `title`/`aria-label` on purpose: the name is
  right beside each one, so the swatch is decoration. Order is Germany · Austria · Switzerland,
  matching the eyebrow and the About cluster label.
- `.about-cluster` carries three flags (`flag-ch`, `flag-at`, `flag-de`) and "Direct from 3 elite
  European OEM partners". It sits under `.about-lead` in the intro's right column — see
  "About section hub".

**This is not a stale count — do not "correct" it back to 4 or re-add `flag-tw` to `.about-flags`.**
The owner asked for Taiwan off the hero and the About cluster while keeping it everywhere it is
load-bearing: the Manufacturers section (intro sentence + the CPU card), the Twin Discs panel's
`CPU · Taiwan` badge, and the `<head>` metadata — the meta/OG/Twitter descriptions and the JSON-LD,
which must keep mirroring the manufacturers grid.

The word **European** is what makes the `3` accurate rather than an understatement, so it has to
survive any rewording of that credential. Note the About hub's Authorized Distributor card still
says "4 OEM partners" (the true total); 3 European + 1 Taiwanese reconciles, and the Manufacturers
grid immediately below shows all four.

### Stock & availability claims
**Euro Textile Spares does not hold the whole catalogue in stock.** Only fast-moving parts are kept
in Pune; everything else is imported to order. Two places on the page state this and must stay in
agreement:

1. The fourth hero credential (`.cred-item` with `.cred-num` "Ex-stock") — "Ready stock of
   fast-moving parts, others imported to order". The value was "Pune" until the owner asked for
   something that carried the idea rather than the place; "Ex-stock" is the trade term for supply
   from existing stock and, unlike a place name, asserts no location or scale of its own — the
   label does all the qualifying. `.cred-num` is 34px/800 (30px ≤640px) in a fixed-width panel, so
   a replacement longer than ~8–9 characters wraps and stops matching `3` / `100%` / `6500+`.
2. Capabilities card 02, "Pan-India Distribution" — "…fast-moving items from our Pune stock, the
   rest imported to order."

Both previously overclaimed ("Ready stock hub, pan India delivery"; "delivered … from our Pune
inventory hub"), which read as immediate availability across all 6,500+ parts. Widening either line
back into a blanket stock promise is a factual regression, not a copy improvement — the pan-India
*delivery* claim is accurate, a pan-India *stock* claim is not.

### About section hub
**The two-column intro above the hub is headline-left / copy-right, and that split is the fix for a
reported problem.** `.about-intro-left` holds the `// About us //` eyebrow and the 40px `<h2>`;
`.about-intro-right` holds `.about-lead` and, beneath it, the `.about-cluster` flag block. It used
to be eyebrow + flag cluster on the left against h2 + lead + CTA on the right, which left most of
the left half empty — so don't move the heading back. The `1.05fr 0.95fr` ratio and the retained
`align-items: center` go together: at that ratio the two columns land within ~15px of each other, so
centring reads as aligned. `.about-intro-left h2` is the heading selector (it was
`.about-intro-right h2`), in the base rules **and** in the `@media (max-width: 820px)` block.

**The "Meet our manufacturers" CTA (`.about-cta`) was removed at the owner's request** — Manufacturers
now sits directly below this section (see "Page section order"), so the button pointed one screen
down. Don't re-add it as a missing conversion path; its CSS rules are gone too.

The rest of the section is `.about-hub`: the ETS mark on a circular
plate (`.hub-core` + `.hub-mark`), four fact cards around it (two left, two right), each card led by
a small icon badge, and a short connector running from each card's inner edge to a dot on the
circle. It is modelled on a reference layout supplied by the owner, adapted at their request — the
badges started at the hub's outer corners with elbow connectors reaching out to them, which is the
arrangement the paragraphs below keep warning you not to rebuild.

**Each fact now lives in exactly one place — plain DOM text in its `.hub-card`.** This replaced a
hand-authored SVG stat-line (`.stats-curve`, four `<g class="stat-node">` on an ascending curve)
that carried every fact **three** times: the `<g>`, a duplicate `.mini-stat` card in the
`.about-stats-grid` fallback that swapped in below 820px, and an `<svg aria-label>` prose sentence
restating all four (the only copy a screen reader got). All three had to be edited together and
nothing flagged a drift. **Do not reintroduce a small-screen fallback grid** — the cards reflow on
their own, so a second copy would only bring the sync problem back. Reordering a fact is now a
plain markup move; there are no fixed coordinates to keep DOM order aligned with visual order.

**The connectors are a geometry contract between two numbers**, both derived rather than chosen.
The core is centred in the middle column, so `50%` *is* the circle centre on both axes:

- **120px** — `.hub-core` is 340px square → radius 170 → a dot at 45° sits `170 × 0.707 ≈ 120px`
  from the centre on both axes. That is every `calc(50% ± 120px)` in the file.
- **230px** — the card's inner edge: `170` (core half-width) + `60` (the `column-gap`). Change the
  gap and this must move with it.

Each connector is one zero-height bordered box running from its card's inner edge to its dot, and
**no further** — it spans only the column gap, so it overlaps nothing. It is deliberately not an
SVG overlay: an overlay tracking a flexing container needs `preserveAspectRatio="none"`, and its
endpoints could only be percentages while the circle's edge is a fixed radius. Borders land on both
ends exactly — verified at 0.00px on all eight endpoints across the desktop range.

They used to be **elbows** continuing past the card to an icon badge at the hub's outer corner,
which meant running behind the card (and needing `z-index: -1` plus `isolation: isolate` to avoid
striking through its text). The owner asked for the over-extension gone; the badges moved into the
cards and all of that machinery went with them. Don't rebuild it.

**Three CSS details that look like tidying and are not:**

- **`grid-template-columns` uses `minmax(0, 1fr)`, not a px minimum.** With `minmax(210px, 1fr)` the
  three tracks overflow the container on narrow desktops, which shoves the core off centre and
  breaks every connector. Collapsing tracks keep the core centred at any width, so the contract
  can't fail between breakpoints — only the cards get narrow.
- **`.hub-badge` must stay in the card's normal flow.** It was once absolutely positioned at
  `.about-hub`'s outer corners, and that broke the moment the page animated: `aboutHub()` tweens
  `.hub-card` with `y`, GSAP leaves a `transform` on it, and **a transformed element becomes the
  containing block for its absolutely-positioned descendants** — so all four badges jumped into
  their own cards' corners, sitting on top of the titles. Giving a card `position: relative` does
  the identical thing. Anything added inside a `.hub-card` must be laid out in the flow.
- **`.hub-dot` is centred with negative margins, not `translate(-50%, -50%)`.** `aboutHub()` tweens
  the dots' `scale`, and GSAP takes ownership of `transform` without preserving a percentage
  translate — which leaves every dot 4.5px off its point and each connector visibly short of it.

**That badge bug is also a lesson about the screenshot workflow.** It could not appear in any
`--force-prefers-reduced-motion` capture, because `wireMotion()` bails before the tween runs — the
exact flag the headless notes recommend for everything GSAP touches. Layout that depends on whether
GSAP has written a transform needs either a real browser or a probe run *without* that flag.

**Breakpoints.** The hub needs 880px of its own width to keep ~210px cards
(`340 core + 60×2 gaps + 210×2 cards`), and `.wrap`'s 24px padding means it only ever gets
`viewport - 48`, so side-by-side fits from a 928px viewport. It flattens at **1040px** as a comfort
margin, which is why this is not the site's 900px layout breakpoint. Flattened, it is a 2-column
card grid with the core centred above it and the connectors and dots `display: none` (they have
nothing to join); the cards themselves are unchanged, the badge already being in the flow.
**560px** drops the cards to one column. The `@media (max-width: 820px)` block still holds `.about-intro`'s own rules.

Current order — reading left column top-to-bottom, then right: `18+ Years`, `100+ Mills`,
`Authorized Distributor`, `6 Product Ranges`. `.hub-title b` styles the blue trailing `+`, so it
wraps only the `+` and only on the two cards that have one — `6 Product Ranges` and `Authorized
Distributor` are plain `--ink`, and there is no second highlight style to invent.

Between them the four cover tenure, customer base, status and breadth. **They are company facts,
not product specifications**, and that altitude is the whole reason this list is curated: two
PhiComp component specs ("35,000+ hours of rotor service life", "110,000 rpm sustained bearing
speed") used to lead the old stat-line and were cut, because in the About section a rotor's rated
life reads as a claim about the company. "Uniform yarn CV across the lifecycle" went the same way
(it is a coating specification, and still appears as one in the Complete Rotors panel copy). The
fourth slot has since been Samples Provided and is now 6 Product Ranges, both at the owner's
request — expect it to keep moving, and keep whatever lands there at company altitude and out of
the hero badge's territory (3 European OEM partners / 100% genuine / 6500+ parts / Ex-stock).

Note the fourth card's copy is also constrained by its neighbour: the Mills card already ends
"…supported by pan-India distribution", so a delivery or reach fact here would restate it.

The four badge icons are hand-authored 24×24 inline SVGs (calendar, factory, rosette, layers)
sitting at the top of each card above its title, `aria-hidden` with the card text carrying the
meaning, stroked with `currentColor` so `.hub-badge`'s `color` drives them — the path data carries
no presentation attributes, since `.hub-badge svg` supplies `fill:none; stroke:currentColor`. No
icon library — same convention as the rotor drawing.

`aboutHub()` in `script.js` choreographs the entrance (core → dots → connectors → cards → badges)
on one ScrollTrigger. Everything is `.from()`, so the natural state is the finished one and reduced
motion needs no special case. `.hub-core, .hub-card` are also listed in `GUARD_EXTRA` and swept by
`guardVisible()` — the old `.stat-node` was in no failsafe list at all, which is the gap that
closes.
