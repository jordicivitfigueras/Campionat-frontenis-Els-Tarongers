(function(){
  const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
  function navigation(){
    const titles=[...document.querySelectorAll('.phase-title')];
    const first=titles.find(x=>x.textContent.includes('1a fase')),second=titles.find(x=>x.textContent.includes('2a fase')),knock=titles.find(x=>x.textContent.includes('Quadre eliminatori')),ranking=document.querySelector('.ranking-box');
    if(first)first.id='primera-fase';if(second)second.id='segona-fase';if(knock)knock.id='eliminatories';if(ranking)ranking.id='ranking';
    if(ranking&&!document.querySelector('.draw-nav'))ranking.insertAdjacentHTML('beforebegin','<nav class="draw-nav" aria-label="Seccions del quadre"><a href="#eliminatories">Eliminatòries</a><a href="#primera-fase">Primera fase</a><a href="#segona-fase">Segona fase</a><a href="#ranking">Rànquing</a></nav>');
  }
  async function load(){
    if(!window.SupaSync?.req)return;
    try{
      const [players,pairs,matches]=await Promise.all([SupaSync.req('/rest/v1/players?select=id,full_name'),SupaSync.req('/rest/v1/pairs?tournament_id=eq.2026&select=id,player1_id,player2_id'),SupaSync.req('/rest/v1/matches?tournament_id=eq.2026&select=id,status,team1_id,team2_id,score1,score2')]);
      const pn=new Map(players.map(p=>[p.id,p.full_name])),names=new Map(pairs.map(p=>[p.id,[pn.get(p.player1_id),pn.get(p.player2_id)].filter(Boolean).join(' / ')])),mm=new Map(matches.map(m=>[m.id,m])),mine=norm(localStorage.getItem('frontenis_my_name_2026'));
      document.querySelectorAll('.bracket-match').forEach(card=>{const code=(card.querySelector('.bracket-code')?.textContent||'').trim().split(' ')[0],m=mm.get(code);if(!m)return;const teams=card.querySelectorAll('.bracket-team'),a=names.get(m.team1_id),b=names.get(m.team2_id);if(a&&teams[0])teams[0].innerHTML=esc(a)+(m.status==='final'?` <strong>${Number(m.score1||0)}</strong>`:'');if(b&&teams[1])teams[1].innerHTML=esc(b)+(m.status==='final'?` <strong>${Number(m.score2||0)}</strong>`:'');if(mine&&norm((a||'')+' '+(b||'')).includes(mine))card.classList.add('is-mine')});
      if(mine)document.querySelectorAll('.group .pair').forEach(x=>{if(norm(x.textContent).includes(mine))x.classList.add('ux-highlight')});
    }catch(e){}
  }
  navigation();window.addEventListener('supabase:ready',load);window.addEventListener('supabase:change',load);setTimeout(load,500);
})();
