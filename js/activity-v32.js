(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s);let cloudJob=null,manualCloud=false;
function startCloud(label){if(!window.EDITORIAL_PROGRESS||cloudJob)return;cloudJob=window.EDITORIAL_PROGRESS.start(label||'Sincronizando con Supabase…')}
function finishCloud(ok=true,label='Cloud sincronizado'){if(!cloudJob)return;ok?cloudJob.finish(label):cloudJob.fail(label);cloudJob=null;manualCloud=false}
function watchCloud(){const pill=$('#syncPill');if(!pill)return;let prev='';const read=()=>{const t=(pill.textContent||'').trim();if(t===prev)return;prev=t;
  // El autosave y la sincronización automática NO deben abrir barras, overlays ni chips de progreso.
  // El propio pill Cloud es suficiente feedback para operaciones rutinarias y evita el parpadeo visual.
  if(manualCloud){
    if(/Sincronizando|Conectando|pendiente/i.test(t)){if(!cloudJob)startCloud(t);window.EDITORIAL_PROGRESS?.update?.(/Conectando/i.test(t)?35:/pendiente/i.test(t)?20:68,t)}
    else if(/sincronizado|conectado|actualizado|listo/i.test(t)){window.EDITORIAL_PROGRESS?.update?.(96,t);finishCloud(true,t)}
    else if(/error|offline/i.test(t)){finishCloud(false,t)}
  }
};new MutationObserver(read).observe(pill,{childList:true,subtree:true,characterData:true});read()}
function wireLongOps(){document.addEventListener('click',e=>{const el=e.target.closest('button,a');if(!el)return;const id=el.id||'';
  if(id==='clearPlanBtn'){const j=window.EDITORIAL_PROGRESS?.start?.('Preparando limpieza del plan…');setTimeout(()=>j?.finish?.('Plan actualizado'),500)}
  else if(id==='duplicateBtn'){const j=window.EDITORIAL_PROGRESS?.start?.('Duplicando escenario…');setTimeout(()=>j?.finish?.('Escenario duplicado'),450)}
  else if(el.matches('[data-push]')){manualCloud=true;startCloud('Sincronizando ahora…')}
  else if(el.matches('[data-pull]')){manualCloud=true;startCloud('Trayendo datos desde Supabase…')}
},true)}
function installGlobalErrors(){window.addEventListener('unhandledrejection',()=>{if(manualCloud||cloudJob)window.EDITORIAL_PROGRESS?.fail?.('Algo falló durante la operación')});window.addEventListener('error',()=>{if($('#fatalBanner')&&!$('#fatalBanner').hidden)window.EDITORIAL_PROGRESS?.fail?.('La app encontró un error')})}
function boot(){watchCloud();wireLongOps();installGlobalErrors()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
