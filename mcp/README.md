# Editorial Emulator MCP

Servidor MCP oficial del repositorio `LordJeferies/editorial-emulator`.

## Qué hace

Permite que un cliente MCP compatible controle los datos de Editorial Emulator / Editorial OS mediante el mismo Supabase compartido.

```text
ChatGPT / Codex / Claude / otro cliente MCP
        ↓ stdio
Editorial Emulator MCP
        ↓ Supabase
public.editorial_state / workspace editorial-os
        ↓ realtime
Editorial Emulator Web / PWA / Desktop
```

El MCP no automatiza clicks del navegador. Opera sobre la fuente de datos compartida.

## Requisitos

- Node.js 20+
- cuenta válida de Supabase para Editorial OS
- email y contraseña del usuario
- repo clonado localmente

La URL y la anon key se leen automáticamente de `../supabase-config.js`.

## Instalación recomendada en Mac

```bash
cd ~/Downloads/editorial-emulator/mcp
chmod +x setup-mac.sh
./setup-mac.sh
```

`setup-mac.sh`:

- verifica Node 20+;
- instala dependencias;
- valida `server.mjs`;
- guarda email y contraseña de Supabase en Keychain;
- crea `~/.local/bin/editorial-emulator-mcp`;
- imprime la configuración MCP genérica.

Tus credenciales no quedan guardadas en el repo.

Configuración resultante:

```json
{
  "mcpServers": {
    "editorial-emulator": {
      "command": "/Users/TU_USUARIO/.local/bin/editorial-emulator-mcp"
    }
  }
}
```

## Instalación genérica

```bash
cd ~/Downloads/editorial-emulator/mcp
npm install
npm run check
```

Variables de entorno si no usas el setup de Mac:

```bash
export EDITORIAL_SUPABASE_EMAIL="tu-email"
export EDITORIAL_SUPABASE_PASSWORD="tu-password"
export EDITORIAL_WORKSPACE="editorial-os"
```

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
- Operaciones destructivas importantes requieren `confirm=true`.
- Conserva campos del payload que el MCP no necesita modificar.

## Criterio recomendado

1. Leer antes de escribir.
2. Usar IDs reales.
3. Evitar contenido duplicado.
4. Usar `editorial_apply_batch` para cambios relacionados.
5. Confirmar operaciones destructivas.
6. Ejecutar `editorial_validate_state` después de cambios grandes.
7. Separar diagnóstico y ejecución cuando el cambio editorial sea importante.

## Sincronización con la app

Para ver cambios inmediatamente en Web/PWA/Desktop:

1. abre Editorial Emulator;
2. pulsa el estado Cloud;
3. inicia sesión en Supabase;
4. deja la app abierta o vuelve a abrirla.

El MCP y la app trabajan sobre `public.editorial_state`, `workspace_key = editorial-os`, payload `version: 9`.

## Documentación

- App: https://lordjeferies.github.io/editorial-emulator/?v=32
- Producto: https://lordjeferies.github.io/editorial-emulator/product.html?v=32
- Guía MCP paso a paso: https://lordjeferies.github.io/editorial-emulator/mcp.html?v=32
- Repo: https://github.com/LordJeferies/editorial-emulator

Ver también `EXAMPLES.md` y `CRITERIA.md`.
