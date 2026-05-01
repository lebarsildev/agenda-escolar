import { useState, useEffect } from "react";

const RED = "#c0392b", NAVY = "#1a2e4a", WHITE = "#ffffff", GRAY = "#f4f5f7";
const TEXT = "#1a1a1a", MUTED = "#666", LIGHT = "#aaa";

const USERS = [
  { username: "responsavel", password: "mateus2026", name: "Família Larocca" },
  { username: "admin",       password: "escola2026", name: "Coordenação" },
];

// ─── AULAS (dados dos arquivos atualizados) ───────────────────────────────────
const LESSONS = [
  {
    id: 1, date: "2026-04-15", teacher: "Misses Thayná e Patrícia", period: "tarde",
    subjects: [
      { icon: "🧘", name: "Momento de Volta à Calma", detail: "Após o lanche, realizamos um momento de volta à calma para iniciarmos a aula." },
      { icon: "📜", name: "História – AV2: Revista América Indígena", detail: "Nossos Big Bears realizaram o trabalho avaliativo (AV2) iniciando a produção da revista \"América Indígena\". O objetivo da atividade é desenvolver competências de produção textual e comunicação científica voltada ao público infanto-juvenil. Em grupos, os alunos trabalharam com pesquisa e criatividade para elaborar as seções da revista, exercitando a clareza na transmissão de conhecimentos sobre as culturas indígenas de forma lúdica." },
      { icon: "📚", name: "PLA – Centros de Aprendizagem", detail: "Demos continuidade às atividades dos Centros de Aprendizagem. Os grupos aprofundaram os estudos sobre a jornada dos heróis." },
    ]
  },
  {
    id: 2, date: "2026-04-15", teacher: "Ms. Mari e Mr. Igor", period: "manhã",
    subjects: [
      { icon: "✏️", name: "ELA – Avaliação TRIEduc de Matemática", detail: "Os alunos realizaram a avaliação da TRIEduc de Matemática. Ferramenta valiosa para mapear o desenvolvimento das competências da turma, sem impacto na média escolar." },
      { icon: "🎨", name: "Arts – Carranca: Expressões Faciais", detail: "Realizamos a atividade avaliativa de Artes. Os alunos desenharam uma carranca, explorando diferentes expressões faciais por meio do uso de linhas e formas (sobrancelhas, olhos e boca) para transmitir emoções. Trabalharam com sombras para criar profundidade, utilizando tons mais escuros e mais claros com lápis de cor, além do contraste entre áreas claras e escuras para destacar partes do rosto." },
    ]
  },
  {
    id: 3, date: "2026-04-14", teacher: "Ms. Mari e Mr. Igor", period: "manhã",
    subjects: [
      { icon: "✏️", name: "ELA – Poema Diamante", detail: "Os alunos realizaram uma revisão sobre adjetivos, pronomes e verbos. Em seguida, construímos coletivamente um poema diamante com o tema \"school\". A turma foi dividida em quatro grupos por categoria gramatical: adjetivos, verbos, pronomes e adjetivos. Cada grupo contribuiu com palavras para formar o poema. Por fim, os alunos escolheram seus próprios temas e criaram individualmente seus poemas diamante." },
      { icon: "🔢", name: "Math – Subtrações com Matemática Mental", detail: "Continuamos trabalhando com subtrações utilizando estratégias de matemática mental. Realizamos a correção coletiva da página 28 do Student Workbook." },
    ]
  },
  {
    id: 4, date: "2026-04-14", teacher: "Misses Thayná e Patrícia", period: "tarde",
    subjects: [
      { icon: "🧘", name: "Momento de Volta à Calma", detail: "Após o lanche, realizamos um momento de volta à calma para iniciarmos a aula." },
      { icon: "📝", name: "Avaliação TRIEduc – Ciências Humanas", detail: "Conforme avisado previamente, os alunos realizaram a avaliação de Ciências Humanas. Este processo é uma ferramenta valiosa para mapear o desenvolvimento das competências da turma, permitindo intervenções pedagógicas mais assertivas." },
      { icon: "🎵", name: "Música", detail: "Aula de Música com Miss Michelle." },
      { icon: "⚽", name: "Educação Física", detail: "Aula de Educação Física com Mister Paulo. Incentivamos os alunos a organizarem seus materiais e o espaço coletivo." },
    ]
  },
  {
    id: 5, date: "2026-04-13", teacher: "Ms. Mari e Mr. Igor", period: "manhã",
    subjects: [
      { icon: "✏️", name: "ELA – TRIEduc de Matemática", detail: "Os alunos realizaram a avaliação diagnóstica TRIEduc de Matemática, conforme o cronograma informado. Início às 07h30, duração estimada de 1h20." },
      { icon: "🎨", name: "Arts – Carranca: Sombras e Profundidade", detail: "Os alunos exploraram expressões faciais transmitindo emoções por meio de linhas e formas. Trabalharam com sombras para criar profundidade, utilizando tons mais escuros e mais claros com lápis de cor." },
    ]
  },
  {
    id: 6, date: "2026-04-13", teacher: "Misses Thayná e Patrícia", period: "tarde",
    subjects: [
      { icon: "🧘", name: "Momento de Volta à Calma", detail: "Após o lanche, realizamos um momento de volta à calma para iniciarmos a aula." },
      { icon: "📚", name: "PLA – Robin Hood e Centros de Aprendizagem", detail: "Apresentamos \"Robin Hood: A lenda da liberdade\" (Pedro Bandeira), analisando elementos da capa e créditos. Conversamos sobre os valores éticos que definem a figura de um herói. Centros: 🟡 Amarelo – Atividade Avaliativa da Unidade 1 | 🟢 Verde – \"O Guia dos Curiosinhos\" com quiz sobre heróis | 🔵 Azul – \"Heróis e suas jornadas\", leitura de Os Argonautas e interpretação sobre Jasão | 🔴 Vermelho – organizador gráfico dos heróis favoritos." },
      { icon: "🌍", name: "Geografia – Fronteiras e Limites do Brasil", detail: "Exploramos as fronteiras e limites do território brasileiro com o Google Earth, aplicando o \"efeito zoom\" para visualizar a organização política do espaço em diferentes escalas. Finalizamos com registro no material didático." },
    ]
  },
  {
    id: 7, date: "2026-04-10", teacher: "Ms. Mari e Mr. Igor", period: "manhã",
    subjects: [
      { icon: "📊", name: "TRIEduc – Ciências da Natureza", detail: "Avaliação diagnóstica de Ciências da Natureza. Início às 07h30, duração estimada de 1h20." },
      { icon: "🔢", name: "Math – Estimativa de Diferenças", detail: "Aprendemos a estimar diferenças entre números de 3 dígitos. Quando os dois têm 3 dígitos, arredondamos para a centena mais próxima (ex: 317−215 ≈ 300−200=100). Quando um tem 2 dígitos, arredondamos para a dezena (ex: 487−58 ≈ 490−60=430). Realizamos a página 26 do Student Workbook." },
      { icon: "🎨", name: "Arts – Finalização do Autorretrato", detail: "Finalizamos o autorretrato. Os alunos escolheram uma palavra que os representa, escreveram suas letras e as colaram no desenho, explorando texturas, camadas e sobreposições." },
    ]
  },
  {
    id: 8, date: "2026-04-10", teacher: "Misses Thayná e Patrícia", period: "tarde",
    subjects: [
      { icon: "🧘", name: "Momento de Volta à Calma", detail: "Após o lanche, realizamos um momento de volta à calma para iniciarmos a aula." },
      { icon: "🌱", name: "Projeto Ciclos – Exploração do Inhame", detail: "Iniciamos o novo projeto nutricional! Os Big Bears exploraram o inhame, conhecendo suas propriedades e experimentando o alimento. O objetivo é trabalhar alimentos do cardápio escolar em diferentes formas de preparo para estimular o interesse por alimentação saudável e consciente. Foi um momento muito divertido e de grande engajamento!" },
      { icon: "🌎", name: "Geografia – Diversidade Climática do Brasil", detail: "Reforçamos a diversidade dos climas do Brasil e suas particularidades em cada região. Atividade investigativa em grupo: cada equipe foi responsável por uma localidade diferente, descrevendo vestimenta adequada, sugestões de passeios e características do bioma local. Registro e sistematização no caderno de Geografia." },
      { icon: "⚽", name: "Educação Física", detail: "Aula de Educação Física com Mister Paulo." },
    ]
  },
  {
    id: 9, date: "2026-04-07", teacher: "Misses Thayná e Patrícia", period: "tarde",
    subjects: [
      { icon: "🧘", name: "Momento de Volta à Calma", detail: "Após o lanche, realizamos um momento de volta à calma para iniciarmos a aula." },
      { icon: "📚", name: "PLA – Calvin e Haroldo e Centros de Aprendizagem", detail: "Realizamos a retomada da atividade de casa sobre a obra Calvin e Haroldo. Valorizamos o pensamento crítico e a capacidade de inferências para compreender o humor e as particularidades das histórias. Exploramos recursos visuais e narrativos das HQs, como passagens de tempo e a diferenciação entre quadros de imaginação e realidade. Demos continuidade aos Centros de Aprendizagem." },
      { icon: "🌎", name: "Geografia – Formação do Povo Brasileiro", detail: "Iniciamos a segunda sequência didática da Unidade 1 — Regiões e regionalizações do Brasil. Os alunos voltaram o olhar para a formação do povo brasileiro. Participaram do Bingo Cultural, uma dinâmica lúdica sobre as heranças culturais do nosso país. Foi um momento muito divertido!" },
    ]
  },
  {
    id: 10, date: "2026-04-06", teacher: "Ms. Mari e Mr. Igor", period: "manhã",
    subjects: [
      { icon: "✏️", name: "ELA – Buddy Reading e Poemas em Lista", detail: "Iniciamos com o Buddy Reading: alunos escolheram livros de poesia, leram em duplas e compartilharam com a turma. Em seguida, revisaram seus poemas em formato de lista, verificando ortografia, ampliando o vocabulário e conferindo a estrutura correta." },
      { icon: "🔢", name: "Math – Estimativa de Diferenças (pág. 26)", detail: "Aprendemos a estimar diferenças: quando os dois números têm 3 dígitos, arredondamos para a centena; quando um tem 2 dígitos, arredondamos para a dezena. Os alunos realizaram a página 26 do Student Workbook." },
      { icon: "🎨", name: "Arts – Finalização do Autorretrato", detail: "Finalizamos o autorretrato. Os alunos escolheram uma palavra que os representa, escreveram suas letras e as colaram no desenho, explorando texturas, camadas e sobreposições." },
    ]
  },
  {
    id: 11, date: "2026-04-01", teacher: "Misses Thayná e Patrícia", period: "tarde",
    subjects: [
      { icon: "📚", name: "PLA – Diálogos e Verbos Dicendi", detail: "Os alunos avançaram na consolidação dos conceitos de diálogo e pontuação. Finalizamos a construção coletiva da produção textual com foco no uso dos verbos dicendi (essenciais para dar vida às falas dos personagens). Demos continuidade aos Centros de Aprendizagem." },
      { icon: "📜", name: "História – Quiz sobre os Sambaquis", detail: "Exploramos o legado dos povos antigos por meio de troca de quizzes sobre os Sambaquis (produzidos pelos próprios alunos). Cada grupo respondeu às questões elaboradas pelos colegas, estimulando a revisão colaborativa. Formalizamos as reflexões no caderno de descobertas com o registro da definição de povos originários." },
    ]
  },
  {
    id: 12, date: "2026-04-01", teacher: "Ms. Mari e Mr. Igor", period: "manhã",
    subjects: [
      { icon: "✏️", name: "ELA – Buddy Reading e Centros de Aprendizagem", detail: "Buddy Reading com livros de poesia. Segunda rotação dos centros: Centro 1 – Guided Reading (rimas e adjetivos) | Centro 2 – SLM 12 (personificação) | Centro 3 – \"I Am\" Poem (versão final) | Centro 4 – Poema em lista (rascunho)." },
      { icon: "🔬", name: "Science – Correção AV1 e Adaptações", detail: "Os alunos receberam as notas da AV1 e realizamos a correção coletiva. Revisamos os conceitos de adaptação estrutural e comportamental em plantas e animais (ex: urso polar e camuflagem na neve, camaleão para proteção de predadores)." },
    ]
  },
];

// ─── COMUNICADOS ──────────────────────────────────────────────────────────────
const ANNOUNCEMENTS = [
  { id:1, date:"13/04/2026", title:"Retorno Les Fotografia Escola", author:"Miss Jéssica", category:"aviso",
    content:"A empresa Les Fotografia Escolar estará na escola amanhã para registrar alunos ausentes na data anterior. Responsáveis que não autorizarem devem comunicar previamente à secretaria." },
  { id:2, date:"13/04/2026", title:"Calendário Escolar de Abril", author:"Miss Jéssica", category:"calendario",
    content:"No dia 20 de abril não haverá aula. Nos dias 22 e 24 de abril, as aulas ocorrerão normalmente. Quando constar \"dia livre para o aluno\" no calendário, isso significa que não haverá aula." },
  { id:3, date:"13/04/2026", title:"Atividade Avaliativa ELA – Poema Diamante (16/04)", author:"Ms. Mari", category:"avaliacao",
    content:"No dia 16 de abril, os alunos realizarão a avaliação do poema diamante. Estrutura de 7 versos sem rima: Verso 1: substantivo-tema | Verso 2: dois adjetivos | Verso 3: três verbos | Verso 4: quatro substantivos | Verso 5: três verbos | Verso 6: dois adjetivos | Verso 7: sinônimo. Critérios: estrutura correta, ortografia, gramática, espaçamento e letra legível." },
  { id:4, date:"10/04/2026", title:"Treinamento Fire Drill – Turno da Manhã", author:"Direção e Coordenação", category:"aviso",
    content:"Realizamos hoje o treinamento de Fire Drill com as turmas da Educação Infantil e Ensino Fundamental, com participação do bombeiro da Guardião Escolar. O turno da manhã chegou ao ponto de encontro em 4m 3s. Parabéns!" },
  { id:5, date:"10/04/2026", title:"Calendário AV2", author:"Ms. Mari", category:"avaliacao",
    content:"13/04 (Segunda): Artes | 15/04 (Quarta): Science Quiz | 16/04 (Quinta): ELA – Poema Diamante | 17/04 (Sexta): Math Challenge" },
  { id:6, date:"10/04/2026", title:"Two-Minute Talk – Cronograma de Apresentações", author:"Ms. Mari", category:"atividade",
    content:"13/04: Yasmin e Davi | 14/04: Bernardo Costa, Vicente e Luisa | 15/04: Louise, Dom e Leticia | 16/04: Carlos Eduardo, Clara e Matheus Correa | 17/04: Mateus Larocca, Rafael e Alice. Proposta: ler os poemas, responder o SLM e apresentar para a turma." },
  { id:7, date:"10/04/2026", title:"Leitura no Aplicativo Árvore", author:"Ms. Mari", category:"tarefa",
    content:"Livros enviados no aplicativo Árvore para leitura. Prazo: até 17 de abril." },
  { id:8, date:"10/04/2026", title:"AV2 – Língua Portuguesa (PLA) – 17/04", author:"Miss Thayná", category:"avaliacao",
    content:"Produção de texto narrativo com cooperação/gentileza como tema. O que será avaliado: Planejamento com roteiro obrigatório | Organização (introdução, desenvolvimento e desfecho) | Diálogos com dois-pontos e travessão | Verbos dicendi variados (exclamou, sugeriu, cochichou...) | Fidelidade ao tema | Gramática, ortografia e capricho. Narrador definido pelo aluno." },
  { id:9, date:"10/04/2026", title:"AV2 – História – Revista América Indígena", author:"Miss Thayná", category:"avaliacao",
    content:"Os alunos produzirão em grupos a revista \"América Indígena\", desenvolvendo competências de produção textual e comunicação científica voltada ao público infanto-juvenil." },
  { id:10, date:"09/04/2026", title:"Critérios Avaliativos AV2 – ELA, Math, Science e Arts", author:"Ms. Mari", category:"avaliacao",
    content:"ELA: estrutura do poema diamante, ortografia, gramática e letra legível. Science: habitat, comunidade, cadeia alimentar, adaptações estrutural e comportamental, camuflagem. Math: valor posicional, arredondamento, estimativas, comparação/ordenação de números e adições com reagrupamento. Arts: expressões faciais, uso de linhas e formas, lápis de cor com luz e sombra." },
  { id:11, date:"09/04/2026", title:"Notas da AV1 – Portal Sponte", author:"Coordenação Pedagógica", category:"aviso",
    content:"Resultados disponíveis em: portal.sponteducacional.net.br/mbvilavalqueire — CPF do responsável como login e senha. Dúvidas: entre em contato com a secretaria." },
  { id:12, date:"08/04/2026", title:"Tarefa de Casa – Leitura Calvin e Haroldo (pág. 140–165)", author:"Misses Thayná e Patrícia", category:"tarefa",
    content:"Leitura das páginas 140 a 165 de \"O mundo é mágico – As aventuras de Calvin e Haroldo\". Leitura prévia fundamental para as atividades em sala. O livro deve retornar à escola na próxima sexta-feira." },
  { id:13, date:"07/04/2026", title:"Cronograma TRIEduc (Year 4)", author:"Coordenação Pedagógica", category:"aviso",
    content:"09/04 (Qui): Linguagens e Redação – 10h, duração 2h | 10/04 (Sex): Ciências da Natureza – 07h30, 1h20 | 13/04 (Seg): Matemática – 07h30, 1h20 | 14/04 (Ter): Ciências Humanas – 07h30, 1h20. Avaliação diagnóstica sem impacto na média e sem necessidade de estudo prévio." },
  { id:14, date:"07/04/2026", title:"Inscrição para Exame de Cambridge", author:"Miss Jéssica", category:"aviso",
    content:"Informações sobre inscrição para o exame de Cambridge disponíveis com a secretaria. Excelente oportunidade para desenvolver habilidades em inglês com reconhecimento internacional." },
  { id:15, date:"07/04/2026", title:"Livro Paradidático – \"Era uma vez Dom Quixote\"", author:"Misses Thayná e Patrícia", category:"tarefa",
    content:"Enviar o livro etiquetado com o nome do aluno até 14/04/26 para as atividades da Unidade 2 de PLA." },
  { id:16, date:"02/04/2026", title:"Tarefa de Casa – Leitura Calvin e Haroldo (pág. 124–134)", author:"Misses Thayná e Patrícia", category:"tarefa",
    content:"Leitura das páginas 124 a 134 de \"O mundo é mágico – As aventuras de Calvin e Haroldo\". O livro deve retornar à escola na próxima segunda-feira." },
  { id:17, date:"02/04/2026", title:"Newsletter Abril", author:"Coordenação", category:"aviso",
    content:"Confira a newsletter com as principais informações sobre o mês de abril: https://canva.link/uvwjeaiv58s041z" },
];

// ─── TAREFAS ──────────────────────────────────────────────────────────────────
const DEFAULT_TASKS = [
  { id:1, title:"Avaliação ELA – Poema Diamante",           description:"Revisar estrutura de 7 versos: substantivo, adjetivos, verbos, substantivos, verbos, adjetivos, sinônimo. Ortografia e letra legível serão avaliados.", due:"2026-04-16", priority:"high",   category:"avaliacao",    status:"pending" },
  { id:2, title:"AV2 Língua Portuguesa – Texto Narrativo",  description:"História com cooperação/gentileza como tema. Usar roteiro obrigatório, diálogos com travessão e verbos dicendi variados.", due:"2026-04-17", priority:"high",   category:"avaliacao",    status:"pending" },
  { id:3, title:"Math Challenge (AV2)",                     description:"Revisar: estimativas, arredondamento (dezena/centena/milhar), valor posicional, comparação e ordenação de números, adições com reagrupamento.", due:"2026-04-17", priority:"high",   category:"avaliacao",    status:"pending" },
  { id:4, title:"Two-Minute Talk – Apresentação do poema",  description:"Mateus apresenta com Rafael e Alice. Ler os poemas, responder o SLM e treinar a apresentação oral.", due:"2026-04-17", priority:"medium", category:"apresentacao", status:"pending" },
  { id:5, title:"Leitura no App Árvore",                    description:"Realizar a leitura dos livros enviados no aplicativo Árvore.", due:"2026-04-17", priority:"medium", category:"tarefa",       status:"pending" },
  { id:6, title:"Enviar livro \"Era uma vez Dom Quixote\"",  description:"Enviar etiquetado com o nome do aluno para a Unidade 2 de PLA.", due:"2026-04-14", priority:"high",   category:"tarefa",       status:"done"    },
  { id:7, title:"Leitura Calvin e Haroldo (pág. 140–165)",  description:"Leitura prévia fundamental para atividades em sala. O livro deve retornar à escola.", due:"2026-04-11", priority:"medium", category:"tarefa",       status:"done"    },
  { id:8, title:"Science Quiz (AV2)",                       description:"Revisar: habitat, comunidade, cadeia alimentar, adaptação estrutural e comportamental, camuflagem.", due:"2026-04-15", priority:"high",   category:"avaliacao",    status:"done"    },
  { id:9, title:"Avaliação de Artes (AV2)",                  description:"Desenho de carranca com expressão facial, sombras e profundidade com lápis de cor.", due:"2026-04-13", priority:"medium", category:"avaliacao",    status:"done"    },
];

// ─── META ─────────────────────────────────────────────────────────────────────
const CAT_META = {
  avaliacao:    { label:"Avaliação",    icon:"📝", color:RED },
  tarefa:       { label:"Tarefa",       icon:"📋", color:"#d35400" },
  apresentacao: { label:"Apresentação", icon:"🎤", color:"#1a7abf" },
};
const PRI_META = {
  high:   { label:"Alta",  color:RED,       dot:"🔴" },
  medium: { label:"Média", color:"#d35400", dot:"🟡" },
  low:    { label:"Baixa", color:"#27ae60", dot:"🟢" },
};
const ANN_CAT = {
  avaliacao:  { label:"Avaliação",  color:RED,       bg:"#fdf2f2" },
  tarefa:     { label:"Tarefa",     color:"#b9770e", bg:"#fef9ee" },
  aviso:      { label:"Aviso",      color:NAVY,      bg:"#f0f4fa" },
  calendario: { label:"Calendário", color:"#6c3483", bg:"#f8f4fd" },
  atividade:  { label:"Atividade",  color:"#1e8449", bg:"#f0faf4" },
};
const STATUS_STYLE = {
  done:    { bg:"#f0faf4", border:"#27ae60", badgeBg:"#27ae60", badgeText:"✓ Concluído" },
  overdue: { bg:"#fff5f5", border:RED,       badgeBg:RED,       badgeText:"⚠ Atrasado"  },
  urgent:  { bg:"#fff8f0", border:"#e67e22", badgeBg:"#e67e22", badgeText:"🔥 Urgente"   },
  pending: { bg:WHITE,     border:"#e0e0e0", badgeBg:NAVY,      badgeText:"● Pendente"  },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function today() { return new Date().toISOString().split("T")[0]; }
function getStatus(task) {
  if (task.status === "done") return "done";
  if (task.due < today()) return "overdue";
  return (new Date(task.due) - new Date(today())) / 86400000 <= 2 ? "urgent" : "pending";
}
function fmtDate(d) {
  const [,m,day] = d.split("-");
  const ms = ["","Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  return `${parseInt(day)} ${ms[parseInt(m)]}`;
}
function dayLabel(d) { return ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"][new Date(d+"T12:00:00").getDay()]; }
function fmtShort(d) { const [,m,day]=d.split("-"); return `${parseInt(day)}/${m}`; }
function daysLabel(d) {
  const diff = Math.ceil((new Date(d) - new Date(today())) / 86400000);
  if (diff < 0) return `${Math.abs(diff)}d atrasado`;
  if (diff === 0) return "Hoje!";
  if (diff === 1) return "Amanhã";
  return `${diff} dias`;
}

// ─── STORAGE HELPERS ─────────────────────────────────────────────────────────
// Saves tasks to localStorage so they persist across page reloads
function loadTasks() {
  try {
    const saved = localStorage.getItem("mb_tasks_v1");
    if (saved) return JSON.parse(saved);
  } catch {}
  return DEFAULT_TASKS;
}
function saveTasks(tasks) {
  try { localStorage.setItem("mb_tasks_v1", JSON.stringify(tasks)); } catch {}
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [u,setU]=useState(""); const [p,setP]=useState("");
  const [show,setShow]=useState(false); const [err,setErr]=useState(""); const [loading,setLoading]=useState(false);
  function submit() {
    if(!u||!p){setErr("Preencha todos os campos.");return;}
    setLoading(true); setErr("");
    setTimeout(()=>{ const found=USERS.find(x=>x.username===u&&x.password===p); if(found) onLogin(found); else{setErr("Usuário ou senha incorretos.");setLoading(false);} },600);
  }
  return (
    <div style={{minHeight:"100vh",background:GRAY,fontFamily:"'Georgia',serif",display:"flex",flexDirection:"column"}}>
      <div style={{background:WHITE,borderBottom:`4px solid ${RED}`,padding:"14px 20px",display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:40,height:40,borderRadius:"50%",background:RED,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🐻</div>
        <div>
          <div style={{fontWeight:800,fontSize:16,color:NAVY}}>Maple Bear Vila Valqueire</div>
          <div style={{fontSize:11,color:LIGHT}}>The best of Canadian education for a global future</div>
        </div>
      </div>
      <div style={{background:`linear-gradient(135deg,${NAVY} 0%,#2d4a6e 100%)`,padding:"36px 24px 32px",textAlign:"center",color:WHITE}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"rgba(255,255,255,0.55)",marginBottom:8}}>Big Bears · Year 4</div>
        <div style={{fontSize:28,fontWeight:800,lineHeight:1.1,marginBottom:6}}>Agenda Escolar</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.65)"}}>Acompanhe as atividades do Mateus</div>
        <div style={{width:36,height:3,background:RED,margin:"14px auto 0",borderRadius:2}}/>
      </div>
      <div style={{flex:1,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"24px 20px"}}>
        <div style={{width:"100%",maxWidth:400}}>
          <div style={{background:WHITE,borderRadius:14,padding:"26px 22px",boxShadow:"0 4px 20px rgba(0,0,0,0.10)",border:"1px solid #e8e8e8"}}>
            <div style={{fontSize:16,fontWeight:800,color:NAVY,marginBottom:4}}>Bem-vindo de volta 👋</div>
            <div style={{fontSize:13,color:MUTED,marginBottom:20}}>Faça login para acessar a agenda</div>
            <div style={{marginBottom:12}}>
              <label style={{fontSize:11,fontWeight:700,color:MUTED,display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:0.8}}>Usuário</label>
              <input value={u} onChange={e=>{setU(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Digite seu usuário"
                style={{width:"100%",border:`1.5px solid ${err?RED:"#ddd"}`,borderRadius:8,padding:"11px 14px",fontSize:14,outline:"none",fontFamily:"inherit",boxSizing:"border-box",color:TEXT,background:"#fafafa"}}/>
            </div>
            <div style={{marginBottom:6}}>
              <label style={{fontSize:11,fontWeight:700,color:MUTED,display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:0.8}}>Senha</label>
              <div style={{position:"relative"}}>
                <input type={show?"text":"password"} value={p} onChange={e=>{setP(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Digite sua senha"
                  style={{width:"100%",border:`1.5px solid ${err?RED:"#ddd"}`,borderRadius:8,padding:"11px 42px 11px 14px",fontSize:14,outline:"none",fontFamily:"inherit",boxSizing:"border-box",color:TEXT,background:"#fafafa"}}/>
                <button onClick={()=>setShow(!show)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:15,color:LIGHT,padding:0}}>{show?"🙈":"👁"}</button>
              </div>
            </div>
            {err&&<div style={{background:"#fff0f0",border:"1px solid #fcc",borderRadius:7,padding:"8px 12px",fontSize:12,color:RED,margin:"10px 0"}}>⚠️ {err}</div>}
            <button onClick={submit} disabled={loading} style={{width:"100%",padding:"13px",background:RED,color:WHITE,border:"none",borderRadius:9,fontSize:15,fontWeight:700,cursor:loading?"not-allowed":"pointer",fontFamily:"inherit",marginTop:16,opacity:loading?0.8:1,boxShadow:`0 4px 12px rgba(192,57,43,0.3)`}}>
              {loading?"Entrando...":"Entrar →"}
            </button>
          </div>
          <div style={{textAlign:"center",marginTop:16,fontSize:11,color:"#ccc"}}>© 2026 Maple Bear Vila Valqueire</div>
        </div>
      </div>
    </div>
  );
}

// ─── SUBJECT ROW ──────────────────────────────────────────────────────────────
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

// ─── TASK CARD ────────────────────────────────────────────────────────────────
function TaskCard({ task, onToggle }) {
  const s = getStatus(task);
  const st = STATUS_STYLE[s];
  const cat = CAT_META[task.category] || CAT_META.tarefa;
  const pri = PRI_META[task.priority];
  return (
    <div style={{background:st.bg,borderRadius:12,border:`1.5px solid ${st.border}`,padding:"13px 14px",marginBottom:9,opacity:s==="done"?0.68:1,transition:"opacity 0.2s"}}>
      <div style={{display:"flex",gap:11,alignItems:"flex-start"}}>
        <button onClick={()=>onToggle(task.id)} style={{width:24,height:24,borderRadius:6,border:`2px solid ${s==="done"?"#27ae60":st.border}`,background:s==="done"?"#27ae60":"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,marginTop:1,transition:"all 0.15s",padding:0}}>
          {s==="done"&&<span style={{color:WHITE,fontSize:13,fontWeight:900,lineHeight:1}}>✓</span>}
        </button>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:5}}>
            <div style={{fontSize:14,fontWeight:700,color:s==="done"?MUTED:TEXT,lineHeight:1.3,textDecoration:s==="done"?"line-through":"none"}}>{task.title}</div>
            <div style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,background:st.badgeBg,color:WHITE,whiteSpace:"nowrap",flexShrink:0}}>{st.badgeText}</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap",marginBottom:s==="done"?0:6}}>
            <span style={{fontSize:11,background:"#f0f0f0",color:MUTED,padding:"2px 7px",borderRadius:20}}>{cat.icon} {cat.label}</span>
            <span style={{fontSize:11,color:pri.color,fontWeight:700}}>{pri.dot} {pri.label}</span>
            <span style={{fontSize:11,color:s==="overdue"?RED:s==="urgent"?"#e67e22":MUTED,fontWeight:s==="overdue"||s==="urgent"?700:400}}>
              📅 {fmtDate(task.due)} · {daysLabel(task.due)}
            </span>
          </div>
          {s!=="done"&&<div style={{fontSize:12,color:MUTED,lineHeight:1.6}}>{task.description}</div>}
        </div>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [user,setUser]=useState(()=>{try{return JSON.parse(sessionStorage.getItem("sb_u"))||null;}catch{return null;}});
  const [tab,setTab]=useState("agenda");
  // ✅ Tasks loaded from localStorage — persists across page reloads
  const [tasks,setTasks]=useState(()=>loadTasks());
  const [taskFilter,setTaskFilter]=useState("pending");
  const [annFilter,setAnnFilter]=useState("all");

  function login(u){sessionStorage.setItem("sb_u",JSON.stringify(u));setUser(u);}
  function logout(){sessionStorage.removeItem("sb_u");setUser(null);}

  function toggleTask(id) {
    setTasks(prev => {
      const updated = prev.map(t => t.id===id ? {...t, status: t.status==="done"?"pending":"done"} : t);
      saveTasks(updated); // 💾 persist immediately
      return updated;
    });
  }

  if(!user) return <Login onLogin={login}/>;

  // ── Task derived state ──
  const withStatus = tasks.map(t=>({...t,computed:getStatus(t)}));
  const pendingTasks = withStatus.filter(t=>t.computed!=="done");
  const doneTasks    = withStatus.filter(t=>t.computed==="done");
  const urgentTasks  = withStatus.filter(t=>t.computed==="urgent"||t.computed==="overdue");
  const total=tasks.length, doneCount=doneTasks.length, pct=Math.round(doneCount/total*100);

  const shownTasks =
    taskFilter==="pending" ? [...pendingTasks].sort((a,b)=>{
      const o={overdue:0,urgent:1,pending:2}; const pa={high:0,medium:1,low:2};
      return ((o[a.computed]??3)-(o[b.computed]??3))||((pa[a.priority]??3)-(pa[b.priority]??3))||a.due.localeCompare(b.due);
    }) :
    taskFilter==="done" ? doneTasks :
    [...withStatus].sort((a,b)=>a.due.localeCompare(b.due));

  // ── Agenda grouped ──
  const grouped = LESSONS.reduce((acc,l)=>{ (acc[l.date]=acc[l.date]||[]).push(l); return acc; },{});

  // ── Comunicados filtered ──
  const shownAnn = annFilter==="all" ? ANNOUNCEMENTS : ANNOUNCEMENTS.filter(a=>a.category===annFilter);

  const TABS=[
    {id:"agenda",      label:"Agenda",      icon:"📅"},
    {id:"tasks",       label:"Tarefas",     icon:"✅"},
    {id:"comunicados", label:"Comunicados", icon:"📢"},
  ];

  const upcoming=[
    {date:"16/04",label:"Avaliação ELA – Poema Diamante",hot:true},
    {date:"17/04",label:"Math Challenge (AV2)",hot:true},
    {date:"17/04",label:"AV2 Língua Portuguesa",hot:true},
    {date:"17/04",label:"Two-Minute Talk: Mateus, Rafael e Alice",hot:false},
    {date:"20/04",label:"Sem aula",hot:false},
  ];

  return (
    <div style={{fontFamily:"'Georgia',serif",minHeight:"100vh",background:GRAY,paddingBottom:76}}>

      {/* ── TOP BAR ── */}
      <div style={{background:WHITE,borderBottom:`4px solid ${RED}`,position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 8px rgba(0,0,0,0.07)"}}>
        <div style={{maxWidth:640,margin:"0 auto",padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,borderRadius:"50%",background:RED,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🐻</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:800,fontSize:14,color:NAVY,lineHeight:1.2}}>Maple Bear · Big Bears</div>
            <div style={{fontSize:11,color:LIGHT}}>Mateus Larocca · Year 4</div>
          </div>
          {pendingTasks.length>0&&(
            <div style={{background:RED,color:WHITE,borderRadius:20,padding:"3px 10px",fontSize:12,fontWeight:700,flexShrink:0}}>
              {pendingTasks.length} pendente{pendingTasks.length>1?"s":""}
            </div>
          )}
          <button onClick={logout} style={{background:"none",border:"1.5px solid #e0e0e0",color:MUTED,borderRadius:7,padding:"5px 10px",fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:600,flexShrink:0}}>Sair</button>
        </div>
      </div>

      <div style={{maxWidth:640,margin:"0 auto",padding:"14px 14px 0"}}>

        {/* ════════ AGENDA ════════ */}
        {tab==="agenda"&&(
          <div>
            <div style={{background:WHITE,borderRadius:12,marginBottom:16,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.05)"}}>
              <div style={{background:NAVY,padding:"10px 16px"}}>
                <span style={{color:WHITE,fontWeight:800,fontSize:13,textTransform:"uppercase",letterSpacing:0.5}}>📅 Próximos Eventos</span>
              </div>
              <div style={{padding:"10px 16px"}}>
                {upcoming.map((ev,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<upcoming.length-1?"1px solid #f5f5f5":"none"}}>
                    <div style={{minWidth:48,background:ev.hot?RED:"#e8ecf2",color:ev.hot?WHITE:NAVY,borderRadius:7,padding:"4px 6px",textAlign:"center",fontSize:11,fontWeight:700}}>{ev.date}</div>
                    <div style={{fontSize:13,color:ev.hot?RED:TEXT,fontWeight:ev.hot?700:400}}>{ev.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{fontSize:12,fontWeight:800,color:NAVY,marginBottom:10,textTransform:"uppercase",letterSpacing:0.5}}>📖 Rotina das Aulas</div>
            {Object.entries(grouped).sort((a,b)=>b[0].localeCompare(a[0])).map(([date,lessons])=>(
              <div key={date} style={{marginBottom:20}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <div style={{background:NAVY,color:WHITE,borderRadius:8,padding:"5px 14px",fontSize:12,fontWeight:700,flexShrink:0}}>
                    {dayLabel(date)}, {fmtShort(date)}
                  </div>
                  <div style={{flex:1,height:1,background:"#e0e0e0"}}/>
                </div>
                {lessons.map(lesson=>(
                  <div key={lesson.id} style={{background:WHITE,borderRadius:12,marginBottom:10,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
                    <div style={{background:lesson.period==="manhã"?"#fffbf0":"#f5f8ff",padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #efefef"}}>
                      <div style={{fontSize:13,fontWeight:700,color:NAVY}}>{lesson.teacher}</div>
                      <div style={{fontSize:11,fontWeight:700,padding:"3px 11px",borderRadius:20,background:lesson.period==="manhã"?"#fff3cd":"#dce8f7",color:lesson.period==="manhã"?"#a0720a":NAVY}}>
                        {lesson.period==="manhã"?"☀️ Manhã":"🌤 Tarde"}
                      </div>
                    </div>
                    <div style={{padding:"14px 16px 4px"}}>
                      {lesson.subjects.map((s,i)=><SubjectRow key={i} s={s}/>)}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* ════════ TAREFAS ════════ */}
        {tab==="tasks"&&(
          <div>
            {/* Progresso */}
            <div style={{background:WHITE,borderRadius:12,padding:"13px 16px",marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,0.05)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
                <div style={{fontSize:13,fontWeight:700,color:NAVY}}>📊 Progresso geral</div>
                <div style={{fontSize:13,fontWeight:800,color:pct===100?"#27ae60":NAVY}}>{doneCount}/{total} · {pct}%</div>
              </div>
              <div style={{background:"#f0f0f0",borderRadius:99,height:10,overflow:"hidden"}}>
                <div style={{width:`${pct}%`,height:"100%",background:pct===100?"#27ae60":RED,borderRadius:99,transition:"width 0.6s ease"}}/>
              </div>
              <div style={{display:"flex",gap:10,marginTop:10}}>
                {[{n:pendingTasks.length,label:"Pendentes",color:RED},{n:urgentTasks.length,label:"Urgentes",color:"#e67e22"},{n:doneCount,label:"Concluídas",color:"#27ae60"}].map((c,i)=>(
                  <div key={i} style={{flex:1,textAlign:"center",background:GRAY,borderRadius:8,padding:"7px 4px"}}>
                    <div style={{fontSize:18,fontWeight:900,color:c.color}}>{c.n}</div>
                    <div style={{fontSize:10,color:MUTED,fontWeight:600}}>{c.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerta urgente */}
            {urgentTasks.length>0&&(
              <div style={{background:"#fff5f5",border:`2px solid ${RED}`,borderRadius:12,padding:"11px 14px",marginBottom:12}}>
                <div style={{fontSize:13,fontWeight:800,color:RED,marginBottom:7}}>🚨 Atenção necessária</div>
                {urgentTasks.map(t=>(
                  <div key={t.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0",borderBottom:"1px solid #fde8e8"}}>
                    <div style={{fontSize:13,color:TEXT,fontWeight:600,flex:1,paddingRight:8}}>{t.title}</div>
                    <div style={{fontSize:11,fontWeight:700,color:t.computed==="overdue"?RED:"#e67e22",flexShrink:0}}>{daysLabel(t.due)}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Filtros */}
            <div style={{display:"flex",gap:6,marginBottom:12,background:WHITE,borderRadius:12,padding:"10px",boxShadow:"0 2px 8px rgba(0,0,0,0.05)"}}>
              {[["pending","Pendentes"],["done","Concluídas"],["all","Todas"]].map(([id,lbl])=>(
                <button key={id} onClick={()=>setTaskFilter(id)} style={{flex:1,padding:"9px 4px",borderRadius:8,border:"none",background:taskFilter===id?RED:GRAY,color:taskFilter===id?WHITE:MUTED,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s"}}>
                  {lbl}{id==="pending"&&pendingTasks.length>0&&<span style={{marginLeft:4,background:taskFilter==="pending"?"rgba(255,255,255,0.3)":RED,color:WHITE,borderRadius:10,padding:"1px 5px",fontSize:10}}>{pendingTasks.length}</span>}
                </button>
              ))}
            </div>

            {shownTasks.length===0
              ?<div style={{background:WHITE,borderRadius:12,padding:28,textAlign:"center",color:MUTED,fontSize:14}}>
                {taskFilter==="done"?"Nenhuma tarefa concluída ainda.":"✅ Tudo em dia!"}
               </div>
              :shownTasks.map(t=><TaskCard key={t.id} task={t} onToggle={toggleTask}/>)
            }
          </div>
        )}

        {/* ════════ COMUNICADOS ════════ */}
        {tab==="comunicados"&&(
          <div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
              {[["all","Todos"],...Object.entries(ANN_CAT).map(([id,c])=>[id,c.label])].map(([id,lbl])=>(
                <button key={id} onClick={()=>setAnnFilter(id)} style={{padding:"6px 14px",borderRadius:20,fontSize:12,fontWeight:700,border:annFilter===id?`2px solid ${RED}`:"1.5px solid #ddd",background:annFilter===id?RED:WHITE,color:annFilter===id?WHITE:MUTED,cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s"}}>
                  {lbl}
                </button>
              ))}
            </div>
            {shownAnn.map(ann=>{
              const c=ANN_CAT[ann.category]||ANN_CAT.aviso;
              return(
                <div key={ann.id} style={{background:WHITE,borderRadius:12,marginBottom:12,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.05)"}}>
                  <div style={{borderLeft:`5px solid ${c.color}`,padding:"14px 16px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:5}}>
                      <div style={{fontSize:15,fontWeight:800,color:NAVY,lineHeight:1.3,flex:1}}>{ann.title}</div>
                      <div style={{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:20,background:c.bg,color:c.color,whiteSpace:"nowrap",flexShrink:0,border:`1px solid ${c.color}22`}}>{c.label}</div>
                    </div>
                    <div style={{fontSize:11,color:LIGHT,marginBottom:8}}>{ann.date} · {ann.author}</div>
                    <div style={{fontSize:13,color:MUTED,lineHeight:1.75}}>{ann.content}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── BOTTOM NAV ── */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:WHITE,borderTop:"1px solid #eee",display:"flex",zIndex:100,boxShadow:"0 -2px 12px rgba(0,0,0,0.08)"}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"10px 4px 8px",border:"none",background:"transparent",cursor:"pointer",fontFamily:"inherit",display:"flex",flexDirection:"column",alignItems:"center",gap:3,position:"relative"}}>
            {t.id==="tasks"&&pendingTasks.length>0&&(
              <div style={{position:"absolute",top:6,right:"calc(50% - 18px)",width:16,height:16,background:RED,borderRadius:"50%",fontSize:9,fontWeight:900,color:WHITE,display:"flex",alignItems:"center",justifyContent:"center"}}>{pendingTasks.length}</div>
            )}
            <span style={{fontSize:20}}>{t.icon}</span>
            <span style={{fontSize:10,fontWeight:tab===t.id?800:400,color:tab===t.id?RED:LIGHT}}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
