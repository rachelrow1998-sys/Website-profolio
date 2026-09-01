import { chromium } from 'playwright';
import fs from 'fs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage();
for (const f of fs.readdirSync('assets/screenshots').filter(f=>f.endsWith('.jpg'))) {
  const d = await p.evaluate((src) => new Promise(res => {
    const i = new Image(); i.onload = () => res([i.naturalWidth, i.naturalHeight]); i.src = src;
  }), 'file:///home/user/Website-profolio/assets/screenshots/' + f);
  console.log(f, d.join('x'));
}
await b.close();
