# Editorial Emulator V2.9

Aplicación separada de Editorial OS enfocada en **escenarios, planificación visual, Play y simulación de feeds**, disponible como PWA y como app Desktop para macOS.

## Arquitectura canónica

La aplicación principal sigue siendo la versión pública de GitHub Pages:

`https://lordjeferies.github.io/editorial-emulator/`

Todas las superficies cliente apuntan a la misma aplicación:

- navegador;
- PWA instalada;
- Safari Web App;
- `Editorial Emulator.app` para macOS.

La app Desktop no contiene una segunda copia del frontend. Es un wrapper nativo AppKit + WKWebView que carga la URL canónica. Por eso los cambios publicados en GitHub Pages aparecen en Desktop sin reinstalar el `.app`.

Supabase sigue siendo el backend compartido y la UI conserva el modelo local-first.

## Descargar para Mac

La landing pública incluye **Descargar para Mac**.

Asset estable:

`https://github.com/LordJeferies/editorial-emulator/releases/download/desktop-latest/Editorial-Emulator-macOS.zip`

Requisitos:

- macOS 13+;
- Apple Silicon o Intel según la arquitectura en la que se construya el ZIP;
- el build público actual usa firma ad-hoc, no Developer ID/notarización.

Para tu Mac local, la forma recomendada es construir e instalar desde el repo con `desktop/mac/build-release.sh`.

## Construcción Desktop

Archivos:

- `desktop/mac/App.swift` — ventana AppKit + WKWebView persistente;
- `desktop/mac/Info.plist` — bundle macOS;
- `desktop/mac/build.sh` — compila, genera icono cuando Quick Look puede renderizar el SVG, firma ad-hoc y crea ZIP;
- `desktop/mac/install.sh` — instala en `/Applications` y crea alias en el Escritorio;
- `desktop/mac/build-release.sh` — build + instalación opcional + publicación opcional en GitHub Release;
- `.github/workflows/desktop-macos.yml` — genera y actualiza automáticamente el asset estable `desktop-latest`.

La ventana Desktop conserva almacenamiento WebKit persistente y abre enlaces externos fuera de la aplicación. Los enlaces del propio `lordjeferies.github.io` permanecen dentro de la app.

## Plan

- Content Rail visible;
- añadir por tap o drag;
- mover entre días;
- subir/bajar una pieza;
- Undo / Redo;
- atajos `Cmd/Ctrl+Z`, `Shift+Cmd/Ctrl+Z`, `Cmd/Ctrl+Y`;
- Borrar todo con confirmación;
- Undo restaura inmediatamente un plan vaciado;
- duplicar escenario;
- autosave local-first.

## Feeds

Selector de dispositivo:

- Mobile;
- Desktop.

Modos por plataforma:

- Instagram: Grid / Feed / Reels;
- TikTok: Grid / Feed vertical;
- LinkedIn: Grid / Feed;
- YouTube: Grid / Videos / Player;
- Facebook: Grid / Feed.

La vista Desktop usa un mockup ancho con browser chrome y grillas mayores. La vista Mobile conserva el mockup de teléfono. El escenario es el mismo: cambiar de dispositivo o modo no duplica los datos.

## Productividad

- `Cmd/Ctrl+K`: Acciones rápidas;
- `Cmd/Ctrl+N`: nuevo contenido;
- `/`: buscar contenido;
- `1 / 2 / 3`: Plan / Feeds / Biblioteca;
- `Space`: Play/Stop;
- `?`: ayuda.

## Local-first

La app no necesita Supabase para abrir, crear escenarios, editar el plan, usar Undo/Redo o revisar los feeds.

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

- Service Worker `editorial-emulator-v2-9`;
- HTML/CSS/JS en network-first;
- caches `editorial-emulator-*` anteriores se eliminan al activar una build nueva;
- `display: standalone`;
- safe areas;
- fallback offline.

## URLs

- Repo: `https://github.com/LordJeferies/editorial-emulator`
- Page: `https://lordjeferies.github.io/editorial-emulator/?v=29`
- Guía: `https://lordjeferies.github.io/editorial-emulator/help.html?v=29`
- Desktop Mac: `https://github.com/LordJeferies/editorial-emulator/releases/download/desktop-latest/Editorial-Emulator-macOS.zip`
