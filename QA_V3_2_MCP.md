# QA · Editorial Emulator V3.2 · MCP + Welcome + Progress

## Alcance

Esta build integra tres cambios grandes:

1. servidor MCP conectado al mismo Supabase del producto;
2. pantalla de bienvenida;
3. sistema global de progreso no bloqueante.

## MCP

Archivos principales:

- `mcp/server.mjs`
- `mcp/package.json`
- `mcp/install.sh`
- `mcp/.env.example`
- `mcp/README.md`
- `mcp/CRITERIA.md`
- `mcp/EXAMPLES.md`
- `.github/workflows/mcp-ci.yml`
- `mcp.html`

Contratos preservados:

- `public.editorial_state`
- `workspace_key = editorial-os`
- payload `version: 9`
- mismas estructuras de escenarios y slots
- anon/public key de frontend + autenticación real del usuario

No se usa:

- service_role
- database password
- secret key
- GitHub PAT

### Operaciones destructivas

Requieren `confirm=true`:

- eliminar escenario;
- limpiar plan;
- restaurar backup.

Cada mutación MCP crea un backup automático del payload anterior. Se conservan los últimos 8.

## Sincronización MCP ↔ app

Se corrigió el merge del Cloud bridge para que, cuando el cliente local no tiene cambios pendientes (`dirty=false`), un cambio remoto procedente de MCP/Supabase gane sobre la copia local del mismo escenario.

Antes, el merge local podía volver a imponer un escenario antiguo sobre un cambio remoto. V3.2 separa:

- `mergeForPush` → local gana al enviar cambios locales;
- `mergeForRemote` → remoto gana al aplicar cambios Supabase/MCP.

Los IDs locales que sólo existen en el cliente se conservan cuando no colisionan.

## Welcome

- pantalla inicial V3.2;
- explica Plan / Feeds / MCP + Cloud;
- botón Entrar;
- enlaces Producto y MCP;
- opción para no mostrar la bienvenida completa cada vez.

## Progress manager

API:

`window.EDITORIAL_PROGRESS`

Métodos:

- `start(message, options)`
- `update(percent, message)`
- `finish(message)`
- `fail(message)`
- `block(message)`
- `unblock()`

Comportamiento:

- barra superior con porcentaje;
- mensaje de operación;
- no bloquea interacción por defecto;
- overlay sólo cuando `blocking:true` o un módulo llama `block()`;
- Cloud/Supabase alimenta estados de actividad;
- errores globales pueden finalizar la barra en estado de fallo.

## PWA

Cache actual:

`editorial-emulator-v3-2-mcp-progress`

El Service Worker usa `Promise.allSettled` al precachear para no hacer fallar toda la instalación por un único recurso temporalmente no disponible.

Bootstrap V3.2 registra explícitamente el Service Worker y actualiza links/versiones antiguas del HTML heredado.

## Validación automática

Workflow:

`.github/workflows/mcp-ci.yml`

Valida:

- Node.js 20;
- instalación de dependencias MCP;
- `node --check server.mjs`;
- presencia de documentación y página MCP.

## Pendiente de prueba física

Debe comprobarse en dispositivo real:

- Safari iPhone / PWA: welcome, barra superior y safe areas;
- Desktop Mac WKWebView: welcome/progress/MCP panel;
- conexión MCP real desde el cliente elegido;
- propagación Realtime con la app abierta y Cloud autenticado;
- operación de restore usando un backup de prueba.

No marcar estas pruebas como completadas hasta ejecutarlas físicamente.
