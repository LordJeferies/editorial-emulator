# Editorial Emulator

## V2.5 · reparación funcional + rediseño responsive

### P0 reparado
- Se confirmó la causa real de los botones muertos de la landing: `ui-v24.js` tenía una llave `}` extra al cerrar `scenarioCreate()`, por lo que el módulo fallaba al parsear antes de ejecutar `initUI()`.
- La landing podía dibujarse porque era HTML estático, pero ningún handler llegaba a enlazarse.
- V2.5 deja de cargar `ui-v24.js`.
- Nuevo `ui-v25.js` validado con `node --check`.
- Nuevo `boot-v25.js` validado con `node --check`.
- `boot-v24.js` queda sólo como compatibilidad y redirige a V2.5.

### Arranque local-first
- La UI se inicializa antes de Supabase.
- Abrir/crear escenarios no depende de red, sesión ni SDK cloud.
- El módulo cloud se importa bajo demanda y sus fallos no bloquean el workspace.
- La landing actualiza inmediatamente a V2.5 y muestra un error visible si el bootstrap falla.

### Escenarios
- “Usar escenario existente” abre un selector visual en grid.
- “Crear escenario nuevo” abre Base JOC / semana vacía / duplicar escenario.
- Crear entra directamente al workspace y se autosalva localmente.
- El selector ofrece acceso directo a crear un escenario si aún no existe ninguno.

### Frontend V2.5
- Nuevo sistema visual `system-v25.css`.
- Desktop: navegación lateral compacta + workspace amplio.
- Mobile/tablet: workspace de una columna + bottom navigation.
- Content Rail sticky y visible, expandible, con drag/tap fallback.
- Drop targets con feedback más claro.
- Cards, sheets, formularios e inspector de feeds con mayor jerarquía.
- Responsive por CSS logical pixels, safe areas y `100dvh`.
- Inputs >=16px y targets principales >=44px.
- `content-visibility` para tarjetas largas de feeds.
- reduced motion.

### PWA/cache
- Cache `editorial-emulator-v2-5`.
- HTML/CSS/JS/manifest en network-first.
- Se eliminan caches `editorial-emulator-*` anteriores al activar V2.5.
- `start_url` y shortcuts usan `?v=25`.

## V2.4 · intento de recuperación con regresión de parsing

V2.4 introdujo mejoras de diseño y local-first, pero la versión publicada de `ui-v24.js` contenía un error de sintaxis en `scenarioCreate()`. Por ello la landing se veía correctamente pero los botones no podían enlazarse. V2.5 sustituye ese runtime completo.

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
