(()=>{
  const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim();
  const firstTwo=s=>norm(s).split(' ').filter(Boolean).slice(0,2).join(' ');
  const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  let names=[],loaded=false,loading=null;

  function injectStyle(){
    if(document.getElementById('db-name-picker-style'))return;
    const st=document.createElement('style');st.id='db-name-picker-style';st.textContent=`
      .db-name-picker-wrap{position:relative}.db-name-picker-menu{position:absolute;z-index:1000;left:0;right:0;top:calc(100% + 5px);max-height:280px;overflow:auto;-webkit-overflow-scrolling:touch;background:#fff;border:1px solid #d8e4de;border-radius:14px;box-shadow:0 18px 46px rgba(12,45,32,.18);display:none}.db-name-picker-menu.open{display:block}.db-name-picker-option{display:block;width:100%;border:0;border-bottom:1px solid #edf2ef;background:#fff;text-align:left;padding:13px;min-height:48px;cursor:pointer;font:inherit;color:#17332a;touch-action:manipulation}.db-name-picker-option:last-child{border-bottom:0}.db-name-picker-option:hover,.db-name-picker-option.active{background:#eef7f2}.db-name-picker-option strong{display:block;font-size:13px}.db-name-picker-hint{font-size:10px;color:#718078;margin-top:4px}.db-name-picker-invalid{border-color:#c96c55!important;box-shadow:0 0 0 3px rgba(201,108,85,.10)!important}`;
    document.head.appendChild(st);
  }

  async function loadNames(){
    if(loaded)return names;if(loading)return loading;
    loading=(async()=>{
      if(!window.SupaSync?.req)return [];
      const safe=(path,opt)=>SupaSync.req(path,opt).catch(()=>[]);
      const [players,members,regs,meals]=await Promise.all([
        safe('/rest/v1/players?select=full_name'),
        safe('/rest/v1/rpc/public_member_registry',{method:'POST',body:{}}),
        safe('/rest/v1/rpc/public_registration_summary',{method:'POST',body:{}}),
        safe('/rest/v1/rpc/public_lunch_reservations',{method:'POST',body:{}})
      ]);
      let bar=[];try{if(await SupaSync.isStaff())bar=await safe('/rest/v1/bar_tabs?select=full_name')}catch{}
      const playerByKey=new Map();(players||[]).forEach(x=>{if(x.full_name)playerByKey.set(firstTwo(x.full_name),x.full_name.trim())});
      const all=[];
      (players||[]).forEach(x=>x.full_name&&all.push(x.full_name));
      (members||[]).forEach(x=>x.full_name&&all.push(x.full_name));
      (regs||[]).forEach(x=>{x.player1_name&&all.push(x.player1_name);x.player2_name&&all.push(x.player2_name)});
      (meals||[]).forEach(x=>x.full_name&&all.push(x.full_name));
      (bar||[]).forEach(x=>x.full_name&&all.push(x.full_name));
      const uniq=new Map();all.forEach(raw=>{const v=String(raw||'').trim();if(!v)return;const key=firstTwo(v);const canonical=playerByKey.get(key)||v;uniq.set(norm(canonical),canonical)});
      names=[...uniq.values()].sort((a,b)=>a.localeCompare(b,'ca',{sensitivity:'base'}));loaded=true;return names;
    })();
    return loading;
  }

  function descriptor(input){
    const label=input.closest('.field')?.querySelector('label')?.textContent||input.getAttribute('aria-label')||'';
    return norm([input.id,input.placeholder,label].join(' '));
  }
  function shouldAttach(input){
    if(input.dataset.dbNamePicker==='off'||input.disabled||input.readOnly)return false;
    const d=descriptor(input),isSearch=input.type==='search'||/search|buscar/.test(d);
    if(!isSearch)return false;
    if(/producte|talla|partit|fase|horari|hora|pista|missatge|titol|av[ií]s|configuracio/.test(d))return false;
    return /nom|cognom|jugador|parella|soci|persona|assistent/.test(d)||['q','pairSearch','paySearch','barSearch'].includes(input.id);
  }
  function numericAllowed(input){return /numero|número/.test(descriptor(input));}

  function attach(input){
    if(input.dataset.dbNamePickerBound==='1')return;input.dataset.dbNamePickerBound='1';input.autocomplete='off';
    injectStyle();
    const parent=input.parentElement;parent.classList.add('db-name-picker-wrap');
    const menu=document.createElement('div');menu.className='db-name-picker-menu';menu.setAttribute('role','listbox');parent.appendChild(menu);
    let selected='',active=-1,current=[];
    const valid=()=>{const v=input.value.trim();if(!v)return true;if(numericAllowed(input)&&/^\d+$/.test(v))return true;return !!selected&&norm(selected)===norm(v)};
    const markValid=()=>{input.classList.toggle('db-name-picker-invalid',!valid());input.dataset.dbNamePickerValid=valid()?'1':'0'};
    const choose=v=>{if(!v)return;selected=v;input.value=v;input.dataset.dbNamePickerValid='1';input.classList.remove('db-name-picker-invalid');menu.classList.remove('open');input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));input.dispatchEvent(new CustomEvent('namepicker:selected',{bubbles:true,detail:{name:v}}))};
    const render=async()=>{
      const list=await loadNames(),q=norm(input.value);
      current=(q?list.filter(n=>norm(n).includes(q)||firstTwo(n).includes(firstTwo(q))):list).slice(0,25);active=-1;
      menu.innerHTML=current.length?current.map((n,i)=>`<button type="button" class="db-name-picker-option" data-i="${i}"><strong>${esc(n)}</strong><span class="db-name-picker-hint">Selecciona aquest nom</span></button>`).join(''):'<div class="db-name-picker-option"><strong>Cap coincidència</strong><span class="db-name-picker-hint">Escriu una altra part del nom</span></div>';
      menu.classList.add('open');
      menu.querySelectorAll('[data-i]').forEach(b=>{
        const pick=e=>{e.preventDefault();e.stopPropagation();choose(current[Number(b.dataset.i)])};
        b.addEventListener('pointerdown',pick);
        b.addEventListener('click',pick);
      });
    };
    input.addEventListener('focus',render);
    input.addEventListener('input',()=>{if(norm(input.value)!==norm(selected))selected='';input.dataset.dbNamePickerValid='0';render()});
    input.addEventListener('keydown',e=>{
      const opts=[...menu.querySelectorAll('[data-i]')];
      if(e.key==='ArrowDown'&&opts.length){e.preventDefault();active=Math.min(opts.length-1,active+1);opts.forEach((x,i)=>x.classList.toggle('active',i===active));opts[active]?.scrollIntoView({block:'nearest'})}
      else if(e.key==='ArrowUp'&&opts.length){e.preventDefault();active=Math.max(0,active-1);opts.forEach((x,i)=>x.classList.toggle('active',i===active));opts[active]?.scrollIntoView({block:'nearest'})}
      else if(e.key==='Enter'&&menu.classList.contains('open')){if(active>=0&&current[active]){e.preventDefault();choose(current[active])}else if(current.length===1){e.preventDefault();choose(current[0])}else if(!valid()){e.preventDefault();input.classList.add('db-name-picker-invalid')}}
      else if(e.key==='Escape'){menu.classList.remove('open');markValid()}
    });
    input.__dbNamePicker={valid,open:render,menu};
  }

  function scan(){document.querySelectorAll('input').forEach(i=>{if(shouldAttach(i))attach(i)})}
  document.addEventListener('pointerdown',e=>{
    document.querySelectorAll('.db-name-picker-menu.open').forEach(menu=>{
      const wrap=menu.closest('.db-name-picker-wrap');
      if(!wrap?.contains(e.target)){
        menu.classList.remove('open');
        const inp=wrap?.querySelector('input[data-db-name-picker-bound="1"]');
        if(inp)inp.__dbNamePicker?.valid()||inp.classList.add('db-name-picker-invalid');
      }
    });
  },true);
  document.addEventListener('click',e=>{
    const btn=e.target.closest('button');if(!btn)return;const box=btn.parentElement;const inp=box?.querySelector?.('input[data-db-name-picker-bound="1"]');if(inp&&inp.value.trim()&&!inp.__dbNamePicker.valid()){e.preventDefault();e.stopImmediatePropagation();inp.classList.add('db-name-picker-invalid');inp.focus();inp.__dbNamePicker.open()}
  },true);
  window.DBNamePicker={scan,reload:()=>{loaded=false;loading=null;return loadNames()}};
  scan();new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});
})();