import { chromium } from "playwright";
const b = await chromium.launch({ executablePath:"/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport:{width:1280,height:800}, locale:"zh-CN" });
await p.goto("http://127.0.0.1:8899/_preview_standalone.html",{waitUntil:"domcontentloaded"});
await p.waitForTimeout(3000);
const bad=[];
for (let i=0;i<45;i++){
  await p.keyboard.press("Tab"); await p.waitForTimeout(1500);
  const r = await p.evaluate(()=>{
    const e=document.activeElement; if(!e||e===document.body) return null;
    const b=e.getBoundingClientRect();
    return { tag:e.tagName, cls:(e.className||"").toString().slice(0,30), txt:(e.textContent||"").trim().slice(0,18),
             top:Math.round(b.top), bottom:Math.round(b.bottom), h:Math.round(b.height),
             fixed:getComputedStyle(e).position==="fixed"||!!e.closest(".hud,.fab"),
             vis: b.top>=0 && b.bottom<=window.innerHeight+2 };
  });
  if (r && !r.vis) bad.push(r);
}
console.log(JSON.stringify(bad,null,1));
await b.close();
