// Parses aulas.txt format into structured lesson objects
export function parseAulas(text) {
  const lessons = [];
  const blocks = text.split("---").map(b => b.trim()).filter(Boolean);

  blocks.forEach((block, idx) => {
    const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
    const obj = { id: idx + 1, subjects: [] };

    lines.forEach(line => {
      if (line.startsWith("DATA:")) obj.date = line.replace("DATA:", "").trim();
      else if (line.startsWith("PROFESSOR:")) obj.teacher = line.replace("PROFESSOR:", "").trim();
      else if (line.startsWith("PERIODO:")) obj.period = line.replace("PERIODO:", "").trim();
      else if (line.startsWith("MATERIA:")) {
        const parts = line.replace("MATERIA:", "").trim().split("|");
        const nameRaw = parts[0]?.trim() || "";
        // Extract emoji if present at start
        const emojiMatch = nameRaw.match(/^(\p{Emoji_Presentation}|\p{Extended_Pictographic})\s*/u);
        const icon = emojiMatch ? emojiMatch[0].trim() : "📌";
        const name = emojiMatch ? nameRaw.slice(emojiMatch[0].length).trim() : nameRaw;
        const detail = parts[1]?.trim() || "";
        obj.subjects.push({ icon, name: detail ? `${name} – ${detail}` : name });
      }
    });

    if (obj.date && obj.teacher) lessons.push(obj);
  });

  return lessons;
}

// Parses comunicados.txt format into structured announcement objects
export function parseComunicados(text) {
  const announcements = [];
  const blocks = text.split("---").map(b => b.trim()).filter(Boolean);

  blocks.forEach((block, idx) => {
    const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
    const obj = { id: idx + 1 };

    lines.forEach(line => {
      if (line.startsWith("DATA:")) obj.date = line.replace("DATA:", "").trim();
      else if (line.startsWith("TITULO:")) obj.title = line.replace("TITULO:", "").trim();
      else if (line.startsWith("AUTOR:")) obj.author = line.replace("AUTOR:", "").trim();
      else if (line.startsWith("CATEGORIA:")) obj.category = line.replace("CATEGORIA:", "").trim();
      else if (line.startsWith("CONTEUDO:")) obj.content = line.replace("CONTEUDO:", "").trim();
    });

    if (obj.date && obj.title) announcements.push(obj);
  });

  return announcements;
}
