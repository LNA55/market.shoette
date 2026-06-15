# Contrats de la Skill 4 — rapport de stratégie, data.json, zone balisée

## Page de run S4 — structure

> **Design system « My Market Data » (acté 2026-06-14).** Même gabarit visuel que la S2/S3 :
> palette chaude (papier `#faf8f4`, marque coral `#F4684F`), système de signaux (bleu = fait,
> rouge = menace/choc, ambre = opportunité, vert = positif), typos Hanken Grotesk / IBM Plex Mono /
> Instrument Serif. **Run canonique : `apps-perte-de-poids/s4-1_2026-06-12/`** — copier verbatim son
> `<style>` inline et restyler ; seules les données changent. Page en **HTML statique** ; `RUN_S4_DATA` +
> `data.json` restent le miroir de données.

- **Autonome et figée** : tout le CSS du design system est **inline dans le `<head>`** ; conteneur `.shell`
  (`max-width:1180px`). Charge `../../assets/siteheader.js` en tête de `<body>` (topbar + barre de progression)
  et `../../assets/sitefoot.js` juste avant `</body>`. **Ne jamais coder header/footer en dur.**
- **Ordre du document** :
  1. **siteheader.js** : `<script src="../../assets/siteheader.js" data-crumb="parent" data-parent-label="Marché : [label]" data-parent-href="../"></script>`.
  2. **Hero** (`.hero`) : chip marché (`.hero__market`) ; **H1** « Étape 4. » (coral, `.step-no`) + « Recommandation stratégique » ; **byline** « Run S4-[N], publié le [date] — projet [nom], à partir des [run S3], [run S1] et [run S2] » (+ fraîcheur si une source > 3 mois).
  3. **Cadre verdict GO / NO GO** *(décision Elena, 2026-06-13)* — `.verdict` (`.verdict--go` vert / `.verdict--nogo` rouge), dans le hero juste après la byline. Emblème `.verdict__emblem` (`✓`/`✕` + mot **GO**/**NO GO**, dégradé vert/rouge) ; à droite kicker mono « Le verdict de l'analyse, en un mot », la question (`.verdict__q`), la réponse percutante (`.verdict__a`), le paragraphe `.verdict__why` incluant la condition. **Verdict binaire** : synthèse des sections 1-5, décidé en dernier mais affiché en premier — il doit pouvoir dire NON.
  4. **Bandeau d'âge des données** (`.agebanner`, toujours présent) : « Sections 1-2 : synthèse pure des runs existants — données du [date(s)], aucun rafraîchissement web » *(décision Elena, 2026-06-12)*.
  5. **Section 1 — Le marché au [date]** (`.section` + `.prose`/`.pts`) : synthèse S1/S2 — définition, taille (~), sous-secteurs et parts, dynamique et chocs, forces dominantes.
  6. **Section 2 — Le positionnement du projet** (`.pts`) : synthèse S3 — le projet, ses valeurs par dimension (déclaratives), sa position (couloir, voisins, angle mort), liens vers la note S3 et le graphique enrichi.
  7. **Section 3 — SWOT** *(section dédiée — décision Elena, 2026-06-12)* : **grille 2×2 en CSS** (`.swot` → `.quad--s` Forces bleu/accent, `.quad--w` Faiblesses ambre/watch, `.quad--o` Opportunités vert/good, `.quad--t` Menaces rouge/risk) ; bandeaux « Interne — le projet » / « Externe — le marché » ; **chaque entrée porte une pastille `.basis`** ancrant la provenance (S1/S2/S3 ou déclaratif) ; puis un paragraphe de lecture.
  8. **Section 4 — Marketing mix (4P)** (`.pblock` par P) : **donnée d'appui** (`.pblock__data`, citée runs) puis **verdict sur le choix déclaré d'Elena** (franc) OU **recommandation** (`.pblock__reco`, chiffrée quand les runs le permettent — fourchette + modalité pour le prix).
  9. **Section 5 — Recommandations essentielles & partenariats** : (a) recos transverses (`.pts`) ; (b) **cibles de partenariat / sortie** — table `.targets` (cible · `.dealtype` pastille du type d'opération · logique & signaux, citations web en `.src`). Seule section nourrie de recherche web (sous-agents Sonnet), faits externes cités URL + date.
  10. **Section 6 — Sources** (`.sources`, numérotées) : runs sources d'abord, compléments web de la section 5 ensuite, distingués.
  11. **sitefoot.js** (footer commun ; pas de pied propre — n° + date dans la byline).
- **Données** : inlinées (`const RUN_S4_DATA = {...}`) et écrites dans `data.json` — strictement identiques (schéma v1 inchangé).

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
- `verdict.decision` ∈ {`GO`, `NO GO`} — **binaire, jamais « peut-être »** ; rendu en grand encart dans le hero (classes `.verdict--go` / `.verdict--nogo`, design system). La synthèse des sections 1-5 décide ; un GO conditionnel met sa condition dans `condition`, sans adoucir le mot. Le verdict doit pouvoir dire NON.
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
