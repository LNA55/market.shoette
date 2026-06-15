/* siteheader.js — injecte l'en-tête de site (logo + fil d'Ariane) sur toutes les
   pages du sous-domaine market. Source unique (décision Elena, 2026-06-13) —
   pendant du sitefoot.js pour le pied.

   Autonome : porte son propre CSS (valeurs canoniques en dur + fallbacks de
   variables), donc rendu identique que site.css soit chargé ou non (les pages de
   run ont leurs styles inline). Le chemin vers la racine du site est déduit du src
   de CE script (".../assets/siteheader.js"), robuste à toute profondeur et en file://.

   Placé en TÊTE de <body> et synchrone : l'en-tête est inséré avant la peinture du
   reste de la page → aucun flash, aucun saut de mise en page (pas de réservation
   de hauteur nécessaire), l'en-tête reste sticky et dans le flux.

   Le fil d'Ariane est déclaré par la page via des attributs data-* sur la balise :
     <script src="…/assets/siteheader.js"></script>                       → logo seul (accueil)
     <script … data-crumb="accueil"></script>                              → « ← Accueil »
     <script … data-crumb="parent" data-parent-label="Marché : X"
                  data-parent-href="../"></script>                         → « ← Marché : X · Accueil »
*/
(function () {
  "use strict";

  var self = document.currentScript;
  var src = (self && self.getAttribute("src")) || "";
  var base = src.replace(/assets\/siteheader\.js(?:[?#].*)?$/, "") || "./";

  var crumb = (self && self.getAttribute("data-crumb")) || "";
  var parentLabel = (self && self.getAttribute("data-parent-label")) || "";
  var parentHref = (self && self.getAttribute("data-parent-href")) || "../";

  var STYLE_ID = "siteheader-style";
  var FONTS_ID = "mmd-fonts";
  // Design system : barre translucide chaude + barre de progression au scroll (cf. design Step 2).
  var CSS =
    ".siteheader{position:sticky;top:0;z-index:100;" +
      "background:rgba(250,248,244,.85);" +
      "-webkit-backdrop-filter:saturate(1.4) blur(14px);backdrop-filter:saturate(1.4) blur(14px);" +
      "border-bottom:1px solid var(--line-2,#efebe2);}" +
    ".siteheader-inner{max-width:calc(50vw + 550px);margin:0 auto;padding:11px 20px;" +
      "display:flex;align-items:center;justify-content:space-between;gap:16px;}" +
    ".siteheader .brand{font-family:'Hanken Grotesk','Plus Jakarta Sans',system-ui,-apple-system,sans-serif;" +
      "font-weight:800;font-size:18px;letter-spacing:-.015em;color:var(--ink,#1a1c22);text-decoration:none;" +
      "white-space:nowrap;flex:none;}" +
    ".siteheader .crumb{text-align:right;}" +
    ".siteheader .brand .dot{color:#f4684f;}" +
    ".siteheader .crumb{margin:0;font-family:'Hanken Grotesk',system-ui,-apple-system,sans-serif;" +
      "font-size:13.5px;font-weight:600;color:#6e7191;text-decoration:none;}" +
    ".siteheader .crumb a{color:#6e7191;text-decoration:none;}" +
    ".siteheader .crumb a:hover,.siteheader a.crumb:hover{color:#3b3bd8;}" +
    ".siteheader .progress{position:absolute;left:0;bottom:-1px;height:2px;width:0;" +
      "background:var(--accent,#2f6bff);transition:width .1s linear;}" +
    "@media print{.siteheader{display:none!important;}}";

  // Polices du design system (Hanken Grotesk + IBM Plex Mono), injectées une fois pour
  // tout le sous-domaine. Instrument Serif (questions des frameworks) est chargée par
  // les pages de rapport qui en ont besoin.
  function injectFonts() {
    if (document.getElementById(FONTS_ID)) return;
    var l = document.createElement("link");
    l.id = FONTS_ID;
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap";
    (document.head || document.documentElement).appendChild(l);
  }

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  function brand() {
    var a = document.createElement("a");
    a.className = "brand";
    a.href = base;
    a.appendChild(document.createTextNode("My Market Data"));
    var dot = document.createElement("span");
    dot.className = "dot";
    dot.textContent = ".";
    a.appendChild(dot);
    return a;
  }

  // « ← Accueil » (lien simple) ou « ← parent · Accueil » (nav à deux niveaux)
  function crumbEl() {
    if (crumb === "accueil") {
      var a = document.createElement("a");
      a.className = "crumb";
      a.href = base;
      a.textContent = "← Accueil";
      return a;
    }
    if (crumb === "parent") {
      var nav = document.createElement("nav");
      nav.className = "crumb";
      var up = document.createElement("a");
      up.href = parentHref;
      up.textContent = "← " + parentLabel;
      nav.appendChild(up);
      nav.appendChild(document.createTextNode(" · "));
      var home = document.createElement("a");
      home.href = base;
      home.textContent = "Accueil";
      nav.appendChild(home);
      return nav;
    }
    return null; // accueil (logo seul)
  }

  function build() {
    var header = document.createElement("header");
    header.className = "siteheader";
    var inner = document.createElement("div");
    inner.className = "siteheader-inner";
    inner.appendChild(brand());
    var c = crumbEl();
    if (c) inner.appendChild(c);
    header.appendChild(inner);
    var prog = document.createElement("span");
    prog.className = "progress";
    header.appendChild(prog);
    return header;
  }

  // Barre de progression : largeur = part de la page déjà parcourue.
  function setupProgress() {
    var prog = document.querySelector(".siteheader .progress");
    if (!prog) return;
    function update() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var p = max > 0 ? (h.scrollTop || document.body.scrollTop) / max : 0;
      prog.style.width = (p * 100).toFixed(2) + "%";
    }
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(function () { update(); ticking = false; }); ticking = true; }
    }, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();
  }

  function inject() {
    if (document.querySelector(".siteheader")) return; // déjà présent
    injectFonts();
    injectStyle();
    var parent = (self && self.parentNode) || document.body;
    parent.insertBefore(build(), parent.firstChild);
    setupProgress();
  }

  // Script placé en tête de <body> → body disponible, insertion immédiate (avant peinture).
  if (document.body) {
    inject();
  } else {
    document.addEventListener("DOMContentLoaded", inject);
  }
})();
