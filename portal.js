
const PORTAL_KEY="torneig2026_portal_data";
function portalLoad(){
  try{
    return JSON.parse(localStorage.getItem(PORTAL_KEY)) || {
      lunches:{
        "Divendres · Fideus a la cassola":[],
        "Dissabte · Paella":[]
      },
      merchOrders:[],
      tournamentRegistrations:[],
      notices:[
        {title:"Benvinguts al Torneig 2026",text:"Consulta aquí qualsevol canvi important d'horari, pista o organització.",date:""},
      ],
      mvpVotes:{},
      memberDemo:true,
      dropboxUrl:"",
      payments:[]
    };
  }catch(e){return {lunches:{},merchOrders:[],tournamentRegistrations:[],notices:[],mvpVotes:{},memberDemo:true,dropboxUrl:"",payments:[]}}
}
function portalSave(s){localStorage.setItem(PORTAL_KEY,JSON.stringify(s));}
function esc(x){return String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
function fakePay(kind,amount,ref){
  const s=portalLoad();
  s.payments.push({kind,amount,ref,date:new Date().toISOString(),status:"pagat"});
  portalSave(s);
  alert("Pagament simulat correctament. En producció això es connectaria amb Stripe.");
}
window.Portal={load:portalLoad,save:portalSave,esc,fakePay};
