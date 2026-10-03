# Editorial Emulator V2.5

Aplicación separada de Editorial OS enfocada en **escenarios, planificación visual, Play y simulación persistente de feeds**.

## Corrección crítica V2.5

V2.4 contenía un error de sintaxis en `ui-v24.js` dentro del cierre de `scenarioCreate()`. El navegador podía cargar correctamente la landing, pero el módulo no terminaba de parsear; por eso **Usar escenario existente** y **Crear escenario nuevo** no llegaban a enlazar sus handlers.

V2.5 deja de usar ese módulo roto. `boot-v24.js` sólo redirige al bootstrap V2.5 y la UI real vive en `ui-v25.js`, que se validó con `node --check` antes de publicarse.

## Local-first

La app debe funcionar aunque Supabase no esté disponible. El orden es:

1. cargar store local;
2. montar UI;
3. enlazar botones;
4. permitir abrir/crear escenarios;
5. iniciar Supabase en segundo plano.

Contratos preservados:
- `jocEditorialV9`
- `jocEditorialV9AppData`
- `jocEditorialV9Scenarios`
- `jocEditorialV9Cloud`
- tabla `public.editorial_state`
- `workspace_key = editorial-os`
- payload compatible `version: 9`

## Escenarios

En la landing puedes:
- continuar el último escenario;
- abrir uno existente;
- crear uno nuevo;
- partir de Base JOC;
- empezar una semana vacía;
- duplicar un escenario existente.

Los escenarios se guardan localmente inmediatamente y la nube sincroniza después.

## UI V2.5

La capa `system-v25.css` reorganiza la aplicación sobre una arquitectura visual más profesional:
- desktop: navegación lateral compacta + workspace amplio;
- tablet/móvil: workspace de una columna + bottom navigation;
- Content Rail siempre visible y sticky;
- drag & drop con feedback de drop target;
- cards más legibles y jerarquía consistente;
- sheets más claras;
- responsive real con safe areas y `100dvh`;
- inputs de 16 px y controles táctiles de 44 px;
- inspector de feed sticky en desktop;
- feeds con scroll contenido y `content-visibility` en listas largas;
- reduced motion.

## Content Rail

La bandeja permite:
- buscar;
- filtrar L1/L2/L3;
- expandir;
- crear contenido;
- arrastrar desde catálogo a un día;
- reordenar entre días;
- tocar una ficha como fallback si drag no está disponible.

## Feeds persistentes

Instagram, TikTok, LinkedIn, YouTube y Facebook permanecen montados. Cambiar de plataforma no destruye los shells. Los controllers sincronizan por `occurrenceId`, Play activa nodos existentes y TikTok usa scroll-snap/IntersectionObserver para mantener la publicación activa.

## Rendimiento

- store por canales (`planner`, `feeds`, `catalog`, `library`, `cloud`, `scenario`);
- feeds cacheados por `dataRevision`;
- controllers persistentes;
- keyed DOM patching;
- Supabase lazy-loaded;
- sincronización cloud con debounce;
- Service Worker `editorial-emulator-v2-5`;
- HTML/CSS/JS en network-first;
- caches `editorial-emulator-*` anteriores se eliminan al activar V2.5.

## PWA

- `display: standalone`;
- safe areas;
- scope separado `./`;
- `start_url: ./?v=25`;
- fallback offline desde cache.

## URL

- Repo: `https://github.com/LordJeferies/editorial-emulator`
- Page: `https://lordjeferies.github.io/editorial-emulator/?v=25`
- Guía: `https://lordjeferies.github.io/editorial-emulator/help.html?v=25`
