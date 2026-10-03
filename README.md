# Editorial Emulator V3.2

Editorial Emulator es una app separada de Editorial OS enfocada en **escenarios, planificación visual, simulación de feeds y automatización mediante MCP**.

## URLs

- App / PWA: `https://lordjeferies.github.io/editorial-emulator/?v=32`
- Producto: `https://lordjeferies.github.io/editorial-emulator/product.html?v=32`
- Guía MCP: `https://lordjeferies.github.io/editorial-emulator/mcp.html?v=32`
- Repo: `https://github.com/LordJeferies/editorial-emulator`
- Desktop Mac: `https://github.com/LordJeferies/editorial-emulator/releases/download/desktop-latest/Editorial-Emulator-macOS.zip`

## Arquitectura canónica

```text
GitHub Pages = aplicación canónica
        ↓
Web / PWA / Desktop Mac
        ↓
Supabase compartido
        ↑
Editorial Emulator MCP
```

La app Desktop es un wrapper AppKit + WKWebView que abre la URL pública. Los cambios del frontend publicados en GitHub Pages llegan sin reinstalar la `.app`.

## Planificador

Tres vistas editan exactamente el mismo estado:

- **Board** — estilo Kanban/Trello;
- **Timeline** — semana compacta;
- **Agenda** — lista precisa por día.

Funciones:

- drag & drop con Pointer Events;
- long-press en móvil;
- `Añadir a...` como alternativa al drag;
- `+ Añadir` desde cada día;
- mover y reordenar piezas;
- Undo / Redo;
- Borrar todo con confirmación;
- duplicar escenario;
- autosave local-first.

Cambiar entre Board, Timeline y Agenda **no duplica ni borra datos**.

## Feeds

Dispositivos:

- Mobile;
- Desktop.

Plataformas:

- Instagram: Grid / Feed / Reels;
- TikTok: Grid / Feed vertical;
- LinkedIn: Grid / Feed;
- YouTube: Grid / Videos / Player;
- Facebook: Grid / Feed.

## Welcome + progreso

V3.2 añade:

- pantalla de bienvenida;
- opción de no mostrarla cada vez;
- barra superior de progreso con porcentaje;
- mensaje de qué está haciendo la app;
- operaciones normales siguen siendo no bloqueantes;
- sólo aparece un overlay bloqueante cuando una operación realmente necesita terminar antes de continuar;
- el sistema de progreso se expone como `window.EDITORIAL_PROGRESS` para nuevos módulos.

API interna:

```js
const job = window.EDITORIAL_PROGRESS.start('Procesando...');
job.update(50, 'Mitad del proceso...');
job.finish('Listo');
```

Para una operación que sí debe bloquear:

```js
const job = window.EDITORIAL_PROGRESS.start('Guardando...', {
  blocking: true,
  blockMessage: 'Espera a que termine este guardado antes de continuar.'
});
```

## Supabase

La app trabaja local-first y sincroniza después.

Contratos compartidos:

- tabla `public.editorial_state`;
- `workspace_key = editorial-os`;
- payload `version: 9`;
- `jocEditorialV9AppData`;
- `jocEditorialV9Scenarios`;
- `editorialEmulatorV2CurrentScenario`;
- `editorialEmulatorV2Draft`.

El frontend usa la anon/public key configurada en `supabase-config.js`. Nunca se debe poner `service_role`, database password o secret keys en el cliente.

## MCP

Carpeta:

```text
mcp/
├── server.mjs
├── package.json
├── install.sh
├── .env.example
├── README.md
├── CRITERIA.md
└── EXAMPLES.md
```

El MCP opera sobre el mismo Supabase que usa la app. No automatiza clicks; modifica directamente la fuente de datos compartida.

### Instalación

```bash
cd ~/Downloads/editorial-emulator/mcp
chmod +x install.sh
./install.sh
```

Necesita Node.js 20+.

### Credenciales

Configura en el cliente MCP:

```text
EDITORIAL_SUPABASE_EMAIL
EDITORIAL_SUPABASE_PASSWORD
EDITORIAL_WORKSPACE=editorial-os
```

La URL y la anon key se leen de `supabase-config.js`.

### Capacidades

- listar/crear/duplicar/renombrar/eliminar escenarios;
- leer y editar planes;
- añadir/mover/reordenar/eliminar piezas;
- aplicar batches;
- crear y editar contenido personalizado;
- gestionar marcas/pilares/familias;
- derivar feeds por plataforma;
- validar integridad;
- backups automáticos;
- restauración de backups.

Cada mutación MCP guarda automáticamente un backup del payload anterior. Se conservan los últimos 8.

## Desktop macOS

Archivos:

- `desktop/mac/App.swift`
- `desktop/mac/Info.plist`
- `desktop/mac/build.sh`
- `desktop/mac/install.sh`
- `desktop/mac/build-release.sh`
- `.github/workflows/desktop-macos.yml`

Build local:

```bash
cd ~/Downloads/editorial-emulator
chmod +x desktop/mac/*.sh
desktop/mac/build-release.sh --install --publish
```

## PWA

- `display: standalone`;
- safe areas;
- offline fallback;
- HTML/CSS/JS network-first;
- cache actual: `editorial-emulator-v3-2-mcp-progress`;
- caches anteriores `editorial-emulator-*` se eliminan al activar una versión nueva.

## Seguridad

No subir al repo:

- contraseñas;
- `service_role`;
- database password;
- secret keys;
- GitHub PAT.

El MCP usa la anon/public key + login real del usuario de Supabase.
