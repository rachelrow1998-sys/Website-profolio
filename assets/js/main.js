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
  var CATS = ["all", "corporate", "industrial", "ecommerce", "education", "lifestyle"];

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
  function shotSrc(p) { return "assets/screenshots/" + p.slug + ".jpg"; }
  function fallbackSrc(p) { return "assets/img/placeholder/" + p.slug + ".svg"; }

  var PERSON_FALLBACK =
    "data:image/svg+xml;base64," + btoa(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">' +
      '<rect width="400" height="500" fill="#101C2E"/>' +
      '<circle cx="200" cy="190" r="76" fill="#1B2B42"/>' +
      '<path d="M60 500c0-86 63-150 140-150s140 64 140 150z" fill="#1B2B42"/>' +
      '<text x="200" y="470" text-anchor="middle" font-family="Helvetica,Arial" font-size="17" fill="#4C5A72" letter-spacing="3">ADD assets/img/me.jpg</text>' +
      "</svg>");

  function setPhoto(el) {
    if (!el) return;
    el.addEventListener("error", function h() { el.removeEventListener("error", h); el.src = PERSON_FALLBACK; });
    el.src = PROFILE.photo || PERSON_FALLBACK;
    el.alt = PROFILE.name || "";
  }

  /* ======================================================================
     4. 文字拆字（每个字符单独入场）
     ====================================================================== */
  function splitText(el) {
    if (el.dataset.splitDone) return;
    var host = el.querySelector("span[data-i18n]") || el;
    var text = host.textContent.trim();
    // 按「词」分组：词内部不允许换行，避免 PORTFOLI / O 这种断词
    var out = "", n = 0;
    text.split(/(\s+)/).forEach(function (word) {
      if (!word) return;
      if (/^\s+$/.test(word)) { out += '<span class="ch ch--sp"></span>'; return; }
      out += '<span class="wd">';
      for (var i = 0; i < word.length; i++) {
        out += '<span class="ch"><i style="transition-delay:' + (n++ * 24) + 'ms">' + esc(word[i]) + "</i></span>";
      }
      out += "</span>";
    });
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
        renderProjects();
      });
      box.appendChild(b);
    });
  }

  function renderProjects() {
    var grid = $("#work-grid"), empty = $("#work-empty");
    if (!grid) return;
    grid.innerHTML = "";
    var list = PROJECTS.filter(function (p) { return state.filter === "all" || p.category === state.filter; });
    if (empty) { empty.hidden = list.length > 0; empty.textContent = t("work.empty"); }

    list.forEach(function (p, i) {
      var tags = pick(p.tags) || [];
      var el = document.createElement("article");
      el.className = "proj";
      el.style.animationDelay = (i * 55) + "ms";
      el.tabIndex = 0;
      el.setAttribute("role", "button");
      el.setAttribute("aria-label", p.name);
      el.innerHTML =
        '<div class="proj__shot">' +
          '<span class="proj__badge">' + esc(t("work.filter." + p.category)) + "</span>" +
          '<span class="proj__year">' + esc(p.year || "") + "</span>" +
          '<img loading="lazy" alt="' + esc(p.name) + '" src="' + esc(shotSrc(p)) + '">' +
        "</div>" +
        '<div class="proj__body">' +
          '<h3 class="proj__title">' + esc(p.name) +
            '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          "</h3>" +
          '<p class="proj__blurb">' + esc(pick(p.blurb) || "") + "</p>" +
          '<ul class="chips">' + tags.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" +
          '<span class="proj__link">' + t("work.detail") +
            '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          "</span>" +
        "</div>";

      var img = $("img", el);
      img.addEventListener("error", function h() { img.removeEventListener("error", h); img.src = fallbackSrc(p); });

      el.addEventListener("click", function () { openModal(p); });
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(p); }
      });
      bindTilt(el);
      grid.appendChild(el);
    });
  }

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
        return '<li data-label="' + esc(s.label) + '" style="color:' + esc(s.color) + '" title="' + esc(s.label) + '">' + esc(s.code) + "</li>";
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
      return '<a href="' + esc(href) + '"' + (wa ? " data-wa" : ' target="_blank" rel="noopener"') + '>' +
             '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">' + ICONS[icon] + "</svg>" + esc(label) + "</a>";
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
     9. 弹窗
     ====================================================================== */
  var modal = $("#modal"), lastFocus = null;
  function openModal(p) {
    if (!modal) return;
    lastFocus = document.activeElement;
    var img = $("#modal-img");
    img.onerror = function () { img.onerror = null; img.src = fallbackSrc(p); };
    img.src = shotSrc(p);
    img.alt = p.name;
    $("#modal-cat").textContent   = t("work.filter." + p.category) + " · " + (p.year || "");
    $("#modal-title").textContent = p.name;
    $("#modal-blurb").textContent = pick(p.blurb) || "";
    $("#modal-tags").innerHTML    = (pick(p.tags) || []).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
    $("#modal-link").href = p.url;
    modal.hidden = false;
    document.body.classList.add("is-locked");
    $(".modal__x", modal).focus();
  }
  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove("is-locked");
    if (lastFocus) lastFocus.focus();
  }
  if (modal) {
    $$("[data-close]", modal).forEach(function (b) { b.addEventListener("click", closeModal); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });
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
  }
  $$("[data-lang-btn]").forEach(function (b) {
    b.addEventListener("click", function () { applyLang(b.getAttribute("data-lang-btn")); });
  });

  /* ======================================================================
     12. 开机动画
     ====================================================================== */
  function boot() {
    var box = $("#boot"), fill = $("#boot-fill"), pct = $("#boot-pct");
    if (!box) return start();
    document.body.classList.add("boot-on");
    if (reduced) { box.classList.add("is-done"); document.body.classList.remove("boot-on"); return start(); }

    var v = 0, t0 = null;
    (function run(ts) {
      if (!t0) t0 = ts;
      v = Math.min(((ts - t0) / 1100) * 100, 100);
      fill.style.width = v + "%";
      pct.textContent = Math.round(v);
      if (v < 100) return requestAnimationFrame(run);
      setTimeout(function () {
        box.classList.add("is-done");
        document.body.classList.remove("boot-on");
        start();
      }, 220);
    })(performance.now());
  }

  function start() {
    engine.start();
    // 首屏元素依次入场
    setTimeout(function () {
      $$("#home [data-split], #home [data-reveal]").forEach(function (el) { el.classList.add("is-in"); });
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

    var pc = $('#stats b[data-count="9"]');
    if (pc) pc.setAttribute("data-count", String(PROJECTS.length));
    var cats = {};
    PROJECTS.forEach(function (p) { cats[p.category] = 1; });
    var ic = $('#stats b[data-count="5"]');
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

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
