/* 从 data.js 生成 index.html 里两块「必须在首屏就存在」的静态内容：
     1. <noscript> 兜底列表   —— 关掉 JS 也看得到 10 个作品
     2. 手机版 Hero 的 4 张卡 —— 由 JS 插入会把内容推走，产生 CLS

   改了作品列表之后跑一次：npm run sync                                  */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(resolve(root, "assets/js/data.js"), "utf8");
const DATA = eval(src.replace(/^const SITE\b/m, "var SITE").replace(/^const PROJECTS\b/m, "var PROJECTS") + "; ({ SITE: SITE, PROJECTS: PROJECTS })");
const PROJECTS = DATA.PROJECTS;
const SITE = DATA.SITE;

const esc = (v) => String(v ?? "")
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const items = PROJECTS.map((p, i) =>
  `      <li>
        <b>${String(i + 1).padStart(2, "0")}</b>
        <a href="${esc(p.url)}" rel="noopener">${esc(p.name)}</a>
        <span>${esc(p.year || "")}</span>
        <p>${esc((p.blurb && (p.blurb.zh || p.blurb.en)) || "")}</p>
      </li>`).join("\n");

const block = `\n    <ol class="noscript__list">\n${items}\n    </ol>\n    `;

/* 哪些作品已经有真实截图。写成清单给运行时用 ——
   否则每张卡都会先请求一个不存在的 .jpg、吃一个 404、再回退到占位图：
   20 个白费请求 + 控制台一堆错误 + 破图闪一下。 */
const has = (slug) => existsSync(resolve(root, `assets/screenshots/${slug}.jpg`));
const shot = (p) => has(p.slug) ? `assets/screenshots/${p.slug}.jpg`
                                : `assets/img/placeholder/${p.slug}.svg`;
const shotList = PROJECTS.filter((p) => has(p.slug)).map((p) => p.slug);

writeFileSync(resolve(root, "assets/js/shots.js"),
`/* 自动生成，不要手改 —— 跑 npm run sync 重新生成。
   列出「已经抓到真实截图」的作品 slug。抓完新截图记得重跑一次。 */
const SHOTS = ${JSON.stringify(shotList)};

/* 你的照片放进来了没有。没有就别去请求它，直接用占位剪影。 */
const HAS_PHOTO = ${existsSync(resolve(root, "assets/img/me.jpg"))};
`);

/* 手机 Hero：前 4 个作品，轻微错位 stack */
const mob = PROJECTS.slice(0, 4).map((p, i) =>
  `        <figure class="hero-mob__card" style="--i:${i}">
          <img loading="${i < 2 ? "eager" : "lazy"}" alt="" width="800" height="500"
               src="${esc(shot(p))}">
          <figcaption>${esc(p.name)}</figcaption>
        </figure>`).join("\n");

let html = readFileSync(resolve(root, "index.html"), "utf8");
const before = html;

html = html.replace(/(<!-- NOSCRIPT:START -->)[\s\S]*?(<!-- NOSCRIPT:END -->)/, (_, a, b) => a + block + b);
html = html.replace(/(<!-- HEROMOB:START -->)[\s\S]*?(<!-- HEROMOB:END -->)/, (_, a, b) => a + "\n" + mob + "\n        " + b);

/* ── 品牌名 ─────────────────────────────────────────────────────────
   改名字只该改 data.js 一个地方。页面上大部分位置（顶栏、封面、页脚、
   开机动画）是 JS 从 SITE 读的，本来就跟着变；但下面这四处是写死在
   index.html 里的静态内容，JS 管不到 —— 分享到 WhatsApp 时显示的标题、
   浏览器标签页、页签图标、关掉 JS 的兜底页。
   以前要手动改四个地方，漏一个就会出现「新名字的网站，旧名字的分享卡」。 */
const brand = String(SITE.brand || "Studio").trim();
const mono  = String(SITE.monogram || "JH").trim();
/* 页签图标是一段内联 SVG，住在 HTML 属性里，用的是单引号 ——
   缩写里带引号或尖括号会把属性截断，整个 favicon 失效。先剔掉。 */
const monoSafe = mono.replace(/[<>&"']/g, "").slice(0, 3) || "JH";

html = html.replace(/<title>[^<]*<\/title>/,
  () => `<title>${esc(brand)} — 网页设计与开发 | Web Design & Development Malaysia</title>`);
html = html.replace(/(<meta property="og:title" content=")[^"]*(")/,
  (_, a, b) => a + esc(brand) + " — 网页设计与开发 | Web Design & Development" + b);
html = html.replace(/(text-anchor='middle'>)[^<]*(<\/text>)/,
  (_, a, b) => a + monoSafe + b);
html = html.replace(/(<h2>)[^<]*(<\/h2>)/,
  (_, a, b) => a + esc(brand) + " — Selected Works" + b);
/* 封面大标题上方那行、以及开机动画中间的缩写，也是写死的。
   ⚠️ 这两处必须在 HTML 里就是对的，不能等 JS 来改：
   开机动画在首帧就可见，JS 要等 DOMContentLoaded 才跑 ——
   访客会先看到旧缩写闪一下再变成新的。 */
html = html.replace(/(<span class="boot__mark" id="boot-mark">)[^<]*(<\/span>)/,
  (_, a, b) => a + esc(monoSafe) + b);
html = html.replace(/(<span id="cover-name">)[^<]*(<\/span>)/,
  (_, a, b) => a + esc(brand.toUpperCase()) + b);

/* 内容没变化不是错误（幂等重跑很正常）。真正的错误是标记不见了。 */
if (!/<!-- NOSCRIPT:START -->/.test(before) || !/<!-- HEROMOB:START -->/.test(before)) {
  console.error("⚠️ index.html 里找不到 NOSCRIPT / HEROMOB 标记，无法同步");
  process.exit(1);
}
writeFileSync(resolve(root, "index.html"), html);
console.log(`✓ 已同步：noscript ${PROJECTS.length} 个作品 + 手机 Hero 4 张卡`);
console.log(`  真实截图 ${shotList.length}/${PROJECTS.length} 个${shotList.length ? "：" + shotList.join(", ") : "（其余用占位图）"}`);
console.log(`  品牌名「${brand}」/ 缩写「${monoSafe}」已写进标题、分享卡、页签图标、noscript`);
console.log(`  个人照片 assets/img/me.jpg：${existsSync(resolve(root, "assets/img/me.jpg")) ? "有 ✓" : "还没放（用占位剪影）"}`);
