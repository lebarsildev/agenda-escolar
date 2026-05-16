// ─── parseAulas ──────────────────────────────────────────────────────────────
export function parseAulas(raw) {
  const lessons = [];
  const normalized = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const blocks = normalized
    .split(/^---+$/m)
    .map(b => b.trim())
    .filter(b => b.length > 0);

  blocks.forEach((block, idx) => {
    const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
    const obj = { id: idx + 1, subjects: [] };

    lines.forEach(line => {
      if (line.startsWith("DATA:"))           obj.date    = line.slice(5).trim();
      else if (line.startsWith("PROFESSOR:")) obj.teacher = line.slice(10).trim();
      else if (line.startsWith("PERIODO:"))   obj.period  = line.slice(8).trim();
      else if (line.startsWith("MATERIA:")) {
        const rest   = line.slice(8).trim();
        const pipe   = rest.indexOf("|");
        const head   = pipe > -1 ? rest.slice(0, pipe).trim() : rest;
        const detail = pipe > -1 ? rest.slice(pipe + 1).trim() : rest;
        const match  = head.match(/^(\p{Extended_Pictographic}[\uFE0F]?\s*)/u);
        const icon   = match ? match[1].trim() : "📌";
        const name   = match ? head.slice(match[0].length).trim() : head;
        obj.subjects.push({ icon, name, detail });
      }
    });

    if (obj.date && obj.teacher && obj.subjects.length > 0) lessons.push(obj);
  });

  return lessons;
}

// ─── parseComunicados ─────────────────────────────────────────────────────────
export function parseComunicados(raw) {
  const list = [];
  const normalized = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const blocks = normalized
    .split(/^---+$/m)
    .map(b => b.trim())
    .filter(b => b.length > 0);

  blocks.forEach((block, idx) => {
    const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
    const obj = { id: idx + 1 };

    lines.forEach(line => {
      if (line.startsWith("DATA:"))           obj.date     = line.slice(5).trim();
      else if (line.startsWith("TITULO:"))    obj.title    = line.slice(7).trim();
      else if (line.startsWith("AUTOR:"))     obj.author   = line.slice(6).trim();
      else if (line.startsWith("CATEGORIA:")) obj.category = line.slice(10).trim();
      else if (line.startsWith("CONTEUDO:"))  obj.content  = line.slice(9).trim();
    });

    if (obj.title && obj.content) list.push(obj);
  });

  return list;
}

// ─── parseCalendario ─────────────────────────────────────────────────────────
// Reads calendario.txt — school events, holidays, recesses.
// Format per block:
//   DATA: YYYY-MM-DD
//   TITULO: Event name
//   CATEGORIA: feriado | evento | recesso | avaliacao
export function parseCalendario(raw) {
  const list = [];
  const normalized = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const blocks = normalized
    .split(/^---+$/m)
    .map(b => b.trim())
    .filter(b => b.length > 0);

  blocks.forEach((block, idx) => {
    const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
    const obj = { id: idx + 1 };

    lines.forEach(line => {
      if (line.startsWith("DATA:"))           obj.date     = line.slice(5).trim();
      else if (line.startsWith("TITULO:"))    obj.title    = line.slice(7).trim();
      else if (line.startsWith("CATEGORIA:")) obj.category = line.slice(10).trim();
      else if (line.startsWith("DESCRICAO:")) obj.desc     = line.slice(9).trim();
    });

    if (obj.date && obj.title) list.push(obj);
  });

  // Sort by date ascending
  return list.sort((a, b) => a.date.localeCompare(b.date));
}
