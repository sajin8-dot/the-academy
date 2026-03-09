import { remark } from 'remark';
import html from 'remark-html';

async function main() {
  const content = `
[ON FAILURE: feedback="The steps are even, like a heartbeat. If you're lost, find Home (the Tonic) and start the climb again."]

{{SHEET_MUSIC: notes="C4/q, D4/q, E4/h"}}

---
`;
  const result = await remark().use(html).process(content);
  console.log(result.toString());
}
main();
