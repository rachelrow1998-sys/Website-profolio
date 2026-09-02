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
      '<p class="mascot-test__label">TEST · <b class="mascot-test__state">idle</b><br>' + LABEL + '</p>';
    cover.appendChild(wrap);

    var state = wrap.querySelector(".mascot-test__state");

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
