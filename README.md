# Editorial Emulator V1

Herramienta separada de Editorial OS, enfocada sólo en **emulación de semanas y visores de feeds**.

## Qué comparte con Editorial OS

- Mismo dominio de GitHub Pages (`lordjeferies.github.io`), por lo que puede leer los mismos `localStorage` históricos.
- Mismo proyecto Supabase y tabla `public.editorial_state`.
- Mismo `workspace_key`: `editorial-os`.
- Mismo payload compatible `version: 9`.
- Conserva contenidos base JOC, pilares, familias, marcas, escenarios, completion y production.

La sincronización hace **fetch del payload remoto antes de escribir** y mezcla los campos del emulador sobre el payload más reciente para reducir el riesgo de pisar campos que el emulador no controla.

## Rendimiento

- UI utilizable inmediatamente desde estado local.
- Supabase carga en segundo plano.
- No existe `renderAll()` costoso por cada interacción: las vistas se actualizan por área.
- Los feeds se derivan una vez por revisión del plan y se cachean.
- Sólo se monta el visor de la plataforma activa.
- El teléfono simulado tiene scroll interno real.
- Instagram usa `repeat(3,minmax(0,1fr))` y no depende de anchos fijos.

## Publicar

```bash
chmod +x create_and_publish.sh
./create_and_publish.sh
```

Por defecto crea/actualiza:

- Repo: `LordJeferies/editorial-emulator`
- Page: `https://lordjeferies.github.io/editorial-emulator/`

Requiere `git` y GitHub CLI (`gh`) autenticado.
