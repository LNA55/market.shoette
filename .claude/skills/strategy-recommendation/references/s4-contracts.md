# Contrats de la Skill 4 — rapport de stratégie, data.json, zone balisée

## Page de run S4 — structure

- **Autonome et figée** : styles inline dans le `<head>`, même charte de rapport que les runs S1/S2/S3 (encre `#1e293b`, accent `#2563eb`, boîtes douces) ; conteneur fluide `max-width: calc(50vw + 550px)` ; en-tête de site sticky identique aux autres runs. Charge aussi `../../assets/sitefoot.js` juste avant `</body>` (pied de page « La méthode » commun au sous-domaine — cf. contrats Skill 1).
- **Ordre du document** :
  1. En-tête de site sticky : logo My Market Data (lien accueil) + fil d'Ariane « ← Marché : [label] · Accueil ».
  2. En-tête uniforme des runs : **h1 = label du marché**, puis **`seclabel` « Step 4 — Strategy recommendation »**, puis la **ligne runmeta** : « Run S4-[N] — [date] · Projet : [nom] · Sources : [lien run S3 + date] · [lien run S1 + date] · [lien run S2 + date] » + avertissement de fraîcheur si une source a plus de 3 mois.
  3. **Cadre verdict GO / NO GO** *(décision Elena, 2026-06-13)* — grand encart carré juste sous le titre (après la runmeta, avant le bandeau d'âge). Emblème carré : `✓` + mot **GO** (vert) ou mot **NO GO** (rouge) ; à droite, kicker « Le verdict de l'analyse, en un mot », la question, la réponse percutante, puis le paragraphe de justification incluant la condition. Classes CSS `verdict-banner verdict-go` ou `verdict-banner verdict-nogo`. **Verdict binaire** : synthèse des sections 1-5, décidé en dernier mais affiché en premier — il doit pouvoir dire NON.
  4. **Bandeau d'âge des données** (toujours présent) : « Sections 1-2 : synthèse pure des runs existants — données du [date(s)], aucun rafraîchissement web » *(décision Elena, 2026-06-12)*.
  5. **Section 1 — Le marché au [date du run source]** : synthèse S1/S2 — définition, taille (~), sous-secteurs et parts, dynamique et chocs structurels, forces dominantes. Conventions conservées.
  6. **Section 2 — Le positionnement du projet** : synthèse S3 — le projet en deux lignes, ses valeurs par dimension (déclaratives, marquées), sa position (couloir, voisins, angle mort), liens vers la note S3 et le graphique enrichi (`../s1-[n]_[date]/#s2b`).
  7. **Section 3 — SWOT** *(section dédiée — décision Elena, 2026-06-12)* : grille 2×2 en SVG inline (~660px, charte rapport) + un paragraphe de lecture. Interne = Forces/Faiblesses ; externe = Opportunités/Menaces ; chaque entrée ancrée dans un fait S1/S2/S3 ou une déclaration d'Elena.
  8. **Section 4 — Marketing mix (4P)** : un bloc par P (Produit, Prix, Promotion, Place). Chaque bloc : **donnée d'appui** (citée runs), **raisonnement**, puis **verdict sur le choix déclaré d'Elena** (franc, jamais complaisant) OU **recommandation** (chiffrée quand les runs le permettent — fourchette + modalité pour le prix).
  9. **Section 5 — Recommandations essentielles & partenariats** : (a) liste priorisée de recommandations transverses (recommandation + justification) ; (b) **cibles de partenariat / sortie** : entreprises nommées — logique stratégique, type d'opération plausible (partenariat d'envergure / rachat / fusion / investisseur), signaux observables. Seule section nourrie de recherche web (sous-agents Sonnet), faits externes cités URL + date.
  10. Sources : runs sources d'abord, compléments web de la section 5 ensuite, distingués.
  11. Pied : « Rapport généré par l'agent de veille concurrentielle — Step 4 « Strategy recommendation » · Run S4-[N] » + `<span data-role="last-updated">[date]</span>`.
- **Données** : inlinées (`const RUN_S4_DATA = {...}`) et écrites dans `data.json` — strictement identiques.

## `data.json` S4 — schéma (v1)

```json
{
  "schema_version": 1,
  "skill": "strategy-recommendation",
  "market": { "slug": "...", "label": "...", "language": "fr" },
  "run": { "number": 1, "date": "2026-06-13" },
  "source_runs": {
    "s3": { "number": 1, "date": "2026-06-12", "path": "../s3-1_2026-06-12/", "age_days": 1, "freshness_warning": false },
    "s1": { "number": 2, "date": "2026-06-11", "path": "../s1-2_2026-06-11/", "age_days": 2, "freshness_warning": false },
    "s2": { "number": 1, "date": "2026-06-11", "path": "../s2-1_2026-06-11/", "age_days": 2, "freshness_warning": false }
  },
  "project": { "id": "...", "name": "...", "source_url": "https://..." },
  "verdict": {
    "decision": "GO | NO GO",
    "question": "Faut-il creuser ce projet sur ce marché ?",
    "answer": "Une ligne percutante.",
    "rationale": "Pourquoi — ancré dans les sections.",
    "condition": "Ce dont dépend le GO, ou ce qui ferait basculer un NO GO."
  },
  "declared_inputs": {
    "mix": { "produit": "déclaration d'Elena ou null", "prix": null, "promotion": null, "place": null },
    "constraints": "contraintes fournies par Elena ou null"
  },
  "market_summary": { "as_of": "2026-06-11", "data_age_note": "synthèse pure des runs S1-2/S2-1 — aucune donnée rafraîchie", "points": ["un point par élément"] },
  "positioning_summary": { "points": ["..."] },
  "swot": {
    "strengths": [{ "point": "...", "basis": "fait source (run ou déclaration)" }],
    "weaknesses": [{ "point": "...", "basis": "..." }],
    "opportunities": [{ "point": "...", "basis": "..." }],
    "threats": [{ "point": "...", "basis": "..." }]
  },
  "marketing_mix": {
    "produit": { "declared": "...|null", "verdict": "avis sur le choix d'Elena | null", "recommendation": "...|null", "supporting_data": ["donnée citée + provenance"] },
    "prix": { "declared": null, "verdict": null, "recommendation": "fourchette + modalité", "supporting_data": ["..."] },
    "promotion": { "declared": null, "verdict": null, "recommendation": "...", "supporting_data": ["..."] },
    "place": { "declared": null, "verdict": null, "recommendation": "...", "supporting_data": ["..."] }
  },
  "other_recommendations": [{ "theme": "lancement | cible | produit | communication | distribution | ...", "recommendation": "...", "rationale": "..." }],
  "partnership_targets": [
    { "name": "Entreprise", "category": "pharma | wearable | télésanté | assureur | plateforme | ...", "deal_type": "partenariat d'envergure | rachat | fusion | investisseur", "logic": "pourquoi elle, pour ce projet", "signals": "deals comparables / stratégie affichée", "source_ids": [5] }
  ],
  "sources": [
    { "id": 1, "title": "Run S3-1 du 2026-06-12", "publisher": "market.shoette.com", "url": "../s3-1_2026-06-12/", "accessed": "2026-06-13", "from_source_run": true },
    { "id": 5, "title": "complément web (section partenariats uniquement)", "url": "https://...", "accessed": "2026-06-13", "from_source_run": false }
  ],
  "last_updated": "2026-06-13"
}
```

Notes :
- `verdict.decision` ∈ {`GO`, `NO GO`} — **binaire, jamais « peut-être »** ; rendu en grand encart carré sous le titre (classes `verdict-go` / `verdict-nogo`). La synthèse des sections 1-5 décide ; un GO conditionnel met sa condition dans `condition`, sans adoucir le mot. Le verdict doit pouvoir dire NON.
- `marketing_mix.*` : par P, **exactement un** de `verdict` (si `declared` non null) ou `recommendation` est rempli — les deux peuvent coexister si Elena n'a déclaré qu'une partie du P.
- `partnership_targets[].source_ids` : obligatoire dès qu'un fait externe est invoqué — seule section autorisée à citer du web.
- Sections 1-2 (`market_summary`, `positioning_summary`) : aucune source web, uniquement les runs.

## Zone `RUNS-SKILL4` — format

Runs du plus ancien au plus récent (Run 1 en premier). Même format de carte que les zones Skill 1/2/3 :

```html
<!-- RUNS-SKILL4:START — zone gérée par l'agent, ne pas éditer à la main -->
<ul class="cards">
  <li><a class="card" href="s4-[N]_[date-iso]/">
    <span class="run-num">Run [N]</span>
    <span class="card-body">
      <span class="card-title">[date longue]</span>
      <span class="card-meta">Recommandations stratégiques pour « [nom du projet] » · SWOT, mix, partenariats</span>
    </span>
    <span class="card-arrow">→</span>
  </a></li>
</ul>
<!-- RUNS-SKILL4:END -->
```

État vide (avant le premier run) : `<p class="empty">Pas encore de run — skill en cours de définition.</p>`
