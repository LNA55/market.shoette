# Projet MARKET — Agent de veille concurrentielle

Agent de veille concurrentielle réutilisable multi-marchés, organisé en 5 skills (pipeline). Génération locale avec Claude Code → déploiement sur OVH mutualisé (`market.shoette.com`).

**Lis `SPEC.md` avant toute tâche** — il contient la spécification complète (skills, stack, architecture web, contraintes OVH, questions ouvertes).

Les skills du pipeline vivent dans `.claude/skills/` — Skill 1 : `read-the-market`, Skill 2 : `present-the-market`, Skill 3 : `position-my-product` (chacune avec ses contrats dans `references/`). Schéma d'URL des runs : `[marché]/s[K]-[N]_[date]/`.

## Règles

- **Site 100% statique** : tout est généré en local puis uploadé vers OVH. Aucun code côté serveur (pas de PHP, Node ou Python). L'interactivité tourne côté navigateur (vanilla JS / SVG).
- Pipeline en 2 étapes : (1) récupération des données — les données brutes ne sont pas conservées ; (2) fabrication des pages.
- Pas de base de données : les données structurées sont versionnées en `data.json` par dossier de run.
- Pages parent (accueil, marché) : ne réécrire QUE la zone entre `<!-- RUNS:START -->` et `<!-- RUNS:END -->`. Le reste de la page appartient à Elena, ne jamais l'écraser.
- Déploiement : `./deploy.sh` (lftp, hôte `ftp.cluster014.hosting.ovh.net`, identifiants dans `~/.netrc`) vers le répertoire distant `market/` — **l'unique répertoire distant autorisé pour ce projet**. Sous-domaine : `market.shoette.com`. Runs déclenchés manuellement par Elena dans Claude Code.
- Langue de travail avec Elena : français. Les outputs de l'agent suivent la langue de l'input.
- Sur l'hébergement shoette.com, ne jamais toucher au répertoire `cv/` (projet séparé).
