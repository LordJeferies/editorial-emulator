# Editorial Emulator V2.8

Aplicación separada de Editorial OS enfocada en **escenarios, planificación visual, Play y simulación de feeds**.

## V2.8

V2.8 aplica una revisión de producto/UI más profunda sin reescribir la lógica que ya funciona.

### Sistema visual

- escala centralizada de spacing;
- pocos radios reutilizables;
- alturas de controles consistentes;
- tokens semánticos de superficie, texto, borde, estado y material;
- tipografía de sistema Apple/system-ui;
- contraste y elevación más controlados;
- estados hover/focus/active/disabled;
- reduced motion y reduced transparency.

### Responsive

La composición cambia por comportamiento, no sólo por ancho:

- desktop: sidebar + workspace + inspector;
- tablet: sidebar compacta + workspace, inspector reubicado;
- móvil: workspace de una columna + navegación inferior + sheets;
- `visualViewport`, `100dvh` y safe areas;
- objetivos táctiles de ~44 CSS px;
- inputs de 16 px para Safari móvil.

### Productividad

- `Cmd/Ctrl+K`: Acciones rápidas;
- `Cmd/Ctrl+N`: nuevo contenido;
- `/`: buscar contenido;
- `1 / 2 / 3`: Plan / Feeds / Biblioteca;
- `Space`: Play/Stop;
- `?`: ayuda;
- Undo/Redo y Borrar todo siguen disponibles.

### Feeds

- Mobile / Desktop;
- Instagram: Grid / Feed / Reels;
- TikTok: Grid / Feed vertical;
- LinkedIn: Grid / Feed;
- YouTube: Grid / Videos / Player;
- Facebook: Grid / Feed;
- el escenario no se duplica al cambiar de visor;
- la vista Desktop amplía grillas y reproductores.

### Liquid Glass

V2.8 usa `@ybouane/liquidglass` únicamente como mejora progresiva sobre la pantalla inicial, que es un root pequeño y ligero. Planner, feeds y biblioteca quedan fuera de la captura WebGL. Si el módulo no carga o el usuario reduce transparencia/movimiento, la UI mantiene el material CSS estable.

## Local-first

La app no necesita Supabase para abrir, crear escenarios, editar el plan, usar Undo/Redo ni revisar los feeds.

Orden:

1. cargar estado local;
2. montar UI;
3. enlazar controles;
4. guardar localmente cada cambio;
5. sincronizar Supabase después.

Contratos preservados:

- `jocEditorialV9AppData`
- `jocEditorialV9Scenarios`
- `editorialEmulatorV2CurrentScenario`
- `editorialEmulatorV2Draft`
- tabla `public.editorial_state`
- `workspace_key = editorial-os`
- payload compatible `version: 9`

## PWA

- Service Worker `editorial-emulator-v2-8`;
- HTML/CSS/JS en network-first;
- caches anteriores `editorial-emulator-*` se eliminan al activar la build nueva;
- `display: standalone`;
- safe areas;
- fallback offline.

## URL

- Repo: `https://github.com/LordJeferies/editorial-emulator`
- Page: `https://lordjeferies.github.io/editorial-emulator/?v=28`
- Guía: `https://lordjeferies.github.io/editorial-emulator/help.html?v=28`
