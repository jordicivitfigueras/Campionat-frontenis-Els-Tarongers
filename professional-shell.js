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
  // The live scoreboard is a dedicated, full-viewport experience. It keeps
  // the public navigation out of the way so the score remains readable on a
  // television, projector or mobile screen.
  if (path === "/directe") {
    document.documentElement.classList.add("live-page");
    return;
  }
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
  if (path === "/resultats") {
    let scoreEvolutionId = 0;
    const arrangeResultRows = () => {
      document.querySelectorAll(".result-main").forEach((row) => {
        if (row.dataset.versusLayout === "true") return;
        const teams = row.querySelector(".result-teams");
        const score = row.querySelector(".result-score");
        if (!teams || !score) return;
        const names = teams.innerText
          .split(/\n+/)
          .map((name) => name.trim())
          .filter(Boolean);
        const values = score.textContent.trim().match(/^(\d+)\s*[–-]\s*(\d+)$/);
        const cells = [
          ["result-team result-team-left", names[0] || "Per definir"],
          ["result-point", values ? values[1] : "–"],
          ["result-point", values ? values[2] : "–"],
          ["result-team result-team-right", names[1] || "Per definir"],
        ];
        teams.className = "result-match";
        teams.replaceChildren(
          ...cells.map(([className, value]) => {
            const cell = document.createElement("div");
            cell.className = className + (values ? "" : " pending");
            cell.textContent = value;
            return cell;
          }),
        );
        score.remove();
        row.dataset.versusLayout = "true";
      });
    };
    const makeScoreEvolutionCollapsible = () => {
      document.querySelectorAll(".score-evo").forEach((panel) => {
        if (panel.dataset.collapsible === "true" || panel.querySelector(".no-evo"))
          return;
        const title = panel.querySelector(".score-evo-title");
        const grid = panel.querySelector(".score-evo-grid");
        if (!title || !grid) return;
        const button = document.createElement("button");
        const gridId = `score-evolution-${++scoreEvolutionId}`;
        grid.id = gridId;
        grid.hidden = true;
        button.type = "button";
        button.className = "score-evo-toggle";
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-controls", gridId);
        button.innerHTML = `<span>${title.textContent}</span><span class="score-evo-chevron" aria-hidden="true">⌄</span>`;
        button.addEventListener("click", () => {
          const open = button.getAttribute("aria-expanded") !== "true";
          button.setAttribute("aria-expanded", String(open));
          grid.hidden = !open;
        });
        title.replaceWith(button);
        panel.dataset.collapsible = "true";
      });
    };
    const enhanceResults = () => {
      arrangeResultRows();
      makeScoreEvolutionCollapsible();
    };
    enhanceResults();
    new MutationObserver(enhanceResults).observe(
      shell.querySelector(".app-content"),
      { childList: true, subtree: true },
    );
  }
  function decorateMerchandisingLinks() {
    document.querySelectorAll('a[href="/merchandising"]').forEach((link) => {
      if (link.querySelector(".merch-deadline")) return;
      const badge = document.createElement("span");
      badge.className = "merch-deadline";
      badge.textContent = "Fins 25 agost";
      link.appendChild(badge);
    });
  }
  decorateMerchandisingLinks();
  new MutationObserver(decorateMerchandisingLinks).observe(document.body, {
    childList: true,
    subtree: true,
  });
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
    window.SupaSync ? Promise.resolve() : loadScript("/supabase-sync.js?v=flow-sync-20260909");
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
  function setupPossibleMatchPaths() {
    if (path != "/el-meu-torneig") return;
    const result = document.getElementById("result");
    if (!result) return;
    const secondPhaseSources = {
      I: [["S1", "1A"], ["1A", "2B"], ["S1", "2B"]],
      J: [["S2", "1B"], ["1B", "2C"], ["S2", "2C"]],
      K: [["S3", "1C"], ["1C", "2D"], ["S3", "2D"]],
      L: [["S4", "1D"], ["1D", "2E"], ["S4", "2E"]],
      M: [["S5", "1E"], ["1E", "2F"], ["S5", "2F"]],
      N: [["S6", "1F"], ["1F", "2G"], ["S6", "2G"]],
      O: [["S7", "1G"], ["1G", "2H"], ["S7", "2H"]],
      P: [["S8", "1H"], ["1H", "2A"], ["S8", "2A"]],
    };
    const eighthSources = {
      V1: ["1I", "2M"],
      V2: ["1J", "2N"],
      V3: ["1K", "2O"],
      V4: ["1L", "2P"],
      V5: ["1M", "2I"],
      V6: ["1N", "2J"],
      V7: ["1O", "2K"],
      V8: ["1P", "2L"],
    };
    const quarterSources = {
      Q1: ["V1", "V8"],
      Q2: ["V4", "V5"],
      Q3: ["V3", "V6"],
      Q4: ["V2", "V7"],
    };
    const semifinalSources = { S1: ["Q1", "Q2"], S2: ["Q3", "Q4"] };
    const norm = (value) =>
      String(value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
    const sourceLabel = (source) => {
      const seeded = /^S(\d+)$/.exec(source);
      if (seeded) return `Cap de sèrie #${seeded[1]}`;
      const ranked = /^([12])([A-P])$/.exec(source);
      if (ranked)
        return `${ranked[1] === "1" ? "1r" : "2n"} classificat del Grup ${ranked[2]}`;
      return source;
    };
    const timeLabel = (value) => {
      if (!value) return "Horari pendent";
      const text = String(value);
      const time = text.match(/(\d{1,2}:\d{2})/);
      return time ? time[1] : text;
    };
    let dataPromise;
    window.addEventListener("supabase:change", () => {
      dataPromise = undefined;
    });
    const loadPathData = () =>
      (dataPromise ||= Promise.all([
        SupaSync.req("/rest/v1/players?select=id,full_name"),
        SupaSync.req(
          "/rest/v1/pairs?tournament_id=eq.2026&select=id,seed,player1_id,player2_id",
        ),
        SupaSync.req(
          "/rest/v1/matches?tournament_id=eq.2026&select=id,scheduled_at,team1_id,team2_id,team1_source,team2_source,status,score1,score2",
        ),
      ]).then(([players, pairs, matches]) => ({ players, pairs, matches })));
    const branchFor = (group, position) => {
      const offset = group.charCodeAt(0) - 65;
      const targetOffset = position === 1 ? offset : (offset + 7) % 8;
      return String.fromCharCode(73 + targetOffset);
    };
    const pairIdsFromRankedSource = (source, data, trail = new Set()) => {
      const key = `ranked:${source}`;
      if (trail.has(key)) return [];
      const nextTrail = new Set(trail).add(key);
      const seeded = /^S(\d+)$/.exec(source);
      if (seeded) {
        const pair = data.pairs.find((item) => Number(item.seed) === Number(seeded[1]));
        return pair ? [pair.id] : [];
      }
      const ranked = /^([12])([A-P])$/.exec(source);
      if (!ranked) return [];
      const group = ranked[2];
      if (group <= "H") {
        return [
          ...new Set(
            data.matches
              .filter((match) => match.id?.[0] === group && /^[A-H][1-3]$/.test(match.id))
              .flatMap((match) => [match.team1_id, match.team2_id])
              .filter(Boolean),
          ),
        ];
      }
      return [
        ...new Set(
          (secondPhaseSources[group] || [])
            .flat()
            .flatMap((entrant) => pairIdsFromRankedSource(entrant, data, nextTrail)),
        ),
      ];
    };
    const pairIdsFromMatchSource = (matchId, data, trail = new Set()) => {
      const key = `match:${matchId}`;
      if (trail.has(key)) return [];
      const nextTrail = new Set(trail).add(key);
      const match = data.matches.find((item) => item.id === matchId);
      const assigned = [match?.team1_id, match?.team2_id].filter(Boolean);
      if (assigned.length === 2) return [...new Set(assigned)];
      if (eighthSources[matchId])
        return [
          ...new Set(
            eighthSources[matchId].flatMap((source) =>
              pairIdsFromRankedSource(source, data, nextTrail),
            ),
          ),
        ];
      const sources = quarterSources[matchId] || semifinalSources[matchId] || [];
      return [
        ...new Set(
          sources.flatMap((source) => pairIdsFromMatchSource(source, data, nextTrail)),
        ),
      ];
    };
    const possibleRivalNames = (sources, sourceType, data, currentPairId) => {
      const playerNames = new Map(
        data.players.map((player) => [player.id, player.full_name]),
      );
      const ids = sources.flatMap((source) =>
        sourceType === "match"
          ? pairIdsFromMatchSource(source, data)
          : pairIdsFromRankedSource(source, data),
      );
      return [...new Set(ids)]
        .filter((id) => id !== currentPairId)
        .map((id) => data.pairs.find((pair) => pair.id === id))
        .filter(Boolean)
        .map((pair) =>
          [playerNames.get(pair.player1_id), playerNames.get(pair.player2_id)]
            .filter(Boolean)
            .join(" / "),
        )
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b, "ca", { sensitivity: "base" }));
    };
    const makeCard = (title, token, group, data, currentPairId) => {
      const sources = secondPhaseSources[group] || [];
      const games = sources.flatMap((entrants, index) => {
        if (!entrants.includes(token)) return [];
        const id = `${group}${index + 1}`;
        const rival = entrants.find((source) => source !== token);
        const match = data.matches.find((item) => item.id === id);
        return [{
          id,
          rival,
          time: timeLabel(match?.scheduled_at),
          names: possibleRivalNames([rival], "ranked", data, currentPairId),
          seeded: /^S\d+$/.test(rival),
        }];
      });
      const card = document.createElement("div");
      card.className = "possible-path-card";
      const heading = document.createElement("strong");
      heading.textContent = title;
      card.append(heading);
      if (/^S\d+$/.test(token)) {
        const note = document.createElement("span");
        note.className = "second-phase-seed-note";
        note.textContent = "Sou el cap de sèrie d’aquest grup";
        card.append(note);
      }
      games
        .sort((a, b) => Number(b.seeded) - Number(a.seeded) || a.id.localeCompare(b.id))
        .forEach((game, index) => {
          const row = document.createElement("div");
          row.className = `second-phase-game ${game.seeded ? "seed-game" : "open-game"}`;
          const label = document.createElement("b");
          label.textContent = game.seeded
            ? "Partit contra el cap de sèrie"
            : games.length > 1
              ? "L’altre partit del grup"
              : "Partit del grup";
          const rival = document.createElement("span");
          const fallback = sourceLabel(game.rival);
          rival.className = game.seeded ? "game-rival" : "classification-origin";
          rival.textContent = game.seeded
            ? `${game.names[0] || fallback} · ${fallback}`
            : `Rival: ${fallback}`;
          const candidates = document.createElement("span");
          candidates.className = "possible-rival-names";
          candidates.textContent = game.names.length
            ? `${game.names.length > 1 ? "Parelles possibles" : "Parella"}: ${game.names.join(" · ")}`
            : "Parella pendent de classificació";
          const schedule = document.createElement("small");
          schedule.textContent = `${game.id} · ${game.time}`;
          row.append(label, rival);
          if (!game.seeded) row.append(candidates);
          row.append(schedule);
          card.append(row);
        });
      return card;
    };
    const makeFirstPhaseCard = (match, currentPairId, data) => {
      const playerNames = new Map(
        data.players.map((player) => [player.id, player.full_name]),
      );
      const rivalId =
        match.team1_id === currentPairId ? match.team2_id : match.team1_id;
      const rivalPair = data.pairs.find((pair) => pair.id === rivalId);
      const rivalName = rivalPair
        ? [
            playerNames.get(rivalPair.player1_id),
            playerNames.get(rivalPair.player2_id),
          ]
            .filter(Boolean)
            .join(" / ")
        : "Rival pendent";
      const ownScore =
        match.team1_id === currentPairId ? Number(match.score1) : Number(match.score2);
      const rivalScore =
        match.team1_id === currentPairId ? Number(match.score2) : Number(match.score1);
      const card = document.createElement("div");
      card.className = `possible-path-card first-phase-card ${match.status === "final" ? "is-final" : match.status === "live" ? "is-live" : ""}`;
      const heading = document.createElement("strong");
      heading.textContent = `Partit ${match.id}`;
      const opponent = document.createElement("span");
      opponent.textContent = `Rival: ${rivalName}`;
      const schedule = document.createElement("small");
      const status =
        match.status === "final"
          ? `Finalitzat · ${ownScore}–${rivalScore}`
          : match.status === "live"
            ? `En joc · ${ownScore}–${rivalScore}`
            : "Pendent";
      schedule.textContent = `${match.scheduled_at || "Horari pendent"} · ${status}`;
      card.append(heading, opponent, schedule);
      return card;
    };
    const findRoute = (sources, token) =>
      Object.entries(sources).find(([, entrants]) => entrants.includes(token));
    const makeRouteCard = (title, detail, matchId, data) => {
      const card = document.createElement("div");
      card.className = "possible-path-card possible-route-card";
      const heading = document.createElement("strong");
      heading.textContent = title;
      const route = document.createElement("span");
      route.textContent = detail;
      card.append(heading, route);
      const schedule = document.createElement("small");
      const match = data.matches.find((item) => item.id === matchId);
      schedule.textContent = `${matchId} · ${timeLabel(match?.scheduled_at)}`;
      card.append(schedule);
      return card;
    };
    const appendRound = (section, label, cards) => {
      if (!cards.length) return;
      const round = document.createElement("div");
      round.className = "possible-round";
      const title = document.createElement("h4");
      title.textContent = label;
      const grid = document.createElement("div");
      grid.className = "possible-path-grid";
      cards.forEach((card) => grid.append(card));
      round.append(title, grid);
      section.append(round);
    };
    async function decoratePossiblePaths() {
      const identity = result.querySelector(".identity");
      const playerName = identity?.querySelector(".identity-top h2")?.textContent?.trim();
      const nextMatch = identity?.querySelector(".next-match");
      if (!identity || !playerName || !nextMatch || identity.dataset.pathsLoading)
        return;
      if (identity.dataset.pathsPlayer === norm(playerName)) return;
      identity.dataset.pathsLoading = "true";
      try {
        const data = await loadPathData();
        const player = data.players.find(
          (item) => norm(item.full_name) === norm(playerName),
        );
        const pair = player
          ? data.pairs.find(
              (item) =>
                item.player1_id === player.id || item.player2_id === player.id,
            )
          : null;
        if (!pair) return;
        const firstGroupMatches = data.matches.filter(
          (match) =>
            /^[A-H][1-3]$/.test(match.id) &&
            (match.team1_id === pair.id || match.team2_id === pair.id),
        );
        const losses = firstGroupMatches.filter((match) => {
          if (match.status !== "final") return false;
          const ownScore =
            match.team1_id === pair.id ? Number(match.score1) : Number(match.score2);
          const rivalScore =
            match.team1_id === pair.id ? Number(match.score2) : Number(match.score1);
          return ownScore < rivalScore;
        }).length;
        const wins = firstGroupMatches.filter((match) => {
          if (match.status !== "final") return false;
          const ownScore =
            match.team1_id === pair.id ? Number(match.score1) : Number(match.score2);
          const rivalScore =
            match.team1_id === pair.id ? Number(match.score2) : Number(match.score1);
          return ownScore > rivalScore;
        }).length;
        const firstGroup = firstGroupMatches[0]?.id?.[0];
        const allGroupMatches = firstGroup
          ? data.matches.filter((match) => new RegExp(`^${firstGroup}[1-3]$`).test(match.id))
          : [];
        let finalGroupPosition = null;
        if (
          allGroupMatches.length === 3 &&
          allGroupMatches.every(
            (match) =>
              match.status === "final" &&
              match.team1_id &&
              match.team2_id &&
              Number(match.score1) !== Number(match.score2),
          )
        ) {
          const standings = new Map();
          const row = (id) => {
            if (!standings.has(id)) standings.set(id, { id, wins: 0, pf: 0, pa: 0 });
            return standings.get(id);
          };
          allGroupMatches.forEach((match) => {
            const a = row(match.team1_id), b = row(match.team2_id);
            a.pf += Number(match.score1); a.pa += Number(match.score2);
            b.pf += Number(match.score2); b.pa += Number(match.score1);
            if (Number(match.score1) > Number(match.score2)) a.wins += 1;
            else b.wins += 1;
          });
          finalGroupPosition =
            [...standings.values()]
              .sort(
                (a, b) =>
                  b.wins - a.wins ||
                  b.pf - b.pa - (a.pf - a.pa) ||
                  b.pf - a.pf,
              )
              .findIndex((item) => item.id === pair.id) + 1;
        }
        const decidedPosition = wins >= 2 ? 1 : finalGroupPosition;
        if (losses >= 2 || decidedPosition === 3) {
          const section = document.createElement("section");
          section.className = "possible-paths eliminated-path";
          section.innerHTML =
            '<div class="eyebrow">Estat de competició</div><h3>Parella eliminada</h3><p>Amb dues derrotes, la parella queda automàticament fora de les dues primeres posicions del grup.</p>';
          nextMatch.innerHTML =
            '<div class="stage">Fase de grups finalitzada</div><div class="when">Parella eliminada</div><div class="meta">Gràcies per participar en el Campionat 2026.</div>';
          nextMatch.insertAdjacentElement("afterend", section);
          identity.dataset.pathsPlayer = norm(playerName);
          return;
        }
        const section = document.createElement("section");
        section.className = "possible-paths";
        const eyebrow = document.createElement("div");
        eyebrow.className = "eyebrow";
        eyebrow.textContent = "Camí de competició";
        const heading = document.createElement("h3");
        heading.textContent = "Partits i següents encreuaments";
        const groupRoutes = [];
        const secondPhaseCards = [];
        const firstPhaseCards = firstGroupMatches
          .slice()
          .sort((a, b) => String(a.scheduled_at || "").localeCompare(String(b.scheduled_at || "")))
          .map((match) => makeFirstPhaseCard(match, pair.id, data));
        const seed = Number(pair.seed);
        if (seed >= 1 && seed <= 8) {
          const group = String.fromCharCode(73 + seed - 1);
          groupRoutes.push({ group, token: `S${seed}` });
          secondPhaseCards.push(
            makeCard(`Cap de sèrie · Grup ${group}`, `S${seed}`, group, data, pair.id),
          );
        } else {
          const group = firstGroup;
          if (!group) return;
          const firstTarget = branchFor(group, 1);
          const secondTarget = branchFor(group, 2);
          if (decidedPosition === 1) {
            groupRoutes.push({ group: firstTarget, token: `1${group}` });
            secondPhaseCards.push(
              makeCard(`1rs del Grup ${group} · Grup ${firstTarget}`, `1${group}`, firstTarget, data, pair.id),
            );
          } else if (decidedPosition === 2) {
            groupRoutes.push({ group: secondTarget, token: `2${group}` });
            secondPhaseCards.push(
              makeCard(`2ns del Grup ${group} · Grup ${secondTarget}`, `2${group}`, secondTarget, data, pair.id),
            );
          } else {
            groupRoutes.push(
              { group: firstTarget, token: `1${group}` },
              { group: secondTarget, token: `2${group}` },
            );
            secondPhaseCards.push(
              makeCard(`Si quedeu 1rs · Grup ${firstTarget}`, `1${group}`, firstTarget, data, pair.id),
              makeCard(`Si quedeu 2ns · Grup ${secondTarget}`, `2${group}`, secondTarget, data, pair.id),
            );
          }
        }
        section.append(eyebrow, heading);
        appendRound(section, "1a fase · Els teus partits", firstPhaseCards);
        appendRound(section, "2a fase · Possibles grups", secondPhaseCards);

        const eighthCards = [];
        const eighthIds = new Set();
        groupRoutes.forEach(({ group }) => {
          [1, 2].forEach((position) => {
            const token = `${position}${group}`;
            const entry = findRoute(eighthSources, token);
            if (!entry) return;
            const [matchId, entrants] = entry;
            eighthIds.add(matchId);
            const rival = entrants.find((source) => source !== token);
            eighthCards.push(
              makeRouteCard(
                `Si quedeu ${position === 1 ? "1rs" : "2ns"} del grup ${group}`,
                `Vuitens contra ${sourceLabel(rival)}`,
                matchId,
                data,
                pair.id,
                [rival],
                "ranked",
              ),
            );
          });
        });
        appendRound(section, "Vuitens de final", eighthCards);

        const quarterPaths = new Map();
        const quarterCards = [];
        eighthIds.forEach((eighthId) => {
          const entry = findRoute(quarterSources, eighthId);
          if (!entry) return;
          const [matchId] = entry;
          if (!quarterPaths.has(matchId)) quarterPaths.set(matchId, []);
          quarterPaths.get(matchId).push(eighthId);
        });
        quarterPaths.forEach((possibleEighths, matchId) => {
          const entrants = quarterSources[matchId];
          const rival = entrants.find((source) => !possibleEighths.includes(source));
          const origins = possibleEighths.join(" o ");
          quarterCards.push(
            makeRouteCard(
              `Si guanyeu ${origins}`,
              rival
                ? `Quarts contra el guanyador de ${rival}`
                : "Els dos camins possibles coincideixen en aquests quarts",
              matchId,
              data,
              pair.id,
              rival ? [rival] : entrants,
              "match",
            ),
          );
        });
        appendRound(section, "Quarts de final", quarterCards);

        const semifinalPaths = new Map();
        const semifinalCards = [];
        quarterPaths.forEach((unused, quarterId) => {
          const entry = findRoute(semifinalSources, quarterId);
          if (!entry) return;
          const [matchId] = entry;
          if (!semifinalPaths.has(matchId)) semifinalPaths.set(matchId, []);
          semifinalPaths.get(matchId).push(quarterId);
        });
        semifinalPaths.forEach((possibleQuarters, matchId) => {
          const entrants = semifinalSources[matchId];
          const rival = entrants.find((source) => !possibleQuarters.includes(source));
          const origins = possibleQuarters.join(" o ");
          semifinalCards.push(
            makeRouteCard(
              `Si guanyeu ${origins}`,
              rival
                ? `Semifinal contra el guanyador de ${rival}`
                : "Els dos camins possibles coincideixen en aquesta semifinal",
              matchId,
              data,
              pair.id,
              rival ? [rival] : entrants,
              "match",
            ),
          );
        });
        appendRound(section, "Semifinals", semifinalCards);

        const finalCards = [];
        semifinalPaths.forEach((unused, semifinalId) => {
          const rival = semifinalId === "S1" ? "S2" : "S1";
          finalCards.push(
            makeRouteCard(
              `Si guanyeu ${semifinalId}`,
              `Final contra el guanyador de ${rival}`,
              "FINAL",
              data,
              pair.id,
              [rival],
              "match",
            ),
            makeRouteCard(
              `Si perdeu ${semifinalId}`,
              `3r i 4t lloc contra el perdedor de ${rival}`,
              "3/4",
              data,
              pair.id,
              [rival],
              "match",
            ),
          );
        });
        appendRound(section, "Final o 3r i 4t lloc", finalCards);
        nextMatch.insertAdjacentElement("afterend", section);
        identity.dataset.pathsPlayer = norm(playerName);
      } catch (error) {
        console.warn("Possible match paths", error);
      } finally {
        delete identity.dataset.pathsLoading;
      }
    }
    const style = document.createElement("style");
    style.textContent = `.possible-paths{margin-top:18px;padding-top:17px;border-top:1px solid #e2eae5}.possible-paths h3{margin:4px 0 13px!important}.possible-round{margin-top:14px}.possible-round h4{margin:0 0 8px;color:#073e2d;font-size:13px;font-weight:950;text-transform:uppercase;letter-spacing:.08em}.possible-path-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.possible-path-card{display:flex;flex-direction:column;gap:9px;padding:14px;border:1px solid #dce7e1;border-radius:15px;background:#f8fbf9}.first-phase-card{border-color:#cfe0d7;background:#fff}.first-phase-card.is-live{border-color:#e7a823;background:#fffaf0}.first-phase-card.is-final{background:#edf7f2;border-color:#badac9}.possible-route-card{position:relative;padding-left:19px}.possible-route-card:before{content:"";position:absolute;left:8px;top:17px;width:4px;height:calc(100% - 34px);min-height:28px;border-radius:4px;background:#e7a823}.possible-path-card>strong{color:#073e2d;font-size:15px}.possible-path-card span{color:#52665c;font-size:12px;line-height:1.45}.possible-path-card small{color:#8a650f;font-size:11px;font-weight:900}.second-phase-seed-note{padding:7px 9px;border-radius:9px;background:#fff1cf;color:#795500!important;font-weight:900}.second-phase-game{display:grid;grid-template-columns:1fr auto;gap:6px 10px;padding:10px 11px;border:1px solid #dfe8e3;border-radius:11px;background:#fff}.second-phase-game.seed-game{border-color:#e8c878;background:#fffaf0}.second-phase-game b{grid-column:1/-1;color:#183f31;font-size:12px}.second-phase-game .game-rival{grid-column:1;min-width:0}.second-phase-game .classification-origin{grid-column:1;padding:7px 9px;border-radius:9px;background:#e7f5ed;color:#07543a!important;font-size:13px;font-weight:950}.second-phase-game .possible-rival-names{grid-column:1/-1;color:#52665c;font-size:12px}.second-phase-game small{grid-column:2;grid-row:2;white-space:nowrap;align-self:start}.eliminated-path{padding:16px;border:1px solid #edc4bd;border-radius:15px;background:#fff5f3}.eliminated-path h3{color:#8b2e22!important}.eliminated-path p{margin:0;color:#76534e;font-size:13px;line-height:1.5}@media(max-width:720px){.possible-path-grid{grid-template-columns:1fr}.second-phase-game{grid-template-columns:1fr}.second-phase-game .game-rival,.second-phase-game .classification-origin,.second-phase-game .possible-rival-names,.second-phase-game small{grid-column:1;grid-row:auto}}`;
    document.head.appendChild(style);
    new MutationObserver(() => setTimeout(decoratePossiblePaths, 0)).observe(
      result,
      { childList: true, subtree: true },
    );
    setTimeout(decoratePossiblePaths, 650);
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
      setupPossibleMatchPaths();
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
