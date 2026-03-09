const contentHtml = `
<p>Some text</p>
<p>[START DRONE: freq=260]</p>
<p>[PLAY MIDI: sequence=["E4", "F4"]]</p>
<p>[AWAIT MIDI: sequence=["E4"]]</p>
<p>[ON SUCCESS: BLOOM]</p>
<p>[SHEET_MUSIC: notes="C4/q"]</p>
<p>End text</p>
`;

let cleanedHtml = contentHtml
  .replace(/<p>(\[AWAIT MIDI:[^\]]+\])<\/p>/g, '')
  .replace(/<p>(\[START DRONE:[^\]]+\])<\/p>/g, '')
  .replace(/<p>(\[FADE DRONE:[^\]]+\])<\/p>/g, '')
  .replace(/<p>(\[ON SUCCESS:[^\]]+\])<\/p>/g, '')
  .replace(/<p>(\[ON FAILURE:[^\]]+\])<\/p>/g, '');

cleanedHtml = cleanedHtml
  .replace(/\[AWAIT MIDI:[^\]]+\]/g, '')
  .replace(/\[START DRONE:[^\]]+\]/g, '')
  .replace(/\[FADE DRONE:[^\]]+\]/g, '')
  .replace(/\[ON SUCCESS:[^\]]+\]/g, '')
  .replace(/\[ON FAILURE:[^\]]+\]/g, '');

const componentRegex = /(?:<p>)?\[(SHEET_MUSIC|PLAY MIDI):\s*([^\]]+)\](?:<\/p>)?/g;

const parts = cleanedHtml.split(componentRegex);
console.log(parts);
