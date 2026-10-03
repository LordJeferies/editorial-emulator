# Editorial Emulator

## V2.9 · Desktop macOS + distribución única

### Desktop
- Nueva `Editorial Emulator.app` nativa ligera construida con AppKit + WKWebView.
- La `.app` carga la URL canónica `https://lordjeferies.github.io/editorial-emulator/`; no contiene una copia separada del frontend.
- La UI publicada en GitHub Pages se actualiza dentro de Desktop sin reinstalar la aplicación.
- Almacenamiento WebKit persistente.
- Enlaces externos se abren en el navegador por defecto; los enlaces de `lordjeferies.github.io` permanecen dentro de la app.
- Ventana redimensionable con geometría persistente.
- Menú nativo con editar, recargar, abrir en navegador y salir.

### Descarga
- Botón `Descargar para Mac` en la landing pública.
- Acceso adicional desde la barra superior y la guía.
- Asset estable: `releases/download/desktop-latest/Editorial-Emulator-macOS.zip`.
- Workflow GitHub Actions `.github/workflows/desktop-macos.yml` construye el ZIP en macOS y actualiza el asset estable.

### Tooling macOS
- `desktop/mac/App.swift`
- `desktop/mac/Info.plist`
- `desktop/mac/build.sh`
- `desktop/mac/install.sh`
- `desktop/mac/build-release.sh`
- generación de `.app`, icono `.icns` cuando Quick Look puede renderizar el SVG, firma ad-hoc, ZIP, instalación en `/Applications` y alias de Escritorio.

### PWA
- Cache `editorial-emulator-v2-9`.
- Manifest y ayuda actualizados a V2.9.
- La PWA sigue siendo una superficie cliente de la misma aplicación canónica.

## V2.8 · design system + responsive + productividad
- Tokens visuales y semánticos centralizados.
- `visualViewport`, safe areas y composición diferenciada desktop/tablet/mobile.
- Command Palette `Cmd/Ctrl+K`.
- Atajos de productividad.
- Ayuda contextual por escenario.
- Liquid Glass progresivo únicamente en roots pequeños.

## V2.7 · visores + historial de Plan
- Mobile/Desktop en Feeds.
- Instagram Grid/Feed/Reels.
- TikTok Grid/Feed.
- LinkedIn Grid/Feed.
- YouTube Grid/Videos/Player.
- Facebook Grid/Feed.
- Undo/Redo.
- Borrar todo con confirmación y recuperación mediante Undo.

## V2.6 · runtime estable
- Arranque monolítico local-first sin depender de Supabase/CDN para la landing y escenarios.
- Pointer Events para drag/touch.
- Error global visible y recarga limpia.

## V2.5 · reparación funcional + rediseño responsive

### P0 reparado
- Se confirmó la causa de los botones muertos de la landing en la rama modular anterior: `ui-v24.js` tenía una llave extra al cerrar `scenarioCreate()`.
- La UI se inicializa antes de Supabase.
- Abrir/crear escenarios no depende de red, sesión ni SDK cloud.

### Frontend
- Desktop: navegación lateral compacta + workspace amplio.
- Mobile/tablet: workspace de una columna + bottom navigation.
- Content Rail sticky y visible.
- Safe areas, `100dvh`, inputs >=16px y targets principales >=44px.

## V2
- Landing de escenarios.
- Autosave.
- Base JOC / semana vacía / duplicar.
- Content Rail.
- Feeds persistentes.
- Play e inspector.
- Mismo Supabase/workspace/payload que Editorial OS.
