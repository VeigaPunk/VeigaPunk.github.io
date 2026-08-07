(function () {
  const q = document.getElementById("q");
  const items = Array.from(document.querySelectorAll(".tool-item"));
  const countEl = document.getElementById("count");
  const state = { category: "all", pricing: "all", api: false, mcp: false, flagship: false, q: "" };

  function apply() {
    let n = 0;
    for (const el of items) {
      const okCat = state.category === "all" || el.dataset.category === state.category;
      const okPrice = state.pricing === "all" || el.dataset.pricing === state.pricing;
      const okApi = !state.api || el.dataset.api === "true";
      const okMcp = !state.mcp || el.dataset.mcp === "true";
      const okFlag = !state.flagship || el.dataset.flagship === "true";
      const hay = (el.dataset.name || "") + " " + (el.dataset.tagline || "") + " " + (el.dataset.desc || "");
      const okQ = !state.q || hay.includes(state.q);
      const show = okCat && okPrice && okApi && okMcp && okFlag && okQ;
      el.classList.toggle("hidden", !show);
      if (show) n++;
    }
    if (countEl) countEl.textContent = n + " of " + items.length + " tools";
  }

  if (q) {
    q.addEventListener("input", () => {
      state.q = q.value.trim().toLowerCase();
      apply();
    });
  }

  document.querySelectorAll(".chips").forEach((group) => {
    const kind = group.dataset.filter;
    group.querySelectorAll(".chip-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const val = btn.dataset.value;
        if (kind === "caps") {
          state[val] = !state[val];
          btn.classList.toggle("active", state[val]);
        } else {
          group.querySelectorAll(".chip-btn").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          state[kind] = val;
        }
        apply();
      });
    });
  });

  apply();
})();
