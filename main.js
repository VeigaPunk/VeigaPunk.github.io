/**
 * Plazir-15 Fan Codex — light client interactions only.
 * No backend; ballot demo stays in-browser.
 */
(function () {
  "use strict";

  const navToggle = document.getElementById("nav-toggle");
  const siteNav = document.getElementById("site-nav");
  const navLinks = siteNav ? siteNav.querySelectorAll("a[href^='#']") : [];

  function setNavOpen(open) {
    if (!navToggle || !siteNav) return;
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    siteNav.classList.toggle("is-open", open);
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      const open = navToggle.getAttribute("aria-expanded") !== "true";
      setNavOpen(open);
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        setNavOpen(false);
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setNavOpen(false);
    });

    document.addEventListener("click", function (e) {
      if (navToggle.getAttribute("aria-expanded") !== "true") return;
      var t = e.target;
      if (siteNav.contains(t) || navToggle.contains(t)) return;
      setNavOpen(false);
    });
  }

  /* Highlight current section in nav (IntersectionObserver) */
  const sectionIds = [
    "astrography",
    "world",
    "government",
    "history",
    "ballot",
    "appearances",
    "sources",
  ];
  const sections = sectionIds
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);

  const linkByHash = {};
  navLinks.forEach(function (a) {
    const href = a.getAttribute("href");
    if (href && href.charAt(0) === "#") linkByHash[href.slice(1)] = a;
  });

  function clearCurrent() {
    Object.keys(linkByHash).forEach(function (id) {
      linkByHash[id].removeAttribute("aria-current");
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          clearCurrent();
          const link = linkByHash[entry.target.id];
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
  const form = document.getElementById("charter-ballot");
  const result = document.getElementById("ballot-result");

  const labels = {
    aye: "Aye — measured expansion under charter safety review",
    nay: "Nay — retain capacity; prefer hyperloop redistribution",
    abstain: "Abstain — presence recorded without preference",
  };

  if (form && result) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const selected = form.querySelector('input[name="vote"]:checked');
      result.hidden = false;

      if (!selected) {
        result.classList.add("is-error");
        result.textContent =
          "No selection recorded. Choose Aye, Nay, or Abstain before casting your demo ballot.";
        result.focus();
        return;
      }

      result.classList.remove("is-error");
      const stamp = new Date().toLocaleString(undefined, {
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
