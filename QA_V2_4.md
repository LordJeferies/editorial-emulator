# QA · Editorial Emulator V2.4

## Problema reparado

La V2.3 podía fallar durante el parsing/import del módulo de UI antes de ejecutar `initUI()`. Resultado: la landing se pintaba pero los botones no tenían handlers y aparecía `Unexpected token '}'...`.

V2.4 evita ese módulo y usa `ui-v24.js`, comprobado sintácticamente antes de publicarse.

## Validación realizada

- `node --check js/ui-v24.js`: PASS.
- `node --check js/boot-v24.js`: PASS.
- `node --check sw-v24.js`: PASS antes de publicar como `sw.js`.
- módulos base de la copia V2 local (`store`, `cloud`, `feeds`, `controllers`, `defaults`): syntax PASS.
- HTML V2.4: IDs duplicados = 0.
- HTML referencia `boot-v24.js?v=24`: PASS.
- HTML referencia `system-v24.css?v=24`: PASS.
- `supabase-config.js` permanece configurado en el repo: PASS.
- `workspace_key = editorial-os` permanece en `cloud.js`: PASS.
- manifest standalone y scope `./`: PASS.
- Service Worker cache `editorial-emulator-v2-4`: PASS.
- UI arranca antes de `cloud.init()`: PASS por revisión de contrato del bootstrap.
- Content Rail tiene fallback por tap además de SortableJS: PASS por revisión de contrato.
- feedback de drag/drop, empty states, toast, focus y pressed state: PASS por revisión CSS/JS.

## Responsive / PWA

Revisión estructural realizada para safe areas, `100dvh`, touch targets y layout compacto. Se añadieron tokens y reglas específicas hasta <=390 CSS px, además del layout <=900 px existente.

## Limitación explícita

El entorno de QA headless disponible no produjo una sesión Chromium utilizable para interacción visual completa; por tanto no se declara como probado físicamente en Safari/iPhone ni se afirma un test E2E real de clicks en GitHub Pages. El código publicado sí fue validado estáticamente y los módulos V2.4 nuevos pasaron `node --check`.

La comprobación final que debe hacerse en el navegador real es:
1. abrir `?v=24`;
2. pulsar `Usar escenario existente`;
3. cerrar el sheet;
4. pulsar `Crear escenario nuevo`;
5. crear Base JOC;
6. tocar/arrastrar una pieza del rail;
7. Play;
8. abrir Feeds y recorrer plataformas.
