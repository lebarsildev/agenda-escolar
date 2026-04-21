import { useState } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

const LESSONS = [
  {
    id: 1, date: "2026-04-15", teacher: "Miss Thayná e Patrícia", period: "tarde",
    subjects: [
      {
        icon: "🧘", name: "Momento de Volta à Calma",
        detail: "Após o lanche, realizamos um momento de volta à calma para iniciarmos a aula com foco e tranquilidade."
      },
      {
        icon: "📜", name: "História – AV2: Revista América Indígena",
        detail: "Nossos Big Bears iniciaram a produção da revista América Indígena. O objetivo da atividade é desenvolver competências de produção textual e comunicação científica voltada ao público infanto-juvenil. Em grupos, os alunos trabalharam com pesquisa e criatividade para elaborar as seções da revista, exercitando a clareza na transmissão de conhecimentos sobre as culturas indígenas de forma lúdica."
      },
      {
        icon: "📚", name: "PLA – Centros de Aprendizagem",
        detail: "Demos continuidade às atividades dos Centros de Aprendizagem. Os grupos aprofundaram os estudos sobre a jornada dos heróis."
      },
    ]
  },
  {
    id: 2, date: "2026-04-15", teacher: "Ms. Mari e Mr. Igor", period: "manhã",
    subjects: [
      {
        icon: "✏️", name: "ELA – Avaliação TRIEduc de Matemática",
        detail: "Os alunos realizaram a avaliação diagnóstica da TRIEduc de matemática. Trata-se de uma ferramenta valiosa para mapear o desenvolvimento das competências da turma, sem impacto na média escolar."
      },
      {
        icon: "🎨", name: "Arts – Carranca: Expressões Faciais",
        detail: "Realizamos a atividade avaliativa de Artes. Os alunos foram convidados a desenhar uma carranca, explorando diferentes expressões faciais por meio do uso de linhas e formas (sobrancelhas, olhos e boca) para transmitir emoções. Trabalharam com o uso de sombras para criar profundidade, utilizando tons mais escuros e mais claros com lápis de cor para dar a sensação de volume ao desenho, além do contraste entre áreas claras e escuras."
      },
    ]
  },
  {
    id: 3, date: "2026-04-14", teacher: "Miss Thayná e Patrícia", period: "tarde",
    subjects: [
      {
        icon: "📝", name: "Avaliação TRIEduc – Ciências Humanas",
        detail: "Conforme avisado previamente, os alunos realizaram a avaliação de Ciências Humanas. Reforçamos que este processo é uma ferramenta valiosa para mapearmos o desenvolvimento das competências de nossa turma, permitindo intervenções pedagógicas ainda mais assertivas."
      },
      {
        icon: "🎵", name: "Música",
        detail: "Aula de Música com Miss Michelle."
      },
      {
        icon: "⚽", name: "Educação Física",
        detail: "Aula de Educação Física com Mister Paulo. Incentivamos os alunos a organizarem seus materiais e o espaço coletivo para a aula."
      },
    ]
  },
  {
    id: 4, date: "2026-04-14", teacher: "Ms. Mari e Mr. Igor", period: "manhã",
    subjects: [
      {
        icon: "✏️", name: "ELA – Poema Diamante",
        detail: "Os alunos realizaram uma revisão sobre adjetivos, pronomes e verbos. Em seguida, construímos coletivamente um poema diamante com o tema \"school\". A turma foi dividida em quatro grupos: um grupo ficou responsável pelos adjetivos, outro pelos verbos, outro pelos pronomes e o último também pelos adjetivos. Cada grupo contribuiu com palavras de acordo com sua categoria. Por fim, os alunos escolheram seus próprios temas e criaram, de forma individual, seus poemas diamante."
      },
      {
        icon: "🔢", name: "Math – Subtrações com Matemática Mental",
        detail: "Continuamos trabalhando com subtrações utilizando estratégias de matemática mental. Realizamos a correção coletiva da página 28 do Student Workbook."
      },
    ]
  },
  {
    id: 5, date: "2026-04-13", teacher: "Miss Thayná e Patrícia", period: "tarde",
    subjects: [
      {
        icon: "📚", name: "PLA – Robin Hood e Centros de Aprendizagem",
        detail: "Apresentamos a nova obra literária \"Robin Hood: A lenda da liberdade\" (Pedro Bandeira), analisando os elementos da capa e créditos. Conversamos sobre os valores éticos e sociais que definem a figura de um herói. Os centros desta semana: 🟡 Centro Amarelo – Atividade Avaliativa da Unidade 1 | 🟢 Centro Verde – Exploração da obra \"O Guia dos Curiosinhos\" com quiz temático sobre heróis | 🔵 Centro Azul – Mitologia grega com \"Heróis e suas jornadas\", leitura de Os Argonautas e interpretação sobre Jasão | 🔴 Centro Vermelho – Conversa sobre heróis preferidos com organizador gráfico."
      },
      {
        icon: "🌍", name: "Geografia – Fronteiras e Limites do Brasil",
        detail: "Exploramos as fronteiras e limites do território brasileiro. Através da ferramenta Google Earth, aplicamos o \"efeito zoom\" para visualizar a organização política do espaço em diferentes escalas. Finalizamos com o registro no material didático, sistematizando as categorias de divisão em ordem de grandeza."
      },
    ]
  },
  {
    id: 6, date: "2026-04-13", teacher: "Ms. Mari e Mr. Igor", period: "manhã",
    subjects: [
      {
        icon: "✏️", name: "ELA – TRIEduc de Matemática",
        detail: "Os alunos realizaram a avaliação diagnóstica TRIEduc de Matemática, conforme o cronograma informado anteriormente. A atividade ocorreu dentro do horário regular de aula."
      },
      {
        icon: "🎨", name: "Arts – Carranca: Sombras e Profundidade",
        detail: "Os alunos exploraram diferentes expressões faciais por meio do uso de linhas e formas para transmitir emoções. Além disso, trabalharam com o uso de sombras para criar profundidade, utilizando tons mais escuros e mais claros com lápis de cor para dar a sensação de volume ao desenho."
      },
    ]
  },
  {
    id: 7, date: "2026-04-10", teacher: "Miss Thayná e Patrícia", period: "tarde",
    subjects: [
      {
        icon: "🌱", name: "Projeto Ciclos – Exploração do Inhame",
        detail: "Hoje iniciamos o novo projeto nutricional! Nossos Big Bears tiveram a oportunidade de explorar o inhame, conhecendo suas propriedades e experimentando o alimento. O objetivo do projeto é trabalhar alimentos específicos do cardápio escolar, explorando diferentes formas de preparo para estimular o interesse por uma alimentação saudável e consciente. Foi um momento de descoberta muito divertido e de grande engajamento da turma."
      },
      {
        icon: "🌎", name: "Geografia – Diversidade Climática do Brasil",
        detail: "Reforçamos a diversidade dos climas do Brasil e suas particularidades em cada região. Realizamos uma atividade investigativa em grupo, na qual cada equipe ficou responsável por uma localidade diferente. Os alunos precisaram descrever elementos práticos do cotidiano, como o tipo de vestimenta adequada, sugestões de passeios e as características do bioma local. Para consolidar o aprendizado, realizamos o registro e a sistematização dos conceitos no caderno de Geografia."
      },
      {
        icon: "⚽", name: "Educação Física",
        detail: "Aula de Educação Física com Mister Paulo."
      },
    ]
  },
  {
    id: 8, date: "2026-04-10", teacher: "Ms. Mari e Mr. Igor", period: "manhã",
    subjects: [
      {
        icon: "📊", name: "TRIEduc – Ciências da Natureza",
        detail: "Os alunos realizaram a avaliação diagnóstica de Ciências da Natureza. A avaliação ocorreu dentro do horário regular de aula, com início às 07h30 e duração estimada de 1h20."
      },
      {
        icon: "🔢", name: "Math – Estimativa de Diferenças",
        detail: "Aprendemos a estimar diferenças entre números de 3 dígitos. Quando os dois números têm 3 dígitos, arredondamos para a centena mais próxima (ex: 317 − 215 ≈ 300 − 200 = 100). Quando um dos números possui 2 dígitos, arredondamos para a dezena mais próxima (ex: 487 − 58 ≈ 490 − 60 = 430). Os alunos realizaram a página 26 do Student Workbook."
      },
      {
        icon: "🎨", name: "Arts – Finalização do Autorretrato",
        detail: "Finalizamos o autorretrato. Os alunos escolheram uma palavra que os representa, escreveram suas letras e as colaram no desenho. Eles exploraram toda a sua criatividade, trabalhando com diferentes texturas, camadas e sobreposições."
      },
    ]
  },
];

const ANNOUNCEMENTS = [
  {
    id: 1, date: "2026-04-13", title: "Retorno Les Fotografia Escola",
    author: "Miss Jéssica", category: "aviso",
    content: "A empresa Les Fotografia Escolar estará na escola para realizar o registro dos alunos que não estavam presentes na data anterior. Caso algum responsável não autorize a participação do aluno, pedimos a gentileza de comunicar previamente à secretaria da escola."
  },
  {
    id: 2, date: "2026-04-13", title: "Calendário Escolar de Abril",
    author: "Miss Jéssica", category: "calendario",
    content: "No dia 20 de abril não haverá aula. Nos dias 22 e 24 de abril, as aulas ocorrerão normalmente. Reforçamos que, conforme o calendário escolar, quando consta a indicação de \"dia livre para o aluno\", isso significa que não haverá aula. Em caso de dúvidas, estamos à disposição."
  },
  {
    id: 3, date: "2026-04-13", title: "Atividade Avaliativa de ELA – Poema Diamante",
    author: "Ms. Mari", category: "avaliacao",
    content: "No dia 16 de abril, os alunos realizarão a atividade avaliativa do poema diamante. Estrutura: 7 versos sem rima em formato de diamante — Verso 1: substantivo-tema | Verso 2: dois adjetivos | Verso 3: três verbos | Verso 4: quatro substantivos | Verso 5: três verbos | Verso 6: dois adjetivos | Verso 7: sinônimo do primeiro verso. Critérios avaliados: estrutura correta, ortografia, gramática, espaçamento e letra legível."
  },
  {
    id: 4, date: "2026-04-10", title: "Calendário AV2",
    author: "Ms. Mari", category: "avaliacao",
    content: "13/04 (Segunda): Artes — 15/04 (Quarta): Science Quiz — 16/04 (Quinta): ELA – Poema Diamante — 17/04 (Sexta): Math Challenge"
  },
  {
    id: 5, date: "2026-04-10", title: "Two-Minute Talk – Cronograma de Apresentações",
    author: "Ms. Mari", category: "atividade",
    content: "13/04: Yasmin e Davi | 14/04: Bernardo Costa, Vicente e Luisa | 15/04: Louise, Dom e Leticia | 16/04: Carlos Eduardo, Clara e Matheus Correa | 17/04: Mateus Larocca, Rafael e Alice. A proposta é ler os poemas, responder ao SLM e se preparar para apresentar para a turma em sala de aula."
  },
  {
    id: 6, date: "2026-04-10", title: "Leitura no Aplicativo Árvore",
    author: "Ms. Mari", category: "tarefa",
    content: "Hoje foram enviados, no aplicativo da Árvore, os livros para leitura. O prazo para realizar a leitura é até o dia 17 de abril. Qualquer dúvida, estou à disposição."
  },
  {
    id: 7, date: "2026-04-10", title: "AV2 – Língua Portuguesa (PLA)",
    author: "Miss Thayná", category: "avaliacao",
    content: "Produção de texto narrativo onde os personagens usam cooperação ou gentileza para resolver um conflito. Data: 17/04. O que será avaliado: Planejamento com roteiro obrigatório | Organização com introdução, desenvolvimento e desfecho | Diálogos com dois-pontos e travessão | Vocabulário com verbos dicendi variados (exclamou, sugeriu, respondeu, explicou, gritou, cochichou) | Fidelidade ao tema (amizade, gentileza ou cooperação) | Gramática, ortografia e capricho. Narrador definido pelo próprio aluno (narrador-personagem ou narrador-observador)."
  },
  {
    id: 8, date: "2026-04-10", title: "Fire Drill – Resultado do Treinamento",
    author: "Direção e Coordenação", category: "aviso",
    content: "Realizamos o treinamento de Fire Drill com as turmas da Educação Infantil e do Ensino Fundamental. A atividade contou com a participação do bombeiro da Guardião Escolar, que explicou o procedimento de forma clara e adequada a cada faixa etária. O treinamento foi um sucesso! O turno da manhã chegou ao ponto de encontro em 4min 3s, demonstrando organização, agilidade e comprometimento de todos os envolvidos."
  },
  {
    id: 9, date: "2026-04-09", title: "Notas da AV1 – Portal Sponte",
    author: "Coordenação Pedagógica", category: "aviso",
    content: "Os resultados da AV1 já estão disponíveis para consulta no portal Sponte. Acesse em: https://portal.sponteeducacional.net.br/mbvilavalqueire — utilize o CPF do responsável tanto para o campo de login quanto para o de senha. Em caso de dúvidas ou dificuldades no acesso, entre em contato com a secretaria."
  },
  {
    id: 10, date: "2026-04-08", title: "Tarefa de Casa – Leitura Calvin e Haroldo (pág. 140–165)",
    author: "Miss Thayná", category: "tarefa",
    content: "Solicitamos que os alunos realizem a leitura das páginas 140 a 165 da obra \"O mundo é mágico – As aventuras de Calvin e Haroldo\". Essa leitura prévia é fundamental para as atividades que desenvolveremos em sala, permitindo que os alunos participem das discussões com maior segurança. O livro deve retornar à escola na próxima sexta-feira."
  },
  {
    id: 11, date: "2026-04-07", title: "Inscrição para Exame de Cambridge",
    author: "Miss Jéssica", category: "aviso",
    content: "Estamos enviando informações referentes à inscrição para o exame de Cambridge. Essa é uma excelente oportunidade para os alunos desenvolverem ainda mais suas habilidades na língua inglesa, além de vivenciarem uma experiência enriquecedora e reconhecida internacionalmente. Incentivamos a participação, respeitando sempre o interesse de cada criança e família. Em caso de dúvidas, estamos à disposição."
  },
  {
    id: 12, date: "2026-04-07", title: "Livro Paradidático – \"Era uma vez Dom Quixote\"",
    author: "Miss Thayná", category: "tarefa",
    content: "Daremos início às atividades da Unidade 2 de Língua Portuguesa (PLA). Solicitamos o envio do livro paradidático \"Era uma vez Dom Quixote\" (já previsto na lista de materiais do início do ano). Por favor, enviem o livro etiquetado com o nome do aluno até o dia 14/04/26."
  },
];

const USERS = [
  { username: "responsavel", password: "mateus2026", name: "Família Larocca" },
  { username: "admin",       password: "escola2026", name: "Coordenação" },
];

function fmtDate(d) { const [y,m,day]=d.split("-"); return `${day}/${m}/${y}`; }
function dayLabel(d) { return ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"][new Date(d+"T12:00:00").getDay()]; }

const CAT = {
  avaliacao:  { label:"Avaliação",   color:"#c0392b", bg:"#fdf2f2" },
  tarefa:     { label:"Tarefa",      color:"#b9770e", bg:"#fef9ee" },
  aviso:      { label:"Aviso",       color:"#1a3a5c", bg:"#f0f4fa" },
  calendario: { label:"Calendário",  color:"#6c3483", bg:"#f8f4fd" },
  atividade:  { label:"Atividade",   color:"#1e8449", bg:"#f0faf4" },
};

const RED   = "#c0392b";
const NAVY  = "#1a2e4a";
const GRAY  = "#f5f5f5";
const WHITE = "#ffffff";
const TEXT  = "#222222";
const MUTED = "#666666";
const LIGHT = "#999999";

// ─── Login ────────────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [u,setU]=useState(""); const [p,setP]=useState("");
  const [show,setShow]=useState(false); const [err,setErr]=useState(""); const [loading,setLoading]=useState(false);
  function submit() {
    if(!u||!p){setErr("Preencha todos os campos.");return;}
    setLoading(true);setErr("");
    setTimeout(()=>{
      const found=USERS.find(x=>x.username===u&&x.password===p);
      if(found)onLogin(found); else{setErr("Usuário ou senha incorretos.");setLoading(false);}
    },700);
  }
  return (
    <div style={{minHeight:"100vh",background:GRAY,fontFamily:"'Georgia',serif",display:"flex",flexDirection:"column"}}>
      {/* Header bar */}
      <div style={{background:WHITE,borderBottom:`4px solid ${RED}`,padding:"14px 20px",display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:40,height:40,borderRadius:"50%",background:RED,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>🐻</div>
        <div>
          <div style={{fontWeight:800,fontSize:16,color:NAVY}}>Maple Bear Vila Valqueire</div>
          <div style={{fontSize:11,color:LIGHT}}>The best of Canadian education for a global future</div>
        </div>
      </div>

      {/* Hero */}
      <div style={{background:`linear-gradient(135deg, ${NAVY} 0%, #2d4a6e 100%)`,padding:"40px 24px 36px",textAlign:"center",color:WHITE}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"rgba(255,255,255,0.6)",marginBottom:10}}>Big Bears · Year 4</div>
        <div style={{fontSize:30,fontWeight:800,lineHeight:1.1,marginBottom:8}}>Agenda Escolar</div>
        <div style={{fontSize:14,color:"rgba(255,255,255,0.7)"}}>Acompanhe as atividades do Mateus</div>
        <div style={{width:40,height:3,background:RED,margin:"16px auto 0",borderRadius:2}}/>
      </div>

      {/* Form */}
      <div style={{flex:1,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"28px 20px"}}>
        <div style={{width:"100%",maxWidth:400}}>
          <div style={{background:WHITE,borderRadius:14,padding:"28px 24px",boxShadow:"0 4px 20px rgba(0,0,0,0.10)",border:"1px solid #e8e8e8"}}>
            <div style={{fontSize:17,fontWeight:800,color:NAVY,marginBottom:4}}>Bem-vindo de volta 👋</div>
            <div style={{fontSize:13,color:MUTED,marginBottom:22}}>Faça login para acessar a agenda</div>

            <div style={{marginBottom:14}}>
              <label style={{fontSize:11,fontWeight:700,color:MUTED,display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:0.8}}>Usuário</label>
              <input value={u} onChange={e=>{setU(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Digite seu usuário"
                style={{width:"100%",border:`1.5px solid ${err?"#e74c3c":"#ddd"}`,borderRadius:8,padding:"11px 14px",fontSize:14,outline:"none",fontFamily:"inherit",boxSizing:"border-box",color:TEXT,background:"#fafafa"}}/>
            </div>
            <div style={{marginBottom:6}}>
              <label style={{fontSize:11,fontWeight:700,color:MUTED,display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:0.8}}>Senha</label>
              <div style={{position:"relative"}}>
                <input type={show?"text":"password"} value={p} onChange={e=>{setP(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Digite sua senha"
                  style={{width:"100%",border:`1.5px solid ${err?"#e74c3c":"#ddd"}`,borderRadius:8,padding:"11px 42px 11px 14px",fontSize:14,outline:"none",fontFamily:"inherit",boxSizing:"border-box",color:TEXT,background:"#fafafa"}}/>
                <button onClick={()=>setShow(!show)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:15,color:"#aaa",lineHeight:1,padding:0}}>
                  {show?"🙈":"👁"}
                </button>
              </div>
            </div>

            {err&&<div style={{background:"#fff0f0",border:"1px solid #fcc",borderRadius:7,padding:"8px 12px",fontSize:12,color:RED,margin:"10px 0"}}>⚠️ {err}</div>}

            <button onClick={submit} disabled={loading} style={{width:"100%",padding:"13px",background:loading?"#a93226":RED,color:WHITE,border:"none",borderRadius:9,fontSize:15,fontWeight:700,cursor:loading?"not-allowed":"pointer",fontFamily:"inherit",marginTop:18,letterSpacing:0.3,transition:"background 0.2s",boxShadow:`0 4px 12px rgba(192,57,43,0.3)`}}>
              {loading?"Entrando...":"Entrar →"}
            </button>
          </div>
          <div style={{textAlign:"center",marginTop:18,fontSize:11,color:"#bbb"}}>© 2026 Maple Bear Vila Valqueire</div>
        </div>
      </div>
    </div>
  );
}

// ─── Subject Row ──────────────────────────────────────────────────────────────
function SubjectRow({ s }) {
  const [open,setOpen]=useState(true);
  return (
    <div style={{borderBottom:"1px solid #f2f2f2",paddingBottom:10,marginBottom:10}}>
      <button onClick={()=>setOpen(!open)} style={{width:"100%",background:"none",border:"none",cursor:"pointer",textAlign:"left",padding:0,display:"flex",alignItems:"flex-start",gap:10,fontFamily:"inherit"}}>
        <span style={{fontSize:17,lineHeight:"22px",flexShrink:0}}>{s.icon}</span>
        <div style={{flex:1,fontSize:13,fontWeight:700,color:NAVY,lineHeight:1.35}}>{s.name}</div>
        <span style={{fontSize:10,color:LIGHT,marginTop:2,flexShrink:0,lineHeight:"22px"}}>{open?"▲":"▼"}</span>
      </button>
      {open&&(
        <div style={{marginTop:7,marginLeft:27,fontSize:13,color:MUTED,lineHeight:1.7,borderLeft:`3px solid ${RED}`,paddingLeft:11}}>
          {s.detail}
        </div>
      )}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [user,setUser]=useState(()=>{ try{return JSON.parse(sessionStorage.getItem("sb_u"))||null;}catch{return null;} });
  const [tab,setTab]=useState("agenda");
  const [cat,setCat]=useState("all");

  function login(u){sessionStorage.setItem("sb_u",JSON.stringify(u));setUser(u);}
  function logout(){sessionStorage.removeItem("sb_u");setUser(null);}

  if(!user) return <Login onLogin={login}/>;

  const grouped=LESSONS.reduce((a,l)=>{(a[l.date]=a[l.date]||[]).push(l);return a;},{});
  const shown=cat==="all"?ANNOUNCEMENTS:ANNOUNCEMENTS.filter(a=>a.category===cat);

  const upcoming=[
    {date:"16/04",label:"Avaliação ELA – Poema Diamante",hot:true},
    {date:"17/04",label:"Math Challenge (AV2)",hot:true},
    {date:"17/04",label:"AV2 Língua Portuguesa",hot:true},
    {date:"17/04",label:"Two-Minute Talk: Mateus, Rafael e Alice",hot:false},
    {date:"20/04",label:"Sem aula",hot:false},
  ];

  return (
    <div style={{fontFamily:"'Georgia',serif",minHeight:"100vh",background:GRAY}}>

      {/* ── Top bar ── */}
      <div style={{background:WHITE,borderBottom:`4px solid ${RED}`,position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 8px rgba(0,0,0,0.08)"}}>
        <div style={{maxWidth:640,margin:"0 auto",padding:"10px 16px",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:36,borderRadius:"50%",background:RED,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🐻</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:800,fontSize:14,color:NAVY,lineHeight:1.2}}>Maple Bear · Big Bears</div>
            <div style={{fontSize:11,color:LIGHT}}>Mateus Larocca · Year 4</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:12,color:MUTED,display:"none"}}>👤 {user.name}</span>
            <button onClick={logout} style={{background:"none",border:`1.5px solid #ddd`,color:MUTED,borderRadius:7,padding:"5px 12px",fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>
              Sair
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div style={{maxWidth:640,margin:"0 auto",display:"flex",borderTop:"1px solid #f0f0f0"}}>
          {[["agenda","📅 Agenda"],["comunicados","📢 Comunicados"]].map(([id,lbl])=>(
            <button key={id} onClick={()=>setTab(id)} style={{flex:1,padding:"11px 8px",border:"none",background:"transparent",fontFamily:"inherit",fontSize:13,fontWeight:tab===id?800:400,color:tab===id?RED:MUTED,borderBottom:tab===id?`3px solid ${RED}`:"3px solid transparent",cursor:"pointer",transition:"all 0.15s",letterSpacing:tab===id?0.2:0}}>
              {lbl}
            </button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:640,margin:"0 auto",padding:"16px"}}>

        {/* ── Agenda Tab ── */}
        {tab==="agenda"&&(
          <div>
            {/* Upcoming */}
            <div style={{background:WHITE,borderRadius:12,marginBottom:18,overflow:"hidden",boxShadow:"0 2px 10px rgba(0,0,0,0.07)"}}>
              <div style={{background:RED,padding:"11px 16px",display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:14}}>⚡</span>
                <span style={{color:WHITE,fontWeight:800,fontSize:13,letterSpacing:0.5,textTransform:"uppercase"}}>Próximos Eventos</span>
              </div>
              <div style={{padding:"10px 16px"}}>
                {upcoming.map((ev,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<upcoming.length-1?"1px solid #f5f5f5":"none"}}>
                    <div style={{minWidth:48,background:ev.hot?RED:NAVY,color:WHITE,borderRadius:7,padding:"4px 6px",textAlign:"center",fontSize:11,fontWeight:700}}>{ev.date}</div>
                    <div style={{fontSize:13,color:ev.hot?RED:TEXT,fontWeight:ev.hot?700:400}}>{ev.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Days */}
            {Object.entries(grouped).sort((a,b)=>b[0].localeCompare(a[0])).map(([date,lessons])=>(
              <div key={date} style={{marginBottom:22}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <div style={{background:NAVY,color:WHITE,borderRadius:8,padding:"5px 14px",fontSize:12,fontWeight:700,letterSpacing:0.3,flexShrink:0}}>
                    {dayLabel(date)}, {fmtDate(date)}
                  </div>
                  <div style={{flex:1,height:1,background:"#e0e0e0"}}/>
                </div>

                {lessons.map(lesson=>(
                  <div key={lesson.id} style={{background:WHITE,borderRadius:12,marginBottom:10,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
                    {/* Lesson header */}
                    <div style={{background:lesson.period==="manhã"?"#fffbf0":"#f5f8ff",padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #efefef"}}>
                      <div style={{fontSize:13,fontWeight:700,color:NAVY}}>{lesson.teacher}</div>
                      <div style={{fontSize:11,fontWeight:700,padding:"3px 11px",borderRadius:20,background:lesson.period==="manhã"?"#fff3cd":"#dce8f7",color:lesson.period==="manhã"?"#a0720a":NAVY}}>
                        {lesson.period==="manhã"?"☀️ Manhã":"🌤 Tarde"}
                      </div>
                    </div>
                    {/* Subjects */}
                    <div style={{padding:"14px 16px 4px"}}>
                      {lesson.subjects.map((s,i)=><SubjectRow key={i} s={s}/>)}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* ── Comunicados Tab ── */}
        {tab==="comunicados"&&(
          <div>
            {/* Filter chips */}
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
              {[["all","Todos"],...Object.entries(CAT).map(([id,c])=>[id,c.label])].map(([id,lbl])=>(
                <button key={id} onClick={()=>setCat(id)} style={{padding:"6px 14px",borderRadius:20,fontSize:12,fontWeight:700,border:cat===id?`2px solid ${RED}`:"1.5px solid #ddd",background:cat===id?RED:WHITE,color:cat===id?WHITE:MUTED,cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s"}}>
                  {lbl}
                </button>
              ))}
            </div>

            {shown.map(ann=>{
              const c=CAT[ann.category]||CAT.aviso;
              return(
                <div key={ann.id} style={{background:WHITE,borderRadius:12,marginBottom:12,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
                  <div style={{borderLeft:`5px solid ${c.color}`,padding:"16px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:6}}>
                      <div style={{fontSize:15,fontWeight:800,color:NAVY,lineHeight:1.3,flex:1}}>{ann.title}</div>
                      <div style={{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:20,background:c.bg,color:c.color,whiteSpace:"nowrap",flexShrink:0,border:`1px solid ${c.color}22`}}>{c.label}</div>
                    </div>
                    <div style={{fontSize:11,color:LIGHT,marginBottom:10}}>{fmtDate(ann.date)} · {ann.author}</div>
                    <div style={{fontSize:13,color:MUTED,lineHeight:1.75}}>{ann.content}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
