/* ============================================================================
   打包成「一个 HTML 文件」—— CSS、JS、图片全部内联，一个文件就是整个网站。
   方便：邮件附件发给客户、U盘拷贝、离线演示。

     npm run build        →  产出 dist/index.html

   有真实截图（assets/screenshots/*.jpg）就用真实截图，没有就用占位图。
   ============================================================================ */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(resolve(root, p), "utf8");
const dataUri = (p, mime) =>
  `data:${mime};base64,` + readFileSync(resolve(root, p)).toString("base64");

let html = read("index.html");

/* 1. CSS 和 JS 内联 */
html = html.replace(/<link rel="stylesheet" href="([^"]+)">/g, (_, href) => `<style>\n${read(href)}\n</style>`);
html = html.replace(/<script(?![^>]*\btype=)[^>]*\ssrc="([^"]+)"[^>]*><\/script>/g, (_, src) => `<script>\n${read(src)}\n</script>`);
/* 字体也内联，单文件才能真的自给自足 */
html = html.replace(/url\('\.\.\/fonts\/([^']+)'\)/g, (_, f) =>
  `url(${dataUri("assets/fonts/" + f, "font/woff2")})`);
html = html.replace(/<link rel="preload"[^>]*>\n?/g, () => "");

/* 2. 图片内联：优先真实截图，其次占位图 */
/* ⚠️ 名单要从 data.js 的作品列表来，不能只扫 assets/img/placeholder/。
   占位图是「还没截图时」才生成的，一个作品完全可以有真实截图却没有占位图
   （Furfoo POS 就是这样）—— 按文件夹扫就会漏掉它，EMBEDDED 里没有这个
   slug，shotSrc() 返回空字符串，单文件版本上那张卡就是一个破图。 */
const SLUGS = readFileSync(resolve(root, "assets/js/data.js"), "utf8")
  .match(/^\s*slug:\s*"([^"]+)"/gm).map((m) => m.replace(/^\s*slug:\s*"|"$/g, ""));
const imgs = {};
for (const slug of new Set([...SLUGS, ...readdirSync(resolve(root, "assets/img/placeholder")).map((f) => f.replace(/\.svg$/, ""))])) {
  const jpg = `assets/screenshots/${slug}.jpg`;
  const svg = `assets/img/placeholder/${slug}.svg`;
  if (existsSync(resolve(root, jpg)))      imgs[slug] = dataUri(jpg, "image/jpeg");
  else if (existsSync(resolve(root, svg))) imgs[slug] = dataUri(svg, "image/svg+xml");
  else console.warn(`⚠️ ${slug}：既没有截图也没有占位图，卡片会是空的（跑 npm run placeholders）`);
}
/* ⚠️ 所有替换都用「函数」形式，不要用字符串。
   字符串替换里 $$ 是转义符号，会把 main.js 里的 $$(...) 选择器
   悄悄改成 $(...)，页面会整个挂掉，而且很难查。 */
html = html
  .replace(/function shotSrc\(p\) \{[^}]*\}/, () => 'function shotSrc(p) { return EMBEDDED[p.slug] || ""; }')
  .replace(/function fallbackSrc\(p\) \{[^}]*\}/, () => 'function fallbackSrc(p) { return EMBEDDED[p.slug] || ""; }')
  .replace(/var \$ {2}= function/, () => "var EMBEDDED = " + JSON.stringify(imgs) + ";\n  var $  = function");

/* 2b. 手机版 Hero 那几张 <img> 是 npm run sync 静态写进 HTML 的，上面那段只改了
       JS 里的路径，这里要单独换成 data URI。截图和占位图两种路径都要换 ——
       有真实截图的作品，sync 写进去的是 assets/screenshots/xxx.jpg。 */
html = html.replace(/src="assets\/(?:img\/placeholder|screenshots)\/([^"]+)\.(?:svg|jpg)"/g,
  (_, slug) => `src="${imgs[slug] || ""}"`);

/* 2c. GSAP 是运行时按条件注入的，单文件里那两个相对路径同样取不到。
       直接把库内联在加载器之前，然后把加载器整段拿掉。
       ⚠️ 代价：单文件版本手机也会带上 GSAP。可以接受 ——
       这个版本的用途是「发给客户、离线演示」，不是线上部署；
       而且 stage.js 的 canStage() 仍然会挡住手机，行为不变，只是多了体积。 */
const loader = /<script>\s*\(function \(\) \{\s*var need = false;[\s\S]*?\}\)\(\);\s*<\/script>/;
if (!loader.test(html)) throw new Error("找不到 GSAP 条件加载器，index.html 改过了？");
html = html.replace(loader, () =>
  `<script>\n${read("assets/vendor/gsap.min.js")}\n</script>\n` +
  `<script>\n${read("assets/vendor/Flip.min.js")}\n</script>`);

/* 3. og 图也内联，分享时才有预览图 */
html = html.replace('content="assets/img/og-cover.svg"', `content="${dataUri("assets/img/og-cover.svg", "image/svg+xml")}"`);

mkdirSync(resolve(root, "dist"), { recursive: true });
writeFileSync(resolve(root, "dist/index.html"), html);

const mb = (html.length / 1024 / 1024);
const shots = Object.values(imgs).filter((u) => u.startsWith("data:image/jpeg")).length;
console.log(`✓ dist/index.html  ${mb < 1 ? (html.length / 1024).toFixed(0) + " KB" : mb.toFixed(1) + " MB"}`);
console.log(`  内嵌了 ${shots} 张真实截图，${Object.keys(imgs).length - shots} 张占位图`);
console.log("  这一个文件就是完整网站，双击就能打开，不需要其他文件。");
