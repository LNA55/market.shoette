# Brief de contexte — projet MARKET (My Market Data)

> Document d'amorçage pour une nouvelle session. **Établi le 2026-06-12, mis à jour le 2026-06-15** (vérification directe du site en ligne `https://market.shoette.com`). Reflète l'état publié au 15 juin 2026 — **design system « My Market Data » appliqué à tout le site** (le graphique de positionnement 2b est le seul élément encore dans l'ancienne charte, refonte à venir).
> Pour le détail des décisions et la spécification complète : lire `SPEC.md` et `CLAUDE.md` à la racine du projet.

---

## 1. Le projet

**My Market Data** — un agent de veille concurrentielle réutilisable sur plusieurs marchés. Il encode un process en **4 étapes (Steps)**, chacune produisant un livrable daté (« run »). Tout est généré en local (Claude Code) puis publié sur un **site 100 % statique** : `market.shoette.com`.

## 2. Où ça vit & comment déployer

- **Dossier local** : `/Users/elenahagege/Documents/CODE TECH/MARKET` (ouvrir la session ici). Le site est dans `site/`.
- **Déploiement** : `./deploy.sh` (puis `./deploy.sh --dry-run` pour simuler). Il fait un `lftp mirror` de `site/` vers le répertoire distant `market/` sur OVH (hôte `ftp.cluster014.hosting.ovh.net`, identifiants dans `~/.netrc`). Garde-fou intégré : refuse tout chemin distant ne contenant pas « market ». Le skill `shoette-deploy` documente la connexion FTP.
- **Versionnage** : dépôt git local (ne pas pousser sur GitHub sauf demande explicite).
- **Règle FTP** : sur l'hébergement shoette.com, ne jamais toucher au répertoire `cv/` (autre projet).

## 3. Architecture du site (en ligne, vérifié)

- **Chrome partagé, injecté par JS** (source unique, présent sur toutes les pages) :
  - `assets/siteheader.js` — en-tête sticky : logo **My Market Data.** (lien accueil) + fil d'Ariane + barre de progression au scroll. Piloté par attributs `data-crumb` (`accueil` / `parent` avec `data-parent-label` + `data-parent-href`).
  - `assets/sitefoot.js` — pied complet : présentation, liens « La méthode », « Marchés étudiés », mentions légales. **Pour ajouter un marché, éditer la liste `MARCHES` dans ce fichier.**
- **`assets/site.css`** — charte des pages parent et de documentation (non figées, peut évoluer) — **design system « My Market Data »** : papier chaud `#faf8f4`, marque coral `#F4684F`, système de signaux, polices Hanken Grotesk / IBM Plex Mono / Instrument Serif.
- **Moteur du graphique interactif** : `assets/positioning-chart-v1.{js,css}` — **versionné** (jamais reconstruit pendant un run ; un changement cassant = nouveau fichier `v2`).
- **Pages de run** : autonomes (styles inline, **design system « My Market Data »**), données inlinées **et** dans un `data.json` voisin. **Ce sont les *données* d'un run qui sont figées, pas son style** — le rendu peut être re-skinné (cf. §6).

## 4. Le pipeline en 4 étapes

| Step | Nom (doc / run) | Rôle | Livrable |
|---|---|---|---|
| **1** | Read the Market | Débroussailler le marché | Executive summary, graphique part×croissance (2a), **graphique de positionnement interactif 5 canaux** (2b) + tableau, annexes (sources + lexique) |
| **2** | Present the Market / « Présenter le marché » | Lecture business | Tableau KPI business + remarques méthodo + **frameworks pertinents** appliqués au marché + sources |
| **3** | Position MY product / « Positionner mon produit » | Situer mon produit | Le projet ajouté au graphique de la Step 1 (marqueur **✺**, part 0 %) + note de positionnement |
| **4** | Strategy recommendation / « Recommandation stratégique » | Recommander | Synthèse marché + positionnement + **SWOT** + marketing mix 4P + cibles de partenariat/sortie |

> Nuance de nommage observée en ligne : les **pages de documentation** disent « Step N — <nom anglais> » ; les **pages de run** portent un titre français (« Présenter le marché », « Positionner mon produit », « Recommandation stratégique »).

Les **définitions des skills** sont dans `.claude/skills/` (le nouveau dépôt les contient — les lire pour le détail d'exécution).

## 5. État en ligne aujourd'hui (2026-06-12, vérifié)

**Un seul marché publié : Applications mobiles d'assistance à la perte de poids** (`/apps-perte-de-poids/`). Le **pipeline complet a été exécuté** — 5 runs en ligne :

| Run | URL | Date |
|---|---|---|
| Step 1 · Run 1 | `/apps-perte-de-poids/s1-1_2026-06-11/` | 11 juin 2026 |
| Step 1 · Run 2 | `/apps-perte-de-poids/s1-2_2026-06-11/` | 11 juin 2026 |
| Step 2 · Run 1 | `/apps-perte-de-poids/s2-1_2026-06-11/` | 11 juin 2026 |
| Step 3 · Run 1 | `/apps-perte-de-poids/s3-1_2026-06-12/` | 12 juin 2026 — projet **« What is wrong with me »** |
| Step 4 · Run 1 | `/apps-perte-de-poids/s4-1_2026-06-12/` | 12 juin 2026 — recommandations pour **« What is wrong with me »** |

**Pages de documentation** (toutes en ligne) :
- `/how-it-works/` — la méthode d'ensemble (l'agent, le pipeline, les runs, les données).
- `/focus-step-1/` à `/focus-step-4/` — une page par étape, **gabarit uniforme en 7 sections** : *À quoi sert cette étape · Comment la lancer · Le livrable · Les conventions de lecture · Informations complémentaires essentielles · Voir un exemple réel · Pour aller plus loin*.
- `/focus-step-1/process-skill-11juin2026/` — page enfant **« Les Skills utilisés dans l'étape 1 »** (le process détaillé de la Step 1, version datée) + définition téléchargeable.

Ces pages **focus** sont la **documentation de référence** de chaque étape — s'y reporter pour savoir ce que fait/produit une étape.

## 6. Conventions & règles structurantes

- **Schéma d'URL des runs** : `[marché]/s[K]-[N]_[date]/` (K = n° d'étape, N = n° de run). Ex. `s2-1_2026-06-11`.
- **Pages parent éditées par zones balisées** : la page marché a une section par étape, chacune avec sa zone `RUNS-SKILL1` … `RUNS-SKILL4` ; l'accueil a `MARKETS`. **N'écrire qu'entre les balises** — le reste appartient à Elena. Runs listés du plus ancien au plus récent (Run 1 en haut).
- **Conventions de données** : `~` = valeur estimée · `—` = information introuvable (jamais d'omission silencieuse). Parts de sous-secteurs bouclées à 100 %.
- **Runs figés = données figées** : les *données* d'un run publié ne sont pas retouchées (canevas `data.json`) ; son *style* suit le design system et peut être re-skinné (décision 2026-06-15). Plus de champ « dernière mise à jour » — la date vit dans la byline du hero, le pied est le footer commun.
- **Données** : structurées conservées (`data.json` versionné) ; brutes jetées ; traçabilité par les sources datées en annexe.
- **Répartition des modèles** : recherche sur sous-agents Sonnet ; orchestration/rédaction/stratégie sur le meilleur modèle de la session.

## 7. Pour démarrer dans une nouvelle session

1. Ouvrir la session dans `CODE TECH/MARKET`, lire `CLAUDE.md` puis `SPEC.md`.
2. Pour comprendre une étape : ouvrir sa page `focus-step-N/` (en ligne ou dans `site/`).
3. Pour le détail d'exécution d'une étape : lire la skill correspondante dans `.claude/skills/`.
4. Toute publication passe par `./deploy.sh` (vérifier avec `--dry-run` d'abord), puis vérifier en ligne.
