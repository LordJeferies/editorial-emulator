# Editorial Emulator V3.8 — Content Drawer + Semantic Monochrome Theme

## Objetivo

Hacer que `Contenido disponible` sea siempre descubrible y cómodo en desktop y PWA/móvil, sin volver al carrusel horizontal, y simplificar la jerarquía visual de la app con una base blanco/negro/grises y color reservado a información semántica.

## Contenido disponible

### Desktop

- Botón visible `Contenido` junto al selector Board / Timeline / Agenda.
- El botón abre/cierra la biblioteca lateral derecha.
- La biblioteca conserva búsqueda, filtros L1/L2/L3 y grid.
- Las tarjetas se pueden arrastrar al plan o usar `Elegir día`.

### PWA / móvil

- El mismo botón `Contenido` abre/cierra una bandeja inferior.
- Si la bandeja está cerrada, existe además un botón flotante `Contenido` para recuperarla fácilmente.
- La bandeja tiene un grabber superior y puede ajustarse manualmente a tres alturas aproximadas: compacta, media y grande.
- El contenido interno hace scroll independiente.
- El Board queda detrás y no necesita recargar la página.
- Drag & drop sigue usando el motor V3.6 y el botón `Elegir día` sigue siendo el fallback accesible.

## Interacción

- Abrir/cerrar la biblioteca no cambia el escenario.
- Cambiar la altura no cambia datos.
- La altura elegida se conserva localmente.
- Escape cierra la bandeja en viewport móvil/compacto.
- La biblioteca vuelve a conectar el motor DnD después de cambios de tamaño.

## Paleta

Base de interfaz:

- fondo principal: casi negro;
- superficies: negro/gris oscuro;
- texto: blanco y grises;
- bordes: grises neutros.

Color sólo para jerarquía/semántica:

- L1: ámbar;
- L2: azul;
- L3: verde;
- selección/ciclo: violeta tenue;
- info/Contenido: azul;
- éxito: verde;
- warning: ámbar;
- error/destructivo: rojo.

El objetivo es evitar una interfaz multicolor sin significado. Los colores deben ayudar a identificar estado, prioridad o tipo.

## PWA

- `manifest.webmanifest` actualizado a V3.8 y fondo/theme `#050506`.
- `bootstrap-v38.js` carga V3.8.
- Service Worker incluye CSS/JS del drawer V3.8.
- La bandeja respeta `safe-area-inset-bottom` y `safe-area-inset-left/right`.
- Touch targets del drawer son de aproximadamente 44px o más en móvil.

## QA manual recomendado

1. Abrir `?v=38` en Safari desktop y confirmar botón `Contenido`.
2. Cerrar y reabrir la columna lateral.
3. Arrastrar una ficha de la biblioteca a dos días distintos.
4. Usar `Elegir día` sin drag.
5. Instalar/abrir la PWA en iPhone.
6. Confirmar botón `Contenido` y botón flotante cuando está cerrada.
7. Arrastrar el grabber arriba/abajo y verificar alturas compacta/media/grande.
8. Hacer scroll dentro del drawer sin desplazar accidentalmente toda la página.
9. Mover contenido mediante touch drag y mediante `Elegir día`.
10. Cerrar/reabrir la PWA y comprobar que la altura del drawer se conserva.

No se marca como validado físicamente en iPhone hasta completar estas pruebas en dispositivo real.
