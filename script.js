/* ============================================================================
   Euro Textile Spares — site interactions
   Depends on data.js (NAVELS, NAVEL_MACHINES, AUTOCONER_PARTS, AUTOCORO_PARTS,
   RIETER_PARTS, ZINSER_PARTS, RIETER_STEEL_BELTS, ROTOR_CUP_BEARING, SOLID_ROTOR,
   TWIN_DISCS, FRICTION_DISC, PU_FRICTION_WHEEL)
   ========================================================================== */
(function () {
  "use strict";

  var FALLBACK = '<svg class="part-fallback" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 15l4-4 4 4 4-5 4 4"/></svg>';
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ---- Part card (image + English name, optional RSM code) ---------------- */
  // The photo is a <button>, not a <div>: it opens the lightbox, so it has to be reachable
  // and operable from the keyboard. wireLightbox() delegates on [data-img], so the tag it
  // lives on is not what wires the zoom — but changing it back to a div would silently make
  // every catalog photo mouse-only again.
  function partCard(p) {
    var code = p.code ? '<span class="code">' + esc(p.code) + "</span>" : "";
    var search = (p.en + " " + (p.code || "") + " " + (p.group || "")).toLowerCase();
    return '<div class="part-card" data-search="' + esc(search) + '">' +
      '<button type="button" class="part-photo" data-img="' + esc(p.img) + '" ' +
        'data-label="' + esc(p.en) + '" aria-label="Enlarge photo: ' + esc(p.en) + '">' +
        FALLBACK +
        '<img loading="lazy" src="' + esc(p.img) + '" alt="' + esc(p.en) + '" ' +
        'onload="this.previousSibling && this.previousSibling.remove && this.previousSibling.remove()" ' +
        'onerror="this.remove()">' +
      "</button>" +
      '<div class="part-text">' + code + '<span class="en">' + esc(p.en) + "</span></div>" +
    "</div>";
  }
  function renderFlat(id, parts) {
    var el = document.getElementById(id);
    if (!el || !parts) return;
    el.innerHTML = parts.map(partCard).join("");
    updateCount(id);
  }

  /* ---- Rotor type tables (PhiComp AG) -------------------------------------- */
  // The coating is the suffix of the rotor type: "C536/U-DN" -> "DN", "T 34 DDN" -> "DDN".
  // Longest alternatives first, so DDN/DD/DN win over a bare D. Derived rather than stored
  // in data.js so it can never drift out of sync with the type name.
  function coatingOf(type) {
    var m = /(DDN|DD|DN|D|N)$/.exec(type);
    return m ? m[1] : "";
  }
  // Leaflet p.3: "D: > 20'000 h, DD: > 35'000 h". N is only a smooth top layer over the same
  // diamond coating, so DN tracks D and DDN tracks DD.
  function serviceLife(type) {
    var c = coatingOf(type);
    if (c === "N") return "—";          // no diamond layer, no stated life
    return c.indexOf("DD") === 0 ? "> 35,000 h" : "> 20,000 h";
  }
  // Search on the type alone — the coating suffix is already part of it. Appending
  // coatingOf() as well would make "T 34 D"+"D" normalise to "t34dd" and collide with
  // "T 34 DD", so a search for T34DD would wrongly return the plain-D rotor too.
  function rotorCupRow(r) {
    var search = r.type.toLowerCase();
    return '<tr data-search="' + esc(search) + '">' +
      "<td>" + esc(r.type) + "</td>" +
      "<td>&lt; " + esc(r.speed) + " rpm</td>" +
      "<td>" + esc(serviceLife(r.type)) + "</td>" +
    "</tr>";
  }
  function renderRotorCupTable() {
    var el = document.getElementById("rotorCupTable");
    if (!el || typeof ROTOR_CUP_BEARING === "undefined") return;
    el.innerHTML = ROTOR_CUP_BEARING.map(rotorCupRow).join("");
    updateCount("rotorCupTable");
  }
  // Every SolidRotor is DD-coated for Autocoro 8-11, so service life and warranty are stated
  // once beside the list and the type is the only value that varies — chips rather than a
  // one-column table. The [data-search] attribute is what the search wires onto, not the tag.
  function solidRotorChip(r) {
    return '<li data-search="' + esc(r.type.toLowerCase()) + '">' + esc(r.type) + "</li>";
  }
  function renderSolidRotorList() {
    var el = document.getElementById("solidRotorTable");
    if (!el || typeof SOLID_ROTOR === "undefined") return;
    el.innerHTML = SOLID_ROTOR.map(solidRotorChip).join("");
    updateCount("solidRotorTable");
  }

  /* ---- Friction Disc / PU Friction Wheel tables (CPU) ---------------------- */
  // No per-SKU photography for either family (the catalogue shows one composite cluster photo
  // per family, not one clean shot per lettered type) — same situation as ROTOR_CUP_BEARING
  // above, so these render as text tables too.
  function frictionDiscRow(r) {
    var search = r.type.toLowerCase();
    return '<tr data-search="' + esc(search) + '">' +
      "<td>" + esc(r.type) + "</td>" +
      "<td>" + esc(r.od) + "</td>" +
      "<td>" + esc(r.thickness) + "</td>" +
      "<td>" + esc(r.bore) + "</td>" +
    "</tr>";
  }
  function renderFrictionDiscTable() {
    var el = document.getElementById("frictionDiscTable");
    if (!el || typeof FRICTION_DISC === "undefined") return;
    el.innerHTML = FRICTION_DISC.map(frictionDiscRow).join("");
    updateCount("frictionDiscTable");
  }
  function puFrictionWheelRow(r) {
    var search = (r.type + " " + r.code).toLowerCase();
    return '<tr data-search="' + esc(search) + '">' +
      "<td>" + esc(r.type) + "</td>" +
      "<td>" + esc(r.code) + "</td>" +
      "<td>" + esc(r.od) + "</td>" +
    "</tr>";
  }
  function renderPUFrictionWheelTable() {
    var el = document.getElementById("puFrictionWheelTable");
    if (!el || typeof PU_FRICTION_WHEEL === "undefined") return;
    el.innerHTML = PU_FRICTION_WHEEL.map(puFrictionWheelRow).join("");
    updateCount("puFrictionWheelTable");
  }

  /* ---- Steel strips / conveyor belts, Rieter ring frames (Samatex) --------- */
  // A-F are the dimension letters on the RSM.R100 drawing above the table, not part
  // attributes with names of their own — the legend beside the table is what decodes them.
  // The three "Lock" rows only carry A and B, so blanks render as an em dash rather than
  // leaving visibly empty cells in a 9-column table.
  function beltCell(v) { return "<td>" + (v ? esc(v) : "—") + "</td>"; }
  function steelBeltRow(r) {
    // "with coating" is in the search string so the catalogue's own wording finds the
    // coated rows, the same way a visitor would type it off the printed table.
    var search = (r.name + " " + r.code + (r.coated ? " with emery coating" : "")).toLowerCase();
    return '<tr data-search="' + esc(search) + '">' +
      "<td>" + esc(r.name) + "</td>" +
      "<td>" + esc(r.code) + "</td>" +
      beltCell(r.a) + beltCell(r.b) + beltCell(r.c) +
      beltCell(r.d) + beltCell(r.e) + beltCell(r.f) +
      "<td>" + (r.coated ? "With emery coating" : "—") + "</td>" +
    "</tr>";
  }
  function renderSteelBeltTable() {
    var el = document.getElementById("steelBeltTable");
    if (!el || typeof RIETER_STEEL_BELTS === "undefined") return;
    el.innerHTML = RIETER_STEEL_BELTS.map(steelBeltRow).join("");
    updateCount("steelBeltTable");
  }

  /* ---- Navels ------------------------------------------------------------- */
  // data.js series string -> the anchor id and short heading the Products dropdown's Navels
  // sub-links point at. Keep this in sync with those four <a data-sub="..."> in index.html —
  // an entry missing here still renders (raw series string, no id), it just can't be linked to.
  var NAVEL_SERIES = {
    "Quality — high performance": { id: "sub-navel-high-performance", label: "High Performance" },
    "Basic — standard":           { id: "sub-navel-standard",         label: "Standard" },
    "Smooth — even yarn":         { id: "sub-navel-even-yarn",        label: "Even Yarn" },
    "Soft — high volume yarn":    { id: "sub-navel-high-volume-yarn", label: "High Volume Yarn" }
  };
  function renderNavels() {
    var grid = document.getElementById("navelGrid");
    if (!grid || typeof NAVELS === "undefined") return;
    // NAVELS is already in catalogue order (4 per series), so a heading whenever the series
    // changes is enough — no sorting or bucketing. .parts-group-title is grid-column: 1/-1,
    // so it spans the row rather than sitting in a card slot.
    var seen = null;
    grid.innerHTML = NAVELS.map(function (n) {
      var head = "";
      if (n.series !== seen) {
        seen = n.series;
        var s = NAVEL_SERIES[n.series];
        head = '<h4 class="parts-group-title"' + (s ? ' id="' + s.id + '"' : "") + ">" +
               esc(s ? s.label : n.series) + "</h4>";
      }
      return head +
        '<article class="navel-card">' +
        '<button type="button" class="navel-photo" data-img="' + esc(n.img) + '" ' +
          'data-label="Broell navel ' + esc(n.type) + '" aria-label="Enlarge photo: Broell navel ' + esc(n.type) + '">' +
          '<img loading="lazy" src="' + esc(n.img) + '" alt="Broell navel ' + esc(n.type) + '" ' +
          'onerror="this.parentNode.style.background=\'var(--primary-soft)\';this.remove();"></button>' +
        '<div class="navel-info">' +
          '<span class="type">' + esc(n.type) + "</span>" +
          '<span class="series">' + esc(n.series) + "</span>" +
          '<p class="navel-spec"><b>Fibre:</b> ' + esc(n.fibre) + "</p>" +
          '<p class="navel-spec"><b>Counts:</b> ' + esc(n.counts) + "</p>" +
          '<p class="navel-spec"><b>Use:</b> ' + esc(n.endUse) + "</p>" +
          '<ul class="navel-benefits">' + n.benefits.map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + "</ul>" +
        "</div></article>";
    }).join("");
    var ml = document.getElementById("navelMachines");
    if (ml && typeof NAVEL_MACHINES !== "undefined") {
      ml.innerHTML = NAVEL_MACHINES.map(function (m) { return "<li>" + esc(m) + "</li>"; }).join("");
    }
  }

  /* ---- Parts search ------------------------------------------------------- */
  function normalizeSearch(s) { return s.replace(/[^a-z0-9]/g, ""); }
  function updateCount(id) {
    var el = document.getElementById(id);
    var badge = document.querySelector('.parts-count[data-count="' + id + '"]');
    if (!el || !badge) return;
    var visible = 0;
    el.querySelectorAll("[data-search]").forEach(function (c) { if (c.style.display !== "none") visible++; });
    badge.textContent = visible + " part" + (visible === 1 ? "" : "s") + " shown";
  }
  function filterContainer(el, q, qNorm) {
    var anyVisible = false;
    el.querySelectorAll("[data-search]").forEach(function (c) {
      var raw = c.getAttribute("data-search");
      var show = !q || raw.indexOf(q) !== -1 || normalizeSearch(raw).indexOf(qNorm) !== -1;
      c.style.display = show ? "" : "none";
      if (show) anyVisible = true;
    });
    el.querySelectorAll(".parts-group-title").forEach(function (title) {
      var any = false, node = title.nextElementSibling;
      while (node && !node.classList.contains("parts-group-title")) {
        if (node.hasAttribute("data-search") && node.style.display !== "none") any = true;
        node = node.nextElementSibling;
      }
      title.style.display = any ? "" : "none";
    });
    return anyVisible;
  }
  function setEmptyState(id, el, anyVisible, queryValue) {
    var host = el.closest(".table-scroll") || el;
    var empty = document.querySelector('.parts-empty[data-empty-for="' + id + '"]');
    if (!anyVisible) {
      if (!empty) {
        empty = document.createElement("p");
        empty.className = "parts-empty";
        empty.setAttribute("data-empty-for", id);
        host.insertAdjacentElement("afterend", empty);
      }
      empty.textContent = "No results match “" + queryValue + "”. Try a different term or send us an enquiry.";
    } else if (empty) { empty.remove(); }
  }
  function wireSearch() {
    document.querySelectorAll(".parts-search").forEach(function (input) {
      var ids = input.getAttribute("data-target").split(",").map(function (s) { return s.trim(); });
      input.addEventListener("input", function () {
        var q = input.value.trim().toLowerCase();
        var qNorm = normalizeSearch(q);
        ids.forEach(function (id) {
          var el = document.getElementById(id);
          if (!el) return;
          var anyVisible = filterContainer(el, q, qNorm);
          setEmptyState(id, el, anyVisible, input.value);
          updateCount(id);
        });
      });
    });
  }

  /* ---- Category tabs + dropdown nav --------------------------------------- */
  var tabs, panels;
  function activateCat(cat) {
    if (!tabs) return;
    tabs.forEach(function (t) {
      var on = t.getAttribute("data-cat") === cat;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
      // Roving tabindex: the tablist is one Tab stop, arrows move between tabs (WAI-ARIA
      // tabs pattern). Without this all six land in the Tab order and the arrow keys do nothing.
      t.setAttribute("tabindex", on ? "0" : "-1");
    });
    panels.forEach(function (p) { p.classList.toggle("is-active", p.getAttribute("data-panel") === cat); });
  }

  // The tab/panel ARIA relationship is generated from the data-cat/data-panel strings that
  // already exist, rather than hand-written id=/aria-controls pairs in the markup. That keeps
  // the sync points at the three CLAUDE.md documents (nav link, .cat-tab, .cat-panel) — adding
  // a category still needs no extra attributes here.
  function wireTabAria() {
    tabs.forEach(function (t) {
      var cat = t.getAttribute("data-cat");
      t.setAttribute("role", "tab");
      t.id = "cat-tab-" + cat;
      t.setAttribute("aria-controls", "cat-panel-" + cat);
    });
    panels.forEach(function (p) {
      var cat = p.getAttribute("data-panel");
      p.setAttribute("role", "tabpanel");
      p.id = "cat-panel-" + cat;
      p.setAttribute("aria-labelledby", "cat-tab-" + cat);
      p.setAttribute("tabindex", "0");   // a scrollable panel must be keyboard-scrollable
    });
  }

  // Left/Right (plus Home/End) move between tabs and activate, per the WAI-ARIA tabs pattern.
  function wireTabKeys() {
    var list = document.querySelector(".cat-tabs");
    if (!list) return;
    list.addEventListener("keydown", function (e) {
      var order = Array.prototype.slice.call(tabs);
      var i = order.indexOf(document.activeElement);
      if (i === -1) return;
      var next = -1;
      if (e.key === "ArrowRight") next = (i + 1) % order.length;
      else if (e.key === "ArrowLeft") next = (i - 1 + order.length) % order.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = order.length - 1;
      if (next === -1) return;
      e.preventDefault();
      activateCat(order[next].getAttribute("data-cat"));
      order[next].focus();
      refreshMotion();
    });
  }

  function wireTabs() {
    tabs = document.querySelectorAll(".cat-tab");
    panels = document.querySelectorAll(".cat-panel");
    wireTabAria();
    // Sync the ARIA state to whichever tab carries .is-active in the markup. Without this the
    // landing category renders with no aria-selected and no roving tabindex — all six tabs sit
    // in the Tab order and none is announced as selected until the user clicks something.
    var initial = document.querySelector(".cat-tab.is-active");
    if (initial) activateCat(initial.getAttribute("data-cat"));
    wireTabKeys();
    tabs.forEach(function (tab) {
      // No scroll happens here (the user is already looking at #products), so the trigger
      // positions can be refreshed immediately.
      tab.addEventListener("click", function () { activateCat(tab.getAttribute("data-cat")); refreshMotion(); });
    });
    // Category links that live outside the tab strip: the Products dropdown (including its
    // .subdropdown sub-links) and the footer's Products column. Both jump to the right category
    // and scroll to the catalog. The selector is deliberately `a[data-cat]` and not
    // `[data-cat]` — the .cat-tab elements are <button>, handled above, and must not also
    // scroll. Any new category link anywhere on the page is wired just by being an <a>
    // that carries data-cat.
    document.querySelectorAll("a[data-cat]").forEach(function (a) {
      a.addEventListener("click", function (e) {
        // JS drives the scroll exclusively — preventDefault stops the browser's own hash jump.
        // That native jump used to be trusted to do the scrolling (a plain href="#..." is already
        // correct for every link, sub or not), but it was unreliable for two stacked reasons: (1)
        // activateCat() below swaps .cat-panel visibility synchronously, so the browser could be
        // computing the target's position against a layout that's still mid-change — panel heights
        // differ by thousands of pixels, and .cat-panel.is-active also runs a translateY(8px)->0
        // entrance animation; (2) a sub-link's scroll distance is far more variable than the
        // top-level jump to #products, so refreshAfterScroll's fallback timer could fire (and
        // ST.refresh() cancels an in-flight smooth scroll — see "Motion layer") before a long
        // native scroll had actually finished, stopping it short. Deferring our own scrollIntoView
        // one frame past activateCat() lets layout settle before we measure the target, and being
        // the only scroll driver means refreshAfterScroll's scrollend detection is unambiguous.
        e.preventDefault();
        var hash = a.getAttribute("href");
        activateCat(a.getAttribute("data-cat"));
        // pushState (not location.hash =) updates the URL/keeps sub-links bookmarkable without
        // itself triggering a second, competing native scroll.
        if (hash && history.pushState) history.pushState(null, "", hash);
        requestAnimationFrame(function () {
          var target = hash ? document.querySelector(hash) : null;
          if (target) target.scrollIntoView({ behavior: "smooth" });
        });
        refreshAfterScroll();
        // preventDefault above also suppresses the focus reset the browser's fragment navigation
        // used to do for free. Without this blur, focus stays on the clicked link *inside*
        // .dropdown, and style.css's `.has-dropdown:focus-within .dropdown` /
        // `.has-sub:focus-within > .subdropdown` rules then pin the dropdown AND its sub-flyout
        // open — the menu stops behaving as a hover menu at all. Load-bearing, not a stray line;
        // the :focus-within rules themselves must stay (they are what makes the menu usable by
        // keyboard).
        a.blur();
        closeMenu();
      });
    });
  }

  // A sub-category link is a real anchor, so it can be copied or bookmarked. On a cold load the
  // target sits inside a .cat-panel that is display:none unless it happens to be the landing
  // category, and the browser silently skips the jump — activate the owning panel and scroll it
  // into view ourselves.
  function wireHashDeepLink() {
    if (!location.hash || location.hash.length < 2) return;
    var target;
    try { target = document.querySelector(location.hash); } catch (e) { return; }
    if (!target) return;
    var panel = target.closest(".cat-panel");
    if (!panel) return;                       // ordinary section anchor, browser handles it
    activateCat(panel.getAttribute("data-panel"));
    // Panel visibility only lands on the next frame, so measure the scroll after it.
    requestAnimationFrame(function () {
      target.scrollIntoView();
      refreshAfterScroll();
    });
  }

  /* ---- Lightbox (zoom a clicked part / navel photo) ----------------------- */
  // The trigger contract is the [data-img] / [data-label] attribute pair, NOT a class — that is
  // what lets one delegated listener serve both .part-photo (renderFlat) and .navel-photo
  // (renderNavels). partCard()/renderNavels() write those attributes; a renderer that stops
  // writing them silently loses zoom with no console error.
  function wireLightbox() {
    var box = document.getElementById("lightbox");
    if (!box) return;
    var img = document.getElementById("lbImg");
    var counter = document.getElementById("lbCounter");
    var closeBtn = box.querySelector(".lb-close");
    var lastFocus = null;

    function open(src, label) {
      lastFocus = document.activeElement;
      img.src = src; img.alt = label || "";
      if (counter) counter.textContent = label || "";
      box.classList.add("open"); box.setAttribute("aria-hidden", "false");
      document.body.classList.add("no-scroll");
      if (closeBtn) closeBtn.focus();
    }
    function close() {
      box.classList.remove("open"); box.setAttribute("aria-hidden", "true"); img.src = "";
      document.body.classList.remove("no-scroll");
      // Return focus to the photo that opened it, so keyboard users don't get dumped at the
      // top of the document halfway down a 124-card grid.
      if (lastFocus && lastFocus.focus) lastFocus.focus();
      lastFocus = null;
    }

    document.addEventListener("click", function (e) {
      var photo = e.target.closest("[data-img]");
      if (photo) open(photo.getAttribute("data-img"), photo.getAttribute("data-label"));
    });
    if (closeBtn) closeBtn.addEventListener("click", close);
    box.addEventListener("click", function (e) { if (e.target === box) close(); });
    document.addEventListener("keydown", function (e) {
      if (!box.classList.contains("open")) return;
      if (e.key === "Escape") { close(); return; }
      // Only the close button is focusable inside, so the "trap" is simply: keep Tab on it.
      if (e.key === "Tab") { e.preventDefault(); if (closeBtn) closeBtn.focus(); }
    });
  }

  /* ---- Navbar shrink + hamburger ------------------------------------------ */
  var toggleEl, linksEl;
  function closeMenu() {
    if (linksEl && linksEl.classList.contains("open")) {
      linksEl.classList.remove("open"); toggleEl.classList.remove("open");
      toggleEl.setAttribute("aria-expanded", "false");
      document.body.classList.remove("no-scroll");
    }
  }
  function wireNav() {
    var navbar = document.querySelector(".navbar");
    toggleEl = document.querySelector(".nav-toggle");
    linksEl = document.querySelector(".nav-links");
    // Only write when the state actually flips. Assigning the same string on every scroll event
    // still dirties the style and costs a recalc on a page this tall.
    var lifted = null;
    window.addEventListener("scroll", function () {
      var now = window.scrollY > 40;
      if (now === lifted) return;
      lifted = now;
      navbar.style.boxShadow = now ? "0 4px 16px rgba(14,42,69,.10)" : "none";
    }, { passive: true });
    if (toggleEl && linksEl) {
      toggleEl.addEventListener("click", function () {
        var open = linksEl.classList.toggle("open");
        toggleEl.classList.toggle("open", open);
        toggleEl.setAttribute("aria-expanded", open ? "true" : "false");
        document.body.classList.toggle("no-scroll", open);
      });
      // Close the open menu on ANY link tap, including the Products parent. This used to skip
      // .dropdown-toggle, which is right on desktop (it's a hover flyout that must stay open) but
      // wrong on mobile: there the dropdown is already flattened to a permanently visible list, so
      // the tap is pure navigation and the 85vh menu was left covering the section just jumped to.
      // No breakpoint test is needed — closeMenu() no-ops unless .nav-links carries .open, and
      // .open is only ever set by the hamburger, which is display:none above 1100px. Keep it that
      // way: nothing in this file hardcodes a breakpoint, so the nav stays purely CSS-driven.
      linksEl.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", closeMenu);
      });
    }
  }

  /* ---- Contact form (front-end only) -------------------------------------- */
  function wireForm() {
    var form = document.querySelector(".contact-form");
    if (!form) return;
    var status = form.querySelector(".form-status");
    var btn = form.querySelector(".btn-submit");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        status.textContent = "Please fill in your name, email and part / machine details.";
        status.classList.add("show");
        return;
      }
      var label = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Sending…";
      status.textContent = "";
      status.classList.remove("show");
      fetch(form.action, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(form)
      }).then(function (res) {
        // res.ok is NOT the whole test. formsubmit.co's /ajax/ endpoint answers 200 with
        // {"success": "false", "message": …} for a form it will not deliver — an unactivated
        // address, or a post it scored as spam — so a status-only check reports success to the
        // visitor while no mail is ever sent. That false-success trap is the one CLAUDE.md
        // warns about under "Contact form"; this is what actually catches it.
        if (!res.ok) throw new Error("formsubmit.co returned HTTP " + res.status);
        // A non-JSON 200 keeps the old benefit-of-the-doubt behaviour rather than failing.
        return res.json().catch(function () { return null; });
      }).then(function (data) {
        // `success` comes back as the STRING "true"/"false" — "false" is truthy, so it has to
        // be compared. `if (!data.success)` would pass every declined submission through.
        if (data && String(data.success) === "false") {
          throw new Error("formsubmit.co declined it: " + (data.message || "no reason given"));
        }
        form.reset();
        status.textContent = "Thank you — your enquiry has been sent. Our team will be in touch shortly.";
        status.classList.add("show");
      }).catch(function (err) {
        // Keep the reason. The two failure modes are indistinguishable to the visitor but not to
        // us: a request blocked before it left the browser (privacy extension, firewall, offline)
        // rejects with a TypeError, while an HTTP or declined-submission failure carries the text
        // thrown above. Without this the console said nothing and every report was a guess.
        if (window.console && console.warn) console.warn("Contact form submission failed:", err);
        status.textContent = "Sorry, something went wrong. Please email dengle@eurotextilespares.com directly.";
        status.classList.add("show");
      }).finally(function () {
        btn.disabled = false;
        btn.textContent = label;
      });
    });
  }

  /* ---- Motion layer (GSAP, with graceful fallbacks) ----------------------- */
  var REVEAL_SEL = ".section-head, .about-intro, .mfr-card, .cap-card";

  // The About hub is choreographed by aboutHub() rather than batch-revealed, so REVEAL_SEL
  // doesn't cover it — but motion-layer rule 3 still does: guardVisible() sweeps these too, so a
  // stale trigger can't leave the hub blank. (The old .stat-node was in no failsafe list at all.)
  var GUARD_EXTRA = ".hub-core, .hub-card";

  // Reveal timings. Capabilities is a common jump target ("Capabilities" in the nav) and sits
  // just below the tall product catalog, so it starts earlier and resolves faster — landing on a
  // still-fading section reads as the page being slow. Everything else keeps the original rhythm.
  var REVEAL_BASE = { start: "top 85%", interval: 0.1, duration: 0.7, stagger: 0.12 };
  var REVEAL_FAST = { start: "top 92%", interval: 0.06, duration: 0.55, stagger: 0.08 };

  // Panel swaps change the document height by thousands of pixels (Autocoro renders 40 cards and
  // Autoconer 27, while Twin Discs is 4 cards plus two short spec tables, and Complete Rotors runs
  // past 7000px on its own), which leaves every trigger below #products pointing at the old
  // layout — the reveals then fire at the wrong scroll position, or not at all.
  // Guarded so the tabs still work with the vendor files missing.
  function refreshMotion() {
    var ST = window.ScrollTrigger;
    if (!ST) return;
    // One frame is enough: .cat-panel's fade keyframe animates opacity/transform only, so the
    // new panel's height is final as soon as the class toggle has been applied.
    requestAnimationFrame(function () { ST.refresh(); });
  }

  // ScrollTrigger.refresh() briefly snaps the scroll position to remeasure, which cancels an
  // in-flight scrollIntoView({behavior:"smooth"}) if fired on the same frame (this is what broke
  // the Products dropdown links: activateCat's refresh raced the nav's own smooth scroll and
  // stranded it near the start). Defer the refresh until scrolling has actually settled instead.
  function refreshAfterScroll() {
    var done = false;
    function run() { if (done) return; done = true; refreshMotion(); }
    window.addEventListener("scrollend", run, { once: true });
    // Fallback for browsers without `scrollend` (e.g. Safari < 17.4) — 1000ms rather than a
    // tighter guess, since a sub-link's scroll distance is unpredictable (activateCat can swap in
    // a panel thousands of pixels shorter/taller first) and firing this before a still-in-flight
    // native scroll truly finishes is exactly what stops that scroll short.
    setTimeout(run, 1000);
  }

  // Fallback reveal when GSAP is unavailable (offline / vendor files missing)
  function legacyReveal() {
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("reveal-visible"); obs.unobserve(en.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll(REVEAL_SEL).forEach(function (el) { el.classList.add("reveal-hidden"); io.observe(el); });
  }

  // Hero entrance: choreographed timeline
  // (eyebrow → brand mark → company name → lead → actions → cred cards)
  // The h1 is a lockup, so it animates in two beats: the mark pops in first, then the name
  // unfurls rightward from beside it. Both halves must stay listed here — HERO_SEL is what the
  // setTimeout failsafe below sweeps, so dropping either one leaves it uncovered if the ticker
  // is throttled.
  var HERO_SEL = [".hero-copy .eyebrow", ".hero-copy .lockup-mark", ".hero-copy .lockup-name",
                  ".hero-lead", ".hero-actions", ".hero-badge .cred-item"];
  function heroIntro(gsap) {
    if (!document.querySelector(".hero")) return;
    gsap.timeline({ defaults: { ease: "power3.out", duration: 0.7 } })
      .from(HERO_SEL[0], { y: 20, autoAlpha: 0 })
      .from(HERO_SEL[1], { scale: 0.6, autoAlpha: 0, duration: 0.8, ease: "back.out(1.6)" }, "-=0.45")
      .from(HERO_SEL[2], { x: -20, autoAlpha: 0 }, "-=0.15")
      .from(HERO_SEL[3], { y: 24, autoAlpha: 0 }, "-=0.45")
      .from(HERO_SEL[4], { y: 20, autoAlpha: 0 }, "-=0.45")
      .from(HERO_SEL[5], { y: 24, autoAlpha: 0, stagger: 0.12 }, "-=0.40");
    // Failsafe (native timer, independent of GSAP's rAF ticker): the hero is above the fold,
    // so if the ticker is ever throttled (e.g. page loaded in a background tab) force it visible.
    setTimeout(function () {
      gsap.set(HERO_SEL, { autoAlpha: 1, clearProps: "transform,opacity,visibility" });
    }, 2600);
  }

  // Count-up the credibility numbers, preserving any prefix/suffix (100%, 4000+); skip non-numeric (Ex-stock)
  function countUp(gsap, ST) {
    document.querySelectorAll(".cred-num").forEach(function (el) {
      var original = el.textContent.trim();
      var m = original.match(/^(\D*)(\d[\d,]*)(.*)$/);
      if (!m) return;
      var prefix = m[1], target = parseInt(m[2].replace(/,/g, ""), 10), suffix = m[3];
      if (!isFinite(target)) return;
      var obj = { v: 0 };
      gsap.to(obj, {
        v: target, duration: 1.4, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: function () { el.textContent = prefix + Math.round(obj.v) + suffix; }
      });
      // Failsafe: for a number already in view at load, guarantee the final value lands even if the
      // ticker is throttled (background tab). Skip off-screen numbers so their count-up still triggers on scroll.
      if (el.getBoundingClientRect().top < (window.innerHeight || 0)) {
        setTimeout(function () { el.textContent = original; }, 2600);
      }
    });
  }

  // Scroll-reveal always-visible sections via batched triggers (never per-card across the 290+ catalog)
  function revealBatch(gsap, ST, els, cfg) {
    if (!els.length) return;
    gsap.set(els, { autoAlpha: 0, y: 32 });
    ST.batch(els, {
      start: cfg.start,
      interval: cfg.interval,
      onEnter: function (batch) {
        gsap.to(batch, { autoAlpha: 1, y: 0, duration: cfg.duration, ease: "power3.out", stagger: cfg.stagger, overwrite: true });
      }
    });
  }
  function scrollReveals(gsap, ST) {
    var cap = [], rest = [];
    gsap.utils.toArray(REVEAL_SEL).forEach(function (el) {
      (el.closest("#capabilities") ? cap : rest).push(el);
    });
    revealBatch(gsap, ST, rest, REVEAL_BASE);
    revealBatch(gsap, ST, cap, REVEAL_FAST);
  }

  // Last resort, in the spirit of the hero's timer failsafe: nothing inside the viewport may stay
  // invisible. Covers a trigger left stale by a layout change we didn't refresh for.
  function guardVisible(gsap) {
    var h = window.innerHeight || 0;
    document.querySelectorAll(REVEAL_SEL + ", " + GUARD_EXTRA).forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < h && r.bottom > 0 && getComputedStyle(el).visibility === "hidden") {
        gsap.set(el, { autoAlpha: 1, y: 0 });
      }
    });
  }

  // About hub: pop the brand plate, then radiate out to the dots, connectors and fact cards.
  // Everything is .from(), so the natural state is the finished one and reduced motion needs no
  // special case. The connectors fade rather than animating width/clip-path — a stale layout can
  // then never leave an elbow drawn half-way to nowhere.
  function aboutHub(gsap) {
    if (!document.querySelector(".about-hub")) return;
    gsap.timeline({
      scrollTrigger: { trigger: ".about-hub", start: "top 80%", once: true },
      defaults: { ease: "power3.out", duration: 0.6 }
    })
      .from(".hub-core",  { scale: 0.85, autoAlpha: 0, duration: 0.75, ease: "back.out(1.5)" })
      .from(".hub-dot",   { scale: 0, autoAlpha: 0, stagger: 0.06 }, "-=0.35")
      .from(".hub-link",  { autoAlpha: 0, stagger: 0.06 }, "-=0.30")
      .from(".hub-card",  { y: 18, autoAlpha: 0, stagger: 0.10 }, "-=0.35")
      .from(".hub-badge", { scale: 0.6, autoAlpha: 0, stagger: 0.08 }, "-=0.40");
  }

  function wireMotion() {
    var gsap = window.gsap;
    var ST = window.ScrollTrigger;
    var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // No GSAP (e.g. offline without the vendor files) → lightweight fallback reveal, content always ends visible
    if (!gsap || !ST) { legacyReveal(); return; }
    // Reduced motion → leave everything in its natural, fully-visible state; no animation
    if (prefersReduced) return;

    gsap.registerPlugin(ST);
    // matchMedia auto-reverts if the user flips the reduced-motion setting at runtime
    gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", function () {
      heroIntro(gsap);
      scrollReveals(gsap, ST);
      countUp(gsap, ST);
      aboutHub(gsap);
    });
    ST.refresh();
    // Manrope loads with display=swap, so the swap can still reflow text heights after init.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ST.refresh(); });
    // Lazy-loaded catalog images can shift layout after init — recalc trigger positions once loaded.
    window.addEventListener("load", function () { ST.refresh(); guardVisible(gsap); });
  }

  /* ---- init --------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    renderNavels();
    renderFlat("autoconerParts", typeof AUTOCONER_PARTS !== "undefined" ? AUTOCONER_PARTS : []);
    renderFlat("autocoroParts", typeof AUTOCORO_PARTS !== "undefined" ? AUTOCORO_PARTS : []);
    renderFlat("rieterParts", typeof RIETER_PARTS !== "undefined" ? RIETER_PARTS : []);
    renderFlat("zinserParts", typeof ZINSER_PARTS !== "undefined" ? ZINSER_PARTS : []);
    renderSteelBeltTable();
    renderRotorCupTable();
    renderSolidRotorList();
    renderFlat("twinDiscParts", typeof TWIN_DISCS !== "undefined" ? TWIN_DISCS : []);
    renderFrictionDiscTable();
    renderPUFrictionWheelTable();
    wireSearch();
    wireTabs();
    wireHashDeepLink();
    wireLightbox();
    wireNav();
    wireForm();
    wireMotion();
    var yr = document.getElementById("year"); if (yr) yr.textContent = new Date().getFullYear();
  });
})();
