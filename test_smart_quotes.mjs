import { remark } from 'remark';
import html from 'remark-html';

async function main() {
  const content = '{{SHEET_MUSIC: notes="C4/q, D4/q, E4/h"}}';
  const result = await remark().use(html).process(content);
  console.log(result.toString());
  console.log([...result.toString()].map(c => c.charCodeAt(0).toString(16)));
}
main();
