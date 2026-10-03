#!/bin/bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
node --check "$ROOT/js/defaults.js"
node --check "$ROOT/js/store.js"
node --check "$ROOT/js/cloud.js"
node --check "$ROOT/js/feeds.js"
node --check "$ROOT/js/ui.js"
node --check "$ROOT/js/app.js"
node --check "$ROOT/sw.js"
python3 - <<'PY' "$ROOT"
import json,sys,re,pathlib
r=pathlib.Path(sys.argv[1])
json.load(open(r/'manifest.webmanifest'))
h=(r/'index.html').read_text()
ids=re.findall(r'id="([^"]+)"',h)
dup=sorted({x for x in ids if ids.count(x)>1})
assert not dup, f'Duplicate IDs: {dup}'
css=(r/'css/app.css').read_text()
assert 'grid-template-columns:repeat(3,minmax(0,1fr))' in css
assert 'touch-action:pan-y' in css
assert 'font-size:16px' in css
cloud=(r/'js/cloud.js').read_text()
assert "WORKSPACE='editorial-os'" in cloud
assert 'mergePayload' in cloud
print('Editorial Emulator V1 QA: OK')
PY
