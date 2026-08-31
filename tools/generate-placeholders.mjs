/* 生成占位图 —— 在你还没放真实截图之前，作品卡片不会出现破图。
   用法: node tools/generate-placeholders.mjs
   （真实截图放进 assets/screenshots/ 之后，占位图会被自动盖掉）        */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(resolve(root, "assets/js/data.js"), "utf8");
const DATA = eval(src.replace(/^const SITE\b/m, "var SITE").replace(/^const PROJECTS\b/m, "var PROJECTS") + "; ({ SITE: SITE, PROJECTS: PROJECTS })");
const PROJECTS = DATA.PROJECTS;
const SITE = DATA.SITE;

const PALETTE = [
  ["#F2A93B", "#B4541E"], ["#5FBFA6", "#1E6B63"], ["#E2707F", "#8C2B4E"],
  ["#7C9BE8", "#2E3F8F"], ["#C9A227", "#6B4E12"], ["#9B7BD4", "#4A2C7A"],
  ["#E88B4B", "#93381C"], ["#4FA3C7", "#1B4E6B"], ["#8FAE4F", "#3E5A1C"]
];

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const initials = (name) => {
  const words = name.replace(/[^A-Za-z0-9 ]/g, " ").split(/\s+/).filter(Boolean);
  if (!words.length) return "??";
  // 单个词就取前 3 个字母，多个词就取每个词的首字母
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return words.slice(0, 2).map((w) => w[0].toUpperCase()).join("");
};

mkdirSync(resolve(root, "assets/img/placeholder"), { recursive: true });

PROJECTS.forEach((p, i) => {
  const [c1, c2] = PALETTE[i % PALETTE.length];
  const host = p.url.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="1600" height="1000" role="img" aria-label="${esc(p.name)}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}" stop-opacity=".85"/>
      <stop offset="100%" stop-color="${c2}" stop-opacity=".95"/>
    </linearGradient>
    <linearGradient id="v" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity=".45"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="1000" fill="#101C2E"/>
  <rect x="0" y="0" width="1600" height="1000" fill="url(#g)"/>
  <rect x="0" y="0" width="1600" height="1000" fill="url(#v)"/>
  <g opacity=".16" stroke="#fff" stroke-width="1.5">
    ${Array.from({ length: 11 }, (_, n) => `<line x1="0" y1="${n * 100}" x2="1600" y2="${n * 100}"/>`).join("")}
    ${Array.from({ length: 17 }, (_, n) => `<line x1="${n * 100}" y1="0" x2="${n * 100}" y2="1000"/>`).join("")}
  </g>
  <rect x="0" y="0" width="1600" height="76" fill="#04060C" opacity=".68"/>
  <circle cx="46" cy="38" r="9" fill="#FF5F57"/><circle cx="80" cy="38" r="9" fill="#FEBC2E"/><circle cx="114" cy="38" r="9" fill="#28C840"/>
  <rect x="156" y="22" width="480" height="32" rx="16" fill="#fff" opacity=".14"/>
  <text x="180" y="45" font-family="Archivo,Helvetica,Arial,sans-serif" font-size="19" fill="#fff" opacity=".62">${esc(host)}</text>
  <text x="800" y="512" text-anchor="middle" font-family="Archivo,Helvetica,Arial,sans-serif" font-size="188" font-weight="700" fill="#fff" opacity=".95" letter-spacing="6">${esc(initials(p.name))}</text>
  <text x="800" y="592" text-anchor="middle" font-family="Archivo,Helvetica,Arial,sans-serif" font-size="36" font-weight="500" fill="#fff" opacity=".82">${esc(p.name)}</text>
  <text x="800" y="908" text-anchor="middle" font-family="Archivo,Helvetica,Arial,sans-serif" font-size="22" fill="#fff" opacity=".5" letter-spacing="3">SCREENSHOT PENDING</text>
</svg>`;
  writeFileSync(resolve(root, `assets/img/placeholder/${p.slug}.svg`), svg);
  console.log("  ✓ " + p.slug + ".svg");
});

/* 分享卡片封面 og-cover.svg */
/* 封面大字本来就写着 Web Design & Development。品牌名如果说的是同一句话，
   小字那行就别再写一遍 —— 分享卡上同一句话出现两次很像做错了。 */
const ogBrand = String(SITE.brand || "").trim();
const brandLine = /web\s*design/i.test(ogBrand) ? ""
  : `<text x="72" y="150" font-family="Georgia,serif" font-size="46" fill="#14120F">${esc(ogBrand)}</text>`;
writeFileSync(resolve(root, "assets/img/og-cover.svg"), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs><linearGradient id="a" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#14120F"/><stop offset="100%" stop-color="#14120F"/></linearGradient></defs>
  <rect width="1200" height="630" fill="#EDEAE3"/>
  <rect x="72" y="72" width="1056" height="1" fill="#CEC8BC"/>
  
  ${brandLine}
  <text x="72" y="330" font-family="Georgia,serif" font-size="86" fill="#14120F">Web Design &amp;</text>
  <text x="72" y="412" font-family="Georgia,serif" font-size="86" fill="#14120F">Development</text>
  <text x="72" y="486" font-family="Archivo,Helvetica,Arial,sans-serif" font-size="24" fill="#8A8478" letter-spacing="3">Corporate sites · Landing pages · E-commerce · Malaysia</text>
</svg>`);
console.log("  ✓ og-cover.svg");
