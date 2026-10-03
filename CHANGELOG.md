# Editorial Emulator

## V3.2 · Welcome + progreso visible + MCP integrado

### Bienvenida
- Nueva pantalla de bienvenida.
- Explica Plan, Feeds y MCP/Cloud en lenguaje simple.
- Botones para entrar, ver qué hace la app y configurar MCP.
- Opción `No mostrar esta bienvenida cada vez`.
- En aperturas posteriores puede mostrarse brevemente como splash y retirarse sola.

### Progreso
- Barra superior global con porcentaje y mensaje de operación.
- Boot inicial muestra progreso realista de preparación de UI/herramientas.
- Cloud/Supabase refleja `Conectando`, `pendiente`, `Sincronizando`, `sincronizado`, `error` y `offline` en la barra.
- Acciones normales siguen siendo no bloqueantes.
- Existe overlay bloqueante sólo para operaciones que realmente necesitan terminar antes de continuar.
- API interna `window.EDITORIAL_PROGRESS` disponible para módulos futuros.

### MCP
- Servidor MCP local oficial en `mcp/server.mjs`.
- Usa Supabase compartido `public.editorial_state` / `workspace_key=editorial-os` / payload 9.
- Login con usuario real de Supabase; no usa `service_role`.
- Tools para estado, escenarios, planner, biblioteca, taxonomía, feeds, validación, backups y restore.
- Backups automáticos antes de cada mutación MCP.
- Operaciones destructivas requieren `confirm=true`.
- Batch de operaciones del planner en una sola escritura.
- Guías `mcp/README.md`, `CRITERIA.md`, `EXAMPLES.md` y `.env.example`.
- Instalador `mcp/install.sh`.
- Página pública `mcp.html`.
- Panel MCP dentro de la app con instalación rápida y configuración genérica.

### PWA
- Cache `editorial-emulator-v3-2-mcp-progress`.
- Service Worker usa `Promise.allSettled` para que un recurso temporalmente no disponible no invalide toda la instalación.
- Manifest V3.2 con shortcut MCP.

## V3.1 · MCP base
- Primera implementación del servidor MCP conectado al Supabase compartido.
- Panel de acceso MCP desde la app.
- Página pública de configuración.

## V3.0 · Planner multi-vista
- Board/Kanban semanal.
- Timeline semanal.
- Agenda por día.
- Las tres vistas editan el mismo escenario.
- Pointer Events + long-press táctil.
- Alternativas `Añadir a...` y `+ Añadir` para no depender del drag.
- Drop target, ghost, auto-scroll y reordenamiento.

## V2.9 · Desktop macOS + distribución única
- `Editorial Emulator.app` AppKit + WKWebView.
- La `.app` abre la URL canónica de GitHub Pages.
- Almacenamiento WebKit persistente.
- Botón Descargar para Mac.
- Workflow GitHub Actions y release estable `desktop-latest`.
- Supabase Cloud bridge para el runtime standalone.

## V2.8 · design system + responsive + productividad
- Tokens visuales y semánticos.
- `visualViewport`, safe areas y layouts desktop/tablet/mobile.
- Command Palette `Cmd/Ctrl+K`.
- Ayuda contextual.

## V2.7 · visores + historial del Plan
- Mobile/Desktop en Feeds.
- Instagram Grid/Feed/Reels.
- TikTok Grid/Feed.
- LinkedIn Grid/Feed.
- YouTube Grid/Videos/Player.
- Facebook Grid/Feed.
- Undo/Redo.
- Borrar todo con confirmación.

## V2.6 · runtime estable
- Arranque local-first sin Supabase/CDN como requisito.
- Pointer Events.
- Error global visible y recarga limpia.
