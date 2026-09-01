/* ============================================================================
   profile.js — 圆形高光「翻照片」的那套交互

   一句话讲清楚原理：
     底层是一张 <img>（不戴头盔），上面盖一张同样裁切的 <canvas>（戴头盔）。
     canvas 每帧先画一堆柔和的圆（主光标 + 移动留下的回声）当遮罩，
     再用 source-in 把第二张照片只留在圆里，最后 source-atop 压一层深墨。
     所以「圆形光标」和「回声」其实是同一个遮罩里的不同形状 —— 边缘自然，
     不需要 DOM 元素，也不会有几十个图层在那儿合成。

   压深墨这一步不是风格选择，是必须的：两张照片都是白底棚拍，
   不压深，需求里要的「文字反白」在圆圈里就是白底白字，什么都看不见。

   要调的东西都在下面 CFG 里，其它地方基本不用碰。
   ============================================================================ */
(function () {
  "use strict";

  var CFG = {
    ease:        0.14,   /* 圆心追指针的速度。越小越「拖」，0.14 大概 6 帧跟上 */
    radius:      132,    /* 基础半径（px）。也在 profile.css 的 --spot-r 里 */
    radiusBoost: 0.18,   /* 移动越快圆越大，最多大这么多 */
    feather:     0.72,   /* 圆的实心比例，往外到 1 淡出 —— 这就是「柔和边缘」 */
    scrim:       0.62,   /* 圆里压多深。太浅白字看不清，太深照片就没了 */

    echoSpeed:   7,      /* 每帧位移超过这个像素才算「快」，才留回声 */
    echoGap:     26,     /* 走够这么多像素放一枚回声，不然会糊成一条 */
    echoLife:    420,    /* 回声寿命（ms）。需求要「迅速消散」，别超过 500 */
    echoAlpha:   0.5,    /* 回声最亮的时候有多亮（相对主光标） */
    echoMax:     14,

    parallax:    1.0,    /* 视差总强度，0 就是关掉。具体位移在 CSS 里分层写 */
    litPad:      18      /* 反白判定给的余量，抵消元素自己的视差位移 */
  };

  var root   = document.documentElement;
  var canvas = document.querySelector(".stage__reveal");
  var base   = document.querySelector(".stage__base");
  var src    = document.querySelector(".stage__src");
  if (!canvas || !src) return;

  var ctx = canvas.getContext("2d", { alpha: true });
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine   = matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---- 状态 ---------------------------------------------------------- */
  var W = 0, H = 0, dpr = 1;
  var focus = { x: 0.5, y: 0.32 };

  var tx = 0, ty = 0;          /* 指针实际位置 */
  var cx = 0, cy = 0;          /* 圆心（追着指针跑，慢半拍） */
  var px = 0, py = 0;          /* 上一帧圆心，用来算速度 */
  var speed = 0;
  var power = 0, powerTo = 0;  /* 圆的显隐 0→1 */
  var travel = 0;              /* 上一枚回声之后走了多远 */
  var echoes = [];
  var lits = [];               /* 需要反白的元素 + 缓存的矩形 */
  var moved = false;

  /* ---- 尺寸 ---------------------------------------------------------- */
  function readFocus() {
    var cs = getComputedStyle(root);
    var fx = parseFloat(cs.getPropertyValue("--focus-x"));
    var fy = parseFloat(cs.getPropertyValue("--focus-y"));
    if (!isNaN(fx)) focus.x = fx / 100;
    if (!isNaN(fy)) focus.y = fy / 100;
    /* --spot-r: auto → 半径跟着屏幕走；写成具体 px 就照写的来。
       （自定义属性没注册过类型，getComputedStyle 拿回来是原样的字符串，
        clamp() 这种在这里算不出数，所以响应式那一档放在 JS 里算。） */
    var raw = String(cs.getPropertyValue("--spot-r")).trim();
    var r = /^[0-9.]+px$/.test(raw) ? parseFloat(raw) : NaN;
    CFG.radius = isNaN(r)
      ? Math.min(Math.max(92, Math.max(W, H) * 0.095), 150)
      : r;
  }

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);   /* 2 以上肉眼看不出，白烧性能 */
    canvas.width  = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width  = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    readFocus();
    measure();
    if (!moved) { tx = cx = W / 2; ty = cy = H / 2; px = cx; py = cy; }
  }

  /* 反白判定用的矩形。视差只有十几像素，缓存起来 + 给点余量就够，
     不用每帧 getBoundingClientRect（那是每帧一次强制重排）。 */
  function measure() {
    lits = [].map.call(document.querySelectorAll("[data-lit]"), function (el) {
      var r = el.getBoundingClientRect();
      return { el: el, x: r.left, y: r.top, w: r.width, h: r.height, on: false };
    });
  }

  /* 照片按 cover 裁切后，在视口里的位置和大小。
     和 CSS 的 object-fit:cover + object-position 是同一套算法 ——
     两层必须严丝合缝，差一点点圆圈里就穿帮。 */
  function coverRect(img) {
    var iw = img.naturalWidth, ih = img.naturalHeight;
    if (!iw || !ih) return null;
    var s = Math.max(W / iw, H / ih);
    var dw = iw * s, dh = ih * s;
    return { x: (W - dw) * focus.x, y: (H - dh) * focus.y, w: dw, h: dh };
  }

  /* ---- 指针 ---------------------------------------------------------- */
  function point(e) {
    tx = e.clientX;
    ty = e.clientY;
    powerTo = 1;
    if (!moved) {
      moved = true;
      root.classList.add("has-moved");
      if (reduce) { cx = tx; cy = ty; }
    }
  }

  if (fine) {
    window.addEventListener("pointermove", function (e) {
      if (e.pointerType === "touch") return;
      point(e);
    }, { passive: true });
    window.addEventListener("pointerdown", point, { passive: true });
    document.addEventListener("pointerleave", function () { powerTo = 0; });
    window.addEventListener("blur", function () { powerTo = 0; });
  } else {
    /* 触屏没有「跟随」这回事：点哪儿、拖到哪儿，光就去哪儿。
       松手不收 —— 手指一抬光就灭，用户会以为自己点坏了。 */
    var down = false;
    window.addEventListener("pointerdown", function (e) { down = true; point(e); }, { passive: true });
    window.addEventListener("pointermove", function (e) { if (down) point(e); }, { passive: true });
    window.addEventListener("pointerup",     function () { down = false; });
    window.addEventListener("pointercancel", function () { down = false; });

    var hint = document.querySelector(".hint");
    if (hint) {
      var dot = hint.querySelector(".dot");
      hint.textContent = "Tap to reveal";
      if (dot) hint.insertBefore(dot, hint.firstChild);
    }
  }

  /* ---- 回声 ---------------------------------------------------------- */
  function spawnEcho(x, y, r) {
    if (reduce) return;
    echoes.push({ x: x, y: y, r: r, t: performance.now() });
    if (echoes.length > CFG.echoMax) echoes.shift();
  }

  /* ---- 遮罩里的一枚软圆 ------------------------------------------------ */
  function softCircle(x, y, r, a) {
    if (r <= 0 || a <= 0) return;
    var g = ctx.createRadialGradient(x, y, Math.max(r * CFG.feather, 0.01), x, y, r);
    g.addColorStop(0, "rgba(0,0,0," + a + ")");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 6.2832);
    ctx.fill();
  }

  /* ---- 主循环 -------------------------------------------------------- */
  function frame(now) {
    /* 1. 圆心插值 —— 需求里的「平滑跟随，略有延迟」就是这一行 */
    var k = reduce ? 1 : CFG.ease;
    cx += (tx - cx) * k;
    cy += (ty - cy) * k;
    power += (powerTo - power) * (reduce ? 1 : 0.12);

    var dx = cx - px, dy = cy - py;
    speed = Math.sqrt(dx * dx + dy * dy);
    px = cx; py = cy;

    /* 2. 速度越快圆越大一点，手感更「跟手」 */
    var R = CFG.radius * (1 + Math.min(speed / 60, 1) * CFG.radiusBoost) * power;

    /* 3. 快速移动才留回声，而且按走过的距离放，不按帧数放 */
    if (speed > CFG.echoSpeed && power > 0.4) {
      travel += speed;
      if (travel >= CFG.echoGap) { travel = 0; spawnEcho(cx, cy, R * 0.9); }
    } else {
      travel = 0;
    }

    /* 4. 画 */
    ctx.clearRect(0, 0, W, H);
    var img = src.complete && src.naturalWidth ? src : null;
    var alive = 0;

    if (img && (R > 0.5 || echoes.length)) {
      /* 4a. 遮罩：先回声（在后面），再主光标 */
      for (var i = 0; i < echoes.length; i++) {
        var e = echoes[i];
        var t = (now - e.t) / CFG.echoLife;
        if (t >= 1) continue;
        alive++;
        var fade = 1 - t;
        fade = fade * fade * fade;                    /* easeOutCubic，收得干脆 */
        softCircle(e.x, e.y, e.r * (0.92 + t * 0.22), CFG.echoAlpha * fade * power);
        echoes[alive - 1] = e;
      }
      echoes.length = alive;
      softCircle(cx, cy, R, 1);

      /* 4b. 只在遮罩里留下第二张照片 */
      var rect = coverRect(img);
      if (rect) {
        ctx.globalCompositeOperation = "source-in";
        ctx.drawImage(img, rect.x, rect.y, rect.w, rect.h);

        /* 4c. 压一层深墨，白字才有得站 */
        ctx.globalCompositeOperation = "source-atop";
        ctx.fillStyle = "rgba(9,10,12," + CFG.scrim + ")";
        ctx.fillRect(0, 0, W, H);
        ctx.globalCompositeOperation = "source-over";
      }
    } else {
      echoes.length = 0;
    }

    /* 5. 把状态交给 CSS：网格遮罩、视差、进出场，全靠这几个变量 */
    var nx = W ? (cx / W - 0.5) * 2 : 0;
    var ny = H ? (cy / H - 0.5) * 2 : 0;
    root.style.setProperty("--sx", cx.toFixed(1) + "px");
    root.style.setProperty("--sy", cy.toFixed(1) + "px");
    root.style.setProperty("--sr", R.toFixed(1) + "px");
    root.style.setProperty("--spot", power.toFixed(3));
    if (!reduce) {
      root.style.setProperty("--px", (nx * CFG.parallax).toFixed(3));
      root.style.setProperty("--py", (ny * CFG.parallax).toFixed(3));
    }

    /* 6. 圆压到谁，谁就变白（300ms 的过渡在 CSS 里） */
    var hit = R * 0.98 + CFG.litPad;
    for (var j = 0; j < lits.length; j++) {
      var L = lits[j];
      var qx = Math.max(L.x, Math.min(cx, L.x + L.w));
      var qy = Math.max(L.y, Math.min(cy, L.y + L.h));
      var on = power > 0.05 &&
               (cx - qx) * (cx - qx) + (cy - qy) * (cy - qy) < hit * hit;
      if (on !== L.on) {
        L.on = on;
        L.el.classList.toggle("is-lit", on);
      }
    }

    requestAnimationFrame(frame);
  }

  /* ---- 启动 ---------------------------------------------------------- */
  var rt;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(resize, 120);
  });
  window.addEventListener("orientationchange", function () { setTimeout(resize, 260); });

  /* 字体是 swap 的，加载完字号会变，反白判定的矩形得重新量一次 */
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  [base, src].forEach(function (im) {
    if (im) im.addEventListener("load", function () { readFocus(); }, { once: false });
  });

  resize();
  requestAnimationFrame(frame);

  /* 桌面端进场：不动鼠标也先让圆亮起来，用户才知道这里有东西可玩 */
  if (fine) setTimeout(function () { if (!moved) powerTo = 1; }, 600);

  /* ---- F1 Records 面板 ------------------------------------------------ */
  var panel = document.getElementById("records");
  var open  = document.querySelector(".nav-link");
  var close = document.querySelector(".records__close");
  if (panel && open) {
    var last = null;
    var behind = document.querySelectorAll(".ui a");
    /* 面板盖住整屏之后，后面那几个链接不能还能 Tab 到 —— 焦点跑到看不见的
       东西上，键盘用户会直接迷路。没做完整的 focus trap，这一步够用。 */
    var behindTabbable = function (on) {
      for (var i = 0; i < behind.length; i++) {
        if (on) behind[i].removeAttribute("tabindex");
        else    behind[i].setAttribute("tabindex", "-1");
      }
    };
    var show = function (e) {
      if (e) e.preventDefault();
      last = document.activeElement;
      panel.classList.add("is-open");
      panel.removeAttribute("aria-hidden");
      open.setAttribute("aria-expanded", "true");
      behindTabbable(false);
      if (close) close.focus();
    };
    var hide = function () {
      panel.classList.remove("is-open");
      panel.setAttribute("aria-hidden", "true");
      open.setAttribute("aria-expanded", "false");
      behindTabbable(true);
      if (last && last.focus) last.focus();
    };
    open.addEventListener("click", show);
    if (close) close.addEventListener("click", hide);
    panel.addEventListener("click", function (e) { if (e.target === panel) hide(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && panel.classList.contains("is-open")) hide();
    });
  }
})();
