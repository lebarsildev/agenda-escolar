import { useState } from "react";
import { parseAulas, parseComunicados } from "./parseData";

// ─── Import data files as raw text (Vite feature: ?raw)
// To update content: edit these two files and push to GitHub.
// The app will automatically reflect the changes on next deploy.
import aulasRaw      from "./data/aulas.txt?raw";
import comunicadosRaw from "./data/comunicados.txt?raw";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const RED  = "#c0392b";
const NAVY = "#1a2e4a";
const WHITE = "#ffffff";
const GRAY  = "#f4f5f7";
const TEXT  = "#1a1a1a";
const MUTED = "#666";
const LIGHT = "#aaa";

const USERS = [
  { username: "responsavel", password: "mateus2026", name: "Família Larocca" },
  { username: "admin",       password: "escola2026", name: "Coordenação"     },
];

// ─── DEFAULT TASKS ────────────────────────────────────────────────────────────
// These are the seed tasks. Once saved to localStorage they persist.
// To add/edit tasks update this list AND bump TASKS_VERSION below.
const TASKS_VERSION = "v4";
const DEFAULT_TASKS = [
  { id:1, title:"Avaliação ELA – Poema Diamante",           description:"Revisar estrutura de 7 versos: substantivo, adjetivos, verbos, substantivos, verbos, adjetivos, sinônimo. Ortografia e letra legível serão avaliados.", due:"2026-04-16", priority:"high",   category:"avaliacao",    status:"pending" },
  { id:2, title:"AV2 Língua Portuguesa – Texto Narrativo",  description:"Escrever história com cooperação/gentileza. Usar roteiro obrigatório, diálogos com travessão e verbos dicendi variados (exclamou, sugeriu, cochichou...).", due:"2026-04-17", priority:"high",   category:"avaliacao",    status:"pending" },
  { id:3, title:"Math Challenge (AV2)",                     description:"Revisar: estimativas, arredondamento (dezena/centena/milhar), valor posicional, comparação e ordenação de números, adições com reagrupamento.", due:"2026-04-17", priority:"high",   category:"avaliacao",    status:"pending" },
  { id:4, title:"Two-Minute Talk – Apresentação do poema",  description:"Mateus apresenta com Rafael e Alice. Ler os poemas, responder o SLM e treinar a apresentação oral para a turma.", due:"2026-04-17", priority:"medium", category:"apresentacao", status:"pending" },
  { id:5, title:"Leitura no App Árvore",                    description:"Realizar a leitura dos livros enviados no aplicativo Árvore.", due:"2026-04-17", priority:"medium", category:"tarefa",       status:"pending" },
  { id:6, title:"Enviar livro \"Era uma vez Dom Quixote\"",  description:"Enviar etiquetado com o nome do aluno para a Unidade 2 de PLA.", due:"2026-04-14", priority:"high",   category:"tarefa",       status:"done"    },
  { id:7, title:"Leitura Calvin e Haroldo (pág. 140–165)",  description:"Leitura prévia fundamental para atividades em sala. O livro deve retornar à escola.", due:"2026-04-11", priority:"medium", category:"tarefa",       status:"done"    },
  { id:8, title:"Science Quiz (AV2)",                       description:"Revisar: habitat, comunidade, cadeia alimentar, adaptação estrutural e comportamental, camuflagem.", due:"2026-04-15", priority:"high",   category:"avaliacao",    status:"done"    },
  { id:9, title:"Avaliação de Artes (AV2)",                  description:"Desenho de carranca com expressão facial, sombras e profundidade com lápis de cor.", due:"2026-04-13", priority:"medium", category:"avaliacao",    status:"done"    },
];

// ─── STORAGE: tasks persist across page reloads via localStorage ──────────────
const STORAGE_KEY = `mb_tasks_${TASKS_VERSION}`;

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_TASKS;
}

function persistTasks(tasks) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); } catch {}
}

// ─── META ─────────────────────────────────────────────────────────────────────
const CAT_META = {
  avaliacao:    { label:"Avaliação",    icon:"📝", color: RED        },
  tarefa:       { label:"Tarefa",       icon:"📋", color: "#d35400"  },
  apresentacao: { label:"Apresentação", icon:"🎤", color: "#1a7abf"  },
};
const PRI_META = {
  high:   { label:"Alta",  color: RED,       dot:"🔴" },
  medium: { label:"Média", color: "#d35400", dot:"🟡" },
  low:    { label:"Baixa", color: "#27ae60", dot:"🟢" },
};
const ANN_CAT = {
  avaliacao:  { label:"Avaliação",  color: RED,       bg:"#fdf2f2" },
  tarefa:     { label:"Tarefa",     color: "#b9770e", bg:"#fef9ee" },
  aviso:      { label:"Aviso",      color: NAVY,      bg:"#f0f4fa" },
  calendario: { label:"Calendário", color: "#6c3483", bg:"#f8f4fd" },
  atividade:  { label:"Atividade",  color: "#1e8449", bg:"#f0faf4" },
};
const STATUS_STYLE = {
  done:    { bg:"#f0faf4", border:"#27ae60", badgeBg:"#27ae60", badge:"✓ Concluído" },
  overdue: { bg:"#fff5f5", border: RED,      badgeBg: RED,      badge:"⚠ Atrasado"  },
  urgent:  { bg:"#fff8f0", border:"#e67e22", badgeBg:"#e67e22", badge:"🔥 Urgente"   },
  pending: { bg: WHITE,    border:"#e0e0e0", badgeBg: NAVY,     badge:"● Pendente"  },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function todayISO() { return new Date().toISOString().split("T")[0]; }

function computeStatus(task) {
  if (task.status === "done") return "done";
  const diff = (new Date(task.due) - new Date(todayISO())) / 86400000;
  if (diff < 0)   return "overdue";
  if (diff <= 2)  return "urgent";
  return "pending";
}

function fmtDateShort(d) {
  // d = YYYY-MM-DD
  const [, m, day] = d.split("-");
  return `${parseInt(day)}/${m}`;
}

function fmtDateLong(d) {
  const months = ["","Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  const [, m, day] = d.split("-");
  return `${parseInt(day)} ${months[parseInt(m)]}`;
}

function dayName(d) {
  return ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"][new Date(d + "T12:00:00").getDay()];
}

function daysUntilLabel(d) {
  const diff = Math.ceil((new Date(d) - new Date(todayISO())) / 86400000);
  if (diff < 0)  return `${Math.abs(diff)}d atrasado`;
  if (diff === 0) return "Hoje!";
  if (diff === 1) return "Amanhã";
  return `${diff} dias`;
}

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [show, setShow] = useState(false);
  const [err,  setErr]  = useState("");
  const [busy, setBusy] = useState(false);

  function submit() {
    if (!u || !p) { setErr("Preencha todos os campos."); return; }
    setBusy(true); setErr("");
    setTimeout(() => {
      const found = USERS.find(x => x.username === u && x.password === p);
      if (found) onLogin(found);
      else { setErr("Usuário ou senha incorretos."); setBusy(false); }
    }, 600);
  }

  const inp = (extra = {}) => ({
    style: {
      width:"100%", border:`1.5px solid ${err ? RED : "#ddd"}`, borderRadius:8,
      padding:"11px 14px", fontSize:14, outline:"none", fontFamily:"inherit",
      boxSizing:"border-box", color: TEXT, background:"#fafafa", ...extra
    }
  });

  return (
    <div style={{ minHeight:"100vh", background:GRAY, fontFamily:"'Georgia',serif", display:"flex", flexDirection:"column" }}>
      {/* Bar */}
      <div style={{ background:WHITE, borderBottom:`4px solid ${RED}`, padding:"14px 20px", display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:40, height:40, borderRadius:"50%", background:RED, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🐻</div>
        <div>
          <div style={{ fontWeight:800, fontSize:16, color:NAVY }}>Maple Bear Vila Valqueire</div>
          <div style={{ fontSize:11, color:LIGHT }}>The best of Canadian education for a global future</div>
        </div>
      </div>
      {/* Hero */}
      <div style={{ background:`linear-gradient(135deg,${NAVY} 0%,#2d4a6e 100%)`, padding:"40px 24px 36px", textAlign:"center", color:WHITE }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:"rgba(255,255,255,0.5)", marginBottom:8 }}>Big Bears · Year 4</div>
        <div style={{ fontSize:28, fontWeight:800, lineHeight:1.1, marginBottom:6 }}>Agenda Escolar</div>
        <div style={{ fontSize:13, color:"rgba(255,255,255,0.65)" }}>Acompanhe as atividades do Mateus</div>
        <div style={{ width:36, height:3, background:RED, margin:"14px auto 0", borderRadius:2 }} />
      </div>
      {/* Form */}
      <div style={{ flex:1, display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"24px 20px" }}>
        <div style={{ width:"100%", maxWidth:400 }}>
          <div style={{ background:WHITE, borderRadius:14, padding:"26px 22px", boxShadow:"0 4px 20px rgba(0,0,0,0.10)", border:"1px solid #e8e8e8" }}>
            <div style={{ fontSize:16, fontWeight:800, color:NAVY, marginBottom:4 }}>Bem-vindo de volta 👋</div>
            <div style={{ fontSize:13, color:MUTED, marginBottom:20 }}>Faça login para acessar a agenda</div>

            <div style={{ marginBottom:12 }}>
              <label style={{ fontSize:11, fontWeight:700, color:MUTED, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.8 }}>Usuário</label>
              <input value={u} onChange={e => { setU(e.target.value); setErr(""); }} onKeyDown={e => e.key==="Enter" && submit()} placeholder="Digite seu usuário" {...inp()} />
            </div>
            <div style={{ marginBottom:6 }}>
              <label style={{ fontSize:11, fontWeight:700, color:MUTED, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.8 }}>Senha</label>
              <div style={{ position:"relative" }}>
                <input type={show ? "text" : "password"} value={p} onChange={e => { setP(e.target.value); setErr(""); }} onKeyDown={e => e.key==="Enter" && submit()} placeholder="Digite sua senha" {...inp({ paddingRight:42 })} />
                <button onClick={() => setShow(!show)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:15, color:LIGHT, padding:0 }}>{show ? "🙈" : "👁"}</button>
              </div>
            </div>

            {err && <div style={{ background:"#fff0f0", border:"1px solid #fcc", borderRadius:7, padding:"8px 12px", fontSize:12, color:RED, margin:"10px 0" }}>⚠️ {err}</div>}

            <button onClick={submit} disabled={busy} style={{ width:"100%", padding:"13px", background:RED, color:WHITE, border:"none", borderRadius:9, fontSize:15, fontWeight:700, cursor: busy ? "not-allowed" : "pointer", fontFamily:"inherit", marginTop:16, opacity: busy ? 0.8 : 1, boxShadow:`0 4px 12px rgba(192,57,43,0.3)` }}>
              {busy ? "Entrando..." : "Entrar →"}
            </button>
          </div>
          <div style={{ textAlign:"center", marginTop:16, fontSize:11, color:"#ccc" }}>© 2026 Maple Bear Vila Valqueire</div>
        </div>
      </div>
    </div>
  );
}

// ─── SUBJECT ROW (expandable) ─────────────────────────────────────────────────
function SubjectRow({ s }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ borderBottom:"1px solid #f2f2f2", paddingBottom:10, marginBottom:10 }}>
      <button onClick={() => setOpen(!open)} style={{ width:"100%", background:"none", border:"none", cursor:"pointer", textAlign:"left", padding:0, display:"flex", alignItems:"flex-start", gap:10, fontFamily:"inherit" }}>
        <span style={{ fontSize:17, lineHeight:"22px", flexShrink:0 }}>{s.icon}</span>
        <div style={{ flex:1, fontSize:13, fontWeight:700, color:NAVY, lineHeight:1.35 }}>{s.name}</div>
        <span style={{ fontSize:10, color:LIGHT, marginTop:2, flexShrink:0, lineHeight:"22px" }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div style={{ marginTop:7, marginLeft:27, fontSize:13, color:MUTED, lineHeight:1.7, borderLeft:`3px solid ${RED}`, paddingLeft:11 }}>
          {s.detail}
        </div>
      )}
    </div>
  );
}

// ─── TASK CARD ────────────────────────────────────────────────────────────────
function TaskCard({ task, onToggle }) {
  const cs  = computeStatus(task);
  const st  = STATUS_STYLE[cs];
  const cat = CAT_META[task.category] || CAT_META.tarefa;
  const pri = PRI_META[task.priority]  || PRI_META.medium;

  return (
    <div style={{ background:st.bg, borderRadius:12, border:`1.5px solid ${st.border}`, padding:"13px 14px", marginBottom:9, opacity: cs==="done" ? 0.68 : 1, transition:"opacity 0.2s" }}>
      <div style={{ display:"flex", gap:11, alignItems:"flex-start" }}>
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          style={{ width:24, height:24, borderRadius:6, border:`2px solid ${cs==="done" ? "#27ae60" : st.border}`, background: cs==="done" ? "#27ae60" : "transparent", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0, marginTop:1, transition:"all 0.15s", padding:0 }}
        >
          {cs === "done" && <span style={{ color:WHITE, fontSize:13, fontWeight:900, lineHeight:1 }}>✓</span>}
        </button>

        <div style={{ flex:1, minWidth:0 }}>
          {/* Title + status badge */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, marginBottom:5 }}>
            <div style={{ fontSize:14, fontWeight:700, color: cs==="done" ? MUTED : TEXT, lineHeight:1.3, textDecoration: cs==="done" ? "line-through" : "none" }}>{task.title}</div>
            <div style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, background:st.badgeBg, color:WHITE, whiteSpace:"nowrap", flexShrink:0 }}>{st.badge}</div>
          </div>
          {/* Chips */}
          <div style={{ display:"flex", alignItems:"center", gap:7, flexWrap:"wrap", marginBottom: cs==="done" ? 0 : 6 }}>
            <span style={{ fontSize:11, background:"#f0f0f0", color:MUTED, padding:"2px 7px", borderRadius:20 }}>{cat.icon} {cat.label}</span>
            <span style={{ fontSize:11, color:pri.color, fontWeight:700 }}>{pri.dot} {pri.label}</span>
            <span style={{ fontSize:11, color: cs==="overdue" ? RED : cs==="urgent" ? "#e67e22" : MUTED, fontWeight: cs==="overdue"||cs==="urgent" ? 700 : 400 }}>
              📅 {fmtDateLong(task.due)} · {daysUntilLabel(task.due)}
            </span>
          </div>
          {/* Description only if not done */}
          {cs !== "done" && <div style={{ fontSize:12, color:MUTED, lineHeight:1.6 }}>{task.description}</div>}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("sb_u")) || null; } catch { return null; }
  });
  const [tab,        setTab]        = useState("agenda");
  const [taskFilter, setTaskFilter] = useState("pending");
  const [annFilter,  setAnnFilter]  = useState("all");

  // ── Tasks: loaded from localStorage, persisted on every change ──
  const [tasks, setTasks] = useState(() => loadTasks());

  function login(u)  { sessionStorage.setItem("sb_u", JSON.stringify(u)); setUser(u); }
  function logout()  { sessionStorage.removeItem("sb_u"); setUser(null); }

  function toggleTask(id) {
    setTasks(prev => {
      const next = prev.map(t =>
        t.id === id ? { ...t, status: t.status === "done" ? "pending" : "done" } : t
      );
      persistTasks(next); // 💾 save immediately to localStorage
      return next;
    });
  }

  // ── Parse data files ──
  const LESSONS       = parseAulas(aulasRaw);
  const ANNOUNCEMENTS = parseComunicados(comunicadosRaw);

  if (!user) return <Login onLogin={login} />;

  // ── Task derived state ──
  const enriched     = tasks.map(t => ({ ...t, computed: computeStatus(t) }));
  const pendingTasks = enriched.filter(t => t.computed !== "done");
  const doneTasks    = enriched.filter(t => t.computed === "done");
  const urgentTasks  = enriched.filter(t => t.computed === "urgent" || t.computed === "overdue");
  const total        = tasks.length;
  const doneCount    = doneTasks.length;
  const pct          = Math.round((doneCount / total) * 100);

  const shownTasks = taskFilter === "pending"
    ? [...pendingTasks].sort((a, b) => {
        const o  = { overdue:0, urgent:1, pending:2 };
        const pa = { high:0, medium:1, low:2 };
        return ((o[a.computed]??3) - (o[b.computed]??3))
            || ((pa[a.priority]??3) - (pa[b.priority]??3))
            || a.due.localeCompare(b.due);
      })
    : taskFilter === "done"
    ? doneTasks
    : [...enriched].sort((a, b) => a.due.localeCompare(b.due));

  // ── Agenda grouped by date ──
  const grouped = LESSONS.reduce((acc, l) => {
    (acc[l.date] = acc[l.date] || []).push(l);
    return acc;
  }, {});

  // ── Comunicados filtered ──
  const shownAnn = annFilter === "all"
    ? ANNOUNCEMENTS
    : ANNOUNCEMENTS.filter(a => a.category === annFilter);

  const TABS = [
    { id:"agenda",      label:"Agenda",      icon:"📅" },
    { id:"tasks",       label:"Tarefas",     icon:"✅" },
    { id:"comunicados", label:"Comunicados", icon:"📢" },
  ];

  // Upcoming events (can also come from comunicados.txt in future)
  const upcoming = [
    { date:"16/04", label:"Avaliação ELA – Poema Diamante",          hot:true  },
    { date:"17/04", label:"Math Challenge (AV2)",                    hot:true  },
    { date:"17/04", label:"AV2 Língua Portuguesa",                   hot:true  },
    { date:"17/04", label:"Two-Minute Talk: Mateus, Rafael e Alice", hot:false },
    { date:"20/04", label:"Sem aula",                                hot:false },
  ];

  return (
    <div style={{ fontFamily:"'Georgia',serif", minHeight:"100vh", background:GRAY, paddingBottom:76 }}>

      {/* ── TOP BAR ── */}
      <div style={{ background:WHITE, borderBottom:`4px solid ${RED}`, position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 8px rgba(0,0,0,0.07)" }}>
        <div style={{ maxWidth:640, margin:"0 auto", padding:"10px 14px", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:"50%", background:RED, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>🐻</div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:800, fontSize:14, color:NAVY, lineHeight:1.2 }}>Maple Bear · Big Bears</div>
            <div style={{ fontSize:11, color:LIGHT }}>Mateus Larocca · Year 4</div>
          </div>
          {pendingTasks.length > 0 && (
            <div style={{ background:RED, color:WHITE, borderRadius:20, padding:"3px 10px", fontSize:12, fontWeight:700, flexShrink:0 }}>
              {pendingTasks.length} pendente{pendingTasks.length > 1 ? "s" : ""}
            </div>
          )}
          <button onClick={logout} style={{ background:"none", border:"1.5px solid #e0e0e0", color:MUTED, borderRadius:7, padding:"5px 10px", fontSize:11, cursor:"pointer", fontFamily:"inherit", fontWeight:600, flexShrink:0 }}>Sair</button>
        </div>
      </div>

      <div style={{ maxWidth:640, margin:"0 auto", padding:"14px 14px 0" }}>

        {/* ════════════════════ AGENDA ════════════════════ */}
        {tab === "agenda" && (
          <div>
            {/* Próximos Eventos */}
            <div style={{ background:WHITE, borderRadius:12, marginBottom:16, overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
              <div style={{ background:NAVY, padding:"10px 16px" }}>
                <span style={{ color:WHITE, fontWeight:800, fontSize:13, textTransform:"uppercase", letterSpacing:0.5 }}>📅 Próximos Eventos</span>
              </div>
              <div style={{ padding:"10px 16px" }}>
                {upcoming.map((ev, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom: i < upcoming.length-1 ? "1px solid #f5f5f5" : "none" }}>
                    <div style={{ minWidth:48, background: ev.hot ? RED : "#e8ecf2", color: ev.hot ? WHITE : NAVY, borderRadius:7, padding:"4px 6px", textAlign:"center", fontSize:11, fontWeight:700 }}>{ev.date}</div>
                    <div style={{ fontSize:13, color: ev.hot ? RED : TEXT, fontWeight: ev.hot ? 700 : 400 }}>{ev.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rotina das Aulas */}
            <div style={{ fontSize:12, fontWeight:800, color:NAVY, marginBottom:10, textTransform:"uppercase", letterSpacing:0.5 }}>📖 Rotina das Aulas</div>
            {Object.entries(grouped)
              .sort((a, b) => b[0].localeCompare(a[0]))
              .map(([date, lessons]) => (
                <div key={date} style={{ marginBottom:20 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                    <div style={{ background:NAVY, color:WHITE, borderRadius:8, padding:"5px 14px", fontSize:12, fontWeight:700, flexShrink:0 }}>
                      {dayName(date)}, {fmtDateShort(date)}
                    </div>
                    <div style={{ flex:1, height:1, background:"#e0e0e0" }} />
                  </div>
                  {lessons.map(lesson => (
                    <div key={lesson.id} style={{ background:WHITE, borderRadius:12, marginBottom:10, overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                      <div style={{ background: lesson.period === "manhã" ? "#fffbf0" : "#f5f8ff", padding:"10px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid #efefef" }}>
                        <div style={{ fontSize:13, fontWeight:700, color:NAVY }}>{lesson.teacher}</div>
                        <div style={{ fontSize:11, fontWeight:700, padding:"3px 11px", borderRadius:20, background: lesson.period === "manhã" ? "#fff3cd" : "#dce8f7", color: lesson.period === "manhã" ? "#a0720a" : NAVY }}>
                          {lesson.period === "manhã" ? "☀️ Manhã" : "🌤 Tarde"}
                        </div>
                      </div>
                      <div style={{ padding:"14px 16px 4px" }}>
                        {lesson.subjects.map((s, i) => <SubjectRow key={i} s={s} />)}
                      </div>
                    </div>
                  ))}
                </div>
              ))
            }
          </div>
        )}

        {/* ════════════════════ TAREFAS ════════════════════ */}
        {tab === "tasks" && (
          <div>
            {/* Progress card */}
            <div style={{ background:WHITE, borderRadius:12, padding:"13px 16px", marginBottom:12, boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:7 }}>
                <div style={{ fontSize:13, fontWeight:700, color:NAVY }}>📊 Progresso geral</div>
                <div style={{ fontSize:13, fontWeight:800, color: pct===100 ? "#27ae60" : NAVY }}>{doneCount}/{total} · {pct}%</div>
              </div>
              <div style={{ background:"#f0f0f0", borderRadius:99, height:10, overflow:"hidden" }}>
                <div style={{ width:`${pct}%`, height:"100%", background: pct===100 ? "#27ae60" : RED, borderRadius:99, transition:"width 0.6s ease" }} />
              </div>
              <div style={{ display:"flex", gap:10, marginTop:10 }}>
                {[
                  { n:pendingTasks.length, label:"Pendentes",  color:RED        },
                  { n:urgentTasks.length,  label:"Urgentes",   color:"#e67e22"  },
                  { n:doneCount,           label:"Concluídas", color:"#27ae60"  },
                ].map((c, i) => (
                  <div key={i} style={{ flex:1, textAlign:"center", background:GRAY, borderRadius:8, padding:"7px 4px" }}>
                    <div style={{ fontSize:18, fontWeight:900, color:c.color }}>{c.n}</div>
                    <div style={{ fontSize:10, color:MUTED, fontWeight:600 }}>{c.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Urgent alert */}
            {urgentTasks.length > 0 && (
              <div style={{ background:"#fff5f5", border:`2px solid ${RED}`, borderRadius:12, padding:"11px 14px", marginBottom:12 }}>
                <div style={{ fontSize:13, fontWeight:800, color:RED, marginBottom:7 }}>🚨 Atenção necessária</div>
                {urgentTasks.map(t => (
                  <div key={t.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"4px 0", borderBottom:"1px solid #fde8e8" }}>
                    <div style={{ fontSize:13, color:TEXT, fontWeight:600, flex:1, paddingRight:8 }}>{t.title}</div>
                    <div style={{ fontSize:11, fontWeight:700, color: t.computed==="overdue" ? RED : "#e67e22", flexShrink:0 }}>{daysUntilLabel(t.due)}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Filter bar */}
            <div style={{ display:"flex", gap:6, marginBottom:12, background:WHITE, borderRadius:12, padding:"10px", boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
              {[["pending","Pendentes"], ["done","Concluídas"], ["all","Todas"]].map(([id, lbl]) => (
                <button key={id} onClick={() => setTaskFilter(id)} style={{ flex:1, padding:"9px 4px", borderRadius:8, border:"none", background: taskFilter===id ? RED : GRAY, color: taskFilter===id ? WHITE : MUTED, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s" }}>
                  {lbl}
                  {id === "pending" && pendingTasks.length > 0 && (
                    <span style={{ marginLeft:4, background: taskFilter==="pending" ? "rgba(255,255,255,0.3)" : RED, color:WHITE, borderRadius:10, padding:"1px 5px", fontSize:10 }}>{pendingTasks.length}</span>
                  )}
                </button>
              ))}
            </div>

            {shownTasks.length === 0
              ? <div style={{ background:WHITE, borderRadius:12, padding:28, textAlign:"center", color:MUTED, fontSize:14 }}>
                  {taskFilter === "done" ? "Nenhuma tarefa concluída ainda." : "✅ Tudo em dia!"}
                </div>
              : shownTasks.map(t => <TaskCard key={t.id} task={t} onToggle={toggleTask} />)
            }
          </div>
        )}

        {/* ════════════════════ COMUNICADOS ════════════════════ */}
        {tab === "comunicados" && (
          <div>
            {/* Filter chips */}
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 }}>
              {[["all","Todos"], ...Object.entries(ANN_CAT).map(([id, c]) => [id, c.label])].map(([id, lbl]) => (
                <button key={id} onClick={() => setAnnFilter(id)} style={{ padding:"6px 14px", borderRadius:20, fontSize:12, fontWeight:700, border: annFilter===id ? `2px solid ${RED}` : "1.5px solid #ddd", background: annFilter===id ? RED : WHITE, color: annFilter===id ? WHITE : MUTED, cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s" }}>
                  {lbl}
                </button>
              ))}
            </div>

            {shownAnn.map(ann => {
              const c = ANN_CAT[ann.category] || ANN_CAT.aviso;
              return (
                <div key={ann.id} style={{ background:WHITE, borderRadius:12, marginBottom:12, overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
                  <div style={{ borderLeft:`5px solid ${c.color}`, padding:"14px 16px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, marginBottom:5 }}>
                      <div style={{ fontSize:15, fontWeight:800, color:NAVY, lineHeight:1.3, flex:1 }}>{ann.title}</div>
                      <div style={{ fontSize:10, fontWeight:700, padding:"3px 9px", borderRadius:20, background:c.bg, color:c.color, whiteSpace:"nowrap", flexShrink:0, border:`1px solid ${c.color}22` }}>{c.label}</div>
                    </div>
                    <div style={{ fontSize:11, color:LIGHT, marginBottom:8 }}>{ann.date} · {ann.author}</div>
                    <div style={{ fontSize:13, color:MUTED, lineHeight:1.75 }}>{ann.content}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── BOTTOM NAV ── */}
      <div style={{ position:"fixed", bottom:0, left:0, right:0, background:WHITE, borderTop:"1px solid #eee", display:"flex", zIndex:100, boxShadow:"0 -2px 12px rgba(0,0,0,0.08)" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex:1, padding:"10px 4px 8px", border:"none", background:"transparent", cursor:"pointer", fontFamily:"inherit", display:"flex", flexDirection:"column", alignItems:"center", gap:3, position:"relative" }}>
            {t.id === "tasks" && pendingTasks.length > 0 && (
              <div style={{ position:"absolute", top:6, right:"calc(50% - 18px)", width:16, height:16, background:RED, borderRadius:"50%", fontSize:9, fontWeight:900, color:WHITE, display:"flex", alignItems:"center", justifyContent:"center" }}>{pendingTasks.length}</div>
            )}
            <span style={{ fontSize:20 }}>{t.icon}</span>
            <span style={{ fontSize:10, fontWeight: tab===t.id ? 800 : 400, color: tab===t.id ? RED : LIGHT }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
