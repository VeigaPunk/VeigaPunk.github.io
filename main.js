/**
 * Plazir-15 Fan Codex — light client interactions only.
 * No backend; ballot demo stays in-browser.
 */
(function () {
  "use strict";

  var navToggle = document.getElementById("nav-toggle");
  var siteNav = document.getElementById("site-nav");
  var navLinks = siteNav ? siteNav.querySelectorAll("a[href^='#']") : [];
  var mainEl = document.getElementById("main");

  function isMobileNav() {
    return navToggle && window.getComputedStyle(navToggle).display !== "none";
  }

  function setNavOpen(open, opts) {
    opts = opts || {};
    if (!navToggle || !siteNav) return;

    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    siteNav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open && isMobileNav());

    if (isMobileNav()) {
      siteNav.setAttribute("aria-hidden", open ? "false" : "true");
      navLinks.forEach(function (link) {
        if (open) link.removeAttribute("tabindex");
        else link.setAttribute("tabindex", "-1");
      });
    } else {
      siteNav.removeAttribute("aria-hidden");
      navLinks.forEach(function (link) {
        link.removeAttribute("tabindex");
      });
    }

    if (opts.focus === "first" && open && navLinks[0]) {
      navLinks[0].focus();
    } else if (opts.focus === "toggle" && !open) {
      navToggle.focus();
    }
  }

  function syncNavForViewport() {
    if (!navToggle || !siteNav) return;
    if (!isMobileNav()) {
      setNavOpen(false);
      siteNav.removeAttribute("aria-hidden");
      navLinks.forEach(function (link) {
        link.removeAttribute("tabindex");
      });
      document.body.classList.remove("nav-open");
    } else if (navToggle.getAttribute("aria-expanded") !== "true") {
      siteNav.setAttribute("aria-hidden", "true");
      navLinks.forEach(function (link) {
        link.setAttribute("tabindex", "-1");
      });
    }
  }

  if (navToggle && siteNav) {
    syncNavForViewport();

    navToggle.addEventListener("click", function () {
      var open = navToggle.getAttribute("aria-expanded") !== "true";
      setNavOpen(open, { focus: open ? "first" : "toggle" });
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        setNavOpen(false);
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
        e.preventDefault();
        setNavOpen(false, { focus: "toggle" });
        return;
      }

      /* Simple focus cycle inside open mobile menu */
      if (
        e.key !== "Tab" ||
        navToggle.getAttribute("aria-expanded") !== "true" ||
        !isMobileNav()
      ) {
        return;
      }

      var focusables = [navToggle].concat(Array.prototype.slice.call(navLinks));
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      var active = document.activeElement;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    });

    document.addEventListener("click", function (e) {
      if (navToggle.getAttribute("aria-expanded") !== "true") return;
      var t = e.target;
      if (siteNav.contains(t) || navToggle.contains(t)) return;
      setNavOpen(false);
    });

    window.addEventListener("resize", function () {
      window.clearTimeout(window.__plazirNavResize);
      window.__plazirNavResize = window.setTimeout(syncNavForViewport, 120);
    });
  }

  /* Skip link: ensure main receives keyboard focus */
  var skip = document.querySelector(".skip-link");
  if (skip && mainEl) {
    skip.addEventListener("click", function () {
      window.setTimeout(function () {
        mainEl.focus({ preventScroll: false });
      }, 0);
    });
  }

  /* Highlight current section in nav (IntersectionObserver) */
  var sectionIds = [
    "astrography",
    "world",
    "government",
    "history",
    "ballot",
    "appearances",
    "sources",
  ];
  var sections = sectionIds
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);

  var linkByHash = {};
  navLinks.forEach(function (a) {
    var href = a.getAttribute("href");
    if (href && href.charAt(0) === "#") linkByHash[href.slice(1)] = a;
  });

  function clearCurrent() {
    Object.keys(linkByHash).forEach(function (id) {
      linkByHash[id].removeAttribute("aria-current");
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          clearCurrent();
          var link = linkByHash[entry.target.id];
          if (link) link.setAttribute("aria-current", "true");
        });
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) {
      io.observe(s);
    });
  }

  /* Charter ballot demo */
  var form = document.getElementById("charter-ballot");
  var result = document.getElementById("ballot-result");

  var labels = {
    aye: "Aye — measured expansion under charter safety review",
    nay: "Nay — retain capacity; prefer hyperloop redistribution",
    abstain: "Abstain — presence recorded without preference",
  };

  if (form && result) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var selected = form.querySelector('input[name="vote"]:checked');
      result.hidden = false;

      if (!selected) {
        result.classList.add("is-error");
        result.textContent =
          "No selection recorded. Choose Aye, Nay, or Abstain before casting your demo ballot.";
        result.focus();
        return;
      }

      result.classList.remove("is-error");
      var stamp = new Date().toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
      result.textContent =
        "Demo receipt sealed · " +
        labels[selected.value] +
        " · " +
        stamp +
        ". (Local only — nothing was transmitted.)";
      result.focus();
    });

    form.addEventListener("reset", function () {
      window.setTimeout(function () {
        result.hidden = true;
        result.textContent = "";
        result.classList.remove("is-error");
      }, 0);
    });
  }

  /* Year stamp in footer if present */
  var yearEl = document.getElementById("footer-year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
