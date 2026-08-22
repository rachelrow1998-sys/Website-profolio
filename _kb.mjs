import { chromium } from "playwright";
const b = await chromium.launch({ executablePath:"/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport:{width:1280,height:800}, locale:"zh-CN" });
await p.goto("http://127.0.0.1:8899/_preview_standalone.html",{waitUntil:"domcontentloaded"});
await p.waitForTimeout(3000);
let offscreen = 0, tabbed = 0;
for (let i=0;i<45;i++){
  await p.keyboard.press("Tab");
  await p.waitForTimeout(750);
  const r = await p.evaluate(()=>{
    const e=document.activeElement; if(!e||e===document.body) return null;
    const b=e.getBoundingClientRect();
    return { tag:e.tagName, vis: b.top>=0 && b.bottom<=window.innerHeight+2 };
  });
  if (!r) continue;
  tabbed++;
  if (!r.vis) { offscreen++; if(offscreen<4) console.log("  屏幕外:", r.tag); }
}
console.log(`Tab 了 ${tabbed} 个元素，屏幕外的有 ${offscreen} 个`);
await b.close();
