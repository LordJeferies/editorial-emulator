# Editorial Emulator V3.7 — Biblioteca de contenido

## Objetivo

Sustituir la bandeja horizontal de "Contenido disponible" por una biblioteca más estable y fácil de usar mientras se construye el plan.

## Comportamiento

### Desktop

- El plan queda como workspace principal.
- La biblioteca aparece como panel derecho sticky.
- El panel usa tarjetas en grid, no carrusel horizontal.
- Se puede ocultar y volver a abrir con `Contenido`.
- Se puede ampliar para mostrar más tarjetas por fila.
- Search y filtros L1/L2/L3.
- Cada tarjeta conserva `Añadir a día…`.
- Las tarjetas siguen siendo arrastrables hacia Board, Timeline y Agenda con el motor SortableJS V3.6.

### Tablet / móvil

- La biblioteca deja de competir por ancho con el Board.
- Se muestra como sección desplegable encima del planner.
- Las tarjetas se organizan en grid (2 columnas cuando cabe, 1 columna en pantallas estrechas).
- Se puede cerrar para dedicar toda la pantalla al plan.
- `Añadir a día…` sigue siendo el fallback preciso cuando no se quiere usar drag.

## Persistencia

El estado de la biblioteca se guarda en `editorialEmulatorCatalogV37`:

- abierta/cerrada
- ampliada/reducida
- búsqueda
- filtro de lote

No modifica contratos de escenarios, `slots`, Supabase, MCP ni los IDs de contenido.

## Criterios de QA

1. Abrir `?v=37`.
2. Confirmar que no existe carrusel horizontal como presentación principal de la biblioteca.
3. Arrastrar una ficha del panel derecho a un día del Board.
4. Usar `Añadir a día…` sin drag.
5. Filtrar por L1/L2/L3 y buscar por texto.
6. Cerrar y volver a abrir la biblioteca sin perder el plan.
7. Cambiar Board → Timeline → Agenda y confirmar que la biblioteca sigue disponible.
8. Recargar y comprobar persistencia del estado de la biblioteca.
9. En móvil, confirmar que la biblioteca no reduce el ancho del Board.
