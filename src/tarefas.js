// ═══════════════════════════════════════════════════════════════════
//  TAREFAS.JS — edite este arquivo para gerenciar as tarefas
//
//  Após adicionar ou remover tarefas, incremente o TASKS_VERSION
//  (ex: "v1" → "v2") para que todos recebam a lista atualizada.
// ═══════════════════════════════════════════════════════════════════

export const TASKS_VERSION = "v1";

// status: "pending" | "done"
// priority: "high" | "medium" | "low"
// category: "avaliacao" | "tarefa" | "apresentacao"
// due: "YYYY-MM-DD"

export const DEFAULT_TASKS = [
  {
    id: 1,
    title: "Avaliação ELA – Poema Diamante",
    desc: "Revisar estrutura de 7 versos: substantivo, adjetivos, verbos, substantivos, verbos, adjetivos, sinônimo. Ortografia e letra legível serão avaliados.",
    due: "2026-04-16",
    priority: "high",
    category: "avaliacao",
    status: "pending",
  },
  {
    id: 2,
    title: "AV2 Língua Portuguesa – Texto Narrativo",
    desc: "Escrever história com cooperação/gentileza. Roteiro obrigatório, diálogos com travessão e verbos dicendi variados (exclamou, sugeriu, cochichou...).",
    due: "2026-04-17",
    priority: "high",
    category: "avaliacao",
    status: "pending",
  },
  {
    id: 3,
    title: "Math Challenge (AV2)",
    desc: "Revisar: estimativas, arredondamento (dezena/centena/milhar), valor posicional, comparação/ordenação de números, adições com reagrupamento.",
    due: "2026-04-17",
    priority: "high",
    category: "avaliacao",
    status: "pending",
  },
  {
    id: 4,
    title: "Two-Minute Talk – Apresentação do poema",
    desc: "Mateus apresenta com Rafael e Alice. Ler os poemas, responder o SLM e treinar a apresentação oral para a turma.",
    due: "2026-04-17",
    priority: "medium",
    category: "apresentacao",
    status: "pending",
  },
  {
    id: 5,
    title: "Leitura no App Árvore",
    desc: "Realizar a leitura dos livros enviados no aplicativo Árvore.",
    due: "2026-04-17",
    priority: "medium",
    category: "tarefa",
    status: "pending",
  },
  {
    id: 6,
    title: 'Enviar livro "Era uma vez Dom Quixote"',
    desc: "Enviar etiquetado com o nome do aluno para a Unidade 2 de PLA.",
    due: "2026-04-14",
    priority: "high",
    category: "tarefa",
    status: "done",
  },
  {
    id: 7,
    title: "Leitura Calvin e Haroldo (pág. 140–165)",
    desc: "Leitura prévia fundamental para atividades em sala. O livro deve retornar à escola.",
    due: "2026-04-11",
    priority: "medium",
    category: "tarefa",
    status: "done",
  },
  {
    id: 8,
    title: "Science Quiz (AV2)",
    desc: "Revisar: habitat, comunidade, cadeia alimentar, adaptação estrutural e comportamental, camuflagem.",
    due: "2026-04-15",
    priority: "high",
    category: "avaliacao",
    status: "done",
  },
  {
    id: 9,
    title: "Avaliação de Artes (AV2)",
    desc: "Desenho de carranca com expressão facial, sombras e profundidade com lápis de cor.",
    due: "2026-04-13",
    priority: "medium",
    category: "avaliacao",
    status: "done",
  },
];
