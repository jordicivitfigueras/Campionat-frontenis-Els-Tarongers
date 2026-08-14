(function(){
  const form=document.getElementById('registrationForm');
  if(!form||!window.SupaSync)return;

  const panel=document.createElement('div');
  panel.className='form-panel';
  panel.style.marginTop='18px';
  panel.innerHTML=`
    <div class="eyebrow">Ja estàs inscrit?</div>
    <h2 style="margin-top:6px">Actualitza el pagament</h2>
    <p style="color:#617068;max-width:760px">Si la teva parella ja surt a la llista i acabes de fer el Bizum, no tornis a inscriure't. Selecciona la parella i marca el pagament com a enviat.</p>
    <div class="field">
      <label>Selecciona la teva parella</label>
      <select id="existingPaymentPair"><option value="">Carregant parelles…</option></select>
    </div>
    <div class="field" style="margin-top:12px">
      <label>Nom utilitzat al Bizum</label>
      <input id="existingBizumName" autocomplete="name" placeholder="Nom que apareix al Bizum">
    </div>
    <div class="actions">
      <button id="existingPaymentBtn" class="btn btn-accent" type="button">He fet el Bizum</button>
    </div>
    <div id="existingPaymentMsg"></div>`;
  form.parentNode.insertBefore(panel,form);

  const pairSelect=document.getElementById('existingPaymentPair');
  const bizumName=document.getElementById('existingBizumName');
  const button=document.getElementById('existingPaymentBtn');
  const msg=document.getElementById('existingPaymentMsg');
  let rows=[];

  const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

  async function loadPairs(){
    try{
      rows=await SupaSync.req('/rest/v1/rpc/public_registration_summary',{method:'POST',body:{}})||[];
      const available=rows.filter(r=>r.payment_status!=='verified');
      pairSelect.innerHTML='<option value="">Selecciona una parella</option>'+available.map((r,i)=>`<option value="${i}">${esc(r.player1_name)} / ${esc(r.player2_name)}${r.payment_status==='bizum_sent'?' · Bizum ja enviat':''}</option>`).join('');
      if(!available.length) pairSelect.innerHTML='<option value="">No hi ha pagaments pendents</option>';
      pairSelect.dataset.available=JSON.stringify(available);
    }catch(e){
      pairSelect.innerHTML='<option value="">No s’han pogut carregar les parelles</option>';
    }
  }

  button.addEventListener('click',async()=>{
    let available=[];
    try{available=JSON.parse(pairSelect.dataset.available||'[]')}catch{}
    const idx=Number(pairSelect.value);
    const pair=Number.isInteger(idx)?available[idx]:null;
    if(!pair){msg.innerHTML='<div class="production-note">Selecciona la teva parella.</div>';return}
    const bn=bizumName.value.trim();
    if(!bn){msg.innerHTML='<div class="production-note">Indica el nom utilitzat al Bizum.</div>';return}
    button.disabled=true;
    try{
      const result=await SupaSync.req('/rest/v1/rpc/public_mark_registration_bizum_sent',{method:'POST',body:{p_player1:pair.player1_name,p_player2:pair.player2_name,p_bizum_name:bn}});
      if(result?.ok){
        msg.innerHTML=`<div class="success-card"><strong>✓ ${esc(result.message||'Bizum marcat com a enviat.')}</strong><div>L’organització verificarà el pagament.</div></div>`;
        bizumName.value='';
        await loadPairs();
        if(typeof loadRegs==='function') loadRegs();
      }else{
        msg.innerHTML=`<div class="production-note">${esc(result?.message||'No s’ha pogut actualitzar el pagament.')}</div>`;
      }
    }catch(e){
      msg.innerHTML='<div class="production-note">No s’ha pogut actualitzar el pagament. Torna-ho a provar.</div>';
    }finally{button.disabled=false}
  });

  loadPairs();
})();