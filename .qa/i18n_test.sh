#!/usr/bin/env bash
# i18n QA test suite — locale-translate branch
# Run from repo root: bash .qa/i18n_test.sh
# Requires: backend running on :8000, frontend built

set -euo pipefail

PASS=0
FAIL=0
RESULTS=()

ok()   { PASS=$((PASS+1)); RESULTS+=("  PASS  [$1] $2"); }
fail() { FAIL=$((FAIL+1)); RESULTS+=("  FAIL  [$1] $2"); }
info() { echo ""; echo "=== $1 ==="; }

# ─── LOCALE FILE TESTS ───────────────────────────────────────────────────────

info "LOCALE FILES"

LOCALE_DIR="frontend/src/shared/i18n/locales"
EXPECTED_LANGS="en fr es es-mx de it ja pt-br ru pl ko zh-cht zh-chs"

# T14 — count 13 locale files
if [ -d "$LOCALE_DIR" ]; then
  COUNT=$(ls "$LOCALE_DIR" | wc -l | tr -d ' ')
  if [ "$COUNT" -eq 13 ]; then
    ok 14 "13 locale files found ($COUNT)"
  else
    fail 14 "Expected 13 locale files, found $COUNT"
  fi
else
  fail 14 "Locale directory not found: $LOCALE_DIR"
fi

# T15 — check all 13 langs present by filename
MISSING=""
for lang in $EXPECTED_LANGS; do
  if [ ! -f "$LOCALE_DIR/$lang.ts" ] && [ ! -f "$LOCALE_DIR/$lang.json" ]; then
    MISSING="$MISSING $lang"
  fi
done
if [ -z "$MISSING" ]; then
  ok 15 "All 13 locale files present"
else
  fail 15 "Missing locale files:$MISSING"
fi

# T15b — check key parity: extract keys from en and compare to fr, zh-chs
check_keys() {
  local lang="$1"
  local ref_file en_file
  # support .ts or .json
  for ext in ts json; do
    [ -f "$LOCALE_DIR/en.$ext" ] && en_file="$LOCALE_DIR/en.$ext"
    [ -f "$LOCALE_DIR/$lang.$ext" ] && ref_file="$LOCALE_DIR/$lang.$ext"
  done
  if [ -z "${en_file:-}" ] || [ -z "${ref_file:-}" ]; then
    fail "15-keys-$lang" "Cannot compare keys — file missing"
    return
  fi
  # Extract bare keys (lines with a colon, strip values)
  EN_KEYS=$(grep -E '^\s+\w+\s*:' "$en_file" | sed 's/:.*//' | tr -d ' ' | sort)
  LANG_KEYS=$(grep -E '^\s+\w+\s*:' "$ref_file" | sed 's/:.*//' | tr -d ' ' | sort)
  if [ "$EN_KEYS" = "$LANG_KEYS" ]; then
    ok "15-keys-$lang" "Key set matches en"
  else
    DIFF=$(diff <(echo "$EN_KEYS") <(echo "$LANG_KEYS") || true)
    fail "15-keys-$lang" "Key mismatch vs en:\n$DIFF"
  fi
}

for lang in fr zh-chs es de ja ko pt-br ru pl it es-mx zh-cht; do
  check_keys "$lang"
done

# ─── TYPESCRIPT BUILD ─────────────────────────────────────────────────────────

info "TYPESCRIPT BUILD"

cd frontend
if npm run build 2>&1 | tail -5 | grep -q "built in\|dist/"; then
  ok 8 "TypeScript build succeeded"
else
  BUILD_OUT=$(npm run build 2>&1 | tail -20)
  fail 8 "TypeScript build failed:\n$BUILD_OUT"
fi
cd ..

# ─── BACKEND TESTS ────────────────────────────────────────────────────────────

info "BACKEND API"

BASE="http://localhost:8000"

# T10 — valid lang=en returns 200 or 404 (not 500)
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/manifest/activity/1234?lang=en")
if [ "$STATUS" = "200" ] || [ "$STATUS" = "404" ]; then
  ok 10 "lang=en → $STATUS (expected 200 or 404)"
else
  fail 10 "lang=en → $STATUS (expected 200 or 404, not 500)"
fi

# T11 — invalid lang returns 400
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/manifest/activity/1234?lang=INVALID")
if [ "$STATUS" = "400" ] || [ "$STATUS" = "422" ]; then
  ok 11 "lang=INVALID → $STATUS (400/422 — rejected)"
else
  fail 11 "lang=INVALID → $STATUS (expected 400)"
fi

# T12 — path traversal blocked
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/manifest/activity/1234?lang=../../etc/passwd")
BODY=$(curl -s "$BASE/api/manifest/activity/1234?lang=../../etc/passwd")
if [ "$STATUS" = "400" ] || [ "$STATUS" = "422" ]; then
  ok 12 "Path traversal → $STATUS (blocked)"
else
  fail 12 "Path traversal → $STATUS — body: $BODY"
fi

# T13 — no lang defaults to en (returns 200 or 404, not 500)
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/manifest/activity/1234")
if [ "$STATUS" = "200" ] || [ "$STATUS" = "404" ]; then
  ok 13 "No lang param → $STATUS (defaults to en)"
else
  fail 13 "No lang param → $STATUS (expected 200 or 404)"
fi

# ─── SUMMARY ─────────────────────────────────────────────────────────────────

echo ""
echo "════════════════════════════════════════"
echo " i18n QA RESULTS"
echo "════════════════════════════════════════"
for line in "${RESULTS[@]}"; do
  echo -e "$line"
done
echo ""
echo " PASSED: $PASS   FAILED: $FAIL"
echo "════════════════════════════════════════"

[ "$FAIL" -eq 0 ]
