#!/usr/bin/env bash
# Push main to source repo + user GitHub Pages mirror.
set -euo pipefail
cd "$(dirname "$0")/.."
branch="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$branch" != "main" ]]; then
  echo "Refusing deploy from branch '$branch' (need main)." >&2
  exit 1
fi
git push origin main
if git remote get-url pages-user >/dev/null 2>&1; then
  git push pages-user main
else
  echo "Remote pages-user missing; add: git remote add pages-user git@github.com:VeigaPunk/VeigaPunk.github.io.git" >&2
fi
echo "Deployed. Live: https://veigapunk.github.io/"
