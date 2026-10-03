# Editorial Emulator V3.0 — QA Planner

## Evidencia revisada

Se revisó la grabación `ScreenRecording_10-03-2026 16-19-32_1.MP4` (~52 s, iPhone 1290×2796 @ ~60 fps) y se extrajeron cuadros del flujo Plan → Feeds → Biblioteca → Herramientas → Inicio.

## Problemas visibles atacados

1. El planificador móvil dependía demasiado de una vista de un solo día y de una bandeja horizontal pequeña; esto hacía difícil entender el destino del drag.
2. Las tarjetas fuente eran estrechas y el scroll horizontal competía con el gesto de arrastre.
3. El drag táctil no comunicaba bien cuándo comenzaba, qué se movía ni dónde podía soltarse.
4. Faltaba una alternativa explícita y fiable al drag para añadir contenido a un día concreto.
5. La navegación inferior podía competir con el contenido al final de la pantalla.
6. Los tabs de Biblioteca podían quedar recortados en ancho móvil.
7. El visor Desktop dentro de móvil podía forzar geometrías incómodas/overflow.
8. La pantalla inicial podía verse visualmente inconsistente con el resto del producto por el material claro.

## V3.0 — nuevo planificador

Las tres vistas editan el MISMO escenario / slots existentes. Cambiar de vista no crea copias, no borra y no transforma el modelo de datos.

### Board
- 7 columnas semanales tipo board/Trello.
- En móvil cada columna ocupa ~82vw y usa scroll-snap.
- Drop target visible.
- Cards con drag handle.
- Botón `+` por día.

### Timeline
- Una fila por día.
- Publicaciones en track horizontal compacto.
- Útil para densidad y orden semanal.

### Agenda
- Lista agrupada por día.
- Controles explícitos subir/bajar.
- Menú de pieza existente.
- Alternativa para usuarios que no quieran drag.

## Drag & Drop

- Pointer Events, no HTML5 drag nativo.
- Mouse, trackpad y touch.
- Long-press táctil antes de iniciar arrastre.
- Umbral de movimiento para evitar arrastres accidentales.
- Ghost flotante durante el gesto.
- Destino válido resaltado.
- Auto-scroll de ventana/board cerca de bordes.
- Cancelación si no hay destino.
- Mantiene los handlers originales para que Undo/Redo y persistencia sigan pasando por el runtime existente.

## Fallback sin drag

Cada contenido tiene `Añadir a…`, que abre una selección de Lunes a Domingo. Cada día también ofrece `+ Añadir` para elegir desde el catálogo.

Esto permite construir exactamente el mismo plan de tres maneras:
- drag;
- elegir día desde la pieza;
- elegir pieza desde el día.

## Compatibilidad

Se preservan:
- `jocEditorialV9AppData`
- `jocEditorialV9Scenarios`
- `editorialEmulatorV2Draft`
- `editorialEmulatorV2CurrentScenario`
- Supabase `public.editorial_state`
- workspace `editorial-os`
- Undo / Redo del runtime actual.

## PWA

Cache actual: `editorial-emulator-v3-0`.

Incluye offline:
- `css/system-v30.css`
- `js/bootstrap-v30.js`
- `js/planner-v30.js`
- cloud bridge actual.

## Validación ejecutada

- `node --check planner-v30.js`: PASS antes de publicar.
- El código usa Pointer Events y no requiere CDN de drag/drop.
- El planificador nuevo lee el escenario activo y delega mutaciones en los handlers ya existentes para conservar historial/persistencia.

## Limitación de QA

No se hizo una prueba física posterior a V3.0 en el iPhone del usuario desde este entorno. La grabación suministrada sí fue inspeccionada visualmente y se usó como base de las correcciones. La prueba final de gesto real debe hacerse abriendo `?v=30` en el mismo iPhone/PWA.
