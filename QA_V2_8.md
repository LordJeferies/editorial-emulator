# Editorial Emulator V2.8 · QA

## Alcance aplicado

V2.8 toma como requisitos explícitos las directrices de frontend/UX suministradas por el usuario: jerarquía de información, responsive real, touch, PWA, sistema visual, estados, feedback, accesibilidad, rendimiento percibido, densidad profesional, design tokens y materiales selectivos.

## Verificaciones realizadas sobre el repo

- `index.html` declara build 2.8.
- `index.html` mantiene `runtime-v27.js` como lógica estable y añade `ux-v28.js` como mejora incremental.
- `system-v28.css` se carga después de V2.7 como capa de sistema/override.
- `manifest.webmanifest` usa V2.8 y `?v=28`.
- `sw.js` usa cache `editorial-emulator-v2-8`.
- Service Worker precachea `system-v28.css`, `ux-v28.js` y `liquidglass-v28.js`.
- Los contratos local-first existentes no se renombraron.
- La configuración Supabase existente no se sustituyó.
- Los controles de Undo, Redo, Borrar todo, Mobile/Desktop y modos de feed siguen en el HTML base.

## Cambios de UX cubiertos

- escala de spacing centralizada;
- tokens semánticos y de material;
- geometría consistente de controles;
- focus visible;
- pressed/disabled states;
- targets touch;
- `visualViewport` -> variables CSS;
- safe areas;
- composición desktop/tablet/mobile;
- inspector desktop y reflow tablet/mobile;
- command palette `Cmd/Ctrl+K`;
- shortcuts `Cmd/Ctrl+N`, `/`, `1/2/3`, `Space`, `?`;
- estados Offline / Local visibles;
- ayuda contextual V2.8;
- reduced motion/transparency;
- LiquidGlass progresivo limitado al onboarding para no capturar Planner/Feeds completos.

## No afirmado como probado

No se realizó en esta iteración una prueba física en Safari iPhone/iPad ni una captura automatizada de GitHub Pages después de propagación. Esas verificaciones deben hacerse sobre la URL pública tras el despliegue. V2.8 evita declarar esas pruebas como PASS sin evidencia.

## URL objetivo

`https://lordjeferies.github.io/editorial-emulator/?v=28`
