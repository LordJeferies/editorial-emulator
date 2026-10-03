# Editorial Emulator V2

Aplicación separada de Editorial OS enfocada exclusivamente en **crear escenarios, organizar contenido por drag & drop, reproducir una simulación y revisar feeds realistas**.

## Cambios principales frente a V1

### Escenarios primero
Al abrir la app eliges:
- usar un escenario existente;
- continuar el último;
- crear uno nuevo;
- partir de Base JOC, semana vacía o duplicar otro escenario.

Todo escenario se autosalva. No depende de acordarse de pulsar “Guardar”.

### Content Rail siempre visible
La bandeja de contenidos permanece accesible en Plan. Se puede:
- buscar;
- filtrar L1/L2/L3;
- expandir;
- crear contenido;
- arrastrar fichas a cualquier día.

SortableJS usa `pull:'clone'` desde el rail y move/reorder entre días, con delay táctil para iPhone.

### Feeds persistentes
Instagram, TikTok, LinkedIn, YouTube y Facebook se montan una sola vez. Cambiar de plataforma no destruye el shell de las otras apps.

Los controllers actualizan nodos por `occurrenceId`; no se hace `phone.innerHTML = renderFeed()` al cambiar de pestaña.

### TikTok mejorado
- scroll-snap vertical;
- cada publicación muestra título/caption, tipo, fecha y L1/L2/L3;
- botones laterales simulados;
- barra superior y bottom nav;
- IntersectionObserver actualiza la publicación activa.

### Instagram
- Perfil y Feed son dos superficies persistentes;
- grid de 3 columnas;
- feed vertical con caption y metadata visual;
- mantiene estado al cambiar de plataforma.

### YouTube
Los contenidos se separan en:
- Shorts/verticales;
- videos y episodios horizontales.

### LinkedIn y Facebook
Cada uno tiene chrome y cards propios. Ya no comparten un único “social-card” genérico.

### Play
Play cambia `activeOccurrenceId`, activa la plataforma correspondiente y hace scroll al post existente. No reconstruye todo el simulador.

## Rendimiento

- store por canales: `planner`, `feeds`, `catalog`, `library`, `cloud`, `scenario`;
- no existe un `renderAll()` como reacción estándar a cada persistencia;
- feed derivado cacheado por `dataRevision + anchorDate`;
- controllers persistentes;
- keyed DOM patching para Instagram/TikTok/LinkedIn/Facebook;
- TikTok limita el primer render si supera 50 publicaciones;
- Supabase sincroniza en background con debounce.

## Datos compartidos

Conserva los contratos de Editorial OS:
- `jocEditorialV9`
- `jocEditorialV9AppData`
- `jocEditorialV9Scenarios`
- `jocEditorialV9Cloud`
- tabla `public.editorial_state`
- `workspace_key = editorial-os`
- payload compatible `version: 9`

Si ambos Pages están bajo `lordjeferies.github.io`, además comparten origin/localStorage.

## Publicar

```bash
chmod +x create_and_publish.sh validate.sh
./create_and_publish.sh
```

Por defecto crea o actualiza:
- `LordJeferies/editorial-emulator`
- `https://lordjeferies.github.io/editorial-emulator/`
