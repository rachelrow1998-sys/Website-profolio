# 动效编排规格 Motion Spec

> 配套文件：`BRIEF.md`（整体需求）。这份只管**动效编排**。
> 本版取代之前所有 Motion Spec 版本。

---

## 0. 三条治理原则

这三条凌驾于后面所有具体编排之上。有冲突时以这三条为准。

### 0.1 每个动画都要回答一个问题

> **它是在展示作品，解释层级，还是帮助导航？**
> **三个都不是 —— 删。**

这条决定了「animation 很多」不会变成「所有东西都在动」。

客户实际应该感受到的是：
> 「哇，这个作品集很会动。」

而**不是**：
> Header、文字、按钮、背景、图标全部一直在动。

这是两个完全不同的高级程度。

### 0.2 80/20 分配

**80% 的复杂动效给作品，20% 给其他区块。**
About / Services / Footer 如果做得跟作品一样夸张，就回到 `BRIEF.md` 第 3 节的老问题 ——
页面自己开始跟作品抢戏。

### 0.3 转化路径优先

客户**不需要**看完 10 个 Case Study 才能按 WhatsApp。
主滚动路径必须短。华丽的部分是**可选深入**，不是必经关卡。

---

## 1. 技术边界：GSAP 用在哪，不用在哪

### 1.1 为什么值得引入（这部分是架构判断，成立）

- **Flip** 的设计目的就是记录元素的 First / Last 状态，处理 DOM 结构或 layout 发生巨大变化后的平滑转换。我们有三处正是这个场景。
- **ScrollTrigger** 原生支持 `pin / scrub / snap`。Case Study 内部需要滚动绑定进度。

手写这两件事的成本明显高于引入成本 —— **这是引入的唯一理由**。

### 1.2 ⚠️ 关于体积：不要写成永久事实

**我之前在这份文件里写过「≈40KB gzip（core 24 + ScrollTrigger 11 + Flip 7）」，那是错的写法。**
GSAP 官方并没有把这些 gzip 数字作为固定规格公布，而且会随版本变动。

**正确做法**：以我们**实际部署版本**的 build measurement / Network 面板实测为准，
把数字记在这里并注明测量日期和 GSAP 版本：

```
测量日期：2026-08-26（Phase 3 完成后重测）
GSAP 版本：3.15.0
实际加载：gsap core + Flip（ScrollTrigger 未加载）
方法：Chromium 实际请求，响应体本地 gzip -9

                    原始      gzip
gsap.min.js        71.2 KB   27.6 KB
Flip.min.js        24.9 KB    9.5 KB
──────────────────────────────────────
合计               96.1 KB   37.1 KB

整页（首屏全部资源）  桌面      手机
请求数               23        17
JS                   87.1 KB   47.9 KB   ← 差值 39.2 KB 就是 GSAP
CSS                  14.4 KB   14.4 KB
字体                 64.2 KB   64.2 KB   （woff2 已压缩，gzip 不再变小）
HTML                  9.4 KB    9.4 KB
图片                  7.6 KB    4.5 KB   ⚠️ 现在全是占位 SVG，
                                            换上真实截图后这一行会大幅上升
──────────────────────────────────────
合计                180.6 KB  140.4 KB
```

**而且这 96KB 只有桌面会下载。** `index.html` 里的内联判断会先看设备：
纯触屏设备（有 touch 事件且任何输入方式都不能悬停）、窄屏、开了减少动效的，
Flip 一次都不会被调用，所以脚本干脆不注入。手机端实测确认：0 个 GSAP 请求。

体积超出预期时，重新评估的是「这四处用法是否还划算」，不是回头找一个记错的数字。

### 1.3 使用边界（锁死）

**GSAP 必须有明确理由才能调用。** 允许的只有三处：

| # | 场景 | 用什么 |
|---|---|---|
| 1 | Works 筛选后重排 | `Flip` |
| 2 | Works Grid → Case Study Focus Mode（含关闭时飞回原位） | `Flip` |
| 3 | Case Study 内部有限的 pin / scrub（**仅桌面**） | `ScrollTrigger` |

> 原本还有一条「Hero 卡片群 → Works Grid 的 Flip」。**已经拿掉。**
> 封面上的截图现在是「一张张贴上去」的：进站时按顺序落位，之后就钉在那儿，
> 跟着封面一起滚出视口 —— 滚动时不再有任何位移动画。

**其他一律不用 GSAP**，走 CSS / 原生 JS / Web Animations API：

开场序列 · 墨迹 SVG · 数字滚动 · 进度条 · 自定义光标 · 磁吸按钮 ·
鼠标视差 · 跑马灯 · 普通 reveal · 惯性滚动

### 1.4 标题文字 reveal 不引入 SplitText

**不为了拆字再加一个依赖。**
在 HTML / data 渲染阶段就生成安全的 `<span>` word wrapper
（当前 `main.js` 里已经手写好了，按词分组、词内不断行）。

> **原则**：库是为了处理困难的问题，不是因为「这是动画」就全部交给库。

---

## 2. Desktop 编排

### 2.1 主路径（保持很短）

```
Opening → Hero → Works Grid → About → Services → Contact
```

Case Study **不在主路径上**。

### 2.2 Opening Sequence

总时长 **1.8 – 2.5 秒**。载入后不要直接看到完整 Hero。

**Loader**
```
WD
10 SELECTED WORKS
2023 — 2026
```
一条细线从左向右跑满 → 整个 loader 用 `clip-path` 向上收掉 → Hero 露出。

**标题**

`WEB DESIGN & DEVELOPMENT'S` 收紧字距：
```
opacity:       0 → 1
letterSpacing: 0.5em → 正常
```

`Portfolio` 按 word / character mask reveal（**不是乱飞**）：
```
yPercent:  120 → 0
rotation:  2deg → 0
opacity:   0 → 1
stagger:   0.035
duration:  1.2
ease:      expo.out
```

字出来后，背后超大的 `DESIGN` ghost text **慢 0.2 秒**才浮出来。

**墨迹**

墨迹不是一开始就在。等 `Portfolio` 完成约 **70%** 才开始刷。
真 SVG mask reveal，不是假 brush 动画：
```
stroke-dashoffset: full → 0
同时轻微 scaleX
```

### 2.3 Hero：10 张作品散落漂浮 —— 全站最大的第一波 WOW

**不要 10 张同时 fade in。** 像从桌面下、镜头后、左右两侧一张张飞进来。

| 项目 | x | y | rotation | scale |
|---|---|---|---|---|
| The Luma Club | 200 | -80 | -7 | .78 |
| EXA Energy | 300 | 30 | 8 | — |
| PNC Lifecare | 220 | 180 | -4 | — |
| Furfoo Pet | -160 | 200 | 7 | — |

统一起点 `opacity: 0`，每张间隔 **0.06 – 0.1s**，形成 card cascade。

**鼠标视差**（幅度一定小，不能做成游戏 UI）：

| 层 | 幅度 |
|---|---|
| 最前面的卡 | ±14px |
| 中间 | ±8px |
| 后面 | ±3px |

### 2.4 Hero → Works Grid：签名式转场

开始滚动时，`Portfolio` 标题：
```
scale:   1 → .92
y:       0 → -80
opacity: 1 → .15
```

10 张卡**不跟着走**，而是向屏幕四周 explode：
```
Luma   → 左上      EXA    → 右上
PNC    → 右        Furfoo → 左
YH     → 中下      MITIC  → 右下
```
各自 rotation 再加一点。

这些 screenshot **进站时一张张贴上去**：从最终位置的正上方一点落下，
起点稍微大一圈、多歪几度，用一条带回弹的曲线收住 —— 像把照片按到板子上。
每张之间错开约 0.1s，看得出先后。

> 之后它们就钉在封面上，跟着封面一起滚出视口。
> **滚动过程中不做任何位移动画**，也不整理进 Works Grid ——
> 作品档案在下面本来就是完整的一份，不需要把封面这堆搬过去。
> 封面上的卡片也不套相框：那是 Works Grid 的语言，
> 贴在封面上的截图只要图本身 + 一点点浮起的阴影。

### 2.5 Works Grid

**标题**：巨大的「作品」从 bottom mask reveal，黑墨迹从左快速画过。
**数字**：`10 / 5 / 3+ / 100%` 滚到才 count up。

**卡片入场 — Diagonal stagger**
```
01
   02
      03
04
   05
      06
```
```
起: y: 70,  scale: .94, rotation: 1.5, opacity: 0
终: y: 0,   scale: 1,   rotation: 0,   opacity: 1
stagger: 0.07
```

**Hover**
```
当前卡:  y -12 · scale 1.025 · rotationX 1 · rotationY -1 · shadow 加深
截图:    scale 1 → 1.04
metadata: 上移 5px
箭头:    x 0 → 7px
```
更重要的是**其他卡片自动安静下来**：
```
当前: opacity 1        其他: opacity .45
```

**筛选**（用 Flip）
```
不相关: scale 1 → .8, opacity 1 → 0
相关:   平滑飞到新位置
```

### 2.6 Case Study —— Focus Mode，不是必经路线

Works Grid 上点「查看详情」：

```
Grid card
    ↓ Flip
放大成 Focus Mode
    ↓
Challenge → What I Did → Result
    ↓
← Previous / Next →
    ↓ × Close
Flip 飞回原本 Grid 的那个位置
```

**关键**：关闭时**回到原来那张卡的位置**，不是跳回页面顶部。
所以 Flip 在这里承担两次转场：`Grid → Focus` 和 `Focus → 原位`。
这比普通 modal fade 高级得多。

**大截图进场**
```
clip-path: inset(0 100% 0 0) → inset(0 0 0 0)
scale:     1.08 → 1
```
像摄影作品 reveal。

**标题按 line reveal，不是逐字跳。**（luxury 项目逐字动画太浮躁）

**三段内容**：`Challenge` → 滚 80–120px → `What I Did` → 再滚 → `Result`，
三条之间的竖线同时往下画。让客户真的**读**你的过程。

**Pin 的边界**：只 pin **当前项目内部的一小段**内容，
**绝对不要**把 10 个项目串成 2000vh 的强制滚动。

**项目间切换**
```
当前截图:   scale 1 → .8   x 0 → -350   rotation 0 → -4
下一个从右: scale .8 → 1   x 450 → 0    rotation 4 → 0
```
`01 / 10` → `02 / 10`，标题 mask out → mask in。

---

#### 实作记录（2026-08-26 完成）

文件：`assets/js/study.js` + `style.css` 里的 Focus Mode 段 + `index.html` 的 `#focus` 结构。

**Flip 的两次调用**（白名单第 3 条，就这两处）
- 打开：卡片 `.proj__shot` → `#fx-screen`
- 关闭：`#fx-screen` → 回到卡片

飞的是一个 `position:fixed` 的 clone，真卡片和真大图都不动 —— 
Phase 1–2 的教训：让 Flip 搬真实节点，网格会当场塌掉。
两端宽高比都是 16/10，所以用 `scale:true`，是纯等比放大，中途不重新裁切。

**3D 倾斜必须在 Flip 之后**。倾斜状态下 `getBoundingClientRect()` 给的是旋转后的
外接矩形，拿它当起点/终点位置一定偏。所以顺序锁死为：
打开 = 平着飞过来 → 落位 → 再倾斜；关闭 = 先摊平 → 再飞回去。
位移（左右切换）和倾斜写在两层元素上（`.focus__slide` / `.focus__device`），
同一个元素上后写的 `transform` 会把前一个整条覆盖掉。

**关闭飞回「现在正在看的那一个」，不是「最初点进来的那一个」。**
从底部翻过几个项目之后，屏幕上是 07 却飞回 01 的格子，那是错的位置。
当前那张卡被筛掉了才退回原始来源，再不行就直接淡出（不飞到一个 0×0 的地方）。

**没有用 ScrollTrigger。** 白名单第 4 条允许「Case Study 内部有限的 pin / scrub」，
但那是允许，不是要求 —— 这一页做成了单屏版式，自然滚动就够，
没有一段内容需要被钉住。所以 ScrollTrigger 至今仍然一个字节都没加载。

**项目间左右切换、印章旋转、进度条、自动播放全部是 CSS / 原生 JS**（1.3 的要求）。
自动播放默认关闭，鼠标停在面板上时不翻页，开了减少动效时整个功能不启动。

#### 改版记录（2026-09-01 —— 照设计稿一比一）

设计稿上的案例页不是一层盖住全站的弹层，是**一整页**：顶栏还在、底部客户条还在，
中间是 3D 大图 + 双语正文 + 缩略图卡列 + 进度条。照着改了这几处：

- **顶栏在案例页是露出来的**。`body.is-locked` 时把 `.rail--top` 抬到 `.focus` 之上，
  面板上边留出 `--hud-h`。点顶栏导航先 `close()` 再让锚点跳 —— 不然人会卡在这一层里。
- **3D 卡片朝右转**：`rotateY(19deg) rotateX(3.6deg) rotateZ(1.8deg)`，
  左边缘迎着人、右边缘往里退。白框（`.focus__device`）整块转，
  说明「01 The Luma Club」印在框里，不是框外面另起一行。
  倾斜仍然只在 Flip 落位之后加 —— 顺序和上面写的一样，没变。
- **三段标题改双语**（挑战 / Challenge）。英文版本身就是那个词，
  所以后半截只在中 / 马来文下出现。
- **「其他作品」是缩略图卡**，不是文字列：整张截图铺满，左边压一层纸色渐变，
  深色浅色截图共用同一套文字颜色。上一个 / 下一个的圆钮住在卡列这一条里
  （设计稿上它们和卡列同一条水平线），手机上照旧摊成底部一行。
- **进度条**：左边大号数字是当前第几个，当前那一格不再出现在刻度里。
- **底部客户条**不跑马灯，改成左右箭头翻 —— 正在读东西时旁边一直在动会抢注意力。

**顺手修掉一个真 bug**：`index.html` 里动态插进来的 gsap / Flip 两个 `<script>`
只写了 `defer`。动态插入的脚本默认是 `async`，`defer` 对它没有任何作用，
谁先下载完谁先跑；Flip 跑在 gsap 前面就注册不上，之后 `Flip.getState()` 当场抛错——
表现是点作品卡进来，大图不倾斜也不能左右切换（本机复现率约一半）。
加了 `async = false` 才是按插入顺序执行。study.js 里两处 Flip 也各包了一层
try/catch：转场再挂也只是不好看，不能把人锁在一个关不掉的弹层里。

### 2.7 About（刻意降速）

刚看完作品，视觉需要休息。**这一屏故意少做动效。**

```
照片: clip-path inset(0 0 100% 0) → inset(0),  scale 1.08 → 1
黑 brush: 随滚动慢慢画出
自我介绍: 按行 upward reveal
Tools: y 20 → 0, opacity 0 → 1, stagger .07
时间线: 竖线从上画到下，经过年份时 dot scale 0 → 1，文字才出现
语言条: scaleX 0 → 1, transform-origin left
```

### 2.8 Services + Process

**Services 入场 —— 像制图正在被画出来**，顺序很重要：
1. 外框 `scaleX: 0 → 1`
2. 竖线一条一条画
3. 六个 service `opacity 0 → 1`, `y 25 → 0`

**Hover**
```
编号圆圈: background transparent → ink, color ink → paper
icon:     rotation 0 → -5 → 0
虚线上的小 dot: 顺着 dotted path 跑过去
```
图上那些虚线不是装饰，是会动的。

**Process —— 像一支笔正在画**
```
01 dot 点亮 → 线继续画 → 02 放大 → 03 → 04
```
整段约 `80vh` 滚动。

### 2.9 Contact Finale

进入最后一屏时，前面所有 noise 稍微消失，然后「开始合作」两行超大 reveal。
背景 `2026` 很慢地 `y: 70 → -20`，形成淡淡视差。墨迹快速横刷过去。

四行联系信息：`x: -25 → 0, opacity: 0 → 1, stagger: .08`

WhatsApp 大按钮最后出现：`scale: .96 → 1`，然后变成 Magnetic Button
（`x ±8 / y ±6`，离开 `elastic.out` 回位，**幅度小**）。

**底部 10 项目 reel**：横向 marquee 很慢地走。
```
hover 某一个: 整条 pause，该项 opacity .4 → 1 · scale 1 → 1.05，其他稍暗
点它:         Flip 回对应的 Case Study
```
用户已经滚到 footer 了，仍然可以重新进入作品。

---

## 3. Mobile 编排（独立设计，不是降级）

> **这是 `BRIEF.md` 的一级 requirement。**
> 不是「Desktop 做完 → `if (mobile) disableAnimation()`」，
> 而是 **Desktop choreography 和 Mobile choreography 两份**。
>
> 手机是大部分客户第一次打开这个网站的设备 —— 小红书点链接过来就是手机。

**手机上完全不做**：`pin` · `scrub` · `mouse parallax` · `magnetic` · `3D tilt` · `Flip`

少很多 motion **不等于廉价版**，只是 choreography 更适合触摸。

### 3.1 Mobile Hero

Desktop 是 10 张卡在空间中漂浮 —— **手机不做这个。**
改成 4 张精选作品组成稍微错位的 editorial stack：

```
WEB DESIGN & DEVELOPMENT'S

PORTFOLIO
────墨迹────

真实上线的网站
真实客户的作品

[ Luma ]
       [ EXA ]
[ PNC ]
       [ Furfoo ]

Swipe / Scroll
```

Opening 时卡片一张张 `translateY(30px) → 0`。
不需要 3D、不需要 mouse、不需要 Flip。

继续滚就直接进入 Works Grid。
**目标：小红书来的客户，5–10 秒内已经看到作品。**

### 3.2 Mobile Works

**不是把 Desktop 的 10 张缩小塞进去。** 一张一张很清楚：

```
作品
10 PROJECTS

[ The Luma Club        ]
[ 大 screenshot         ]
Luxury Wellness
查看项目 →

[ EXA Energy           ]
[ screenshot           ]
Construction / Industrial
查看项目 →

...
```

1 column，可以让部分 featured card 更大。

**筛选**：横向排列 `全部 | 企业 | 工业 | 电商 | 教育 | Lifestyle`，
筛选后**直接 DOM 更新，不做 Flip**。

### 3.3 Mobile Case Study

```
← 返回作品

01 / 10
THE LUMA CLUB

[ Full width screenshot ]

Challenge

What I Did

Result

[ Visit Live Site ]

← EXA       PNC →
```

允许的动效**只有**：
```
截图: clip-path reveal
      image scale 1.04 → 1
```

---

## 4. Reveal 配置化（架构决定，不是优化项）

**这个决定后面会不会变成维护地狱。**

### 4.1 数据里声明类型

```js
{
  slug: "the-luma-club",
  title: "The Luma Club",
  category: "lifestyle",
  reveal: "cinematic",
  year: 2026
}

{ slug: "exa-energy",        reveal: "strips"   }
{ slug: "yhideal-academy",   reveal: "paper"    }
{ slug: "ec-diy-hardware",   reveal: "assemble" }
{ slug: "master-materials",  reveal: "slab"     }
```

### 4.2 一个调度器，不是十个函数

**不要这样：**
```js
lumaAnimation()
exaAnimation()
pncAnimation()
...
```

**要这样：**
```js
revealProject(project, element)
```

内部 dispatch：
```js
REVEALS = {
  cinematic,
  strips,
  soft,
  playful,
  paper,
  network,
  silk,
  assemble,
  blueprint,
  slab
}
```

第 11 个项目直接写 `reveal: "slab"` 复用。
**真的需要新的 personality，才加第 11 种 reveal。**

### 4.3 十种 reveal 对应的项目与理由

每种手法都从那个客户的**真实业务**长出来。

| # | 项目 | 业务定位 | `reveal` | 手法 |
|---|---|---|---|---|
| 01 | The Luma Club | 高端 wellness / 私人会所 | `cinematic` | 缓慢 mask reveal，沉浸感 |
| 02 | EXA Energy | 建筑 / 维保 / 工业服务 | `strips` | 3 条横向 strip 拼装成完整网站，blueprint 感 |
| 03 | PNC Lifecare | 预防 / 健康护理 | `soft` | `blur(12px) → 0`，`scale .96 → 1` |
| 04 | Furfoo Pet | 宠物 | `playful` | 轻微 bounce：`rotation -3 → 1 → 0` |
| 05 | YH Ideal Academy | 教学 / 笔记 / 课程 | `paper` | 左右两张「纸」打开 |
| 06 | MITIC Asian | 亚洲创新科技平台 | `network` | 连线生长 → screenshot reveal |
| 07 | ÉTÀ | 护肤 / 紧致 / 光泽 | `silk` | 竖向 `clip-path top → bottom` + 慢速 zoom |
| 08 | EC DIY Hardware | 五金 / 工具 | `assemble` | 零件从左右下方 assemble 成页面 |
| 09 | OEM4U2DAY | 保健品 OEM / ODM | `blueprint` | Formula → Manufacturing → Product → Website 四面板依次组合 |
| 10 | Master Materials | 建材 | `slab` | 左中右三块石板向中间合起来 |

客户看完 10 个项目不会觉得「又是 screenshot fade in」。

---

## 5. 素材原则

**AI mockup 只负责确定 composition / motion direction。**

Production 必须把 10 个 live site 真实抓下来（`npm run shots`），
**动画围绕真实作品做，不是让作品迁就 mockup。**

否则客户点进真站发现跟卡片上不一样，会很尴尬。

---

## 6. 开工前必须想清楚的

### 6.1 首屏时间
Opening Sequence 1.8–2.5 秒的前提是**资源已经就绪**。
10 张截图如果每张 200KB，loader 会变成真的在等下载，而不是在演出。
→ 首屏只加载可见的 2–3 张，其余懒加载；WebP + 尺寸分级。

### 6.2 SEO 与无障碍
- 所有内容必须在 DOM 里、能被抓取。**动效只管「怎么出现」，不能决定「存不存在」**
- `prefers-reduced-motion` 开启时，整套编排一键降级成静态版
- pin + 自定义滚动容器会打断键盘 Tab 的滚动定位（`BRIEF.md` 第 8 节那个坑），要一起处理

### 6.3 分阶段，不要一次全上

工作量约是当前版本的 **3–4 倍**。每阶段做完都是**可以上线的状态**：

| 阶段 | 内容 | 拿到什么 | 状态 |
|---|---|---|---|
| 1 | Opening Sequence + Hero 卡片群 + 鼠标视差 | 第一印象直接到位 | ✅ 完成 |
| 2 | Hero 卡片「贴上去」入场 + 筛选 Flip | 第一印象 + 作品区可用 | ✅ 完成 |
| 3 | Case Study Focus Mode（先用一种通用 reveal） | 结构跑通 | ✅ 完成 |
| 4 | 10 种 bespoke reveal 逐个替换 | 差异化 | 待做 |
| 5 | Services / Process / Contact 编排 | 收尾 | 待做 |

Mobile choreography 与每个阶段**同步进行**，不排在最后。
