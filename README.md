# JH Studio — 在线作品集 Online Portfolio

一个给**接单的网页设计师**用的作品集网站。不是程序员求职模板 —— 它解决的是你现在的问题：
**不用再一条条丢链接给客户，发一个网址，客户自己看得完你所有作品。**

- 🌏 三语切换：中文 / English / Bahasa Melayu（会自动跟着访客的浏览器语言）
- 📱 手机、平板、电脑全适配
- 💬 每一页都有 WhatsApp 按钮，客户点了直接开对话，还自动带一句开场白
- 🗂 按行业筛选作品，点开有详情弹窗
- ⚡ 纯 HTML / CSS / JS，不需要装框架、不需要 build，免费部署
- 🖼 一条命令自动截好 9 个网站的首页图

---

## ⚠️ 先改这 3 个地方（5 分钟）

全部在 **`assets/js/data.js`** 最上面：

```js
const SITE = {
  monogram: "JH",                    // 左上角的缩写
  brand:    "JH Studio",             // 你的名字 / 工作室名

  whatsapp: "60123456789",           // ⚠️ 改成你的号码！
  email:    "hello@yourdomain.com",  // ⚠️ 改成你的邮箱！

  xiaohongshu: "",                   // 小红书主页链接（留空就不显示）
  instagram:   "",
  startYear: 2021,                   // 你从哪一年开始做的
};
```

**WhatsApp 号码格式很重要**：国码 + 号码，**不要 `+`、不要空格、不要短横线**。

| 你的号码 | 要写成 |
|---|---|
| +60 12-345 6789 | `60123456789` |
| +60 13-288 3918 | `60132883918` |

---

## 🖼 把 9 个网站的截图放进去

作品卡片现在显示的是**占位图**（彩色的浏览器窗口样子）。换成真实截图，说服力完全不一样。

### 方法一：自动截（推荐，一条命令搞定 9 个）

电脑上要有 [Node.js](https://nodejs.org)，然后：

```bash
npm install
npx playwright install chromium
npm run shots
```

跑完刷新网页就好了。只想重截某几个：

```bash
node tools/capture-screenshots.mjs exa-energy furfoo-pet
```

### 方法二：手动截

自己截图，存成 `assets/screenshots/<slug>.jpg`，尺寸建议 **1600 × 1000**。
`slug` 就是 `data.js` 里每个项目的那个名字，例如 `exa-energy.jpg`。

> 截图没放进去也不会出现破图 —— 会自动用 `assets/img/placeholder/` 里的占位图顶上。

---

## ➕ 加一个新作品

打开 `assets/js/data.js`，复制一整块 `{ ... }` 出来改：

```js
{
  slug: "new-client",                        // 截图文件名，用小写和短横线
  name: "New Client Sdn. Bhd.",
  url: "https://newclient.com",
  category: "corporate",                     // 见下表
  year: "2026",
  tags: {
    zh: ["企业官网", "询盘表单"],
    en: ["Corporate site", "Enquiry form"],
    ms: ["Laman korporat", "Borang pertanyaan"]
  },
  blurb: {
    zh: "一句话说清楚你帮他解决了什么问题。",
    en: "One line on the problem you solved.",
    ms: "Satu ayat tentang masalah yang anda selesaikan."
  }
},
```

`category` 只能填这 5 个之一（筛选按钮会自动出现，没作品的分类会自动隐藏）：

| 填这个 | 显示为 |
|---|---|
| `corporate` | 企业官网 / Corporate |
| `industrial` | 工业 · 建材 / Industrial |
| `ecommerce` | 电商 · 零售 / E-commerce |
| `education` | 教育 / Education |
| `lifestyle` | 品牌 · 生活 / Brand & Lifestyle |

首页的「上线项目 / 服务行业 / 年经验」数字是**自动算的**，加了作品会自己更新，不用手动改。

---

## ✏️ 改网站上的文字

在 **`assets/js/i18n.js`**。三种语言各一份，改哪个语言就找哪一块（`zh` / `en` / `ms`）。
标题、按钮、服务介绍、流程、关于我 —— 全都在里面。

> **⚠️ 作品介绍文案是我按行业写的草稿。** 我没法打开你的网站，所以细节肯定不如你清楚。
> 每个项目你真正帮客户做了什么、解决了什么问题，改一改会有效很多 —— 客户最想看的就是这个。

---

## 🚀 上线（选一个，都是免费的）

### GitHub Pages（最简单，已经配好了）

1. 把代码推到 GitHub
2. 仓库 → **Settings** → **Pages**
3. Source 选 **Deploy from a branch**，分支选你的分支，目录选 `/ (root)`
4. 等 1 分钟，网址就是 `https://<你的用户名>.github.io/<仓库名>/`

### Netlify（想绑自己域名，推荐）

把整个文件夹拖进 [app.netlify.com/drop](https://app.netlify.com/drop) 就上线了。
之后在 Domain settings 里绑 `你的域名.com`，免费送 HTTPS。

### Cloudflare Pages / Vercel

连上 GitHub 仓库，**build command 留空**，**output directory 填 `/`**。这是纯静态站，不用编译。

---

## 📦 打包成单个文件发给客户

```bash
npm run build
```

产出 `dist/index.html` —— CSS、JS、图片**全部内联**，这一个文件就是完整网站。
双击就能打开，不需要任何其他文件。发邮件附件、拷 U 盘、没网演示都可以。

---

## 📁 文件结构

```
index.html                      页面结构
assets/
  css/style.css                 样式（想换主色改最上面的 --accent）
  js/data.js                    ⭐ 你的资料 + 作品列表 —— 主要改这个
  js/i18n.js                    ⭐ 三语文案 —— 改文字改这个
  js/main.js                    逻辑，一般不用动
  img/placeholder/              自动生成的占位图
  screenshots/                  ⭐ 真实截图放这里
tools/
  capture-screenshots.mjs       自动截图
  generate-placeholders.mjs     重新生成占位图（加了新项目后跑一次）
  build-single.mjs              打包成单文件
```

---

## ❓ 常见问题

**想换主题色？**
`assets/css/style.css` 最上面：

```css
--accent:   #FFC24B;   /* 主色 */
--accent-2: #FF8A3D;   /* 渐变的第二个色 */
```

**加了新作品，占位图没出来？**
跑一次 `npm run placeholders`。

**本地怎么预览？**
直接双击 `index.html` 就能看。想更接近真实环境：

```bash
python3 -m http.server 8000
# 打开 http://localhost:8000
```

**中文字体为什么没用 Google Fonts？**
中文字体文件动辄几 MB，会拖慢打开速度。标题用 Archivo、正文用 Instrument Sans（Google Fonts），中文用系统自带字体
（苹方 / 微软雅黑）—— 显示效果一样好，但快很多。网站速度本身就是你的卖点。
