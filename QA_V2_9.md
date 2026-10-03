# QA · Editorial Emulator V2.9

## Web / PWA
- `index.html` declara V2.9.
- Manifest `start_url` y shortcuts usan `?v=29`.
- Service Worker usa cache `editorial-emulator-v2-9`.
- `system-v29.css` se precachea.
- Botón `Descargar para Mac` apunta al asset estable `desktop-latest`.
- Runtime funcional existente se conserva: `runtime-v27.js` + mejoras UX V2.8.
- Supabase continúa sin bloquear el arranque local-first.

## Desktop macOS
- Wrapper: AppKit + WKWebView.
- URL canónica: `https://lordjeferies.github.io/editorial-emulator/`.
- `WKWebsiteDataStore.default()` para persistencia local WebKit.
- Enlaces externos salen al navegador.
- Ventana guarda geometría mediante `setFrameAutosaveName`.
- `build.sh` compila con `swiftc`, crea bundle `.app`, intenta generar `.icns`, firma ad-hoc y empaqueta ZIP.
- `install.sh` instala en `/Applications`, elimina cuarentena local y crea alias en Desktop cuando Finder lo permite.
- `build-release.sh --publish` actualiza el asset estable de GitHub Release.
- Workflow GitHub Actions compila en runner macOS y publica `Editorial-Emulator-macOS.zip`.

## Importante
- El `.app` público usa firma ad-hoc, no Developer ID ni notarización de Apple. Gatekeeper puede requerir instalación mediante el script local o autorización manual si el ZIP se descarga desde internet.
- El wrapper Desktop no necesita reconstruirse para cada cambio del frontend porque carga GitHub Pages. Sólo requiere rebuild cuando cambia el propio wrapper nativo, icono o metadata del bundle.
- No se afirma una validación física del `.app` en el Mac del usuario desde este entorno. El build se valida realmente cuando se ejecuta el script o el workflow macOS.
