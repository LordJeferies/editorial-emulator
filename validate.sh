#!/bin/bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"
for f in index.html css/app.css js/app.js js/ui.js js/store.js js/defaults.js js/cloud.js js/feeds.js js/controllers.js manifest.webmanifest sw.js; do [ -f "$f" ] || { echo "Falta $f"; exit 1; }; done
for f in js/*.js sw.js; do node --check "$f"; done
python3 -m json.tool manifest.webmanifest >/dev/null
python3 - <<'PY'
from pathlib import Path
import re
h=Path('index.html').read_text()
ids=re.findall(r'\bid="([^"]+)"',h)
d=sorted({x for x in ids if ids.count(x)>1})
assert not d, f'IDs duplicados: {d}'
css=Path('css/app.css').read_text(); ui=Path('js/ui.js').read_text(); ctr=Path('js/controllers.js').read_text(); store=Path('js/store.js').read_text(); cloud=Path('js/cloud.js').read_text()
assert 'grid-template-columns:repeat(3,minmax(0,1fr))' in css
assert 'scroll-snap-type:y mandatory' in css
assert "pull:'clone'" in ui and 'new Sortable' in ui
assert 'FeedControllerHub' in ctr and 'keyedSync' in ctr
assert 'innerHTML=renderFeed' not in ui
assert "WORKSPACE='editorial-os'" in cloud
assert "K_APP='jocEditorialV9AppData'" in store
assert "K_SC='jocEditorialV9Scenarios'" in store
assert "currentScenarioId" in store and 'createScenario' in store
assert "store.subscribe('planner'" in ui and "store.subscribe('feeds'" in ui
print('Editorial Emulator V2 QA estática: OK')
PY
grep -q "editorial-emulator-v2" sw.js
grep -q "Editorial Emulator V2" manifest.webmanifest
bash -n create_and_publish.sh
printf '\nQA V2: OK\n'
