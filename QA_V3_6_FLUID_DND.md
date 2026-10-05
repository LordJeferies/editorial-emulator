# Editorial Emulator V3.6 · Fluid Drag & Drop

## Evidencia revisada

Se revisó la grabación móvil del 2026-10-05. El problema visible no era sólo velocidad: el drag clásico seguía el dedo con un ghost independiente y la tarjeta real se confirmaba después mediante el runtime legacy, por lo que el movimiento se sentía como `arrastrar → soltar → esperar → saltar` en vez de manipulación directa.

## Referencias usadas

### Apple Human Interface Guidelines

- Gestures: responder a los gestos lo más rápido posible y dar feedback inmediato que permita predecir el resultado.
- Drag and drop: mostrar claramente destinos válidos, ofrecer alternativas al drag, permitir auto-scroll y mantener la interfaz utilizable durante el gesto.
- Direct manipulation: mover el objeto con el gesto en una interacción continua.

Referencias públicas:

- https://developer.apple.com/design/human-interface-guidelines/gestures
- https://developer.apple.com/design/human-interface-guidelines/drag-and-drop

### OSS

Se adoptó SortableJS 1.15.7 de forma versionada para el motor de interacción:

- https://github.com/SortableJS/Sortable
- Licencia MIT.
- Soporta touch y pointer devices.
- Grupos compartidos y `pull: clone` para catálogo → plan.
- Animación entre posiciones.
- Auto-scroll.
- Fallback controlado para touch.

La versión 1.15.7 incluye fixes recientes de estabilidad. La integración usa sólo single-item drag; no depende de MultiDrag.

## Cambios V3.6

1. SortableJS reemplaza el seguimiento manual durante el drag cuando está disponible.
2. El catálogo usa `pull: clone`; el contenido fuente no desaparece al añadirlo al plan.
3. Board, Timeline y Agenda usan listas conectadas.
4. El placeholder abre espacio mientras la ficha se mueve, en vez de esperar al final.
5. Animación de posición de 185 ms con easing corto.
6. En touch/coarse pointer el drag comienza desde el handle `⠿`, evitando competir con el scroll vertical.
7. En mouse/trackpad se puede arrastrar la ficha directamente.
8. Auto-scroll cerca de bordes durante el gesto.
9. Mientras se sincroniza la mutación con el runtime legacy se bloquean únicamente sus re-renders invisibles; la ficha visible se queda en su nueva posición.
10. Se oculta el sheet interno que el runtime usa para completar `mover`/`reordenar`, para evitar flashes.
11. `Añadir a…` y los menús siguen disponibles como alternativa al gesto.
12. Si SortableJS no puede cargarse, la app conserva el motor clásico como fallback.

## Parámetros de interacción

- animation: 185 ms
- easing: cubic-bezier(.2,.8,.2,1)
- touch delay: 95 ms
- touchStartThreshold: 4 px
- fallbackTolerance: 4 px
- auto-scroll sensitivity: 72 px
- auto-scroll speed: 11
- reduced motion: animación desactivada

## Criterios de aceptación

### iPhone

- tocar/scroll sobre la ficha no debe disparar un drag accidental;
- agarrar `⠿` debe elevar la ficha rápidamente;
- otras fichas deben abrir hueco mientras se mueve;
- el destino debe verse antes de soltar;
- soltar debe dejar la ficha donde estaba el placeholder;
- no debe aparecer overlay, modal ni flash de pantalla;
- mover entre días no debe devolver la página al inicio;
- la ficha debe seguir en la misma posición después de sincronizar Cloud.

### Desktop

- arrastrar la ficha directamente con mouse/trackpad;
- animación continua entre columnas;
- reordenamiento dentro del mismo día;
- mover entre Board/Timeline/Agenda sin cambiar los datos.

## Pendiente de validación física

El código fue preparado contra el comportamiento observado y las guías anteriores. La validación final debe hacerse en Safari iPhone/PWA real y en Safari macOS porque la física de touch/scroll no puede certificarse sólo con revisión estática.
