/* ============================================================================
   main.js — 页面逻辑 + 动画引擎
   ----------------------------------------------------------------------------
   动画全部手写，没有引入 GSAP / Lenis 之类的库（省 70KB，网站更快）。
   包含：惯性平滑滚动、滚动速度倾斜、视差、字符逐个入场、磁吸按钮、
        自定义光标、卡片 3D 倾斜、数字滚动、进度条。
   一般不需要改这个文件。
   ============================================================================ */
(function () {
  "use strict";

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var lerp  = function (a, b, t) { return a + (b - a) * t; };

  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var coarse  = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  var SMOOTH  = !reduced && !coarse && window.innerWidth > 960;

  var LANGS = ["zh", "en", "ms"];
  var HTML_LANG = { zh: "zh-CN", en: "en", ms: "ms" };
  var CATS = ["all", "corporate", "industrial", "ecommerce", "education", "lifestyle", "system"];

  var state = { lang: "zh", filter: "all" };

  var scroller = $("#scroller");
  var skewEl   = $("#skew");
  var hud      = $("#hud");

  /* ======================================================================
     1. 语言
     ====================================================================== */
  function detectLang() {
    var saved = null;
    try { saved = localStorage.getItem("jh-lang"); } catch (e) {}
    if (saved && LANGS.indexOf(saved) > -1) return saved;
    var n = (navigator.language || "en").toLowerCase();
    if (n.indexOf("zh") === 0) return "zh";
    if (n.indexOf("ms") === 0 || n.indexOf("id") === 0) return "ms";
    return "en";
  }
  function t(key) {
    var d = I18N[state.lang] || I18N.en;
    return d[key] != null ? d[key] : (I18N.en[key] || "");
  }
  function pick(obj) { return obj ? (obj[state.lang] || obj.en || obj.zh) : ""; }

  /* ======================================================================
     2. WhatsApp / 邮箱
     ====================================================================== */
  var warned = false;
  function waLink() {
    var num = (SITE.whatsapp || "").replace(/[^0-9]/g, "");
    if (!num) return "#contact";
    if (num === "60123456789" && !warned) {
      warned = true;
      console.warn("[提醒] assets/js/data.js 里的 WhatsApp 号码还是示例号码，记得改成你自己的。");
    }
    var msg = (SITE.waMessage && SITE.waMessage[state.lang]) || "";
    return "https://wa.me/" + num + (msg ? "?text=" + encodeURIComponent(msg) : "");
  }
  function refreshWa() {
    $$("[data-wa]").forEach(function (a) {
      var href = waLink();
      a.href = href;
      if (href.charAt(0) === "#") { a.removeAttribute("target"); a.removeAttribute("rel"); }
      else { a.target = "_blank"; a.rel = "noopener noreferrer"; }
    });
    var em = $("#email-btn");
    if (em) em.href = "mailto:" + (SITE.email || "");
  }

  /* ======================================================================
     3. 图片路径（截图优先，没有就用占位图）
     ====================================================================== */
  /* 有真实截图就用截图，没有就直接给占位图 —— 不要先去请求一个不存在的文件。
     SHOTS 由 tools/sync-static.mjs 在构建时生成（npm run sync）。 */
  var HAS_SHOT = (typeof SHOTS !== "undefined" && SHOTS) || [];
  function shotSrc(p) {
    return HAS_SHOT.indexOf(p.slug) > -1
      ? "assets/screenshots/" + p.slug + ".jpg"
      : "assets/img/placeholder/" + p.slug + ".svg";
  }
  function fallbackSrc(p) { return "assets/img/placeholder/" + p.slug + ".svg"; }

  // 还没放照片时的占位剪影。用纸色系，不要跟版面打架。
  var PERSON_FALLBACK =
    "data:image/svg+xml;base64," + btoa(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">' +
      '<rect width="400" height="500" fill="#E5E1D7"/>' +
      '<circle cx="200" cy="196" r="74" fill="#D3CDC0"/>' +
      '<path d="M62 500c0-86 62-150 138-150s138 64 138 150z" fill="#D3CDC0"/>' +
      '<text x="200" y="474" text-anchor="middle" font-family="Helvetica,Arial" font-size="16" fill="#8A8478" letter-spacing="2">ADD assets/img/me.jpg</text>' +
      "</svg>");

  function setPhoto(el) {
    if (!el) return;
    /* 照片文件在不在，构建时就知道了（tools/sync-static.mjs 写进 shots.js）。
       不要先请求一个不存在的文件再回退 —— 那是一个白费的 404。 */
    var ready = (typeof HAS_PHOTO !== "undefined") ? HAS_PHOTO : true;
    el.addEventListener("error", function h() { el.removeEventListener("error", h); el.src = PERSON_FALLBACK; });
    el.src = (ready && PROFILE.photo) ? PROFILE.photo : PERSON_FALLBACK;
    el.alt = PROFILE.name || "";
  }

  /* ======================================================================
     4. 文字拆字（每个字符单独入场）
     ====================================================================== */
  function splitText(el) {
    if (el.dataset.splitDone) return;
    var host = el.querySelector("span[data-i18n]") || el;
    var text = host.textContent.trim();
    /* 拆字规则：
         · 拉丁字母 / 数字 → 按「词」分组，词内不换行（避免 PORTFOLI / O）
         · 中日韩文字和全角标点 → 每个字单独成组，本来就该逐字换行
       两者混在一起时不能一视同仁 —— 中文没有空格，
       整句当成一个词会导致永远不换行，窄屏直接撑爆版面。 */
    var CJK = /[\u2E80-\u303F\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\uFF00-\uFFEF]/;
    var out = "", n = 0, buf = "";

    function ch(c) { return '<span class="ch"><i style="transition-delay:' + (n++ * 24) + 'ms">' + esc(c) + "</i></span>"; }
    function flush() {
      if (!buf) return;
      out += '<span class="wd">';
      for (var k = 0; k < buf.length; k++) out += ch(buf[k]);
      out += "</span>";
      buf = "";
    }

    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (/\s/.test(c)) { flush(); out += '<span class="ch ch--sp"></span>'; }
      else if (CJK.test(c)) { flush(); out += '<span class="wd">' + ch(c) + "</span>"; }
      else { buf += c; }
    }
    flush();
    host.innerHTML = out;
    el.classList.add("split");
    el.dataset.splitDone = "1";
  }
  function resplit() {
    $$("[data-split]").forEach(function (el) {
      var host = el.querySelector("span[data-i18n]") || el;
      delete el.dataset.splitDone;
      el.classList.remove("split", "is-in");
      if (host !== el && host.dataset.i18n) host.textContent = t(host.dataset.i18n);
      splitText(el);
    });
  }

  /* ======================================================================
     5. 滚动引擎：惯性滚动 + 视差 + 入场 + 速度倾斜
     ====================================================================== */
  var engine = (function () {
    var current = 0, target = 0, velocity = 0, navTick = 0;
    var reveals = [], parallax = [];
    var marquee = null, marqueeX = 0, marqueeW = 0;

    function collect() {
      reveals = $$("[data-reveal], [data-split], .bars li, .stats li").filter(function (el) {
        return !el.classList.contains("is-in");
      });
      parallax = $$("[data-parallax]");
      marquee = $("#marquee");
      if (marquee) marqueeW = marquee.scrollWidth / 2;
    }

    function setHeight() {
      if (!SMOOTH) { document.body.style.height = ""; return; }
      document.body.style.height = scroller.offsetHeight + "px";
    }

    function frame() {
      target = window.scrollY || window.pageYOffset || 0;

      if (SMOOTH) {
        current = lerp(current, target, 0.095);
        if (Math.abs(target - current) < 0.06) current = target;
        velocity = target - current;
        scroller.style.transform = "translate3d(0," + (-current).toFixed(2) + "px,0)";
        if (skewEl) skewEl.style.transform = "skewY(" + clamp(velocity * 0.016, -2, 2).toFixed(3) + "deg)";
      } else {
        current = target;
        velocity = 0;
      }

      var vh = window.innerHeight;

      /* 入场 */
      for (var i = reveals.length - 1; i >= 0; i--) {
        var el = reveals[i];
        var r = el.getBoundingClientRect();
        if (r.top < vh * 0.9) {          // 已经滚过去的也要显示，不能漏
          el.classList.add("is-in");
          reveals.splice(i, 1);
          if (el.matches(".stats li")) countUp(el.querySelector("b[data-count]"));
        }
      }

      /* 视差 */
      parallax.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        var mid = r.top + r.height / 2 - vh / 2;
        el.style.transform = "translate3d(0," + (-mid * parseFloat(el.dataset.parallax)).toFixed(2) + "px,0)";
      });

      /* 跑马灯：基础速度 + 滚动速度加成 */
      if (marquee && marqueeW) {
        marqueeX -= 0.5 + Math.abs(velocity) * 0.05;
        if (marqueeX <= -marqueeW) marqueeX += marqueeW;
        marquee.style.transform = "translate3d(" + marqueeX.toFixed(2) + "px,0,0)";
      }

      if ((++navTick & 3) === 0 && window.__syncNav) window.__syncNav();

      requestAnimationFrame(frame);
    }

    window.addEventListener("resize", function () { setHeight(); collect(); }, { passive: true });

    return {
      start: function () { collect(); setHeight(); requestAnimationFrame(frame); },
      refresh: function () { collect(); setHeight(); },
      pos: function () { return current; }
    };
  })();

  /* 站内锚点：scroller 是 fixed 的，必须自己算位置 */
  function goTo(hash) {
    var el = $(hash);
    if (!el) return;
    var y = engine.pos() + el.getBoundingClientRect().top - 74;
    y = Math.max(0, y);
    if (SMOOTH) window.scrollTo(0, y);
    else window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
  }
  /* 键盘无障碍：scroller 是 fixed 的，浏览器没办法把「Tab 到的屏幕外元素」
     自动滚进视野（它找不到可滚动的祖先）。这里手动补上，
     否则用键盘浏览的人会 Tab 到看不见的地方。 */

  /* 只有「住在滚动容器里、而且中间没有 fixed 祖先」的元素才需要我们代劳。
     ⚠️ 这个判断是必须的，不是保险起见：
     顶栏是 fixed，点一下导航栏的「作品」会先 focus 那个链接，
     链接的 rect.top 永远是三十几像素，于是这里算出「它在屏幕外」，
     反手把整页滚回文档顶部 —— goTo() 刚滚过去的位置当场被覆盖掉，
     用户点「作品」结果停在封面，一动没动。
     .scroller 本身就是 fixed，所以不能简单地「有 fixed 祖先就跳过」，
     必须是「在走到 .scroller 之前遇到 fixed」才跳过。 */
  function needsFocusScroll(el) {
    var n = el;
    while (n && n !== document.body) {
      if (n === scroller) return true;
      if (getComputedStyle(n).position === "fixed") return false;
      n = n.parentElement;
    }
    return false;                       // 顶栏 / 悬浮按钮 / 作品详情页，都不在滚动容器里
  }

  document.addEventListener("focusin", function (e) {
    /* 不是自定义滚动的时候（手机 / 减少动效）浏览器自己会处理，
       我们再插一脚只会变成滚两次。 */
    if (!SMOOTH) return;
    var el = e.target;
    if (!el || !el.getBoundingClientRect || !needsFocusScroll(el)) return;
    // 必须等一帧：浏览器自己那套「把焦点元素滚进视野」会在我们之后执行，
    // 而它算不对 fixed 容器里的位置，会把我们的滚动覆盖掉。
    requestAnimationFrame(function () {
      var r = el.getBoundingClientRect(), vh = window.innerHeight;
      // 要按「滚动停下之后」的位置判断，不能按当下画面判断 ——
      // 惯性滚动途中元素会从视野里穿过去，按当下判断会误以为它已经可见。
      var docY = engine.pos() + r.top;                    // 元素在文档里的绝对位置
      var rel  = docY - (window.scrollY || 0);            // 滚动停稳后它会落在哪
      if (rel >= 90 && rel + r.height <= vh - 40) return; // 到时候看得见，不用动
      window.scrollTo(0, Math.max(0, docY - vh / 2 + r.height / 2));
    });
  });

  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var hash = a.getAttribute("href");
    if (hash === "#" || hash.length < 2) return;
    if (!$(hash)) return;
    e.preventDefault();
    goTo(hash);
    closeNav();
  });

  /* ======================================================================
     6. 数字滚动
     ====================================================================== */
  function countUp(el) {
    if (!el || el.dataset.done) return;
    el.dataset.done = "1";
    var to = parseInt(el.getAttribute("data-count"), 10) || 0;
    var sfx = el.getAttribute("data-suffix") || "";
    if (reduced) { el.textContent = to + sfx; return; }
    var t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / 1300, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 4))) + sfx;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ======================================================================
     7. 自定义光标 + 磁吸
     ====================================================================== */
  if (!coarse && !reduced) {
    var cur = $("#cursor"), dot = $(".cursor__dot"), ring = $(".cursor__ring");
    var mx = -100, my = -100, rx = -100, ry = -100;
    window.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = "translate(" + mx + "px," + my + "px)";
    }, { passive: true });
    (function loop() {
      rx = lerp(rx, mx, 0.16); ry = lerp(ry, my, 0.16);
      ring.style.transform = "translate(" + rx.toFixed(1) + "px," + ry.toFixed(1) + "px)";
      requestAnimationFrame(loop);
    })();
    document.addEventListener("mouseover", function (e) {
      cur.classList.toggle("is-hot", !!e.target.closest("a,button,.proj,[data-magnetic]"));
    });
  }

  function bindMagnetic(el) {
    if (coarse || reduced || el.dataset.mag) return;
    el.dataset.mag = "1";
    el.style.transition = "transform .4s cubic-bezier(.16,1,.3,1)";
    el.addEventListener("mousemove", function (e) {
      var r = el.getBoundingClientRect();
      el.style.transform =
        "translate(" + ((e.clientX - r.left - r.width / 2) * 0.25).toFixed(1) + "px," +
                      ((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1) + "px)";
    });
    el.addEventListener("mouseleave", function () { el.style.transform = ""; });
  }
  function bindTilt(el) {
    if (coarse || reduced) return;
    el.addEventListener("mousemove", function (e) {
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = "perspective(900px) rotateY(" + (px * 6).toFixed(2) + "deg) rotateX(" + (-py * 6).toFixed(2) + "deg) translateY(-6px)";
    });
    el.addEventListener("mouseleave", function () { el.style.transform = ""; });
  }

  /* ======================================================================
     8. 渲染
     ====================================================================== */
  function renderFilters() {
    var box = $("#filters"); if (!box) return;
    box.innerHTML = "";
    CATS.forEach(function (c) {
      if (c !== "all" && !PROJECTS.some(function (p) { return p.category === c; })) return;
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = t("work.filter." + c);
      var on = state.filter === c;
      b.className = on ? "is-active" : "";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.addEventListener("click", function () {
        state.filter = c;
        $$("button", box).forEach(function (o) {
          var a = o === b;
          o.classList.toggle("is-active", a);
          o.setAttribute("aria-pressed", a ? "true" : "false");
        });
        if (window.JHStage && window.JHStage.filter) window.JHStage.filter(applyFilter);
        else applyFilter();
      });
      box.appendChild(b);
    });
  }

  /* 作品卡片只建一次。筛选和语言切换都是「原地更新」，绝不重建 DOM ——
     Flip 必须拿到同一批元素，节点一换就没得动画了。 */
  var CARDS = [];                       // { el, p, refs } —— 建好后就不再变

  function buildProjects() {
    var grid = $("#work-grid");
    if (!grid || CARDS.length) return;
    grid.innerHTML = "";

    PROJECTS.forEach(function (p, i) {
      var el = document.createElement("article");
      el.className = "proj";
      el.dataset.slug = p.slug;
      el.dataset.cat = p.category;
      /* ⚠️ 不能叫 data-reveal —— 站点的滚动入场系统已经占用了 [data-reveal]
         这个选择器（.js [data-reveal]{opacity:0}）。用它会让 10 张作品卡
         全部变成「等待入场」状态，在拿到 .is-in 之前一直透明，
         Flip 跑的就是 10 个看不见的元素。改成带命名空间的属性名。 */
      el.dataset.revealKind = p.reveal || "";
      el.style.setProperty("--i", i);
      el.tabIndex = 0;
      el.setAttribute("role", "button");
      /* 用 aria-labelledby 指向可见的项目名，而不是写一个 aria-label。
         写死 aria-label 会和卡片上的可见文字不一致，
         用语音控制的人念屏幕上看到的名字反而点不到。 */
      el.setAttribute("aria-labelledby", "pn-" + p.slug);
      el.innerHTML =
        '<div class="proj__shot">' +
          '<span class="proj__badge"></span>' +
          '<span class="proj__year">' + esc(p.year || "") + "</span>" +
          '<img loading="lazy" alt="' + esc(p.name) + '" src="' + esc(shotSrc(p)) + '">' +
        "</div>" +
        '<div class="proj__body">' +
          '<h3 class="proj__title"><span class="proj__name" id="pn-' + esc(p.slug) + '">' + esc(p.name) + "</span>" +
            '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          "</h3>" +
          '<p class="proj__flags"></p>' +
          '<p class="proj__blurb"></p>' +
          '<ul class="chips"></ul>' +
          '<span class="proj__link"><span class="proj__linktext"></span>' +
            '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          "</span>" +
        "</div>";

      var img = $("img", el);
      img.addEventListener("error", function h() { img.removeEventListener("error", h); img.src = fallbackSrc(p); });

      el.addEventListener("click", function () { openStudy(p, el); });
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openStudy(p, el); }
      });

      CARDS.push({
        el: el, p: p,
        flags: $(".proj__flags", el),
        badge: $(".proj__badge", el),
        blurb: $(".proj__blurb", el),
        chips: $(".chips", el),
        link:  $(".proj__linktext", el)
      });
      grid.appendChild(el);
    });

    document.dispatchEvent(new CustomEvent("jh:cards-ready", { detail: { cards: CARDS } }));
  }

  /* 语言切换：只改文字，不动节点 */
  function localizeProjects() {
    CARDS.forEach(function (c) {
      c.badge.textContent = t("work.filter." + c.p.category);
      /* 自有品牌 / 已下线 的标记。两个都可能同时出现。 */
      var flags = [];
      if (c.p.mine) flags.push('<span class="proj__flag proj__flag--mine">' + esc(t("work.mine")) + "</span>");
      if (c.p.live === false) flags.push('<span class="proj__flag">' + esc(t("work.offline")) + "</span>");
      else if (!c.p.url) flags.push('<span class="proj__flag">' + esc(t("work.private")) + "</span>");
      c.flags.innerHTML = flags.join("");
      c.blurb.textContent = pick(c.p.blurb) || "";
      c.link.textContent  = t("work.detail");
      c.chips.innerHTML   = (pick(c.p.tags) || []).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
    });
    var empty = $("#work-empty");
    if (empty) empty.textContent = t("work.empty");
  }

  /* 筛选：只切 class。真正的重排动画由 stage.js 用 Flip 接管；
     stage.js 不在（手机 / 减少动效 / JS 失败）时，CSS 过渡兜底。 */
  function applyFilter() {
    var shown = 0;
    CARDS.forEach(function (c) {
      var on = state.filter === "all" || c.p.category === state.filter;
      c.el.classList.toggle("is-out", !on);
      c.el.setAttribute("aria-hidden", on ? "false" : "true");
      if (!on) c.el.setAttribute("tabindex", "-1"); else c.el.setAttribute("tabindex", "0");
      if (on) shown++;
    });
    var empty = $("#work-empty");
    if (empty) empty.hidden = shown > 0;
  }

  function renderProjects() { buildProjects(); localizeProjects(); applyFilter(); }

  function renderServices() {
    var box = $("#cards"); if (!box) return;
    box.innerHTML = "";
    for (var i = 1; i <= 6; i++) {
      var li = document.createElement("article");
      li.className = "card";
      li.setAttribute("data-reveal", "");
      li.innerHTML =
        '<span class="card__n">' + (i < 10 ? "0" + i : i) + "</span>" +
        "<h3>" + esc(t("services." + i + ".t")) + "</h3>" +
        "<p>" + esc(t("services." + i + ".d")) + "</p>";
      box.appendChild(li);
    }
  }

  function renderProfile() {
    var apps = $("#apps");
    if (apps) {
      apps.innerHTML = (PROFILE.software || []).map(function (s) {
        // 颜色用自定义属性传给 CSS，由样式决定要不要用 —— 纸质版刻意保持无彩
        return '<li data-label="' + esc(s.label) + '" style="--app-color:' + esc(s.color) + '" title="' + esc(s.label) + '">' + esc(s.code) + "</li>";
      }).join("");
    }
    var edu = $("#education");
    if (edu) {
      edu.innerHTML = (pick(PROFILE.education) || []).map(function (e) {
        return "<li><em>" + esc(e.years) + "</em><b>" + esc(e.school) + "</b>" + esc(e.major) + "</li>";
      }).join("");
    }
    var exp = $("#experience");
    if (exp) {
      exp.innerHTML = (pick(PROFILE.experience) || []).map(function (x) { return "<li><b>" + esc(x) + "</b></li>"; }).join("");
    }
    var langs = $("#languages");
    if (langs) {
      langs.innerHTML = (PROFILE.languages || []).map(function (l) {
        return "<li><span>" + esc(pick(l.name)) + "</span><b>" + esc(l.level) + "%</b><i style=\"--w:" + esc(l.level) + '%"></i></li>';
      }).join("");
    }
    var nm = $("#profile-name");
    if (nm) nm.textContent = PROFILE.name || SITE.brand || "";
    var cn = $("#contact-name");
    if (cn) cn.textContent = PROFILE.name || SITE.brand || "";
  }

  var ICONS = {
    wa: '<path d="M12.04 2A10 10 0 0 0 3.5 17.2L2 22l4.94-1.44A10 10 0 1 0 12.04 2Zm0 1.9a8.1 8.1 0 1 1-4.13 15.06l-.3-.18-2.93.86.87-2.85-.19-.3A8.1 8.1 0 0 1 12.04 3.9Z"/>',
    mail: '<path d="M3 5h18v14H3zM3 6l9 7 9-7" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    ig: '<rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.2" cy="6.8" r="1.2"/>',
    xhs: '<path d="M4 8v8M8 8v8M8 12H4M12 8v8h4M20 8v8M17 8h6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'
  };
  function renderLinks() {
    var box = $("#links"); if (!box) return;
    function row(icon, label, href, wa) {
      /* 必须包在 <li> 里 —— <ul> 的直接子元素只能是 <li>，
         直接塞 <a> 会破坏列表语义（Lighthouse 的 list 审计判 0）。 */
      return "<li><a href=\"" + esc(href) + "\"" + (wa ? " data-wa" : ' target="_blank" rel="noopener"') + ">" +
             '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">' + ICONS[icon] + "</svg>" + esc(label) + "</a></li>";
    }
    var out = row("wa", "WhatsApp", "#", true);
    if (SITE.email) out += row("mail", SITE.email, "mailto:" + SITE.email);
    if (SITE.instagram) out += row("ig", "Instagram", SITE.instagram);
    if (SITE.xiaohongshu) out += row("xhs", t("contact.xhs"), SITE.xiaohongshu);
    box.innerHTML = out;
  }

  function renderMarquee() {
    var box = $("#marquee"); if (!box) return;
    var names = PROJECTS.map(function (p) { return "<span>" + esc(p.name) + "</span>"; }).join("");
    box.innerHTML = names + names;
  }

  /* ======================================================================
     9. 作品详情 —— 转接给 study.js
     ====================================================================== */
  /* 详情页本体在 study.js 里。这里只负责「点了卡片之后交给谁」，
     并且在 study.js 因为任何原因没加载时留一条退路：直接开客户的网站。
     看作品是这个网站存在的理由，不能因为一个动效文件挂了就点不动。 */
  function openStudy(p, cardEl) {
    if (window.JHStudy && window.JHStudy.open) return window.JHStudy.open(p, cardEl);
    window.open(p.url, "_blank", "noopener");
  }

  /* ======================================================================
     10. HUD：滑动指示条 + 当前区块
     ====================================================================== */
  var tabs = $("#tabs"), glide = $("#tabs-glide"), burger = $("#burger");
  function moveGlide(a) {
    if (!glide || !a || window.innerWidth <= 960) { if (glide) glide.style.opacity = "0"; return; }
    glide.style.opacity = "1";
    glide.style.width = a.offsetWidth + "px";
    glide.style.transform = "translateX(" + a.offsetLeft + "px)";
  }
  function closeNav() {
    if (!tabs || !burger) return;
    tabs.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  }
  if (burger && tabs) {
    burger.addEventListener("click", function () {
      var open = tabs.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* 当前区块高亮。必须跑在动画循环里，不能挂 scroll 事件 ——
     惯性滚动停手后画面还在走，那时早就没有 scroll 事件了，高亮会卡住。 */
  var lastSection = "";
  function syncNav() {
    if (hud) hud.classList.toggle("is-stuck", (window.scrollY || 0) > 20);
    if (!tabs) return;
    var mid = window.innerHeight * 0.42, best = "";
    $$("section[id]").forEach(function (s) {
      var r = s.getBoundingClientRect();
      if (r.top <= mid && r.bottom >= mid) best = s.id;
    });
    if (!best || best === lastSection) return;
    // 有些区块（比如「流程」）没有对应标签 —— 那就保持上一个高亮，不要整排熄掉
    var active = null;
    $$("a", tabs).forEach(function (a) {
      if (a.getAttribute("href") === "#" + best) active = a;
    });
    if (!active) return;
    lastSection = best;
    $$("a", tabs).forEach(function (a) { a.classList.toggle("is-active", a === active); });
    moveGlide(active);
  }
  window.__syncNav = syncNav;

  /* ======================================================================
     11. 应用语言
     ====================================================================== */
  function applyLang(lang) {
    state.lang = lang;
    try { localStorage.setItem("jh-lang", lang); } catch (e) {}
    document.documentElement.lang = HTML_LANG[lang] || "en";
    document.documentElement.setAttribute("data-lang", lang);

    $$("[data-i18n]").forEach(function (el) {
      if (el.closest("[data-split]")) return;      // 拆字元素稍后统一处理
      var v = t(el.getAttribute("data-i18n"));
      if (v) el.textContent = v;
    });
    $$("[data-lang-btn]").forEach(function (b) {
      var on = b.getAttribute("data-lang-btn") === lang;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });

    renderFilters();
    renderProjects();
    renderServices();
    renderProfile();
    renderLinks();
    refreshWa();
    resplit();
    $$("[data-magnetic]").forEach(bindMagnetic);
    engine.refresh();
    /* Focus Mode 是独立文件，自己听这个事件重写文字。
       不在这里直接调 —— main.js 不该知道 study.js 内部长什么样。 */
    document.dispatchEvent(new CustomEvent("jh:lang", { detail: { lang: lang } }));
  }
  $$("[data-lang-btn]").forEach(function (b) {
    b.addEventListener("click", function () { applyLang(b.getAttribute("data-lang-btn")); });
  });

  /* ======================================================================
     12. 开机动画
     ====================================================================== */
  /* 开场序列（MOTION.md 2.2）：JH / N SELECTED WORKS / 年份
     → 细线从左跑满 → 整块 clip-path 向上收掉。总时长约 1.8–2.3s。 */
  function boot() {
    var box = $("#boot"), fill = $("#boot-fill"), cnt = $("#boot-count");
    if (cnt) cnt.textContent = PROJECTS.length;
    if (!box) return start();

    document.body.classList.add("boot-on");
    if (reduced) { box.classList.add("is-done"); document.body.classList.remove("boot-on"); return start(); }

    var DUR = 1250, t0 = null;
    requestAnimationFrame(function run(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / DUR, 1);
      if (fill) fill.style.width = (p * 100).toFixed(1) + "%";
      if (p < 1) return requestAnimationFrame(run);
      setTimeout(function () {
        box.classList.add("is-done");
        document.body.classList.remove("boot-on");
        start();
      }, 260);
    });
  }

  function start() {
    engine.start();

    /* 带锚点直接进来（例如别人分享 /#work）：自定义滚动容器是 fixed 的，
       浏览器自己那套锚点定位不生效，得手动滚过去。 */
    if (location.hash && location.hash.length > 1) {
      var target = document.getElementById(location.hash.slice(1));
      if (target) requestAnimationFrame(function () { goTo(location.hash); });
    }
    // 首屏元素依次入场
    setTimeout(function () {
      $$("#home [data-split], #home [data-reveal]").forEach(function (el) { el.classList.add("is-in"); });
      var cover = $(".cover");
      if (cover) cover.classList.add("is-inked");        // 触发标题下面那道墨迹
    }, 60);
    // 兜底：不管发生什么，4 秒后内容一定可见
    setTimeout(function () {
      $$("[data-reveal], [data-split], .bars li").forEach(function (el) { el.classList.add("is-in"); });
    }, 4000);
  }

  /* ======================================================================
     13. 启动
     ====================================================================== */
  function init() {
    if (SMOOTH) document.documentElement.classList.add("smooth");

    // 用 data-stat 定位，不要靠写死的数字 —— 数字会变，选择器就失效了
    var pc = $('#stats b[data-stat="projects"]');
    if (pc) pc.setAttribute("data-count", String(PROJECTS.length));
    var cats = {};
    PROJECTS.forEach(function (p) { cats[p.category] = 1; });
    var ic = $('#stats b[data-stat="industries"]');
    if (ic) ic.setAttribute("data-count", String(Math.max(Object.keys(cats).length, 1)));
    var yEl = $("#stat-years");
    if (yEl) {
      var yrs = SITE.startYear ? Math.max(new Date().getFullYear() - SITE.startYear, 1) : 0;
      if (yrs) yEl.setAttribute("data-count", String(yrs));
      else yEl.closest("li").remove();
    }

    var mark = $("#logo-mark");    if (mark) mark.textContent = SITE.monogram || "JH";
    var fb   = $("#footer-brand"); if (fb) fb.textContent = SITE.brand || "";
    var yr   = $("#year");         if (yr) yr.textContent = new Date().getFullYear();

    setPhoto($("#hero-photo"));
    setPhoto($("#profile-photo"));
    setPhoto($("#contact-photo"));

    renderMarquee();
    applyLang(detectLang());
    boot();
  }

  /* 给 study.js 用的最小接口。刻意不暴露 engine / state —— 
     详情页不该有能力改主页面的滚动和筛选。 */
  window.JHApi = {
    t: t,
    pick: pick,
    esc: esc,
    lang: function () { return state.lang; },
    shotSrc: shotSrc,
    fallbackSrc: fallbackSrc,
    cardEl: function (slug) {
      for (var i = 0; i < CARDS.length; i++) if (CARDS[i].p.slug === slug) return CARDS[i].el;
      return null;
    },
    magnetic: bindMagnetic,
    reduced: reduced,
    coarse: coarse
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
