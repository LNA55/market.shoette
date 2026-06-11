# Agent de veille concurrentielle — Spécification

> Dernière mise à jour : 2026-06-11. Source : brief initial d'Elena + premiers échanges de cadrage.

## Contexte global

Construction d'un agent de veille concurrentielle **réutilisable sur plusieurs projets/marchés**. L'agent encode un process en plusieurs skills. Chaque skill = une étape du pipeline. L'agent orchestre les skills avec le bon contexte (marché, produit, critères).

**Modèle mental validé** : l'« agent », c'est Claude Code en local qui orchestre les skills. Chaque exécution complète = un « run » daté qui produit des pages statiques autonomes (HTML + JS pour l'interactif), déployées sur OVH. **Le site est 100% statique — aucun code côté serveur.** Toute l'intelligence tourne en local.

## Les 5 skills prévues

1. **Read the Market** — identifier les acteurs + lire le marché *(spécifiée ci-dessous)*
2. **Canevas de données** — créer un canevas de données structurées sur ce marché
3. **Mise à jour périodique** — compléter et mettre à jour ces données périodiquement
4. **Positionnement** — analyser mon produit/offre et me positionner dans le marché
5. **Recommandations** — produire une analyse et des recommandations stratégiques alignées sur mes objectifs

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

- Le `data.json` par run sert à la fois de source au graphique 2b et d'historique versionné pour la Skill 3 (qui lit le data.json du run N−1 pour produire le run N).
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

## Modèles recommandés

- **Sonnet 4.6** : recherche, structuration, rédaction (Section 1, 2a, Annexes, Skills 2/3)
- **Fable / Opus** : génération d'UI complexe (Section 2b) + raisonnement stratégique (Skills 4/5)

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
- Display date of last update. This field will be updated by Skill 3.

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
- [x] Run de test exécuté et déployé (2026-06-11, go d'Elena) : **applications mobiles d'assistance à la perte de poids** — https://market.shoette.com/apps-perte-de-poids/1_2026-06-11/ — en attente des retours d'Elena pour ajuster le skill
- [ ] Définir les Skills 2 à 5

# Questions ouvertes

Aucune — le cadrage technique est complet (2026-06-11).

# Décisions actées

- **2026-06-11 — Site 100% statique.** PHP abandonné : tout est généré en local puis uploadé.
- **2026-06-11 — Pipeline en 2 étapes** : (1) récupération des données, (2) fabrication des pages. Les données brutes de l'étape 1 ne sont pas conservées.
- **2026-06-11 — Répertoire OVH dédié** : le projet vit dans son propre répertoire (ex. `market/`) sur l'hébergement, pointé par le sous-domaine. La règle « uniquement cv/ » du projet CV reste valable pour le reste de l'hébergement.
- **2026-06-11 — Runs déclenchés manuellement** dans Claude Code, par Elena. Pas de planification automatique.
- **2026-06-11 — Pages de runs** : statiques, une par run, générées au moment du run puis figées.
- **2026-06-11 — MySQL supprimé.** Les données structurées sont versionnées en `data.json` par run (un fichier par dossier de run, doublé par Git en local).
- **2026-06-11 — Pages parent : édition par zone balisée.** L'agent réécrit uniquement la liste des runs entre `<!-- RUNS:START -->` et `<!-- RUNS:END -->` ; le reste de la page appartient à Elena (modifiable à la main, jamais écrasé).
