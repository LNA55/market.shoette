/* sitepipeline.js — barre des 4 étapes du pipeline en tête des pages de run.
   Source unique (décision Elena, 2026-06-15) — pendant de siteheader.js / sitefoot.js.

   RENDU commun ; CIBLES des liens propres au run, posées à sa création via data-*
   sur la balise (règle « à la création », Elena 2026-06-15) :
     data-active="K"            → l'étape de cette page (mise en évidence, non cliquable)
     data-href1 … data-href4    → le run réellement utilisé pour chaque étape amont
                                  (= le dernier run de cette étape existant à la date)
   Une étape sans data-href (pas encore de run à la date) → repli sur la section de
   la page marché « ../#step-K ». Injecté sous le hero, aligné sur le contenu.
*/
(function () {
  "use strict";

  var self = document.currentScript;            // capté en synchrone (null au DOMContentLoaded)

  var STYLE_ID = "sitepipeline-style";
  var CSS =
    ".pipenav{display:flex;flex-wrap:wrap;gap:7px 22px;align-items:baseline;" +
      "padding:13px 0 14px;border-bottom:1px solid var(--line-2,#efebe2);" +
      "font-family:'Hanken Grotesk',system-ui,-apple-system,sans-serif;font-size:13px;}" +
    // au niveau body (hero en <section> pleine largeur) : reprendre la largeur de contenu
    ".pipenav.is-bleed{max-width:var(--maxw,1180px);margin:0 auto;" +
      "padding-left:var(--gutter,clamp(20px,5vw,56px));padding-right:var(--gutter,clamp(20px,5vw,56px));}" +
    ".pipenav__step{display:inline-flex;align-items:baseline;gap:7px;text-decoration:none;" +
      "color:var(--ink-3,#868a93);white-space:nowrap;}" +
    ".pipenav__step .n{font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:10px;" +
      "letter-spacing:.06em;color:var(--ink-3,#a8a29a);}" +
    "a.pipenav__step:hover{color:var(--ink,#1a1c22);}" +
    "a.pipenav__step:hover .pipenav__name{text-decoration:underline;text-underline-offset:3px;}" +
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

  function attr(n) { return self ? self.getAttribute(n) : null; }

  function start() {
    if (document.querySelector(".pipenav")) return;        // idempotent

    // Étape active : data-active prioritaire, sinon déduite de l'URL (/[slug]/sK-…/).
    var segs = location.pathname.split("/").filter(Boolean);
    var last = segs[segs.length - 1] || "";
    if (last === "index.html") last = segs[segs.length - 2] || "";
    var um = last.match(/^s(\d+)-/);
    var active = parseInt(attr("data-active"), 10) || (um ? parseInt(um[1], 10) : 0);
    if (!active) return;                                    // pas une page de run

    var market = "../";
    var NAMES = ["Lire le marché", "Présenter le marché", "Positionner mon produit", "Recommandation stratégique"];

    injectStyle();
    var nav = document.createElement("nav");
    nav.className = "pipenav";
    nav.setAttribute("aria-label", "Les étapes du pipeline");

    NAMES.forEach(function (name, i) {
      var step = i + 1;
      var item;
      if (step === active) {
        item = document.createElement("span");                       // page courante : non cliquable
        item.className = "pipenav__step is-active";
        item.setAttribute("aria-current", "step");
      } else {
        item = document.createElement("a");
        item.className = "pipenav__step";
        item.href = attr("data-href" + step) || (market + "#step-" + step);   // run utilisé, sinon section marché
      }
      var n = document.createElement("span");
      n.className = "n"; n.textContent = "0" + step;
      item.appendChild(n);
      var label = document.createElement("span");
      label.className = "pipenav__name"; label.textContent = name;
      item.appendChild(label);
      nav.appendChild(item);
    });

    var hero = document.querySelector(".hero");
    if (hero && hero.parentNode) {
      hero.insertAdjacentElement("afterend", nav);
    } else {
      var c = document.querySelector(".shell, .wrap, main") || document.body;
      c.insertBefore(nav, c.firstChild);
    }
    // Alignement : barre au niveau body (hero plein largeur) → largeur de contenu (is-bleed) ;
    // barre dans un conteneur (.wrap/.shell, cas S1) → hérite directement.
    var p = nav.parentElement;
    if (!p || !(p.classList.contains("wrap") || p.classList.contains("shell"))) nav.classList.add("is-bleed");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
