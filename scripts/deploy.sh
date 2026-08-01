#!/usr/bin/env bash
# Push main to source repo + user GitHub Pages mirror.
set -euo pipefail
cd "$(dirname "$0")/.."
branch="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$branch" != "main" ]]; then
  echo "Refusing deploy from branch '$branch' (need main)." >&2
  exit 1
fi
head=$(git rev-parse HEAD)
git push origin main
if git remote get-url pages-user >/dev/null 2>&1; then
  git push pages-user main
else
  echo "Remote pages-user missing; add: git remote add pages-user git@github.com:VeigaPunk/VeigaPunk.github.io.git" >&2
fi
# Refresh remote-tracking refs and confirm both mains match HEAD
git fetch origin main >/dev/null 2>&1 || true
git fetch pages-user main >/dev/null 2>&1 || true
for remote in origin pages-user; do
  if git rev-parse --verify "${remote}/main" >/dev/null 2>&1; then
    ref=$(git rev-parse "${remote}/main")
    if [[ "$ref" == "$head" ]]; then
      echo "OK  ${remote}/main == ${head:0:7}"
    else
      echo "WARN ${remote}/main=${ref:0:7} != HEAD ${head:0:7}" >&2
    fi
  fi
done
echo "Deployed. Live: https://veigapunk.github.io/"
