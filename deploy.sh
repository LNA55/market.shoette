#!/bin/bash
# deploy.sh — déploie le contenu de site/ vers le répertoire market/ sur OVH, via lftp (FTP)
#
# Usage :
#   ./deploy.sh --dry-run   → simulation : montre ce qui serait transféré, ne transfère rien
#   ./deploy.sh             → déploiement réel
#
# Authentification : automatique via ~/.netrc (login shoette).
# Les paramètres vivent dans deploy.config (non versionné).

set -euo pipefail
cd "$(dirname "$0")"

CONFIG="deploy.config"
if [[ ! -f "$CONFIG" ]]; then
  echo "❌ $CONFIG introuvable."
  echo "   → cp deploy.config.example deploy.config, puis remplis les valeurs."
  exit 1
fi
# shellcheck source=deploy.config.example
source "$CONFIG"

: "${FTP_HOST:?FTP_HOST manquant dans deploy.config}"
: "${REMOTE_PATH:?REMOTE_PATH manquant dans deploy.config}"

# Garde-fou : on ne déploie QUE vers un chemin contenant "market".
# Protège cv/ et tout le reste de l'hébergement contre une erreur de config.
if [[ "$REMOTE_PATH" != *market* ]]; then
  echo "❌ REMOTE_PATH=\"$REMOTE_PATH\" ne contient pas 'market' — refus de déployer."
  exit 1
fi

DRY=""
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY="--dry-run"
  echo "🔍 Mode simulation — aucun fichier ne sera transféré."
fi

echo "🚀 site/ → ftp://$FTP_HOST/$REMOTE_PATH/"
# Contraintes lftp découvertes au test :
#  - les commandes -e doivent tenir sur UNE ligne (le multiligne casse la session) ;
#  - le « pwd » initial force la connexion, sans quoi mirror --dry-run échoue (« Non connecté »).
LFTP_CMDS="set net:timeout 20; set net:max-retries 2; pwd; mirror -R $DRY --verbose --exclude-glob .DS_Store site/ $REMOTE_PATH/; bye"
lftp -e "$LFTP_CMDS" "$FTP_HOST"

echo "✅ Terminé."
