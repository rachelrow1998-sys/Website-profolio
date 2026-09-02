/* =========================================================================
   TEMPORARY — mascot animation test
   Hovering the hero title / subtitle block crossfades the mascot from the
   idle frame to the "look left" frame, and back on leave.
   Delete alongside assets/css/mascot-test.css and assets/img/mascot/.
   ========================================================================= */
(function () {
  "use strict";

  var IDLE = "assets/img/mascot/ChatGPT%20Image%20Sep%202,%202026,%2006_02_38%20PM.png";
  var LOOK = "assets/img/mascot/frame-04-look-left.png";
  var LABEL = "ChatGPT Image Sep 2, 2026, 06_02_38 PM.png / frame-04-look-left.png";

  /* --- Stand-in frames -------------------------------------------------
     The two PNGs are not in the repo yet. Until they are dropped into
     assets/img/mascot/, each <img> falls back to a crude SVG silhouette so
     the crossfade itself is still verifiable. Adding the real files removes
     these automatically — nothing else has to change. */
  function placeholder(looking) {
    var pupil = looking ? 418 : 476;      // pupils swing left on the hover frame
    var tilt  = looking ? -12 : 0;        // and the head tilts with them
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1536">' +
        '<g fill="none" stroke="#111" stroke-width="10" opacity=".7">' +
          '<path d="M362 780 h300 v560 h-300 z" fill="#8c1c2b" fill-opacity=".18"/>' +
          '<path d="M330 470 h364 v330 h-364 z" fill="#8c1c2b" fill-opacity=".3"/>' +
          '<g transform="rotate(' + tilt + ' 512 300)">' +
            '<circle cx="512" cy="300" r="175" fill="#fff"/>' +
            '<circle cx="' + pupil + '" cy="290" r="20" fill="#111"/>' +
            '<circle cx="' + (pupil + 96) + '" cy="290" r="20" fill="#111"/>' +
            '<path d="M470 360 q42 30 84 0"/>' +
          '</g>' +
        '</g>' +
      '</svg>';
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  function init() {
    var cover = document.querySelector(".sheet--cover");
    if (!cover || document.querySelector(".mascot-test")) return;

    // The hover zone: the hero title, the lead line and the description.
    var zone = [".cover__word", ".cover__lead", ".cover__desc"]
      .map(function (sel) { return cover.querySelector(sel); })
      .filter(Boolean);
    if (!zone.length) return;

    var wrap = document.createElement("div");
    wrap.className = "mascot-test";
    wrap.setAttribute("aria-hidden", "true");
    wrap.innerHTML =
      '<img class="mascot-test__frame mascot-test__frame--idle" alt="" src="' + IDLE + '">' +
      '<img class="mascot-test__frame mascot-test__frame--look" alt="" src="' + LOOK + '">' +
      '<p class="mascot-test__label">TEST · <b class="mascot-test__state">idle</b><br>' + LABEL +
        '<em class="mascot-test__note" hidden>PNGs missing — placeholder frames</em></p>';
    cover.appendChild(wrap);

    var state = wrap.querySelector(".mascot-test__state");
    var note = wrap.querySelector(".mascot-test__note");

    Array.prototype.forEach.call(wrap.querySelectorAll(".mascot-test__frame"), function (img) {
      img.addEventListener("error", function () {
        img.src = placeholder(img.classList.contains("mascot-test__frame--look"));
        note.hidden = false;
      });
    });

    // Several elements make up one logical zone, so count how many of them
    // the pointer is currently inside instead of toggling per element.
    var inside = 0;

    function sync() {
      var looking = inside > 0;
      wrap.classList.toggle("is-looking", looking);
      state.textContent = looking ? "look-left" : "idle";
    }

    zone.forEach(function (el) {
      el.addEventListener("pointerenter", function () { inside++; sync(); });
      el.addEventListener("pointerleave", function () { inside = Math.max(0, inside - 1); sync(); });
    });

    // A pointer leaving the window never fires pointerleave on some browsers.
    document.addEventListener("pointercancel", function () { inside = 0; sync(); });
    window.addEventListener("blur", function () { inside = 0; sync(); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
