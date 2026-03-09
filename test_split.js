const html = `<p>{{SHEET_MUSIC: notes="C4/q, D4/q, E4/h"}}</p>`;
const regex = /\{\{SHEET_MUSIC:\s*notes="([^"]+)"\}\}/g;
const cleaned = html.replace(/<p>(\{\{SHEET_MUSIC:\s*notes="[^"]+"\}\})<\/p>/g, '$1');
console.log("Cleaned:", cleaned);
console.log("Split:", cleaned.split(regex));
