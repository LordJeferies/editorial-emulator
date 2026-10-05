# Editorial Emulator V3.8 — Content Drawer / PWA Tray

## Objetivo
Hacer que Contenido disponible tenga un control explícito y siempre accesible, tanto en desktop como en PWA/móvil, sin obligar al usuario a depender de un carrusel horizontal.

## UX implementada
- Botón `Contenido` visible en el encabezado del planificador.
- Badge con número de contenidos visibles según filtros.
- Desktop: abre/cierra la biblioteca lateral derecha.
- PWA/móvil: abre una bandeja flotante inferior que deja el Board visible por detrás.
- La bandeja móvil tiene un grabber táctil para cambiar su altura.
- Alturas con snap aproximadas: 18dvh, 46dvh y 72dvh.
- El estado de altura queda guardado en localStorage.
- Botón flotante `Contenido` aparece cuando la bandeja está cerrada en móvil.
- Escape cierra la bandeja en teclado.
- `Elegir día` mantiene la alternativa sin drag.
- El drag desde la biblioteca hacia Board/Timeline/Agenda sigue usando SortableJS V3.6.
- No se bloquea la app al abrir/cerrar la biblioteca.
- Safe areas de iOS/PWA respetadas.

## Criterios de interacción
1. El usuario debe poder abrir Contenido sin buscar un control escondido.
2. En PWA la bandeja no debe ocupar toda la pantalla por defecto.
3. El usuario puede subir/bajar manualmente la bandeja con el grabber.
4. El Board permanece visible para facilitar drag hacia un día.
5. `Elegir día` sigue disponible como fallback exacto.
6. Abrir/cerrar/redimensionar no debe provocar reload ni perder el escenario activo.

## QA recomendado
- Safari macOS: abrir/cerrar panel, drag contenido a 3 días distintos, buscar y filtrar.
- iPhone PWA: abrir desde botón, subir a 72dvh, bajar a 18dvh, arrastrar una tarjeta hacia un día visible, usar Elegir día, cerrar y reabrir.
- Confirmar persistencia de altura tras navegar entre Plan/Feeds/Plan.
- Confirmar que Board/Timeline/Agenda comparten el mismo escenario.
