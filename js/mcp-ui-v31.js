(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s);
const APP='https://lordjeferies.github.io/editorial-emulator/?v=31';
const GUIDE='./mcp.html?v=31';
const REPO='https://github.com/LordJeferies/editorial-emulator/tree/main/mcp';
function patchVersion(){document.title='Editorial Emulator V3.1';document.documentElement.dataset.editorialVersion='3.1-mcp';document.querySelectorAll('.eyebrow').forEach(el=>{if(/Editorial Emulator V2\.9|Editorial Emulator V3\.0/.test(el.textContent))el.textContent=el.textContent.replace(/V(?:2\.9|3\.0)/,'V3.1')});const meta=document.querySelector('meta[name="editorial-emulator-build"]');if(meta)meta.content='3.1'}
function cfgSnippet(){const root='/Users/TU_USUARIO/Downloads/editorial-emulator/mcp/server.mjs';return `{
  "mcpServers": {
    "editorial-emulator": {
      "command": "node",
      "args": ["${root}"],
      "env": {
        "EDITORIAL_SUPABASE_EMAIL": "TU_EMAIL",
        "EDITORIAL_SUPABASE_PASSWORD": "TU_PASSWORD",
        "EDITORIAL_WORKSPACE": "editorial-os"
      }
    }
  }
}`}
function open(){if($('#mcpV31'))return;const wrap=document.createElement('div');wrap.id='mcpV31';wrap.className='mcp-v31-backdrop';wrap.innerHTML=`<section class="mcp-v31-panel" role="dialog" aria-modal="true" aria-label="Editorial Emulator MCP"><header class="mcp-v31-head"><div><span class="eyebrow">MCP · Control externo</span><h2 style="margin:0">Controla Editorial Emulator desde un agente</h2><small>El MCP escribe en el mismo Supabase que usa la app. Web, PWA y Desktop reciben los cambios por Cloud.</small></div><button class="mcp-v31-close" data-close aria-label="Cerrar">×</button></header><div class="mcp-v31-body"><div class="mcp-v31-grid"><article class="mcp-v31-section"><h3>Qué puede hacer</h3><ul><li>crear y administrar escenarios</li><li>leer y modificar planes</li><li>añadir, mover, reordenar y borrar piezas</li><li>crear contenido, pilares, familias y marcas</li><li>auditar feeds por plataforma</li><li>validar datos y restaurar backups</li></ul></article><article class="mcp-v31-section"><h3>Cómo funciona</h3><p>El servidor MCP corre localmente. Se autentica con tu usuario de Supabase y opera sobre <b>public.editorial_state</b> / <b>editorial-os</b>. No automatiza clicks: modifica la fuente compartida y la app refleja esos cambios.</p></article></div><article class="mcp-v31-section"><h3>Instalación rápida</h3><div class="mcp-v31-code">cd ~/Downloads/editorial-emulator/mcp
chmod +x install.sh
./install.sh</div><p>Después configura el cliente MCP con el servidor local.</p></article><article class="mcp-v31-section"><h3>Configuración genérica</h3><div class="mcp-v31-code" id="mcpV31Config"></div><button class="mcp-v31-copy" data-copy>Copiar configuración</button><p><b>No subas contraseñas al repo.</b> La URL y la anon key se leen automáticamente desde supabase-config.js.</p></article><article class="mcp-v31-section"><h3>Criterios de seguridad</h3><ul><li>leer antes de escribir;</li><li>usar IDs reales;</li><li>usar batch para cambios relacionados;</li><li>confirmar operaciones destructivas;</li><li>cada mutación MCP crea un backup;</li><li>validar el estado después de cambios grandes.</li></ul></article><div class="mcp-v31-actions"><a class="primary" href="${GUIDE}">Guía completa MCP</a><a href="${REPO}" target="_blank" rel="noopener">Ver carpeta MCP</a><a href="${APP}" target="_blank" rel="noopener">Abrir app</a></div></div></section>`;document.body.appendChild(wrap);$('#mcpV31Config',wrap).textContent=cfgSnippet();wrap.addEventListener('click',async e=>{if(e.target===wrap||e.target.closest('[data-close]'))wrap.remove();if(e.target.closest('[data-copy]')){try{await navigator.clipboard.writeText(cfgSnippet());e.target.closest('[data-copy]').textContent='✓ Copiado'}catch{e.target.closest('[data-copy]').textContent='Copia manualmente'}}})}
function injectTop(){const actions=$('.top-actions');if(actions&&!$('#mcpV31Top')){const b=document.createElement('button');b.id='mcpV31Top';b.className='mcp-v31-btn';b.type='button';b.innerHTML='<span class="mcp-v31-dot"></span><span>MCP</span>';b.title='Configurar y usar MCP';b.onclick=open;actions.insertBefore(b,actions.lastElementChild)}}
function injectStartup(){const shell=$('.startup-shell');if(shell&&!$('#mcpV31Startup')){const n=document.createElement('div');n.id='mcpV31Startup';n.className='mcp-v31-card';n.innerHTML='<b>MCP disponible.</b> Puedes manejar escenarios, planner, biblioteca y feeds desde ChatGPT/Codex/Claude u otro cliente MCP usando el mismo Supabase. <button type="button" class="mcp-v31-btn" style="margin-left:8px"><span class="mcp-v31-dot"></span><span>Configurar MCP</span></button>';n.querySelector('button').onclick=open;const quick=$('.quick-grid',shell);shell.insertBefore(n,quick||null)}}
function boot(){patchVersion();injectTop();injectStartup();new MutationObserver(()=>{injectTop();injectStartup();patchVersion()}).observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.EDITORIAL_MCP_UI={open};
})();
