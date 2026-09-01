/* ============================================================================
   study.js — 作品详情 Focus Mode（MOTION.md 2.6 / 3.3）
   ----------------------------------------------------------------------------
   这一层是「点了才进来」的，不是主路径的一段。所以它做两件事：
     1. 把一张 Grid 卡片放大成一整页案例（用 GSAP Flip，白名单第 3 条）
     2. 关掉时飞回原来那张卡的位置 —— 不是跳回页面顶部
   项目之间的左右切换、印章旋转、进度条、自动播放全部是 CSS / 原生 JS，
   没有再多调一次 GSAP。理由见 MOTION.md 1.3。

   ⚠️ 这个文件挂了不会让作品看不了：main.js 的 openStudy() 里有退路，
      study.js 不在就直接打开客户网站。
   ============================================================================ */
(function () {
  "use strict";

  var root = document.getElementById("focus");
  if (!root || typeof PROJECTS === "undefined" || !PROJECTS.length) return;

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* main.js 暴露的最小接口。它没准备好也要能降级，不能整页报错。 */
  var API = window.JHApi || {};
  function t(k) { return API.t ? API.t(k) : ""; }
  function pick(o) { return API.pick ? API.pick(o) : (o ? (o.en || o.zh || "") : ""); }
  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function shotSrc(p) { return API.shotSrc ? API.shotSrc(p) : ("assets/img/placeholder/" + p.slug + ".svg"); }
  function fallbackSrc(p) { return API.fallbackSrc ? API.fallbackSrc(p) : ("assets/img/placeholder/" + p.slug + ".svg"); }

  var N = PROJECTS.length;
  function pad(n) { return n < 10 ? "0" + n : String(n); }

  /* =====================================================================
     环境判断 —— 这几条必须和 index.html 的 GSAP 加载条件、
     stage.js 的 canStage() 保持一致，任何一处改了另外两处都要改。
     ===================================================================== */
  var MQ = {
    desktop: window.matchMedia("(min-width: 961px)"),
    reduce:  window.matchMedia("(prefers-reduced-motion: reduce)"),
    hover:   window.matchMedia("(any-hover: hover)")
  };
  function touchOnly() { return ("ontouchstart" in window) && !MQ.hover.matches; }
  function rich() { return MQ.desktop.matches && !touchOnly() && !MQ.reduce.matches; }
  function canFlip() { return rich() && !!(window.gsap && window.Flip); }

  /* =====================================================================
     DOM
     ===================================================================== */
  var el = {
    panel:     $("#focus-panel"),
    n:         $("#fx-n"),
    total:     $("#fx-total"),
    slide:     $("#fx-slide"),
    device:    $("#fx-device"),
    screen:    $("#fx-screen"),
    img:       $("#fx-img"),
    cn:        $("#fx-cn"),
    cname:     $("#fx-cname"),
    title:     $("#fx-title"),
    sub:       $("#fx-sub"),
    lede:      $("#fx-lede"),
    challenge: $("#fx-challenge"),
    work:      $("#fx-work"),
    result:    $("#fx-result"),
    services:  $("#fx-services"),
    visit:     $("#fx-visit"),
    visitText: $("#fx-visit span"),
    eyebrow:   $(".focus__eyebrow span"),
    deck:      $("#fx-deck"),
    ticks:     $("#fx-ticks"),
    now:       $("#fx-now"),
    fill:      $("#fx-fill"),
    logos:     $("#fx-logos"),
    auto:      $("#fx-auto"),
    autotext:  $("#fx-autotext"),
    prev:      $("#fx-prev"),
    next:      $("#fx-next"),
    prevname:  $("#fx-prevname"),
    nextname:  $("#fx-nextname"),
    live:      $("#fx-live"),
    stamp:     $("#fx-stamptext")
  };

  var idx = -1;            // 当前第几个
  var isOpen = false;
  var busy = false;        // 转场进行中，挡住重复触发
  var originSlug = null;   // 从哪张卡进来的 —— 关闭要飞回它
  var lastFocus = null;

  /* =====================================================================
     浏览器 / 手机的「返回」
     ---------------------------------------------------------------------
     案例页是盖在主页上的一层，不是另一个网页。不管历史的话，
     人在案例里按一下返回，直接退出整个网站回到上一个页面 —— 这不对。
     打开时往历史里压一条，返回先把这一层关掉，回到作品列表。
     左右切换项目用 replaceState（不叠新条目），所以任何时候一次返回就出去，
     不用按十下。pushState 在 file:// 下可能抛错，抛了就退回没有历史的老行为。
     ===================================================================== */
  var HASH = "#case-";
  var histOwned = false;                 // 历史里那条是不是我们压的
  function caseHash(slug) { return HASH + slug; }
  function isCaseState(st) { return !!(st && st.jhStudy); }
  function histPush(slug) {
    try { history.pushState({ jhStudy: slug }, "", caseHash(slug)); histOwned = true; }
    catch (e) {
      try { history.pushState({ jhStudy: slug }, ""); histOwned = true; }
      catch (e2) { histOwned = false; }
    }
  }
  function histReplace(slug) {
    if (!histOwned) return;
    try { history.replaceState({ jhStudy: slug }, "", caseHash(slug)); }
    catch (e) { try { history.replaceState({ jhStudy: slug }, ""); } catch (e2) {} }
  }
  var autoId = 0, hovering = false;
  var AUTO_MS = 7000;

  /* =====================================================================
     内容填充
     ===================================================================== */
  function setImg(p) {
    el.img.onerror = function () {
      el.img.onerror = null;
      el.img.src = fallbackSrc(p);
      setGlass(fallbackSrc(p));
    };
    el.img.src = shotSrc(p);
    el.img.alt = p.name;
    setGlass(shotSrc(p));
  }

  /* 玻璃边框后面垫的那层模糊截图。CSS 拿不到 <img> 的 src，
     所以把地址写成自定义属性给 .focus__device::after 用 ——
     边框里透出来的是这一屏自己的颜色，玻璃才不像一圈白塑料。 */
  function setGlass(src) {
    if (!el.device) return;
    /* 写成绝对地址：相对地址在 var() 里会按「用到它的那张样式表」去解析，
       也就是 assets/css/ 下面 —— 图就 404 了，边框会变成一圈白板。 */
    var abs = src;
    try { abs = new URL(src, document.baseURI).href; } catch (e) {}
    el.device.style.setProperty("--shot", 'url("' + abs + '")');
  }

  function fill(i) {
    idx = i;
    var p = PROJECTS[i], s = p.study || {};

    el.n.textContent     = pad(i + 1);
    el.total.textContent = pad(N);
    el.cn.textContent    = pad(i + 1);
    el.cname.textContent = p.name;
    el.title.textContent = p.name;
    el.sub.textContent   = pick(s.subtitle);
    el.lede.textContent  = pick(p.blurb);
    el.challenge.textContent = pick(s.challenge);
    el.work.textContent      = pick(s.work);
    el.result.textContent    = pick(s.result);

    el.services.innerHTML = (s.services || []).map(function (x) {
      return "<li>" + esc(x) + "</li>";
    }).join("");

    /* 站还在才给链接。已下线 / 没有公开地址的，按钮变成不可点的说明 ——
       把客户送去一个域名停放页，比这一格空着难看得多。 */
    var linkable = p.live !== false && !!p.url;
    el.visit.classList.toggle("is-dead", !linkable);
    if (linkable) {
      el.visit.href = p.url;
      el.visit.removeAttribute("aria-disabled");
      el.visitText.textContent = t("study.visit");
    } else {
      el.visit.removeAttribute("href");          // 没有 href 就不可点、也不进 Tab 顺序
      el.visit.setAttribute("aria-disabled", "true");
      /* 「站已经下线」和「本来就不对外」是两回事，不能用同一句话打发。 */
      el.visitText.textContent = p.live === false ? t("study.offline") : t("study.private");
    }
    /* 自有品牌就照实说，不要冒充客户委托 */
    el.eyebrow.textContent = p.mine ? t("study.own") : t("study.eyebrow");
    setImg(p);

    var prev = PROJECTS[(i - 1 + N) % N], next = PROJECTS[(i + 1) % N];
    el.prevname.textContent = prev.name;
    el.nextname.textContent = next.name;

    markTicks();
    markDeck();
  }

  /* =====================================================================
     底部「其他作品」
     ---------------------------------------------------------------------
     只建一次。切换项目时不重建 DOM，只改 order 和 .is-current ——
     重建会让横向滚动位置每次跳回开头，用起来很烦。
     ===================================================================== */
  var DECK = [];
  var ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function buildDeck() {
    el.deck.innerHTML = "";
    DECK = [];
    PROJECTS.forEach(function (p, i) {
      var li = document.createElement("li");
      li.innerHTML =
        '<button class="focus__card" type="button">' +
          '<span class="focus__cardshot" aria-hidden="true">' +
            '<img alt="" loading="lazy" decoding="async" src="' + esc(shotSrc(p)) + '">' +
          "</span>" +
          '<span class="focus__cardtx">' +
            "<b>" + pad(i + 1) + "</b>" +
            '<span class="focus__cardcat"></span>' +
            '<span class="focus__cardname">' + esc(p.name) + "</span>" +
            '<span class="focus__cardblurb"></span>' +
            '<span class="focus__cardgo">' + ARROW + "</span>" +
          "</span>" +
        "</button>";
      /* 截图 404（还没截 / 换了域名）就退回占位图，卡片不能开天窗 */
      (function (img, proj) {
        img.onerror = function () { img.onerror = null; img.src = fallbackSrc(proj); };
      })(li.querySelector("img"), p);
      li.querySelector("button").addEventListener("click", function () {
        stopAuto();
        jump(i, i > idx ? 1 : -1);
      });
      el.deck.appendChild(li);
      DECK.push({ li: li, p: p, cat: $(".focus__cardcat", li), blurb: $(".focus__cardblurb", li) });
    });
  }

  function localizeDeck() {
    DECK.forEach(function (d) {
      d.cat.textContent = t("work.filter." + d.p.category);
      d.blurb.textContent = pick(d.p.blurb);
    });
  }

  function markDeck() {
    DECK.forEach(function (d, i) {
      d.li.classList.toggle("is-current", i === idx);
      /* 排在当前项目后面的先出现 —— 和 mockup 一样：看 01 的时候左起是 02 03 04 */
      d.li.style.order = String((i - idx + N) % N);
    });
    if (el.deck.scrollLeft) el.deck.scrollLeft = 0;
  }

  /* =====================================================================
     进度条
     ===================================================================== */
  var TICKS = [];
  function buildTicks() {
    el.ticks.innerHTML = "";
    TICKS = [];
    PROJECTS.forEach(function (p, i) {
      var li = document.createElement("li");
      var b = document.createElement("button");
      b.type = "button";
      b.className = "focus__tick";
      b.textContent = pad(i + 1);
      /* 可访问名称里带上项目名，但保留可见的「03」当前缀 ——
         用语音控制的人念屏幕上看到的数字仍然点得到。 */
      b.setAttribute("aria-label", pad(i + 1) + " " + p.name);
      b.addEventListener("click", function () { stopAuto(); jump(i, i > idx ? 1 : -1); });
      li.appendChild(b);
      el.ticks.appendChild(li);
      TICKS.push(b);
    });
  }
  function markTicks() {
    TICKS.forEach(function (b, i) {
      if (i === idx) b.setAttribute("aria-current", "true");
      else b.removeAttribute("aria-current");
      b.parentNode.classList.toggle("is-current", i === idx);
    });
    /* 左边的大号数字 + 进度条填充：进度条是「第几个 / 一共几个」，不是滚动进度 */
    if (el.now)  el.now.textContent = pad(idx + 1);
    if (el.fill) el.fill.style.width = (((idx + 1) / N) * 100).toFixed(2) + "%";
  }

  /* =====================================================================
     Flip：卡片 ↔ 大图
     ---------------------------------------------------------------------
     飞的是一个 position:fixed 的 clone，真正的卡片和真正的大图都不动。
     教训（Phase 1–2）：让 Flip 直接搬真实节点，网格会当场塌掉。
     卡片和大图的宽高比都是 16/10，所以用 scale:true —— 纯等比放大，
     中途不会重新裁切画面。
     ===================================================================== */
  function makeFly(rect, src) {
    var fly = document.createElement("div");
    fly.className = "focus__fly";
    fly.setAttribute("aria-hidden", "true");
    fly.style.cssText =
      "position:fixed;z-index:460;pointer-events:none;margin:0;" +
      "left:" + rect.left + "px;top:" + rect.top + "px;" +
      "width:" + rect.width + "px;height:" + rect.height + "px;";
    fly.innerHTML = '<div class="focus__screen"><img alt="" src="' + esc(src) + '"></div>';
    document.body.appendChild(fly);
    return fly;
  }

  function cardOf(slug) {
    var card = API.cardEl ? API.cardEl(slug) : null;
    if (!card || card.classList.contains("is-out")) return null;
    var shot = card.querySelector(".proj__shot");
    if (!shot) return null;
    /* 卡片滚出视口也照飞 —— 那才是它真正的位置。
       但宽度为 0 就说明它根本不在布局里（被筛掉 / 父级 display:none），没有目标可飞。 */
    return shot.getBoundingClientRect().width > 4 ? { card: card, shot: shot } : null;
  }

  /* 回哪张卡：先看当前正在读的这一个。 */
  function homeCard() {
    return (idx >= 0 && cardOf(PROJECTS[idx].slug)) || cardOf(originSlug) || null;
  }

  /* 截图揭示：clip-path 从左边拉开 + 轻微回缩。
     桌面第一次打开不用它 —— 那一下的主角是 Flip，两个叠在一起会互相干扰。 */
  function revealShot() {
    root.classList.remove("is-shot");
    void el.img.offsetWidth;          // 强制 reflow，不然连续两次切换动画不会重放
    root.classList.add("is-shot");
  }

  function tilt(on) {
    if (on && rich()) el.device.classList.add("is-tilted");
    else el.device.classList.remove("is-tilted");
  }

  /* =====================================================================
     打开
     ===================================================================== */
  function open(p, cardEl) {
    if (busy) return;
    var i = -1;
    for (var k = 0; k < N; k++) if (PROJECTS[k].slug === p.slug) { i = k; break; }
    if (i < 0) return;

    lastFocus = document.activeElement;
    originSlug = p.slug;
    isOpen = true;
    histPush(p.slug);

    fill(i);
    localizeDeck();

    root.hidden = false;
    document.body.classList.add("is-locked");
    void root.offsetWidth;                       // 让撤掉 hidden 之后的布局先算出来
    root.classList.add("is-open");
    el.panel.scrollTop = 0;

    var src = cardEl && cardEl.querySelector(".proj__shot");
    var srcImg = src && src.querySelector("img");

    /* Flip 只是「更好看的那条路」。它抛错也不能把人卡在这一层里：
       busy 会一直是 true，之后左右切换和关闭全都点不动。
       所以整段包起来，出事就当场退回没有 Flip 的那条路。 */
    var flew = false;
    if (canFlip() && src && src.getBoundingClientRect().width > 4) {
      try {
        busy = true;
        root.classList.add("is-flying");
        var fly = makeFly(src.getBoundingClientRect(), (srcImg && (srcImg.currentSrc || srcImg.src)) || shotSrc(p));
        var st = window.Flip.getState(fly);
        window.Flip.fit(fly, el.screen, { scale: true });
        window.Flip.from(st, {
          duration: 0.72, ease: "expo.inOut", scale: true,
          onComplete: function () {
            fly.parentNode && fly.parentNode.removeChild(fly);
            root.classList.remove("is-flying");
            tilt(true);                            // 先落位再倾斜，顺序不能反
            busy = false;
          }
        });
        flew = true;
        /* 版面不等 Flip 跑完，快到的时候就开始浮现 —— 全等完会显得卡一下 */
        setTimeout(function () { root.classList.add("is-ready"); }, 240);
      } catch (e) {
        if (fly && fly.parentNode) fly.parentNode.removeChild(fly);
        root.classList.remove("is-flying");
        busy = false;
        flew = false;
      }
    }
    if (!flew) {
      root.classList.add("is-ready");
      revealShot();                              // 没有 Flip 时，揭示就是入场
      tilt(true);
    }

    announce();
    focusFirst();
  }

  /* =====================================================================
     关闭 —— 飞回原来那张卡
     ===================================================================== */
  /* 对外的关闭：先退历史（我们进来时压过一条），
     真正的收场统一由 popstate 触发的 requestClose() 走，
     免得「按返回」和「点关闭」两条路各关一次、历史里留下脏条目。 */
  function close() {
    if (!isOpen) return;
    if (histOwned) { histOwned = false; try { history.back(); return; } catch (e) {} }
    closeNow();
  }

  /* 历史已经退掉了，这一层就必须关。转场没跑完（busy）时等它，
     不能像以前那样直接 return —— 那样会留下一个关不掉的覆盖层。 */
  function requestClose(tries) {
    if (!isOpen) return;
    if (busy) {
      if (tries > 20) return;
      setTimeout(function () { requestClose(tries + 1); }, 120);
      return;
    }
    closeNow();
  }

  window.addEventListener("popstate", function () {
    if (!isOpen) return;
    if (isCaseState(history.state)) return;   // 还在案例这一层
    histOwned = false;
    requestClose(0);
  });

  function closeNow() {
    if (!isOpen || busy) return;
    stopAuto();

    var home = homeCard();
    root.classList.add("is-leaving");

    if (!canFlip() || !home) { finish(); return; }

    busy = true;
    /* 必须先摊平。倾斜状态下 getBoundingClientRect() 给的是旋转后的外接矩形，
       拿它当起点，图片会从一个偏掉的位置飞出去。 */
    tilt(false);
    setTimeout(function () {
      var fly = null;
      try {
        var from = el.screen.getBoundingClientRect();
        root.classList.add("is-flying");
        fly = makeFly(from, el.img.currentSrc || el.img.src);
        var st = window.Flip.getState(fly);
        window.Flip.fit(fly, home.shot, { scale: true });
        window.Flip.from(st, {
          duration: 0.6, ease: "expo.inOut", scale: true,
          onComplete: function () {
            fly.parentNode && fly.parentNode.removeChild(fly);
            busy = false;
            finish();
          }
        });
      } catch (e) {
        /* 飞不回去就直接收掉。关不掉的弹层比不好看的关闭严重得多。 */
        if (fly && fly.parentNode) fly.parentNode.removeChild(fly);
        busy = false;
        finish();
      }
    }, 300);
  }

  function finish() {
    root.hidden = true;
    ["is-open", "is-ready", "is-leaving", "is-flying", "is-shot", "is-swapping"].forEach(function (c) {
      root.classList.remove(c);
    });
    tilt(false);
    document.body.classList.remove("is-locked");
    isOpen = false;

    /* 焦点回到原来那张卡，不是回到页面顶部。
       preventScroll：浏览器自带的「滚进视野」在 fixed 滚动容器里会算错位置，
       main.js 的 focusin 处理器会正确地把它滚出来。 */
    var home = homeCard();
    var back = (home && home.card) || (API.cardEl && API.cardEl(originSlug)) || lastFocus;
    if (back && back.focus) { try { back.focus({ preventScroll: true }); } catch (e) { back.focus(); } }
  }

  /* =====================================================================
     项目之间切换（不用 GSAP —— MOTION.md 1.3）
     ===================================================================== */
  function go(dir) {
    if (N < 2) return;
    jump((idx + dir + N) % N, dir);
  }

  function jump(next, dir) {
    if (busy || next === idx || next < 0 || next >= N) return;
    busy = true;

    var plain = !rich();                         // 手机 / 减少动效：只换内容 + 揭示
    root.classList.add("is-swapping");
    if (!plain) el.slide.classList.add(dir > 0 ? "is-out-l" : "is-out-r");

    setTimeout(function () {
      fill(next);

      if (!plain) {
        el.slide.classList.remove("is-out-l", "is-out-r");
        el.slide.classList.add(dir > 0 ? "is-in-r" : "is-in-l");
        void el.slide.offsetWidth;               // 不强制 reflow，浏览器会把两次 class 变更合并成一次，动画直接不跑
        el.slide.classList.remove("is-in-r", "is-in-l");
      }

      root.classList.remove("is-swapping");
      /* 手机回到顶部（新项目的标题和截图才是重点）；
         桌面保持不动 —— 进度条和「其他作品」都在页面下方，
         每点一次就被甩回顶部的话，连着看两个项目都做不到。 */
      if (plain) el.panel.scrollTop = 0;
      revealShot();
      announce();
      histReplace(PROJECTS[idx].slug);         // 换项目不叠历史：一次返回就出去
      busy = false;
    }, plain ? 190 : 360);
  }

  function announce() {
    if (!el.live) return;
    var msg = t("study.now").replace("{n}", String(idx + 1)).replace("{total}", String(N));
    el.live.textContent = msg + " — " + PROJECTS[idx].name;
  }

  /* =====================================================================
     自动播放。默认关闭 —— 没人要求就自己动起来是很讨厌的行为。
     ===================================================================== */
  function startAuto() {
    if (MQ.reduce.matches) return;
    stopAuto();
    autoId = setInterval(function () {
      if (!busy && !hovering && isOpen) go(1);
    }, AUTO_MS);
    el.auto.setAttribute("aria-pressed", "true");
    el.autotext.textContent = t("study.autostop");
  }
  function stopAuto() {
    if (autoId) clearInterval(autoId);
    autoId = 0;
    el.auto.setAttribute("aria-pressed", "false");
    el.autotext.textContent = t("study.autoplay");
  }
  function toggleAuto() { if (autoId) stopAuto(); else startAuto(); }

  /* =====================================================================
     键盘与焦点
     ===================================================================== */
  var FOCUSABLE = 'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])';
  function focusables() {
    return $$(FOCUSABLE, el.panel).filter(function (n) {
      return n.offsetWidth > 0 || n.offsetHeight > 0;      // 手机上被 display:none 的按钮不算
    });
  }
  function focusFirst() {
    /* 焦点先给「关闭」——不是 DOM 里第一个能聚焦的元素。
       DOM 顺序里第一个是正文中间的「打开网站」，一聚焦面板就自己滚下去，
       人一进来看到的是半截内容而不是标题。 */
    var pref = [$(".focus__back", root), $(".focus__x", root)];
    for (var i = 0; i < pref.length; i++) {
      var b = pref[i];
      if (b && (b.offsetWidth > 0 || b.offsetHeight > 0)) { b.focus(); return; }
    }
    var list = focusables();
    if (list.length) list[0].focus();
    else el.panel.focus();
  }
  function trap(e) {
    var list = focusables();
    if (!list.length) return;
    var first = list[0], last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  root.addEventListener("keydown", function (e) {
    if (!isOpen) return;
    if (e.key === "Escape")     { e.preventDefault(); close(); return; }
    if (e.key === "Tab")        { trap(e); return; }
    if (e.key === "ArrowRight") { e.preventDefault(); stopAuto(); go(1); }
    if (e.key === "ArrowLeft")  { e.preventDefault(); stopAuto(); go(-1); }
  });

  /* =====================================================================
     绑定
     ===================================================================== */
  $$("[data-focus-close]", root).forEach(function (b) {
    b.addEventListener("click", close);
  });
  el.prev.addEventListener("click", function () { stopAuto(); go(-1); });
  el.next.addEventListener("click", function () { stopAuto(); go(1); });
  el.auto.addEventListener("click", toggleAuto);

  /* 鼠标在图上时不要自动翻页 —— 人正在看 */
  el.panel.addEventListener("mouseenter", function () { hovering = true; });
  el.panel.addEventListener("mouseleave", function () { hovering = false; });
  el.panel.addEventListener("focusin",    function () { hovering = true; });

  /* 语言切换：main.js 已经把 [data-i18n] 的静态文字换好了，
     这里只补动态内容。study.js 不去碰主页面的任何东西。 */
  document.addEventListener("jh:lang", function () {
    localizeDeck();
    if (idx >= 0) fill(idx);
    el.autotext.textContent = autoId ? t("study.autostop") : t("study.autoplay");
    if (isOpen) announce();
  });

  /* 断点变了（转屏 / 拉窗口）：桌面才倾斜，手机必须摊平 */
  var rt;
  function reassess() {
    clearTimeout(rt);
    rt = setTimeout(function () { if (isOpen) tilt(true); }, 160);
  }
  window.addEventListener("resize", reassess, { passive: true });
  window.addEventListener("orientationchange", reassess, { passive: true });

  /* 印章上的字用你自己的品牌名 */
  if (el.stamp) {
    /* 印章上是「品牌 · EXPERIENCE」。用 monogram 不用 brand ——
       brand 是一整句（"Web Design & Development"），绕一圈会自己首尾叠上。 */
    var mono = ((typeof SITE !== "undefined" && SITE.monogram) || "JH").toUpperCase();
    var unit = "· " + mono + " STUDIO · EXPERIENCE ";
    /* 圆周约 264px，一个字符约 6px —— 太长会自己首尾重叠，按长度决定重复几遍 */
    el.stamp.textContent = unit.length <= 22 ? unit + unit : unit;
  }

  /* =====================================================================
     底部客户条
     ---------------------------------------------------------------------
     和封面那条同一批 logo（data.js 的 CLIENT_LOGOS），但这里不跑马灯 ——
     案例页正在读东西，旁边一直在动的东西会抢注意力。改成左右箭头翻。
     ===================================================================== */
  function buildLogos() {
    if (!el.logos) return;
    var LOGOS = (typeof CLIENT_LOGOS !== "undefined") ? CLIENT_LOGOS : {};
    el.logos.innerHTML = PROJECTS.map(function (p) {
      var name = p.client || p.name;
      var logo = LOGOS[p.slug];
      if (!logo) return '<span class="marquee__item"><b class="marquee__word">' + esc(name) + "</b></span>";
      var style = "--brand:" + logo.color + ";--brand-2:" + (logo.accent || logo.color);
      if (logo.img) {
        return '<span class="marquee__item" style="' + style + '">' +
                 '<img class="marquee__img" src="' + esc(logo.img) + '" alt="" ' +
                 'style="height:' + (logo.h || 22) + 'px" loading="lazy" decoding="async">' +
                 (logo.suffix ? '<b class="marquee__word">' + logo.suffix + "</b>" : "") +
               "</span>";
      }
      /* logo.mark / logo.word / logo.suffix 是我们自己写的字标（要双色所以带 HTML），
         不是用户输入 —— 和 main.js 的 renderMarquee 同一条理由，不过 esc()。 */
      return '<span class="marquee__item" style="' + style + '">' +
               '<svg class="marquee__mark" viewBox="0 0 20 20" aria-hidden="true" focusable="false">' + logo.mark + "</svg>" +
               '<b class="marquee__word">' + (logo.word || esc(name)) + "</b>" +
             "</span>";
    }).join("");
  }
  $$("[data-logo-nav]", root).forEach(function (b) {
    b.addEventListener("click", function () {
      if (!el.logos) return;
      var dir = parseInt(b.getAttribute("data-logo-nav"), 10) || 1;
      el.logos.scrollBy({ left: dir * Math.max(240, el.logos.clientWidth * 0.6), behavior: "smooth" });
    });
  });

  /* 顶栏在案例页是露出来的（设计稿如此）。点导航就是「我要回主页面」，
     所以先把这一层关掉，再让锚点自己跳 —— 不然人会卡在案例页里出不去。 */
  $$("#hud .tabs a, #hud .rail__brand, #hud .rail__cta").forEach(function (a) {
    a.addEventListener("click", function () { if (isOpen) close(); });
  });

  buildDeck();
  buildTicks();
  buildLogos();
  localizeDeck();

  /* 直接带着 #case-xxx 进来（刷新 / 分享链接）：先把地址里的 hash 抹掉再打开。
     open() 自己会压一条历史，于是「返回」是关掉这一层回到作品列表，
     而不是退出网站。 */
  function deepLink() {
    var h = location.hash || "";
    if (h.indexOf(HASH) !== 0) return;
    var slug = h.slice(HASH.length), p = null;
    for (var i = 0; i < N; i++) if (PROJECTS[i].slug === slug) { p = PROJECTS[i]; break; }
    try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {}
    if (!p) return;
    /* 等开场动画和卡片都就位再开 —— 卡片还没渲染出来的话飞入没有起点。 */
    setTimeout(function () { open(p, API.cardEl ? API.cardEl(slug) : null); }, 320);
  }
  if (document.readyState === "complete") deepLink();
  else window.addEventListener("load", deepLink);

  window.JHStudy = {
    open: open,
    close: close,
    isOpen: function () { return isOpen; },
    index: function () { return idx; }
  };
})();
