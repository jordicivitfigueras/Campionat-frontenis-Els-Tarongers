(() => {
  const __nativeFetch = window.fetch.bind(window);
  window.fetch = (input, init = {}) => {
    try {
      const u = typeof input === "string" ? input : input?.url || "";
      const m = String(init.method || "GET").toUpperCase();
      if (
        m === "POST" &&
        /\/rest\/v1\/(tournament_registrations|lunch_reservations|merch_orders)(\?|$)/.test(
          u,
        )
      ) {
        const h = new Headers(init.headers || {});
        h.set("Prefer", "return=minimal");
        init = { ...init, headers: h };
      }
    } catch {}
    return __nativeFetch(input, init);
  };
  const path = location.pathname.replace(/\.html$/, "") || "/";
  const IDKEY = "frontenis_my_name_2026";
  if (path === "/" && localStorage.getItem(IDKEY)) {
    location.replace("/el-meu-torneig");
    return;
  }
  window.MyIdentity = {
    get: () => localStorage.getItem(IDKEY) || "",
    set: (n) => {
      n = String(n || "").trim();
      if (n) {
        localStorage.setItem(IDKEY, n);
        window.dispatchEvent(
          new CustomEvent("identity:changed", { detail: { name: n } }),
        );
      }
    },
    clear: () => {
      localStorage.removeItem(IDKEY);
      window.dispatchEvent(
        new CustomEvent("identity:changed", { detail: { name: "" } }),
      );
    },
  };
  ["brand-logo.css", "ux2.css", "mobile-nav.css"].forEach((f) => {
    if (!document.querySelector(`link[href*="${f}"]`)) {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = `/${f}?v=workflow1`;
      document.head.appendChild(l);
    }
  });
  const publicGroups = [
      {
        label: "Participa",
        items: [
          ["/inscripcio", "✓", "Inscripció"],
          ["/socis", "♡", "Socis"],
          ["/dinars", "🥘", "Àpats"],
          ["/merchandising", "👕", "Merchandising"],
        ],
      },
      {
        label: "Torneig",
        items: [
          ["/", "⌂", "Inici"],
          ["/el-meu-torneig", "⌕", "El meu torneig"],
          ["/directe", "●", "En directe"],
          ["/horaris", "◷", "Horaris"],
          ["/resultats", "▣", "Resultats"],
          ["/quadre", "⌘", "Quadre"],
        ],
      },
      {
        label: "Comunitat",
        items: [
          ["/mvp", "★", "MVP"],
          ["/historic", "♛", "Històric"],
          ["/fotos", "▧", "Fotos"],
        ],
      },
      {
        label: "Més",
        items: [
          ["/informacio", "ⓘ", "Informació"],
          ["/avisos", "◌", "Avisos"],
          ["/organitzacio", "◆", "Organització"],
          ["/patrocinadors", "♡", "Patrocinadors"],
          ["/agora", "☕", "Àgora"],
        ],
      },
    ],
    adminGroups = [
      {
        label: "Operació ràpida",
        items: [
          ["/admin/marcador", "●", "Marcador"],
          ["/admin/barra", "▥", "Barra ràpida"],
        ],
      },
      {
        label: "Competició",
        items: [
          ["/admin", "⌂", "Centre de control"],
          ["/admin/horaris", "◷", "Horaris"],
          ["/admin/parelles", "◉", "Parelles"],
        ],
      },
      {
        label: "Gestió",
        items: [
          ["/admin/pagaments", "€", "Pagaments"],
          ["/admin/socis", "#", "Socis"],
          ["/admin/dinars", "🥘", "Dinars"],
          ["/admin/merchandising", "👕", "Merchandising"],
          ["/admin/mvp", "★", "MVP"],
        ],
      },
      {
        label: "Sistema",
        items: [
          ["/admin/salut", "✓", "Salut"],
          ["/admin/exportacions", "⇩", "Exportacions"],
          ["/admin/configuracio", "⚙", "Configuració"],
        ],
      },
    ];
  const isAdmin = path.startsWith("/admin") && path != "/admin/login",
    groups = isAdmin ? adminGroups : publicGroups,
    pageMap = {
      "/": "Inici",
      "/el-meu-torneig": "El meu torneig",
      "/dinars": "Àpats",
      "/merchandising": "Merchandising",
      "/inscripcio": "Inscripció",
      "/socis": "Socis",
      "/horaris": "Horaris",
      "/directe": "En directe",
      "/resultats": "Resultats",
      "/quadre": "Quadre",
      "/admin": "Centre de control",
      "/admin/dinars": "Gestió de dinars",
    },
    currentTitle = pageMap[path] || "Campionat";
  const navIcon = (href) => {
    const type = href.includes("horaris")
      ? "clock"
      : href.includes("pagament") || href.includes("socis")
        ? "user"
        : href.includes("dinars") ||
            href.includes("sopar") ||
            href.includes("agora")
          ? "food"
          : href.includes("configuracio") || href === "/admin"
            ? "settings"
            : href.includes("resultats") ||
                href.includes("quadre") ||
                href.includes("historic")
              ? "grid"
              : "circle";
    const paths = {
      clock: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
      user: '<circle cx="12" cy="8" r="3"/><path d="M6.5 19c.7-3.2 2.5-5 5.5-5s4.8 1.8 5.5 5"/>',
      food: '<path d="M7 4v7M4.5 4v4.5A2.5 2.5 0 0 0 7 11v9M17 4v16M17 4c-3 2-3 7 0 9"/>',
      settings:
        '<circle cx="12" cy="12" r="3"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/>',
      grid: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>',
      circle: '<circle cx="12" cy="12" r="8"/><path d="m9 12 2 2 4-4"/>',
    };
    return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[type]}</svg>`;
  };
  const menu = groups
    .map(
      (g) =>
        `<div class="nav-section">${g.label}</div>${g.items.map(([href, , label]) => `<a href="${href}" class="${path === href ? "is-active" : ""}"><span class="nav-icon">${navIcon(href)}</span><span>${label}</span></a>`).join("")}`,
    )
    .join("");
  const shell = document.createElement("div");
  shell.className = "app-shell";
  shell.innerHTML = `<aside class="app-sidebar"><a class="app-logo" href="/"><img src="/logo-frontenis-blanco.png?v=launch"><strong>Campionat Frontenis<br>Els Tarongers <em>Edició 2026</em></strong></a><nav class="app-menu">${!isAdmin ? '<div id="identityBox"></div>' : ""}${menu}<div class="sep"></div>${isAdmin ? `<a href="/"><span class="nav-icon">${navIcon("/")}</span><span>Web pública</span></a>` : `<a href="/admin"><span class="nav-icon">${navIcon("/admin")}</span><span>Organització</span></a>`}</nav></aside><div class="mobile-menu-overlay" id="mobileMenuOverlay"></div><div class="app-main"><header class="app-head"><button class="mobile-back-btn" id="mobileBackBtn" type="button" aria-label="Tornar enrere">‹</button><button class="mobile-menu-btn" id="mobileMenuBtn" type="button" aria-label="Obrir menú" aria-expanded="false">☰</button><strong>${currentTitle}</strong><span class="app-head-badge">${isAdmin ? "ADMIN" : "Edició 2026"}</span></header><div class="app-content"></div></div>`;
  const old = [...document.body.children];
  document.body.innerHTML = "";
  document.body.appendChild(shell);
  old.forEach((n) => shell.querySelector(".app-content").appendChild(n));
  const mobileBtn = document.getElementById("mobileMenuBtn"),
    mobileBack = document.getElementById("mobileBackBtn"),
    mobileOverlay = document.getElementById("mobileMenuOverlay");
  const closeMobileMenu = () => {
    document.body.classList.remove("nav-open");
    mobileBtn?.setAttribute("aria-expanded", "false");
  };
  mobileBtn?.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    mobileBtn.setAttribute("aria-expanded", String(open));
  });
  mobileBack?.addEventListener("click", () => {
    if (history.length > 1) history.back();
    else location.href = MyIdentity.get() ? "/el-meu-torneig" : "/";
  });
  mobileOverlay?.addEventListener("click", closeMobileMenu);
  shell
    .querySelectorAll(".app-sidebar a")
    .forEach((a) => a.addEventListener("click", closeMobileMenu));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMobileMenu();
  });
  function identityUI() {
    const box = document.getElementById("identityBox");
    if (!box) return;
    const n = MyIdentity.get();
    box.innerHTML = n
      ? `<div style="margin:6px 4px 12px;padding:11px;border-radius:12px;background:rgba(255,255,255,.09);color:#fff"><div style="font-size:9px;opacity:.7;text-transform:uppercase;font-weight:900">El meu perfil</div><strong style="display:block;margin-top:3px;font-size:12px">👤 ${n}</strong><button id="changeIdentity" style="border:0;background:none;color:#bfe4d3;padding:5px 0 0;font-size:10px;cursor:pointer">Canviar persona</button></div>`
      : "";
    document.getElementById("changeIdentity")?.addEventListener("click", () => {
      MyIdentity.clear();
      location.href = "/el-meu-torneig";
    });
  }
  identityUI();
  window.addEventListener("identity:changed", identityUI);
  const loadScript = (src) =>
    new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = res;
      s.onerror = rej;
      document.head.appendChild(s);
    });
  const loadSync = () =>
    window.SupaSync ? Promise.resolve() : loadScript("/supabase-sync.js?v=id4");
  async function setupMyTournamentPicker() {
    if (path != "/el-meu-torneig") return;
    const input = document.getElementById("q"),
      btn = document.getElementById("searchBtn");
    if (!input || !btn) return;
    input.dataset.dbNamePicker = "off";
    const style = document.createElement("style");
    style.textContent = `.my-name-wrap{position:relative;min-width:0}.my-name-results{position:absolute;left:0;right:0;top:calc(100% + 8px);z-index:9999;background:#fff;border:1px solid #d9e4de;border-radius:18px;box-shadow:0 24px 60px rgba(4,44,31,.25);padding:8px;max-height:360px;overflow:auto;display:none}.my-name-results.open{display:block}.my-name-option{width:100%;display:flex;align-items:center;justify-content:space-between;gap:12px;border:0;background:#fff;color:#123b2d;border-radius:12px;padding:13px 14px;text-align:left;cursor:pointer}.my-name-option:hover,.my-name-option:focus{background:#eef7f2;outline:none}.my-name-option strong{font-size:15px}.my-name-option span{font-size:11px;color:#718078}.my-name-empty{padding:16px;color:#718078;font-size:13px}@media(max-width:720px){.my-name-results{position:fixed;left:12px;right:12px;top:auto;bottom:14px;max-height:55vh;border-radius:20px}.my-name-option{padding:15px 14px}.my-name-option strong{font-size:16px}}`;
    document.head.appendChild(style);
    const parent = input.parentElement;
    const wrap = document.createElement("div");
    wrap.className = "my-name-wrap";
    parent.insertBefore(wrap, input);
    wrap.appendChild(input);
    const results = document.createElement("div");
    results.className = "my-name-results";
    wrap.appendChild(results);
    const players =
      (await SupaSync.req("/rest/v1/players?select=full_name").catch(
        () => [],
      )) || [];
    const names = [
      ...new Set(
        players.map((x) => String(x.full_name || "").trim()).filter(Boolean),
      ),
    ].sort((a, b) => a.localeCompare(b, "ca", { sensitivity: "base" }));
    const norm = (s) =>
      String(s || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
    function draw() {
      const q = norm(input.value);
      const list = (q ? names.filter((n) => norm(n).includes(q)) : names).slice(
        0,
        12,
      );
      results.innerHTML = list.length
        ? list
            .map(
              (n) =>
                `<button type="button" class="my-name-option" data-name="${n.replace(/"/g, "&quot;")}"><strong>👤 ${n}</strong><span>Seleccionar</span></button>`,
            )
            .join("")
        : '<div class="my-name-empty">No hem trobat cap jugador. Prova amb una altra part del nom.</div>';
      results.classList.add("open");
      results.querySelectorAll("[data-name]").forEach(
        (o) =>
          (o.onclick = () => {
            const n = o.dataset.name;
            input.value = n;
            results.classList.remove("open");
            MyIdentity.set(n);
            btn.click();
          }),
      );
    }
    input.addEventListener("focus", draw);
    input.addEventListener("input", draw);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Escape") results.classList.remove("open");
      if (e.key === "Enter") {
        const first = results.querySelector("[data-name]");
        if (first && results.classList.contains("open")) {
          e.preventDefault();
          first.click();
        }
      }
    });
    document.addEventListener("pointerdown", (e) => {
      if (!wrap.contains(e.target)) results.classList.remove("open");
    });
    const saved = MyIdentity.get();
    if (saved) {
      input.value = saved;
      setTimeout(() => btn.click(), 250);
    }
  }
  function setupWorkflowActions() {
    if (path != "/el-meu-torneig") return;
    const style = document.createElement("style");
    style.textContent = `.workflow-action{display:inline-flex;align-items:center;justify-content:center;gap:7px;margin-top:11px;padding:9px 12px;border-radius:11px;text-decoration:none!important;font-size:11px;font-weight:900;background:#0b6b49;color:#fff!important;border:1px solid #0b6b49}.workflow-action.secondary{background:#fff;color:#0b6b49!important;border-color:#b9d8ca}.workflow-action.warn{background:#fff8e8;color:#775000!important;border-color:#e7cb85}.workflow-next{margin-top:16px;background:#f7faf8;border:1px solid #dce8e1;border-radius:18px;padding:16px}.workflow-next h3{margin:3px 0 10px;color:#073e2d;font-size:17px}.workflow-next-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.workflow-next-grid a{margin-top:0}.reservation-row .workflow-action{margin-top:0;white-space:nowrap}@media(max-width:720px){.workflow-next-grid{grid-template-columns:1fr}.reservation-row{align-items:flex-start;flex-wrap:wrap}.reservation-row .workflow-action{width:100%;margin-top:6px}}`;
    document.head.appendChild(style);
    const result = document.getElementById("result");
    if (!result) return;
    function decorate() {
      if (!result.querySelector(".identity")) return;
      result.querySelectorAll(".metric").forEach((card) => {
        if (card.querySelector(".workflow-action")) return;
        const label = card.querySelector(".label")?.textContent?.trim() || "",
          value = (
            card.querySelector(".value")?.textContent || ""
          ).toLowerCase();
        if (label === "Inscripció") {
          const pending =
            value.includes("pendent") || value.includes("no consta");
          card.insertAdjacentHTML(
            "beforeend",
            `<a class="workflow-action ${pending ? "warn" : "secondary"}" href="/inscripcio">${pending ? "Completar pagament / inscripció" : "Veure inscripció"} →</a>`,
          );
        } else if (label.includes("Dinars")) {
          card.insertAdjacentHTML(
            "beforeend",
            '<a class="workflow-action secondary" href="/dinars">Gestionar dinars →</a>',
          );
        }
      });
      result.querySelectorAll(".reservation-row").forEach((row) => {
        if (row.querySelector(".workflow-action")) return;
        const title = (
            row.querySelector("strong")?.textContent || ""
          ).toLowerCase(),
          isDinner = title.includes("sopar");
        row.insertAdjacentHTML(
          "beforeend",
          '<a class="workflow-action secondary" href="/dinars">Gestionar →</a>',
        );
      });
      const identity = result.querySelector(".identity");
      if (identity && !identity.querySelector(".workflow-next")) {
        const mealText = [
            ...result.querySelectorAll(".reservation-row strong"),
          ].map((x) => x.textContent.toLowerCase()),
          hasLunch = mealText.some((x) => !x.includes("sopar")),
          hasDinner = mealText.some((x) => x.includes("sopar"));
        identity.insertAdjacentHTML(
          "beforeend",
          `<div class="workflow-next"><div class="eyebrow">Següents passos</div><h3>Continua el teu workflow</h3><div class="workflow-next-grid"><a class="workflow-action secondary" href="/dinars">🥘 ${hasLunch || hasDinner ? "Revisar àpats" : "Reservar àpats"}</a><a class="workflow-action secondary" href="/merchandising">👕 Merchandising</a></div></div>`,
        );
      }
    }
    new MutationObserver(() => setTimeout(decorate, 0)).observe(result, {
      childList: true,
      subtree: true,
    });
    setTimeout(decorate, 600);
  }
  loadSync()
    .then(async () => {
      if (isAdmin) {
        if (!SupaSync.session() || !(await SupaSync.isStaff())) {
          location.replace("/admin/login");
          return;
        }
      }
      await SupaSync.init();
      await setupMyTournamentPicker();
      setupWorkflowActions();
      await loadScript("/name-picker.js?v=identity4").catch(() => {});
      const identityFields = new Set([
        "p1",
        "buyer",
        "bizumname",
        "bizum",
        "fullname",
      ]);
      const isIdentityField = (inp) =>
        identityFields.has((inp.id || "").toLowerCase()) ||
        inp.classList.contains("personName") ||
        inp.classList.contains("person");
      function prefill() {
        const saved = MyIdentity.get();
        if (!saved || isAdmin) return;
        let personFilled = false;
        document.querySelectorAll("input").forEach((inp) => {
          if (
            (inp.classList.contains("personName") ||
              inp.classList.contains("person")) &&
            inp.value
          ) {
            personFilled = true;
          }
          if (isIdentityField(inp) && !inp.value) {
            if (
              (inp.classList.contains("personName") ||
                inp.classList.contains("person")) &&
              personFilled
            )
              return;
            inp.value = saved;
            inp.dispatchEvent(new Event("input", { bubbles: true }));
            if (
              inp.classList.contains("personName") ||
              inp.classList.contains("person")
            )
              personFilled = true;
          }
        });
      }
      const remember = (e) => {
        const inp = e.target;
        if (
          !isAdmin &&
          inp instanceof HTMLInputElement &&
          isIdentityField(inp)
        ) {
          const name = inp.value.trim();
          if (name.length >= 2) MyIdentity.set(name);
        }
      };
      document.addEventListener("change", remember, true);
      document.addEventListener("blur", remember, true);
      new MutationObserver(prefill).observe(document.body, {
        childList: true,
        subtree: true,
      });
      setTimeout(prefill, 300);
      document.addEventListener("namepicker:selected", (e) => {
        const n = e.detail?.name;
        if (n) MyIdentity.set(n);
      });
      window.dispatchEvent(new Event("admin:ready"));
    })
    .catch(() => {});
})();
