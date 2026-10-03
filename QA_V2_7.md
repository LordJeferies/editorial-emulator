# Editorial Emulator V2.7 · QA

## Funciones añadidas

- Selector **Mobile / Desktop** en Feeds.
- Modos por plataforma:
  - Instagram: Grid / Feed / Reels.
  - TikTok: Grid / Feed vertical.
  - LinkedIn: Grid / Feed.
  - YouTube: Grid / Videos / Player.
  - Facebook: Grid / Feed.
- Mockup Desktop con browser chrome y superficies más amplias.
- Inspector de publicación activa y métricas de la semana.
- **Undo / Redo** para cambios de plan, semana y marca.
- **Borrar todo** con confirmación y posibilidad de recuperar mediante Undo.
- Atajos `Cmd/Ctrl+Z`, `Shift+Cmd/Ctrl+Z` y `Cmd/Ctrl+Y`.
- Content Rail sigue visible y usable por tap o drag.
- Runtime local-first: Supabase continúa siendo opcional para arrancar y editar.
- Cache PWA `editorial-emulator-v2-7`.

## Contratos preservados

- `jocEditorialV9AppData`
- `jocEditorialV9Scenarios`
- `editorialEmulatorV2CurrentScenario`
- `editorialEmulatorV2Draft`
- Supabase `public.editorial_state`
- `workspace_key = editorial-os`
- payload compatible `version = 9`

## Validación realizada

- `runtime-v27.js` fue preparado y validado con `node --check` antes de publicarse.
- `index.html` fue validado sin IDs duplicados antes de publicarse.
- `manifest.webmanifest` se actualizó a V2.7.
- Service Worker actualizado a `editorial-emulator-v2-7` con network-first para HTML/CSS/JS.

## Limitación

La interacción física exacta de Safari/iOS/PWA (touch, safe-area y scroll interno real) requiere confirmación en el dispositivo después de que GitHub Pages propague la nueva versión. La aplicación sigue siendo local-first y no depende de Supabase para que funcionen los controles de Plan o Feeds.