import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
const root = process.cwd();
const read = (p) => readFileSync(resolve(root, p), "utf8");

let html = read("index.html");
let css  = read("assets/css/style.css");
let data = read("assets/js/data.js");
let i18n = read("assets/js/i18n.js");
let main = read("assets/js/main.js");

// 字体内联
css = css.replace(/url\('\.\.\/fonts\/([^']+)'\)/g, (_, f) =>
  `url(data:font/woff2;base64,${readFileSync(resolve(root,"assets/fonts",f)).toString("base64")})`);

// 图片内联
const map = {};
for (const f of readdirSync(resolve(root,"assets/img/placeholder")))
  map[f.replace(/\.svg$/,"")] = "data:image/svg+xml;base64," + Buffer.from(read("assets/img/placeholder/"+f),"utf8").toString("base64");
main = main
  .replace(/function shotSrc\(p\) \{[^}]*\}/, 'function shotSrc(p) { return PLACEHOLDERS[p.slug] || ""; }')
  .replace(/function fallbackSrc\(p\) \{[^}]*\}/, 'function fallbackSrc(p) { return PLACEHOLDERS[p.slug] || ""; }');

// 预加载 link 指向本地文件，单文件版删掉
html = html.replace(/<link rel="preload"[^>]*>\n?/g, "");
// ⚠️ 必须用函数式替换：字符串替换里的 $$ 会被当成转义符，
// 会把 main.js 里所有 $$(...) 选择器悄悄变成 $(...)
html = html.replace(/<link rel="stylesheet" href="assets\/css\/style\.css">/, () => `<style>\n${css}\n</style>`);
html = html.replace(/<script src="assets\/js\/data\.js"><\/script>/, () => `<script>\n${data}\n</script>`);
html = html.replace(/<script src="assets\/js\/i18n\.js"><\/script>/, () => `<script>\n${i18n}\n</script>`);
html = html.replace(/<script src="assets\/js\/main\.js"><\/script>/, () =>
  `<script>\nvar PLACEHOLDERS = ${JSON.stringify(map)};\n${main}\n</script>`);
html = html.replace('content="assets/img/og-cover.svg"',
  `content="data:image/svg+xml;base64,${Buffer.from(read("assets/img/og-cover.svg"),"utf8").toString("base64")}"`);

writeFileSync(resolve(root, "_preview_standalone.html"), html);
console.log(`✓ 单文件预览 ${(html.length/1024/1024).toFixed(2)} MB`);
