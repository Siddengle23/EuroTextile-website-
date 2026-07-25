/* ============================================================================
   Euro Textile Spares — site interactions
   Depends on data.js (NAVELS, NAVEL_MACHINES, AUTOCONER_PARTS, AUTOCORO_PARTS,
   RIETER_PARTS, ZINSER_PARTS)
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
  function renderGrouped(id, parts) {
    var el = document.getElementById(id);
    if (!el || !parts) return;
    var html = "", current = null;
    parts.forEach(function (p) {
      if (p.group !== current) { current = p.group; html += '<h4 class="parts-group-title">' + esc(p.group) + "</h4>"; }
      html += partCard(p);
    });
    el.innerHTML = html;
    updateCount(id);
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
          '<p class="navel-spec"><b>Counts:</b> ' + esc(n.counts) + " · <b>Use:</b> " + esc(n.endUse) + "</p>" +
          '<ul class="navel-benefits">' + n.benefits.map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + "</ul>" +
        "</div></article>";
    }).join("");
    var ml = document.getElementById("navelMachines");
    if (ml && typeof NAVEL_MACHINES !== "undefined") {
      ml.innerHTML = NAVEL_MACHINES.map(function (m) { return "<li>" + esc(m) + "</li>"; }).join("");
    }
  }

  /* ---- Parts search ------------------------------------------------------- */
  function updateCount(id) {
    var el = document.getElementById(id);
    var badge = document.querySelector('.parts-count[data-count="' + id + '"]');
    if (!el || !badge) return;
    var visible = 0;
    el.querySelectorAll(".part-card").forEach(function (c) { if (c.style.display !== "none") visible++; });
    badge.textContent = visible + " part" + (visible === 1 ? "" : "s") + " shown";
  }
  function wireSearch() {
    document.querySelectorAll(".parts-search").forEach(function (input) {
      input.addEventListener("input", function () {
        var id = input.getAttribute("data-target");
        var el = document.getElementById(id);
        if (!el) return;
        var q = input.value.trim().toLowerCase();
        var anyVisible = false;
        el.querySelectorAll(".part-card").forEach(function (c) {
          var show = !q || c.getAttribute("data-search").indexOf(q) !== -1;
          c.style.display = show ? "" : "none";
          if (show) anyVisible = true;
        });
        el.querySelectorAll(".parts-group-title").forEach(function (title) {
          var any = false, node = title.nextElementSibling;
          while (node && !node.classList.contains("parts-group-title")) {
            if (node.classList.contains("part-card") && node.style.display !== "none") any = true;
            node = node.nextElementSibling;
          }
          title.style.display = any ? "" : "none";
        });
        var empty = el.querySelector(".parts-empty");
        if (!anyVisible && !empty) {
          empty = document.createElement("p"); empty.className = "parts-empty";
          empty.textContent = "No parts match “" + input.value + "”. Try a different term or send us an inquiry.";
          el.appendChild(empty);
        } else if (anyVisible && empty) { empty.remove(); }
        updateCount(id);
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
      tab.addEventListener("click", function () { activateCat(tab.getAttribute("data-cat")); });
    });
    // Products dropdown links jump to the right category + scroll to catalog
    document.querySelectorAll(".dropdown a[data-cat]").forEach(function (a) {
      a.addEventListener("click", function () {
        activateCat(a.getAttribute("data-cat"));
        var products = document.getElementById("products");
        if (products) products.scrollIntoView({ behavior: "smooth" });
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

  // Count-up the credibility numbers, preserving any prefix/suffix (100%, 290+); skip non-numeric (Pune)
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

  // Scroll-reveal always-visible sections via one batched trigger (never per-card across the 290+ catalog)
  function scrollReveals(gsap, ST) {
    var els = gsap.utils.toArray(REVEAL_SEL);
    if (!els.length) return;
    gsap.set(els, { autoAlpha: 0, y: 32 });
    ST.batch(els, {
      start: "top 85%",
      onEnter: function (batch) {
        gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.12, overwrite: true });
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
    // Lazy-loaded catalog images can shift layout after init — recalc trigger positions once loaded.
    window.addEventListener("load", function () { ST.refresh(); });
  }

  /* ---- init --------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    renderNavels();
    renderFlat("autoconerParts", typeof AUTOCONER_PARTS !== "undefined" ? AUTOCONER_PARTS : []);
    renderGrouped("autocoroParts", typeof AUTOCORO_PARTS !== "undefined" ? AUTOCORO_PARTS : []);
    renderFlat("rieterParts", typeof RIETER_PARTS !== "undefined" ? RIETER_PARTS : []);
    renderFlat("zinserParts", typeof ZINSER_PARTS !== "undefined" ? ZINSER_PARTS : []);
    wireSearch();
    wireTabs();
    wireLightbox();
    wireNav();
    wireForm();
    wireMotion();
    var yr = document.getElementById("year"); if (yr) yr.textContent = new Date().getFullYear();
  });
})();
