const html = `</p>\n<p>{{SHEET_MUSIC: notes="C4/q, D4/q, E4/h"}}</p>\n<hr>`;
const sheetMusicRegex = /\{\{SHEET_MUSIC:\s*notes="([^"]+)"\}\}/g;
const cleanedHtml = html.replace(/<p>(\{\{SHEET_MUSIC:\s*notes="[^"]+"\}\})<\/p>/g, '$1');
console.log("CLEANED:", cleanedHtml);
const parts = cleanedHtml.split(sheetMusicRegex);
console.log("PARTS:", parts);
