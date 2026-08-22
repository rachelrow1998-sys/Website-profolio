import { chromium } from "playwright";
const OUT="/tmp/claude-0/-home-user-Website-profolio/ee6c3eb4-d335-5b20-b9e8-09d08ebd9912/scratchpad";
const b = await chromium.launch({ executablePath:"/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const ctx = await b.newContext({
  viewport:{width:1280,height:760}, locale:"zh-CN",
  recordVideo:{ dir: OUT+"/vid", size:{width:1280,height:760} }
});
const p = await ctx.newPage();
await p.goto("http://127.0.0.1:8899/_preview_standalone.html",{waitUntil:"domcontentloaded"});

// 1. 开机动画 + 主菜单入场
await p.waitForTimeout(3400);

// 2. 鼠标划过菜单项（磁吸 + 展开横条）
for (const n of [1,2,3,4]) {
  const el = await p.$(`.menu__list li:nth-child(${n}) a`);
  const bx = await el.boundingBox();
  await p.mouse.move(bx.x+bx.width/2, bx.y+bx.height/2, {steps:12});
  await p.waitForTimeout(420);
}
await p.waitForTimeout(300);

// 3. 平滑滚动往下（小步长 = 连续滚动，能看到惯性和倾斜）
const H = await p.evaluate(()=>parseInt(document.body.style.height)||document.body.scrollHeight);
for (let y=0; y<H*0.42; y+=42){ await p.evaluate(v=>window.scrollTo(0,v), y); await p.waitForTimeout(16); }
await p.waitForTimeout(900);

// 4. 停在作品区，鼠标划过卡片（3D 倾斜）
const card = await p.$(".proj");
if (card){
  const bx = await card.boundingBox();
  await p.mouse.move(bx.x+40, bx.y+40, {steps:10}); await p.waitForTimeout(320);
  await p.mouse.move(bx.x+bx.width-40, bx.y+bx.height-60, {steps:20}); await p.waitForTimeout(420);
  await p.mouse.move(bx.x+bx.width/2, bx.y+30, {steps:14}); await p.waitForTimeout(400);
}

// 5. 点筛选
const btns = await p.$$("#filters button");
if (btns[2]) { await btns[2].click(); await p.waitForTimeout(1100); }
if (btns[0]) { await btns[0].click(); await p.waitForTimeout(900); }

// 6. 继续滚到结尾
for (let y=Math.round(H*0.42); y<H; y+=48){ await p.evaluate(v=>window.scrollTo(0,v), y); await p.waitForTimeout(16); }
await p.waitForTimeout(1600);

// 7. 切换语言
for (const l of ["en","ms","zh"]) {
  await p.click(`[data-lang-btn="${l}"]`);
  await p.waitForTimeout(750);
}
await p.waitForTimeout(600);

await ctx.close();
await b.close();
console.log("录制完成");
