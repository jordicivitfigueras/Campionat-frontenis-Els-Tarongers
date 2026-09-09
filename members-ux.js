(() => {
  if (location.pathname.replace(/\.html$/, "") !== "/socis") return;
  const registerHeading = [...document.querySelectorAll(".section-head")].find((section) =>
    section.textContent.includes("Registre de socis"),
  );
  const dashboard = registerHeading?.nextElementSibling;
  const filters = dashboard?.nextElementSibling;
  const table = filters?.nextElementSibling;
  if (dashboard && filters && table && !document.querySelector(".member-register-details")) {
    const details = document.createElement("details");
    details.className = "member-register-details";
    const summary = document.createElement("summary");
    summary.innerHTML =
      '<span><strong>Veure el registre complet</strong><small>Busca un soci o consulta l’historial anual</small></span><b aria-hidden="true">＋</b>';
    dashboard.insertAdjacentElement("afterend", details);
    details.append(summary, filters, table);
  }
  const style = document.createElement("style");
  style.textContent =
    ".bizum-box>strong{display:block;margin-top:3px}.member-register-details{margin-top:14px;border:1px solid var(--border);border-radius:18px;background:#fff;overflow:hidden}.member-register-details>summary{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:17px 19px;cursor:pointer;list-style:none;color:#0b5f43}.member-register-details>summary::-webkit-details-marker{display:none}.member-register-details>summary strong,.member-register-details>summary small{display:block}.member-register-details>summary small{margin-top:3px;color:#6c7a73;font-weight:700}.member-register-details>summary b{font-size:19px}.member-register-details[open]>summary b{font-size:0}.member-register-details[open]>summary b:after{content:'−';font-size:19px}.member-register-details>.form-panel{margin:0 16px 12px}.member-register-details>.historic-table-wrap{margin:0 16px 16px!important}";
  document.head.appendChild(style);
})();
