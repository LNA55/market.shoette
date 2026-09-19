# Projet MARKET — Agent de veille concurrentielle

Agent de veille concurrentielle réutilisable multi-marchés, organisé en 4 skills (pipeline). Génération locale avec Claude Code → déploiement sur OVH mutualisé (`market.shoette.com`).

**Lis `SPEC.md` avant toute tâche** — il contient la spécification complète (skills, stack, architecture web, contraintes OVH, questions ouvertes).

Les skills du pipeline vivent dans `.claude/skills/` — Skill 1 : `read-the-market`, Skill 2 : `present-the-market`, Skill 3 : `position-my-product`, Skill 4 : `strategy-recommendation` (chacune avec ses contrats dans `references/`). Schéma d'URL des runs : `[marché]/s[K]-[N]_[date]/`.

## ⚠️ market est protégé par le gate central (depuis le 2026-09-18)
- Le `.htaccess` envoie **toutes** les requêtes vers le gardien `site/_hub.php` (moteur `/home/shoette/.hub`, copie de
  référence `meta/hub/`, conception `meta/hub/CONCEPTION.md`), qui vérifie la session et les droits avant de servir le
  fichier — pages, `data.json` et `assets/` compris. **Aucune page publique** ; accès réglés dans
  https://projet.shoette.com/accounts/. Plus aucun mot de passe propre à market.
- **Les deux fichiers du gate vivent dans `site/`** — donc `./deploy.sh` les emporte. C'est délibéré : le mur précédent
  était posé à la racine du dépôt, hors de `site/`, et le premier déploiement l'a effacé sans bruit (voir SPEC.md,
  décision du 2026-09-18). Ne jamais les déplacer, ni les exclure du mirror.
- **Ordre des règles du `.htaccess`** : HTTPS, puis les 301 historiques, puis l'anglais par défaut, puis le gardien **en
  dernier**. Les anciennes directives `Redirect 301` (mod_alias) ne peuvent pas revenir : mod_rewrite s'exécute avant
  mod_alias, donc le gardien servirait les vieilles pages au lieu de rediriger.
- Plus de règles de cache par extension (c'est `_hub.php` qui est servi) : le gardien envoie `Cache-Control: private,
  no-cache` + ETag, pour qu'un accès retiré prenne effet tout de suite.
- Le `.htaccess` est **versionné** depuis le 2026-09-18 (il ne porte plus de jeton).

## Règles

- **Site 100% statique** : tout est généré en local puis uploadé vers OVH. Aucun code côté serveur (pas de PHP, Node ou
  Python) — **seule exception, `site/_hub.php`**, le gardien du gate central (3 lignes, voir ci-dessus). L'interactivité tourne côté navigateur (vanilla JS / SVG).
- Pipeline en 2 étapes : (1) récupération des données — les données brutes ne sont pas conservées ; (2) fabrication des pages.
- Pas de base de données : les données structurées sont versionnées en `data.json` par dossier de run.
- Pages parent (accueil, marché) : ne réécrire QUE la zone entre `<!-- RUNS:START -->` et `<!-- RUNS:END -->`. Le reste de la page appartient à Elena, ne jamais l'écraser.
- Déploiement : `./deploy.sh` (lftp, hôte `ftp.cluster014.hosting.ovh.net`, identifiants dans `~/.netrc`) vers le répertoire distant `market/` — **l'unique répertoire distant autorisé pour ce projet**. Sous-domaine : `market.shoette.com`. Runs déclenchés manuellement par Elena dans Claude Code.
- Langue de travail avec Elena : français. Les outputs de l'agent suivent la langue de l'input.
- Sur l'hébergement shoette.com, ne jamais toucher au répertoire `cv/` (projet séparé).
