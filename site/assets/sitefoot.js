/* sitefoot.js — pied de page commun à TOUTES les pages du sous-domaine market.
   Source unique (décision Elena, 2026-06-13) — pendant du siteheader.js.

   Génère l'intégralité du footer : présentation, liens « La méthode », liens
   « Marchés étudiés », mentions légales. Identique partout, aucun footer en dur
   dans les pages.

   Autonome : porte son propre CSS (valeurs en dur, aucune dépendance à site.css),
   déduit le chemin racine de son propre src. Injecté en fin de <body>, hors du
   conteneur centré → bandeau pleine largeur, visuellement distinct du corps.
   Placé en bas de page (sous le pli) : n'impacte pas le rendu au-dessus du pli.

   ── Ajouter un marché : ajouter une entrée à MARKETS ci-dessous. ──
*/
(function () {
  "use strict";

  var self = document.currentScript;
  var src = (self && self.getAttribute("src")) || "";
  var base = src.replace(/assets\/sitefoot\.js(?:[?#].*)?$/, "") || "./";

  // « La méthode » — pages de documentation, dans l'ordre du pipeline.
  var METHODE = [
    ["how-it-works/", "How it works"],
    ["focus-step-1/", "Focus on Step 1"],
    ["focus-step-2/", "Focus on Step 2"],
    ["focus-step-3/", "Focus on Step 3"],
    ["focus-step-4/", "Focus on Step 4"]
  ];

  // « Marchés étudiés » — un [slug/, label] par marché (étendre à chaque nouveau marché).
  var MARCHES = [
    ["apps-perte-de-poids/", "Applications mobiles d'assistance à la perte de poids"]
  ];

  var ABOUT = "Études de marché générées par un agent IA : acteurs, parts de marché, " +
    "positionnement interactif et recommandations stratégiques — un rapport daté à chaque cycle.";

  var STYLE_ID = "sitefoot-style";
  var CSS =
    ".sitefoot{margin-top:80px;background:#f4f1ea;border-top:1px solid #e7e2d8;" +
      "color:#494d59;font-family:'Hanken Grotesk',system-ui,-apple-system,'Segoe UI',sans-serif;" +
      "font-size:13.5px;line-height:1.5;}" +
    ".sitefoot-inner{max-width:calc(50vw + 550px);margin:0 auto;padding:40px 20px 28px;}" +
    ".sitefoot-top{display:flex;flex-wrap:wrap;gap:26px 48px;}" +
    ".sitefoot-about{flex:1 1 260px;min-width:230px;}" +
    ".sitefoot-brand{font-family:'Hanken Grotesk','Plus Jakarta Sans',system-ui,sans-serif;font-weight:800;" +
      "font-size:18px;letter-spacing:-.015em;color:#1a1c22;text-decoration:none;}" +
    ".sitefoot-brand .dot{color:#f4684f;}" +
    ".sitefoot-about p{margin:11px 0 0;max-width:38ch;color:#494d59;font-size:14px;}" +
    ".sitefoot-group{flex:0 0 auto;}" +
    ".sitefoot-h{display:block;font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:11px;font-weight:600;" +
      "text-transform:uppercase;letter-spacing:.12em;color:#868a93;margin:0 0 13px;}" +
    ".sitefoot-group ul{list-style:none;margin:0;padding:0;}" +
    ".sitefoot-group li{margin:0 0 8px;}" +
    ".sitefoot-group a{color:#494d59;text-decoration:none;font-weight:500;font-size:14px;}" +
    ".sitefoot-group a:hover{color:#1a1c22;}" +
    ".sitefoot-legal{margin-top:28px;padding-top:18px;border-top:1px solid #e7e2d8;" +
      "display:flex;flex-wrap:wrap;justify-content:space-between;gap:6px 24px;" +
      "font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:12px;color:#868a93;}" +
    ".sitefoot-legal a{color:#868a93;text-decoration:none;}" +
    ".sitefoot-legal a:hover{color:#1a1c22;}" +
    "@media print{.sitefoot{display:none!important;}}" +
    "@media (max-width:560px){.sitefoot-inner{padding:30px 18px 24px;}" +
      ".sitefoot-top{gap:22px 32px;}.sitefoot-legal{flex-direction:column;}}";

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  function linkList(items) {
    var ul = document.createElement("ul");
    items.forEach(function (it) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = base + it[0];
      a.textContent = it[1];
      li.appendChild(a);
      ul.appendChild(li);
    });
    return ul;
  }

  function group(label, items) {
    var nav = document.createElement("nav");
    nav.className = "sitefoot-group";
    nav.setAttribute("aria-label", label);
    var h = document.createElement("span");
    h.className = "sitefoot-h";
    h.textContent = label;
    nav.appendChild(h);
    nav.appendChild(linkList(items));
    return nav;
  }

  function build() {
    var foot = document.createElement("footer");
    foot.className = "sitefoot";
    foot.setAttribute("role", "contentinfo");

    var inner = document.createElement("div");
    inner.className = "sitefoot-inner";

    var top = document.createElement("div");
    top.className = "sitefoot-top";

    // colonne présentation
    var about = document.createElement("div");
    about.className = "sitefoot-about";
    var brand = document.createElement("a");
    brand.className = "sitefoot-brand";
    brand.href = base;
    brand.appendChild(document.createTextNode("My Market Data"));
    var dot = document.createElement("span");
    dot.className = "dot";
    dot.textContent = ".";
    brand.appendChild(dot);
    about.appendChild(brand);
    var p = document.createElement("p");
    p.textContent = ABOUT;
    about.appendChild(p);
    top.appendChild(about);

    top.appendChild(group("La méthode", METHODE));
    top.appendChild(group("Marchés étudiés", MARCHES));
    inner.appendChild(top);

    // mentions légales
    var legal = document.createElement("div");
    legal.className = "sitefoot-legal";
    var l1 = document.createElement("span");
    l1.textContent = "© 2026 My Market Data — études générées par IA, données estimées fournies à titre indicatif.";
    var l2 = document.createElement("span");
    l2.appendChild(document.createTextNode("Hébergé par OVH · "));
    var dom = document.createElement("a");
    dom.href = base;
    dom.textContent = "market.shoette.com";
    l2.appendChild(dom);
    legal.appendChild(l1);
    legal.appendChild(l2);
    inner.appendChild(legal);

    foot.appendChild(inner);
    return foot;
  }

  function inject() {
    if (document.querySelector(".sitefoot")) return; // déjà présent
    injectStyle();
    document.body.appendChild(build());
  }

  if (document.body) {
    inject();
  } else {
    document.addEventListener("DOMContentLoaded", inject);
  }
})();
