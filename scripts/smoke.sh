#!/usr/bin/env bash
# Local-first smoke: required files + optional live URL check.
set -euo pipefail
cd "$(dirname "$0")/.."
fail=0

need=(
  index.html styles.css main.js README.md LICENSE
  assets/dome.svg assets/droid.svg assets/hyperloop.svg assets/ballot.svg
  assets/favicon.svg assets/og-card.svg
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
  for path in / /styles.css /main.js /assets/og-card.svg; do
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
  code=$(curl -s -o /dev/null -w '%{http_code}' https://veigapunk.github.io/ || echo 000)
  if [[ "$code" == "200" ]]; then
    echo "OK  live / -> $code"
  else
    echo "FAIL live / -> $code"
    fail=1
  fi
fi

if [[ "$fail" -ne 0 ]]; then
  echo "SMOKE FAILED"
  exit 1
fi
echo "SMOKE OK"
