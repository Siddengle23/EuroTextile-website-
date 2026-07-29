/* ============================================================================
   Euro Textile Spares — site interactions
   Depends on data.js (NAVELS, NAVEL_MACHINES, AUTOCONER_PARTS, AUTOCORO_PARTS,
   RIETER_PARTS, ZINSER_PARTS, ROTOR_CUP_BEARING, SOLID_ROTOR)
   ========================================================================== */
(function () {
  "use strict";

  var FALLBACK = '<svg class="part-fallback" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 15l4-4 4 4 4-5 4 4"/></svg>';
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ---- Part card (image + English name, optional RSM code) ---------------- */
  function partCard(p) {
    var code = p.code ? '<span class="code">' + esc(p.code) + "</span>" : "";
    var search = (p.en + " " + (p.code || "") + " " + (p.group || "")).toLowerCase();
    return '<div class="part-card" data-search="' + esc(search) + '">' +
      '<div class="part-photo" data-img="' + esc(p.img) + '" data-label="' + esc(p.en) + '">' +
        FALLBACK +
        '<img loading="lazy" src="' + esc(p.img) + '" alt="' + esc(p.en) + '" ' +
        'onload="this.previousSibling && this.previousSibling.remove && this.previousSibling.remove()" ' +
        'onerror="this.remove()">' +
      "</div>" +
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

  /* ---- Navels ------------------------------------------------------------- */
  function renderNavels() {
    var grid = document.getElementById("navelGrid");
    if (!grid || typeof NAVELS === "undefined") return;
    grid.innerHTML = NAVELS.map(function (n) {
      return '<article class="navel-card">' +
        '<div class="navel-photo"><img loading="lazy" src="' + n.img + '" alt="Broell navel ' + esc(n.type) + '" onerror="this.parentNode.style.background=\'var(--primary-soft)\';this.remove();"></div>' +
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
      empty.textContent = "No results match “" + queryValue + "”. Try a different term or send us an inquiry.";
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
    tabs.forEach(function (t) { t.classList.toggle("is-active", t.getAttribute("data-cat") === cat); });
    panels.forEach(function (p) { p.classList.toggle("is-active", p.getAttribute("data-panel") === cat); });
  }
  function wireTabs() {
    tabs = document.querySelectorAll(".cat-tab");
    panels = document.querySelectorAll(".cat-panel");
    tabs.forEach(function (tab) {
      // No scroll happens here (the user is already looking at #products), so the trigger
      // positions can be refreshed immediately.
      tab.addEventListener("click", function () { activateCat(tab.getAttribute("data-cat")); refreshMotion(); });
    });
    // Products dropdown links jump to the right category + scroll to catalog
    document.querySelectorAll(".dropdown a[data-cat]").forEach(function (a) {
      a.addEventListener("click", function () {
        activateCat(a.getAttribute("data-cat"));
        var products = document.getElementById("products");
        if (products) { products.scrollIntoView({ behavior: "smooth" }); refreshAfterScroll(); }
        closeMenu();
      });
    });
  }

  /* ---- Lightbox (zoom a clicked part / navel photo) ----------------------- */
  function wireLightbox() {
    var box = document.getElementById("lightbox");
    if (!box) return;
    var img = document.getElementById("lbImg");
    var counter = document.getElementById("lbCounter");
    box.querySelectorAll(".lb-nav").forEach(function (n) { n.style.display = "none"; });
    if (counter) counter.textContent = "";

    function open(src, label) {
      img.src = src; img.alt = label || "";
      if (counter) counter.textContent = label || "";
      box.classList.add("open"); box.setAttribute("aria-hidden", "false");
    }
    function close() { box.classList.remove("open"); box.setAttribute("aria-hidden", "true"); img.src = ""; }

    document.addEventListener("click", function (e) {
      var photo = e.target.closest(".part-photo");
      if (photo && photo.getAttribute("data-img")) open(photo.getAttribute("data-img"), photo.getAttribute("data-label"));
    });
    box.querySelector(".lb-close").addEventListener("click", close);
    box.addEventListener("click", function (e) { if (e.target === box) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && box.classList.contains("open")) close(); });
  }

  /* ---- Navbar shrink + hamburger ------------------------------------------ */
  var toggleEl, linksEl;
  function closeMenu() {
    if (linksEl && linksEl.classList.contains("open")) {
      linksEl.classList.remove("open"); toggleEl.classList.remove("open");
      toggleEl.setAttribute("aria-expanded", "false");
    }
  }
  function wireNav() {
    var navbar = document.querySelector(".navbar");
    toggleEl = document.querySelector(".nav-toggle");
    linksEl = document.querySelector(".nav-links");
    window.addEventListener("scroll", function () {
      navbar.style.boxShadow = window.scrollY > 40 ? "0 4px 16px rgba(14,42,69,.10)" : "none";
    });
    if (toggleEl && linksEl) {
      toggleEl.addEventListener("click", function () {
        var open = linksEl.classList.toggle("open");
        toggleEl.classList.toggle("open", open);
        toggleEl.setAttribute("aria-expanded", open ? "true" : "false");
      });
      // close when tapping a real navigation link (not the Products parent toggle)
      linksEl.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () { if (!a.classList.contains("dropdown-toggle")) closeMenu(); });
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
        if (!res.ok) throw new Error("Bad response");
        form.reset();
        status.textContent = "Thank you — your inquiry has been sent. Our team will be in touch shortly.";
        status.classList.add("show");
      }).catch(function () {
        status.textContent = "Sorry, something went wrong. Please email dengle@eurotextilespares.com directly.";
        status.classList.add("show");
      }).finally(function () {
        btn.disabled = false;
        btn.textContent = label;
      });
    });
  }

  /* ---- Motion layer (GSAP, with graceful fallbacks) ----------------------- */
  var REVEAL_SEL = ".section-head, .about-intro, .mfr-card, .cap-card, .value-item";

  // Reveal timings. Capabilities is a common jump target ("Capabilities" in the nav) and sits
  // just below the tall product catalog, so it starts earlier and resolves faster — landing on a
  // still-fading section reads as the page being slow. Everything else keeps the original rhythm.
  var REVEAL_BASE = { start: "top 85%", interval: 0.1, duration: 0.7, stagger: 0.12 };
  var REVEAL_FAST = { start: "top 92%", interval: 0.06, duration: 0.55, stagger: 0.08 };

  // Panel swaps change the document height by thousands of pixels (Autoconer/Autocoro render 124
  // cards each, Twin Discs is one info-card), which leaves every trigger below #products pointing
  // at the old layout — the reveals then fire at the wrong scroll position, or not at all.
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
    setTimeout(run, 700); // fallback for browsers without `scrollend` (e.g. Safari < 16.4)
  }

  // Fallback reveal when GSAP is unavailable (offline / vendor files missing)
  function legacyReveal() {
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("reveal-visible"); obs.unobserve(en.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll(REVEAL_SEL).forEach(function (el) { el.classList.add("reveal-hidden"); io.observe(el); });
  }

  // Hero entrance: choreographed timeline (eyebrow → h1 → lead → actions → cred cards)
  var HERO_SEL = [".hero-copy .eyebrow", ".hero-copy h1", ".hero-lead", ".hero-actions", ".hero-badge .cred-item"];
  function heroIntro(gsap) {
    if (!document.querySelector(".hero")) return;
    gsap.timeline({ defaults: { ease: "power3.out", duration: 0.7 } })
      .from(HERO_SEL[0], { y: 20, autoAlpha: 0 })
      .from(HERO_SEL[1], { y: 28, autoAlpha: 0 }, "-=0.45")
      .from(HERO_SEL[2], { y: 24, autoAlpha: 0 }, "-=0.45")
      .from(HERO_SEL[3], { y: 20, autoAlpha: 0 }, "-=0.45")
      .from(HERO_SEL[4], { y: 24, autoAlpha: 0, stagger: 0.12 }, "-=0.40");
    // Failsafe (native timer, independent of GSAP's rAF ticker): the hero is above the fold,
    // so if the ticker is ever throttled (e.g. page loaded in a background tab) force it visible.
    setTimeout(function () {
      gsap.set(HERO_SEL, { autoAlpha: 1, clearProps: "transform,opacity,visibility" });
    }, 2600);
  }

  // Count-up the credibility numbers, preserving any prefix/suffix (100%, 4000+); skip non-numeric (Pune)
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
    document.querySelectorAll(REVEAL_SEL).forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < h && r.bottom > 0 && getComputedStyle(el).visibility === "hidden") {
        gsap.set(el, { autoAlpha: 1, y: 0 });
      }
    });
  }

  // About stat-line: draw the curve in and stagger the nodes when it scrolls into view.
  // The SVG is fully visible via CSS by default — this only enhances; skipped if the path can't be measured.
  function aboutCurve(gsap, ST) {
    var line = document.querySelector(".stats-line");
    var nodes = gsap.utils.toArray(".stat-node");
    if (!line || !line.getTotalLength || !nodes.length) return;
    var len = line.getTotalLength();
    if (!len) return;
    var trig = { trigger: ".about-stats", start: "top 80%", once: true };
    gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(line, { strokeDashoffset: 0, duration: 1.1, ease: "power2.out", scrollTrigger: trig });
    gsap.from(nodes, { autoAlpha: 0, y: 14, duration: 0.5, stagger: 0.12, ease: "power2.out", scrollTrigger: trig });
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
      aboutCurve(gsap, ST);
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
    renderRotorCupTable();
    renderSolidRotorList();
    wireSearch();
    wireTabs();
    wireLightbox();
    wireNav();
    wireForm();
    wireMotion();
    var yr = document.getElementById("year"); if (yr) yr.textContent = new Date().getFullYear();
  });
})();
