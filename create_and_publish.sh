#!/bin/bash
set -euo pipefail
OWNER="${GITHUB_OWNER:-LordJeferies}"
REPO="${EMULATOR_REPO:-editorial-emulator}"
ROOT="$(cd "$(dirname "$0")" && pwd)"
TARGET="${EMULATOR_TARGET:-$HOME/Downloads/$REPO}"
FULL="$OWNER/$REPO"

echo "Editorial Emulator · publicar repo separado"
command -v git >/dev/null || { echo 'Falta git'; exit 1; }
command -v gh >/dev/null || { echo 'Falta GitHub CLI (gh). Instálalo con: brew install gh'; exit 1; }
gh auth status >/dev/null 2>&1 || { echo 'Ejecuta primero: gh auth login'; exit 1; }

SUPA=""
for f in \
 "$HOME/Downloads/EDITORIAL_OS_V10_FRESH/supabase-config.js" \
 "$HOME/Downloads/editorial-os/supabase-config.js" \
 "$HOME/editorial-os/supabase-config.js" \
 "$HOME/Documents/editorial-os/supabase-config.js"
do
  if [ -f "$f" ]; then SUPA="$f"; break; fi
done

if [ -d "$TARGET/.git" ]; then
  echo "Actualizando repo local existente: $TARGET"
  git -C "$TARGET" fetch origin
  git -C "$TARGET" pull --rebase origin main
else
  rm -rf "$TARGET"
  mkdir -p "$TARGET"
fi

rsync -a --delete --exclude '.git' --exclude 'create_and_publish.sh' "$ROOT/" "$TARGET/"
cp "$ROOT/create_and_publish.sh" "$TARGET/create_and_publish.sh"
chmod +x "$TARGET/validate.sh" "$TARGET/create_and_publish.sh"

if [ -n "$SUPA" ]; then
  cp "$SUPA" "$TARGET/supabase-config.js"
  echo "Supabase copiado desde Editorial OS."
else
  echo "No encontré supabase-config.js. La app podrá usar jocEditorialV9Cloud del mismo dominio o configurarse después."
fi

cd "$TARGET"
./validate.sh

if [ ! -d .git ]; then
  git init -b main
  git config user.name "${GIT_AUTHOR_NAME:-Editorial Emulator Installer}" || true
  git config user.email "${GIT_AUTHOR_EMAIL:-editorial-emulator@local}" || true
  git add -A
  git commit -m "Editorial Emulator V1 - focused simulator and feeds"
  if gh repo view "$FULL" >/dev/null 2>&1; then
    git remote add origin "https://github.com/$FULL.git"
    git fetch origin
    if git show-ref --verify --quiet refs/remotes/origin/main; then
      git rebase origin/main || { echo 'Conflicto al integrar repo remoto existente.'; exit 1; }
    fi
    git push -u origin main
  else
    gh repo create "$FULL" --public --source=. --remote=origin --push --description "Focused Editorial OS emulator and social feed simulator"
  fi
else
  git add -A
  if ! git diff --cached --quiet; then
    git commit -m "Update Editorial Emulator"
  fi
  git push origin main
fi

PAGES_JSON='{"source":{"branch":"main","path":"/"}}'
if gh api "repos/$FULL/pages" >/dev/null 2>&1; then
  printf '%s' "$PAGES_JSON" | gh api -X PUT "repos/$FULL/pages" --input - >/dev/null || true
else
  printf '%s' "$PAGES_JSON" | gh api -X POST "repos/$FULL/pages" --input - >/dev/null
fi

echo
echo "Repo:  https://github.com/$FULL"
OWNER_LC="$(printf '%s' "$OWNER" | tr '[:upper:]' '[:lower:]')"
echo "Page:  https://$OWNER_LC.github.io/$REPO/"
echo "GitHub Pages puede tardar 1-3 minutos en publicar."
