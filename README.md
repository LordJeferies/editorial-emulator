# Editorial Emulator V2.7

Aplicación separada de Editorial OS enfocada en **escenarios, planificación visual, Play y simulación de feeds**.

## V2.7

La V2.7 añade dos bloques grandes de funcionalidad:

### Plan

- Content Rail siempre visible.
- Añadir por tap o drag.
- Mover entre días.
- Subir/bajar una pieza.
- **Undo / Redo** reales.
- Atajos `Cmd/Ctrl+Z`, `Shift+Cmd/Ctrl+Z`, `Cmd/Ctrl+Y`.
- **Borrar todo el plan** con confirmación.
- Después de borrar todo, Undo restaura inmediatamente el plan anterior.
- Duplicar escenario.
- Autosave local-first.

### Feeds

Selector de dispositivo:

- **Mobile**
- **Desktop**

Modos por plataforma:

- Instagram: **Grid / Feed / Reels**
- TikTok: **Grid / Feed vertical**
- LinkedIn: **Grid / Feed**
- YouTube: **Grid / Videos / Player**
- Facebook: **Grid / Feed**

La vista Desktop usa un mockup ancho con browser chrome y grillas más grandes. La vista Mobile conserva el mockup de teléfono. El escenario es el mismo: cambiar de dispositivo o modo no duplica los datos.

## Local-first

La app no necesita Supabase para abrir, crear escenarios, editar el plan, usar Undo/Redo o revisar los feeds.

Orden de funcionamiento:

1. cargar estado local;
2. montar UI;
3. enlazar controles;
4. guardar localmente cada cambio;
5. intentar sincronizar Supabase después.

Contratos preservados:

- `jocEditorialV9AppData`
- `jocEditorialV9Scenarios`
- `editorialEmulatorV2CurrentScenario`
- `editorialEmulatorV2Draft`
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
- duplicar un escenario.

## PWA

- Service Worker `editorial-emulator-v2-7`.
- HTML/CSS/JS en network-first.
- caches anteriores `editorial-emulator-*` se eliminan al activar la build nueva.
- `display: standalone`.
- safe areas.
- fallback offline desde cache.

## URL

- Repo: `https://github.com/LordJeferies/editorial-emulator`
- Page: `https://lordjeferies.github.io/editorial-emulator/?v=27`
- Guía: `https://lordjeferies.github.io/editorial-emulator/help.html?v=27`
