(function(){
  const hero=document.querySelector('.public-hero>div');if(!hero||localStorage.getItem('frontenis_my_name_2026'))return;
  const actions=hero.querySelector('.actions');if(!actions)return;
  actions.insertAdjacentHTML('beforebegin','<div class="home-player"><label for="homePlayer">Troba directament el teu torneig</label><div><input id="homePlayer" list="homePlayerList" placeholder="Escriu el teu nom…" autocomplete="off"><datalist id="homePlayerList"></datalist><button id="homePlayerGo" class="btn btn-accent" type="button">Veure els meus partits</button></div><small>Només l’hauràs de seleccionar una vegada.</small></div>');
  const input=document.getElementById('homePlayer'),list=document.getElementById('homePlayerList'),go=document.getElementById('homePlayerGo');
  go.onclick=()=>{const n=input.value.trim();if(n.length<2){input.focus();return}MyIdentity.set(n);location.href='/el-meu-torneig'};
  input.onkeydown=e=>{if(e.key==='Enter')go.click()};
  const load=async()=>{try{const rows=await SupaSync.req('/rest/v1/players?select=full_name');list.innerHTML=rows.map(x=>`<option value="${String(x.full_name||'').replace(/"/g,'&quot;')}">`).join('')}catch{}};
  window.addEventListener('supabase:ready',load);setTimeout(load,500);
})();
