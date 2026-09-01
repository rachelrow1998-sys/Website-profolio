/* ============================================================================
   stage.js — Hero 舞台（Phase 1–2）
   ----------------------------------------------------------------------------
   规范来源：MOTION.md 第 1–3 节。GSAP 现在只剩一个白名单场景：
     · Works 筛选重排                （Flip）
   开场序列、入场位移、鼠标视差全部用 CSS / 原生 JS，不走 GSAP。

   封面上的卡片是「一张张贴上去」的：进站时按顺序落位，之后就钉在那儿，
   跟着封面一起滚出视口 —— 滚动过程中不再有任何位移动画，
   也不再把卡片整理进 Works Grid。

   关键设计：真实卡片永远留在 #work-grid 里，一次都不搬走。
   Hero 上贴的是 clone，两边各自独立：
   搬走真卡会让 grid 塌掉 → 页面变矮 → 滚动范围突变 + CLS。
   ============================================================================ */
(function () {
  "use strict";

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* 断点 / 动效偏好 / 输入方式。和 index.html 那段「要不要下载 GSAP」用同一套条件，
     两边保持一致，判断结果才不会互相打架。 */
  var MQ = {
    desktop: window.matchMedia("(min-width: 961px)"),
    reduce:  window.matchMedia("(prefers-reduced-motion: reduce)"),
    hover:   window.matchMedia("(any-hover: hover)")
  };
  /* 纯触屏设备：有 touch 事件、且任何输入方式都不能悬停。
     带触屏的笔记本有触控板 → hover 为真 → 不算纯触屏，照样给桌面体验。
     这样写也避免了 headless / 虚拟桌面误报 any-hover:none 导致真实用户降级。 */
  function touchOnly() { return ("ontouchstart" in window) && !MQ.hover.matches; }

  /* 库是动态注入的（手机不下载），所以不能在模块顶部就把结果定死。
     每次要用时现查，并且只注册一次插件。 */
  var pluginDone = false;
  function libReady() {
    if (!(window.gsap && window.Flip)) return false;
    if (!pluginDone) { window.gsap.registerPlugin(window.Flip); pluginDone = true; }
    return true;
  }

  var stage = $("#hero-stage");
  var mob   = $("#hero-mob");
  var grid  = $("#work-grid");

  var cards = [];          // 真实 .proj 元素，顺序 = data.js 顺序
  var ghosts = [];         // Hero 上贴着的 clone
  var live   = false;      // 桌面舞台是否已启用

  /* ---------------------------------------------------------------------
     Hero 散落布局。x/y/w 都是百分比 —— resize 和 orientation change
     完全交给 CSS，JS 一行都不用重算。
     --------------------------------------------------------------------- */
  /* 坐标直接量自参考图（1448×1087 那张首屏）：
     把每张卡的中心点换算成 #hero-stage 盒子里的百分比，
     宽度换算成盒子宽度的百分比。改版式时只动这张表。 */
  var SCATTER = [
    { x: 38.9, y: 17.0, r: -2.0, s: 1, w: 25.1, z: 1  },  /* 01 luma       */
    { x: 62.4, y: 22.3, r:  1.5, s: 1, w: 25.1, z: 2  },  /* 02 exa        */
    { x: 84.9, y: 34.1, r: -1.5, s: 1, w: 24.1, z: 3  },  /* 03 pnc        */
    { x: 23.7, y: 49.2, r:  2.0, s: 1, w: 20.9, z: 4  },  /* 04 furfoo     */
    { x: 50.1, y: 51.4, r: -1.5, s: 1, w: 28.8, z: 5  },  /* 05 yh         */
    { x: 77.6, y: 60.2, r:  1.5, s: 1, w: 24.1, z: 6  },  /* 06 mitic      */
    { x: 11.1, y: 74.8, r: -2.0, s: 1, w: 23.2, z: 7  },  /* 07 etaeta     */
    { x: 35.4, y: 80.6, r:  1.0, s: 1, w: 22.7, z: 8  },  /* 08 ec diy     */
    { x: 60.4, y: 87.6, r: -1.0, s: 1, w: 22.0, z: 9  },  /* 09 oem        */
    { x: 85.5, y: 92.1, r:  1.5, s: 1, w: 25.1, z: 10 }   /* 10 master     */
  ];

  /* 入场起点：最终位置的正上方一点点，稍微大一圈、多歪几度。
     幅度刻意小 —— 要的是「按上去」，不是「从屏幕外飞进来」。 */
  var ENTER = [
    { x: -14, y: -74, r: -5.0, s: 1.12 },
    { x:  16, y: -70, r:  4.5, s: 1.12 },
    { x:  20, y: -62, r: -4.0, s: 1.10 },
    { x: -20, y: -66, r:  5.0, s: 1.11 },
    { x:   8, y: -72, r: -4.5, s: 1.12 },
    { x:  18, y: -60, r:  4.0, s: 1.10 },
    { x: -18, y: -60, r: -5.0, s: 1.10 },
    { x:   6, y: -68, r:  3.5, s: 1.11 },
    { x:  14, y: -64, r: -3.5, s: 1.10 },
    { x:  22, y: -58, r:  4.5, s: 1.09 }
  ];

  /* 视差深度：越靠前幅度越大（MOTION.md 2.3） */
  function depth(z) { return z >= 9 ? 14 : z >= 5 ? 8 : 3; }

  /* 舞台本身不依赖 GSAP —— 贴卡片是纯 CSS transition。
     GSAP 只在筛选重排时才用得上，加载失败也不影响封面。 */
  function canStage() {
    return !!stage && !!grid &&
           MQ.desktop.matches && !touchOnly() && !MQ.reduce.matches;
  }

  /* =====================================================================
     Hero clone
     ===================================================================== */
  /* 把 scatter 坐标写成 CSS 自定义属性 —— 位置、大小、旋转全是百分比 / deg，
     resize 时浏览器自己跟着视口走，JS 一行都不用重算。 */
  function placeGhost(g, i) {
    var s = SCATTER[i];
    if (!s) return;
    g.style.setProperty("--hx", s.x + "%");
    g.style.setProperty("--hy", s.y + "%");
    g.style.setProperty("--hr", s.r + "deg");
    g.style.setProperty("--hs", s.s);
    g.style.setProperty("--hw", s.w + "%");
    g.style.setProperty("--hz", s.z);
    g.style.setProperty("--dep", depth(s.z));
  }

  function makeGhosts() {
    if (ghosts.length) return;
    cards.forEach(function (card, i) {
      var s = SCATTER[i];
      if (!s) return;
      var g = card.cloneNode(true);
      g.classList.add("proj--ghost");
      g.removeAttribute("role");
      g.setAttribute("aria-hidden", "true");
      g.setAttribute("tabindex", "-1");
      $$("[id]", g).forEach(function (n) { n.removeAttribute("id"); });

      /* cloneNode 不会复制 addEventListener 绑的 onerror，
         所以 clone 的图会直接裂掉。这里把原卡「已经解析好的」src 抄过来，
         并且自己再接一次 fallback，双保险。 */
      var srcImg = $("img", card), gImg = $("img", g);
      if (gImg) {
        var resolved = srcImg && (srcImg.currentSrc || srcImg.src);
        if (resolved && srcImg.naturalWidth > 0) gImg.src = resolved;
        gImg.addEventListener("error", function h() {
          gImg.removeEventListener("error", h);
          gImg.src = "assets/img/placeholder/" + card.dataset.slug + ".svg";
        });
        if (gImg.complete && gImg.naturalWidth === 0) {
          gImg.src = "assets/img/placeholder/" + card.dataset.slug + ".svg";
        }
      }

      /* Hero 上给一个「01 项目名」小标签，跟参考图一致 */
      var name = $(".proj__name", card);
      var label = card.dataset.client || (name ? name.textContent : "");
      var cap = document.createElement("figcaption");
      cap.className = "ghost__cap";
      cap.innerHTML = '<b>' + String(i + 1).padStart(2, "0") + "</b>" +
                      "<span>" + label.replace(/[<&>]/g, "") + "</span>";
      g.appendChild(cap);
      placeGhost(g, i);
      stage.appendChild(g);
      ghosts.push(g);
    });
  }

  function dropGhosts() {
    ghosts.forEach(function (g) { if (g.parentNode) g.parentNode.removeChild(g); });
    ghosts = [];
  }

  /* 舞台的显隐。真卡不参与 —— 它们一直好端端地待在 Works Grid 里，
     封面上的是各自独立的 clone。 */
  function stageLive(on) {
    if (stage) stage.classList.toggle("is-live", !!on);
    /* 给 <html> 打标记，让 CSS 能重排封面版式（stage 在 .cover 后面，选择器够不到） */
    document.documentElement.classList.toggle("hero-live", !!on);
  }

  /* =====================================================================
     开场入场：一张张贴上去。纯 CSS transition，不用 GSAP
     ===================================================================== */
  /* 开机动画还盖在上面时不要开始贴 —— 否则十张卡全在遮罩后面贴完了，
     遮罩一升起来，用户看到的是一堵已经贴好的墙。等它走完再开始。 */
  function whenBootDone(cb) {
    var box = document.getElementById("boot");
    if (!box || box.classList.contains("is-done")) return cb();
    var fired = false;
    function go() {
      if (fired) return;
      fired = true;
      clearInterval(iv); clearTimeout(to);
      cb();
    }
    var iv = setInterval(function () { if (box.classList.contains("is-done")) go(); }, 60);
    var to = setTimeout(go, 4000);          /* 兜底：遮罩万一卡住，也得把卡片贴上去 */
  }

  function playEntrance() {
    if (!ghosts.length) return;
    ghosts.forEach(function (g, i) {
      var e = ENTER[i] || {};
      g.style.setProperty("--ex", (e.x || 0) + "px");
      g.style.setProperty("--ey", (e.y || 0) + "px");
      g.style.setProperty("--er", (e.r || 0) + "deg");
      g.style.setProperty("--es", e.s || .85);
      g.style.setProperty("--eo", 0);
      g.style.setProperty("--ed", (i * 105) + "ms");  /* 一张贴完接下一张，看得出先后 */
    });
    void stage.offsetWidth;                            /* 强制回流，让起点生效 */
    stage.classList.add("is-entering");

    whenBootDone(function () {
      if (!live) return;                               /* 期间可能已经缩到手机断点 */
      setTimeout(function () {
        ghosts.forEach(function (g) {
          g.style.setProperty("--ex", "0px");
          g.style.setProperty("--ey", "0px");
          g.style.setProperty("--er", "0deg");
          g.style.setProperty("--es", 1);
          g.style.setProperty("--eo", 1);
        });
        /* 贴完就撤掉 transition —— 之后 transform 只由鼠标视差写，
           留着过渡反而会让视差变粘。 */
        setTimeout(function () {
          if (stage) stage.classList.remove("is-entering");
          ghosts.forEach(function (g) { g.style.removeProperty("--ed"); });
        }, 620 + ghosts.length * 105 + 120);
      }, 200);                                         /* 让遮罩先收干净 */
    });
  }

  /* =====================================================================
     鼠标视差（原生 JS，lerp 平滑）
     ===================================================================== */
  var pTargetX = 0, pTargetY = 0, pX = 0, pY = 0, pRunning = false;

  function onMouse(e) {
    if (!live) return;
    pTargetX = (e.clientX / window.innerWidth  - .5) * 2;
    pTargetY = (e.clientY / window.innerHeight - .5) * 2;
    if (!pRunning) { pRunning = true; requestAnimationFrame(pLoop); }
  }
  function pLoop() {
    pX += (pTargetX - pX) * .07;
    pY += (pTargetY - pY) * .07;
    for (var i = 0; i < ghosts.length; i++) {
      var g = ghosts[i];
      var d = parseFloat(g.style.getPropertyValue("--dep")) || 6;
      g.style.setProperty("--px", (pX * d).toFixed(2) + "px");
      g.style.setProperty("--py", (pY * d * .7).toFixed(2) + "px");
    }
    if (Math.abs(pTargetX - pX) > .001 || Math.abs(pTargetY - pY) > .001) requestAnimationFrame(pLoop);
    else pRunning = false;
  }

  /* =====================================================================
     Flip：筛选重排   —— 白名单 #2
     ===================================================================== */
  function filterWithFlip(apply) {
    /* 触屏 / 减少动效 / 库没加载：直接更新，不做 Flip。
       MOTION.md 3.2：手机筛选不强求 Flip，干净比炫重要。 */
    if (!libReady() || MQ.reduce.matches || touchOnly()) { apply(); return; }
    var Flip = window.Flip, gsap = window.gsap;
    var DUR = .6, EASE = "power3.inOut";

    /* 这个方向必须用 absolute —— 卡片真的换了格子，有的还整个离场。
       但 absolute 会把它们抽出文档流，grid 当场塌掉，下面的内容整块跳。
       所以同时把容器高度从「旧的」补到「新的」，页面就不会抖。 */
    var h0 = grid.getBoundingClientRect().height;
    var st = Flip.getState(cards, { props: "opacity" });
    apply();
    var h1 = grid.getBoundingClientRect().height;      /* 筛选后的自然高度 */

    gsap.killTweensOf(grid);
    grid.style.height = h0 + "px";

    Flip.from(st, {
      duration: DUR,
      ease: EASE,
      absolute: true,
      scale: true,
      onEnter: function (els) { return gsap.fromTo(els, { opacity: 0, scale: .8 }, { opacity: 1, scale: 1, duration: .5, ease: "power2.out" }); },
      onLeave: function (els) { return gsap.to(els, { opacity: 0, scale: .8, duration: .32, ease: "power2.in" }); }
    });
    gsap.to(grid, {
      height: h1, duration: DUR, ease: EASE,
      onComplete: function () { grid.style.height = ""; }   /* 交还给 CSS，resize 才不会被锁死 */
    });
  }

  /* =====================================================================
     手机版 Hero：4 个精选作品的错位 stack（MOTION.md 3.1）
     不做视差 / 3D / magnetic / Flip
     ===================================================================== */
  function buildMobileHero() {
    if (!mob) return;
    /* 卡片本体是静态输出的（tools/sync-static.mjs 写进 index.html），
       JS 不再插入节点 —— 插入会把下面的内容推走，产生 CLS。
       这里只负责触发入场过渡。 */
    if (!mob.childElementCount) return;
    requestAnimationFrame(function () { mob.classList.add("is-in"); });
  }

  /* =====================================================================
     启用 / 拆除
     ===================================================================== */
  function activate() {
    if (live) return;
    live = true;
    makeGhosts();
    stageLive(true);
    playEntrance();
    window.addEventListener("mousemove", onMouse, { passive: true });
  }

  function deactivate() {
    if (!live) return;
    window.removeEventListener("mousemove", onMouse);
    dropGhosts();
    stageLive(false);
    live = false;
  }

  /* 断点 / 动效偏好 / 输入方式变化 → 重新判断
     （resize、orientation change、拖到副屏都会走到这里） */
  function reassess() {
    if (canStage()) {
      if (!live) activate();
    } else {
      deactivate();
      buildMobileHero();
    }
  }

  /* =====================================================================
     启动
     ===================================================================== */
  var booted = false;
  function boot(list) {
    /* 必须幂等：jh:cards-ready 事件和文件末尾的兜底都可能调到这里，
       调两次就会多出一整套 ghost（20 个），视差和 Flip 全乱。 */
    if (booted) return;
    cards = list.map(function (c) { return c.el; });
    if (!cards.length) return;
    booted = true;

    buildMobileHero();

    /* 舞台是纯 CSS 的，不用等 GSAP 到位 —— 卡片可以立刻开始一张张贴上去。
       也不用管进站时停在哪一屏：卡片只贴在封面上，不再和作品区抢内容，
       所以带锚点进来（/#work）再滚回顶部，封面照样是完整的。 */
    if (canStage()) activate();

    var rt;
    function onResize() {
      clearTimeout(rt);
      rt = setTimeout(reassess, 180);
    }
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onResize, { passive: true });
    ["desktop", "reduce", "hover"].forEach(function (k) {
      var mq = MQ[k];
      if (mq.addEventListener) mq.addEventListener("change", onResize);
      else if (mq.addListener) mq.addListener(onResize);       /* 老 Safari */
    });

    window.JHStage = {
      filter: filterWithFlip,
      isLive: function () { return live; },
      lib: libReady() ? { gsap: window.gsap.version, flip: !!window.Flip } : null
    };
  }

  document.addEventListener("jh:cards-ready", function (e) { boot(e.detail.cards); });

  /* stage.js 是 defer 的，可能比 jh:cards-ready 晚到 —— 兜底自己捞一次 */
  if (!cards.length) {
    var existing = $$(".proj", grid || document);
    if (existing.length) boot(existing.map(function (el) { return { el: el }; }));
  }
})();
