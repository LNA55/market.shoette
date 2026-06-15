# Contrats du site — arborescence, zones balisées, page de run, assets

## Arborescence servie (`site/` en local = `market/` sur OVH)

```
site/
├── index.html                       accueil — liste des marchés (zone MARKETS) ; en-tête injecté par siteheader.js, footer complet par sitefoot.js
├── .htaccess                        règles de cache (HTML revalidé, assets versionnés cachés)
├── how-it-works/                    ┐
├── focus-step-1/ … focus-step-4/  ┘ pages statiques de documentation — domaine d'Elena, l'agent n'y touche JAMAIS sauf demande explicite
├── assets/
│   ├── site.css                     charte des pages parent + documentation (non versionnée — pages non figées)
│   ├── siteheader.js                injecte l'en-tête (logo + fil d'Ariane) en tête de body — chargé par TOUTES les pages (non versionné)
│   ├── sitefoot.js                  génère le footer complet (présentation, méthode, marchés, légal) — chargé par TOUTES les pages (non versionné)
│   ├── sitepipeline.js              barre des 4 étapes du pipeline en tête des pages de RUN (étape déduite de l'URL) — non versionné
│   ├── positioning-chart-v1.js     moteur du graphique 2b (versionné)
│   └── positioning-chart-v1.css
└── [slug]/
    ├── index.html                   page marché — sections par skill (zones RUNS-SKILL1..4)
    └── s1-[N]_[date]/               un run de la Skill 1 (schéma commun : s[K]-[N]_[date] — s2-, s3-, s4- pour les autres skills)
        ├── index.html               le rapport du run (figé)
        └── data.json                canevas de données du run
```

## Charte des pages parent

Les pages parent (accueil + pages marché) partagent `assets/site.css` — **design system « My Market Data »** (acté 2026-06-14) : papier chaud `#faf8f4`, marque **coral `#F4684F`** (chrome/navigation), bleu `#2f6bff` (liens/faits), système de signaux, cartes blanches arrondies (18px), typographies **Hanken Grotesk** / **IBM Plex Mono** / **Instrument Serif** (injectées par `siteheader.js`). Elles ne sont pas figées : `site.css` peut évoluer librement (contrairement au moteur 2b, versionné). Les pages de run, elles, gardent leurs styles inline (autonomes et figées) — même design system.

## Zones balisées — pages parent

Réécrire **uniquement** entre les balises. Tout le reste de ces pages appartient à Elena. Les pages parent sont en français, quel que soit la langue des runs.

**Accueil — `site/index.html`** (marchés par ordre alphabétique ; dates en français long « 11 juin 2026 ») :

```html
<!-- MARKETS:START — zone gérée par l'agent, ne pas éditer à la main -->
<ul class="cards">
  <li><a class="card" href="[slug]/">
    <span class="card-body">
      <span class="card-title">[Label du marché]</span>
      <span class="card-meta">[N] run(s) · dernier le [date longue]</span>
    </span>
    <span class="card-arrow">→</span>
  </a></li>
</ul>
<!-- MARKETS:END -->
```

**Page marché — `site/[slug]/index.html`** : la page est sectionnée **par skill** (décision Elena, 2026-06-11). Quatre sections, chacune avec sa propre zone balisée — chaque skill n'écrit QUE dans la sienne :

| Section | Zone | Géré par |
|---|---|---|
| Skill 1 — Read the Market | `RUNS-SKILL1:START` / `END` | Skill 1 (cette skill) |
| Skill 2 — Present the Market | `RUNS-SKILL2:START` / `END` | Skill 2 (`present-the-market`) |
| Skill 3 — Position MY product in the Market | `RUNS-SKILL3:START` / `END` | Skill 3 (à définir) |
| Skill 4 — Strategy recommendation | `RUNS-SKILL4:START` / `END` | Skill 4 (à définir) |

**Affichage utilisateur : « Step N »** (décision Elena, 2026-06-12) — le nommage interne (skills, zones `RUNS-SKILLN`) ne change pas.

Zone d'une skill sans run : `<p class="empty">Pas encore de run — skill en cours de définition.</p>`

Zone Skill 1 — **runs du plus ancien au plus récent : Run 1 en premier, les suivants dessous** (préférence Elena, 2026-06-11 ; vaut pour les sections de toutes les skills). Sous-titre fixe :

```html
<!-- RUNS-SKILL1:START — zone gérée par l'agent, ne pas éditer à la main -->
<ul class="cards">
  <li><a class="card" href="s1-[N]_[date-iso]/">
    <span class="run-num">Run [N]</span>
    <span class="card-body">
      <span class="card-title">[date longue]</span>
      <span class="card-meta">Executive summary · parts de marché · positionnement interactif · sources</span>
    </span>
    <span class="card-arrow">→</span>
  </a></li>
</ul>
<!-- RUNS-SKILL1:END -->
```

## Template de page marché (à créer au premier run d'un marché)

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>[Label du marché] — Veille concurrentielle</title>
  <meta name="description" content="[Une phrase de présentation du marché.]">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../assets/site.css">
</head>
<body>
<script src="../assets/siteheader.js" data-crumb="accueil"></script>
<div class="shell">

  <main>
    <section class="hero">
      <span class="kicker">Marché suivi</span>
      <h1>[Label du marché]</h1>
      <p class="lede">[Une ou deux phrases de présentation du marché — Elena peut les retoucher librement.]</p>
    </section>

    <h2 class="section-title"><span class="sk">Step 1</span> — Read the Market</h2>

    <!-- RUNS-SKILL1:START — zone gérée par l'agent, ne pas éditer à la main -->
    [liste des runs Skill 1 au format défini ci-dessus]
    <!-- RUNS-SKILL1:END -->

    <h2 class="section-title"><span class="sk">Step 2</span> — Present the Market</h2>

    <!-- RUNS-SKILL2:START — zone gérée par l'agent, ne pas éditer à la main -->
    <p class="empty">Pas encore de run — skill en cours de définition.</p>
    <!-- RUNS-SKILL2:END -->

    <h2 class="section-title"><span class="sk">Step 3</span> — Position MY product in the Market</h2>

    <!-- RUNS-SKILL3:START — zone gérée par l'agent, ne pas éditer à la main -->
    <p class="empty">Pas encore de run — skill en cours de définition.</p>
    <!-- RUNS-SKILL3:END -->

    <h2 class="section-title"><span class="sk">Step 4</span> — Strategy recommendation</h2>

    <!-- RUNS-SKILL4:START — zone gérée par l'agent, ne pas éditer à la main -->
    <p class="empty">Pas encore de run — skill en cours de définition.</p>
    <!-- RUNS-SKILL4:END -->
  </main>
</div>
  <script src="../assets/sitefoot.js"></script>
</body>
</html>
```

## Page de run — structure

- **En-tête de site** : injecté par le composant commun `assets/siteheader.js` (source unique, décision Elena 2026-06-13) — placer `<script src="../../assets/siteheader.js" data-crumb="parent" data-parent-label="Marché : [label]" data-parent-href="../"></script>` **en tête de `<body>`**. **Ne plus coder le `<header>` ni son CSS en dur** (le CSS `.siteheader` inline a été retiré des runs). Le composant porte les polices du design system (Hanken Grotesk + IBM Plex Mono, injectées) et une **barre de progression au scroll** ; prévoir `[id] { scroll-margin-top: 70px; }` dans les styles inline du run pour le décalage des ancres sous l'en-tête. Détail du composant en fin de contrat.
- **Autonome** : les styles du rapport sont inline dans le `<head>`, **design system « My Market Data »** (acté 2026-06-14 ; copier le chrome du run canonique `s1-2_2026-06-11` — hero, `.seclabel`/sections, `.dims-grid`, `.assumptions`, `.note`, `.nodata`, `table.lexicon`). Les runs sont figés ; pas de CSS partagé pour le texte du rapport.
- **Conteneur fluide** : `max-width: calc(50vw + 550px)` sur le conteneur principal — marges latérales réduites de moitié par rapport à un conteneur fixe de 1100px, à toute largeur d'écran, sans breakpoint (règle de design validée par Elena le 2026-06-11, cohérente avec les pages parent).
- **Dépendances externes** : `../../assets/positioning-chart-vN.js` et `.css` (versionnés, voir plus bas) ; `../../assets/siteheader.js` (en-tête commun), `../../assets/sitefoot.js` (pied « La méthode » commun) et `../../assets/sitepipeline.js` (barre des étapes du pipeline) — voir sections dédiées en fin de contrat.
- **Ordre du document** : **hero** (design system, 2026-06-15) — chip marché (`.hero__market` : carré coral + « MARCHÉ ÉTUDIÉ » + label), **H1** « Étape 1. » (coral, `.step-no`) + « Lire le marché », **byline** (`.hero__byline` : « Run S1-N, publié le [date] · périmètre … · rapport généré par l'agent ») — puis les hypothèses (`.assumptions`) → Section 1 Executive Summary (`.seclabel` mono + h2) → Section 2a → **Section 2b (graphique interactif — moteur `positioning-chart-vN`, inchangé ; refonte design du graphique prévue séparément avec Elena)** → Annexe A1 Sources → Annexe A2 Lexique. Footer commun injecté par `sitefoot.js` (pas de pied propre au run).
- **Données** : inlinées dans la page (`<script>const RUN_DATA = {...}</script>`) **et** écrites dans `data.json`. Les deux doivent rester identiques (l'inline évite toute requête ; le fichier sert à la Skill 3).
- **Section 2a** : SVG statique généré dans la page — nuage de points, Y = part de marché (%), X = croissance sur la période de référence, nom près de chaque point, valeurs estimées préfixées « ~ », liste visible des acteurs sans données sous le graphique.
- **Tableau de données 2b** : sous le graphique, un tableau de tous les acteurs (triés par part de marché décroissante) × (part, croissance, toutes les dimensions), généré en JS depuis `RUN_DATA` — source unique, aucune divergence possible. Estimations préfixées « ~ », valeurs manquantes « — ».
- **Section 2b** : montage du moteur partagé :

```html
<link rel="stylesheet" href="../../assets/positioning-chart-v1.css">
<div id="positioning-chart"></div>
<script src="../../assets/positioning-chart-v1.js"></script>
<script>
  PositioningChart.mount(document.getElementById('positioning-chart'), RUN_DATA, { lang: RUN_DATA.market.language });
</script>
```

## Assets versionnés

- Le moteur 2b vit dans `site/assets/positioning-chart-vN.{js,css}`.
- Un run référence **la dernière version existante au moment de sa génération**, et la garde pour toujours (runs figés).
- Correctif rétro-compatible → patcher la version en place est permis. Changement de comportement ou d'API → **nouveau fichier `vN+1`** ; ne jamais casser les runs publiés.

## Date du run

La date du run figure dans la **byline du hero** en tête de page et dans `data.json` (`last_updated`). Elle n'est **jamais réécrite** (décision 2026-06-12) — il n'y a plus de `<span data-role="last-updated">` ni de pied propre au run (remplacés par le footer commun `sitefoot.js`).

## Barre pipeline — pages de run (décision Elena, 2026-06-15)

`assets/sitepipeline.js` injecte, **sous le hero de chaque page de run**, la ligne des 4 étapes du pipeline (Lire le marché · Présenter le marché · Positionner mon produit · Recommandation stratégique), l'étape courante mise en évidence. **Rendu commun (source unique) ; cibles des liens propres au run** — remplace l'ancien « step tracker » data-driven propre à la S2.

- **Inclusion** : `<script src="../../assets/sitepipeline.js" data-active="K" [data-href1…4="…"]></script>` dans le `<body>` de **toute page de run** (s'exécute au DOMContentLoaded, se monte sous `.hero`, s'aligne sur la gouttière de contenu).
- **Règle des liens « à la création »** (Elena, 2026-06-15) : à la génération d'un run d'étape K, la skill pose `data-active="K"` et, pour **chaque autre étape**, `data-hrefN` = le **run réellement utilisé** = le **dernier run existant de cette étape à la date de création**. Une étape **sans run à cette date** (typiquement les étapes aval) → **pas de `data-hrefN`** : le composant retombe sur la section d'étape de la page marché `../#step-N`. L'étape courante n'est pas un lien. Les liens d'un run sont donc un **instantané figé à sa création** (ils ne « rattrapent » pas les runs créés ensuite).
- **Prérequis page marché** : ses titres de section portent des ancres `id="step-1"` … `id="step-4"` (cibles de repli) — à conserver lors de toute réécriture de la page marché.
- **Autonome** : CSS en dur (tokens du design + fallbacks), idempotent. `data-active` prioritaire ; à défaut, l'étape est déduite de l'URL (`/[slug]/sK-…/`).
- **Règle** : toute page de run **doit** charger ce script ; ne jamais coder la barre en dur.

## En-tête de site — toutes les pages (décision Elena, 2026-06-13)

`assets/siteheader.js` injecte l'en-tête (logo `My Market Data.` + fil d'Ariane) **en tête du `<body>` de toutes les pages** du sous-domaine. C'est la **source unique** : ne jamais coder le `<header class="siteheader">` ni son CSS en dur (ni dans `site.css`, ni inline dans un run).

- **Inclusion** : `<script src="[base]assets/siteheader.js" [data-*]></script>` placé **en premier dans `<body>`** (synchrone → en-tête inséré avant la peinture, sans flash, sans réservation de hauteur). `[base]` suit la profondeur ; le script déduit lui-même son chemin de base de son propre `src`.
- **Fil d'Ariane piloté par data-\*** sur la balise : rien → logo seul (accueil) ; `data-crumb="accueil"` → « ← Accueil » (pages de profondeur 1 : marché, doc) ; `data-crumb="parent" data-parent-label="…" data-parent-href="…"` → « ← [parent] · Accueil » (runs : `data-parent-label="Marché : [label]"`, `data-parent-href="../"`).
- **Autonome** : porte son propre CSS (valeurs canoniques + fallbacks `--line`), fonctionne même sans `site.css` (runs). Injection idempotente.
- **Règle** : toute page générée (run ou parent) **doit** charger ce script ; aucun header en dur.

## Footer commun — toutes les pages (décision Elena, 2026-06-13)

`assets/sitefoot.js` **génère l'intégralité du footer** (identique partout) : présentation, liens « La méthode » (How it works · Focus on Step 1→4), liens « Marchés étudiés », mentions légales. **Source unique** : ne jamais coder de `<footer>` ni son CSS en dur dans une page.

- **Inclusion** : `<script src="[base]assets/sitefoot.js"></script>` juste avant `</body>`, `[base]` selon la profondeur (`` racine, `../`, `../../`). Le script déduit son chemin de base de son `src` (liens corrects à toute profondeur, en `file://`).
- **Rendu** : bandeau **pleine largeur** injecté en fin de `<body>` (hors du conteneur centré), fond distinct discret (`#f1efe9`, bord haut), responsive (colonnes → pile sous 560px). Autonome (CSS en dur), idempotent. Étant sous le pli, n'impacte pas le rendu au-dessus du pli.
- **Maintenance** : ajouter un nouveau marché = ajouter une entrée `["[slug]/", "[label]"]` au tableau `MARCHES` en tête de `sitefoot.js` (la Skill 1, qui crée un marché, doit le faire — comme elle ajoute la carte sur l'accueil).
- **Règle** : toute page générée (run ou parent) **doit** charger ce script ; aucun footer en dur. Les pages de run n'ont plus de pied propre (le n° de run et la date restent dans la ligne *runmeta* en tête de run).
