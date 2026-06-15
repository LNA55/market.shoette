# Contrats de la Skill 2 — page de run, data.json, zone balisée

> **Design system « My Market Data » (acté 2026-06-14).** La page de run S2 suit le
> gabarit de rapport livré par Claude Design : palette chaude (papier `#faf8f4`,
> marque coral `#F4684F`), système de signaux (bleu = fait, rouge = menace/choc,
> ambre = opportunité disputée), typographies **Hanken Grotesk** (UI/corps), **IBM
> Plex Mono** (étiquettes/méta), **Instrument Serif** (questions des frameworks, en
> italique). **Run de référence canonique : `apps-perte-de-poids/s2-1_2026-06-11/`** —
> tout nouveau run S2 **copie verbatim** son bloc `<style>` inline (tokens + corps +
> 7 diagrammes + responsive) et son script de rendu ; seules les **données** changent.

## Page de run S2 — structure

- **Autonome et figée** : tout le CSS du design system est **inline dans le `<head>`**
  (run = artefact figé, indépendant de tout asset partagé pour son corps). Charge les
  Google Fonts du design (Hanken Grotesk + IBM Plex Mono + Instrument Serif). Conteneur
  fluide `.shell` (`max-width:1180px`, gouttière `clamp(20px,5vw,56px)`).
- **En-tête et pied = composants communs évolués** (design system, source unique) :
  `../../assets/siteheader.js` en tête de `<body>` (topbar marque + fil d'Ariane +
  **barre de progression au scroll**, polices du design injectées) et
  `../../assets/sitefoot.js` juste avant `</body>` (footer 3 colonnes du design).
  **Ne jamais coder header/footer ni leur CSS en dur.**
- **Ordre du document** :
  1. **siteheader.js** (`data-crumb="parent" data-parent-label="Marché : [label]" data-parent-href="../"`).
  2. **`<a id="top">`** puis **Hero** (`.hero`) : chip marché (carré coral + label « MARCHÉ ÉTUDIÉ »
     + nom du marché), **H1** « Étape [K]. » (en coral, `.step-no`) + titre de l'étape, **byline**
     (« Run S[K]-[N], publié le [date longue] à partir du [lien run S1 source] — [fraîcheur] »
     avec point vert « données du jour » si `age_days==0`, avertissement ambre si `freshness_warning`),
     puis **la barre pipeline** (composant commun `assets/sitepipeline.js`, injecté sous le hero — cf. contrats Skill 1 ; remplace l'ancien `.track` data-driven).
  3. **Bande KPI « d'un coup d'œil »** (`.glance`) : **4 cartes** (`.kpi`) — 3 chiffres-clés
     structurants + 1 carte « choc » (`.kpi--shock`, fond rouge). Dérivées des KPI saillants du run.
  4. **Nav d'ancrage** (`.secnav`) : rail horizontal collant sous le header (scrollable sur tous
     les écrans), une puce par section + une par framework, scroll-spy (`.navlink.is-active` coral).
  5. **Section 1 — Définition du marché** (`.def`) : table clé/valeur (mêmes 6 lignes fixes V1, cf.
     SKILL.md Step 2) — Définition · Sous-secteurs · Taille mondiale · Part par sous-secteur (puces
     `.lead-dot` + part `.share`) · Acteur dominant (profit « en perte » en `.t-risk`) · Géographie ;
     note de bas de table (`~` / `—`).
  6. **Section 2 — Choix des frameworks** (`.method`) : intro implicite (purpose de section) puis
     une **ligne par remarque** (`.method__row`) : observation du marché → **pastille framework**
     (`.method__fw`, wash bleu). Frameworks retenus uniquement.
  7. **Section 3 — Le marché, framework par framework** (`.fw`) : une **carte** (`.fwc`) par framework
     retenu, **anatomie identique** — index lettré (A, B, C…), **nom lié** à `/focus-step-2/#[ancre]`,
     **badge** optionnel (`.badge--qual` ambre = « lecture qualitative » ; `.badge--shock` rouge),
     **question-objectif** en serif italic (`.fwc__q.serif-q`, champ `objective` verbatim de la doc),
     paragraphe d'analyse, **diagramme CSS** spécifique au marché (`.fwc__viz`), **légende** mono
     centrée (`.fwc__cap`, champ `caption`).
  8. **Section 4 — Sources** (`.sources`) : liste numérotée (`counter` decimal-leading-zero), S1 source
     distinguée des compléments en ligne.
  9. **Légende des signaux** (`.legend.legend--foot`) : bandeau centré « Clé de lecture » en bas de
     contenu (bleu = fait · rouge = menace/choc · ambre = opportunité disputée · `~` = estimé).
  10. **sitefoot.js** (footer commun ; le run n'a plus de pied propre — n° + date sont dans la byline).
- **Mécanique data-driven** : `const RUN_S2_DATA = {…}` + un script de rendu construisent hero, glance,
  secnav, def, method, cartes de frameworks et sources depuis les données. Les **7 diagrammes** sont des
  **gabarits CSS remplis avec les données réelles du run**, placés dans `<div id="viz-templates" hidden>`
  avec `data-viz="[id]"`, **montés** par le rendu dans chaque carte (`.fwc__viz`). Copier le script de
  rendu verbatim du run canonique ; seuls les diagrammes (chiffres/positions) et `RUN_S2_DATA` changent.
- **Données** : inlinées (`RUN_S2_DATA`) **et** écrites dans `data.json` — strictement identiques.

### Les 7 composants de diagramme (CSS pur, classes du design system)

Chaque diagramme est reconstruit en CSS/HTML (aucune lib), rempli des données du run :

| `data-viz` / `id` | Composant | Construction |
|---|---|---|
| `tam-sam-som` | `.tss` | 3 cercles concentriques (TAM/SAM/SOM) + 3 lignes de valeurs |
| `porter` | `.porter` | grille 3×3 : centre `.force--center` (bleu, Rivalité), 4 forces autour, substitut en `.force--shock` (rouge) |
| `value-chain` | `.vchain` | 3 chevrons `clip-path` (clair→foncé) + notes `.vchain__notes` + encart ambre `.movement` |
| `vitalite` | `.tl` | axe horizontal + nœuds alternés haut/bas (`.tl__ev--up/--down`), un nœud `.tl__ev--shock` rouge |
| `pestel` | `.pestel` | 6 cartes lettrées `.pcard` (3×2) ; choc en `.pcard--shock`, non-significatif en `.pcard--mute` |
| `perceptual-map` | `.pmap` | plan 2 axes + bulles `.bub` (taille = échelle) positionnées en `left`/`bottom` % + zone `.zone` ambre |
| `ge-mckinsey` | `.nbox` | grille 3×3 colorée invest→sélectivité→récolte + `.chip` placées + légende `.nbox__leg` |

> Ancres de `id`/`doc_anchor` (doc page) : `tam-sam-som`, `porter`, `value-chain`, `bcg`,
> `perceptual-map`, `vitalite`, `pestel`, `ge-mckinsey`. Jamais `swot` (hors périmètre).

## `data.json` S2 — schéma (v2)

```json
{
  "schema_version": 2,
  "skill": "present-the-market",
  "market": { "slug": "...", "label": "...", "language": "fr" },
  "step": { "number": 2, "title": "Présenter le marché" },
  "run": { "number": 1, "date": "2026-06-12" },
  "source_run": {
    "skill": "read-the-market", "number": 2, "date": "2026-06-11",
    "path": "s1-2_2026-06-11/", "age_days": 1, "freshness_warning": false
  },
  "pipeline": [
    { "name": "Lire le marché", "href": "../s1-2_2026-06-11/", "state": "done" },
    { "name": "Présenter le marché", "href": "", "state": "active" },
    { "name": "Positionner mon produit", "href": "../s3-1_2026-06-12/", "state": "todo" },
    { "name": "Recommandation stratégique", "href": "#", "state": "todo" }
  ],
  "glance": [
    { "label": "Marché (SAM)", "value": "2,2", "unit": "Md$", "note": "..." },
    { "label": "Croissance", "value": "+11–13", "unit": "%/an", "note": "..." },
    { "label": "Concentration", "value": "~60", "unit": "%", "note": "..." },
    { "label": "Choc ...", "value": "12,4", "unit": "%", "note": "...", "shock": true }
  ],
  "kpis": {
    "definition": "Définition du marché en une phrase.",
    "sub_sectors": [
      { "name": "...", "size": { "value": "~1,35", "unit": "Md$", "year": 2025, "estimated": true }, "share_pct": { "value": 61, "estimated": true } }
    ],
    "rest_of_market_share_pct": { "value": 9, "estimated": true },
    "sub_sector_method_note": "Comment la ventilation a été estimée (note sous la table des parts).",
    "global_size": { "value": "~2,2", "unit": "Md$", "year": 2025, "estimated": true, "perimeter_note": "..." },
    "dominant_incumbent": {
      "name": "...", "founded": 1963,
      "revenue": { "value": 748, "unit": "M$", "period_note": "moyenne FY2024-FY2025", "estimated": false },
      "profit_status": "en perte | rentable | à l'équilibre | information introuvable",
      "profit_figure": { "value": -62.1, "unit": "M$", "period_note": "...", "estimated": false }
    },
    "geography": { "type": "mondial | régional | local", "detail": "précision (région, pays)" }
  },
  "methodology": {
    "intro": "Ligne d'introduction (les remarques du run S1 ont guidé la sélection).",
    "rows": [
      { "observation": "Fait du marché (B2C abonnement, chaîne courte…)", "framework": "Chaîne de valeur · unit economics" }
    ]
  },
  "frameworks": [
    {
      "id": "porter",
      "name": "Porter — 5 forces",
      "nav": "Porter",
      "status": "activé | dégradé",
      "doc_anchor": "porter",
      "badge": { "type": "shock | qual", "label": "…" },
      "objective": "« ... » — la question du framework, verbatim de la page de documentation",
      "analysis": "Le paragraphe d'analyse du marché sous cet angle.",
      "caption": "Légende mono d'une ligne sous le diagramme."
    }
  ],
  "sources": [
    { "id": 1, "title": "Run S1-2 du 2026-06-11", "publisher": "market.shoette.com", "url": "../s1-2_2026-06-11/", "accessed": "2026-06-12", "from_source_run": true }
  ],
  "last_updated": "2026-06-12"
}
```

Notes :
- `step.number` = numéro d'étape (2 pour la Skill 2) ; la byline affiche `S[step.number]-[run.number]`.
- `glance` = **4 cartes** de chiffres-clés saillants (3 normales + 1 `"shock": true`), dérivées des KPI/analyses
  du run — pas une simple recopie de la table : on choisit les 4 nombres qui résument le marché.
- `pipeline` *(legacy — désormais optionnel : la barre des étapes est le composant commun `sitepipeline.js`, auto-configuré ; ce champ n'est plus rendu)* = les 4 étapes pour le tracker. `href` = dernier run de chaque étape (`""` pour l'étape courante,
  `"#"` si aucun run) ; `state` ∈ `done | active | todo` (`todo` + `href:"#"` quand l'étape n'a pas encore de run).
- `methodology.rows` = mapping **observation → framework** (un objet par remarque), frameworks retenus seulement.
- `frameworks[].badge` = `null`, ou `{type:"shock"|"qual", label}` (qual ⇔ `status:"dégradé"`).
- `frameworks[].nav` = libellé court pour la puce de la nav d'ancrage. L'index lettré (A, B…) est dérivé du rang.
- `profit_status` toujours rempli ; `profit_figure` = `null` quand introuvable. Parts bouclées à ~100 %.

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
