# 动效编排规格 Motion Spec

> 配套文件：`BRIEF.md`（整体需求）。这份只管**动效编排**。
> 标注 `⚙️ 工程注` 的段落是开发角度的提醒，可以接受也可以否决，但请先读过再决定。

**贯穿全站的分配原则**：
**80% 的复杂动效给作品，20% 给其他区块。**
如果 About / Services / Footer 做得跟作品一样夸张，就会回到 BRIEF 第 3 节说的老问题 ——
页面自己开始跟作品抢戏。

---

## 技术选型：这里改用 GSAP

`BRIEF.md` 第 7 节原本写「不引入动画库，全部手写」。
**这份编排推翻那个决定**，理由如下：

| 需要的能力 | 手写成本 | GSAP |
|---|---|---|
| Hero 卡片群 → Works Grid 的位置平滑迁移 | 高。要自己算 FLIP（First-Last-Invert-Play），处理 resize、中断、层级 | `Flip` 直接做 |
| 筛选时卡片重排 | 同上 | `Flip` |
| Case Study 钉住 + 进度绑定滚动 | 中高。要自己做 pin、scrub、进度归一化 | `ScrollTrigger` |
| 标题按词/字 mask 入场 | 已经手写好了 | `SplitText`（可继续用手写的） |
| 惯性滚动、视差、磁吸 | 已经手写好了 | 不需要换 |

**⚙️ 工程注 — 更正我之前给的数字**：
我早前说「GSAP 大概 70KB」，那是**未压缩**的数字，用它来做决定不公平。
实际按 gzip 传输：core 约 24KB、ScrollTrigger 约 11KB、Flip 约 7KB，合计 **40KB 上下**。
（具体以你打包后实测为准。）

40KB 换 Flip 和 ScrollTrigger 是划算的 —— **前提是它真的用在这些空间转换上**。
如果只是拿来做 fade in，那 40KB 就白花了，那种效果手写更省。

**保留手写的部分**：惯性滚动、磁吸按钮、自定义光标、纸张颗粒。这些已经写好且没有库能做得更好。

---

## 01 — Opening Sequence（开场）

总时长 **1.8 – 2.5 秒**。载入后不要直接看到完整 Hero。

### 1.1 Loader
先只出现：
```
JH
10 SELECTED WORKS
2023 — 2026
```
然后一条细线从左向右跑满。
接着整个 loader 用 `clip-path` 向上收掉，Hero 露出来。

### 1.2 标题
`JH STUDIO'S` 先收紧字距：
```
opacity: 0 → 1
letterSpacing: 0.5em → 正常
```

`Portfolio` 用 SplitText，**按 word / character mask reveal**，不是乱飞：
```
yPercent:  120 → 0
rotation:  2deg → 0
opacity:   0 → 1
stagger:   0.035
duration:  1.2
ease:      expo.out
```

字出来后，背后超大的 `DESIGN` ghost text **慢 0.2 秒**才浮出来。

### 1.3 墨迹
**墨迹不是一开始就在。** 等 `Portfolio` 完成约 70% 才开始刷。

真 SVG mask reveal，不是假 brush 动画：
```
stroke-dashoffset: full → 0
同时轻微 scaleX
```

### 1.4 十张作品卡片 — 第一波 WOW
**不要 10 张同时 fade in。** 要像从桌面下、镜头后、左右两侧一张张飞进来。

| 项目 | x | y | rotation | scale |
|---|---|---|---|---|
| The Luma Club | 200 | -80 | -7 | .78 |
| EXA Energy | 300 | 30 | 8 | — |
| PNC Lifecare | 220 | 180 | -4 | — |
| Furfoo Pet | -160 | 200 | 7 | — |

统一起点 `opacity: 0`，每张间隔 **0.06 – 0.1s**，形成 card cascade。

### 1.5 鼠标视差
卡片群跟鼠标做很轻的 3D parallax：

| 层 | 幅度 |
|---|---|
| 最前面的卡 | ±14px |
| 中间 | ±8px |
| 后面 | ±3px |

**幅度一定要小**，不能做成游戏 UI。

### 1.6 开始滚动 —— Hero 最漂亮的地方
`Portfolio` 标题：
```
scale:   1 → .92
y:       0 → -80
opacity: 1 → .15
```

但 10 张卡**不跟着一起走**，而是向屏幕四周 explode：

```
Luma   → 左上
EXA    → 右上
PNC    → 右
Furfoo → 左
YH     → 中下
MITIC  → 右下
```
各自 rotation 再加一点。

然后这些 screenshot **直接飞进下一屏 Works Grid 的位置** —— 用 GSAP Flip。
视觉上是「漂浮的作品自动整理成作品档案」，不是 section 硬切。

---

## 02 — Works / 作品档案

进入时，Hero 那 10 张卡刚通过 Flip 落到各自的 grid 位置。

### 2.1 标题
巨大的「作品」从 bottom mask reveal，同时黑墨迹从左快速画过。

### 2.2 数字
`10 / 5 / 3+ / 100%` 不直接出现，滚到才 count up。

### 2.3 卡片入场 — Diagonal stagger
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

### 2.4 Hover —— 这里是重点
当前卡片：
```
y:         -12
scale:     1.025
rotationX: 1
rotationY: -1
shadow:    加深
```
截图本身 `scale: 1 → 1.04`，metadata 上移 5px，`Open Live Site →` 箭头 `x: 0 → 7px`。

**更漂亮的是其他卡片自动安静下来**：
```
当前: opacity 1
其他: opacity .45
```

### 2.5 筛选
不要 `display:none` 瞬切。

不相关卡片：
```
scale:   1 → .8
opacity: 1 → 0
```
相关卡片用 Flip 平滑飞到新位置。

---

## 03 — Project Case Study（整站主秀）

**这一段才是真正卖设计能力的地方。Hero 只是预告，Works Grid 是目录。**

### 3.1 进入 Focus Mode
点作品卡，**不要普通 Modal**。卡片本身用 Flip 从小卡展开到接近 `50vw`，
不重新载入页面。右边 case study 内容再慢慢 reveal。

### 3.2 大截图进场
```
clip-path: inset(0 100% 0 0) → inset(0 0 0 0)
scale:     1.08 → 1
```
像摄影作品 reveal。

### 3.3 标题
```
The
Luma
Club
```
**按 line reveal，不是逐字跳。** 这类 luxury 项目逐字动画太浮躁。

### 3.4 三段内容随滚动依次出现
`Challenge` → 滚 80–120px → `What I Did` → 再滚 → `Result`
三条之间的竖线同时往下画。这样客户会真的**读**你的过程。

### 3.5 Pin + Scrub
整个 Case Study 钉住，用户滚约 **180 – 220vh**，页面不马上离开。
左边大截图一直在，右边内容依次出现：Challenge → Solution → Result → Services。

**⚙️ 工程注 — 这里有个真风险**：
10 个项目 × 200vh = **约 2000vh 的强制滚动**，用户想跳过也跳不掉。
作品集的任务是转化，不是留住人。建议改成：

- **主滚动路径**只走 Works Grid（10 张卡一屏看完）
- Case Study 做成**点进去**才有的 Focus Mode
- 进去之后用左右方向键 / 底部缩略图在 10 个项目间切换，随时能退出

这样想快速看完的客户 30 秒能看完，想细看的客户可以一个个进去。
两种人都照顾到，而 Flip 的 WOW 效果一个都没少。

### 3.6 项目之间的切换 —— 全站最大 WOW
滚到底时：
```
当前项目截图:  scale 1 → .8    x 0 → -350    rotation 0 → -4
下一个从右进:  scale .8 → 1    x 450 → 0     rotation 4 → 0
```
`01 / 10` 变 `02 / 10`，标题 mask out → mask in。

比「Grid → 点开 modal → 关掉 → 再点另一个」高级非常多。

---

## 十个项目：各自的 reveal personality

**这是整份 spec 最特别的地方 —— 10 个网站不要用同一种 reveal。**
每种手法都从那个客户的真实业务长出来。

| # | 项目 | 业务定位 | Reveal 手法 |
|---|---|---|---|
| 01 | The Luma Club | 高端 wellness / 私人会所 | 缓慢 cinematic mask reveal，沉浸感 |
| 02 | EXA Energy | 建筑 / 维保 / 工业服务 | 横向机械面板：3 条 strip 拼装成完整网站，像 blueprint |
| 03 | PNC Lifecare | 预防 / 健康护理 | soft blur：`blur(12px) → 0`，`scale .96 → 1` |
| 04 | Furfoo Pet | 宠物 | 轻微 playful bounce：`rotation -3 → 1 → 0` |
| 05 | YH Ideal Academy | 教学 / 笔记 / 课程 | paper / notes reveal：左右两张「纸」打开 |
| 06 | MITIC Asian | 亚洲创新科技平台 | network line 连线 → screenshot reveal |
| 07 | ÉTÀ | 护肤 / 紧致 / 光泽 | 丝滑竖向 mask：`clip-path top → bottom` + 慢速 image zoom |
| 08 | EC DIY Hardware | 五金 / 工具 | grid snap：零件从左右下方 assemble 成页面 |
| 09 | OEM4U2DAY | 保健品 OEM / ODM | 产线感：Formula → Manufacturing → Product → Website 四面板依次组合 |
| 10 | Master Materials | 建材 | 大块 slab：左中右三块石板向中间合起来 |

这样客户看完 10 个项目不会觉得「又是 screenshot fade in」。

**⚙️ 工程注**：10 套 bespoke reveal = 10 倍维护成本。
建议做成**可配置的 reveal 类型**（`data.js` 里每个项目写 `reveal: "slab"`），
共用一套调度器，新客户直接挑一个现成类型，不用再写一套动画。

---

## 04 — About（刻意降速）

刚看完 Project Showcase，视觉需要休息。**这一屏故意少做动效。**

照片：
```
clip-path: inset(0 0 100% 0) → inset(0)
scale:     1.08 → 1
```
照片下的黑 brush 随滚动慢慢画出来。

自我介绍按行 upward reveal：
```
我是 JH，
一个独立的
网页设计师与开发者。
```

Tools（WordPress → WooCommerce → Figma → Ps → Ai → VS Code）：
```
y: 20 → 0, opacity: 0 → 1, stagger: .07
```

Experience 时间线：竖线从上画到下，经过每个年份时 dot `scale: 0 → 1`，文字才出现。

Languages：`scaleX: 0 → 1`，`transform-origin: left`。

---

## 05 — Services + Process

### 5.1 Services 入场 —— 像制图正在被画出来
顺序很重要：
1. 外框 `scaleX: 0 → 1`
2. 竖线一条一条画
3. 六个 service `opacity: 0 → 1`, `y: 25 → 0`

### 5.2 Hover
```
编号圆圈: background transparent → ink, color ink → paper
icon:     rotation 0 → -5 → 0
虚线上的小 dot: 顺着 dotted path 跑过去
```
**图上那些虚线不是装饰，是会动的。**

### 5.3 Process —— 像一支笔正在画
四步之间那条曲线随滚动画出来：
```
01 dot 点亮 → 线继续画 → 02 放大 → 03 → 04
```
整段约 `80vh` 滚动。

---

## 06 — Contact Finale

不是普通 Footer，要有一个 Finale。

进入最后一屏时，前面所有 noise 稍微消失，然后「开始合作」两行超大 reveal。

背景 `2026` 很慢地 `y: 70 → -20`，形成淡淡视差。
墨迹快速横刷过去。

四行联系信息依次进：
```
x: -25 → 0, opacity: 0 → 1, stagger: .08
```

WhatsApp 大按钮最后才出现：
```
scale: .96 → 1, opacity: 0 → 1
```
然后变成 Magnetic Button：鼠标靠近 `x ±8 / y ±6`，离开时 `elastic.out` 回位。
**幅度小，不要整个按钮跑很远。**

### 底部 10 项目 reel
横向 marquee 从右向左很慢地走。
```
hover 某一个: 整条 marquee pause
被 hover 的:  opacity .4 → 1, scale 1 → 1.05
其他:         稍暗
点它:         Flip 回对应的 Case Study
```
**用户已经滚到 footer 了，仍然可以重新进入你的作品。**

---

## 整站滚动体验

不是这种普通结构：
```
Hero → Works → About → Services → Contact
```

而是：
```
Opening Sequence
  ↓
10 张作品漂浮出现
  ↓ scroll
作品卡 explode + rearrange
  ↓
完整 Works Archive
  ↓ 点击 / scroll
Project Focus
  01 The Luma Club → 02 EXA → 03 PNC → … → 10 Master Materials
  ↓
About（视觉休息）
  ↓
Services / Process
  ↓
Contact Finale
  ↓
10-project endless reel
```

---

## ⚙️ 工程注：开工前必须想清楚的四件事

### 1. 手机怎么办
Flip、pin+scrub、鼠标视差、magnetic —— **这四样在触屏上全部无意义或有害**。
手机必须有一套独立的简化编排：卡片顺序 fade + 上移就够了，Case Study 改成普通页面纵向排布。
**手机是大部分客户第一次打开你网站的设备**，不能当成降级方案随便处理。

### 2. 首屏时间
Opening Sequence 1.8–2.5 秒的前提是**资源已经就绪**。
10 张作品截图如果每张 200KB，那 loader 会变成真的在等下载，而不是在演出。
必须：首屏只加载可见的 2–3 张，其余懒加载；截图上 WebP + 尺寸分级。

### 3. SEO 与无障碍
- 所有内容必须在 DOM 里、能被抓取，动效只管「怎么出现」，不能决定「存不存在」
- `prefers-reduced-motion` 开启时，整套编排要能一键降级成静态版
- pin + 自定义滚动容器会打断键盘 Tab 的滚动定位（BRIEF 第 8 节那个坑），要一起处理

### 4. 工期实话
这套编排的工作量大约是现在这个版本的 **3–4 倍**，主要花在：
Flip 的三处空间转换、10 套 bespoke reveal、手机端第二套编排、以及各种中断/resize 的边界情况。
建议分阶段做，不要一次全上：

| 阶段 | 内容 | 拿到什么 |
|---|---|---|
| 1 | Opening Sequence + Hero 卡片群 + 鼠标视差 | 第一印象直接到位 |
| 2 | Hero → Works Grid 的 Flip + 筛选 Flip | 最核心的 WOW |
| 3 | Case Study Focus Mode（先用 1 种通用 reveal） | 结构跑通 |
| 4 | 10 套 bespoke reveal 逐个替换 | 差异化 |
| 5 | Services / Process / Contact 编排 | 收尾 |

每一阶段做完都是**可以上线的状态**，不会卡在半成品。
