import { useState } from "react";
import aulasRaw       from "./data/aulas.txt?raw";
import comunicadosRaw from "./data/comunicados.txt?raw";
import calendarioRaw  from "./data/calendario.txt?raw";
import { parseAulas, parseComunicados, parseCalendario } from "./parseData";
import { DEFAULT_TASKS, TASKS_VERSION  } from "./tarefas";

const LESSONS       = parseAulas(aulasRaw);
const ANNOUNCEMENTS = parseComunicados(comunicadosRaw);
const CALENDARIO    = parseCalendario(calendarioRaw);

// ── comunicado-derived tasks (computed once at module level) ──────────
const COM_TASKS = (() => {
  const toISO = (d) => {
    const p = d?.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?/);
    if (!p) return null;
    const year = p[3] || new Date().getFullYear().toString();
    return `${year}-${p[2].padStart(2,"0")}-${p[1].padStart(2,"0")}`;
  };
  const extractDue = (content="") => {
    const m = content.match(/(?:prazo|até o dia|até|entrega)[^\d]*(\d{1,2}\/\d{1,2}(?:\/\d{4})?)/i);
    return m ? toISO(m[1]) : null;
  };
  const annDateToISO = (d) => {
    const p = d?.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    return p ? `${p[3]}-${p[2].padStart(2,"0")}-${p[1].padStart(2,"0")}` : null;
  };
  return ANNOUNCEMENTS
    .filter(a => a.category === "tarefa")
    .map((a, i) => ({
      id: `com_${a.id ?? i}`,
      title: a.title,
      desc: a.content?.slice(0, 200) || "",
      due: extractDue(a.content) || annDateToISO(a.date) || new Date().toISOString().split("T")[0],
      priority: "medium",
      category: "tarefa",
      status: "pending",
      fromComunicado: true,
    }));
})();

// ── tokens ──────────────────────────────────────────────────────────
const LIGHT = {
  red:"#c0392b", red2:"#fdf2f0", red3:"#fde8e8",
  navy:"#1a2e4a", navy2:"#f0f4fa", navy3:"#dce8f7",
  amber:"#d97706", amber2:"#fffbeb",
  green:"#16a34a", green2:"#f0fdf4",
  gray:"#f8f7f5", gray2:"#f0ede8", gray3:"#e2ded8",
  text:"#1a1a1a", text2:"#6b6b6b", text3:"#9ca3af",
  white:"#ffffff",
  bg:"#f8f7f5",
  card:"#ffffff",
  border:"#e2ded8",
  topbar:"#1a2e4a",
  topbarText:"#ffffff",
};

const DARK = {
  red:"#e05c4b", red2:"#2d1a18", red3:"#3d2220",
  navy:"#4a90d9", navy2:"#1a2535", navy3:"#1e2e42",
  amber:"#f59e0b", amber2:"#2d2010",
  green:"#34d399", green2:"#0d2e1e",
  gray:"#1a1a2e", gray2:"#252538", gray3:"#313148",
  text:"#f0f0f0", text2:"#a0a0b8", text3:"#606080",
  white:"#1e1e30",
  bg:"#12121e",
  card:"#1e1e30",
  border:"#313148",
  topbar:"#0d0d1a",
  topbarText:"#f0f0f0",
};

// C is set dynamically — components use C which gets replaced per render
let C = LIGHT;

const USERS = [
  { username:"responsavel", password:"mateus2026", name:"Família Larocca" },
  { username:"admin",       password:"escola2026", name:"Coordenação"     },
];

const CAT_META = {
  avaliacao:    { label:"Avaliação",    icon:"📝", color:C.red      },
  tarefa:       { label:"Tarefa",       icon:"📋", color:"#d35400"  },
  apresentacao: { label:"Apresentação", icon:"🎤", color:"#1a7abf"  },
};
const PRI_META = {
  high:   { label:"Alta",  color:C.red,     dot:"🔴" },
  medium: { label:"Média", color:C.amber,   dot:"🟡" },
  low:    { label:"Baixa", color:C.green,   dot:"🟢" },
};
const ANN_CAT = {
  avaliacao:  { label:"Avaliação",  color:C.red,      bg:C.red2,    accent:C.red      },
  tarefa:     { label:"Tarefa",     color:"#b9770e",  bg:"#fef9ee", accent:"#d35400"  },
  aviso:      { label:"Aviso",      color:C.navy,     bg:C.navy2,   accent:C.navy     },
  calendario: { label:"Calendário", color:"#6c3483",  bg:"#f8f4fd", accent:"#7c3aed"  },
  atividade:  { label:"Atividade",  color:C.green,    bg:C.green2,  accent:C.green    },
};
const getStatusStyle = () => ({
  done:    { bg:C.green2,   border:C.green,  badgeBg:C.green,  badge:"✓ Concluído" },
  overdue: { bg:C.red3,     border:C.red,    badgeBg:C.red,    badge:"⚠ Atrasado"  },
  urgent:  { bg:"#2d1e0f",  border:"#e67e22",badgeBg:"#e67e22",badge:"🔥 Urgente"   },
  pending: { bg:C.card,     border:C.border, badgeBg:C.navy,   badge:"● Pendente"  },
});

// ── helpers ──────────────────────────────────────────────────────────
const todayISO = () => new Date().toISOString().split("T")[0];
function cStatus(task) {
  if (task.status === "done") return "done";
  const d = (new Date(task.due) - new Date(todayISO())) / 86400000;
  if (d < 0)  return "overdue";
  if (d <= 2) return "urgent";
  return "pending";
}
function fmtShort(d) { const [,m,day]=d.split("-"); return `${parseInt(day)}/${m}`; }
function fmtLong(d) {
  const ms=["","Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  const [,m,day]=d.split("-"); return `${parseInt(day)} ${ms[parseInt(m)]}`;
}
function dayName(d) { return["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"][new Date(d+"T12:00:00").getDay()]; }
function daysLabel(d) {
  const diff=Math.ceil((new Date(d)-new Date(todayISO()))/86400000);
  if (diff < 0)  return `${Math.abs(diff)}d atrasado`;
  if (diff === 0) return "Hoje!";
  if (diff === 1) return "Amanhã";
  return `${diff} dias`;
}

// ── localStorage ─────────────────────────────────────────────────────
const SK = `mb_tasks_${TASKS_VERSION}`;
function loadTasks() {
  try { const r=localStorage.getItem(SK); if(r) return JSON.parse(r); } catch {}
  return DEFAULT_TASKS.map(t=>({...t}));
}
function saveTasks(t) { try { localStorage.setItem(SK,JSON.stringify(t)); } catch {} }

// ── shared styles ────────────────────────────────────────────────────
const ff = "'DM Sans', system-ui, sans-serif";
// sh and shm are now defined inside App() based on dark mode

// ══════════════════════════════════════════════════════════════════════
//  LOGIN
// ══════════════════════════════════════════════════════════════════════
function Login({ onLogin }) {
  const [u,setU]=useState(""); const [p,setP]=useState("");
  const [show,setShow]=useState(false); const [err,setErr]=useState(""); const [busy,setBusy]=useState(false);
  function submit() {
    if(!u||!p){setErr("Preencha todos os campos.");return;}
    setBusy(true);setErr("");
    setTimeout(()=>{
      const f=USERS.find(x=>x.username===u&&x.password===p);
      if(f) onLogin(f); else {setErr("Usuário ou senha incorretos.");setBusy(false);}
    },600);
  }
  const inp = (extra={}) => ({style:{width:"100%",border:`1.5px solid ${err?C.red:"#ddd"}`,borderRadius:8,padding:"11px 14px",fontSize:14,outline:"none",fontFamily:ff,boxSizing:"border-box",color:C.text,background:"#fafafa",...extra}});
  return (
    <div style={{minHeight:"100vh",background:C.gray,fontFamily:ff,display:"flex",flexDirection:"column"}}>
      <div style={{background:C.white,borderBottom:`4px solid ${C.red}`,padding:"14px 20px",display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:40,height:40,borderRadius:"50%",background:C.red,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🐻</div>
        <div>
          <div style={{fontWeight:800,fontSize:16,color:C.navy}}>Maple Bear Vila Valqueire</div>
          <div style={{fontSize:11,color:C.text3}}>The best of Canadian education for a global future</div>
        </div>
      </div>
      <div style={{background:`linear-gradient(135deg,${C.navy} 0%,#2d4a6e 100%)`,padding:"40px 24px 36px",textAlign:"center",color:C.white,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:-30,top:-30,width:160,height:160,borderRadius:"50%",background:"rgba(192,57,43,.18)",pointerEvents:"none"}}/>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",color:"rgba(255,255,255,.45)",marginBottom:8}}>Big Bears · Year 4</div>
        <div style={{fontSize:28,fontWeight:800,lineHeight:1.1,marginBottom:6,color:C.white}}>Agenda Escolar</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,.6)"}}>Acompanhe as atividades do Mateus</div>
        <div style={{width:36,height:3,background:C.red,margin:"14px auto 0",borderRadius:2}}/>
      </div>
      <div style={{flex:1,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"24px 20px"}}>
        <div style={{width:"100%",maxWidth:400}}>
          <div style={{background:C.white,borderRadius:14,padding:"26px 22px",boxShadow:shm,border:"1px solid #e8e8e8"}}>
            <div style={{fontSize:16,fontWeight:800,color:C.navy,marginBottom:4}}>Bem-vindo de volta 👋</div>
            <div style={{fontSize:13,color:C.text2,marginBottom:20}}>Faça login para acessar a agenda</div>
            <div style={{marginBottom:12}}>
              <label style={{fontSize:11,fontWeight:700,color:C.text2,display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:.8}}>Usuário</label>
              <input value={u} onChange={e=>{setU(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Digite seu usuário" {...inp()}/>
            </div>
            <div style={{marginBottom:6}}>
              <label style={{fontSize:11,fontWeight:700,color:C.text2,display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:.8}}>Senha</label>
              <div style={{position:"relative"}}>
                <input type={show?"text":"password"} value={p} onChange={e=>{setP(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Digite sua senha" {...inp({paddingRight:42})}/>
                <button onClick={()=>setShow(!show)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:15,color:C.text3,padding:0}}>{show?"🙈":"👁"}</button>
              </div>
            </div>
            {err&&<div style={{background:"#fff0f0",border:"1px solid #fcc",borderRadius:7,padding:"8px 12px",fontSize:12,color:C.red,margin:"10px 0"}}>⚠️ {err}</div>}
            <button onClick={submit} disabled={busy} style={{width:"100%",padding:"13px",background:C.red,color:C.white,border:"none",borderRadius:9,fontSize:15,fontWeight:700,cursor:busy?"not-allowed":"pointer",fontFamily:ff,marginTop:16,opacity:busy?.8:1,boxShadow:`0 4px 12px rgba(192,57,43,.3)`}}>
              {busy?"Entrando...":"Entrar →"}
            </button>
          </div>
          <div style={{textAlign:"center",marginTop:16,fontSize:11,color:"#ccc"}}>© 2026 Maple Bear Vila Valqueire</div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
//  SUBJECT ROW
// ══════════════════════════════════════════════════════════════════════
function SubjectRow({s, highlight=""}) {
  const [open,setOpen]=useState(false);
  const hi = highlight && s.name.toLowerCase().includes(highlight.toLowerCase());
  return (
    <div style={{borderBottom:`1px solid ${C.gray2}`,paddingBottom:10,marginBottom:10,background:hi?"#fff8e6":"transparent",borderRadius:hi?6:0,padding:hi?"6px 8px":undefined}}>
      <button onClick={()=>setOpen(!open)} style={{width:"100%",background:"none",border:"none",cursor:"pointer",textAlign:"left",padding:0,display:"flex",alignItems:"flex-start",gap:10,fontFamily:ff}}>
        <span style={{fontSize:17,lineHeight:"22px",flexShrink:0}}>{s.icon}</span>
        <div style={{flex:1,fontSize:13,fontWeight:700,color:hi?C.amber:C.navy,lineHeight:1.35}}>{s.name}</div>
        <span style={{fontSize:10,color:C.text3,marginTop:2,flexShrink:0,lineHeight:"22px",transition:"transform .2s",transform:open?"rotate(180deg)":"rotate(0deg)"}}>▼</span>
      </button>
      {open&&<div style={{marginTop:7,marginLeft:27,fontSize:13,color:C.text2,lineHeight:1.7,borderLeft:`3px solid ${C.red}`,paddingLeft:11}}>{s.detail}</div>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
//  TASK CARD
// ══════════════════════════════════════════════════════════════════════
function TaskCard({task,onToggle}) {
  const cs  = cStatus(task);
  const st  = getStatusStyle()[cs];
  const cat = CAT_META[task.category]||CAT_META.tarefa;
  const pri = PRI_META[task.priority]||PRI_META.medium;

  // Days countdown bar
  const daysTotal = 7;
  const daysLeft  = Math.max(0, Math.ceil((new Date(task.due)-new Date(todayISO()))/86400000));
  const barPct    = cs==="done" ? 100 : Math.max(0, Math.min(100, ((daysTotal-daysLeft)/daysTotal)*100));
  const barColor  = cs==="done" ? C.green : cs==="overdue" ? C.red : daysLeft<=2 ? "#e67e22" : C.navy;

  return (
    <div style={{background:st.bg,borderRadius:12,border:`1.5px solid ${st.border}`,padding:"13px 14px",marginBottom:9,opacity:cs==="done"?.65:1,transition:"opacity .2s"}}>
      <div style={{display:"flex",gap:11,alignItems:"flex-start"}}>
        <button onClick={()=>onToggle(task.id)} style={{width:24,height:24,borderRadius:6,border:`2px solid ${cs==="done"?C.green:st.border}`,background:cs==="done"?C.green:"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,marginTop:1,transition:"all .15s",padding:0}}>
          {cs==="done"&&<span style={{color:C.white,fontSize:13,fontWeight:900,lineHeight:1}}>✓</span>}
        </button>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:5}}>
            <div style={{fontSize:14,fontWeight:700,color:cs==="done"?C.text2:C.text,lineHeight:1.3,textDecoration:cs==="done"?"line-through":"none"}}>{task.title}</div>
            <div style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,background:st.badgeBg,color:C.white,whiteSpace:"nowrap",flexShrink:0}}>{st.badge}</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap",marginBottom:cs==="done"?0:6}}>
            <span style={{fontSize:11,background:C.gray2,color:C.text2,padding:"2px 7px",borderRadius:20}}>{cat.icon} {cat.label}</span>
            <span style={{fontSize:11,color:pri.color,fontWeight:700}}>{pri.dot} {pri.label}</span>
            <span style={{fontSize:11,color:cs==="overdue"?C.red:cs==="urgent"?"#e67e22":C.text2,fontWeight:cs==="overdue"||cs==="urgent"?700:400}}>📅 {fmtLong(task.due)} · {daysLabel(task.due)}</span>
            {task.fromComunicado&&<span style={{fontSize:10,background:"#f0f4fa",color:C.navy,padding:"2px 7px",borderRadius:20,fontWeight:600}}>📢 Aviso</span>}
          </div>
          {cs!=="done"&&(
            <>
              <div style={{background:C.gray3,borderRadius:99,height:4,overflow:"hidden",marginBottom:6}}>
                <div style={{width:`${barPct}%`,height:"100%",background:barColor,borderRadius:99,transition:"width .5s ease"}}/>
              </div>
              <div style={{fontSize:12,color:C.text2,lineHeight:1.6}}>{task.desc}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
//  FORMATADOR — admin only
//  Reads raw teacher messages → outputs aulas.txt blocks
// ══════════════════════════════════════════════════════════════════════

const ICON_MAP = [
  {keys:["ela","english","buddy reading","slm","poema","poem","two-minute","two minute","leitura compartilhada","proofreading"],icon:"✏️"},
  {keys:["math","matemática","matematica","workbook","subtração","adição","estimativa","arredondamento"],icon:"🔢"},
  {keys:["science","ciências da natureza","ciencias da natureza","habitat","newsletter","burrowing"],icon:"🔬"},
  {keys:["arts","artes","desenho","carranca","autorretrato"],icon:"🎨"},
  {keys:["pla","língua portuguesa","lingua portuguesa","folclore","mosqueteiros","robin hood","centros de aprendizagem","organizador gráfico","herói autoral","livro dos heróis"],icon:"📚"},
  {keys:["história","historia","sambaquis","navegações","america indigena","indígena","grandes navegações"],icon:"📜"},
  {keys:["geografia","bioma","clima","fronteiras","relevo","hidrografia"],icon:"🌍"},
  {keys:["educação física","educacao fisica","mister paulo"],icon:"⚽"},
  {keys:["música","musica","miss michelle"],icon:"🎵"},
  {keys:["calma","momento de volta","lanche"],icon:"🧘"},
  {keys:["letramento emocional","dinâmica","empatia","confiança","prestatividade"],icon:"🤝"},
  {keys:["organização da sala","organizacao da sala","materiais"],icon:"🧹"},
  {keys:["assembly","apresentação","apresentacao"],icon:"🎤"},
  {keys:["projeto ciclos","inhame","nutricional"],icon:"🌱"},
  {keys:["av3","av2","av1","avaliação","avaliacao","quiz","trieduc"],icon:"📝"},
];

const MESES_MAP = {jan:1,fev:2,mar:3,abr:4,mai:5,jun:6,jul:7,ago:8,set:9,out:10,nov:11,dez:12};

function detectIcon(text) {
  const t = text.toLowerCase();
  for (const e of ICON_MAP) if (e.keys.some(k=>t.includes(k))) return e.icon;
  return "📌";
}

function normalizeText(txt) {
  return txt
    .replace(/^\uFEFF/, "")           // remove UTF-8 BOM
    .replace(/\u00A0/g, " ")          // replace non-breaking spaces
    .replace(/\r\n/g, "\n")           // Windows line endings
    .replace(/\r/g, "\n");            // old Mac line endings
}

function parseDate(linha) {
  const m1 = linha.match(/(\d{1,2})\s+(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)\s+(\d{4})/i);
  if (m1) return `${m1[3]}-${String(MESES_MAP[m1[2].toLowerCase()]).padStart(2,"0")}-${String(m1[1]).padStart(2,"0")}`;
  const m2 = linha.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (m2) return `${m2[1]}-${m2[2]}-${m2[3]}`;
  return null;
}

function detectProf(linha) {
  if (/thay/i.test(linha)||(/patr/i.test(linha)&&!(/igor/i.test(linha)))) return "Misses Thayná e Patrícia";
  if (/mari/i.test(linha)&&/igor/i.test(linha)) return "Ms. Mari e Mr. Igor";
  if (/mariana/i.test(linha)) return "Ms. Mari e Mr. Igor";
  return null;
}

function detectPeriod(texto, prof) {
  const p=prof.toLowerCase(), t=texto.toLowerCase();
  if (p.includes("thay")||p.includes("patrícia")||p.includes("patricia")) return "tarde";
  if (p.includes("mari")||p.includes("igor")) return "manhã";
  if (t.includes("tarde")||t.includes("afternoon")) return "tarde";
  return "manhã";
}

function extractMaterias(texto) {
  const SKIP = ["bom fim de semana","atenciosamente","com carinho","🚀","desejamos","segue a rotina","good morning","good afternoon","good night","boa tarde","boa manhã","saída","saida","marcou"];
  const linhas = texto.split("\n").map(l=>l.trim()).filter(Boolean);
  const mats = [];
  let bufName="", bufDetail="";

  const flush = () => {
    if (bufName) {
      const icon = detectIcon(bufName+" "+bufDetail);
      mats.push({icon, name:bufName.slice(0,100), detail:(bufDetail||bufName).replace(/\s+/g," ").trim()});
    }
    bufName=""; bufDetail="";
  };

  for (const linha of linhas) {
    const low = linha.toLowerCase();
    if (SKIP.some(s=>low.includes(s.toLowerCase()))) { flush(); continue; }
    if (detectProf(linha)&&linha.includes("marcou")) { flush(); continue; }
    if (/^\d{1,2}\s+(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)/i.test(linha)) { flush(); continue; }
    if (linha.startsWith("DATA:")||linha.startsWith("PROFESSOR:")||linha.startsWith("PERIODO:")) { flush(); continue; }

    if (linha.startsWith("MATERIA:")) {
      flush();
      const rest = linha.slice(8).trim();
      const pipe = rest.indexOf("|");
      if (pipe>-1) { bufName=rest.slice(0,pipe).trim(); bufDetail=rest.slice(pipe+1).trim(); }
      else { bufName=rest.slice(0,80); bufDetail=rest; }
      flush(); continue;
    }

    const namedMatch = linha.match(/^(ELA|MATH|SCIENCE|ARTS?|PLA|HISTÓRIA|HISTORIA|GEOGRAFIA|MÚSICA|MUSICA|LETRAMENTO|ASSEMBLY)\b(.*)$/i);
    if (namedMatch) {
      flush();
      const subj = namedMatch[1].toUpperCase();
      const rest = namedMatch[2].replace(/^\s*(aula\s+de\s+hoje[,:\s]*|na\s+aula\s+de\s+hoje[,:\s]*|[:–—]\s*)/i,"").trim();
      const labelMap = {ELA:"ELA",MATH:"Math",SCIENCE:"Science",ARTS:"Arts",ART:"Arts",PLA:"PLA",HISTÓRIA:"História",HISTORIA:"História",GEOGRAFIA:"Geografia",MÚSICA:"Música",MUSICA:"Música",LETRAMENTO:"Letramento Emocional",ASSEMBLY:"Assembly"};
      bufName = labelMap[subj]||subj;
      bufDetail = rest;
      continue;
    }

    const emojiMatch = linha.match(/^([🧘📚🔢✏️🎨🔬⚽🎵🤝🧹🎤🌱📝📜🌍🌎📊])\s*(.+)/u);
    if (emojiMatch) {
      flush();
      const rest = emojiMatch[2];
      const colIdx = rest.search(/[:\-–—]/);
      if (colIdx>0&&colIdx<35) { bufName=rest.slice(0,colIdx).trim(); bufDetail=rest.slice(colIdx+1).trim(); }
      else { bufName=rest.slice(0,60).replace(/[.!?].*$/,"").trim(); bufDetail=rest; }
      continue;
    }

    if (bufName) bufDetail += " " + linha;
  }
  flush();
  return mats.filter(m=>m.name.length>1);
}

function parsearTexto(textoRaw) {
  const texto = normalizeText(textoRaw);

  // ── Pre-process: split lines that have "marcou...Silva8 mai" (no space before date) ──
  // e.g. "Thayná Barbosa Ribeiro marcou Mateus Caldeira Larocca da Silva8 mai 2026, 2.27 pm"
  // becomes two lines so the parser can find both prof and date
  const linhasRaw = texto.split("\n").map(l => {
    // Detect: contains "marcou" AND date is glued to end of name without space
    // Pattern: "...Silva8 mai 2026" or "...SilvaXX mmm YYYY"
    const glued = l.match(/^(.+marcou\s+.+?)(\d{1,2}\s+(?:jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)\s+\d{4}.*)$/i);
    if (glued) return glued[1].trim() + "\n" + glued[2].trim();
    return l;
  }).join("\n").split("\n");

  const segments = [];
  let cur = null;

  for (const linha of linhasRaw) {
    const d = parseDate(linha);
    const p = detectProf(linha);

    if (p && linha.includes("marcou")) {
      // Header line with prof name
      if (cur) segments.push(cur);
      // If date is on this same line (after split it should be separate, but handle both)
      cur = {data: d || null, professor: p, linhas: []};
    } else if (d && cur && !cur.data) {
      // Date line right after prof line
      cur.data = d;
    } else if (linha.trim()==="---") {
      if (cur) segments.push(cur);
      cur = null;
    } else if (linha.startsWith("DATA:")) {
      if (cur) segments.push(cur);
      cur = {data:parseDate(linha), professor:null, linhas:[]};
    } else if (linha.startsWith("PROFESSOR:")&&cur) {
      cur.professor = linha.slice(10).replace(/\s*PERIODO:.*/,"").trim();
      const pm = linha.match(/PERIODO:\s*(\S+)/);
      if (pm) cur.periodo = pm[1];
    } else if (linha.startsWith("PERIODO:")&&cur) {
      cur.periodo = linha.slice(8).trim();
    } else {
      if (cur) cur.linhas.push(linha);
    }
  }
  if (cur) segments.push(cur);

  const blocos = [];
  for (const seg of segments) {
    if (!seg.data||!seg.professor) continue;
    const txt = seg.linhas.join("\n");
    const periodo = seg.periodo || detectPeriod(txt, seg.professor);
    const materias = extractMaterias(txt);
    const ex = blocos.find(b=>b.data===seg.data&&b.professor===seg.professor);
    if (ex) ex.materias.push(...materias);
    else blocos.push({data:seg.data, professor:seg.professor, periodo, materias});
  }
  return blocos.sort((a,b)=>b.data.localeCompare(a.data));
}

function gerarBlocos(blocos) {
  const parts = blocos.map(b => {
    const mats = b.materias.length > 0
      ? b.materias.map(m => `MATERIA: ${m.icon} ${m.name} | ${m.detail}`).join("\n")
      : "MATERIA: 📌 Aula | Conteúdo a revisar.";
    return `DATA: ${b.data}\nPROFESSOR: ${b.professor}\nPERIODO: ${b.periodo}\n${mats}`;
  });
  return "---\n" + parts.join("\n---\n") + "\n---";
}

function fmtDisp(iso) {
  const ms=["","Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  const [,m,d]=iso.split("-"); return `${parseInt(d)} ${ms[parseInt(m)]}`;
}

// ── COMUNICADOS PARSER ───────────────────────────────────────────────
const MESES_PT = {jan:1,fev:2,mar:3,abr:4,mai:5,jun:6,jul:7,ago:8,set:9,out:10,nov:11,dez:12};

function parseDataCom(str) {
  const m = str.match(/(\d{1,2})\s+(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)\s+(\d{4})/i);
  if (m) return `${String(parseInt(m[1])).padStart(2,"0")}/${String(MESES_PT[m[2].toLowerCase()]).padStart(2,"0")}/${m[3]}`;
  return null;
}

function detectAutor(nome) {
  const n = nome.toLowerCase();
  if (n.includes("thay") || n.includes("patrícia") || n.includes("patricia")) return "Misses Thayná e Patrícia";
  if (n.includes("mariana") || n.includes("mari")) return "Ms. Mari";
  if (n.includes("danielle") || n.includes("carvalho") || n.includes("coordenação") || n.includes("coordenacao")) return "Coordenação Pedagógica";
  if (n.includes("jéssica") || n.includes("jessica")) return "Miss Jéssica";
  return nome.trim().split("\n")[0].trim();
}

function detectCategoria(titulo, conteudo) {
  const t = (titulo + " " + conteudo).toLowerCase();
  if (/av[123]|avaliação|avaliacao|cronograma.*av|prova|quiz|math challenge|poema diamante/.test(t)) return "avaliacao";
  if (/tarefa|dever de casa|leitura.*árvore|livro.*trazer|prazo de entrega|entregar|indicação de leitura/.test(t)) return "tarefa";
  if (/calendário|calendario|feriado|sem aula|dia livre|recesso/.test(t)) return "calendario";
  if (/atividade|assembly|open house|mother|dia das mães|visita|evento/.test(t)) return "atividade";
  return "aviso";
}

function parsearComunicados(textoRaw) {
  const texto = normalizeText(textoRaw);
  const linhas = texto.split("\n").map(l => l.trim());
  const result = [];

  // Find all positions where "Publicado por" appears
  const starts = [];
  for (let i = 0; i < linhas.length; i++) {
    if (/publicado por/i.test(linhas[i]) && linhas[i].length < 20) starts.push(i);
  }
  if (starts.length === 0) return [];

  for (let s = 0; s < starts.length; s++) {
    const from = starts[s];
    const to   = s + 1 < starts.length ? starts[s + 1] : linhas.length;
    const block = linhas.slice(from, to);

    let autor = "", data = "", titulo = "", conteudo = [];
    let phase = "autor";

    for (let i = 0; i < block.length; i++) {
      const l = block[i];
      if (!l) continue;

      if (/publicado por/i.test(l) && l.length < 20) continue;

      if (phase === "autor") {
        if (!autor) { autor = l; continue; }
        if (l.toUpperCase().replace(/\s+/g," ") === autor.toUpperCase().replace(/\s+/g," ")) continue;
        if (/^publicado em$/i.test(l)) { phase = "data"; continue; }
        if (/^publicado em\s+\d/i.test(l)) {
          const d = parseDataCom(l);
          if (d) { data = d; phase = "body"; }
          continue;
        }
        continue;
      }

      if (phase === "data") {
        const d = parseDataCom(l);
        if (d) { data = d; phase = "body"; }
        continue;
      }

      if (phase === "body") {
        const low = l.toLowerCase();
        if (l === "---") continue;
        const skip = [
          /^(boa tarde|bom dia|olá,|dear |prezados|queridas|queridos)/,
          /^(atenciosamente|com carinho|kind regards)/,
          /^(coordenação pedagógica$|ms\. mari$|miss thay)/,
          /^(um ótimo|qualquer dúvida|conto com a colaboração|conto com o apoio)/,
          /^(estou à disposição|segue o cardápio|ótima semana)/,
          /^(contamos com sua presença|importante:|favor conferir)/,
          /^🚀/,
        ];
        if (skip.some(p => p.test(low))) continue;
        if (l.toUpperCase().replace(/\s+/g," ") === autor.toUpperCase().replace(/\s+/g," ")) continue;

        if (!titulo) {
          const isSal = /^(boa tarde|bom dia|olá|dear|prezado|querida|segue\s)/.test(low);
          if (!isSal) {
            titulo = l.replace(/^[📚📅🐻🎉🎊]\s*/u, "").trim();
            continue;
          }
        }
        conteudo.push(l);
      }
    }

    if (!data || !titulo) continue;
    if (/^cardápio$/i.test(titulo)) continue;

    const fullContent = conteudo.join(" ").replace(/\s{2,}/g, " ").trim();
    result.push({
      data,
      titulo,
      autor:     detectAutor(autor),
      categoria: detectCategoria(titulo, fullContent),
      conteudo:  fullContent || titulo,
    });
  }

  return result;
}

function gerarComunicados(items) {
  const parts = items.map(c =>
    `DATA: ${c.data}\nTITULO: ${c.titulo}\nAUTOR: ${c.autor}\nCATEGORIA: ${c.categoria}\nCONTEUDO: ${c.conteudo}`
  );
  return "---\n" + parts.join("\n---\n") + "\n---";
}

const CAT_COLORS = {
  avaliacao: C.red, tarefa:"#d35400", aviso:C.navy, calendario:"#7c3aed", atividade:C.green
};
const CAT_LABELS = {
  avaliacao:"Avaliação", tarefa:"Tarefa", aviso:"Aviso", calendario:"Calendário", atividade:"Atividade"
};

// ── ANN CARD with full-screen reader ────────────────────────────────
function AnnCard({ann, c}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {open&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:200,display:"flex",alignItems:"flex-end"}} onClick={()=>setOpen(false)}>
          <div style={{background:C.white,borderRadius:"16px 16px 0 0",padding:"20px 20px 40px",width:"100%",maxHeight:"80vh",overflowY:"auto",maxWidth:430,margin:"0 auto"}} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <span style={{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:20,background:c.bg,color:c.color,border:`1px solid ${c.color}22`}}>{c.label}</span>
              <button onClick={()=>setOpen(false)} style={{background:C.gray2,border:"none",cursor:"pointer",fontSize:14,color:C.text2,padding:"4px 10px",borderRadius:99,fontFamily:ff,fontWeight:700}}>Fechar</button>
            </div>
            <div style={{fontSize:17,fontWeight:800,color:C.navy,lineHeight:1.3,marginBottom:8}}>{ann.title}</div>
            <div style={{fontSize:12,color:C.text3,marginBottom:16}}>{ann.date} · {ann.author}</div>
            <div style={{fontSize:14,color:C.text,lineHeight:1.85,borderTop:`1px solid ${C.gray2}`,paddingTop:16}}>{ann.content}</div>
          </div>
        </div>
      )}
      <div style={{background:C.white,borderRadius:12,marginBottom:12,overflow:"hidden",boxShadow:sh}}>
        <div style={{borderLeft:`5px solid ${c.accent||c.color}`,padding:"14px 16px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:5}}>
            <div style={{fontSize:14,fontWeight:800,color:C.navy,lineHeight:1.3,flex:1}}>{ann.title}</div>
            <div style={{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:20,background:c.bg,color:c.color,whiteSpace:"nowrap",flexShrink:0,border:`1px solid ${c.color}22`}}>{c.label}</div>
          </div>
          <div style={{fontSize:11,color:C.text3,marginBottom:8}}>{ann.date} · {ann.author}</div>
          <div style={{fontSize:13,color:C.text2,lineHeight:1.7,display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{ann.content}</div>
          <button onClick={()=>setOpen(true)} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:c.color,fontWeight:700,padding:"8px 0 0",fontFamily:ff}}>
            Ler completo →
          </button>
        </div>
      </div>
    </>
  );
}

// ── FORMATADOR ────────────────────────────────────────────────────────
function Formatador() {
  // "select" = tela de escolha | "aula" | "comunicado"
  const [mode,  setMode]    = useState("select");
  const [step,  setStep]    = useState(1);
  const [texto, setTexto]   = useState("");
  const [items, setItems]   = useState([]);
  const [output,setOutput]  = useState("");
  const [copied,setCopied]  = useState(false);
  const [openIdx,setOpenIdx]= useState(null);

  function resetAll() { setMode("select"); setStep(1); setTexto(""); setItems([]); setOutput(""); setCopied(false); setOpenIdx(null); }
  function resetStep() { setStep(1); setTexto(""); setItems([]); setOutput(""); setCopied(false); setOpenIdx(null); }

  function chooseMode(m) { setMode(m); setStep(1); }

  function processar(txt) {
    const t = normalizeText(txt || texto);
    if (!t.trim()) return;
    const parsed = mode === "aula" ? parsearTexto(t) : parsearComunicados(t);
    if (parsed.length === 0) { alert("Nenhum bloco detectado. Verifique se o texto está no formato correto."); return; }
    setItems(parsed);
    setStep(2);
  }

  function confirmar() {
    setOutput(mode === "aula" ? gerarBlocos(items) : gerarComunicados(items));
    setStep(3);
  }

  function copiar() {
    navigator.clipboard.writeText(output)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 3500); })
      .catch(() => {});
  }

  function baixar() {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([output], {type:"text/plain;charset=utf-8"}));
    a.download = mode === "aula" ? "aulas-novos-blocos.txt" : "comunicados-novos.txt";
    a.click();
  }

  function onFile(e) {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => { const t = normalizeText(ev.target.result); setTexto(t); processar(t); };
    r.readAsText(f, "UTF-8");
  }

  const targetFile  = mode === "aula" ? "src/data/aulas.txt" : "src/data/comunicados.txt";
  const stepLabels  = ["Carregar","Revisar","Copiar"];
  const isCom       = mode === "comunicado";

  return (
    <div style={{display:"flex",flexDirection:"column",gap:0,paddingBottom:8}}>

      {/* ── HEADER ── */}
      <div style={{background:C.navy,borderRadius:12,padding:"12px 16px",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:8,background:C.red,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>⚙️</div>
          <div>
            <div style={{fontWeight:800,fontSize:14,color:C.white}}>
              {mode==="select" ? "Formatador de Conteúdo"
               : mode==="aula" ? "📅 Formatador de Aulas"
               : "📢 Formatador de Comunicados"}
            </div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.45)"}}>Acesso exclusivo · Coordenação</div>
          </div>
        </div>
        {mode !== "select" && (
          <button onClick={resetAll} style={{background:"rgba(255,255,255,.12)",border:"none",color:"rgba(255,255,255,.7)",borderRadius:7,padding:"5px 10px",fontSize:11,cursor:"pointer",fontFamily:ff,fontWeight:700}}>
            ← Trocar
          </button>
        )}
      </div>

      {/* ══════════════ TELA DE SELEÇÃO ══════════════ */}
      {mode==="select"&&(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{fontSize:13,color:C.text2,textAlign:"center",marginBottom:4}}>
            O que você quer formatar hoje?
          </div>

          {/* Card Aulas */}
          <button onClick={()=>chooseMode("aula")} style={{background:C.white,borderRadius:14,padding:"18px 20px",border:`2px solid ${C.gray3}`,cursor:"pointer",fontFamily:ff,textAlign:"left",boxShadow:sh,transition:"all .15s",display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:48,height:48,borderRadius:12,background:C.navy2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>📅</div>
            <div style={{flex:1}}>
              <div style={{fontSize:15,fontWeight:800,color:C.navy,marginBottom:3}}>Aulas</div>
              <div style={{fontSize:12,color:C.text2,lineHeight:1.5}}>Mensagens das professoras do app da escola → formata para o <code style={{fontSize:11,background:C.gray2,padding:"1px 4px",borderRadius:4}}>aulas.txt</code></div>
            </div>
            <span style={{fontSize:18,color:C.text3}}>→</span>
          </button>

          {/* Card Comunicados */}
          <button onClick={()=>chooseMode("comunicado")} style={{background:C.white,borderRadius:14,padding:"18px 20px",border:`2px solid ${C.gray3}`,cursor:"pointer",fontFamily:ff,textAlign:"left",boxShadow:sh,transition:"all .15s",display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:48,height:48,borderRadius:12,background:"#f8f4fd",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>📢</div>
            <div style={{flex:1}}>
              <div style={{fontSize:15,fontWeight:800,color:C.navy,marginBottom:3}}>Comunicados</div>
              <div style={{fontSize:12,color:C.text2,lineHeight:1.5}}>Portal da escola com "Publicado por" → formata para o <code style={{fontSize:11,background:C.gray2,padding:"1px 4px",borderRadius:4}}>comunicados.txt</code></div>
            </div>
            <span style={{fontSize:18,color:C.text3}}>→</span>
          </button>

          {/* Hint */}
          <div style={{background:C.gray,borderRadius:10,padding:"10px 14px",fontSize:11,color:C.text2,lineHeight:1.6,marginTop:4}}>
            💡 Após formatar, copie o resultado e cole no início do arquivo correspondente no GitHub. O site atualiza automaticamente em ~30s.
          </div>
        </div>
      )}

      {/* ══════════════ FORMULÁRIO (aula ou comunicado) ══════════════ */}
      {mode!=="select"&&(
        <>
          {/* Step bar */}
          <div style={{display:"flex",background:C.white,borderRadius:10,padding:6,gap:4,marginBottom:12,boxShadow:sh}}>
            {stepLabels.map((s,i) => (
              <div key={i} style={{flex:1,padding:"6px 4px",borderRadius:8,textAlign:"center",fontSize:11,fontWeight:700,
                background:step===i+1?C.red:step>i+1?C.green:"transparent",
                color:step===i+1||step>i+1?C.white:C.text3,transition:"all .2s"}}>
                {step>i+1?"✓ ":""}{s}
              </div>
            ))}
          </div>

          {/* ── STEP 1: INPUT ── */}
          {step===1&&(
            <div style={{background:C.white,borderRadius:12,padding:"14px 16px",boxShadow:sh,marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:700,color:C.navy,marginBottom:6}}>
                {isCom ? "Cole os comunicados do portal da escola" : "Cole as mensagens das professoras"}
              </div>
              <div style={{fontSize:11,color:C.text2,marginBottom:10,lineHeight:1.5,background:isCom?"#f8f4fd":C.navy2,borderRadius:8,padding:"8px 10px",borderLeft:`3px solid ${isCom?"#7c3aed":C.navy}`}}>
                {isCom
                  ? <><strong style={{color:"#5b21b6"}}>Formato esperado:</strong> texto começando com "Publicado por", seguido do nome, "Publicado em", data, e o conteúdo.</>
                  : <><strong style={{color:C.navy}}>Formato esperado:</strong> mensagens das professoras com nome, data (ex: "8 mai 2026") e conteúdo das aulas.</>}
              </div>
              <textarea
                value={texto}
                onChange={e=>setTexto(e.target.value)}
                placeholder={isCom
                  ? "Publicado por\nDANIELLE PIRES DA SILVA CARVALHO\nPublicado em\n22 abr 2026, 2:09 pm\n\nCronograma das Atividades AV3..."
                  : "Thayná Barbosa Ribeiro marcou Mateus...\n8 mai 2026, 2.27 pm\nBoa tarde, famílias!\n🧘 Após o lanche..."}
                style={{width:"100%",height:160,border:`1.5px solid ${C.gray3}`,borderRadius:8,padding:"10px 12px",
                  fontSize:12,fontFamily:"'DM Mono',monospace",resize:"vertical",outline:"none",
                  color:C.text,background:"#fafafa",lineHeight:1.6}}
              />
              <div style={{display:"flex",gap:8,marginTop:10}}>
                <button onClick={()=>processar()} style={{flex:1,padding:"11px",background:C.red,color:C.white,border:"none",borderRadius:8,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:ff}}>
                  ⚡ Processar
                </button>
                <label style={{padding:"11px 14px",background:C.white,color:C.text2,border:`1.5px solid ${C.gray3}`,borderRadius:8,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:ff,display:"flex",alignItems:"center",gap:5,flexShrink:0}}>
                  📂 Arquivo
                  <input type="file" accept=".txt" onChange={onFile} style={{display:"none"}}/>
                </label>
                <button onClick={()=>setTexto("")} style={{padding:"11px 14px",background:C.white,color:C.text2,border:`1.5px solid ${C.gray3}`,borderRadius:8,fontSize:13,cursor:"pointer",fontFamily:ff}}>✕</button>
              </div>
            </div>
          )}

          {/* ── STEP 2: REVIEW ── */}
          {step===2&&(
            <>
              <div style={{background:C.white,borderRadius:12,padding:"12px 16px",boxShadow:sh,marginBottom:10}}>
                <span style={{fontWeight:700,color:C.navy}}>{items.length} bloco{items.length>1?"s":""} detectados.</span>
                <span style={{fontSize:12,color:C.text2}}> Expanda para revisar antes de confirmar.</span>
              </div>

              {items.map((item,i) => (
                <div key={i} style={{background:C.white,borderRadius:12,marginBottom:8,overflow:"hidden",boxShadow:sh}}>
                  <button onClick={()=>setOpenIdx(openIdx===i?null:i)}
                    style={{width:"100%",padding:"11px 14px",background:C.gray,border:"none",cursor:"pointer",
                      display:"flex",alignItems:"center",gap:8,fontFamily:ff,textAlign:"left"}}>
                    <span style={{background:C.navy,color:C.white,fontSize:11,fontWeight:700,padding:"3px 9px",borderRadius:99,flexShrink:0}}>
                      {mode==="aula" ? fmtDisp(item.data) : item.data}
                    </span>
                    {mode==="aula" ? (
                      <>
                        <span style={{fontSize:13,fontWeight:700,color:C.navy,flex:1}}>{item.professor}</span>
                        <span style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:99,flexShrink:0,
                          background:item.periodo==="manhã"?"#fff8e6":"#e8eef7",
                          color:item.periodo==="manhã"?"#a0720a":C.navy}}>
                          {item.periodo==="manhã"?"☀️":"🌤"} {item.periodo}
                        </span>
                      </>
                    ) : (
                      <>
                        <span style={{fontSize:12,fontWeight:700,color:C.navy,flex:1,lineHeight:1.3}}>{item.titulo}</span>
                        <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:99,flexShrink:0,
                          background:`${CAT_COLORS[item.categoria]}18`,color:CAT_COLORS[item.categoria]}}>
                          {CAT_LABELS[item.categoria]}
                        </span>
                      </>
                    )}
                    <span style={{fontSize:10,color:C.text3,transition:"transform .2s",transform:openIdx===i?"rotate(180deg)":"none"}}>▼</span>
                  </button>

                  {openIdx===i&&(
                    <div style={{padding:"12px 14px"}}>
                      {mode==="aula" ? (
                        item.materias.length===0
                          ? <div style={{fontSize:12,color:C.text3}}>Nenhuma matéria detectada.</div>
                          : item.materias.map((m,mi)=>(
                              <div key={mi} style={{display:"flex",gap:8,padding:"7px 0",
                                borderBottom:mi<item.materias.length-1?`1px solid ${C.gray2}`:"none",alignItems:"flex-start"}}>
                                <span style={{fontSize:16,flexShrink:0,lineHeight:1.3}}>{m.icon}</span>
                                <div>
                                  <div style={{fontSize:13,fontWeight:700,color:C.navy}}>{m.name}</div>
                                  <div style={{fontSize:12,color:C.text2,lineHeight:1.5,marginTop:2}}>{m.detail}</div>
                                </div>
                              </div>
                            ))
                      ) : (
                        <div style={{display:"flex",flexDirection:"column",gap:8}}>
                          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                            <span style={{fontSize:11,background:C.gray2,color:C.text2,padding:"2px 8px",borderRadius:99}}>👤 {item.autor}</span>
                            <span style={{fontSize:11,padding:"2px 8px",borderRadius:99,background:`${CAT_COLORS[item.categoria]}18`,color:CAT_COLORS[item.categoria],fontWeight:700}}>
                              {CAT_LABELS[item.categoria]}
                            </span>
                          </div>
                          <div style={{fontSize:12,color:C.text2,lineHeight:1.65,borderLeft:`3px solid ${CAT_COLORS[item.categoria]}`,paddingLeft:10}}>
                            {item.conteudo}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              <div style={{display:"flex",gap:8,marginTop:4}}>
                <button onClick={confirmar} style={{flex:1,padding:"12px",background:C.red,color:C.white,border:"none",borderRadius:8,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:ff}}>
                  ✅ Confirmar e gerar
                </button>
                <button onClick={resetStep} style={{padding:"12px 16px",background:C.white,color:C.text2,border:`1.5px solid ${C.gray3}`,borderRadius:8,fontSize:13,cursor:"pointer",fontFamily:ff}}>
                  ← Voltar
                </button>
              </div>
            </>
          )}

          {/* ── STEP 3: OUTPUT ── */}
          {step===3&&(
            <>
              {copied&&(
                <div style={{background:C.green2,border:`1.5px solid ${C.green}`,borderRadius:10,padding:"11px 14px",textAlign:"center",color:C.green,fontWeight:700,fontSize:13,marginBottom:10}}>
                  ✅ Copiado! Cole no início do <code style={{fontSize:11}}>{targetFile}</code> no GitHub → Commit ✅
                </div>
              )}

              <div style={{background:C.white,borderRadius:12,padding:"14px 16px",boxShadow:sh,marginBottom:10}}>
                <div style={{fontSize:12,fontWeight:700,color:C.navy,marginBottom:6}}>Resultado formatado</div>
                <div style={{fontSize:11,color:C.text2,background:isCom?"#f8f4fd":C.navy2,borderRadius:8,padding:"8px 10px",marginBottom:10,lineHeight:1.5,borderLeft:`3px solid ${isCom?"#7c3aed":C.navy}`}}>
                  GitHub → <code style={{fontSize:10,background:isCom?"#ede9fe":"#dce8f7",padding:"1px 4px",borderRadius:4}}>{targetFile}</code> → lápis ✏️ → colar no <strong>início</strong> → Commit ✅
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={copiar} style={{flex:1,padding:"10px",background:C.green,color:C.white,border:"none",borderRadius:8,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:ff}}>
                    📋 Copiar tudo
                  </button>
                  <button onClick={baixar} style={{padding:"10px 14px",background:C.navy,color:C.white,border:"none",borderRadius:8,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:ff}}>
                    ⬇
                  </button>
                  <button onClick={resetAll} style={{padding:"10px 14px",background:C.white,color:C.text2,border:`1.5px solid ${C.gray3}`,borderRadius:8,fontSize:13,cursor:"pointer",fontFamily:ff}}>
                    ↺ Novo
                  </button>
                </div>
              </div>

              <div style={{background:"#1e1e2e",borderRadius:12,padding:"14px 16px",fontFamily:"'DM Mono',monospace",
                fontSize:11.5,color:"#cdd6f4",whiteSpace:"pre-wrap",wordBreak:"break-all",lineHeight:1.8,
                maxHeight:400,overflowY:"auto"}}>
                {output.split("\n").map((l,i) => {
                  if (l==="---") return <div key={i} style={{color:"#f38ba8",fontWeight:700}}>---</div>;
                  const keys = mode==="aula"
                    ? ["DATA:","PROFESSOR:","PERIODO:","MATERIA:"]
                    : ["DATA:","TITULO:","AUTOR:","CATEGORIA:","CONTEUDO:"];
                  if (keys.some(k=>l.startsWith(k))) {
                    const colon = l.indexOf(":");
                    return <div key={i}><span style={{color:"#cba6f7"}}>{l.slice(0,colon+1)}</span><span style={{color:"#a6e3a1"}}>{l.slice(colon+1)}</span></div>;
                  }
                  return <div key={i}>{l}</div>;
                })}
              </div>
            </>
          )}
        </>
      )}

    </div>
  );
}

// ── SHARED FORMATADOR PANEL ──────────────────────────────────────────
function FormatPanel({ mode }) {
  const isAula = mode === "aula";
  const [step, setStep]     = useState(1);
  const [texto, setTexto]   = useState("");
  const [items, setItems]   = useState([]);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [openIdx, setOpenIdx] = useState(null);

  function reset() { setStep(1); setTexto(""); setItems([]); setOutput(""); setCopied(false); }

  function processar(txt) {
    const t = txt || texto;
    if (!t.trim()) return;
    const parsed = isAula ? parsearTexto(t) : parsearComunicados(t);
    if (parsed.length === 0) { alert("Nenhum bloco detectado. Verifique o texto."); return; }
    setItems(parsed);
    setStep(2);
  }

  function confirmar() {
    setOutput(isAula ? gerarBlocos(items) : gerarComunicados(items));
    setStep(3);
  }

  function copiar() {
    navigator.clipboard.writeText(output)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 3000); })
      .catch(() => {});
  }

  function baixar() {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([output], {type:"text/plain;charset=utf-8"}));
    a.download = isAula ? "aulas-novos-blocos.txt" : "comunicados-novos.txt";
    a.click();
  }

  function onFile(e) {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => { const t = ev.target.result; setTexto(t); processar(t); };
    r.readAsText(f, "UTF-8");
  }

  const card = (children) => (
    <div style={{background:C.white,borderRadius:12,padding:"14px 16px",boxShadow:sh,marginBottom:12}}>{children}</div>
  );

  const steps = ["Carregar","Revisar","Copiar"];
  const targetFile = isAula ? "src/data/aulas.txt" : "src/data/comunicados.txt";
  const placeholder = isAula
    ? "Thayná Barbosa Ribeiro marcou Mateus...\n8 mai 2026, 2.27 pm\nBoa tarde, famílias!\n🧘 Após o lanche..."
    : "Publicado por\nMARIANA DE PAIVA ARAUJO\nPublicado em\n24 abr 2026, 2:14 pm\nTítulo do comunicado\nTexto completo...";

  return (
    <div style={{display:"flex",flexDirection:"column",gap:0,paddingBottom:8}}>

      {/* Step bar */}
      <div style={{display:"flex",background:C.white,borderRadius:10,padding:6,gap:4,marginBottom:12,boxShadow:sh}}>
        {steps.map((s,i) => (
          <div key={i} style={{flex:1,padding:"6px 4px",borderRadius:8,textAlign:"center",fontSize:11,fontWeight:700,
            background:step===i+1?C.red:step>i+1?C.green:"transparent",
            color:step===i+1||step>i+1?C.white:C.text3,transition:"all .2s"}}>
            {step>i+1?"✓ ":""}{s}
          </div>
        ))}
      </div>

      {/* ── STEP 1 ── */}
      {step===1&&card(
        <>
          <div style={{fontSize:12,fontWeight:700,color:C.navy,marginBottom:8}}>
            {isAula?"Cole as mensagens das professoras":"Cole os comunicados da escola"}
          </div>
          <div style={{fontSize:11,color:C.text2,marginBottom:10,lineHeight:1.5,background:C.navy2,borderRadius:8,padding:"8px 10px"}}>
            {isAula
              ? "Cole exatamente como chega do app — com os nomes, datas e mensagens de cada professora."
              : "Cole exatamente como aparece no portal da escola — começando com \"Publicado por\"."}
          </div>
          <textarea value={texto} onChange={e=>setTexto(e.target.value)} placeholder={placeholder}
            style={{width:"100%",height:160,border:`1.5px solid ${C.gray3}`,borderRadius:8,padding:"10px 12px",fontSize:12,
              fontFamily:"'DM Mono',monospace",resize:"vertical",outline:"none",color:C.text,background:"#fafafa",lineHeight:1.6}}/>
          <div style={{display:"flex",gap:8,marginTop:10}}>
            <button onClick={()=>processar()} style={{flex:1,padding:"11px",background:C.red,color:C.white,border:"none",borderRadius:8,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:ff}}>
              ⚡ Processar
            </button>
            <label style={{padding:"11px 14px",background:C.white,color:C.text2,border:`1.5px solid ${C.gray3}`,borderRadius:8,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:ff,display:"flex",alignItems:"center",gap:5}}>
              📂 Arquivo
              <input type="file" accept=".txt" onChange={onFile} style={{display:"none"}}/>
            </label>
            <button onClick={()=>setTexto("")} style={{padding:"11px 14px",background:C.white,color:C.text2,border:`1.5px solid ${C.gray3}`,borderRadius:8,fontSize:13,cursor:"pointer",fontFamily:ff}}>✕</button>
          </div>
        </>
      )}

      {/* ── STEP 2 ── */}
      {step===2&&(
        <>
          {card(
            <div style={{fontSize:13,color:C.text2,lineHeight:1.5}}>
              <span style={{fontWeight:700,color:C.navy}}>{items.length} bloco{items.length>1?"s":""} detectados.</span> Revise antes de confirmar.
            </div>
          )}

          {items.map((item,i) => (
            <div key={i} style={{background:C.white,borderRadius:12,marginBottom:8,overflow:"hidden",boxShadow:sh}}>
              <button onClick={()=>setOpenIdx(openIdx===i?null:i)}
                style={{width:"100%",padding:"11px 14px",background:C.gray,border:"none",cursor:"pointer",
                  display:"flex",alignItems:"center",gap:8,fontFamily:ff,textAlign:"left"}}>
                <span style={{background:C.navy,color:C.white,fontSize:11,fontWeight:700,padding:"3px 9px",borderRadius:99,flexShrink:0}}>
                  {isAula ? fmtDisp(item.data) : item.data}
                </span>
                {isAula ? (
                  <>
                    <span style={{fontSize:13,fontWeight:700,color:C.navy,flex:1}}>{item.professor}</span>
                    <span style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:99,
                      background:item.periodo==="manhã"?"#fff8e6":"#e8eef7",
                      color:item.periodo==="manhã"?"#a0720a":C.navy,flexShrink:0}}>
                      {item.periodo==="manhã"?"☀️":"🌤"} {item.periodo}
                    </span>
                  </>
                ) : (
                  <>
                    <span style={{fontSize:13,fontWeight:700,color:C.navy,flex:1,lineHeight:1.3}}>{item.titulo}</span>
                    <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:99,flexShrink:0,
                      background:`${CAT_COLORS[item.categoria]}18`,color:CAT_COLORS[item.categoria]}}>
                      {CAT_LABELS[item.categoria]}
                    </span>
                  </>
                )}
                <span style={{fontSize:10,color:C.text3,transform:openIdx===i?"rotate(180deg)":"none",transition:"transform .2s"}}>▼</span>
              </button>

              {openIdx===i&&(
                <div style={{padding:"12px 14px"}}>
                  {isAula ? (
                    item.materias.length===0
                      ? <div style={{fontSize:12,color:C.text3}}>Nenhuma matéria detectada.</div>
                      : item.materias.map((m,mi)=>(
                          <div key={mi} style={{display:"flex",gap:8,padding:"7px 0",
                            borderBottom:mi<item.materias.length-1?`1px solid ${C.gray2}`:"none",alignItems:"flex-start"}}>
                            <span style={{fontSize:16,flexShrink:0,lineHeight:1.3}}>{m.icon}</span>
                            <div>
                              <div style={{fontSize:13,fontWeight:700,color:C.navy}}>{m.name}</div>
                              <div style={{fontSize:12,color:C.text2,lineHeight:1.5,marginTop:2}}>{m.detail}</div>
                            </div>
                          </div>
                        ))
                  ) : (
                    <div style={{display:"flex",flexDirection:"column",gap:6}}>
                      <div style={{fontSize:12,color:C.text2}}><b style={{color:C.navy}}>Autor:</b> {item.autor}</div>
                      <div style={{fontSize:12,color:C.text2,lineHeight:1.6,borderLeft:`3px solid ${CAT_COLORS[item.categoria]}`,paddingLeft:10}}>
                        {item.conteudo}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          <div style={{display:"flex",gap:8,marginTop:4}}>
            <button onClick={confirmar} style={{flex:1,padding:"12px",background:C.red,color:C.white,border:"none",borderRadius:8,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:ff}}>
              ✅ Confirmar e gerar
            </button>
            <button onClick={()=>setStep(1)} style={{padding:"12px 16px",background:C.white,color:C.text2,border:`1.5px solid ${C.gray3}`,borderRadius:8,fontSize:13,cursor:"pointer",fontFamily:ff}}>
              ← Voltar
            </button>
          </div>
        </>
      )}

      {/* ── STEP 3 ── */}
      {step===3&&(
        <>
          {copied&&card(
            <div style={{textAlign:"center",color:C.green,fontWeight:700,fontSize:13}}>
              ✅ Copiado! Cole no início do <code style={{fontSize:11}}>{targetFile}</code> no GitHub → Commit ✅
            </div>
          )}
          {card(
            <>
              <div style={{fontSize:12,fontWeight:700,color:C.navy,marginBottom:6}}>Resultado formatado</div>
              <div style={{fontSize:11,color:C.text2,background:C.navy2,borderRadius:8,padding:"8px 10px",marginBottom:10,lineHeight:1.5}}>
                Próximo passo: <strong>Copiar</strong> → GitHub →{" "}
                <code style={{fontSize:10,background:"#dce8f7",padding:"1px 4px",borderRadius:4}}>{targetFile}</code>
                {" "}→ lápis ✏️ → colar no <strong>início</strong> → Commit ✅
              </div>
              <div style={{display:"flex",gap:8,marginBottom:10}}>
                <button onClick={copiar} style={{flex:1,padding:"10px",background:C.green,color:C.white,border:"none",borderRadius:8,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:ff}}>
                  📋 Copiar tudo
                </button>
                <button onClick={baixar} style={{padding:"10px 14px",background:C.navy,color:C.white,border:"none",borderRadius:8,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:ff}}>⬇</button>
                <button onClick={reset} style={{padding:"10px 14px",background:C.white,color:C.text2,border:`1.5px solid ${C.gray3}`,borderRadius:8,fontSize:13,cursor:"pointer",fontFamily:ff}}>↺</button>
              </div>
            </>
          )}
          <div style={{background:"#1e1e2e",borderRadius:12,padding:"14px 16px",fontFamily:"'DM Mono',monospace",
            fontSize:11.5,color:"#cdd6f4",whiteSpace:"pre-wrap",wordBreak:"break-all",lineHeight:1.8,maxHeight:400,overflowY:"auto"}}>
            {output.split("\n").map((l,i) => {
              if (l==="---") return <div key={i} style={{color:"#f38ba8",fontWeight:700}}>---</div>;
              const keys = isAula
                ? ["DATA:","PROFESSOR:","PERIODO:","MATERIA:"]
                : ["DATA:","TITULO:","AUTOR:","CATEGORIA:","CONTEUDO:"];
              if (keys.some(k=>l.startsWith(k))) {
                const colon = l.indexOf(":");
                return <div key={i}><span style={{color:"#cba6f7"}}>{l.slice(0,colon+1)}</span>{l.slice(colon+1)}</div>;
              }
              return <div key={i}>{l}</div>;
            })}
          </div>
        </>
      )}

    </div>
  );
}

export default function App() {
  const [user,setUser]=useState(()=>{ try{return JSON.parse(sessionStorage.getItem("sb_u"))||null;}catch{return null;} });
  const [tab,setTab]=useState("home");
  const [taskFilter,setTaskFilter]=useState("pending");
  const [annFilter,setAnnFilter]=useState("all");
  const [tasks,setTasks]=useState(()=>loadTasks());
  const [search,setSearch]=useState("");
  const [subjFilter,setSubjFilter]=useState("all");
  const [dark,setDark]=useState(()=>{ try{return localStorage.getItem("mb_dark")==="1";}catch{return false;} });

  // ── apply theme ──
  C = dark ? DARK : LIGHT;
  const sh  = dark ? "0 1px 3px rgba(0,0,0,.3),0 4px 12px rgba(0,0,0,.2)"  : "0 1px 3px rgba(0,0,0,.08),0 4px 12px rgba(0,0,0,.04)";
  const shm = dark ? "0 2px 8px rgba(0,0,0,.4),0 8px 24px rgba(0,0,0,.3)"  : "0 2px 8px rgba(0,0,0,.10),0 8px 24px rgba(0,0,0,.06)";

  function toggleDark() {
    setDark(d => {
      const next = !d;
      try { localStorage.setItem("mb_dark", next?"1":"0"); } catch {}
      return next;
    });
  }

  function login(u){sessionStorage.setItem("sb_u",JSON.stringify(u));setUser(u);}
  function logout(){sessionStorage.removeItem("sb_u");setUser(null);}
  function toggleTask(id){
    if (String(id).startsWith("com_")) {
      setTasks(prev => {
        const exists = prev.find(t => t.id === id);
        if (exists) {
          const next = prev.map(t => t.id===id ? {...t, status:t.status==="done"?"pending":"done"} : t);
          saveTasks(next); return next;
        }
        const comTask = COM_TASKS.find(t => t.id === id);
        if (!comTask) return prev;
        const next = [...prev, {...comTask, status:"done"}];
        saveTasks(next); return next;
      });
    } else {
      setTasks(prev=>{
        const next=prev.map(t=>t.id===id?{...t,status:t.status==="done"?"pending":"done"}:t);
        saveTasks(next); return next;
      });
    }
  }

  if(!user) return <Login onLogin={login}/>;

  // ── merge: manual tasks + comunicado-derived tasks (deduped by title) ──
  const manualTitles = new Set(tasks.map(t => t.title.toLowerCase().trim()));
  const newComTasks  = COM_TASKS.filter(t => !manualTitles.has(t.title.toLowerCase().trim()));
  const allTasks     = [...tasks, ...newComTasks];

  // ── task derived ──
  const enriched     = allTasks.map(t=>({...t,cs:cStatus(t)}));
  const pendingTasks = enriched.filter(t=>t.cs!=="done");
  const doneTasks    = enriched.filter(t=>t.cs==="done");
  const urgentTasks  = enriched.filter(t=>t.cs==="urgent"||t.cs==="overdue");
  const total=allTasks.length, doneCount=doneTasks.length;
  const pct=Math.round(doneCount/total*100);

  const shownTasks = taskFilter==="pending"
    ? [...pendingTasks].sort((a,b)=>{
        const o={overdue:0,urgent:1,pending:2},pa={high:0,medium:1,low:2};
        return((o[a.cs]??3)-(o[b.cs]??3))||((pa[a.priority]??3)-(pa[b.priority]??3))||a.due.localeCompare(b.due);
      })
    : taskFilter==="done" ? doneTasks
    : [...enriched].sort((a,b)=>a.due.localeCompare(b.due));

  // ── agenda grouped ──
  const grouped = LESSONS.reduce((acc,l)=>{ (acc[l.date]=acc[l.date]||[]).push(l); return acc; },{});

  // ── all unique subjects for filter ──
  const allSubjects = [...new Set(LESSONS.flatMap(l=>l.subjects.map(s=>s.name.split("–")[0].split("-")[0].trim())))].sort();

  // ── search results ──
  const searchQ = search.trim().toLowerCase();
  const searchResults = searchQ.length < 2 ? [] : [
    ...LESSONS.flatMap(l=>l.subjects
      .filter(s=>s.name.toLowerCase().includes(searchQ)||s.detail.toLowerCase().includes(searchQ))
      .map(s=>({type:"aula",date:l.date,teacher:l.teacher,period:l.period,subject:s}))),
    ...ANNOUNCEMENTS
      .filter(a=>a.title?.toLowerCase().includes(searchQ)||a.content?.toLowerCase().includes(searchQ)||a.author?.toLowerCase().includes(searchQ))
      .map(a=>({type:"comunicado",ann:a})),
    ...enriched
      .filter(t=>t.title.toLowerCase().includes(searchQ)||t.desc.toLowerCase().includes(searchQ))
      .map(t=>({type:"tarefa",task:t})),
  ];

  // ── comunicados ──
  const shownAnn = annFilter==="all" ? ANNOUNCEMENTS : ANNOUNCEMENTS.filter(a=>a.category===annFilter);

  // ── upcoming: merge calendar + announcements (avaliacao + tarefa) ──
  const upcoming = (() => {
    const today = todayISO();
    const toISO = (d) => {
      if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
      const p = d.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
      if (p) return p[3]+"-"+p[2].padStart(2,"0")+"-"+p[1].padStart(2,"0");
      return null;
    };
    const fmtD = (iso) => { const [,m,d]=iso.split("-"); return parseInt(d)+"/"+m; };
    const dayN = (iso) => ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"][new Date(iso+"T12:00:00").getDay()];
    const calEvents = CALENDARIO
      .filter(e=>e.date>=today)
      .map(e=>({iso:e.date,label:e.title,sub:dayN(e.date),hot:e.category==="evento"}));
    const annEvents = ANNOUNCEMENTS
      .filter(a=>a.category==="avaliacao"||a.category==="tarefa")
      .map(a=>({...a,iso:toISO(a.date)}))
      .filter(a=>a.iso&&a.iso>=today)
      .map(a=>({iso:a.iso,label:a.title,sub:a.author,hot:a.category==="avaliacao"}));
    return [...calEvents,...annEvents]
      .sort((a,b)=>a.iso.localeCompare(b.iso))
      .filter((e,i,arr)=>i===0||e.iso!==arr[i-1].iso||e.label!==arr[i-1].label)
      .slice(0,8)
      .map(e=>({date:fmtD(e.iso),label:e.label,sub:e.sub,hot:e.hot}));
  })();

  const isAdmin = user.username === "admin";

  const TABS=[
    {id:"home",   label:"Início",   icon:"🏠"},
    {id:"agenda", label:"Agenda",   icon:"📅"},
    {id:"tasks",  label:"Tarefas",  icon:"✅"},
    {id:"com",    label:"Avisos",   icon:"📢"},
    ...(isAdmin ? [{id:"fmt", label:"Formatar", icon:"⚙️"}] : []),
  ];

  // ── greeting msg ──
  const greetMsg = urgentTasks.length>0
    ? `🚨 ${urgentTasks.length} tarefa${urgentTasks.length>1?"s":""} urgente${urgentTasks.length>1?"s":""}!`
    : pendingTasks.length===0 ? "✅ Tudo em dia! Ótimo trabalho."
    : `${pendingTasks.length} tarefa${pendingTasks.length>1?"s":""} pendente${pendingTasks.length>1?"s":""}`;

  return (
    <div style={{fontFamily:ff,minHeight:"100vh",background:C.bg,paddingBottom:76,transition:"background .3s"}}>

      {/* ── TOP BAR ── */}
      <div style={{background:C.topbar,borderBottom:`3px solid ${C.red}`,position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 8px rgba(0,0,0,.2)"}}>
        <div style={{maxWidth:430,margin:"0 auto",padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,borderRadius:"50%",background:C.red,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🐻</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:800,fontSize:14,color:C.topbarText,lineHeight:1.2}}>Maple Bear · Big Bears</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.45)"}}>Mateus Larocca · Year 4</div>
          </div>
          {pendingTasks.length>0&&(
            <div style={{background:C.red,color:"#fff",borderRadius:20,padding:"3px 10px",fontSize:12,fontWeight:700,flexShrink:0}}>
              {pendingTasks.length} pendente{pendingTasks.length>1?"s":""}
            </div>
          )}
          {/* dark mode toggle */}
          <button onClick={toggleDark} title={dark?"Modo claro":"Modo escuro"}
            style={{background:"rgba(255,255,255,.12)",border:"none",borderRadius:8,padding:"5px 8px",cursor:"pointer",fontSize:16,lineHeight:1,flexShrink:0,transition:"background .2s"}}>
            {dark?"☀️":"🌙"}
          </button>
          <button onClick={logout} style={{background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",color:"rgba(255,255,255,.8)",borderRadius:7,padding:"5px 10px",fontSize:11,cursor:"pointer",fontFamily:ff,fontWeight:600,flexShrink:0}}>Sair</button>
        </div>
      </div>

      <div style={{maxWidth:430,margin:"0 auto",padding:"14px 14px 0"}}>

        {/* ══════════════ HOME ══════════════ */}
        {tab==="home"&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>

            {/* greeting card */}
            <div style={{background:C.navy,borderRadius:14,padding:16,boxShadow:shm,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",right:-20,top:-20,width:100,height:100,borderRadius:"50%",background:"rgba(192,57,43,.2)",pointerEvents:"none"}}/>
              <div style={{position:"absolute",right:20,bottom:-30,width:70,height:70,borderRadius:"50%",background:"rgba(255,255,255,.05)",pointerEvents:"none"}}/>
              <div style={{fontSize:10,color:"rgba(255,255,255,.45)",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:2}}>Boa tarde, família</div>
              <div style={{fontSize:22,fontWeight:800,color:C.white,lineHeight:1.1,marginBottom:6}}>Agenda do Mateus</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,.6)",marginBottom:14,lineHeight:1.4}}>{greetMsg}</div>
              <div style={{display:"flex",gap:8}}>
                {[
                  {n:pendingTasks.length,l:"Pendentes"},
                  {n:urgentTasks.length, l:"Urgentes"},
                  {n:doneCount,          l:"Concluídas"},
                ].map((s,i)=>(
                  <div key={i} style={{flex:1,background:"rgba(255,255,255,.1)",borderRadius:8,padding:"8px 10px"}}>
                    <div style={{fontSize:20,fontWeight:800,color:C.white,lineHeight:1}}>{s.n}</div>
                    <div style={{fontSize:10,color:"rgba(255,255,255,.5)",marginTop:2}}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* weekly progress */}
            <div style={{background:C.white,borderRadius:12,padding:"13px 16px",boxShadow:sh}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div style={{fontSize:13,fontWeight:700,color:C.navy}}>📊 Progresso da semana</div>
                <div style={{fontSize:13,fontWeight:800,color:pct===100?C.green:C.navy}}>{pct}%</div>
              </div>
              <div style={{background:C.gray3,borderRadius:99,height:10,overflow:"hidden"}}>
                <div style={{width:`${pct}%`,height:"100%",background:pct===100?C.green:C.red,borderRadius:99,transition:"width .7s cubic-bezier(.4,0,.2,1)"}}/>
              </div>
              <div style={{fontSize:11,color:C.text3,marginTop:6}}>{doneCount} de {total} tarefas concluídas</div>
            </div>

            {/* urgent alerts */}
            {urgentTasks.length>0&&(
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                {urgentTasks.map(t=>(
                  <div key={t.id} style={{background:"#fff5f5",borderLeft:`3px solid ${C.red}`,borderRadius:"0 8px 8px 0",padding:"9px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:12,color:C.red,fontWeight:600,flex:1,paddingRight:8}}>🚨 {t.title}</span>
                    <span style={{fontSize:11,fontWeight:700,color:C.red,background:C.red3,padding:"2px 8px",borderRadius:99,flexShrink:0}}>{daysLabel(t.due)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* upcoming events */}
            <div style={{background:C.white,borderRadius:12,overflow:"hidden",boxShadow:sh}}>
              <div style={{background:C.navy,padding:"10px 16px"}}>
                <span style={{color:C.white,fontWeight:800,fontSize:13,textTransform:"uppercase",letterSpacing:.5}}>📅 Próximos Eventos</span>
              </div>
              <div style={{padding:"10px 16px"}}>
                {upcoming.map((ev,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<upcoming.length-1?`1px solid ${C.gray2}`:"none"}}>
                    <div style={{minWidth:48,background:ev.hot?C.red:C.navy2,color:ev.hot?C.white:C.navy,borderRadius:7,padding:"5px 6px",textAlign:"center",fontSize:11,fontWeight:700,lineHeight:1.3,flexShrink:0}}>{ev.date}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,color:ev.hot?C.red:C.text,fontWeight:ev.hot?700:400}}>{ev.label}</div>
                      {ev.sub&&<div style={{fontSize:11,color:C.text3}}>{ev.sub}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* what learned today — auto from aulas.txt for today */}
            {(()=>{
              const today = todayISO();
              const todayLessons = LESSONS.filter(l=>l.date===today);
              const allSubjects = todayLessons.flatMap(l=>l.subjects);
              if (allSubjects.length===0) return null;
              return (
                <div style={{background:`linear-gradient(135deg,${C.navy2},${C.white})`,border:`1px solid ${C.gray3}`,borderRadius:12,padding:"14px 16px"}}>
                  <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:C.navy,marginBottom:10}}>📚 O que Mateus aprendeu hoje</div>
                  {allSubjects.map((s,i)=>(
                    <div key={i} style={{display:"flex",gap:8,marginBottom:7,alignItems:"flex-start"}}>
                      <div style={{width:6,height:6,borderRadius:"50%",background:C.red,flexShrink:0,marginTop:5}}/>
                      <div style={{fontSize:12,color:C.text,lineHeight:1.5}}>
                        <strong>{s.name}</strong>
                        {s.detail && s.detail!==s.name && <span style={{color:C.text2}}> — {s.detail.slice(0,120)}{s.detail.length>120?"...":""}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* study today — urgent/overdue tasks */}
            {(()=>{
              const studyItems = enriched
                .filter(t=>t.cs==="urgent"||t.cs==="overdue")
                .slice(0,4);
              if (studyItems.length===0) return null;
              return (
                <div style={{background:C.amber2,border:"1px solid #fde68a",borderRadius:12,padding:"12px 14px"}}>
                  <div style={{fontSize:11,fontWeight:700,color:C.amber,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>⚡ O que estudar hoje</div>
                  {studyItems.map((t,i)=>(
                    <div key={i} style={{display:"flex",gap:6,marginBottom:i<studyItems.length-1?6:0,fontSize:12,color:"#78350f",lineHeight:1.45}}>
                      <span>{CAT_META[t.category]?.icon||"📋"}</span>
                      <span><strong>{t.title}</strong> — {t.desc.slice(0,80)}{t.desc.length>80?"...":""}</span>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* tomorrow — auto from aulas.txt */}
            {(()=>{
              const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate()+1);
              const tISO = tomorrow.toISOString().split("T")[0];
              const tmrLessons = LESSONS.filter(l=>l.date===tISO);
              const tmrSubjects = tmrLessons.flatMap(l=>l.subjects);
              if (tmrSubjects.length===0) return null;
              const [,tm,td] = tISO.split("-");
              return (
                <div style={{background:C.white,borderRadius:12,padding:"13px 16px",boxShadow:sh}}>
                  <div style={{fontSize:12,fontWeight:700,color:C.navy,textTransform:"uppercase",letterSpacing:.5,marginBottom:10}}>
                    🌅 O que vem amanhã ({parseInt(td)}/{tm})
                  </div>
                  {tmrSubjects.map((s,i,arr)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<arr.length-1?`1px solid ${C.gray2}`:"none"}}>
                      <div style={{minWidth:36,textAlign:"center",fontSize:18,flexShrink:0}}>{s.icon}</div>
                      <div>
                        <div style={{fontSize:13,color:C.text,fontWeight:600}}>{s.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}

          </div>
        )}

        {/* ══════════════ AGENDA ══════════════ */}
        {tab==="agenda"&&(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>

            {/* ── SEARCH BAR ── */}
            <div style={{position:"relative"}}>
              <input
                value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="🔍 Buscar aulas, comunicados, tarefas..."
                style={{width:"100%",padding:"11px 36px 11px 14px",border:`1.5px solid ${search?C.red:C.gray3}`,borderRadius:10,fontSize:13,fontFamily:ff,outline:"none",background:C.white,color:C.text,boxShadow:sh}}
              />
              {search&&<button onClick={()=>setSearch("")} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:16,color:C.text3,padding:0}}>✕</button>}
            </div>

            {/* ── SEARCH RESULTS ── */}
            {searchQ.length>=2&&(
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                <div style={{fontSize:12,fontWeight:700,color:C.text2}}>{searchResults.length} resultado{searchResults.length!==1?"s":""} para "{search}"</div>
                {searchResults.length===0
                  ?<div style={{background:C.white,borderRadius:10,padding:"20px",textAlign:"center",color:C.text2,fontSize:13,boxShadow:sh}}>Nenhum resultado encontrado.</div>
                  :searchResults.map((r,i)=>{
                    if (r.type==="aula") return (
                      <div key={i} style={{background:C.white,borderRadius:10,padding:"12px 14px",boxShadow:sh,borderLeft:`3px solid ${C.navy}`}}>
                        <div style={{fontSize:11,color:C.text3,marginBottom:4}}>{dayName(r.date)}, {fmtShort(r.date)} · {r.teacher} · {r.period}</div>
                        <div style={{fontSize:13,fontWeight:700,color:C.navy}}>{r.subject.icon} {r.subject.name}</div>
                        <div style={{fontSize:12,color:C.text2,marginTop:3,lineHeight:1.5}}>{r.subject.detail.slice(0,120)}{r.subject.detail.length>120?"...":""}</div>
                      </div>
                    );
                    if (r.type==="comunicado") { const c=ANN_CAT[r.ann.category]||ANN_CAT.aviso; return (
                      <div key={i} style={{background:C.white,borderRadius:10,padding:"12px 14px",boxShadow:sh,borderLeft:`3px solid ${c.color}`}}>
                        <div style={{fontSize:11,color:C.text3,marginBottom:4}}>{r.ann.date} · {r.ann.author}</div>
                        <div style={{fontSize:13,fontWeight:700,color:C.navy}}>{r.ann.title}</div>
                        <div style={{fontSize:12,color:C.text2,marginTop:3,lineHeight:1.5}}>{r.ann.content?.slice(0,100)}{r.ann.content?.length>100?"...":""}</div>
                      </div>
                    );}
                    return (
                      <div key={i} style={{background:C.white,borderRadius:10,padding:"12px 14px",boxShadow:sh,borderLeft:`3px solid ${C.amber}`}}>
                        <div style={{fontSize:11,color:C.text3,marginBottom:4}}>Tarefa · {fmtLong(r.task.due)}</div>
                        <div style={{fontSize:13,fontWeight:700,color:C.navy}}>{r.task.title}</div>
                        <div style={{fontSize:12,color:C.text2,marginTop:3,lineHeight:1.5}}>{r.task.desc.slice(0,100)}{r.task.desc.length>100?"...":""}</div>
                      </div>
                    );
                  })
                }
              </div>
            )}

            {/* ── SUBJECT FILTER ── */}
            {!searchQ&&(
              <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4}}>
                <button onClick={()=>setSubjFilter("all")} style={{padding:"5px 12px",borderRadius:20,fontSize:11,fontWeight:700,border:"none",background:subjFilter==="all"?C.navy:C.gray2,color:subjFilter==="all"?C.white:C.text2,cursor:"pointer",fontFamily:ff,flexShrink:0}}>Todas</button>
                {allSubjects.slice(0,8).map(s=>(
                  <button key={s} onClick={()=>setSubjFilter(subjFilter===s?"all":s)} style={{padding:"5px 12px",borderRadius:20,fontSize:11,fontWeight:700,border:"none",background:subjFilter===s?C.navy:C.gray2,color:subjFilter===s?C.white:C.text2,cursor:"pointer",fontFamily:ff,flexShrink:0,whiteSpace:"nowrap"}}>{s}</button>
                ))}
              </div>
            )}

            {/* ── LESSON DAYS ── */}
            {!searchQ&&Object.entries(grouped).sort((a,b)=>b[0].localeCompare(a[0])).map(([date,lessons])=>{
              const today = todayISO();
              const isToday = date===today;
              const filtered = lessons.map(l=>({
                ...l,
                subjects: subjFilter==="all" ? l.subjects : l.subjects.filter(s=>s.name.split("–")[0].split("-")[0].trim()===subjFilter)
              })).filter(l=>l.subjects.length>0);
              if (filtered.length===0) return null;
              return (
                <div key={date} style={{marginBottom:4}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                    <div style={{background:isToday?C.red:C.navy,color:C.white,borderRadius:8,padding:"5px 14px",fontSize:12,fontWeight:700,flexShrink:0,display:"flex",alignItems:"center",gap:6}}>
                      {isToday&&<span style={{fontSize:10}}>●</span>}
                      {dayName(date)}, {fmtShort(date)}
                      {isToday&&<span style={{fontSize:10,background:"rgba(255,255,255,.25)",padding:"1px 6px",borderRadius:99}}>Hoje</span>}
                    </div>
                    <div style={{flex:1,height:1,background:C.gray3}}/>
                  </div>
                  {filtered.map(lesson=>(
                    <div key={lesson.id} style={{background:C.white,borderRadius:12,marginBottom:10,overflow:"hidden",boxShadow:sh,border:isToday?`1.5px solid ${C.red}`:"none"}}>
                      <div style={{background:lesson.period==="manhã"?"#fffbf0":"#f5f8ff",padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${C.gray2}`}}>
                        <div style={{fontSize:13,fontWeight:700,color:C.navy}}>{lesson.teacher}</div>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <div style={{fontSize:11,fontWeight:700,padding:"3px 11px",borderRadius:20,background:lesson.period==="manhã"?"#fff3cd":C.navy3,color:lesson.period==="manhã"?"#a0720a":C.navy}}>
                            {lesson.period==="manhã"?"☀️ Manhã":"🌤 Tarde"}
                          </div>
                          <div style={{fontSize:10,color:C.text3}}>{lesson.subjects.length} mat.</div>
                        </div>
                      </div>
                      <div style={{padding:"14px 16px 4px"}}>
                        {lesson.subjects.map((s,i)=><SubjectRow key={i} s={s} highlight={subjFilter!=="all"?subjFilter:""}/>)}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {/* ══════════════ TAREFAS ══════════════ */}
        {tab==="tasks"&&(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>

            {/* progress card */}
            <div style={{background:C.white,borderRadius:12,padding:"13px 16px",boxShadow:sh}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
                <div style={{fontSize:13,fontWeight:700,color:C.navy}}>📊 Progresso geral</div>
                <div style={{fontSize:13,fontWeight:800,color:pct===100?C.green:C.navy}}>{doneCount}/{total} · {pct}%</div>
              </div>
              <div style={{background:C.gray3,borderRadius:99,height:10,overflow:"hidden"}}>
                <div style={{width:`${pct}%`,height:"100%",background:pct===100?C.green:C.red,borderRadius:99,transition:"width .6s ease"}}/>
              </div>
              <div style={{display:"flex",gap:10,marginTop:10}}>
                {[{n:pendingTasks.length,l:"Pendentes",col:C.red},{n:urgentTasks.length,l:"Urgentes",col:"#e67e22"},{n:doneCount,l:"Concluídas",col:C.green}].map((s,i)=>(
                  <div key={i} style={{flex:1,textAlign:"center",background:C.gray,borderRadius:8,padding:"7px 4px"}}>
                    <div style={{fontSize:18,fontWeight:900,color:s.col,lineHeight:1}}>{s.n}</div>
                    <div style={{fontSize:10,color:C.text2,fontWeight:600,marginTop:3}}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* urgent box */}
            {urgentTasks.length>0&&(
              <div style={{background:"#fff5f5",border:`2px solid ${C.red}`,borderRadius:12,padding:"11px 14px"}}>
                <div style={{fontSize:13,fontWeight:800,color:C.red,marginBottom:7}}>🚨 Atenção necessária</div>
                {urgentTasks.map(t=>(
                  <div key={t.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0",borderBottom:`1px solid ${C.red3}`}}>
                    <div style={{fontSize:13,color:C.text,fontWeight:600,flex:1,paddingRight:8}}>{t.title}</div>
                    <div style={{fontSize:11,fontWeight:700,color:t.cs==="overdue"?C.red:"#e67e22",flexShrink:0}}>{daysLabel(t.due)}</div>
                  </div>
                ))}
              </div>
            )}

            {/* filter bar */}
            <div style={{display:"flex",gap:6,background:C.white,borderRadius:12,padding:10,boxShadow:sh}}>
              {[["pending","Pendentes"],["done","Concluídas"],["all","Todas"]].map(([id,lbl])=>(
                <button key={id} onClick={()=>setTaskFilter(id)} style={{flex:1,padding:"9px 4px",borderRadius:8,border:"none",background:taskFilter===id?C.red:C.gray,color:taskFilter===id?C.white:C.text2,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:ff,transition:"all .15s"}}>
                  {lbl}{id==="pending"&&pendingTasks.length>0&&<span style={{marginLeft:4,background:taskFilter==="pending"?"rgba(255,255,255,.3)":C.red,color:C.white,borderRadius:10,padding:"1px 5px",fontSize:10}}>{pendingTasks.length}</span>}
                </button>
              ))}
            </div>

            {shownTasks.length===0
              ?<div style={{background:C.white,borderRadius:12,padding:28,textAlign:"center",color:C.text2,fontSize:14,boxShadow:sh}}>
                {taskFilter==="done"?"Nenhuma tarefa concluída ainda.":"✅ Tudo em dia!"}
               </div>
              :shownTasks.map(t=><TaskCard key={t.id} task={t} onToggle={toggleTask}/>)
            }
          </div>
        )}

        {/* ══════════════ COMUNICADOS ══════════════ */}
        {tab==="com"&&(
          <div style={{display:"flex",flexDirection:"column",gap:0}}>
            <div style={{position:"relative",marginBottom:12}}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Buscar comunicados..."
                style={{width:"100%",padding:"11px 36px 11px 14px",border:`1.5px solid ${search?C.red:C.gray3}`,borderRadius:10,fontSize:13,fontFamily:ff,outline:"none",background:C.white,color:C.text,boxShadow:sh}}/>
              {search&&<button onClick={()=>setSearch("")} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:16,color:C.text3,padding:0}}>✕</button>}
            </div>
            {!search&&(
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
                {[["all","Todos"],...Object.entries(ANN_CAT).map(([id,c])=>[id,c.label])].map(([id,lbl])=>(
                  <button key={id} onClick={()=>setAnnFilter(id)} style={{padding:"5px 12px",borderRadius:20,fontSize:12,fontWeight:700,border:annFilter===id?`2px solid ${C.red}`:"1.5px solid "+C.gray3,background:annFilter===id?C.red:C.white,color:annFilter===id?C.white:C.text2,cursor:"pointer",fontFamily:ff,transition:"all .15s"}}>
                    {lbl}
                  </button>
                ))}
              </div>
            )}
            {(search
              ? ANNOUNCEMENTS.filter(a=>a.title?.toLowerCase().includes(search.toLowerCase())||a.content?.toLowerCase().includes(search.toLowerCase())||a.author?.toLowerCase().includes(search.toLowerCase()))
              : shownAnn
            ).map((ann,idx)=>{
              const c=ANN_CAT[ann.category]||ANN_CAT.aviso;
              return (<AnnCard key={ann.id??idx} ann={ann} c={c}/>);
            })}
          </div>
        )}

        {/* ══════════════ FORMATADOR (admin only) ══════════════ */}
        {tab==="fmt" && isAdmin && <Formatador/>}

      </div>

      {/* ══ BOTTOM NAV ══ */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:C.card,borderTop:`1px solid ${C.border}`,display:"flex",zIndex:100,boxShadow:dark?"0 -4px 16px rgba(0,0,0,.4)":"0 -4px 16px rgba(0,0,0,.08)"}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"10px 4px 8px",border:"none",background:"transparent",cursor:"pointer",fontFamily:ff,display:"flex",flexDirection:"column",alignItems:"center",gap:3,position:"relative"}}>
            {/* active bar */}
            <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:24,height:2,background:C.red,borderRadius:"0 0 2px 2px",opacity:tab===t.id?1:0,transition:"opacity .15s"}}/>
            {/* task dot badge */}
            {t.id==="tasks"&&pendingTasks.length>0&&(
              <div style={{position:"absolute",top:7,right:"calc(50% - 18px)",width:15,height:15,background:C.red,borderRadius:"50%",fontSize:9,fontWeight:900,color:C.white,display:"flex",alignItems:"center",justifyContent:"center"}}>{pendingTasks.length}</div>
            )}
            <span style={{fontSize:20}}>{t.icon}</span>
            <span style={{fontSize:10,fontWeight:tab===t.id?800:400,color:tab===t.id?C.red:C.text3}}>{t.label}</span>
          </button>
        ))}
      </div>

    </div>
  );
}
