(function(){
  const baseRender=window.renderPlayer;
  if(typeof baseRender!=='function')return;
  const days={'Dijous 10':1,'Divendres 11':2,'Dissabte 12':3};
  const qMap={V1:'Q1',V3:'Q1',V2:'Q2',V4:'Q2',V5:'Q3',V7:'Q3',V6:'Q4',V8:'Q4'};
  const safe=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const stamp=m=>{const p=String(m?.scheduled_at||'').split(' · '),hm=(p[1]||'99:99').split(':');return(days[p[0]]||9)*10000+(+hm[0]||99)*60+(+hm[1]||0)};
  const pairIn=(m,id)=>m&&(m.team1_id===id||m.team2_id===id);
  const other=(m,id,names)=>names.get(m.team1_id===id?m.team2_id:m.team1_id)||'Per definir';
  function firstGroup(seed){if(seed>=9&&seed<=16)return seed-9;if(seed>=17&&seed<=32)return Math.floor((seed-17)/2);return null}
  function topSeedMatches(seed){if(seed<1||seed>8)return[];const g=String.fromCharCode(72+seed);return[g+'1',g+'3']}
  function possibleSecondPhase(seed){const g=firstGroup(seed);if(g===null)return[];const first=String.fromCharCode(73+g),second=String.fromCharCode(73+(g+7)%8);return[first+'1',first+'2',second+'2',second+'3']}
  function possibleRows(pair,d,confirmed,next){
    const byId=new Map(d.matches.map(m=>[m.id,m])),ids=new Set(),second=confirmed.filter(m=>/^[I-P][1-3]$/.test(m.id)),vuitens=confirmed.filter(m=>/^V\d$/.test(m.id)),quarts=confirmed.filter(m=>/^Q\d$/.test(m.id)),semis=confirmed.filter(m=>/^S\d$/.test(m.id));
    confirmed.filter(m=>m!==next).forEach(m=>ids.add(m.id));
    if(!second.length)possibleSecondPhase(pair.seed).forEach(id=>ids.add(id));
    [...new Set(second.map(m=>m.id[0]))].forEach(g=>{const n=g.charCodeAt(0)-73;ids.add('V'+(n+1));ids.add('V'+(((n+4)%8)+1))});
    vuitens.forEach(m=>ids.add(qMap[m.id]));
    if(quarts.length){ids.add('S1');ids.add('S2')}
    if(semis.length){ids.add('3/4');ids.add('FINAL')}
    return[...ids].map(id=>byId.get(id)).filter(m=>m&&m.status!=='final'&&m!==next).sort((a,b)=>stamp(a)-stamp(b)).slice(0,8)
  }
  function card(m,pair,names){const assigned=pairIn(m,pair.id),confirmed=assigned||topSeedMatches(pair.seed).includes(m.id),rival=assigned?other(m,pair.id,names):confirmed?'Per definir':'Depèn de la classificació';return`<div style="border:1px solid #dfe8e3;border-radius:14px;padding:13px;background:#f8faf9"><div style="display:flex;justify-content:space-between;gap:10px"><strong>${m.id==='FINAL'?'Final':'Partit '+safe(m.id)}</strong><span class="badge ${confirmed?'green':''}">${confirmed?'Confirmat':'Possible'}</span></div><div class="meta" style="margin-top:5px">${safe(m.stage||'')} · ${safe(m.scheduled_at||'Horari pendent')}</div><div style="font-weight:850;color:#173d30;margin-top:5px">Rival: ${safe(rival)}</div></div>`}
  window.renderPlayer=function(player,d){
    const box=document.createElement('div');box.innerHTML=baseRender(player,d);
    const names=new Map(d.players.map(p=>[p.id,p.full_name])),pair=d.pairs.find(p=>p.player1_id===player.id||p.player2_id===player.id);
    if(!pair)return box.innerHTML;
    const tier=pair.seed<=8?`Cap de sèrie #${pair.seed} · Accés directe a la 2a fase`:pair.seed<=16?`Cap de sèrie #${pair.seed} · Cap de grup de la 1a fase`:`Parella #${pair.seed} · Primera fase de grups`;
    const identityTop=box.querySelector('.identity-top');if(identityTop){const seedInfo=document.createElement('div');seedInfo.style.cssText='margin-top:14px;background:#edf7f2;border:1px solid #c6e4d4;border-radius:14px;padding:12px 14px;font-weight:950;color:#0b6b49';seedInfo.textContent=tier;identityTop.insertAdjacentElement('afterend',seedInfo)}
    const fixedTop=new Set(topSeedMatches(pair.seed)),confirmed=d.matches.filter(m=>m.status!=='final'&&(pairIn(m,pair.id)||fixedTop.has(m.id))).sort((a,b)=>stamp(a)-stamp(b)),next=confirmed[0],nextBox=box.querySelector('.next-match');
    if(nextBox&&next)nextBox.innerHTML=`<div class="stage">${safe(next.stage||next.id)} · ${safe(next.id)}</div><div class="when">${safe(next.scheduled_at||'Horari pendent')}</div><div style="font-weight:950;color:#173d30;margin-top:7px">Rival: ${safe(pairIn(next,pair.id)?other(next,pair.id,names):'Per definir')}</div><div class="meta" style="margin-top:5px">Pista 1</div>`;
    const possible=possibleRows(pair,d,confirmed,next),mainPanel=box.querySelector('.main-grid .panel');
    if(mainPanel){const section=document.createElement('div');section.style.marginTop='18px';section.innerHTML=`<div class="eyebrow">Camí del torneig</div><h3>Possibles partits següents</h3><div style="display:grid;gap:9px">${possible.length?possible.map(m=>card(m,pair,names)).join(''):'<div class="empty">Encara no hi ha cap altre partit possible per mostrar.</div>'}</div><div class="meta" style="margin-top:9px">S’actualitzen automàticament quan es resolen els grups i les eliminatòries.</div>`;const hospitality=mainPanel.querySelector('[style*="margin-top:16px"]');mainPanel.insertBefore(section,hospitality||null)}
    return box.innerHTML
  }
})();
