(()=>{'use strict';
let timer=0;
function arm(){clearTimeout(timer);document.documentElement.classList.add('ee-silent-mutation');timer=setTimeout(()=>document.documentElement.classList.remove('ee-silent-mutation'),220)}
function disarmSoon(){clearTimeout(timer);timer=setTimeout(()=>document.documentElement.classList.remove('ee-silent-mutation'),80)}
function boot(){
  // planner-v30 reutiliza acciones del runtime clásico abriendo su sheet durante unos milisegundos.
  // Es correcto funcionalmente, pero ese sheet transitorio producía el "parpadeo" visible.
  document.addEventListener('click',e=>{
    const menu=e.target.closest?.('#weekBoard [data-menu]');
    if(menu && e.isTrusted===false) arm();
    if(document.documentElement.classList.contains('ee-silent-mutation') && e.target.closest?.('#sheetBody button')) disarmSoon();
  },true);
  document.documentElement.dataset.noFlash='v35';
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
