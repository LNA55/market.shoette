# Contrats du site — arborescence, zones balisées, page de run, assets

## Arborescence servie (`site/` en local = `market/` sur OVH)

```
site/
├── index.html                       accueil — liste des marchés (zone MARKETS) ; en-tête injecté par siteheader.js, nav « La méthode » au pied par sitefoot.js
├── .htaccess                        règles de cache (HTML revalidé, assets versionnés cachés)
├── how-it-works/                    ┐
├── focus-step-1/ … focus-step-4/  ┘ pages statiques de documentation — domaine d'Elena, l'agent n'y touche JAMAIS sauf demande explicite
├── assets/
│   ├── site.css                     charte des pages parent + documentation (non versionnée — pages non figées)
│   ├── siteheader.js                injecte l'en-tête (logo + fil d'Ariane) en tête de body — chargé par TOUTES les pages (non versionné)
│   ├── sitefoot.js                  injecte la nav « La méthode » au pied de page — chargé par TOUTES les pages (non versionné)
│   ├── positioning-chart-v1.js     moteur du graphique 2b (versionné)
│   └── positioning-chart-v1.css
└── [slug]/
    ├── index.html                   page marché — sections par skill (zones RUNS-SKILL1..4)
    └── s1-[N]_[date]/               un run de la Skill 1 (schéma commun : s[K]-[N]_[date] — s2-, s3-, s4- pour les autres skills)
        ├── index.html               le rapport du run (figé)
        └── data.json                canevas de données du run
```

## Charte des pages parent

Les pages parent (accueil + pages marché) partagent `assets/site.css` — style moderne et chaleureux validé par Elena (2026-06-11) : fond crème `#faf7f1`, encre indigo `#1b1f3b`, accent `#3b3bd8`, cartes blanches arrondies (18px), typographie **Plus Jakarta Sans** (Google Fonts, poids 400/500/700/800). Elles ne sont pas figées : `site.css` peut évoluer librement (contrairement au moteur 2b, versionné). Les pages de run, elles, gardent leurs styles inline (autonomes et figées).

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

  <footer class="sitefoot">
    <span>Généré par l'agent de veille concurrentielle</span>
    <span><a href="../">market.shoette.com</a></span>
  </footer>

</div>
  <script src="../assets/sitefoot.js"></script>
</body>
</html>
```

## Page de run — structure

- **En-tête de site** : injecté par le composant commun `assets/siteheader.js` (source unique, décision Elena 2026-06-13) — placer `<script src="../../assets/siteheader.js" data-crumb="parent" data-parent-label="Marché : [label]" data-parent-href="../"></script>` **en tête de `<body>`**. **Ne plus coder le `<header>` ni son CSS en dur** (le CSS `.siteheader` inline a été retiré des runs). Le composant porte la police Plus Jakarta Sans pour la marque ; prévoir `[id] { scroll-margin-top: 70px; }` dans les styles inline du run pour le décalage des ancres sous l'en-tête. Détail du composant en fin de contrat.
- **Autonome** : les styles du rapport sont inline dans le `<head>` (les runs sont figés ; pas de CSS partagé pour le texte du rapport).
- **Conteneur fluide** : `max-width: calc(50vw + 550px)` sur le conteneur principal — marges latérales réduites de moitié par rapport à un conteneur fixe de 1100px, à toute largeur d'écran, sans breakpoint (règle de design validée par Elena le 2026-06-11, cohérente avec les pages parent).
- **Dépendances externes** : `../../assets/positioning-chart-vN.js` et `.css` (versionnés, voir plus bas) ; `../../assets/siteheader.js` (en-tête commun) et `../../assets/sitefoot.js` (pied « La méthode » commun) — voir sections dédiées en fin de contrat.
- **Ordre du document** : en-tête uniforme des runs (décision Elena, 2026-06-12) — **h1 = label du marché**, puis **`seclabel` « Step 1 — Read the Market »**, puis la **ligne runmeta inchangée** (« Run N — date · Périmètre … · Rapport généré par l'agent… »), puis les hypothèses → Section 1 Executive Summary → Section 2a → Section 2b → Annexe A1 Sources → Annexe A2 Lexique → pied de page (« généré par l'agent… » + `<span data-role="last-updated">[date]</span>`).
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

## Champ « dernière mise à jour »

```html
<span data-role="last-updated">2026-06-11</span>
```

Seul élément d'un run publié que la Skill 3 a le droit de réécrire.

## En-tête de site — toutes les pages (décision Elena, 2026-06-13)

`assets/siteheader.js` injecte l'en-tête (logo `My Market Data.` + fil d'Ariane) **en tête du `<body>` de toutes les pages** du sous-domaine. C'est la **source unique** : ne jamais coder le `<header class="siteheader">` ni son CSS en dur (ni dans `site.css`, ni inline dans un run).

- **Inclusion** : `<script src="[base]assets/siteheader.js" [data-*]></script>` placé **en premier dans `<body>`** (synchrone → en-tête inséré avant la peinture, sans flash, sans réservation de hauteur). `[base]` suit la profondeur ; le script déduit lui-même son chemin de base de son propre `src`.
- **Fil d'Ariane piloté par data-\*** sur la balise : rien → logo seul (accueil) ; `data-crumb="accueil"` → « ← Accueil » (pages de profondeur 1 : marché, doc) ; `data-crumb="parent" data-parent-label="…" data-parent-href="…"` → « ← [parent] · Accueil » (runs : `data-parent-label="Marché : [label]"`, `data-parent-href="../"`).
- **Autonome** : porte son propre CSS (valeurs canoniques + fallbacks `--line`), fonctionne même sans `site.css` (runs). Injection idempotente.
- **Règle** : toute page générée (run ou parent) **doit** charger ce script ; aucun header en dur.

## Pied de page « La méthode » — toutes les pages (décision Elena, 2026-06-13)

`assets/sitefoot.js` injecte la navigation « La méthode » (How it works · Focus on Step 1→4) **en tête du pied de page de toutes les pages** du sous-domaine — pages parent (`footer.sitefoot`) comme pages de run (`footer.report`). C'est la **source unique** : ne jamais coder ces liens en dur dans une page.

- **Inclusion** : `<script src="[base]assets/sitefoot.js"></script>` juste avant `</body>`, où `[base]` suit la profondeur de la page (`` à la racine, `../` en profondeur 1, `../../` pour un run). Le script déduit lui-même son chemin de base de son propre `src` ; les liens se résolvent donc correctement à toute profondeur (et en `file://`).
- **Autonome** : il porte son propre CSS (variables `--muted`/`--accent`/`--line` + fallbacks) et fonctionne même sur les pages de run, qui ne chargent pas `site.css`. Rien à ajouter dans les styles inline d'un run. Injection idempotente (jamais deux fois).
- **Règle** : toute page générée par une skill (run ou page parent) **doit** charger ce script.
