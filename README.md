# Editorial Emulator V2.4

Aplicación separada de Editorial OS enfocada exclusivamente en **crear escenarios, organizar contenido, reproducir una simulación y revisar feeds persistentes**.

## Arquitectura V2.4

### Local-first
La UI no depende de Supabase para arrancar. Crear escenarios, añadir/mover contenido, Play y Feeds funcionan con el estado local inmediatamente. Supabase es la capa de sincronización y se inicia después de que la interfaz ya está operativa.

Contratos compartidos:
- `jocEditorialV9`
- `jocEditorialV9AppData`
- `jocEditorialV9Scenarios`
- `jocEditorialV9Cloud`
- tabla `public.editorial_state`
- `workspace_key = editorial-os`
- payload compatible `version: 9`

El repo ya contiene `supabase-config.js` con la configuración pública del mismo proyecto. Si existe una sesión Supabase válida para `lordjeferies.github.io`, se reutiliza automáticamente.

### Escenarios primero
Al abrir la app puedes:
- continuar el último escenario;
- usar uno guardado;
- crear uno nuevo;
- partir de Base JOC, semana vacía o duplicar otro escenario.

Los escenarios se autosalvan.

### Content Rail persistente
La bandeja de contenidos permanece visible en Plan:
- buscar;
- filtrar L1/L2/L3;
- expandir;
- crear contenido;
- arrastrar a un día;
- tocar una ficha para añadirla al día activo como fallback touch.

SortableJS usa clone desde el rail y move/reorder entre días. Si Sortable no carga, el fallback por tap y los menús siguen funcionando.

### Feeds persistentes
Instagram, TikTok, LinkedIn, YouTube y Facebook permanecen montados. Cambiar de plataforma no destruye los otros shells. Los controllers sincronizan por `occurrenceId` y Play activa posts existentes.

### Rendimiento
- store por canales (`planner`, `feeds`, `catalog`, `library`, `cloud`, `scenario`);
- feed derivado cacheado por revisión;
- controllers persistentes;
- keyed DOM patching en los principales feeds;
- sincronización cloud con debounce;
- Service Worker network-first para código de la app;
- boot V2.4 sin purge de cache en cada apertura;
- interfaz inicializada antes que Supabase.

## UX / Design System

V2.4 añade tokens centralizados de spacing, radios, controles, motion, superficies, texto, borders, estados y materiales. Glass queda reservado a navegación, rail y overlays, no a cada contenido. Los controles táctiles importantes parten de 44 CSS px y se respetan safe areas.

También incorpora:
- feedback pressed/focus/selected;
- estados empty/error/success;
- toasts de acciones;
- indicadores Guardado/Sincronizando/Offline;
- `Cmd/Ctrl+K` búsqueda;
- `Cmd/Ctrl+N` crear;
- `Esc` cerrar sheets/visor;
- reduced motion / reduced transparency.

## PWA

- display standalone;
- safe areas;
- cache versionado `editorial-emulator-v2-4`;
- HTML/CSS/JS en network-first;
- fallback offline desde cache;
- scope separado `./`.

## URL

- Repo: `https://github.com/LordJeferies/editorial-emulator`
- Page: `https://lordjeferies.github.io/editorial-emulator/`
- Guía: `https://lordjeferies.github.io/editorial-emulator/help.html`
