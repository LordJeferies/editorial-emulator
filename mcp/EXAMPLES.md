# Ejemplos de uso del MCP

Estos ejemplos están escritos como instrucciones naturales para un agente con el MCP conectado.

## 1. Ver qué hay

> Muéstrame los escenarios actuales y dime cuántas piezas tiene cada uno.

Tools esperados:

1. `editorial_list_scenarios`
2. opcionalmente `editorial_validate_state`

## 2. Crear una semana desde Base JOC

> Crea un escenario llamado “Semana campaña CRM” desde Base JOC, empezando el 2026-10-05.

Tool:

`editorial_create_scenario`

```json
{
  "name": "Semana campaña CRM",
  "brand_id": "joc",
  "start_date": "2026-10-05",
  "mode": "joc_base"
}
```

## 3. Añadir un webinar el miércoles

> En el escenario X, añade un clip de webinar al miércoles.

Flujo:

1. `editorial_list_content` con `platform` opcional.
2. localizar `webinar`.
3. `editorial_add_content` con `day: 3`.

## 4. Mover una pieza

> Mueve “Carrusel principal” del martes al jueves y ponlo primero.

Flujo:

1. `editorial_get_plan`.
2. identificar el `instance_id` correcto.
3. `editorial_move_item` con `to_day: 4`, `to_index: 0`.

## 5. Reorganizar varias cosas de una vez

> Pasa el webinar al lunes, elimina el meme emocional del viernes y añade un testimonio al domingo.

Usar `editorial_apply_batch` para que sea una sola operación lógica y un solo backup.

## 6. Auditar balance de redes

> Analiza este escenario y dime si Instagram, TikTok y LinkedIn están balanceados durante la semana.

Flujo:

1. `editorial_preview_feeds` por plataforma.
2. comparar conteos y días.
3. no modificar nada salvo que el usuario lo pida.

## 7. Crear un contenido nuevo

> Crea una pieza reutilizable “Caso CRM perdido por seguimiento” para LinkedIn e Instagram, L2, formato Video.

Tool:

`editorial_create_content`

Después se puede añadir a cualquier escenario con `editorial_add_content`.

## 8. Duplicar antes de experimentar

> Quiero probar una variante más agresiva de esta semana sin tocar la original.

Flujo recomendado:

1. `editorial_duplicate_scenario`.
2. trabajar únicamente sobre el nuevo `scenario_id`.

## 9. Borrar el plan

> Vacía por completo el escenario X.

El agente debe explicar que es destructivo y usar:

```json
{
  "scenario_id": "...",
  "confirm": true
}
```

con `editorial_clear_plan`.

El MCP crea un backup antes de vaciarlo.

## 10. Recuperar un error

> Lo que acabamos de hacer quedó mal. Vuelve al estado anterior.

Flujo:

1. `editorial_list_backups`.
2. elegir el backup más reciente relacionado.
3. `editorial_restore_backup` con `confirm:true`.
4. `editorial_validate_state`.

## 11. Crear taxonomía

> Añade un pilar llamado “CRM y sistemas” y una familia llamada “Errores de CRM” dentro de ese pilar.

Flujo:

1. `editorial_create_taxonomy` con `kind:pillar`.
2. usar el ID devuelto.
3. `editorial_create_taxonomy` con `kind:family` y `pillar_id`.

## 12. Brief completo para agente

> Revisa el escenario de esta semana. No borres nada. Detecta días saturados, repetición de formatos y plataformas desatendidas. Luego propón una reorganización. Si apruebo la propuesta, aplícala en un solo batch y valida el estado al terminar.

Este patrón separa análisis de escritura y es el recomendado para cambios editoriales importantes.
