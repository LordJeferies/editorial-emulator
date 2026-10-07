(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s);
let mounted=false,tries=0,trigger=null,lib=null,workbench=null;
function api(){return window.EDITORIAL_CATALOG_V45||window.EDITORIAL_CATALOG_V38||window.EDITORIAL_CATALOG_V37}
function state(){try{return api()?.state?.()||{open:false,expanded:false}}catch{return{open:false,expanded:false}}}
function visibleCount(){return document.querySelectorAll('#v30Catalog .v30-source:not([hidden])').length}
function sync(){if(!mounted||!trigger||!lib)return;const s=state(),open=!!s.open&&!lib.hidden;document.documentElement.classList.toggle('v49-library-open',open);trigger.setAttribute('aria-expanded',open?'true':'false');const count=$('[data-v49-count]',trigger);if(count)count.textContent=String(visibleCount());const label=$('[data-v49-label]',trigger);if(label)label.textContent=open?'Ocultar contenidos':'Mostrar contenidos';}
function mount(){
  const planner=$('#plannerV30'),surface=$('#v30Surface');workbench=$('#v37Workbench');lib=$('.v37-library');
  if(!planner||!surface||!workbench||!lib)return false;
  $('#v47LibraryPortal')?.remove();
  workbench.classList.remove('v48-inline-workbench');workbench.classList.add('v49-inline-workbench');
  lib.classList.remove('v48-inline-library');lib.classList.add('v49-inline-library');lib.dataset.v49Inline='1';
  if(lib.parentElement!==workbench)workbench.appendChild(lib);
  if(!trigger){
    trigger=document.createElement('button');trigger.type='button';trigger.id='v49LibraryAccordion';trigger.className='v49-accordion-trigger';
    trigger.innerHTML='<span class="v49-trigger-copy"><b data-v49-label>Contenido disponible</b><span>Arrastra al plan, filtra o elige un día</span></span><span class="v49-trigger-meta"><span><span data-v49-count>0</span> contenidos</span><span class="v49-chevron">⌄</span></span>';
    trigger.addEventListener('click',()=>{const a=api();const s=state();if(s.open)a?.close?.();else a?.open?.();queueMicrotask(sync)});
  }
  if(trigger.parentElement!==workbench)workbench.insertBefore(trigger,lib);
  workbench.appendChild(lib);
  const subtitle=$('.v37-library-title small',lib);if(subtitle)subtitle.textContent='Arrastra al plan o elige un día · varios contenidos visibles a la vez';
  const exp=$('[data-v37-expand]',lib);if(exp){exp.style.display='none';exp.setAttribute('aria-hidden','true')}
  mounted=true;document.documentElement.dataset.libraryLayout='inline-accordion-v49';sync();
  window.dispatchEvent(new CustomEvent('editorial:library-layout',{detail:{version:'4.9',mode:'inline-accordion',position:'after-planner'}}));
  return true;
}
function ensure(){if(mount())return;if(++tries>120)return;setTimeout(ensure,40)}
['editorial:planner-rendered','editorial:boot-ready','editorial:catalog-state','editorial:catalog-filter','editorial:taxonomy-changed','editorial:v43-changed'].forEach(ev=>window.addEventListener(ev,()=>{mount();sync()},{passive:true}));
window.addEventListener('resize',sync,{passive:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensure,{once:true});else ensure();
window.EDITORIAL_LIBRARY_LAYOUT_V49={mount,sync};
})();
