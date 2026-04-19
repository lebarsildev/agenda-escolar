import { useState, useEffect } from "react";
import { parseAulas, parseComunicados } from "./parseData";
import aulasRaw from "./data/aulas.txt?raw";
import comunicadosRaw from "./data/comunicados.txt?raw";

// ─── Auth ────────────────────────────────────────────────────────────────────
const USERS = [
  { username: "responsavel", password: "mateus2026", name: "Família Larocca", role: "responsável" },
  { username: "admin", password: "escola2026", name: "Coordenação", role: "admin" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}
function getDayLabel(dateStr) {
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const date = new Date(dateStr + "T12:00:00");
  return days[date.getDay()];
}

const CATEGORY_STYLES = {
  avaliacao: { bg: "bg-rose-50", border: "#fca5a5", text: "#b91c1c", label: "Avaliação", accent: "#e74c3c" },
  tarefa:    { bg: "",           border: "#fcd34d", text: "#92400e", label: "Tarefa",    accent: "#e67e22" },
  aviso:     { bg: "",           border: "#93c5fd", text: "#1e40af", label: "Aviso",     accent: "#2980b9" },
  calendario:{ bg: "",           border: "#c4b5fd", text: "#5b21b6", label: "Calendário",accent: "#8e44ad" },
  atividade: { bg: "",           border: "#6ee7b7", text: "#065f46", label: "Atividade", accent: "#27ae60" },
};

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin() {
    if (!username || !password) { setError("Preencha usuário e senha."); return; }
    setLoading(true); setError("");
    setTimeout(() => {
      const user = USERS.find(u => u.username === username && u.password === password);
      if (user) { onLogin(user); }
      else { setError("Usuário ou senha incorretos."); setLoading(false); }
    }, 800);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0f2540 0%, #1a3a5c 55%, #22568a 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 24, fontFamily: "'Georgia', serif", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position:"absolute", top:-80, right:-80, width:280, height:280, borderRadius:"50%", background:"rgba(240,192,64,0.07)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:-60, left:-60, width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,0.04)", pointerEvents:"none" }}/>

      <div style={{ textAlign:"center", marginBottom:36 }}>
        <div style={{ width:72, height:72, borderRadius:"50%", background:"rgba(240,192,64,0.18)", border:"2px solid rgba(240,192,64,0.5)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, margin:"0 auto 16px" }}>🎒</div>
        <div style={{ color:"white", fontSize:22, fontWeight:700, letterSpacing:0.5 }}>Agenda Escolar</div>
        <div style={{ color:"rgba(255,255,255,0.5)", fontSize:13, marginTop:4 }}>Big Bears · Year 4</div>
      </div>

      <div style={{ width:"100%", maxWidth:380, background:"rgba(255,255,255,0.97)", borderRadius:20, padding:"28px 24px", boxShadow:"0 20px 60px rgba(0,0,0,0.35)" }}>
        <div style={{ fontWeight:700, fontSize:18, color:"#1a3a5c", marginBottom:6 }}>Bem-vindo de volta 👋</div>
        <div style={{ fontSize:13, color:"#888", marginBottom:22 }}>Faça login para acessar a agenda</div>

        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:12, fontWeight:700, color:"#555", display:"block", marginBottom:6 }}>USUÁRIO</label>
          <input value={username} onChange={e => { setUsername(e.target.value); setError(""); }}
            onKeyDown={e => e.key==="Enter" && handleLogin()} placeholder="seu usuário"
            style={{ width:"100%", border:`1.5px solid ${error?"#e74c3c":"#e0e0e0"}`, borderRadius:10, padding:"11px 14px", fontSize:14, outline:"none", fontFamily:"inherit", boxSizing:"border-box", background:"#fafafa", color:"#222" }}/>
        </div>

        <div style={{ marginBottom:8 }}>
          <label style={{ fontSize:12, fontWeight:700, color:"#555", display:"block", marginBottom:6 }}>SENHA</label>
          <div style={{ position:"relative" }}>
            <input type={showPass?"text":"password"} value={password}
              onChange={e => { setPassword(e.target.value); setError(""); }}
              onKeyDown={e => e.key==="Enter" && handleLogin()} placeholder="sua senha"
              style={{ width:"100%", border:`1.5px solid ${error?"#e74c3c":"#e0e0e0"}`, borderRadius:10, padding:"11px 40px 11px 14px", fontSize:14, outline:"none", fontFamily:"inherit", boxSizing:"border-box", background:"#fafafa", color:"#222" }}/>
            <button onClick={() => setShowPass(!showPass)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:16, color:"#aaa" }}>
              {showPass ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        {error && <div style={{ background:"#fff0f0", border:"1px solid #fcc", borderRadius:8, padding:"8px 12px", fontSize:12, color:"#c0392b", marginBottom:12 }}>⚠️ {error}</div>}

        <div style={{ background:"#f0f6ff", borderRadius:8, padding:"8px 12px", fontSize:11, color:"#4a7abf", marginBottom:18, lineHeight:1.5 }}>
          💡 <strong>Responsável:</strong> usuário <code>responsavel</code> · senha <code>mateus2026</code>
        </div>

        <button onClick={handleLogin} disabled={loading} style={{ width:"100%", padding:"13px", background: loading?"#7fa8cc":"linear-gradient(135deg,#1a3a5c,#2d5a8e)", color:"white", border:"none", borderRadius:12, fontSize:15, fontWeight:700, cursor: loading?"not-allowed":"pointer", fontFamily:"inherit", letterSpacing:0.5, boxShadow: loading?"none":"0 4px 14px rgba(26,58,92,0.35)" }}>
          {loading ? "Entrando..." : "Entrar →"}
        </button>
      </div>

      <div style={{ color:"rgba(255,255,255,0.3)", fontSize:11, marginTop:28, textAlign:"center" }}>© 2026 · Agenda Escolar · Big Bears</div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("school_user")) || null; } catch { return null; }
  });

  // Parse data files
  const LESSONS       = parseAulas(aulasRaw);
  const ANNOUNCEMENTS = parseComunicados(comunicadosRaw);

  const [tab, setTab]         = useState("agenda");
  const [filterCat, setFilterCat] = useState("all");
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState([{
    role: "assistant",
    content: "Olá! 👋 Sou a assistente da agenda do Mateus. Posso ajudar com informações sobre aulas, avaliações e comunicados. O que você gostaria de saber?"
  }]);

  function handleLogin(u) {
    sessionStorage.setItem("school_user", JSON.stringify(u));
    setUser(u);
  }
  function handleLogout() {
    sessionStorage.removeItem("school_user");
    setUser(null);
  }

  if (!user) return <LoginScreen onLogin={handleLogin} />;

  // Group lessons by date
  const groupedLessons = LESSONS.reduce((acc, l) => {
    if (!acc[l.date]) acc[l.date] = [];
    acc[l.date].push(l);
    return acc;
  }, {});

  const filteredAnnouncements = filterCat === "all"
    ? ANNOUNCEMENTS
    : ANNOUNCEMENTS.filter(a => a.category === filterCat);

  // Build upcoming events from announcements
  const upcomingEvents = [
    { date: "16/04", label: "Avaliação ELA – Poema Diamante", color: "#e74c3c" },
    { date: "17/04", label: "Math Challenge (AV2)",           color: "#e74c3c" },
    { date: "17/04", label: "AV2 Língua Portuguesa",          color: "#e74c3c" },
    { date: "17/04", label: "Two-Minute Talk: Mateus, Rafael e Alice", color: "#e67e22" },
    { date: "20/04", label: "Sem aula",                       color: "#888" },
  ];

  async function sendMessage() {
    if (!aiInput.trim() || aiLoading) return;
    const userMsg = aiInput.trim();
    setAiInput("");
    const newMessages = [...aiMessages, { role: "user", content: userMsg }];
    setAiMessages(newMessages);
    setAiLoading(true);

    const context = `Você é a assistente da agenda escolar do aluno Mateus Caldeira Larocca da Silva (turma Big Bears, Year 4).

COMUNICADOS RECENTES:
${ANNOUNCEMENTS.map(a => `- [${a.date}] ${a.title} (${a.category}): ${a.content}`).join("\n")}

ROTINA DAS AULAS:
${LESSONS.map(l => `- [${l.date}] ${l.period} - ${l.teacher}: ${l.subjects.map(s => s.name).join(", ")}`).join("\n")}

Responda de forma amigável e direta em português. Use emojis com moderação.`;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: context,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await response.json();
      const reply = data.content?.map(c => c.text || "").join("") || "Desculpe, não consegui responder agora.";
      setAiMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch {
      setAiMessages([...newMessages, { role: "assistant", content: "❌ Erro ao conectar. Tente novamente." }]);
    }
    setAiLoading(false);
  }

  return (
    <div style={{ fontFamily:"'Georgia', serif", minHeight:"100vh", background:"#faf7f2" }}>

      {/* ── Header ── */}
      <div style={{ background:"linear-gradient(135deg,#1a3a5c 0%,#2d5a8e 100%)", padding:"20px 16px 0", color:"white" }}>
        <div style={{ maxWidth:600, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:4 }}>
            <div style={{ width:42, height:42, borderRadius:"50%", background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🎒</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:17, letterSpacing:0.3 }}>Agenda Escolar</div>
              <div style={{ fontSize:12, opacity:0.8 }}>Mateus Larocca · Big Bears · Year 4</div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
              <div style={{ fontSize:11, opacity:0.7 }}>👤 {user.name}</div>
              <button onClick={handleLogout} style={{ background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.3)", color:"white", borderRadius:8, padding:"3px 10px", fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>Sair</button>
            </div>
          </div>
          <div style={{ display:"flex", gap:0, marginTop:16 }}>
            {[{ id:"agenda", label:"📅 Agenda" }, { id:"comunicados", label:"📢 Comunicados" }, { id:"assistente", label:"🤖 Assistente IA" }].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ flex:1, padding:"10px 4px", border:"none", background:"transparent", color: tab===t.id?"white":"rgba(255,255,255,0.5)", fontWeight: tab===t.id?700:400, fontSize:13, cursor:"pointer", borderBottom: tab===t.id?"3px solid #f0c040":"3px solid transparent", transition:"all 0.2s", fontFamily:"inherit" }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:600, margin:"0 auto", padding:"16px" }}>

        {/* ── Agenda Tab ── */}
        {tab === "agenda" && (
          <div>
            <div style={{ background:"white", borderRadius:14, padding:"14px 16px", marginBottom:16, boxShadow:"0 2px 12px rgba(0,0,0,0.07)", borderLeft:"4px solid #f0c040" }}>
              <div style={{ fontWeight:700, fontSize:12, color:"#888", marginBottom:10, textTransform:"uppercase", letterSpacing:1 }}>⚡ Próximos eventos</div>
              {upcomingEvents.map((ev, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:7 }}>
                  <div style={{ minWidth:44, background:"#1a3a5c", color:"white", borderRadius:8, padding:"4px 6px", textAlign:"center", fontSize:11, fontWeight:700 }}>{ev.date}</div>
                  <div style={{ fontSize:13, color:ev.color, fontWeight:600 }}>{ev.label}</div>
                </div>
              ))}
            </div>

            <div style={{ fontWeight:700, fontSize:12, color:"#888", marginBottom:10, textTransform:"uppercase", letterSpacing:1 }}>📖 Rotina das aulas</div>
            {Object.entries(groupedLessons).sort((a, b) => b[0].localeCompare(a[0])).map(([date, lessons]) => (
              <div key={date} style={{ marginBottom:16 }}>
                <div style={{ background:"#1a3a5c", color:"white", borderRadius:8, padding:"4px 10px", fontSize:12, fontWeight:700, display:"inline-block", marginBottom:8 }}>
                  {getDayLabel(date)}, {formatDate(date)}
                </div>
                {lessons.map(lesson => (
                  <div key={lesson.id} style={{ background:"white", borderRadius:12, padding:"12px 14px", marginBottom:8, boxShadow:"0 1px 6px rgba(0,0,0,0.06)", borderTop:`3px solid ${lesson.period==="manhã"?"#f0c040":"#2d5a8e"}` }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                      <div style={{ fontSize:12, fontWeight:700, color:"#555" }}>{lesson.teacher}</div>
                      <div style={{ fontSize:11, padding:"2px 8px", borderRadius:20, background: lesson.period==="manhã"?"#fff8e1":"#e8eef7", color: lesson.period==="manhã"?"#b8860b":"#2d5a8e", fontWeight:600 }}>
                        {lesson.period==="manhã"?"☀️ Manhã":"🌤 Tarde"}
                      </div>
                    </div>
                    {lesson.subjects.map((s, i) => (
                      <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:8, padding:"6px 0", borderTop: i>0?"1px solid #f0f0f0":"none" }}>
                        <span style={{ fontSize:16 }}>{s.icon}</span>
                        <span style={{ fontSize:13, color:"#333", lineHeight:1.4 }}>{s.name}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* ── Comunicados Tab ── */}
        {tab === "comunicados" && (
          <div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 }}>
              {[{ id:"all", label:"Todos" }, ...Object.entries(CATEGORY_STYLES).map(([id, s]) => ({ id, label:s.label }))].map(f => (
                <button key={f.id} onClick={() => setFilterCat(f.id)} style={{ padding:"5px 12px", borderRadius:20, fontSize:12, border: filterCat===f.id?"2px solid #1a3a5c":"1px solid #ddd", background: filterCat===f.id?"#1a3a5c":"white", color: filterCat===f.id?"white":"#555", cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}>
                  {f.label}
                </button>
              ))}
            </div>
            {filteredAnnouncements.map(ann => {
              const st = CATEGORY_STYLES[ann.category] || CATEGORY_STYLES.aviso;
              return (
                <div key={ann.id} style={{ background:"white", borderRadius:12, padding:"14px", marginBottom:12, boxShadow:"0 1px 6px rgba(0,0,0,0.06)", borderLeft:`4px solid ${st.accent}` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:"#1a1a1a", flex:1, paddingRight:8, lineHeight:1.3 }}>{ann.title}</div>
                    <div style={{ fontSize:10, padding:"2px 8px", borderRadius:20, whiteSpace:"nowrap", background:"#f5f5f5", color:st.text, border:`1px solid ${st.border}`, fontWeight:700 }}>{st.label}</div>
                  </div>
                  <div style={{ fontSize:12, color:"#888", marginBottom:6 }}>{formatDate(ann.date)} · {ann.author}</div>
                  <div style={{ fontSize:13, color:"#444", lineHeight:1.5 }}>{ann.content}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Assistente Tab ── */}
        {tab === "assistente" && (
          <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 170px)" }}>
            <div style={{ background:"white", borderRadius:12, padding:"10px 14px", marginBottom:12, boxShadow:"0 1px 6px rgba(0,0,0,0.06)", fontSize:12, color:"#666" }}>
              💡 <strong>Sugestões:</strong> "Quais avaliações estão chegando?" · "O que foi dado em história?" · "Tem tarefa para casa?"
            </div>
            <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:10, paddingBottom:8 }}>
              {aiMessages.map((msg, i) => (
                <div key={i} style={{ display:"flex", justifyContent: msg.role==="user"?"flex-end":"flex-start" }}>
                  <div style={{ maxWidth:"85%", padding:"10px 14px", borderRadius: msg.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px", background: msg.role==="user"?"#1a3a5c":"white", color: msg.role==="user"?"white":"#222", fontSize:13, lineHeight:1.5, boxShadow:"0 1px 4px rgba(0,0,0,0.1)", whiteSpace:"pre-wrap" }}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div style={{ display:"flex", justifyContent:"flex-start" }}>
                  <div style={{ background:"white", borderRadius:"18px 18px 18px 4px", padding:"10px 18px", boxShadow:"0 1px 4px rgba(0,0,0,0.1)", fontSize:18, letterSpacing:4, color:"#aaa" }}>•••</div>
                </div>
              )}
            </div>
            <div style={{ display:"flex", gap:8, paddingTop:8, borderTop:"1px solid #eee" }}>
              <input value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key==="Enter" && sendMessage()}
                placeholder="Pergunte sobre aulas, provas, comunicados..."
                style={{ flex:1, border:"1.5px solid #ddd", borderRadius:24, padding:"10px 16px", fontSize:14, outline:"none", fontFamily:"inherit", background:"white", color:"#333" }}/>
              <button onClick={sendMessage} disabled={aiLoading || !aiInput.trim()} style={{ width:44, height:44, borderRadius:"50%", background: aiLoading||!aiInput.trim()?"#ccc":"#1a3a5c", color:"white", border:"none", cursor: aiLoading?"not-allowed":"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>→</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
