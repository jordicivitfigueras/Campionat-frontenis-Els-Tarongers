const DEFAULT_PAIRS = [["Mauro Lenhardi","Roger Juanola"],["Marc Muntané","Alex Sanchez"],["Julia Serrano","Juan Sobreroca"],["Xavi Palou fill","Marius Alcala"],["Adri Salaverría","María Salaverría"],["Arnau Costa","Otger Costa"],["Jordi Civit","Laura Soler"],["Marc Balcells","Manel Villegas"],["Sergi Ripollés","Ferran Cabezas"],["Alvaro Palou","Pepe Palou"],["Pol Gaynes","Gerard Civit"],["Guillem Tost","Joan Valette"],["Pol Mitjavila","Martí Coma"],["Lluís Aymami","Diego Salvo"],["Carlota Domínguez","Joel Socias"],["Dardo Soler","Edu Soler"],["Toni Civit","Jordi Balcells Senior"],["Blanca Josep","Sara Vidal"],["Claudia Balcells","Jemi Recasens"],["Lluís Cabezas","Xavi Palou Pare"],["Roger Casafont","Laia Casafont"],["Nacho Palou","Jorge Palou"],["Albert Civit",""],["Albert Cabezas","Ramon Romero"],["Alexandra Biosca","Elena Altes"],["Ian Dameson","Eloi de la Torre"],["Edu Llop","David Llop"],["Claudia Mitjavila","Guille Soler"],["Alex Herrera","Daniel Capdevila"],["Plaça lliure 30",""],["Plaça lliure 31",""],["Plaça lliure 32",""]];

const DEFAULT_TIMES={
"1":"Dijous 10 · 17:00","2":"Dijous 10 · 17:20","3":"Dijous 10 · 17:40","4":"Dijous 10 · 18:00","5":"Dijous 10 · 18:20","6":"Dijous 10 · 18:40","7":"Dijous 10 · 19:00","8":"Dijous 10 · 19:20","9":"Dijous 10 · 19:40","10":"Dijous 10 · 20:00","11":"Dijous 10 · 20:20","12":"Dijous 10 · 20:40","13":"Dijous 10 · 21:00","14":"Divendres 11 · 09:40","15":"Divendres 11 · 10:00","16":"Divendres 11 · 10:20",
"A":"Divendres 11 · 10:40","B":"Divendres 11 · 11:00","C":"Divendres 11 · 11:20","D":"Divendres 11 · 11:40","E":"Divendres 11 · 12:00","F":"Divendres 11 · 12:20","G":"Divendres 11 · 12:40","H":"Divendres 11 · 13:00","I":"Divendres 11 · 13:20","J":"Divendres 11 · 13:40","K":"Divendres 11 · 14:00","L":"Divendres 11 · 17:00","M":"Divendres 11 · 17:20","N":"Divendres 11 · 17:40","O":"Divendres 11 · 18:00","P":"Divendres 11 · 18:20",
"R1":"Divendres 11 · 18:40","R2":"Divendres 11 · 19:00","R3":"Divendres 11 · 19:20","R4":"Divendres 11 · 19:40","R5":"Divendres 11 · 20:00","R6":"Divendres 11 · 20:20","R7":"Divendres 11 · 20:40","R8":"Divendres 11 · 21:00",
"O1":"Dissabte 12 · 09:30","O2":"Dissabte 12 · 10:00","O3":"Dissabte 12 · 10:30","O4":"Dissabte 12 · 11:00","O5":"Dissabte 12 · 11:30","O6":"Dissabte 12 · 12:00","O7":"Dissabte 12 · 12:30","O8":"Dissabte 12 · 13:00",
"Q1":"Dissabte 12 · 16:30","Q2":"Dissabte 12 · 17:00","Q3":"Dissabte 12 · 17:30","Q4":"Dissabte 12 · 18:00","S1":"Dissabte 12 · 19:00","S2":"Dissabte 12 · 19:30","3/4":"Dissabte 12 · 20:30","FINAL":"Dissabte 12 · 21:00"};

const STORAGE_KEY="torneig2026_state_v4";
const BC=typeof BroadcastChannel!=="undefined"?new BroadcastChannel("torneig2026"):null;
const INITIAL_IDS=Array.from({length:16},(_,i)=>String(i+1));
const WIN_IDS="ABCDEFGH".split("");
const LOSE_IDS="IJKLMNOP".split("");
const REP_IDS=Array.from({length:8},(_,i)=>"R"+(i+1));
const O_IDS=Array.from({length:8},(_,i)=>"O"+(i+1));
const Q_IDS=["Q1","Q2","Q3","Q4"];
const S_IDS=["S1","S2"];
const FINAL_ID="FINAL";
const F_IDS=["3/4",FINAL_ID];

function pairName(p){if(!p)return"—";if(Array.isArray(p))return p.filter(Boolean).join(" / ")||"—";return p}
function stageOf(id){if(WIN_IDS.includes(id))return"2a fase · guanyadors";if(LOSE_IDS.includes(id))return"2a fase · perdedors";if(REP_IDS.includes(id))return"Repesca";if(O_IDS.includes(id))return"1/8";if(Q_IDS.includes(id))return"1/4";if(S_IDS.includes(id))return"1/2";if(id===FINAL_ID)return"Final";if(id==="3/4")return"3r i 4t";return"1a fase"}
function freshState(){const matches={};INITIAL_IDS.forEach((id,i)=>matches[id]={id,stage:"1a fase",team1:DEFAULT_PAIRS[i*2],team2:DEFAULT_PAIRS[i*2+1],s1:0,s2:0,status:"pendent",time:DEFAULT_TIMES[id]||"",court:"Pista 1"});[...WIN_IDS,...LOSE_IDS,...REP_IDS,...O_IDS,...Q_IDS,...S_IDS,...F_IDS].forEach(id=>matches[id]={id,stage:stageOf(id),team1:null,team2:null,s1:0,s2:0,status:"pendent",time:DEFAULT_TIMES[id]||"",court:"Pista 1"});return{pairs:DEFAULT_PAIRS,matches,activeMatch:"1",updatedAt:new Date().toISOString()}}
function loadState(){try{const s=JSON.parse(localStorage.getItem(STORAGE_KEY))||freshState();Object.keys(DEFAULT_TIMES).forEach(id=>{if(s.matches[id]){if(!s.matches[id].time)s.matches[id].time=DEFAULT_TIMES[id];if(!s.matches[id].court)s.matches[id].court="Pista 1"}});return s}catch(e){return freshState()}}
function saveState(s){s.updatedAt=new Date().toISOString();localStorage.setItem(STORAGE_KEY,JSON.stringify(s));if(BC)BC.postMessage({type:"state"})}
function winner(m){if(!m||m.status!=="final")return null;return m.s1>m.s2?m.team1:m.team2}
function loser(m){if(!m||m.status!=="final")return null;return m.s1>m.s2?m.team2:m.team1}
function setPair(m,slot,p){if(m)m[slot]=p||null}
function propagate(s){const m=s.matches;WIN_IDS.forEach((id,i)=>{setPair(m[id],"team1",winner(m[String(i*2+1)]));setPair(m[id],"team2",winner(m[String(i*2+2)]))});LOSE_IDS.forEach((id,i)=>{setPair(m[id],"team1",loser(m[String(i*2+1)]));setPair(m[id],"team2",loser(m[String(i*2+2)]))});const rep=[["A","M"],["B","N"],["C","O"],["D","P"],["E","I"],["F","J"],["G","K"],["H","L"]];REP_IDS.forEach((id,i)=>{setPair(m[id],"team1",loser(m[rep[i][0]]));setPair(m[id],"team2",winner(m[rep[i][1]]))});const o=[["A","R8"],["B","R7"],["C","R6"],["D","R5"],["E","R4"],["F","R3"],["G","R2"],["H","R1"]];O_IDS.forEach((id,i)=>{setPair(m[id],"team1",winner(m[o[i][0]]));setPair(m[id],"team2",winner(m[o[i][1]]))});[["O1","O2"],["O3","O4"],["O5","O6"],["O7","O8"]].forEach((x,i)=>{setPair(m[Q_IDS[i]],"team1",winner(m[x[0]]));setPair(m[Q_IDS[i]],"team2",winner(m[x[1]]))});[["Q1","Q2"],["Q3","Q4"]].forEach((x,i)=>{setPair(m[S_IDS[i]],"team1",winner(m[x[0]]));setPair(m[S_IDS[i]],"team2",winner(m[x[1]]))});setPair(m[FINAL_ID],"team1",winner(m.S1));setPair(m[FINAL_ID],"team2",winner(m.S2));setPair(m["3/4"],"team1",loser(m.S1));setPair(m["3/4"],"team2",loser(m.S2))}
function finalizeMatch(s,id){const m=s.matches[id];if(!m)return false;if(!m.team1||!m.team2){alert("Les dues parelles han d'estar definides.");return false}if(m.s1===m.s2){alert("El partit no pot acabar empatat.");return false}m.status="final";propagate(s);saveState(s);return true}
function score(s,id,side,delta){const m=s.matches[id];if(!m||m.status==="final")return;const key=side===1?"s1":"s2";m[key]=Math.max(0,(m[key]||0)+delta);m.status="en joc";saveState(s)}
function allIds(){return[...INITIAL_IDS,...WIN_IDS,...LOSE_IDS,...REP_IDS,...O_IDS,...Q_IDS,...S_IDS,...F_IDS]}
function nextPending(s,current){const ids=allIds(),i=Math.max(0,ids.indexOf(current));for(let k=i+1;k<ids.length;k++)if(s.matches[ids[k]].status!=="final"&&s.matches[ids[k]].team1&&s.matches[ids[k]].team2)return ids[k];return ids.find(id=>s.matches[id].status!=="final"&&s.matches[id].team1&&s.matches[id].team2)||current}
function escapeHtml(x){return String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
window.Torneig={loadState,saveState,freshState,propagate,finalizeMatch,score,pairName,allIds,nextPending,escapeHtml,stageOf,winner,loser,DEFAULT_TIMES,STORAGE_KEY,BC,FINAL_ID};
