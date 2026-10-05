# Editorial Emulator V3.3 · QA Board + ciclo flexible

## Problemas corregidos

### Board mostraba sólo el primer día de forma evidente
La V3.0 usaba un Board horizontal con columnas de ancho mínimo. En móvil y en algunos anchos de workspace sólo era visible la primera columna y el resto dependía de scroll horizontal poco evidente.

V3.3 cambia el comportamiento:
- desktop ancho: 7 días visibles en la misma grilla;
- desktop/tablet medio: grilla responsive en varias filas;
- móvil: los 7 días aparecen en una lista vertical estable;
- se elimina la dependencia del scroll horizontal para descubrir el resto de la semana.

### La semana estaba conceptualmente fijada a lunes
V3.3 añade un control `Primer día del ciclo` dentro del planificador.

El escenario conserva 7 días, pero se presentan en orden a partir de la fecha inicial real del escenario.

Ejemplo con inicio 2026-10-08:
1. Jueves 8
2. Viernes 9
3. Sábado 10
4. Domingo 11
5. Lunes 12
6. Martes 13
7. Miércoles 14

El siguiente jueves inicia el siguiente ciclo de 7 días.

## Persistencia
Al cambiar la fecha inicial:
- se actualiza `scenario.range.start`;
- `scenario.range.end` pasa a ser start + 6 días;
- no se modifican ni borran los slots;
- la modificación se guarda en `jocEditorialV9Scenarios` y entra en el bridge Cloud existente;
- la app recarga para que el runtime legacy y el planificador V3.3 queden alineados.

## Vistas
Board, Timeline y Agenda se reordenan según el mismo inicio de ciclo y muestran fechas reales.

## Compatibilidad
No cambia los IDs de día existentes:
- Domingo = 0
- Lunes = 1
- Martes = 2
- Miércoles = 3
- Jueves = 4
- Viernes = 5
- Sábado = 6

Sólo cambia el orden visual/operativo del ciclo, preservando el contrato de datos, Supabase y MCP.

## Archivos
- `js/flexible-week-v33.js`
- `css/system-v33.css`
- `js/bootstrap-v33.js`
- `supabase-config.js`
- `sw.js`
- `manifest.webmanifest`

## Validación pendiente
Debe validarse físicamente en iPhone/PWA y Desktop Mac para confirmar sensación de drag entre días con el Board vertical/responsive. La corrección de estructura y orden de DOM sí está implementada en la build V3.3.
