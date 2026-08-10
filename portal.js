const PORTAL_KEY="torneig2026_portal_data";
function portalLoad(){
  try{
    const current=JSON.parse(localStorage.getItem(PORTAL_KEY));
    return current || {
      lunches:{"Divendres · Fideus a la cassola":[],"Dissabte · Paella":[]},
      merchOrders:[],tournamentRegistrations:[],
      notices:[{title:"Benvinguts al Torneig 2026",text:"Consulta aquí qualsevol canvi important d'horari, pista o organització.",date:""}],
      mvpVotes:{},memberDemo:true,dropboxUrl:"",payments:[]
    };
  }catch(e){return {lunches:{},merchOrders:[],tournamentRegistrations:[],notices:[],mvpVotes:{},memberDemo:true,dropboxUrl:"",payments:[]}}
}
function portalSave(s){localStorage.setItem(PORTAL_KEY,JSON.stringify(s));}
function esc(x){return String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
function registerBizum(kind,amount,ref,bizumName){const s=portalLoad();s.payments=s.payments||[];s.payments.push({kind,amount,ref,bizumName:bizumName||ref,date:new Date().toISOString(),status:"bizum_enviat"});portalSave(s);}
function fakePay(kind,amount,ref){registerBizum(kind,amount,ref,ref);alert("Sol·licitud registrada. L'organització verificarà el Bizum abans de marcar-la com a pagada.");}
window.Portal={load:portalLoad,save:portalSave,esc,fakePay,registerBizum};
