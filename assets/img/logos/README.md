# 客户 logo（首屏跑马灯用）

这里的 PNG 是 `node tools/extract-logos.mjs` 从 `assets/screenshots/*.jpg`
里裁出来的 —— 截图本来就是客户站首屏，header 里的 logo 就在里面，
不用联网去抓（沙箱 / CI 常常出不去外网）。

跑马灯怎么决定用图还是用字：看 `assets/js/data.js` 里 `CLIENT_LOGOS` 那一项有没有
`img:`（可以再跟一个 `h:` 指定显示高度）。写了 `img` 却没有对应的文件，
那一格就是个破图 —— 两边要一起改。没写 `img` 的会退回自己画的标记 + 字标。

## 现在还是文字的三个

| slug | 为什么没有 logo |
|---|---|
| `mitic-asian` | 域名已过期，连截图都没有 |
| `ec-diy-hardware` | 截图那一屏的 header 是透明的，logo 没进画面 |
| `furfoo-pos` | 内部系统，截图里的 logo 太小；直接复用 `furfoo-pet.png` 再加一个 POS 角标 |

有了源文件（客户给的 SVG/PNG）就直接放进这个目录，命名成 `<slug>.png` / `<slug>.svg`，
再去 `data.js` 的 `CLIENT_LOGOS` 里给那个客户写上 `img: "assets/img/logos/<slug>.svg"`
就会自动用上，不用改代码。SVG 优先 —— 截图裁出来的 PNG 只有 60px 高，
放大会糊。

## 重新裁

截图换了，或者裁歪了，改 `tools/extract-logos.mjs` 顶上的 `LOGOS` 表：

- `box`  `[x, y, w, h]`，1600×1000 截图里的像素坐标
- `key`  抠底容差，底色和 logo 越接近要调越小
- `invert` 浅色 logo 压在深色底 / 照片上（Luma 就是），转成墨色剪影
- `h`    输出高度，跑马灯显示 26–40px，所以出 2 倍图

改完跑 `node tools/extract-logos.mjs`，然后 `npm run build` 重新打单文件版。
