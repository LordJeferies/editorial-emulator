# Editorial Emulator MCP

Servidor MCP oficial del repositorio `LordJeferies/editorial-emulator`.

## Qué hace

Permite que un cliente MCP compatible controle los datos de Editorial Emulator / Editorial OS mediante el mismo Supabase compartido.

Arquitectura:

```text
ChatGPT / Codex / Claude / otro cliente MCP
        ↓ stdio
Editorial Emulator MCP
        ↓ Supabase
public.editorial_state / workspace editorial-os
        ↓ realtime
Editorial Emulator Web / PWA / Desktop
```

El MCP no intenta automatizar clicks del navegador. Opera sobre la fuente de datos compartida. La app conectada a Supabase recibe los cambios mediante Realtime.

## Requisitos

- Node.js 20+
- cuenta válida de Supabase para Editorial OS
- email y contraseña del usuario
- repo clonado localmente

La URL y la anon key se leen automáticamente de `../supabase-config.js` salvo que se sobrescriban por variables de entorno.

## Instalar

```bash
cd ~/Downloads/editorial-emulator/mcp
npm install
```

## Credenciales

No pongas contraseñas en GitHub.

Usa variables de entorno:

```bash
export EDITORIAL_SUPABASE_EMAIL="tu-email"
export EDITORIAL_SUPABASE_PASSWORD="tu-password"
```

Opcional:

```bash
export EDITORIAL_WORKSPACE="editorial-os"
```

## Ejecutar manualmente

```bash
cd ~/Downloads/editorial-emulator/mcp
npm start
```

Normalmente no se ejecuta a mano: el cliente MCP lo lanza.

## Configuración MCP genérica

```json
{
  "mcpServers": {
    "editorial-emulator": {
      "command": "node",
      "args": ["/Users/TU_USUARIO/Downloads/editorial-emulator/mcp/server.mjs"],
      "env": {
        "EDITORIAL_SUPABASE_EMAIL": "TU_EMAIL",
        "EDITORIAL_SUPABASE_PASSWORD": "TU_PASSWORD",
        "EDITORIAL_WORKSPACE": "editorial-os"
      }
    }
  }
}
```

No subas ese archivo a un repo si contiene contraseña.

## Tools principales

### Estado / capacidades

- `editorial_status`
- `editorial_get_capabilities`
- `editorial_get_usage_criteria`
- `editorial_validate_state`

### Escenarios

- `editorial_list_scenarios`
- `editorial_get_scenario`
- `editorial_create_scenario`
- `editorial_duplicate_scenario`
- `editorial_rename_scenario`
- `editorial_delete_scenario`

### Planner

- `editorial_get_plan`
- `editorial_add_content`
- `editorial_move_item`
- `editorial_reorder_day`
- `editorial_remove_item`
- `editorial_clear_plan`
- `editorial_apply_batch`

### Biblioteca / taxonomía

- `editorial_list_content`
- `editorial_create_content`
- `editorial_update_content`
- `editorial_get_taxonomy`
- `editorial_create_taxonomy`

### Feeds

- `editorial_preview_feeds`

### Recuperación

- `editorial_list_backups`
- `editorial_restore_backup`

Cada mutación MCP crea automáticamente un backup del payload anterior. Se conservan los últimos 8.

## Seguridad

- NO usa `service_role`.
- NO usa database password.
- NO usa GitHub PAT.
- Usa la anon/public key del frontend + login real del usuario.
- Las operaciones destructivas importantes requieren `confirm=true`.
- Conserva campos del payload que el MCP no necesita modificar.

## Sincronización con la app

Para ver los cambios inmediatamente en Web/PWA/Desktop:

1. abre Editorial Emulator;
2. pulsa el estado Cloud;
3. inicia sesión en Supabase;
4. deja la app abierta o vuelve a abrirla.

El MCP y la app trabajan sobre `public.editorial_state`, `workspace_key = editorial-os`, payload `version: 9`.

## Documentación

- App: https://lordjeferies.github.io/editorial-emulator/?v=31
- Producto: https://lordjeferies.github.io/editorial-emulator/product.html?v=31
- MCP: https://lordjeferies.github.io/editorial-emulator/mcp.html?v=31
- Repo: https://github.com/LordJeferies/editorial-emulator

Ver también `EXAMPLES.md` y `CRITERIA.md`.
