// ─── parseAulas ──────────────────────────────────────────────────────────────
// Reads aulas.txt and returns structured lesson objects.
// To update lessons: edit src/data/aulas.txt only.
export function parseAulas(raw) {
  const lessons = [];
  // Normalize line endings, then split on --- (handles single or double --- gracefully)
  const normalized = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const blocks = normalized
    .split(/^---+$/m)              // split on any line that is only dashes
    .map(b => b.trim())
    .filter(b => b.length > 0);   // drop empty blocks (catches double ---)

  blocks.forEach((block, idx) => {
    const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
    const obj = { id: idx + 1, subjects: [] };

    lines.forEach(line => {
      if (line.startsWith("DATA:"))          obj.date    = line.slice(5).trim();
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
// Reads comunicados.txt and returns structured announcement objects.
// To update announcements: edit src/data/comunicados.txt only.
export function parseComunicados(raw) {
  const list = [];
  const normalized = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const blocks = normalized
    .split(/^---+$/m)
    .map(b => b.trim())
    .filter(b => b.length > 0);   // drop empty blocks between double ---

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
