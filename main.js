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

    var resizeTimer = 0;
    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(syncNavForViewport, 120);
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

  /* Hash navigation: move focus to section for keyboard / AT users */
  function focusHashTarget() {
    var id = (window.location.hash || "").replace(/^#/, "");
    if (!id) return;
    var el = document.getElementById(id);
    if (!el) return;
    if (!el.hasAttribute("tabindex")) {
      el.setAttribute("tabindex", "-1");
    }
    window.setTimeout(function () {
      el.focus({ preventScroll: true });
    }, 0);
  }

  if (window.location.hash) {
    focusHashTarget();
  }
  window.addEventListener("hashchange", focusHashTarget);

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

  /* Charter ballot demo (sessionStorage only — never leaves the browser) */
  var form = document.getElementById("charter-ballot");
  var result = document.getElementById("ballot-result");
  var BALLOT_KEY = "plazir15-charter-ballot-demo";

  var labels = {
    aye: "Aye — measured expansion under charter safety review",
    nay: "Nay — retain capacity; prefer hyperloop redistribution",
    abstain: "Abstain — presence recorded without preference",
  };

  function showReceipt(value, stamp, opts) {
    opts = opts || {};
    result.hidden = false;
    result.classList.remove("is-error");
    result.textContent =
      "Demo receipt sealed · " +
      labels[value] +
      " · " +
      stamp +
      ". (Local only — nothing was transmitted.)";
    if (opts.focus) result.focus();
  }

  if (form && result) {
    try {
      var prior = window.sessionStorage.getItem(BALLOT_KEY);
      if (prior) {
        var parsed = JSON.parse(prior);
        if (parsed && parsed.value && labels[parsed.value]) {
          var radio = form.querySelector(
            'input[name="vote"][value="' + parsed.value + '"]'
          );
          if (radio) radio.checked = true;
          showReceipt(parsed.value, parsed.stamp || "earlier this session", {
            focus: false,
          });
        }
      }
    } catch (err) {
      /* ignore storage errors (private mode, etc.) */
    }

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

      var stamp = new Date().toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
      showReceipt(selected.value, stamp, { focus: true });
      try {
        window.sessionStorage.setItem(
          BALLOT_KEY,
          JSON.stringify({ value: selected.value, stamp: stamp })
        );
      } catch (err2) {
        /* ignore */
      }
    });

    form.addEventListener("reset", function () {
      window.setTimeout(function () {
        result.hidden = true;
        result.textContent = "";
        result.classList.remove("is-error");
        try {
          window.sessionStorage.removeItem(BALLOT_KEY);
        } catch (err3) {
          /* ignore */
        }
      }, 0);
    });
  }

  /* Progressive share: Web Share API or clipboard */
  var shareBtn = document.getElementById("share-site");
  var shareStatus = document.getElementById("share-status");
  if (shareBtn) {
    var canShare =
      typeof navigator.share === "function" ||
      (navigator.clipboard && typeof navigator.clipboard.writeText === "function");
    if (canShare) {
      shareBtn.hidden = false;
      shareBtn.addEventListener("click", function () {
        var payload = {
          title: "Plazir-15 Fan Codex",
          text: "Unofficial fan documentation for Plazir-15 — Outer Rim domed paradise.",
          url: "https://veigapunk.github.io/",
        };
        var done = function (msg) {
          if (!shareStatus) return;
          shareStatus.hidden = false;
          shareStatus.textContent = msg;
        };
        if (typeof navigator.share === "function") {
          navigator.share(payload).then(
            function () {
              done("Shared via system sheet.");
            },
            function () {
              /* user cancel or failure — try clipboard */
              if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(payload.url).then(
                  function () {
                    done("Link copied to clipboard.");
                  },
                  function () {
                    done("Share cancelled.");
                  }
                );
              } else {
                done("Share cancelled.");
              }
            }
          );
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(payload.url).then(
            function () {
              done("Link copied to clipboard.");
            },
            function () {
              done("Could not copy link.");
            }
          );
        }
      });
    }
  }

  /* Year stamp in footer if present */
  var yearEl = document.getElementById("footer-year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* Elevate sticky header after scroll for separation from content */
  var header = document.querySelector(".site-header");
  if (header) {
    var scrollQueued = false;
    var updateHeader = function () {
      scrollQueued = false;
      header.classList.toggle("is-scrolled", window.scrollY > 10);
    };
    var onScroll = function () {
      if (scrollQueued) return;
      scrollQueued = true;
      window.requestAnimationFrame(updateHeader);
    };
    updateHeader();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
})();
