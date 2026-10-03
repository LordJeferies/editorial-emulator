# Editorial Emulator V2.6 · QA de estabilidad

## Cambio estructural
V2.6 elimina del arranque normal la cadena ESM `boot-v25.js → ui-v25.js → store/defaults/feeds/controllers/cloud` y la sustituye por un runtime clásico único: `js/runtime-v26.js`.

Esto reduce los puntos de fallo que dejaban la landing visible pero sin handlers.

## P0 cubierto
- `#useExistingBtn` se enlaza directamente en `runtime-v26.js`.
- `#createScenarioBtn` se enlaza directamente en `runtime-v26.js`.
- Abrir y crear escenarios no importan módulos, no esperan Supabase y no dependen de SortableJS.
- Supabase se carga sólo después y únicamente si existe configuración/sesión.

## Cache/PWA
- Service Worker nuevo: `editorial-emulator-v2-6`.
- Primera ejecución V2.6 hace una migración única: unregister de workers anteriores + borrado de caches `editorial-emulator-*`.
- Código de aplicación usa network-first con `cache: no-store`.

## Validación estática ejecutada antes de publicar
- `node --check js/runtime-v26.js`: OK.
- `node --check sw.js`: OK.
- `manifest.webmanifest`: JSON válido.
- IDs duplicados en `index.html`: 0.

## Diseño
- App shell nuevo desktop/tablet/mobile.
- Sidebar desktop + bottom nav móvil.
- Content rail sticky.
- Drag mediante Pointer Events sin librería externa.
- Tap fallback para añadir contenidos.
- Feed viewer responsive con Instagram 3-column grid y TikTok scroll-snap.
- Inputs de formulario a 16px y controles principales de 44px.
- Safe areas y `100dvh`.

## Datos preservados
- `jocEditorialV9AppData`
- `jocEditorialV9Scenarios`
- `editorialEmulatorV2CurrentScenario`
- `editorialEmulatorV2Draft`
- Supabase `public.editorial_state`
- `workspace_key = editorial-os`
- payload compatible `version: 9`

## Prueba todavía necesaria en dispositivo
El runtime se validó sintácticamente y la estructura se publicó. La interacción física exacta en Safari/PWA instalada debe comprobarse en el iPhone/Mac del usuario, especialmente drag táctil y migración de Service Worker.