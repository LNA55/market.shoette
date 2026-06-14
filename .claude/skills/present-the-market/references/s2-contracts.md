# Contrats de la Skill 2 — page de run, data.json, zone balisée

## Page de run S2 — structure

- **Autonome et figée** : styles inline dans le `<head>`, même charte de rapport que les runs S1 (encre `#1e293b`, accent `#2563eb`, boîtes douces) ; conteneur fluide `max-width: calc(50vw + 550px)`. Charge `../../assets/siteheader.js` en tête de `<body>` (en-tête commun) et `../../assets/sitefoot.js` juste avant `</body>` (footer commun) — composants communs au sous-domaine, cf. contrats Skill 1.
- **Ordre du document** :
  1. **En-tête de site** : injecté par le composant commun `assets/siteheader.js` (source unique) — placer `<script src="../../assets/siteheader.js" data-crumb="parent" data-parent-label="Marché : [label]" data-parent-href="../"></script>` en tête de `<body>`. **Ne jamais coder le header ni son CSS en dur** (cf. contrats Skill 1).
  2. En-tête uniforme des runs (décision Elena, 2026-06-12) : **h1 = label du marché**, puis **`seclabel` « Step 2 — Present the Market »**, puis la **ligne runmeta inchangée** — « Run S2-[N] — [date] · Source : [lien vers le run S1 source avec sa date] (+ avertissement de fraîcheur si le run source a plus de 3 mois) »
  3. **Section 1 — Tableau des KPI business** (structure fixe V1, 6 rangées)
  4. **Section 2 — « Remarques sur le marché et choix de la méthodologie d'analyse adaptée »** : une ligne d'intro puis une liste structurée, un élément par remarque (fait du marché → choix méthodologique induit) ; frameworks retenus uniquement
  5. **Section 3 — Le marché sous l'angle de chaque framework** : un bloc par framework retenu — titre lié à sa fiche `/focus-step-2/#[ancre]` (badge si « dégradé en qualitatif »), **phrase-objectif du framework** en italique accent (champ `objective`, reprise verbatim de la page de documentation), paragraphe d'analyse, puis **visualisation spécifique au marché quand pertinent** : le schéma canonique rempli avec les données réelles du run (SVG inline, ~660px de large, légende d'une ligne). Mécanique de page : SVG dans `<div id="viz-templates" hidden>` avec `data-viz="[id]"` + `data-caption`, montés par le rendu JS dans chaque bloc.
  6. Sources (S1 source distinguée des compléments en ligne)
  7. **Footer commun** : injecté par `sitefoot.js`. Le run n'a **plus de pied propre** (numéro + date dans la ligne *runmeta* en tête).
- **Données** : inlinées (`const RUN_S2_DATA = {...}`) et écrites dans `data.json` — strictement identiques.

## `data.json` S2 — schéma (v1)

```json
{
  "schema_version": 1,
  "skill": "present-the-market",
  "market": { "slug": "...", "label": "...", "language": "fr" },
  "run": { "number": 1, "date": "2026-06-12" },
  "source_run": {
    "skill": "read-the-market",
    "number": 2,
    "date": "2026-06-11",
    "path": "s1-2_2026-06-11/",
    "age_days": 1,
    "freshness_warning": false
  },
  "kpis": {
    "definition": "Définition du marché en une phrase.",
    "sub_sectors": [
      {
        "name": "...",
        "size": { "value": 0, "unit": "Md$", "year": 2025, "estimated": true },
        "share_pct": { "value": 0, "estimated": true }
      }
    ],
    "rest_of_market_share_pct": { "value": 0, "estimated": true },
    "global_size": { "value": "2,1-5,8", "unit": "Md$", "year": 2025, "estimated": true, "perimeter_note": "périmètres analystes divergents" },
    "dominant_incumbent": {
      "name": "...",
      "founded": 1963,
      "revenue": { "value": 0, "unit": "M$", "period_note": "moyenne FY2024-FY2025", "estimated": false },
      "profit_status": "en perte | rentable | à l'équilibre | information introuvable",
      "profit_figure": { "value": 0, "unit": "M$", "period_note": "...", "estimated": false }
    },
    "geography": { "type": "mondial | régional | local", "detail": "précision (région, pays)" }
  },
  "selection_criteria": {
    "intro": "Ligne d'introduction de la section 2.",
    "points": ["Une remarque par élément : fait du marché → choix méthodologique induit.", "..."]
  },
  "frameworks": [
    {
      "id": "porter",
      "name": "Porter — 5 forces",
      "status": "activé | dégradé",
      "doc_anchor": "porter",
      "objective": "« Ce marché est-il structurellement rentable ? Qui a le pouvoir ? » — la question du framework, verbatim de la page de documentation",
      "analysis": "Le paragraphe d'analyse du marché sous cet angle."
    }
  ],
  "sources": [
    { "id": 1, "title": "Run S1-2 du 2026-06-11", "publisher": "market.shoette.com", "url": "../s1-2_2026-06-11/", "accessed": "2026-06-12", "from_source_run": true },
    { "id": 2, "title": "...", "publisher": "...", "url": "https://...", "accessed": "2026-06-12", "from_source_run": false }
  ],
  "last_updated": "2026-06-12"
}
```

Notes :
- `profit_status` est toujours rempli (les 4 valeurs possibles) ; `profit_figure` est `null` quand introuvable.
- `frameworks[].id` et `doc_anchor` = les ancres de la page de documentation : `tam-sam-som`, `porter`, `value-chain`, `bcg`, `perceptual-map`, `vitalite`, `pestel`, `ge-mckinsey`. Jamais `swot` (hors périmètre).
- Les parts (`sub_sectors[].share_pct` + `rest_of_market_share_pct`) doivent boucler à ~100 %.

## Zone `RUNS-SKILL2` — format

Runs du plus ancien au plus récent (Run 1 en premier). Même format de carte que la zone Skill 1 :

```html
<!-- RUNS-SKILL2:START — zone gérée par l'agent, ne pas éditer à la main -->
<ul class="cards">
  <li><a class="card" href="s2-[N]_[date-iso]/">
    <span class="run-num">Run [N]</span>
    <span class="card-body">
      <span class="card-title">[date longue]</span>
      <span class="card-meta">Tableau KPI business · frameworks pertinents · sources</span>
    </span>
    <span class="card-arrow">→</span>
  </a></li>
</ul>
<!-- RUNS-SKILL2:END -->
```

État vide (avant le premier run) : `<p class="empty">Pas encore de run — skill en cours de définition.</p>`
