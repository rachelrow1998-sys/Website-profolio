# Web Design & Development — 在线作品集 Online Portfolio

一个给**接单的网页设计师**用的作品集网站。不是程序员求职模板 —— 它解决的是你现在的问题：
**不用再一条条丢链接给客户，发一个网址，客户自己看得完你所有作品。**

- 📄 **纸质编辑风格**：米色纸张纹理、墨迹笔触标题、细线分栏、套准标记
- 🎨 **整页刻意保持无彩** —— 唯一有颜色的东西是你的作品截图。页面是白墙，作品是画。
  （右下角 WhatsApp 悬浮按钮是全站唯一的彩色 UI，因为它必须被找到）
- ✨ **动效全手写，没有引入 GSAP / Lenis**（省 70KB，网站更快 —— 速度本身就是你的卖点）
  惯性平滑滚动、滚动速度倾斜、视差、标题字符逐个入场、磁吸按钮、自定义光标、卡片 3D 倾斜
- 🌏 三语切换：中文 / English / Bahasa Melayu（会自动跟着访客的浏览器语言）
- 📱 手机、平板、电脑全适配
- 💬 每一页都有 WhatsApp 按钮，客户点了直接开对话，还自动带一句开场白
- 🗂 按行业筛选作品，点开有详情弹窗
- ⚡ 纯 HTML / CSS / JS，不需要装框架、不需要 build，免费部署
- 🖼 一条命令自动截好 9 个网站的首页图

---

## 📋 项目 Brief

- **`BRIEF.md`** — 所有设计决策的完整记录：为什么是纸质风格、为什么不用 Google Fonts、
  明确不要做什么、验收标准。
- **`MOTION.md`** — 动效编排规格：开场序列、Flip 空间转换、十个项目各自的 reveal 手法、
  逐屏时间轴，以及开工前必须想清楚的工程问题。

**想换工具重做、或者交给别人接手，整份复制过去就行。**
改方向时也请先改 `BRIEF.md` 再改代码，不然过两个月会忘记当初为什么这样定。

---

## ⚠️ 先改这 3 个地方（5 分钟）

全部在 **`assets/js/data.js`** 最上面：

```js
const SITE = {
  monogram: "WD",                    // 左上角的缩写
  brand:    "Web Design & Development",  // 你的名字 / 工作室名

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

### 还要改：你的个人档案

同一个文件下面有个 `PROFILE`，控制「个人档案」那一屏：

```js
const PROFILE = {
  photo: "assets/img/me.jpg",   // 放一张你的照片进去，会自动显示
  name:  "Rachel",              // 显示在 HELLO, I AM 下面
  software: [...],              // 你常用的软件图标
  education: {...},             // 教育背景（三语）
  experience: {...},            // 经历 / 成绩（三语）
  languages: [...]              // 语言能力进度条
};
```

**照片**：存成 `assets/img/me.jpg`。建议半身照、背景干净、竖构图（约 800 × 1000）。
没放也不会破图 —— 会显示一个占位剪影。

⚠️ `education` / `experience` / `languages` 里的数字目前是示例值，记得改成真实的。

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

跑完刷新网页就好了 —— 卡片上的彩色占位图会自动被真实截图盖掉。

只想重截某几个（用 `data.js` 里的 slug）：

```bash
node tools/capture-screenshots.mjs exa-energy furfoo-pet
```

**如果提示找不到浏览器**，而你电脑上已经装了 Chrome，可以直接指过去：

```bash
# Mac
CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm run shots
# Windows (PowerShell)
$env:CHROME_PATH="C:\Program Files\Google\Chrome\Application\chrome.exe"; npm run shots
```

脚本会自动等页面加载完、滚一下触发懒加载图片、并且关掉常见的 cookie 弹窗，
免得弹窗挡住截图。输出是 1600×1000 的高清 JPG。

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

## 🚀 上线（不需要买域名）

**你现在没有域名也完全没问题** —— 下面几家都送你一个免费网址，直接就能发给客户。
以后买了域名再绑上去，网站不用重做，链接换掉就行。

> 💡 **这个网址会被你贴进 WhatsApp 发给客户，所以它长什么样很重要。**
> `jhstudio.netlify.app` 和 `rachelrow1998-sys.github.io/Website-profolio` 给客户的感觉差很远。

### ⭐ Netlify（推荐 —— 网址可以自己取名）

1. 去 [app.netlify.com/drop](https://app.netlify.com/drop)
2. 把整个项目文件夹拖进去
3. 上线了。会给你一个随机网址，例如 `random-name-123.netlify.app`
4. **Site settings → Change site name**，改成 `jhstudio` 之类
   → 你的网址变成 `https://jhstudio.netlify.app`

免费、自动 HTTPS、不限流量。以后买了域名，在 Domain settings 里绑上就行。

### GitHub Pages（不用注册新账号，自动部署已经配好了）

仓库里有 `.github/workflows/deploy-pages.yml`：只要往分支一推，
它就自动重跑一次 `sync` 再发布，**不用手动上传**。

**只需要点一次**（这一步必须你自己点，权限问题，脚本代劳不了）：

1. 仓库 → **Settings** → **Pages**
2. Source 选 **GitHub Actions**（不是 Deploy from a branch）
3. 回到 **Actions** 页签 → 选 *Deploy to GitHub Pages* → **Run workflow**
4. 等 1 分钟，网址是 `https://<用户名>.github.io/<仓库名>/`

⚠️ 两个要注意的：
- 网址里会带你的 GitHub 用户名和仓库名，改不了
- 仓库名如果拼错了（例如 `Website-profolio` 少了 t），客户会看到。
  Settings → 最上面 **Repository name** 可以改成 `portfolio`

### Vercel / Cloudflare Pages

连 GitHub 仓库就行，**build command 留空**，**output directory 填 `/`**（纯静态站，不用编译）。
一样送免费子域名：`jhstudio.vercel.app` / `jhstudio.pages.dev`。

### 以后买域名要多少钱？

`.com` 一年大概 US$10–15，`.com.my` 看注册商。买了之后：
在 Netlify/Vercel 的 Domain settings 里填上域名 → 按提示改一下 DNS → 完成，网站本身一个字都不用改。

**建议**：先用免费子域名把网站跑起来接单，有收入了再买域名。
先上线永远比等完美重要 —— 你现在每贴一次 9 条链接，就损失一次机会。

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
  img/me.jpg                    ⭐ 你的照片（自己放进去）
  img/placeholder/              自动生成的占位图
  screenshots/                  ⭐ 真实截图放这里
tools/
  capture-screenshots.mjs       自动截图
  generate-placeholders.mjs     重新生成占位图（加了新项目后跑一次）
  build-single.mjs              打包成单文件
```

---

## 🎬 动画都在哪里改

全部在 `assets/js/main.js`，都有中文注释：

| 想调什么 | 找哪里 |
|---|---|
| 滚动的丝滑程度 | `current = lerp(current, target, 0.095)` —— 数字越小越"重"，越大越跟手 |
| 滚动倾斜幅度 | `clamp(velocity * 0.016, -2, 2)` —— 改 `-2, 2` 这个范围 |
| 标题字符入场间隔 | `n++ * 24` 里的 `24`（毫秒） |
| 开机载入时长 | `boot()` 里的 `1100`（毫秒） |
| 关掉某个效果 | 把对应的函数调用注释掉就行 |

**手机上会自动关掉**平滑滚动、自定义光标、磁吸和 3D 倾斜（触屏上这些只会碍事）。
系统开了「减少动态效果」的访客，所有动画也会自动关闭。

---

## ❓ 常见问题

**想换颜色？先想清楚这件事**
这个设计的核心是「整页无彩，颜色留给作品」。加任何一个彩色元素，
都会开始跟你的作品截图抢注意力 —— 那正是上一版要解决的问题。

真要调，在 `assets/css/style.css` 最上面：

```css
--paper: #EDEAE3;   /* 纸的颜色 */
--ink:   #14120F;   /* 墨的颜色 */
--seal:  #A8341F;   /* 印章红，目前只用在 hover 的编号上 */
```

**想换回深蓝游戏主菜单版本？**
```bash
git checkout v2-game-menu -- index.html assets/css/style.css assets/js/main.js assets/js/i18n.js
```

**加了新作品，占位图没出来？**
跑一次 `npm run placeholders`。

**本地怎么预览？**
直接双击 `index.html` 就能看。想更接近真实环境：

```bash
python3 -m http.server 8000
# 打开 http://localhost:8000
```

**字体为什么放在项目里，不用 Google Fonts？**
因为你的客户从小红书来 —— **如果人在中国大陆，Google Fonts 是打不开的**，字体加载不出来，
标题就会变成系统默认字体，整个设计垮掉。所以字体（Instrument Serif + Archivo）
直接放在 `assets/fonts/`，一共只有 72KB，加载还更快。两款都是 SIL Open Font License，可以自由自托管和商用。

中文则用系统自带字体（苹方 / 微软雅黑）—— 中文字体文件动辄几 MB，不值得让访客下载。
