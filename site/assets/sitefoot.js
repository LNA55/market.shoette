/* sitefoot.js — injecte la navigation « La méthode » dans le pied de page de toutes
   les pages du sous-domaine market. Source unique (décision Elena, 2026-06-13).

   Autonome : porte son propre CSS et fonctionne que site.css soit chargé ou non
   (les pages de run ont leurs styles inline). Les variables --muted/--accent/--line
   sont définies aussi bien par site.css que par les runs ; des fallbacks couvrent
   le cas où elles manqueraient.

   Le chemin de base vers la racine du site est déduit du src de ce script
   (".../assets/sitefoot.js"), donc robuste à toute profondeur de page et en file://. */
(function () {
  "use strict";

  // Base relative jusqu'à la racine du site, déduite du src de CE script ("" / "../" / "../../").
  var self = document.currentScript;
  var src = (self && self.getAttribute("src")) || "";
  var base = src.replace(/assets\/sitefoot\.js(?:[?#].*)?$/, "");

  // Liens « La méthode », dans l'ordre du pipeline.
  var LINKS = [
    ["how-it-works/", "How it works"],
    ["focus-step-1/", "Focus on Step 1"],
    ["focus-step-2/", "Focus on Step 2"],
    ["focus-step-3/", "Focus on Step 3"],
    ["focus-step-4/", "Focus on Step 4"]
  ];

  var STYLE_ID = "foot-method-style";
  var CSS =
    ".foot-method{flex:0 0 100%;display:flex;flex-wrap:wrap;align-items:baseline;" +
      "gap:4px 0;margin-bottom:14px;padding-bottom:13px;" +
      "border-bottom:1px solid var(--line,#e2e8f0);}" +
    ".foot-method-title{font-size:11.5px;font-weight:700;text-transform:uppercase;" +
      "letter-spacing:.08em;color:var(--muted,#64748b);opacity:.75;margin-right:16px;}" +
    ".foot-method-links{font-size:13px;display:flex;flex-wrap:wrap;align-items:baseline;}" +
    ".foot-method-links a{color:var(--muted,#64748b);text-decoration:none;font-weight:600;}" +
    ".foot-method-links a:hover{color:var(--accent,#2563eb);}" +
    ".foot-method-sep{margin:0 10px;color:var(--faint,#94a3b8);opacity:.7;}";

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function buildNav() {
    var nav = document.createElement("nav");
    nav.className = "foot-method";
    nav.setAttribute("aria-label", "La méthode");

    var title = document.createElement("span");
    title.className = "foot-method-title";
    title.textContent = "La méthode";
    nav.appendChild(title);

    var links = document.createElement("span");
    links.className = "foot-method-links";
    LINKS.forEach(function (item, i) {
      if (i > 0) {
        var sep = document.createElement("span");
        sep.className = "foot-method-sep";
        sep.setAttribute("aria-hidden", "true");
        sep.textContent = "·";
        links.appendChild(sep);
      }
      var a = document.createElement("a");
      a.href = base + item[0];
      a.textContent = item[1];
      links.appendChild(a);
    });
    nav.appendChild(links);
    return nav;
  }

  function inject() {
    var foot = document.querySelector("footer.sitefoot, footer.report");
    if (!foot || foot.querySelector(".foot-method")) return; // rien à faire / déjà injecté
    injectStyle();
    foot.insertBefore(buildNav(), foot.firstChild);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();
