/* ============================================================================
   stage.js — Hero 舞台 + Flip 生命周期（Phase 1–2）
   ----------------------------------------------------------------------------
   规范来源：MOTION.md 第 1–3 节。GSAP 只允许出现在白名单场景里：
     · Hero 卡片群 ⇄ Works Grid      （Flip）
     · Works 筛选重排                （Flip）
   开场序列、入场位移、鼠标视差全部用 CSS / 原生 JS，不走 GSAP。

   关键设计：真实卡片永远留在 #work-grid 里，一次都不搬走。
   Hero 上飞的是 clone，靠 data-flip-id 和真卡配对。
   这样做的原因：搬走真卡会让 grid 塌掉 → 页面变矮 → 滚动范围突变 + CLS。
   Flip 支持用 flip-id 跨元素配对，正好解决这个问题。
   ============================================================================ */
(function () {
  "use strict";

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ⚠️ 这三条必须和 index.html 里那段「要不要下载 GSAP」的判断完全一致，
     否则会出现「库下载了但舞台不启用」或者反过来的错位。 */
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
  var ghosts = [];         // Hero 上的 clone
  var mode   = "grid";     // 'hero' | 'grid'
  var busy   = false;
  var want   = null;       // 排队的目标（动画期间来的请求）
  var live   = false;      // 桌面舞台是否已启用

  /* ---------------------------------------------------------------------
     Hero 散落布局。x/y/w 都是百分比 —— resize 和 orientation change
     完全交给 CSS，JS 一行都不用重算。
     --------------------------------------------------------------------- */
  var SCATTER = [
    { x: 34, y: 10, r: -3.5, s: 1.00, w: 30, z: 12 },  /* 01 luma       */
    { x: 66, y: 20, r:  2.5, s: 0.88, w: 28, z: 10 },  /* 02 exa        */
    { x: 86, y: 40, r: -2.0, s: 0.76, w: 24, z: 8  },  /* 03 pnc        */
    { x: 16, y: 40, r:  3.0, s: 0.90, w: 27, z: 11 },  /* 04 furfoo     */
    { x: 48, y: 52, r: -2.5, s: 0.96, w: 29, z: 9  },  /* 05 yh         */
    { x: 78, y: 62, r:  2.0, s: 0.82, w: 25, z: 7  },  /* 06 mitic      */
    { x: 14, y: 74, r: -3.0, s: 0.80, w: 24, z: 6  },  /* 07 etaeta     */
    { x: 42, y: 84, r:  1.5, s: 0.86, w: 26, z: 5  },  /* 08 ec diy     */
    { x: 70, y: 90, r: -1.5, s: 0.80, w: 24, z: 4  },  /* 09 oem        */
    { x: 90, y: 76, r:  2.5, s: 0.72, w: 22, z: 3  }   /* 10 master     */
  ];

  /* 入场起点。前四组来自 MOTION.md 2.3 的表，其余按同一逻辑补齐。 */
  var ENTER = [
    { x:  200, y:  -80, r: -7, s: .78 },
    { x:  300, y:   30, r:  8, s: .82 },
    { x:  220, y:  180, r: -4, s: .82 },
    { x: -160, y:  200, r:  7, s: .84 },
    { x:  -80, y:  240, r: -5, s: .84 },
    { x:  260, y:  140, r:  6, s: .80 },
    { x: -240, y:  120, r: -6, s: .80 },
    { x:   60, y:  260, r:  4, s: .84 },
    { x:  200, y:  240, r: -3, s: .82 },
    { x:  300, y:  200, r:  5, s: .78 }
  ];

  /* 视差深度：越靠前幅度越大（MOTION.md 2.3） */
  function depth(z) { return z >= 9 ? 14 : z >= 5 ? 8 : 3; }

  function canStage() {
    return libReady() && !!stage && !!grid &&
           MQ.desktop.matches && !touchOnly() && !MQ.reduce.matches;
  }

  /* 用户是不是真的从首屏进来的。
     带锚点直接进 /#work 时不能启用舞台 —— 否则卡片都在上面的 Hero 里，
     他打开看到的是一个空的作品区。 */
  function atTop() {
    if ((window.scrollY || window.pageYOffset || 0) > window.innerHeight * .12) return false;
    var h = location.hash;
    if (h && h.length > 1 && h !== "#home" && document.getElementById(h.slice(1))) return false;
    return true;
  }

  /* =====================================================================
     Hero clone
     ===================================================================== */
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
      var cap = document.createElement("figcaption");
      cap.className = "ghost__cap";
      cap.innerHTML = '<b>' + String(i + 1).padStart(2, "0") + "</b>" +
                      "<span>" + (name ? name.textContent : "") + "</span>";
      g.appendChild(cap);
      g.dataset.flipId = card.dataset.slug;   /* ghost 持有 id，真卡此时不持有 */
      g.style.setProperty("--hx", s.x + "%");
      g.style.setProperty("--hy", s.y + "%");
      g.style.setProperty("--hr", s.r + "deg");
      g.style.setProperty("--hs", s.s);
      g.style.setProperty("--hw", s.w + "%");
      g.style.setProperty("--hz", s.z);
      g.style.setProperty("--dep", depth(s.z));
      stage.appendChild(g);
      ghosts.push(g);
    });
  }

  /* flip-id 必须同一时刻只挂在一边。
     真卡和 ghost 同时带同一个 id 时，Flip 配对会二选一 ——
     回 Hero 时它挑中真卡，真卡被抽成 absolute，grid 当场塌掉。 */
  function ownIds(who) {
    cards.forEach(function (c) {
      if (who === "cards") c.dataset.flipId = c.dataset.slug;
      else delete c.dataset.flipId;
    });
  }

  function dropGhosts() {
    ghosts.forEach(function (g) { if (g.parentNode) g.parentNode.removeChild(g); });
    ghosts = [];
  }

  function ghostGrid(on) {
    cards.forEach(function (c) { c.classList.toggle("is-ghosted", !!on); });
    if (stage) stage.classList.toggle("is-live", !!on);
    /* 给 <html> 打标记，让 CSS 能重排封面版式（stage 在 .cover 后面，选择器够不到） */
    document.documentElement.classList.toggle("hero-live", !!on);
  }

  /* =====================================================================
     开场入场：纯 CSS transition，不用 GSAP
     ===================================================================== */
  function playEntrance() {
    if (!ghosts.length) return;
    ghosts.forEach(function (g, i) {
      var e = ENTER[i] || {};
      g.style.setProperty("--ex", (e.x || 0) + "px");
      g.style.setProperty("--ey", (e.y || 0) + "px");
      g.style.setProperty("--er", (e.r || 0) + "deg");
      g.style.setProperty("--es", e.s || .85);
      g.style.setProperty("--eo", 0);
      g.style.setProperty("--ed", (i * 80) + "ms");   /* 0.06–0.1s 之间的 cascade */
    });
    void stage.offsetWidth;                            /* 强制回流，让起点生效 */
    stage.classList.add("is-entering");
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        ghosts.forEach(function (g) {
          g.style.setProperty("--ex", "0px");
          g.style.setProperty("--ey", "0px");
          g.style.setProperty("--er", "0deg");
          g.style.setProperty("--es", 1);
          g.style.setProperty("--eo", 1);
        });
      });
    });
    /* 入场结束后撤掉 transition，避免和 Flip 抢同一个 transform */
    setTimeout(function () {
      if (stage) stage.classList.remove("is-entering");
      ghosts.forEach(function (g) { g.style.removeProperty("--ed"); });
    }, 1100 + ghosts.length * 80 + 120);
  }

  /* =====================================================================
     鼠标视差（原生 JS，lerp 平滑）
     ===================================================================== */
  var pTargetX = 0, pTargetY = 0, pX = 0, pY = 0, pRunning = false;

  function onMouse(e) {
    if (mode !== "hero") return;
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
  function clearParallax() {
    ghosts.forEach(function (g) { g.style.removeProperty("--px"); g.style.removeProperty("--py"); });
    pX = pY = pTargetX = pTargetY = 0;
  }

  /* =====================================================================
     Flip：Hero ⇄ Grid   —— 白名单 #1
     ===================================================================== */
  function flipTo(target) {
    if (!libReady() || !live || target === mode) return;
    if (busy) { want = target; return; }        /* 动画中来的请求排队，不打断 */
    busy = true;
    want = null;

    var Flip = window.Flip, gsap = window.gsap;
    gsap.killTweensOf(cards.concat(ghosts));
    clearParallax();

    var st, opts;

    if (target === "grid") {
      st = Flip.getState(ghosts, { props: "opacity" });   /* 起点：Hero 上的 clone */
      dropGhosts();
      ownIds("cards");                                     /* id 交给真卡 */
      ghostGrid(false);
      opts = { stagger: { each: .022, from: "start" } };
    } else {
      ownIds("cards");
      st = Flip.getState(cards, { props: "opacity" });      /* 起点：grid 里的真卡 */
      ownIds("none");                                      /* 交出 id，让 ghost 接手 */
      makeGhosts();
      ghostGrid(true);
      opts = { stagger: { each: .018, from: "end" } };
    }

    /* 刻意不用 absolute:true —— 两个方向的终点布局本来就是对的，
       纯 transform 就能飞完，完全不碰布局。加了 absolute 反而会把元素
       抽出文档流，grid 当场塌掉，页面高度和滚动范围都会跳。 */
    Flip.from(st, {
      duration: .95,
      ease: "expo.out",
      scale: true,
      stagger: opts.stagger,
      onComplete: function () {
        mode = target;
        busy = false;
        if (want && want !== mode) { var w = want; want = null; flipTo(w); }
      }
    });
  }

  /* =====================================================================
     Flip：筛选重排   —— 白名单 #2
     ===================================================================== */
  function filterWithFlip(apply) {
    /* 触屏 / 减少动效 / 库没加载 / 还在 Hero 模式：直接更新，不做 Flip。
       MOTION.md 3.2：手机筛选不强求 Flip，干净比炫重要。 */
    if (!libReady() || MQ.reduce.matches || touchOnly() || mode === "hero") { apply(); return; }
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
    /* 永久标记：舞台启用过。用来关掉 grid 卡片自己那套 CSS 入场动画，
       否则 Flip 结束后它会再播一次。这个类一旦加上就不再移除。 */
    document.documentElement.classList.add("stage-used");
    ownIds("none");
    makeGhosts();
    ghostGrid(true);
    mode = "hero";
    playEntrance();
    window.addEventListener("mousemove", onMouse, { passive: true });
  }

  function deactivate() {
    if (!live) return;
    window.removeEventListener("mousemove", onMouse);
    if (window.gsap) window.gsap.killTweensOf(cards.concat(ghosts));
    dropGhosts();
    ownIds("cards");
    ghostGrid(false);
    cards.forEach(function (c) { c.style.cssText = ""; });
    mode = "grid";
    live = false;
    busy = false;
    want = null;
  }

  /* 断点 / 动效偏好 / 输入方式变化 → 重新判断
     （resize、orientation change、拖到副屏都会走到这里） */
  function reassess() {
    if (canStage()) {
      /* 只有还在首屏才重新布 Hero，否则用户已经在看作品了，别把卡片抢回去 */
      if (!live && atTop()) activate();
    } else {
      deactivate();
      buildMobileHero();
    }
  }

  /* =====================================================================
     滚动触发（带回差，避免临界点抖动）
     ===================================================================== */
  var lastY = -1;
  function onScroll() {
    if (!live) return;
    var y = window.scrollY || window.pageYOffset || 0;
    if (y === lastY) return;
    lastY = y;
    var vh = window.innerHeight;
    if (mode !== "grid" && y > vh * .34) flipTo("grid");
    else if (mode !== "hero" && y < vh * .12) flipTo("hero");
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

    function tryActivate() { if (canStage() && atTop()) activate(); }
    if (window.__jhGsapPending) {
      /* 库还在路上：等它到了再决定。加个超时兜底，
         万一脚本 404 或被拦，也不能一直挂着不启用。 */
      var done = false;
      var go = function () { if (done) return; done = true; tryActivate(); };
      document.addEventListener("jh:gsap-ready", go, { once: true });
      setTimeout(go, 3000);
    } else {
      tryActivate();
    }

    window.addEventListener("scroll", onScroll, { passive: true });

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

    /* 键盘用户在 Hero 模式下 Tab 到作品卡 → 立刻整理成 Grid，
       否则焦点会落在一张透明的卡上，等于焦点消失。 */
    document.addEventListener("focusin", function (e) {
      if (live && mode === "hero" && e.target.closest && e.target.closest(".proj")) flipTo("grid");
    });

    window.JHStage = {
      filter: filterWithFlip,
      mode: function () { return mode; },
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
