# Contrats de la Skill 3 — note de run, data.json, enrichissement du run S1, zone balisée

## Page de run S3 (la note) — structure

- **Autonome et figée** : styles inline dans le `<head>`, même charte de rapport que les runs S1/S2 (encre `#1e293b`, accent `#2563eb`, boîtes douces) ; conteneur fluide `max-width: calc(50vw + 550px)`.
- **Ordre du document** :
  1. En-tête de site sticky (uniforme sur le sous-domaine) : logo My Market Data (lien accueil) + fil d'Ariane « ← Marché : [label] · Accueil » — structure, CSS et géométrie strictement identiques aux runs existants.
  2. En-tête uniforme des runs : **h1 = label du marché**, puis **`seclabel` « Step 3 — Position MY product »**, puis la **ligne runmeta** : « Run S3-[N] — [date] · Projet : [nom] · Source : [lien run S1 avec sa date] (+ [lien run S2 avec sa date] si présent) » + avertissement de fraîcheur si le run S1 source a plus de 3 mois.
  3. **Section 1 — Le projet** : nom, 2-3 lignes de description, lien vers la source (site du projet) quand elle existe. Mentionner que les valeurs du projet sont déclaratives (site du projet / Elena), à la différence des valeurs sourcées des concurrents.
  4. **Section 2 — Le positionnement** : tableau compact — une ligne par dimension du graphique 2b : nom de la dimension → valeur attribuée (conventions `~` estimé, « déclaré ») → justification en une ligne. La part de marché vaut toujours `0 %` (nouveau projet — règle d'Elena, 2026-06-12). Sous le tableau, **le lien vers le graphique enrichi** : `../s1-[n]_[date]/#s2b`, libellé explicite (« Voir le projet sur le graphique interactif du marché »).
  5. **Section 3 — Analyse du graphique** : un paragraphe — où le projet atterrit, voisins immédiats, espaces vides, clés de lecture — et la **configuration de lecture recommandée** (quelles dimensions sur quels canaux visuels pour bien voir le projet, puisqu'il est à 0 % sur l'axe Y par défaut).
  6. Sources : site du projet (marqué déclaratif), runs sources S1/S2, infos fournies par Elena le cas échéant.
  7. Pied : généré par la Skill 3 + `<span data-role="last-updated">[date]</span>`.
- **Données** : inlinées (`const RUN_S3_DATA = {...}`) et écrites dans `data.json` — strictement identiques.

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
- `source_runs.s2` est `null` si le marché n'a pas de run S2.
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
