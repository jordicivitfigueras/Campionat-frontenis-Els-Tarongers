(function(){
  const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
  function navigation(){
    const titles=[...document.querySelectorAll('.phase-title')];
    const first=titles.find(x=>x.textContent.includes('1a fase')),second=titles.find(x=>x.textContent.includes('2a fase')),knock=titles.find(x=>x.textContent.includes('Quadre eliminatori')),ranking=document.querySelector('.ranking-box');
    if(first)first.id='primera-fase';if(second)second.id='segona-fase';if(knock)knock.id='eliminatories';if(ranking)ranking.id='ranking';
    if(ranking&&!document.querySelector('.draw-nav'))ranking.insertAdjacentHTML('beforebegin','<nav class="draw-nav" aria-label="Seccions del quadre"><a href="#eliminatories">Eliminatòries</a><a href="#primera-fase">Primera fase</a><a href="#segona-fase">Segona fase</a><a href="#ranking">Rànquing</a></nav>');
  }
  let loading=false;
  async function load(){
    if(loading||!window.SupaSync?.req)return;
    loading=true;
    try{
      const [players,pairs,matches]=await Promise.all([SupaSync.req('/rest/v1/players?select=id,full_name'),SupaSync.req('/rest/v1/pairs?tournament_id=eq.2026&select=id,player1_id,player2_id'),SupaSync.req('/rest/v1/matches?tournament_id=eq.2026&select=id,status,team1_id,team2_id,score1,score2')]);
      const pn=new Map(players.map(p=>[p.id,p.full_name])),names=new Map(pairs.map(p=>[p.id,[pn.get(p.player1_id),pn.get(p.player2_id)].filter(Boolean).join(' / ')])),mm=new Map(matches.map(m=>[m.id,m])),mine=norm(localStorage.getItem('frontenis_my_name_2026'));
      const groupState=group=>{
        const games=[1,2,3].map(n=>mm.get(group+n)).filter(Boolean),stats=new Map();
        const row=id=>{if(!id)return null;if(!stats.has(id))stats.set(id,{id,w:0,pf:0,pa:0,played:0});return stats.get(id)};
        games.forEach(game=>{
          row(game.team1_id);row(game.team2_id);
          if(game.status!=='final'||!game.team1_id||!game.team2_id||Number(game.score1)===Number(game.score2))return;
          const a=row(game.team1_id),b=row(game.team2_id);a.played++;b.played++;a.pf+=Number(game.score1||0);a.pa+=Number(game.score2||0);b.pf+=Number(game.score2||0);b.pa+=Number(game.score1||0);if(Number(game.score1)>Number(game.score2))a.w++;else b.w++;
        });
        const rows=[...stats.values()],complete=games.length===3&&games.every(game=>game.status==='final'&&game.team1_id&&game.team2_id&&Number(game.score1)!==Number(game.score2));
        if(complete){const ranking=rows.sort((a,b)=>b.w-a.w||(b.pf-b.pa)-(a.pf-a.pa)||b.pf-a.pf||(names.get(a.id)||'').localeCompare(names.get(b.id)||'','ca'));return{ranking,eliminated:ranking[2]?.id||null,qualified:new Set(ranking.slice(0,2).map(item=>item.id))}}
        const securedFirst=rows.find(item=>item.played===2&&item.w===2);
        const eliminated=rows.find(item=>item.played===2&&item.w===0)?.id||null;
        return{ranking:securedFirst?[securedFirst]:[],eliminated,qualified:new Set(eliminated?rows.filter(item=>item.id!==eliminated).map(item=>item.id):securedFirst?[securedFirst.id]:[])};
      };
      document.querySelectorAll('.group .pair').forEach(slot=>{
        if(!slot.dataset.source){const found=slot.textContent.trim().match(/^([12])[rn]\s+Grup\s+([A-H])$/i);if(found)slot.dataset.source=found[1]+found[2].toUpperCase()}
        const source=slot.dataset.source;if(!source)return;
        const position=Number(source[0]),group=source[1],qualified=groupState(group).ranking[position-1],label=`${position===1?'1r':'2n'} Grup ${group}`;
        if(qualified){slot.innerHTML=`<span class="qualified-source">${label}</span><br>${esc(names.get(qualified.id)||label)}`;slot.classList.add('is-qualified')}
        else{slot.textContent=label;slot.classList.remove('is-qualified')}
      });
      document.querySelectorAll('.group').forEach(groupCard=>{
        const group=(groupCard.querySelector('h3')?.textContent||'').match(/Grup\s+([A-H])$/)?.[1];if(!group)return;
        const state=groupState(group);
        groupCard.querySelectorAll('.pair').forEach(slot=>{
          slot.querySelectorAll('.group-status-tag').forEach(tag=>tag.remove());
          const pairEntry=[...names.entries()].find(([,name])=>norm(slot.textContent).includes(norm(name)));if(!pairEntry)return;
          const [pairId]=pairEntry;if(pairId===state.eliminated)slot.insertAdjacentHTML('beforeend','<span class="group-status-tag eliminated">Eliminats</span>');
          else if(state.qualified.has(pairId))slot.insertAdjacentHTML('beforeend','<span class="group-status-tag qualified">Classificats</span>');
        });
      });
      document.querySelectorAll('.bracket-match').forEach(card=>{const code=(card.querySelector('.bracket-code')?.textContent||'').trim().split(' ')[0],m=mm.get(code);if(!m)return;const teams=card.querySelectorAll('.bracket-team'),a=names.get(m.team1_id),b=names.get(m.team2_id);teams.forEach(team=>{if(!team.dataset.source)team.dataset.source=team.textContent.trim()});if(teams[0])teams[0].innerHTML=a?esc(a)+(m.status==='final'?` <strong>${Number(m.score1||0)}</strong>`:''):esc(teams[0].dataset.source||'Per definir');if(teams[1])teams[1].innerHTML=b?esc(b)+(m.status==='final'?` <strong>${Number(m.score2||0)}</strong>`:''):esc(teams[1].dataset.source||'Per definir');card.classList.remove('is-mine');if(mine&&norm((a||'')+' '+(b||'')).includes(mine))card.classList.add('is-mine')});
      if(mine)document.querySelectorAll('.group .pair').forEach(x=>{if(norm(x.textContent).includes(mine))x.classList.add('ux-highlight')});
    }catch(e){}finally{loading=false}
  }
  const style=document.createElement('style');style.textContent='.pair.is-qualified{color:#123f30}.qualified-source{display:inline-block;margin-bottom:3px;color:#8a650f;font-size:9px;font-weight:950;text-transform:uppercase;letter-spacing:.05em}.group-status-tag{display:block;width:max-content;margin-top:5px;padding:3px 7px;border-radius:999px;font-size:9px;font-weight:950;text-transform:uppercase;letter-spacing:.04em}.group-status-tag.qualified{color:#07603f;background:#e4f5eb}.group-status-tag.eliminated{color:#8b2e22;background:#fde9e6}';document.head.appendChild(style);
  navigation();window.addEventListener('supabase:ready',load);window.addEventListener('supabase:change',load);setTimeout(load,500);setInterval(load,5000);
})();
