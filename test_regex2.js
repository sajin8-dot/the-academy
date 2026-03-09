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
  .replace(/<p>(\[AWAIT MIDI:[\s\S]+?\])<\/p>/g, '')
  .replace(/<p>(\[START DRONE:[\s\S]+?\])<\/p>/g, '')
  .replace(/<p>(\[FADE DRONE:[\s\S]+?\])<\/p>/g, '')
  .replace(/<p>(\[ON SUCCESS:[\s\S]+?\])<\/p>/g, '')
  .replace(/<p>(\[ON FAILURE:[\s\S]+?\])<\/p>/g, '');

cleanedHtml = cleanedHtml
  .replace(/\[AWAIT MIDI:[\s\S]+?\]/g, '')
  .replace(/\[START DRONE:[\s\S]+?\]/g, '')
  .replace(/\[FADE DRONE:[\s\S]+?\]/g, '')
  .replace(/\[ON SUCCESS:[\s\S]+?\]/g, '')
  .replace(/\[ON FAILURE:[\s\S]+?\]/g, '');

const componentRegex = /(?:<p>)?\[(SHEET_MUSIC|PLAY MIDI):\s*([\s\S]+?)\](?:<\/p>)?/g;

const parts = cleanedHtml.split(componentRegex);
console.log(parts);
