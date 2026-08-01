#!/usr/bin/env bash
# Local-first smoke: required files + optional live URL check.
set -euo pipefail
cd "$(dirname "$0")/.."
fail=0

need=(
  index.html styles.css main.js README.md LICENSE 404.html humans.txt
  assets/dome.svg assets/droid.svg assets/hyperloop.svg assets/ballot.svg
  assets/landing.svg assets/favicon.svg assets/og-card.svg
  .well-known/security.txt
)

echo "== file gate =="
for f in "${need[@]}"; do
  if [[ -f "$f" && -s "$f" ]]; then
    echo "OK  $f"
  else
    echo "MISS $f"
    fail=1
  fi
done

echo "== content gate =="
for needle in "Guns for Hire" "Wookieepedia" "Grokipedia" "Plazir-15" "N-2"; do
  if rg -q --fixed-strings "$needle" index.html; then
    echo "OK  contains: $needle"
  else
    echo "MISS content: $needle"
    fail=1
  fi
done

if rg -q 'fonts\.googleapis|fonts\.gstatic' index.html styles.css; then
  echo "FAIL third-party font CDN still referenced"
  fail=1
else
  echo "OK  no Google Fonts CDN references"
fi

echo "== asset ref gate =="
# Local relative href/src from HTML must exist on disk
while IFS= read -r u; do
  case "$u" in
    ""|http*|https*|\#*|mailto:*|data:*) continue ;;
  esac
  # strip query/hash
  u="${u%%\?*}"; u="${u%%\#*}"
  if [[ -e "$u" ]]; then
    echo "OK  asset $u"
  else
    echo "MISS asset $u"
    fail=1
  fi
done < <(rg -o --no-filename '(?:src|href)="([^"]+)"' index.html 404.html | sed 's/.*="//;s/"$//' | sort -u)

if command -v python3 >/dev/null 2>&1; then
  echo "== local server probe =="
  # Bind ephemeral port so we never collide with a long-lived :8765 server.
  port=$(python3 -c 'import socket; s=socket.socket(); s.bind(("127.0.0.1",0)); print(s.getsockname()[1]); s.close()')
  python3 -m http.server "$port" --bind 127.0.0.1 >/tmp/plazir-smoke-http.log 2>&1 &
  pid=$!
  cleanup() { kill "$pid" 2>/dev/null || true; wait "$pid" 2>/dev/null || true; }
  trap cleanup EXIT
  for _ in 1 2 3 4 5 6 7 8 9 10; do
    if curl -s -o /dev/null "http://127.0.0.1:${port}/"; then break; fi
    sleep 0.15
  done
  for path in / /styles.css /main.js /assets/og-card.svg /404.html /humans.txt /.well-known/security.txt; do
    code=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:${port}${path}" || echo 000)
    if [[ "$code" == "200" ]]; then
      echo "OK  local $path -> $code"
    else
      echo "FAIL local $path -> $code"
      fail=1
    fi
  done
  cleanup
  trap - EXIT
fi

if [[ "${SMOKE_LIVE:-}" == "1" ]]; then
  echo "== live probe =="
  base="https://veigapunk.github.io"
  for path in / /styles.css /main.js /assets/og-card.svg /404.html /humans.txt /.well-known/security.txt; do
    code=$(curl -s -o /dev/null -w '%{http_code}' "${base}${path}" || echo 000)
    if [[ "$code" == "200" ]]; then
      echo "OK  live $path -> $code"
    else
      echo "FAIL live $path -> $code"
      fail=1
    fi
  done
  if curl -s "${base}/" | rg -q 'fonts\.googleapis|fonts\.gstatic'; then
    echo "FAIL live still references Google Fonts CDN"
    fail=1
  else
    echo "OK  live has no Google Fonts CDN"
  fi
  if curl -s "${base}/main.js" | rg -q 'focusHashTarget'; then
    echo "OK  live main.js has hash focus"
  else
    echo "FAIL live main.js missing hash focus"
    fail=1
  fi
fi

if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "== remote sync (optional remotes) =="
  head=$(git rev-parse HEAD)
  echo "OK  HEAD $head"
  for remote in origin pages-user; do
    if git remote get-url "$remote" >/dev/null 2>&1; then
      # Prefer local remote-tracking ref; fall back to ls-remote
      ref=$(git rev-parse --verify "${remote}/main" 2>/dev/null || true)
      if [[ -z "$ref" ]]; then
        ref=$(git ls-remote --heads "$remote" main 2>/dev/null | awk '{print $1}')
      fi
      if [[ -n "$ref" && "$ref" == "$head" ]]; then
        echo "OK  $remote/main == HEAD"
      elif [[ -n "$ref" ]]; then
        echo "WARN $remote/main=$ref (diverged from HEAD; run ./scripts/deploy.sh)"
      else
        echo "WARN $remote: could not resolve main"
      fi
    fi
  done
fi

if [[ "$fail" -ne 0 ]]; then
  echo "SMOKE FAILED"
  exit 1
fi
echo "SMOKE OK"
