# Contrats du site — arborescence, zones balisées, page de run, assets

## Arborescence servie (`site/` en local = `market/` sur OVH)

```
site/
├── index.html                       accueil — liste des marchés (zone MARKETS)
├── assets/
│   ├── positioning-chart-v1.js     moteur du graphique 2b (versionné)
│   └── positioning-chart-v1.css
└── [slug]/
    ├── index.html                   page marché — liste des runs (zone RUNS)
    └── [N]_[date]/
        ├── index.html               le rapport du run (figé)
        └── data.json                canevas de données du run
```

## Zones balisées — pages parent

Réécrire **uniquement** entre les balises. Tout le reste de ces pages appartient à Elena. Les pages parent sont en français, quel que soit la langue des runs.

**Accueil — `site/index.html`** (marchés par ordre alphabétique) :

```html
<!-- MARKETS:START — zone gérée par l'agent, ne pas éditer à la main -->
<ul>
  <li><a href="chaussure/">Chaussure</a> — 2 runs, dernier le 11/09/2026</li>
</ul>
<!-- MARKETS:END -->
```

**Page marché — `site/[slug]/index.html`** (runs du plus récent au plus ancien) :

```html
<!-- RUNS:START — zone gérée par l'agent, ne pas éditer à la main -->
<ul>
  <li><a href="2_2026-09-11/">Run 2 — 11/09/2026</a></li>
  <li><a href="1_2026-06-11/">Run 1 — 11/06/2026</a></li>
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
</head>
<body>
  <p><a href="../">← Tous les marchés</a></p>
  <h1>[Label du marché]</h1>
  <p>[Une phrase de présentation du marché — Elena peut la retoucher librement.]</p>

  <!-- RUNS:START — zone gérée par l'agent, ne pas éditer à la main -->
  <ul>
    <li><a href="1_[date]/">Run 1 — [date]</a></li>
  </ul>
  <!-- RUNS:END -->
</body>
</html>
```

## Page de run — structure

- **Autonome** : les styles du rapport sont inline dans le `<head>` (les runs sont figés ; pas de CSS partagé pour le texte).
- **Seules dépendances externes** : `../../assets/positioning-chart-vN.js` et `.css` (versionnés, voir plus bas).
- **Ordre du document** : en-tête (label du marché, run N, date, hypothèses) → Section 1 Executive Summary → Section 2a → Section 2b → Annexe A1 Sources → Annexe A2 Lexique → pied de page (« généré par l'agent… » + `<span data-role="last-updated">[date]</span>`).
- **Données** : inlinées dans la page (`<script>const RUN_DATA = {...}</script>`) **et** écrites dans `data.json`. Les deux doivent rester identiques (l'inline évite toute requête ; le fichier sert à la Skill 3).
- **Section 2a** : SVG statique généré dans la page — nuage de points, Y = part de marché (%), X = croissance sur la période de référence, nom près de chaque point, valeurs estimées préfixées « ~ », liste visible des acteurs sans données sous le graphique.
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
