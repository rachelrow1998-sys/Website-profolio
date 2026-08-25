# 第三方库（自托管）

放在这里的文件**不要手改**，要升级请重新从 npm 复制：

```bash
npm install gsap@<version>
cp node_modules/gsap/dist/gsap.min.js  assets/vendor/gsap.min.js
cp node_modules/gsap/dist/Flip.min.js  assets/vendor/Flip.min.js
```

## 为什么自托管而不是 CDN

`BRIEF.md` 第 8 节：**零外部请求**。客户从小红书来，
中国大陆访问外部 CDN 不稳定，而且多一个第三方就多一个失败点。

## 为什么只有 gsap + Flip，没有 ScrollTrigger

`MOTION.md` 1.3 节把 GSAP 的用法锁死在四处。
Phase 1–2 只用到其中三处（全部是 Flip），**ScrollTrigger 一行都用不到，所以不加载**。
等 Phase 3 做 Case Study 的 pin/scrub 时再按需加进来。

| 文件 | 用途 | 白名单条目 |
|---|---|---|
| `gsap.min.js` | Flip 的运行时依赖 | — |
| `Flip.min.js` | Hero→Grid、筛选重排 | 1, 2 |
| ~~`ScrollTrigger.min.js`~~ | 未加载 | 4（Phase 3 再说） |

GSAP 的标准 license 允许在自己的项目里这样使用；
Flip 与 ScrollTrigger 自 GSAP 3.13 起随公开包一起发布。
