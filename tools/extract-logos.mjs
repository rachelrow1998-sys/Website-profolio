/* ============================================================================
   extract-logos.mjs — 从客户网站截图里裁出他们的 logo，做成跑马灯用的 PNG
   ----------------------------------------------------------------------------
   为什么是「从截图裁」而不是「去客户站抓」：
   抓 logo 要能出外网，CI / 沙箱里常常出不去；而 assets/screenshots/*.jpg
   本来就是客户站首屏的真实截图，header 里的 logo 就在里面。裁一次就够了，
   产出物提交进仓库，之后任何环境都不用联网。

   处理链：裁剪 → 抠底（从四角 flood fill 掉纯色背景）→ 裁掉透明边 →
           按目标高度缩放 → PNG。invert 的站（浅色字压在深色/照片上）额外
           把亮度当 alpha、整体涂成墨色，否则放到浅色纸底上会整块看不见。

   用法：node tools/extract-logos.mjs            （需要 playwright chromium）
   产出：assets/img/logos/<slug>.png
   ============================================================================ */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT  = path.join(ROOT, "assets/img/logos");

/* 每一项都是手工对过的。截图换了就要重新对 —— 没有自动找 logo 的办法，
   header 的结构每个站都不一样，硬猜只会裁出半个导航栏。
     box     : [x, y, w, h]，坐标是 1600×1000 截图里的像素
     key     : 抠底容差（0–255）。底色越接近 logo 越要调小
     invert  : true = 浅色 logo 压在深色底上，转成墨色剪影
     floor   : invert 时把底色基线再抬高一点，压掉背景渐变留下的方块
     h       : 输出高度（px）。跑马灯显示 26px，出 2 倍图 */
const LOGOS = [
  { slug: "luma-club",        box: [128,  46,  92,  46], key: 60, invert: true, h: 52, floor: 1.10 },
  { slug: "exa-energy",       box: [ 38,   8, 122,  84], key: 26, h: 64 },
  { slug: "pnc-lifecare",     box: [145,  10, 120, 100], key: 20, h: 64 },
  { slug: "furfoo-pet",       box: [738,  10, 130,  88], key: 26, h: 64 },
  { slug: "yh-ideal-academy", box: [160,  12, 236,  84], key: 46, h: 64 },
  { slug: "etaeta",           box: [738,  86, 124,  84], key: 26, h: 56 },
  { slug: "oem4u2day",        box: [155,  14, 196,  60], key: 26, h: 52 },
  { slug: "master-materials", box: [155,  20, 288,  78], key: 26, h: 60 }
];

const page = await (await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined
})).newPage();

/* 用 file:// 起一页空白文档，只是为了借浏览器的 canvas 做图像处理。
   Node 里没有内建的 JPEG 解码器，装一个图像库只为裁 8 张图不划算。 */
await page.goto("about:blank");

fs.mkdirSync(OUT, { recursive: true });

for (const cfg of LOGOS) {
  const jpg = path.join(ROOT, "assets/screenshots", cfg.slug + ".jpg");
  if (!fs.existsSync(jpg)) { console.warn("skip (no screenshot):", cfg.slug); continue; }

  const dataUrl = "data:image/jpeg;base64," + fs.readFileSync(jpg).toString("base64");
  const png = await page.evaluate(async ({ dataUrl, cfg }) => {
    const img = new Image();
    img.src = dataUrl;
    await img.decode();

    const [bx, by, bw, bh] = cfg.box;
    const c = document.createElement("canvas");
    c.width = bw; c.height = bh;
    const cx = c.getContext("2d", { willReadFrequently: true });
    cx.drawImage(img, bx, by, bw, bh, 0, 0, bw, bh);

    const im = cx.getImageData(0, 0, bw, bh);
    const d = im.data;
    const at = (x, y) => (y * bw + x) * 4;

    if (cfg.invert) {
      /* 浅色 logo：亮度就是 alpha。先量一下四角的底色亮度当基线，
         比基线亮出一截的才算笔画，否则底色的渐变会整片糊上去。 */
      const lum = i => 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      let base = 0;
      const corners = [at(0,0), at(bw-1,0), at(0,bh-1), at(bw-1,bh-1)];
      corners.forEach(i => { base += lum(i); });
      base = base / corners.length * (cfg.floor || 1);
      for (let i = 0; i < d.length; i += 4) {
        const a = Math.max(0, Math.min(255, (lum(i) - base) * 255 / Math.max(1, 255 - base)));
        d[i] = 20; d[i + 1] = 18; d[i + 2] = 15; d[i + 3] = a;
      }
    } else {
      /* 抠底：只从四角往里 flood fill，不做「全图相近颜色都删」——
         后者会把 logo 内部同色的部分一起挖穿（白底 logo 里的白色反白字）。 */
      const bg = [d[0], d[1], d[2]];
      const seen = new Uint8Array(bw * bh);
      const stack = [[0,0],[bw-1,0],[0,bh-1],[bw-1,bh-1]];
      const near = i => Math.abs(d[i]-bg[0]) + Math.abs(d[i+1]-bg[1]) + Math.abs(d[i+2]-bg[2]) < cfg.key * 3;
      while (stack.length) {
        const [x, y] = stack.pop();
        if (x < 0 || y < 0 || x >= bw || y >= bh) continue;
        const p = y * bw + x;
        if (seen[p]) continue;
        const i = p * 4;
        if (!near(i)) continue;
        seen[p] = 1;
        d[i + 3] = 0;
        stack.push([x+1,y],[x-1,y],[x,y+1],[x,y-1]);
      }
      /* 边缘一圈半透明，去掉底色残留的浅边 */
      for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) {
        const p = y * bw + x, i = p * 4;
        if (!d[i + 3] || seen[p]) continue;
        if (near(i)) d[i + 3] = 120;
      }
    }
    cx.putImageData(im, 0, 0);

    /* 裁掉透明边，让每个 logo 的视觉高度真的一致 */
    let x0 = bw, y0 = bh, x1 = -1, y1 = -1;
    for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) {
      if (d[(y * bw + x) * 4 + 3] > 24) {
        if (x < x0) x0 = x; if (x > x1) x1 = x;
        if (y < y0) y0 = y; if (y > y1) y1 = y;
      }
    }
    if (x1 < 0) return null;
    const tw = x1 - x0 + 1, th = y1 - y0 + 1;

    const o = document.createElement("canvas");
    const scale = cfg.h / th;
    o.width = Math.round(tw * scale); o.height = cfg.h;
    const ox = o.getContext("2d");
    ox.imageSmoothingQuality = "high";
    ox.drawImage(c, x0, y0, tw, th, 0, 0, o.width, o.height);
    return { url: o.toDataURL("image/png"), w: o.width, h: o.height };
  }, { dataUrl, cfg });

  if (!png) { console.warn("empty after keying:", cfg.slug); continue; }
  fs.writeFileSync(path.join(OUT, cfg.slug + ".png"), Buffer.from(png.url.split(",")[1], "base64"));
  console.log("wrote", cfg.slug + ".png", png.w + "x" + png.h);
}

await page.context().browser().close();
