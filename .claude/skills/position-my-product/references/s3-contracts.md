# Contrats de la Skill 3 — note de run, data.json, enrichissement du run S1, zone balisée

## Page de run S3 (la note) — structure

> **Design system « My Market Data » (acté 2026-06-14).** Même gabarit visuel que la S2/S4 :
> palette chaude (papier `#faf8f4`, marque coral `#F4684F`), système de signaux, typos
> Hanken Grotesk / IBM Plex Mono / Instrument Serif. **Run canonique : `apps-perte-de-poids/s3-1_2026-06-12/`** —
> copier verbatim son `<style>` inline et restyler ; seules les données changent. La note S3 est en
> **HTML statique** (pas de rendu JS) ; `RUN_S3_DATA` + `data.json` restent le miroir de données.

- **Autonome et figée** : tout le CSS du design system est **inline dans le `<head>`** ; conteneur `.shell`
  (`max-width:1180px`). Charge `../../assets/siteheader.js` en tête de `<body>` (topbar + barre de progression)
  et `../../assets/sitefoot.js` juste avant `</body>` (footer commun) ; **`../../assets/sitepipeline.js`** (barre des 4 étapes, injectée sous le hero — cf. contrats Skill 1). **Ne jamais coder header/footer/barre en dur.**
- **Ordre du document** :
  1. **siteheader.js** : `<script src="../../assets/siteheader.js" data-crumb="parent" data-parent-label="Marché : [label]" data-parent-href="../"></script>`.
  2. **Hero** (`.hero`) : chip marché (`.hero__market` — carré coral + « MARCHÉ ÉTUDIÉ » + label) ; **H1** « Étape 3. » (en coral, `.step-no`) + « Positionner mon produit » ; **byline** « Run S3-[N], publié le [date longue] — à partir des [run S1] et [run S2] » (+ avertissement de fraîcheur si le run S1 a plus de 3 mois) avec la mention que les valeurs du projet sont **déclaratives** ; ligne `.hero__proj` « Projet positionné » → lien vers le site du projet.
  3. **Section 1 — Le projet** (`.section` + `.prose`) : nom, 2-3 lignes de description, lien vers la source ; rappel que les valeurs sont déclaratives (pastille `.tag-decl`).
  4. **Section 2 — Le positionnement** (`.def`) : une ligne clé/valeur par dimension du graphique 2b — dimension (`.def__key`) → valeur (`.big`, conventions `~` / pastille `.tag-decl` « déclaré ») → justification (`.rationale`). Part de marché toujours `0 %` (nouveau projet — règle Elena, 2026-06-12). Sous la table, **la carte-lien** `.chart-link` vers le graphique enrichi (`../s1-[n]_[date]/#s2b`).
  5. **Section 3 — Analyse du graphique** (`.prose`) : paragraphe (atterrissage, voisins, espaces vides) + **clés de lecture** (`.keys`, puces coral) + encart **« Configuration de lecture recommandée »** (`.reco`).
  6. **Section 4 — Sources** (`.sources`, numérotées) : site du projet (déclaratif), runs S1/S2, cadrage Elena.
  7. **sitefoot.js** (footer commun ; pas de pied propre — n° + date dans la byline).
- **Données** : inlinées (`const RUN_S3_DATA = {...}`) et écrites dans `data.json` — strictement identiques (schéma v1 inchangé).

## `data.json` S3 — schéma (v1)

```json
{
  "schema_version": 1,
  "skill": "position-my-product",
  "market": { "slug": "...", "label": "...", "language": "fr" },
  "run": { "number": 1, "date": "2026-06-12" },
  "source_runs": {
    "s1": { "number": 2, "date": "2026-06-11", "path": "../s1-2_2026-06-11/", "age_days": 1, "freshness_warning": false },
    "s2": { "number": 1, "date": "2026-06-11", "path": "../s2-1_2026-06-11/" }
  },
  "project": {
    "id": "slug-du-projet",
    "name": "Nom du projet",
    "source_url": "https://w.shoette.com/",
    "summary": "Description en 2-3 lignes.",
    "extra_info_from_elena": null
  },
  "positioning": {
    "market_share_pct": { "value": 0, "estimated": false, "note": "nouveau projet — pas encore sur le marché" },
    "growth_pct": null,
    "dimensions": {
      "[dim_id]": { "value": 0, "estimated": false, "declared": true, "rationale": "justification en une ligne" }
    }
  },
  "enriched_chart": { "href": "../s1-2_2026-06-11/#s2b", "enriched_on": "2026-06-12" },
  "analysis": {
    "paragraph": "Le paragraphe d'analyse.",
    "reading_keys": ["Une clé de lecture par élément."],
    "recommended_view": "Configuration de calques/canaux recommandée pour lire le projet."
  },
  "sources": [
    { "id": 1, "title": "Site du projet", "url": "https://w.shoette.com/", "accessed": "2026-06-12", "declared": true },
    { "id": 2, "title": "Run S1-2 du 2026-06-11", "publisher": "market.shoette.com", "url": "../s1-2_2026-06-11/", "accessed": "2026-06-12", "from_source_run": true }
  ],
  "last_updated": "2026-06-12"
}
```

Notes :
- `source_runs.s2` est toujours renseigné : **un run S2 sur le même marché est requis pour lancer la Skill 3** (règle d'Elena, 2026-06-12) — sans lui, la skill s'arrête et propose de lancer la Skill 2 d'abord.
- `positioning.dimensions` reprend exactement les `dim_id` du run S1 source — mêmes identifiants, mêmes échelles.
- `growth_pct` est `null` (non applicable à un nouveau projet) ; `market_share_pct.value` vaut toujours `0`.

## Enrichissement du run S1 — contrat (périmètre strict, additif uniquement)

**Unique exception au principe « runs figés » (actée 2026-06-12).** Trois retouches, rien d'autre — appliquées à l'identique dans le bloc `RUN_DATA` inline de la page **et** dans le `data.json` du run S1 :

### 1. L'entrée projet dans `players[]` (ajout en fin de liste)

```json
{
  "id": "slug-du-projet",
  "name": "Nom du projet",
  "is_mine": true,
  "added_by_run": { "skill": "position-my-product", "run": "s3-1_2026-06-12", "date": "2026-06-12" },
  "market_share_pct": { "value": 0, "estimated": false, "note": "nouveau projet — ajouté par la Skill 3" },
  "growth_pct": { "value": null, "estimated": false, "note": "non applicable (nouveau projet)" },
  "dimensions": {
    "[dim_id]": { "value": 0, "estimated": false, "declared": true, "note": "justification courte" }
  },
  "card": {
    "summary": "Description du projet en 2-3 lignes.",
    "facts": ["…", "Source : https://w.shoette.com/ (déclaratif)", "Positionné par le Run S3-1 du 2026-06-12"],
    "source_ids": []
  }
}
```

- `card.source_ids` reste vide : **on n'ajoute rien aux `sources` du run S1** (hors périmètre). Le lien source du projet vit dans `card.facts`.
- Le projet hérite des `dim_id` existants — ne jamais créer de dimension dans le run S1.
- Grâce à la source unique (`RUN_DATA` → graphique + tableau générés côté client), aucune autre édition de la page n'est nécessaire pour le faire apparaître.

### 2. La mention d'enrichissement (page du run S1)

La date existante ne change **jamais**. À la suite du span existant, dans le même bloc :

```html
<span>Dernière mise à jour : <span data-role="last-updated">2026-06-11</span></span>
<span data-role="s3-enrichment">Graphique enrichi des infos sur le nouveau projet [Nom], le [date du run S3]</span>
```

Une mention par projet ; re-run du même projet → la mention du projet est mise à jour (pas dupliquée).

### 3. Le bloc `enrichments[]` (data.json du run S1)

```json
"enrichments": [
  {
    "skill": "position-my-product",
    "run": "s3-1_2026-06-12",
    "date": "2026-06-12",
    "player_id": "slug-du-projet",
    "mention": "Graphique enrichi des infos sur le nouveau projet [Nom], le [date]"
  }
]
```

(Créer le bloc au premier enrichissement ; une entrée par projet, mise à jour en re-run.)

**Interdits** (liste non exhaustive — tout ce qui n'est pas listé ci-dessus est interdit) : modifier une valeur, note ou card d'un concurrent ; toucher aux textes, à la section 2a, aux annexes, aux `sources`, à `last_updated` ; ajouter ou modifier une dimension ; retoucher le HTML hors de la mention.

## Zone `RUNS-SKILL3` — format

Runs du plus ancien au plus récent (Run 1 en premier). Même format de carte que les zones Skill 1/2 :

```html
<!-- RUNS-SKILL3:START — zone gérée par l'agent, ne pas éditer à la main -->
<ul class="cards">
  <li><a class="card" href="s3-[N]_[date-iso]/">
    <span class="run-num">Run [N]</span>
    <span class="card-body">
      <span class="card-title">[date longue]</span>
      <span class="card-meta">Projet « [nom] » positionné sur le graphique 2b · note d'analyse</span>
    </span>
    <span class="card-arrow">→</span>
  </a></li>
</ul>
<!-- RUNS-SKILL3:END -->
```

État vide (avant le premier run) : `<p class="empty">Pas encore de run — skill en cours de définition.</p>`
