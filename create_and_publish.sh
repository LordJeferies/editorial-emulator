#!/bin/bash
set -euo pipefail
OWNER="${GITHUB_OWNER:-LordJeferies}"
REPO="${EMULATOR_REPO:-editorial-emulator}"
ROOT="$(cd "$(dirname "$0")" && pwd)"
TARGET="${EMULATOR_TARGET:-$HOME/Downloads/$REPO}"
FULL="$OWNER/$REPO"
command -v git >/dev/null || { echo 'Falta git'; exit 1; }
command -v gh >/dev/null || { echo 'Falta GitHub CLI. Instala: brew install gh'; exit 1; }
gh auth status >/dev/null 2>&1 || { echo 'Ejecuta primero: gh auth login'; exit 1; }
SUPA=""
for f in "$HOME/Downloads/EDITORIAL_OS_V10_FRESH/supabase-config.js" "$HOME/Downloads/editorial-os/supabase-config.js" "$HOME/editorial-os/supabase-config.js" "$HOME/Documents/editorial-os/supabase-config.js" "$TARGET/supabase-config.js"; do [ -f "$f" ] && { SUPA="$f"; break; }; done
TMP_SUPA=""
if [ -n "$SUPA" ]; then TMP_SUPA="$(mktemp)"; cp "$SUPA" "$TMP_SUPA"; trap 'rm -f "$TMP_SUPA"' EXIT; fi
if [ -d "$TARGET/.git" ]; then
  git -C "$TARGET" diff --quiet && git -C "$TARGET" diff --cached --quiet || { echo 'Repo destino tiene cambios locales. Haz commit/stash primero.'; exit 1; }
  git -C "$TARGET" fetch origin
  git -C "$TARGET" pull --rebase origin main
else
  rm -rf "$TARGET"; mkdir -p "$TARGET"
fi
rsync -a --delete --exclude '.git/' --exclude 'supabase-config.js' "$ROOT/" "$TARGET/"
[ -n "$TMP_SUPA" ] && cp "$TMP_SUPA" "$TARGET/supabase-config.js" || cp "$ROOT/supabase-config.js" "$TARGET/supabase-config.js"
chmod +x "$TARGET/validate.sh" "$TARGET/create_and_publish.sh"
cd "$TARGET"; ./validate.sh
if [ ! -d .git ]; then
  git init -b main
  git config user.name "${GIT_AUTHOR_NAME:-Editorial Emulator}"
  git config user.email "${GIT_AUTHOR_EMAIL:-editorial-emulator@local}"
  git add -A; git commit -m 'Editorial Emulator V2 - persistent feeds and scenario workflow'
  if gh repo view "$FULL" >/dev/null 2>&1; then git remote add origin "https://github.com/$FULL.git"; git fetch origin; git show-ref --verify --quiet refs/remotes/origin/main && git rebase origin/main || true; git push -u origin main; else gh repo create "$FULL" --public --source=. --remote=origin --push --description 'Editorial Emulator - scenario planner and persistent social feed simulator'; fi
else
  git add -A
  git diff --cached --quiet || git commit -m 'Editorial Emulator V2 - persistent feeds and scenario workflow'
  git fetch origin
  if ! git merge-base --is-ancestor origin/main HEAD; then git rebase origin/main; ./validate.sh; fi
  git push origin main
fi
PAGES='{"source":{"branch":"main","path":"/"}}'
if gh api "repos/$FULL/pages" >/dev/null 2>&1; then printf '%s' "$PAGES" | gh api -X PUT "repos/$FULL/pages" --input - >/dev/null || true; else printf '%s' "$PAGES" | gh api -X POST "repos/$FULL/pages" --input - >/dev/null; fi
OWNER_LC="$(printf '%s' "$OWNER" | tr '[:upper:]' '[:lower:]')"
echo "Repo: https://github.com/$FULL"
echo "Page: https://$OWNER_LC.github.io/$REPO/"
open "https://$OWNER_LC.github.io/$REPO/" 2>/dev/null || true
