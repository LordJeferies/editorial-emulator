(()=>{'use strict';
function rebuild(){document.documentElement.dataset.dnd='native-v40';const tip=document.querySelector('.v30-tip');if(tip)tip.innerHTML='Arrastra desde <b>⠿</b> para mover contenido. En táctil mantén pulsado brevemente; <b>Añadir a…</b> y los menús siguen disponibles como alternativa.'}
function boot(){rebuild();window.addEventListener('resize',rebuild,{passive:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.EDITORIAL_DND_V36={rebuild};
})();