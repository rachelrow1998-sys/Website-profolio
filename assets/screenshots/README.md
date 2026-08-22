# 网站截图放这里 / Put screenshots here

文件名必须跟 `assets/js/data.js` 里的 `slug` 一样，格式 `.jpg`：

```
exa-energy.jpg
pnc-lifecare.jpg
furfoo-pet.jpg
yh-ideal-academy.jpg
mitic-asian.jpg
etaeta.jpg
ec-diy-hardware.jpg
oem4u2day.jpg
master-materials.jpg
```

## 最省事的做法：自动截图

```bash
npm install playwright
npx playwright install chromium
node tools/capture-screenshots.mjs
```

9 个网站会自动截好放进这个文件夹。

## 手动截图

推荐 **1600 × 1000**（16:10）。截首页最上面那一屏就好，卡片只会显示顶部。
文件名对上 slug 即可，网页会自动读到。

**图片还没放进来时不会出现破图** —— 会自动显示 `assets/img/placeholder/` 里的占位图。
