# Editorial Emulator

## V2.4 · estabilidad local-first y pulido UI/UX

### Reparación crítica
- Se reemplaza el módulo UI V2.3 que provocaba el error de parsing `Unexpected token '}'` antes de que los botones pudieran enlazarse.
- Nuevo `ui-v24.js` verificado sintácticamente.
- Nuevo `boot-v24.js`: inicializa la interfaz primero y Supabase después, sin bloquear el uso.
- Se elimina el purge/warm de todos los caches en cada arranque.
- Service Worker `editorial-emulator-v2-4`, network-first para código y cache offline como fallback.

### Local-first / Supabase
- `supabase-config.js` sigue preconfigurado con el mismo proyecto de Editorial OS.
- Abrir, crear y editar escenarios no requieren red.
- La sesión Supabase existente del mismo origin se reutiliza automáticamente si está disponible.
- Sync conserva `workspace_key = editorial-os` y payload compatible `version: 9`.
- Login manual queda como opción avanzada, no como requisito de uso.

### Interacción
- Startup funcional: continuar, usar existente y crear nuevo.
- Content Rail con drag & drop y fallback por tap.
- Feedback inmediato para drop, crear, mover, eliminar y duplicar.
- Confirmación al quitar una pieza del plan.
- Empty states en planner, biblioteca y escenarios.
- Keyboard: Cmd/Ctrl+K, Cmd/Ctrl+N y Escape.

### Design system
- Tokens de spacing, radius, controles, motion, surfaces, borders, semantic colors y shadows.
- Touch targets principales de 44 CSS px.
- Focus visible y pressed feedback.
- Safe areas móviles.
- Glass limitado a navegación/floating UI/sheets.
- `prefers-reduced-motion` y `prefers-reduced-transparency`.

### Ayuda
- Guía interna actualizada a V2.4.
- Explicación por escenarios de uso.
- Flujo completo Plan → Play → Feeds → ajustes.
- Explicación explícita de autosave local y sincronización cloud.

## V2

- Landing de escenarios: continuar, abrir existente o crear nuevo.
- Autosave de escenario activo.
- Base JOC / semana vacía / duplicar escenario.
- Content Rail persistente y expandible.
- SortableJS clone desde rail + reorder/move entre días.
- Store por canales; se elimina render global como reacción normal.
- Cache de ocurrencias por revisión de datos.
- Feed controllers persistentes.
- Instagram Profile/Feed persistentes.
- TikTok vertical scroll-snap con metadata de contenido real.
- LinkedIn y Facebook con shells separados.
- YouTube distingue Shorts vs horizontal/episodio.
- Play activa y desplaza a una occurrence existente.
- Inspector de publicación activa.
- Formularios simplificados para contenido, pilares, familias y marcas.
- Mismo Supabase/workspace/payload que Editorial OS.
