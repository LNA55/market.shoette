# Contrats du site — arborescence, zones balisées, page de run, assets

## Arborescence servie (`site/` en local = `market/` sur OVH)

```
site/
├── index.html                       accueil — liste des marchés (zone MARKETS)
├── assets/
│   ├── site.css                     charte des pages parent (non versionnée — pages non figées)
│   ├── positioning-chart-v1.js     moteur du graphique 2b (versionné)
│   └── positioning-chart-v1.css
└── [slug]/
    ├── index.html                   page marché — liste des runs (zone RUNS)
    └── [N]_[date]/
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

**Page marché — `site/[slug]/index.html`** (runs du plus récent au plus ancien ; sous-titre fixe) :

```html
<!-- RUNS:START — zone gérée par l'agent, ne pas éditer à la main -->
<ul class="cards">
  <li><a class="card" href="[N]_[date-iso]/">
    <span class="run-num">Run [N]</span>
    <span class="card-body">
      <span class="card-title">[date longue]</span>
      <span class="card-meta">Executive summary · parts de marché · positionnement interactif · sources</span>
    </span>
    <span class="card-arrow">→</span>
  </a></li>
</ul>
<!-- RUNS:END -->
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
<div class="shell">

  <header class="topbar">
    <a class="brand" href="../">market<span class="dot">.</span>shoette</a>
    <a class="crumb" href="../">← Tous les marchés</a>
  </header>

  <main>
    <section class="hero">
      <span class="kicker">Marché suivi</span>
      <h1>[Label du marché]</h1>
      <p class="lede">[Une ou deux phrases de présentation du marché — Elena peut les retoucher librement.]</p>
    </section>

    <h2 class="section-title">Runs</h2>

    <!-- RUNS:START — zone gérée par l'agent, ne pas éditer à la main -->
    [liste des runs au format défini ci-dessus]
    <!-- RUNS:END -->
  </main>

  <footer class="sitefoot">
    <span>Généré par l'agent de veille concurrentielle</span>
    <span><a href="../">market.shoette.com</a></span>
  </footer>

</div>
</body>
</html>
```

## Page de run — structure

- **Autonome** : les styles du rapport sont inline dans le `<head>` (les runs sont figés ; pas de CSS partagé pour le texte).
- **Seules dépendances externes** : `../../assets/positioning-chart-vN.js` et `.css` (versionnés, voir plus bas).
- **Ordre du document** : en-tête (label du marché, run N, date, hypothèses) → Section 1 Executive Summary → Section 2a → Section 2b → Annexe A1 Sources → Annexe A2 Lexique → pied de page (« généré par l'agent… » + `<span data-role="last-updated">[date]</span>`).
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
