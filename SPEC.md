# Agent de veille concurrentielle — Spécification

> Dernière mise à jour : 2026-06-11. Source : brief initial d'Elena + premiers échanges de cadrage.

## Contexte global

Construction d'un agent de veille concurrentielle **réutilisable sur plusieurs projets/marchés**. L'agent encode un process en plusieurs skills. Chaque skill = une étape du pipeline. L'agent orchestre les skills avec le bon contexte (marché, produit, critères).

**Modèle mental validé** : l'« agent », c'est Claude Code en local qui orchestre les skills. Chaque exécution complète = un « run » daté qui produit des pages statiques autonomes (HTML + JS pour l'interactif), déployées sur OVH. **Le site est 100% statique — aucun code côté serveur.** Toute l'intelligence tourne en local.

## Les skills du pipeline (taxonomie actée le 2026-06-11)

1. **Skill 1 — Read the Market** — identifier les acteurs + lire le marché *(spécifiée ci-dessous, opérationnelle)*
2. **Skill 2 — Present the Market** — *(à définir ensemble)*
3. **Skill 3 — Position MY product in the Market** — *(spécifiée le 2026-06-12, V1 — premier run en attente du prérequis moteur)*
4. **Skill 4 — Strategy recommendation** — *(à définir ensemble)*

> Cette taxonomie en 4 skills remplace le découpage initial en 5 (l'ancien « canevas de données » et la « mise à jour périodique » seront redistribués dans les Skills 2-4 lors de leur spécification). La page de chaque marché est sectionnée par skill, avec une zone balisée par skill (`RUNS-SKILL1` à `RUNS-SKILL4`).

## Stack technique

**Décision (2026-06-11) : site 100% statique.** Tout est généré en local (Claude Code) puis uploadé vers OVH. Pas de PHP, pas de code côté serveur — Apache sert des fichiers statiques (HTML/CSS/JS).

### Pipeline (validé)

1. **Récupération des données** — phase éphémère : recherche, lecture de sources. Les données brutes récupérées ne sont **pas conservées**.
2. **Fabrication des pages** — pages de runs + pages d'index (accueil, marché), générées en local puis uploadées.

### Persistance des données

| Type | Sort |
|---|---|
| Données **brutes** (articles, pages lues, résultats de recherche) | Jetées après le run |
| Données **structurées** (canevas Skill 2 : acteurs, dimensions, valeurs) | Conservées — `data.json` par run, à côté du HTML *(validé 2026-06-11)* |
| **Sources** | Pas copiées, mais référencées (URL + date d'accès) en Annexe A1 |

- Le `data.json` par run sert à la fois de source au graphique 2b + tableau (source unique) et d'historique versionné d'un run à l'autre. La Skill 3 l'enrichit de façon strictement additive : ajout du projet positionné, sans toucher aux données existantes *(décision 2026-06-12)*.
- **MySQL : supprimé** *(validé 2026-06-11)* — le versionning par dossiers de runs (+ Git en local) remplace entièrement la BDD.

### Infrastructure

- **Hébergement** : OVH mutualisé (`cluster014`), accès FTP via lftp — identifiants dans `~/.netrc` (login `shoette`)
- **Répertoire cible** : `market/` à la racine de l'hébergement (créé, confirmé vide le 2026-06-11) — le sous-domaine `market.shoette.com` doit pointer dessus
- **Déploiement** : génération locale → `./deploy.sh` (lftp `mirror -R` de `site/` vers `market/` ; `--dry-run` disponible ; garde-fou intégré : refuse tout chemin distant ne contenant pas « market »)
- **Interactivité** : graphique 2b côté navigateur — SVG + vanilla JS sur mesure recommandé (ou D3 via CDN) ; les besoins (calques, bordures double/triple, lignes de liaison, export annoté) sont trop spécifiques pour une lib de charts classique

## Architecture web (validée)

```
market.shoette.com/                          → page d'accueil, liste des marchés
market.shoette.com/chaussure/                → page marché, liste des runs
market.shoette.com/chaussure/1_2026-06-11    → run 1, daté
market.shoette.com/chaussure/2_2026-09-11    → run 2 (cycle suivant), etc.
```

- Sous-domaine `market.shoette.com` à créer dans le DNS OVH
- URL des runs : `[marché]/[N]_[date]` où N = numéro de run, incrémenté de +1 à chaque cycle
- Page d'accueil + page marché (« pages parent ») mises à jour à chaque run par **édition de zone balisée** : l'agent ne réécrit que la liste des runs entre `<!-- RUNS:START -->` et `<!-- RUNS:END -->`, le reste de la page est modifiable à la main et jamais écrasé (validé 2026-06-11)
- Versionning des données par marché : `data.json` par dossier de run — remplace la BDD (validé 2026-06-11)

## Modèles (répartition actée le 2026-06-11)

- **Sonnet (4.6+)** : sous-agents de recherche de la Skill 1 (collecte web) — `model: "sonnet"` dans l'outil Agent
- **Meilleur modèle disponible dans la session** : orchestration, consolidation, rédaction, raisonnement stratégique (Skills 4/5)
- **Moteur du graphique 2b** : jamais reconstruit pendant un run — ses évolutions se font en sessions dédiées, avec le meilleur modèle disponible à ce moment-là

---

# SKILL 1 — READ THE MARKET

## Input

The input can be a sector, a need expressed in natural language, a geographic scope, or any combination. When input is incomplete, infer the most likely market and state your assumptions explicitly at the top of the output. Ask a clarifying question only if the input is too ambiguous to proceed.

## Output

### Section 1 — Executive Summary
*Recommended model: Sonnet 4.6*

Write a market framing of about half a page.

Identify the dimensions that most structurally define this market — the criteria a sophisticated buyer or investor would use to evaluate and compare offers. Ground it in concrete market realities: product types, audiences, price range, and any structural factor that materially shapes competition.

This is not a summary of players. It is a reading grid for everything that follows.

State any assumptions made based on the input. Write in the same language as the input.

### Section 2 — Market Players

#### 2a : Market Share & Growth Chart
*Recommended model: Sonnet 4.6*

Produce a positioning chart with:

- **Y axis**: current market share (estimated, in %)
- **X axis**: market share growth rate over a reference period

Choose the reference period (6 months, 1 year, or 3 years) based on market velocity — check the international economic and market-specific press to assess the market's current stage. Draft a very short summary of the market maturity level and main structural recent events (a few sentences), then state which reference period you selected and why.

Include all significant players identified. Estimate figures when exact data is unavailable — flag estimates explicitly.

List separately any player that appears significant but for whom no quantitative data could be found. Do not omit them — their absence from the chart should be visible and noted.

Write in the same language as the input.

#### 2b : Player Positioning Chart
*Recommended model: Fable/Opus*

Generate an interactive scatter chart where each player is represented by a circle (marker).

**Visual channels** — the chart encodes up to 5 dimensions simultaneously:

- **Position Y** : required. Default = market share. Editable.
- **Position X + Color** : optional. One color per active layer/dimension. If not set, all markers are aligned on the Y axis only.
- **Marker size** : optional. If not set, all markers are identical in size.
- **Marker opacity** : optional. If not set, all markers are 100% opaque.
- **Border type** : optional (dashed-loose, dashed-tight, solid, double, triple). If not set, all markers have a solid 1px border.

**Available dimensions** — populate the dimension list from the dimensions identified in the Executive Summary. Include an "Add a dimension" button for manual additions.

**Default configuration** — assign dimensions to visual channels by order of importance for reading this market:

1. Most important dimension → Position Y (overridden by market share default)
2. Second most important → Position X + Color
3. Third most important → Marker size
4. Fourth most important → Marker opacity
5. Fifth most important → Border type

Provide a short paragraph explaining why you ranked the dimensions in this order and how to read the default configuration.

**Markers**

- Shape: circles only
- Player name displayed permanently: inside the marker if size allows, next to it if too small
- Tooltip on hover: player name + value of each encoded dimension
- Click on marker: opens a detailed player card in a right-side panel (not a popup, graph remains fully visible)

**Layer management**

- Default layer: named "Défaut (proposé par l'agent IA)" — fixed name, non-editable, non-deletable, visible/hideable. Opacity automatically reduced when other layers are active, manually adjustable.
- Manual layers: nameable, modifiable, lockable (to save a view), visible/hideable, deletable, reorderable (drag to set stacking order)
- When multiple layers are active, the same player appears once per layer. A checkbox in the control panel ("Show linking lines") displays/hides thin lines connecting markers of the same player across layers. Default: unchecked.

**Control panel** (displayed above the chart) — a dashboard-style panel centralizing:

- Dimension assignment per visual channel
- Layer management (create, name, lock, delete, reorder, show/hide)
- Scale / zoom adjustment
- "Reset to default configuration" button
- "Show linking lines" checkbox (default: unchecked)
- Export button (PNG and SVG) — exported file includes: active layer name(s), date, and an agent-generated text with legend, reading key, and a first market observation

**Data**

- Include all significant players. Flag estimated values explicitly.
- List separately any player that appears significant but for whom no data could be found — do not silently omit them.
- Display date of last update. Skill 3 never changes this date — it appends a dated enrichment mention next to it (« Graphique enrichi des infos sur le nouveau projet [nom], le [date] ») *(amendé le 2026-06-12)*.

Write in the same language as the input.

### Annexes
*Recommended model: Sonnet 4.6*

- **A1 : Sources** — list all sources used throughout this output (press articles, reports, databases, company websites). Include URL and date accessed when available.
- **A2 : Sector Lexicon** — list the key terms and jargon of this market. For each term, provide a short definition in both French and English. Include terms a newcomer to this market would need to understand the output.

---

# Reste à faire

- [x] Cadrage technique complet (2026-06-11)
- [x] Structure locale + script de déploiement + Git (2026-06-11)
- [x] Accès distant opérationnel : lftp/FTP via `~/.netrc`, répertoire `market/` créé et vérifié vide (2026-06-11)
- [x] Sous-domaine `market.shoette.com` en ligne, sert le site (vérifié le 2026-06-11)
- [x] SKILL.md de la Skill 1 écrit — `.claude/skills/read-the-market/` (2026-06-11)
- [x] Moteur du graphique 2b construit : `site/assets/positioning-chart-v1.{js,css}` + démo locale `dev/demo-2b.html` (2026-06-11) — **en attente de validation d'Elena sur la démo**
- [x] Run de test exécuté et déployé (2026-06-11, go d'Elena) : **applications mobiles d'assistance à la perte de poids** — https://market.shoette.com/apps-perte-de-poids/s1-1_2026-06-11/ — en attente des retours d'Elena pour ajuster le skill
- [x] Skill 2 V1 spécifiée et rédigée — `.claude/skills/present-the-market/` (2026-06-11) ; premier run en attente du go d'Elena
- [x] Skill 3 V1 spécifiée et rédigée — `.claude/skills/position-my-product/` (2026-06-12)
- [ ] Session moteur 2b dédiée : marqueur distinctif « mon projet » (`is_mine`) — prérequis au premier run S3
- [ ] Définir ensemble la Skill 4 (Strategy recommendation)

# Questions ouvertes

1. **Skill 2 — l'intention du run** (posée le 2026-06-11) : paramètre explicite au lancement de la skill (défaut « évaluer l'opportunité du marché ») ou toujours implicite ? L'intention pilote la sélection des frameworks.

# Décisions actées

- **2026-06-12 — Skill 3 V1, cadrage validé** :
  (a) **Objet** : positionner un nouveau projet (description libre ou URL, ex. w.shoette.com) sur le graphique 2b du dernier run S1 du marché, avec une note courte. Inputs : le projet, le marché (runs S1 + S2 en contexte), infos optionnelles d'Elena ; au plus 2-3 questions ciblées si la matière manque.
  (b) **Enrichissement du run S1 — unique exception au principe « runs figés », périmètre strict et additif** : le projet est ajouté à `RUN_DATA`/`data.json` (flag `is_mine`) → il apparaît automatiquement dans le graphique interactif **et** le tableau (source unique). **Aucune donnée des concurrents n'est retouchée. La date « Dernière mise à jour » existante reste intacte** — on ajoute à côté la mention « Graphique enrichi des infos sur le nouveau projet [nom], le [date du run S3] ». Re-run du même projet → mise à jour de son entrée ; autre projet → entrée supplémentaire.
  (c) **Part de marché toujours 0 %** (un nouveau projet n'en a pas, par définition) ; croissance non applicable — ce sont les autres dimensions qui portent la lecture. Les valeurs du projet sont **déclaratives** (site du projet / Elena), distinguées des valeurs sourcées des concurrents.
  (d) **Livrable** : note courte sous `[marché]/s3-[N]_[date]/` (zone `RUNS-SKILL3`) — le projet (2-3 lignes + lien), le tableau du positionnement (dimension → valeur + justification), **le lien vers le graphique enrichi** (`#s2b` du run S1), un paragraphe d'analyse avec clés de lecture et configuration de calques recommandée. Pas de SWOT ni de frameworks en V1 — réservés à la Skill 4.
  (e) **Prérequis moteur** : marqueur visuellement distinct pour `is_mine`, à ajouter au moteur 2b en session dédiée **avant** le premier run S3 (le moteur n'évolue jamais pendant un run).
  (f) **Publication** : le run S3 est déployé comme les autres par défaut ; un mode confidentiel (local seulement) sera envisagé si un projet le demande.
  (g) **Modèles** : pas de fan-out de recherche — lecture du site du projet, analyse et rédaction sur le meilleur modèle de la session ; au plus 1 sous-agent Sonnet si le site du projet est volumineux.

- **2026-06-12 — Pages de documentation renommées « Focus on Step N »** (titres, cartes de l'accueil, kickers), puis **URLs renommées `focus-step-N/`** (redirections 301 depuis `focus-skill-N/`, tous les liens internes et contrats mis à jour). Les skills du pipeline gardent leur nom interne « Skill ».
- **2026-06-12 — Page Focus on Step 1 réorganisée (2e itération)** : la page parent documente désormais **le livrable** (à quoi sert l'étape, le rapport dans l'ordre de lecture, les conventions, un exemple réel) ; la documentation du **process** (étape par étape + snapshot téléchargeable) vit dans la page enfant `focus-step-1/process-skill-11juin2026/`. Modèle à suivre pour les futures pages Focus : livrable en parent, process en enfant daté.
- **2026-06-12 — Page Focus on Step 1 remplie** : documentation étape par étape de la Skill 1 telle qu'en vigueur ce jour, avec **snapshot téléchargeable daté** de son SKILL.md (`skill-1-read-the-market_2026-06-12.md`). Principe : à chaque évolution notable de la skill, publier un nouveau snapshot daté plutôt que d'écraser l'ancien.

- **2026-06-11 — Site 100% statique.** PHP abandonné : tout est généré en local puis uploadé.
- **2026-06-11 — Pipeline en 2 étapes** : (1) récupération des données, (2) fabrication des pages. Les données brutes de l'étape 1 ne sont pas conservées.
- **2026-06-11 — Répertoire OVH dédié** : le projet vit dans son propre répertoire (ex. `market/`) sur l'hébergement, pointé par le sous-domaine. La règle « uniquement cv/ » du projet CV reste valable pour le reste de l'hébergement.
- **2026-06-11 — Runs déclenchés manuellement** dans Claude Code, par Elena. Pas de planification automatique.
- **2026-06-11 — Pages de runs** : statiques, une par run, générées au moment du run puis figées.
- **2026-06-11 — MySQL supprimé.** Les données structurées sont versionnées en `data.json` par run (un fichier par dossier de run, doublé par Git en local).
- **2026-06-11 — Pages parent : édition par zone balisée.** L'agent réécrit uniquement la liste des runs entre `<!-- RUNS:START -->` et `<!-- RUNS:END -->` ; le reste de la page appartient à Elena (modifiable à la main, jamais écrasé).
- **2026-06-11 — Répartition des modèles actée** : sous-agents de recherche sur Sonnet ; orchestration, consolidation, rédaction et stratégie sur le meilleur modèle disponible dans la session. Le moteur 2b n'est jamais reconstruit pendant un run — ses évolutions se font en sessions dédiées avec le meilleur modèle disponible.
- **2026-06-11 — Tableau de données ajouté au contrat du rapport** : sous le graphique 2b, tous les acteurs × toutes les dimensions, généré depuis RUN_DATA (source unique).
- **2026-06-11 — Schéma d'URL des runs par skill : `[marché]/s[K]-[N]_[date]/`** (ex. `s1-1_2026-06-11`, `s2-1_…`). Les runs Skill 1 existants ont été renommés `s1-*` ; redirections 301 en place pour les anciennes URLs.
- **2026-06-11 — Skill 2 (cadrage) : le SWOT est exclu de l'analyse produite par la Skill 2.** Il exige un point de vue défini (« mon produit ») et appartient aux Skills 3/4. Il reste documenté sur la page focus-step-2, qui rassemble tous les frameworks. Principe validé : sélection des frameworks par règles (activé / dégradé en qualitatif / écarté avec justification), nourries par la nature du marché (data.json S1) + la disponibilité des données.
- **2026-06-11 — Skill 2 V1, cadrage validé (points 1-4)** :
  (a) **Déroulé** : au lancement, proposer les marchés ayant des runs Skill 1 en choix cliquables → partir de la page et du data.json du **dernier run S1** du marché choisi ; recherche en ligne **en complément seulement**.
  (b) **Livrable** : page de run + data.json sous `[marché]/s2-[N]_[date]/`, zone `RUNS-SKILL2`.
  (c) **Tableau KPI fixe** : définition du marché + principaux sous-secteurs ; taille mondiale + taille et part de chaque sous-secteur (ligne « reste du marché », bouclage à 100 %) ; **acteur installé dominant** — nom, date de création, CA annuel (moyenne des 2 derniers exercices si disponibles, sinon dernier connu en le disant), **bénéfice noté « en perte / rentable / à l'équilibre / information introuvable » + chiffre si on l'a** ; géographie du marché (mondial / régional / local avec pays). Conventions : `~` estimé, `—` introuvable, fourchettes autorisées, sources citées.
  (d) **Fraîcheur** : si le dernier run S1 a plus de 3 mois, le signaler en tête et proposer de relancer une Skill 1 d'abord, sans bloquer.
  (e) **Frameworks : seuls les retenus apparaissent dans le rapport** (choix Elena) — le texte des critères explique la sélection sans lister les écartés.
  (f) **Intention implicite en V1** : angle unique « évaluer l'opportunité du marché » ; paramètre explicite envisageable en V2.
  (g) **Modèles** : analyse/rédaction sur le meilleur modèle de la session ; compléments de recherche via 1-2 sous-agents Sonnet.
