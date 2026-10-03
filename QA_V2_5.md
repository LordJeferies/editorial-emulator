# Editorial Emulator V2.5 · QA

## Root cause confirmed

The V2.4 landing rendered because it was static HTML, but `ui-v24.js` contained an extra closing brace at the end of `scenarioCreate()`. The browser failed while parsing the module before `initUI()` could run. Result: the buttons looked correct but had no event handlers.

The faulty close sequence was effectively one brace too many after the `createScenarioSave` handler.

## Recovery

V2.5 does not load `ui-v24.js` anymore.

- `boot-v24.js` is now a tiny compatibility loader.
- `boot-v25.js` is the actual bootstrap.
- `ui-v25.js` is the actual UI runtime.
- Supabase is imported after UI initialization and is optional for local operation.
- `system-v25.css` is loaded by the bootstrap.
- Service Worker cache is now `editorial-emulator-v2-5`.

## Validation actually executed before publishing

- `node --check ui-v25.js`: PASS
- `node --check boot-v25.js`: PASS
- CSS brace balance for `system-v25.css`: PASS
- Existing `store.js`, `feeds.js` and `controllers.js` were inspected from the repository and their public APIs were kept unchanged.

## Functional paths implemented

### Landing
- Usar escenario existente → opens scenario sheet.
- Crear escenario nuevo → opens creation form.
- Existing scenario → `store.openScenario()` then enters workspace.
- New scenario → `store.createScenario()` then enters workspace.
- No Supabase dependency in either path.

### Planner
- 7-day plan on desktop.
- active-day view on compact/mobile.
- content rail always available.
- tap to add content.
- Sortable clone from rail.
- move/reorder between day lists.
- move/remove from content sheet.

### Feeds
- persistent controller hub preserved.
- Instagram/TikTok/LinkedIn/YouTube/Facebook remain mounted.
- Play changes active occurrence rather than replacing all feed markup.
- feed-derived cache remains keyed by `dataRevision` and anchor date.

### Cloud
- local state loads first.
- cloud module lazy-loads.
- cloud sync failure cannot prevent landing buttons from functioning.

## Frontend changes

`system-v25.css` adds:
- centralized UI tokens;
- responsive desktop/mobile workspace hierarchy;
- compact left navigation on desktop;
- bottom navigation on mobile;
- sticky and draggable Content Rail;
- clearer cards, sheets and form fields;
- stronger drop feedback;
- responsive feed workspace and inspector;
- 44px interaction targets;
- 16px form controls;
- safe-area aware spacing;
- reduced-motion handling;
- long-list paint optimization with `content-visibility`.

## Still requires physical-device verification

These were not tested on a physical iPhone from this environment:
- Safari standalone PWA safe-area behavior;
- physical long-press drag gesture;
- iOS keyboard/VisualViewport edge cases;
- Service Worker replacement timing on an already-installed Home Screen PWA.

The release does not claim those physical tests were performed.
