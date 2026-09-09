(() => {
  if (location.pathname.replace(/\.html$/, "") !== "/directe") return;
  const box = document.getElementById("liveContent");
  const connection = document.querySelector(".auto-update");
  if (connection) connection.textContent = "Connectat en directe";
  if (!box || !window.SupaSync?.req) return;

  const escapeHtml = (value) =>
    String(value || "—").replace(
      /[&<>"']/g,
      (character) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[
          character
        ],
    );
  const timeOrder = (value) => {
    const days = { "Dijous 10": 1, "Divendres 11": 2, "Dissabte 12": 3 };
    const [day, time = "99:99"] = String(value || "").split(" · ");
    return (days[day] || 9) * 10000 + Number(time.replace(":", ""));
  };
  let requestNumber = 0;
  async function renderIdleState() {
    const currentRequest = ++requestNumber;
    try {
      const [matches, players, pairs] = await Promise.all([
        SupaSync.req(
          "/rest/v1/matches?tournament_id=eq.2026&select=id,stage,status,scheduled_at,team1_id,team2_id,score1,score2,updated_at",
        ),
        SupaSync.req("/rest/v1/players?select=id,full_name"),
        SupaSync.req(
          "/rest/v1/pairs?tournament_id=eq.2026&select=id,player1_id,player2_id",
        ),
      ]);
      if (currentRequest !== requestNumber || matches.some((match) => match.status === "live"))
        return;
      const playerNames = new Map(
        players.map((player) => [player.id, player.full_name]),
      );
      const pairNames = new Map(
        pairs.map((pair) => [
          pair.id,
          [playerNames.get(pair.player1_id), playerNames.get(pair.player2_id)]
            .filter(Boolean)
            .join(" / "),
        ]),
      );
      const next = matches
        .filter((match) => match.status === "pending")
        .sort((a, b) => timeOrder(a.scheduled_at) - timeOrder(b.scheduled_at))[0];
      const last = matches
        .filter((match) => match.status === "final")
        .sort((a, b) =>
          String(b.updated_at || "").localeCompare(String(a.updated_at || "")),
        )[0];
      const card = (label, match, detail) =>
        match
          ? `<div class="idle-match-card"><span>${label}</span><strong>${escapeHtml(match.scheduled_at || `Partit ${match.id}`)}</strong><p>${escapeHtml(pairNames.get(match.team1_id) || "Pendent de classificació")} ${detail} ${escapeHtml(pairNames.get(match.team2_id) || "Pendent de classificació")}</p><small>Partit ${escapeHtml(match.id)} · ${escapeHtml(match.stage || "")}</small></div>`
          : "";
      box.innerHTML = `<div class="live-idle"><div class="idle-status"><span class="idle-dot"></span>ARA MATEIX</div><h1>No hi ha cap partit en joc</h1><p>El marcador s’activarà automàticament quan l’àrbitre iniciï el pròxim partit.</p><div class="idle-match-grid">${card("PRÒXIM PARTIT", next, "contra")}${card("ÚLTIM RESULTAT", last, `${Number(last?.score1 || 0)}–${Number(last?.score2 || 0)}`)}</div></div>`;
    } catch {}
  }
  const style = document.createElement("style");
  style.textContent =
    ".live-idle{width:min(980px,100%);margin:auto;text-align:center}.idle-status{display:inline-flex;align-items:center;gap:8px;padding:7px 10px;border:1px solid rgba(255,255,255,.18);border-radius:999px;background:rgba(0,0,0,.18);color:#ffd08a;font-size:10px;font-weight:950;letter-spacing:.12em}.idle-dot{width:8px;height:8px;border-radius:50%;background:#6de8ae}.live-idle h1{margin:18px 0 8px;font-size:clamp(34px,6vw,72px);line-height:.95}.live-idle>p{margin:0 auto 24px;max-width:620px;color:rgba(255,255,255,.72)}.idle-match-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;text-align:left}.idle-match-card{padding:20px;border:1px solid rgba(255,255,255,.17);border-radius:18px;background:rgba(1,27,20,.42)}.idle-match-card span{color:#ffd08a;font-size:10px;font-weight:950;letter-spacing:.1em}.idle-match-card strong{display:block;margin-top:8px;font-size:21px}.idle-match-card p{margin:7px 0;color:#fff;font-weight:850}.idle-match-card small{color:rgba(255,255,255,.62)}@media(max-width:680px){.idle-match-grid{grid-template-columns:1fr}.live-idle h1{font-size:38px}}";
  document.head.appendChild(style);
  window.addEventListener("supabase:ready", () => setTimeout(renderIdleState, 300));
  window.addEventListener("supabase:change", () => setTimeout(renderIdleState, 300));
  setTimeout(renderIdleState, 900);
})();
