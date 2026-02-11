#!/bin/bash
# validate-data.sh — 校验 skills-traffic 包内所有 JSON 文件格式
# 用法: bash skills-traffic/_shared/scripts/validate-data.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PACKAGE_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo "=== skills-traffic JSON 数据校验 ==="
echo "包路径: $PACKAGE_ROOT"
echo ""

errors=0
checked=0

while IFS= read -r -d '' file; do
  checked=$((checked + 1))
  if ! python3 -m json.tool "$file" > /dev/null 2>&1; then
    echo "FAIL: $file"
    python3 -m json.tool "$file" 2>&1 | head -5
    errors=$((errors + 1))
  fi
done < <(find "$PACKAGE_ROOT" -name '*.json' -not -name 'package.json' -print0)

echo ""
echo "校验完成: $checked 个 JSON 文件, $errors 个错误"

if [ "$errors" -gt 0 ]; then
  echo "状态: FAIL"
  exit 1
else
  echo "状态: PASS"
  exit 0
fi
