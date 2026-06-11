#!/bin/bash
# deploy.sh — déploie le contenu de site/ vers le répertoire market/ sur OVH
#
# Usage :
#   ./deploy.sh --dry-run   → simulation : montre ce qui serait transféré, ne transfère rien
#   ./deploy.sh             → déploiement réel
#
# Les infos de connexion vivent dans deploy.config (non versionné).
# Première installation : cp deploy.config.example deploy.config, puis remplir.

set -euo pipefail
cd "$(dirname "$0")"

CONFIG="deploy.config"
KEY="$HOME/.ssh/id_ed25519_ovh_market"

if [[ ! -f "$CONFIG" ]]; then
  echo "❌ $CONFIG introuvable."
  echo "   → cp deploy.config.example deploy.config, puis remplis les valeurs."
  exit 1
fi
# shellcheck source=deploy.config.example
source "$CONFIG"

: "${SSH_HOST:?SSH_HOST manquant dans deploy.config}"
: "${SSH_USER:?SSH_USER manquant dans deploy.config}"
: "${REMOTE_PATH:?REMOTE_PATH manquant dans deploy.config}"
SSH_PORT="${SSH_PORT:-22}"

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

echo "🚀 site/ → $SSH_USER@$SSH_HOST:$REMOTE_PATH/"
rsync -avz $DRY \
  -e "ssh -p $SSH_PORT -i $KEY" \
  --exclude '.DS_Store' \
  site/ "$SSH_USER@$SSH_HOST:$REMOTE_PATH/"

echo "✅ Terminé."
