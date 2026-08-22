/* 把整个网站打包成「一个 HTML 文件」，方便直接发给客户 / 用邮件附件寄出去。
   用法: node tools/build-single.mjs   →   产出 dist/index.html               */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(resolve(root, p), "utf8");

let html = read("index.html");

html = html.replace(/<link rel="stylesheet" href="([^"]+)">/g,
  (_, href) => `<style>\n${read(href)}\n</style>`);
html = html.replace(/<script src="([^"]+)"><\/script>/g,
  (_, src) => `<script>\n${read(src)}\n</script>`);

mkdirSync(resolve(root, "dist"), { recursive: true });
writeFileSync(resolve(root, "dist/index.html"), html);
console.log("✓ dist/index.html  (" + (html.length / 1024).toFixed(1) + " KB)");
console.log("  注意：单文件版本仍会去读 assets/screenshots/ 和 assets/img/ 里的图片，");
console.log("  所以发给客户时请把 assets 文件夹一起打包。");
