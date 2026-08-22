/* ============================================================================
   main.js — 网站逻辑。一般不需要改这个文件。
   ============================================================================ */
(function () {
  "use strict";

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var LANGS = ["zh", "en", "ms"];
  var HTML_LANG = { zh: "zh-CN", en: "en", ms: "ms" };
  var CATS = ["all", "corporate", "industrial", "ecommerce", "education", "lifestyle"];

  var state = { lang: "zh", filter: "all" };

  /* ---------- 语言 ---------- */
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

  /* ---------- WhatsApp 链接 ---------- */
  function waLink() {
    var num = (SITE.whatsapp || "").replace(/[^0-9]/g, "");
    var msg = (SITE.waMessage && SITE.waMessage[state.lang]) || "";
    return "https://wa.me/" + num + (msg ? "?text=" + encodeURIComponent(msg) : "");
  }
  function refreshWa() {
    $$("[data-wa]").forEach(function (a) {
      a.href = waLink();
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    });
    var em = $("#email-btn");
    if (em) em.href = "mailto:" + (SITE.email || "");
  }

  /* ---------- 作品卡片 ---------- */
  function shotSrc(p) { return "assets/screenshots/" + p.slug + ".jpg"; }
  function fallbackSrc(p) { return "assets/img/placeholder/" + p.slug + ".svg"; }

  function renderFilters() {
    var box = $("#filters");
    if (!box) return;
    box.innerHTML = "";
    CATS.forEach(function (c) {
      // 只显示实际有作品的分类
      if (c !== "all" && !PROJECTS.some(function (p) { return p.category === c; })) return;
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = t("work.filter." + c);
      b.className = state.filter === c ? "is-active" : "";
      b.setAttribute("aria-pressed", state.filter === c ? "true" : "false");
      b.addEventListener("click", function () {
        state.filter = c;
        // 只更新按钮状态，不整块重绘 —— 键盘操作时焦点不会丢
        $$("button", box).forEach(function (o) {
          var on = o === b;
          o.classList.toggle("is-active", on);
          o.setAttribute("aria-pressed", on ? "true" : "false");
        });
        renderProjects();
      });
      box.appendChild(b);
    });
  }

  function renderProjects() {
    var grid = $("#work-grid");
    var empty = $("#work-empty");
    if (!grid) return;
    grid.innerHTML = "";

    var list = PROJECTS.filter(function (p) {
      return state.filter === "all" || p.category === state.filter;
    });

    if (empty) { empty.hidden = list.length > 0; empty.textContent = t("work.empty"); }

    list.forEach(function (p, i) {
      var tags = (p.tags && (p.tags[state.lang] || p.tags.en)) || [];
      var blurb = (p.blurb && (p.blurb[state.lang] || p.blurb.en)) || "";

      var el = document.createElement("article");
      el.className = "proj";
      el.style.animationDelay = (i * 55) + "ms";
      el.tabIndex = 0;
      el.setAttribute("role", "button");
      el.setAttribute("aria-label", p.name);
      el.innerHTML =
        '<div class="proj__shot">' +
          '<span class="proj__badge">' + t("work.filter." + p.category) + "</span>" +
          '<span class="proj__year">' + (p.year || "") + "</span>" +
          '<img loading="lazy" alt="' + p.name + '" src="' + shotSrc(p) + '">' +
        "</div>" +
        '<div class="proj__body">' +
          '<h3 class="proj__title">' + p.name +
            '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          "</h3>" +
          '<p class="proj__blurb">' + blurb + "</p>" +
          '<ul class="chips">' + tags.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>" +
          '<span class="proj__link">' + t("work.detail") +
            '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          "</span>" +
        "</div>";

      // 截图还没放进去时，自动换成占位图（不会出现破图）
      var img = $("img", el);
      img.addEventListener("error", function handler() {
        img.removeEventListener("error", handler);
        img.src = fallbackSrc(p);
      });

      el.addEventListener("click", function () { openModal(p); });
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(p); }
      });
      grid.appendChild(el);
    });
  }

  /* ---------- 弹窗 ---------- */
  var modal = $("#modal");
  var lastFocus = null;

  function openModal(p) {
    if (!modal) return;
    lastFocus = document.activeElement;
    var img = $("#modal-img");
    img.onerror = function () { img.onerror = null; img.src = fallbackSrc(p); };
    img.src = shotSrc(p);
    img.alt = p.name;

    $("#modal-cat").textContent   = t("work.filter." + p.category) + " · " + (p.year || "");
    $("#modal-title").textContent = p.name;
    $("#modal-blurb").textContent = (p.blurb && (p.blurb[state.lang] || p.blurb.en)) || "";
    $("#modal-tags").innerHTML =
      ((p.tags && (p.tags[state.lang] || p.tags.en)) || []).map(function (x) { return "<li>" + x + "</li>"; }).join("");
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

  /* ---------- 其他动态内容 ---------- */
  function renderSkills() {
    var box = $("#skills");
    if (!box) return;
    box.innerHTML = ((SKILLS[state.lang] || SKILLS.en) || [])
      .map(function (s) { return "<li>" + s + "</li>"; }).join("");
  }
  function renderMarquee() {
    var box = $("#marquee");
    if (!box) return;
    var names = PROJECTS.map(function (p) { return "<span>" + p.name + "</span>"; }).join("");
    box.innerHTML = names + names; // 复制一份，实现无缝循环
  }
  function renderSocial() {
    var box = $("#social");
    if (!box) return;
    var out = "";
    if (SITE.xiaohongshu) out += '<a href="' + SITE.xiaohongshu + '" target="_blank" rel="noopener">' + t("contact.xhs") + "</a>";
    if (SITE.instagram)   out += '<a href="' + SITE.instagram   + '" target="_blank" rel="noopener">' + t("contact.ig")  + "</a>";
    box.innerHTML = out;
  }

  /* ---------- 应用语言 ---------- */
  function applyLang(lang) {
    state.lang = lang;
    try { localStorage.setItem("jh-lang", lang); } catch (e) {}
    document.documentElement.lang = HTML_LANG[lang] || "en";
    document.documentElement.setAttribute("data-lang", lang);

    $$("[data-i18n]").forEach(function (el) {
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
    renderSkills();
    renderSocial();
    refreshWa();
  }

  $$("[data-lang-btn]").forEach(function (b) {
    b.addEventListener("click", function () { applyLang(b.getAttribute("data-lang-btn")); });
  });

  /* ---------- 导航 ---------- */
  var nav = $("#nav");
  var burger = $("#burger");
  var navLinks = $("#nav-links");

  window.addEventListener("scroll", function () {
    if (nav) nav.classList.toggle("is-stuck", window.scrollY > 12);
  }, { passive: true });

  if (burger && navLinks) {
    burger.addEventListener("click", function () {
      var open = navLinks.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$("a", navLinks).forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  // 当前所在区块高亮
  var sections = $$("main section[id]");
  if ("IntersectionObserver" in window && navLinks) {
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        $$("a", navLinks).forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { navObs.observe(s); });
  }

  /* ---------- 滚动出现动画 ---------- */
  if ("IntersectionObserver" in window) {
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); revObs.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    $$(".reveal").forEach(function (el) { revObs.observe(el); });
  } else {
    $$(".reveal").forEach(function (el) { el.classList.add("is-in"); });
  }
  // 兜底：不管发生什么，3 秒后所有内容一定可见
  setTimeout(function () { $$(".reveal").forEach(function (el) { el.classList.add("is-in"); }); }, 3000);

  /* ---------- 数字滚动 ---------- */
  function countUp(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = target + suffix; return;
    }
    var start = null, dur = 1100;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var statsBox = $("#stats");
  if (statsBox && "IntersectionObserver" in window) {
    var sObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { $$("b[data-count]", statsBox).forEach(countUp); sObs.disconnect(); }
      });
    }, { threshold: 0.4 });
    sObs.observe(statsBox);
  }

  /* ---------- 启动 ---------- */
  function boot() {
    // 项目数 / 行业数 / 年资，自动从数据算出来
    var pc = $('#stats b[data-count="9"]');
    if (pc) pc.setAttribute("data-count", String(PROJECTS.length));

    var cats = {};
    PROJECTS.forEach(function (p) { cats[p.category] = 1; });
    var ic = $('#stats b[data-count="7"]');
    if (ic) ic.setAttribute("data-count", String(Math.max(Object.keys(cats).length, 1)));

    var yEl = $("#stat-years");
    if (yEl) {
      var yrs = SITE.startYear ? Math.max(new Date().getFullYear() - SITE.startYear, 1) : 0;
      if (yrs) { yEl.setAttribute("data-count", String(yrs)); }
      else { yEl.closest("li").remove(); }
    }

    var mark = $("#logo-mark");   if (mark) mark.textContent = SITE.monogram || "JH";
    var ltxt = $("#logo-text");   if (ltxt) ltxt.textContent = SITE.brand || "";
    var fb   = $("#footer-brand");if (fb)   fb.textContent   = SITE.brand || "";
    var yr   = $("#year");        if (yr)   yr.textContent   = new Date().getFullYear();

    renderMarquee();
    applyLang(detectLang());
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
