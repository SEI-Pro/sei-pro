#!/bin/zsh
# FR-008 / spec 001-build-generated-dist: packs ONLY the official-build output tree
# (repo dist/ after `npm run build`). Never invent a parallel payload — regenerate
# dist/ first if needed. This script does not run the build itself.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DIST_DIR="$ROOT_DIR/dist"
OUTPUT_ZIP="${1:-$ROOT_DIR/dist.zip}"
TMP_DIR="$(mktemp -d)"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

if [[ ! -d "$DIST_DIR" ]]; then
  echo "Erro: pasta dist/ não encontrada em $DIST_DIR" >&2
  exit 1
fi

if [[ ! -f "$DIST_DIR/manifest.json" ]]; then
  echo "Erro: manifest.json não encontrado em $DIST_DIR" >&2
  exit 1
fi

cp -R "$DIST_DIR"/. "$TMP_DIR"/

if command -v jq >/dev/null 2>&1; then
  jq empty "$TMP_DIR/manifest.json" >/dev/null
else
  node -e "JSON.parse(require('fs').readFileSync(process.argv[1], 'utf8'))" "$TMP_DIR/manifest.json" >/dev/null
fi

rm -f "$OUTPUT_ZIP"

(
  cd "$TMP_DIR"
  zip -qrX "$OUTPUT_ZIP" .
)

echo "Pacote gerado em: $OUTPUT_ZIP"
