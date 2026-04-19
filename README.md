# 🎒 Agenda Escolar – Big Bears

App de gestão de agenda escolar com assistente de IA.

---

## 📁 Estrutura do projeto

```
agenda-escolar/
├── api/
│   └── chat.js              ← Proxy seguro para a API da IA (não mexer)
├── src/
│   ├── data/
│   │   ├── aulas.txt        ← ✏️ ATUALIZAR DIARIAMENTE
│   │   └── comunicados.txt  ← ✏️ ATUALIZAR CONFORME NECESSÁRIO
│   ├── App.jsx              ← Código principal do app
│   ├── parseData.js         ← Parser dos arquivos .txt (não mexer)
│   └── main.jsx             ← Entrada do app (não mexer)
├── .env.example             ← Modelo do arquivo de variáveis de ambiente
├── vercel.json              ← Configuração do Vercel (não mexer)
└── package.json
```

---

## ✏️ Como atualizar os dados diariamente

### Aulas (`src/data/aulas.txt`)

Adicione um novo bloco no topo do arquivo seguindo o formato:

```
---
DATA: 2026-04-22
PROFESSOR: Miss Thayná e Patrícia
PERIODO: tarde
MATERIA: 🧘 Momento de calma | Atividade de relaxamento após o lanche
MATERIA: 📚 PLA | Leitura e interpretação de Dom Quixote
MATERIA: 🌍 Geografia | Estudo das regiões do Brasil
---
```

**Campos obrigatórios:** `DATA`, `PROFESSOR`, `PERIODO` (manhã ou tarde), `MATERIA`  
**Formato MATERIA:** `EMOJI Nome da Matéria | Descrição do que foi feito`

---

### Comunicados (`src/data/comunicados.txt`)

Adicione um novo bloco no topo do arquivo:

```
---
DATA: 2026-04-22
TITULO: Nome do comunicado
AUTOR: Miss Thayná
CATEGORIA: aviso
CONTEUDO: Texto completo do comunicado aqui.
---
```

**Categorias disponíveis:**
- `avaliacao` → vermelho (provas, trabalhos avaliativos)
- `tarefa` → laranja (tarefas para casa)
- `aviso` → azul (avisos gerais)
- `calendario` → roxo (datas e calendário)
- `atividade` → verde (atividades especiais)

---

## 🚀 Como publicar no Vercel (primeira vez)

1. **Crie uma conta** em [github.com](https://github.com) e em [vercel.com](https://vercel.com)

2. **Suba o projeto para o GitHub:**
```bash
git init
git add .
git commit -m "primeiro commit"
git remote add origin https://github.com/SEU_USUARIO/agenda-escolar.git
git push -u origin main
```

3. **No Vercel:**
   - Clique em **Add New Project**
   - Conecte seu GitHub e selecione o repositório
   - Antes de clicar em Deploy, vá em **Environment Variables** e adicione:
     - Nome: `ANTHROPIC_API_KEY`
     - Valor: sua chave da API (pegue em [console.anthropic.com](https://console.anthropic.com))
   - Clique em **Deploy**

4. Pronto! Seu app estará em `https://agenda-escolar.vercel.app` 🎉

---

## 🔄 Como atualizar o conteúdo depois de publicado

Basta editar os arquivos `aulas.txt` ou `comunicados.txt`, fazer commit e push:

```bash
git add src/data/
git commit -m "atualiza aulas do dia 22/04"
git push
```

O Vercel detecta automaticamente e publica a nova versão em ~30 segundos.

---

## 👥 Usuários de acesso

| Usuário       | Senha        | Perfil         |
|---------------|--------------|----------------|
| `responsavel` | `mateus2026` | Família Larocca |
| `admin`       | `escola2026` | Coordenação     |

Para alterar senhas, edite o arquivo `src/App.jsx` na seção `const USERS`.
