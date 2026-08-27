/* ============================================================================
   自动截图脚本 —— 把 data.js 里所有网站的首页截下来，存进 assets/screenshots/
   ----------------------------------------------------------------------------
   在你自己的电脑上跑（需要装 Node.js）：

     npm install
     npx playwright install chromium
     node tools/capture-screenshots.mjs

   跑完刷新网页，作品卡片上的占位图就会自动变成真实截图。
   只想重截某几个：  node tools/capture-screenshots.mjs exa-energy furfoo-pet
   ============================================================================ */
import { readFileSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(resolve(root, "assets/js/data.js"), "utf8");
const ALL = eval(src.replace(/^const SITE\b/m, "var SITE").replace(/^const PROJECTS\b/m, "var PROJECTS") + "; PROJECTS");

const only = process.argv.slice(2);
const list = only.length ? ALL.filter((p) => only.includes(p.slug)) : ALL;

if (!list.length) {
  console.error("没有匹配的项目。可用的 slug：\n  " + ALL.map((p) => p.slug).join("\n  "));
  process.exit(1);
}

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error("\n⚠️  找不到 playwright。请先执行：\n     npm install\n     npx playwright install chromium\n");
  process.exit(1);
}

const outDir = resolve(root, "assets/screenshots");
mkdirSync(outDir, { recursive: true });

// 允许用环境变量指定浏览器位置（某些环境里 Playwright 找不到自带的那份）
//   CHROME_PATH=/path/to/chrome node tools/capture-screenshots.mjs
let browser;
try {
  browser = await chromium.launch(
    process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}
  );
} catch (e) {
  console.error("\n⚠️  浏览器启动失败。\n");
  if (/Executable doesn't exist|install/i.test(e.message)) {
    console.error("   还没下载浏览器，执行这一行就好：\n");
    console.error("     npx playwright install chromium\n");
  } else {
    console.error("   " + e.message.split("\n")[0] + "\n");
    console.error("   如果你电脑上已经有 Chrome，可以直接指过去：\n");
    console.error("     CHROME_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' npm run shots\n");
  }
  process.exit(1);
}
const ctx = await browser.newContext({
  viewport: { width: 1600, height: 1000 },
  deviceScaleFactor: 1.5,                    // 高清屏更清楚
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36"
});

let ok = 0, fail = 0;

for (const p of list) {
  const page = await ctx.newPage();
  process.stdout.write(`→ ${p.name.padEnd(24)} ${p.url} ... `);
  try {
    await page.goto(p.url, { waitUntil: "networkidle", timeout: 45000 });
    await page.waitForTimeout(2500);                     // 等动画/懒加载图片
    await page.evaluate(() => window.scrollTo(0, 600));  // 触发懒加载
    await page.waitForTimeout(1200);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(700);

    // 关掉常见的 cookie 弹窗 / 弹出广告，避免挡住截图
    await page.evaluate(() => {
      const kill = ["cookie", "consent", "gdpr", "popup", "modal", "newsletter"];
      document.querySelectorAll("div,section,aside").forEach((el) => {
        const id = ((el.id || "") + " " + (el.className || "")).toString().toLowerCase();
        const fixed = getComputedStyle(el).position === "fixed";
        if (fixed && kill.some((k) => id.includes(k))) el.remove();
      });
    });

    await page.screenshot({
      path: resolve(outDir, `${p.slug}.jpg`),
      type: "jpeg",
      quality: 82,
      clip: { x: 0, y: 0, width: 1600, height: 1000 }
    });
    console.log("✓");
    ok++;
  } catch (e) {
    console.log("✗  " + e.message.split("\n")[0]);
    fail++;
  }
  await page.close();
}

await browser.close();
console.log(`\n完成：成功 ${ok} 个，失败 ${fail} 个。截图存在 assets/screenshots/`);

/* 抓完必须重新生成清单，否则网页根本不知道截图来了。
   网页不会盲目去请求一个可能不存在的 .jpg（那是 10 次白白的 404），
   而是读 assets/js/shots.js 里那份「哪些已经有截图」的名单 —— 那份名单由 sync 生成。
   以前这里只说「刷新就能看到」，但没有帮你重跑 sync，等于说了一句做不到的话。 */
if (ok) {
  try {
    execFileSync(process.execPath, [resolve(root, "tools/sync-static.mjs")], { stdio: "inherit" });
    console.log("\n刷新网页就能看到真实截图了。");
    console.log("如果你是用单文件版本发给客户，再跑一次：npm run build");
  } catch {
    console.log("\n⚠️  截图抓好了，但清单没更新成功。手动跑一次：npm run sync");
  }
}
if (fail) {
  console.log("\n失败的通常是网站太慢、或者有防爬虫。两个办法：");
  console.log("  1. 单独重跑那几个：node tools/capture-screenshots.mjs <slug> <slug>");
  console.log("  2. 自己手动截图，存成 assets/screenshots/<slug>.jpg（建议 1600×1000）");
}
