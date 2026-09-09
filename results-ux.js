(() => {
  if (location.pathname.replace(/\.html$/, "") !== "/resultats") return;
  const filters = document.getElementById("filters");
  const results = document.getElementById("results");
  if (!filters || !results || typeof window.render !== "function") return;

  let groupFilter = "all";
  const select = document.createElement("select");
  select.className = "results-group-filter";
  select.setAttribute("aria-label", "Filtrar per grup o fase");
  select.innerHTML =
    '<option value="all">Tots els grups i fases</option>' +
    "ABCDEFGHIJKLMNOP"
      .split("")
      .map((group) => `<option value="${group}">Grup ${group}</option>`)
      .join("") +
    '<option value="knockout">Eliminatòries</option>';
  filters.appendChild(select);

  const style = document.createElement("style");
  style.textContent =
    ".results-group-filter{min-height:38px;border:1px solid var(--border);border-radius:999px;background:#fff;padding:7px 34px 7px 13px;color:#173d30;font-weight:850}.results-empty-filter{padding:18px;border:1px solid var(--border);border-radius:15px;background:#fff;color:#718078}";
  document.head.appendChild(style);

  const baseRender = window.render;
  const applyGroupFilter = () => {
    let visible = 0;
    results.querySelector(".results-empty-filter")?.remove();
    results.querySelectorAll(".result-row").forEach((row) => {
      const id = row.querySelector(".result-id")?.textContent?.trim() || "";
      const code = id.split(/\s|·/)[0];
      const isGroup = /^[A-P][1-3]$/.test(code);
      const show =
        groupFilter === "all" ||
        (groupFilter === "knockout" && !isGroup) ||
        code.startsWith(groupFilter);
      row.hidden = !show;
      if (show) visible += 1;
    });
    if (!visible && results.querySelector(".result-row")) {
      const empty = document.createElement("div");
      empty.className = "results-empty-filter";
      empty.textContent = "No hi ha partits que coincideixin amb aquest grup o fase.";
      results.appendChild(empty);
    } else if (!results.querySelector(".result-row") && filter === "latest") {
      results.innerHTML =
        '<div class="results-empty-filter"><strong>Encara no hi ha cap partit finalitzat.</strong><br>Quan acabi el primer partit, el resultat apareixerà aquí immediatament.<br><button class="btn btn-secondary" id="showPendingResults" type="button" style="margin-top:12px">Veure partits pendents</button></div>';
      document.getElementById("showPendingResults")?.addEventListener("click", () =>
        filters.querySelector('[data-f="pending"]')?.click(),
      );
    }
  };
  window.render = () => {
    baseRender();
    applyGroupFilter();
  };
  window.addEventListener("supabase:ready", () => setTimeout(window.render, 0));
  window.addEventListener("supabase:change", () => setTimeout(window.render, 0));
  select.addEventListener("change", () => {
    groupFilter = select.value;
    window.render();
  });
  applyGroupFilter();
})();
