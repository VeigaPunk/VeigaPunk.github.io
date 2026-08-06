/* Plazir-15 Fan Codex — nav + charter ballot demo (client-only) */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var navToggle = document.getElementById("nav-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  var netBanner = document.getElementById("net-banner");

  function setScrolled() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }

  setScrolled();
  window.addEventListener("scroll", setScrolled, { passive: true });

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open menu");
      });
    });

    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileNav.classList.contains("is-open")) {
        mobileNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open menu");
      }
    });
  }

  function updateNet() {
    if (!netBanner) return;
    netBanner.hidden = navigator.onLine;
  }
  updateNet();
  window.addEventListener("online", updateNet);
  window.addEventListener("offline", updateNet);

  var QUESTIONS = [
    {
      prompt:
        "Should Landing Field Three expand visitor hospitality capacity for the next festival cycle?",
      aye: "Authorize measured expansion under charter safety review",
      nay: "Retain current capacity; prefer hyperloop redistribution",
    },
    {
      prompt:
        "Should the Ugnaught-maintained droid labor pool be expanded to free more citizen time for arts and civic life?",
      aye: "Grow the pool carefully — abundance as charter infrastructure",
      nay: "Hold scale; prioritize droid rehabilitation and stability first",
    },
  ];

  var form = document.getElementById("charter-ballot");
  if (form) {
    var qIndex = 0;
    var castCount = 0;
    var labelEl = document.getElementById("ballot-q-label");
    var promptEl = document.getElementById("ballot-prompt");
    var ayeDesc = document.getElementById("ballot-aye-desc");
    var nayDesc = document.getElementById("ballot-nay-desc");
    var resultEl = document.getElementById("ballot-result");
    var nextBtn = document.getElementById("ballot-next");

    function renderQuestion() {
      var q = QUESTIONS[qIndex];
      if (labelEl) labelEl.textContent = "Sample civic question " + (qIndex + 1) + " of " + QUESTIONS.length;
      if (promptEl) promptEl.textContent = q.prompt;
      if (ayeDesc) ayeDesc.textContent = q.aye;
      if (nayDesc) nayDesc.textContent = q.nay;
      form.querySelectorAll('input[name="vote"]').forEach(function (el) {
        el.checked = false;
      });
      if (resultEl) {
        resultEl.hidden = true;
        resultEl.textContent = "";
      }
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        qIndex = (qIndex + 1) % QUESTIONS.length;
        renderQuestion();
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var selected = form.querySelector('input[name="vote"]:checked');
      if (!selected) {
        if (resultEl) {
          resultEl.hidden = false;
          resultEl.textContent = "Select Aye, Nay, or Abstain before casting.";
        }
        return;
      }
      var labels = { aye: "Aye", nay: "Nay", abstain: "Abstain" };
      castCount += 1;
      if (resultEl) {
        resultEl.hidden = false;
        resultEl.textContent =
          "Demo ballot recorded: " +
          labels[selected.value] +
          ". Stored only in this browser — not a real election. Session demo ballots: " +
          castCount +
          ".";
      }
    });

    form.addEventListener("reset", function (e) {
      e.preventDefault();
      form.querySelectorAll('input[name="vote"]').forEach(function (el) {
        el.checked = false;
      });
      if (resultEl) {
        resultEl.hidden = true;
        resultEl.textContent = "";
      }
    });
  }

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("./sw.js").catch(function () {});
    });
  }
})();
