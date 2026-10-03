# Criterios de uso del MCP

## Principio central

El MCP debe modificar el **mismo estado editorial** que usan Editorial Emulator y Editorial OS. No debe crear una segunda fuente de verdad.

## Antes de escribir

1. Leer el escenario o plan actual.
2. Confirmar IDs reales de escenario, contenido, marcas, pilares y familias.
3. Evitar crear contenido duplicado cuando ya existe una pieza equivalente.
4. Si el cambio afecta muchas piezas, usar `editorial_apply_batch` para que quede como una sola mutación lógica.

## Planner

- Lunes=1, Martes=2, Miércoles=3, Jueves=4, Viernes=5, Sábado=6, Domingo=0.
- `instance_id` identifica una pieza concreta ya colocada en el plan.
- `content_id` identifica una plantilla o contenido reutilizable.
- No inventar `instance_id` para mover/eliminar; primero leer el plan.
- Cambiar Board/Timeline/Agenda no cambia el estado: son tres vistas del mismo plan.

## Escenarios

Usar escenarios para variaciones reales del plan:

- campaña distinta;
- semana distinta;
- variante A/B;
- prueba de distribución.

No crear un escenario nuevo sólo porque el usuario cambió de vista.

## Seguridad de datos

- Operaciones destructivas (`delete_scenario`, `clear_plan`, `restore_backup`) requieren `confirm=true`.
- Toda mutación MCP crea backup automático.
- Después de cambios grandes ejecutar `editorial_validate_state`.
- No editar ni borrar campos desconocidos del payload.
- No usar `service_role`, secret key ni database password en clientes.

## Contenido

Antes de crear contenido personalizado:

1. usar `editorial_list_content`;
2. filtrar por plataforma o lote si conviene;
3. comprobar que no exista ya una pieza equivalente;
4. crear sólo si representa una unidad editorial reutilizable.

Lotes:

- L1: anclas/prioridad alta;
- L2: distribución principal y soporte fuerte;
- L3: flexible/complementario.

## Feeds

`editorial_preview_feeds` es una vista derivada. No modifica el plan.

Usarlo para comprobar:

- repetición excesiva;
- saturación por día;
- balance por plataforma;
- exceso de un mismo formato;
- continuidad de lanzamiento/campaña.

## Supabase y sincronización

Fuente compartida:

- tabla `public.editorial_state`;
- workspace `editorial-os`;
- payload `version: 9`.

El MCP escribe directamente en Supabase. Para que Web/PWA/Desktop reciba cambios en vivo, esa superficie debe tener una sesión Cloud válida.

## Recuperación

Si un cambio sale mal:

1. `editorial_list_backups`;
2. localizar el backup anterior;
3. explicar qué se va a restaurar;
4. `editorial_restore_backup` con `confirm=true`;
5. `editorial_validate_state`.
