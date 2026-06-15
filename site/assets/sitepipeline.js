/* sitepipeline.js — barre de navigation du pipeline (les 4 étapes) en tête des
   pages de run. Source unique (décision Elena, 2026-06-15) — pendant de
   siteheader.js / sitefoot.js.

   N'agit QUE sur une page de run (`/[marché]/sK-N_date/`) : déduit de l'URL le
   marché et l'étape active (sK), puis injecte sous le hero une ligne :
     Lire le marché · Présenter le marché · Positionner mon produit · Recommandation stratégique
   Chaque libellé pointe vers la section de l'étape sur la page marché
   (`../#step-K`) ; l'étape de la page courante est mise en évidence.

   Autonome (CSS en dur + fallbacks de tokens), zéro donnée par run, s'applique
   donc à tout run passé ou futur sans configuration.
*/
(function () {
  "use strict";

  // Page de run ? dernier segment du chemin = sK-N_date
  var segs = location.pathname.split("/").filter(Boolean);
  var last = segs[segs.length - 1] || "";
  if (last === "index.html") last = segs[segs.length - 2] || "";   // URL …/run/index.html
  var m = last.match(/^s(\d+)-/);
  if (!m) return;                          // pas une page de run → on ne fait rien
  var active = parseInt(m[1], 10);
  var market = "../";                       // la page marché est un cran au-dessus du run

  var STEPS = [
    "Lire le marché",
    "Présenter le marché",
    "Positionner mon produit",
    "Recommandation stratégique"
  ];

  var STYLE_ID = "sitepipeline-style";
  var CSS =
    ".pipenav{display:flex;flex-wrap:wrap;gap:7px 22px;align-items:baseline;" +
      "margin:0 0 6px;padding:0 0 16px;border-bottom:1px solid var(--line-2,#efebe2);" +
      "font-family:'Hanken Grotesk',system-ui,-apple-system,sans-serif;font-size:13px;}" +
    ".pipenav__step{display:inline-flex;align-items:baseline;gap:7px;text-decoration:none;" +
      "color:var(--ink-3,#868a93);white-space:nowrap;}" +
    ".pipenav__step .n{font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:10px;" +
      "letter-spacing:.06em;color:var(--ink-3,#a8a29a);}" +
    ".pipenav__step:hover{color:var(--ink,#1a1c22);}" +
    ".pipenav__step:hover .pipenav__name{text-decoration:underline;text-underline-offset:3px;}" +
    ".pipenav__step.is-active{color:var(--ink,#1a1c22);font-weight:700;}" +
    ".pipenav__step.is-active .n{color:var(--brand,#f4684f);}" +
    "@media print{.pipenav{display:none!important;}}";

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  function build() {
    var nav = document.createElement("nav");
    nav.className = "pipenav";
    nav.setAttribute("aria-label", "Les étapes du pipeline");
    STEPS.forEach(function (name, i) {
      var step = i + 1;
      var a = document.createElement("a");
      a.className = "pipenav__step" + (step === active ? " is-active" : "");
      a.href = market + "#step-" + step;
      if (step === active) a.setAttribute("aria-current", "step");
      var n = document.createElement("span");
      n.className = "n";
      n.textContent = "0" + step;
      a.appendChild(n);
      var label = document.createElement("span");
      label.className = "pipenav__name";
      label.textContent = name;
      a.appendChild(label);
      nav.appendChild(a);
    });
    return nav;
  }

  function inject() {
    if (document.querySelector(".pipenav")) return;     // idempotent
    injectStyle();
    var hero = document.querySelector(".hero");
    if (hero && hero.parentNode) {
      hero.insertAdjacentElement("afterend", build());   // juste sous le hero
    } else {
      var c = document.querySelector(".shell, .wrap, main") || document.body;
      c.insertBefore(build(), c.firstChild);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();
