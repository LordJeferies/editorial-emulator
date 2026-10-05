(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const KEY='editorialEmulatorCatalogV37';
const mobile=()=>matchMedia?.('(max-width: 900px)')?.matches;
const parse=(v,f)=>{try{return JSON.parse(v)??f}catch{return f}};
let state={open:!mobile(),expanded:false,q:'',lot:'all',...parse(localStorage.getItem(KEY),{})},mounted=false;
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function mount(){if(mounted)return true;const planner=$('#plannerV30'),catalog=$('.v30-catalog',planner),surface=$('#v30Surface',planner);if(!planner||!catalog||!surface)return false;mounted=true;
 const wb=document.createElement('div');wb.id='v37Workbench';wb.className='v37-workbench';surface.parentNode.insertBefore(wb,surface);wb.appendChild(surface);wb.appendChild(catalog);
 catalog.classList.add('v37-library');
 const oldHead=$('.v30-catalog-head',catalog);if(oldHead)oldHead.innerHTML=`<div class="v37-library-title"><div><span class="eyebrow">Biblioteca</span><b>Contenido disponible</b><small>Arrastra al plan o elige un día</small></div><div class="v37-library-head-actions"><button type="button" data-v37-expand aria-label="Cambiar tamaño del panel">↗</button><button type="button" data-v37-close aria-label="Ocultar contenido">×</button></div></div>`;
 const tools=document.createElement('div');tools.className='v37-library-tools';tools.innerHTML=`<label class="v37-search"><span aria-hidden="true">⌕</span><input id="v37CatalogSearch" type="search" placeholder="Buscar contenido…" autocomplete="off"></label><div class="v37-lotseg" role="group" aria-label="Filtrar por lote"><button data-v37-lot="all">Todos</button><button data-v37-lot="L1">L1</button><button data-v37-lot="L2">L2</button><button data-v37-lot="L3">L3</button></div>`;catalog.insertBefore(tools,$('#v30Catalog',catalog));
 const reopen=document.createElement('button');reopen.id='v37CatalogReopen';reopen.className='v37-catalog-reopen';reopen.type='button';reopen.innerHTML='<span>＋</span><b>Contenido</b>';planner.appendChild(reopen);
 $('#v37CatalogSearch').value=state.q||'';$('#v37CatalogSearch').addEventListener('input',e=>{state.q=e.target.value||'';save();applyFilters()});
 $$('[data-v37-lot]',tools).forEach(b=>b.onclick=()=>{state.lot=b.dataset.v37Lot;save();renderState();applyFilters()});
 $('[data-v37-close]',catalog).onclick=()=>setOpen(false);$('[data-v37-expand]',catalog).onclick=()=>{state.expanded=!state.expanded;state.open=true;save();renderState()};reopen.onclick=()=>setOpen(true);
 const obs=new MutationObserver(()=>{decorateCards();applyFilters()});obs.observe($('#v30Catalog'),{childList:true,subtree:true});
 decorateCards();renderState();applyFilters();window.addEventListener('resize',()=>{if(mobile()&&state.expanded){state.expanded=false;save()}renderState()},{passive:true});
 return true}
function setOpen(v){state.open=!!v;if(!state.open)state.expanded=false;save();renderState();setTimeout(()=>window.EDITORIAL_DND_V36?.rebuild?.(),80)}
function renderState(){const planner=$('#plannerV30'),catalog=$('.v37-library');if(!planner||!catalog)return;planner.classList.toggle('v37-catalog-closed',!state.open);planner.classList.toggle('v37-catalog-expanded',!!state.expanded&&state.open&&!mobile());catalog.hidden=!state.open;const exp=$('[data-v37-expand]',catalog);if(exp){exp.textContent=state.expanded?'↙':'↗';exp.title=state.expanded?'Reducir biblioteca':'Ampliar biblioteca'}$$('[data-v37-lot]',catalog).forEach(b=>{const on=b.dataset.v37Lot===state.lot;b.classList.toggle('active',on);b.setAttribute('aria-pressed',on?'true':'false')});document.documentElement.dataset.catalog='v37'}
function decorateCards(){const cards=$$('#v30Catalog .v30-source');cards.forEach(card=>{if(card.dataset.v37Decorated==='1')return;card.dataset.v37Decorated='1';const copy=card.querySelector(':scope > div');if(copy){const title=copy.querySelector('b')?.textContent?.trim()||'Contenido';card.setAttribute('aria-label',title)}const btn=card.querySelector('.v30-add');if(btn)btn.textContent='Añadir a día…'})}
function applyFilters(){const q=(state.q||'').trim().toLowerCase(),lot=state.lot||'all';let visible=0;$$('#v30Catalog .v30-source').forEach(card=>{const text=(card.textContent||'').toLowerCase(),cardLot=(card.querySelector('.lot')?.textContent||'').trim();const show=(!q||text.includes(q))&&(lot==='all'||cardLot===lot);card.hidden=!show;if(show)visible++});let empty=$('#v37FilterEmpty');if(!visible){if(!empty){empty=document.createElement('div');empty.id='v37FilterEmpty';empty.className='v37-filter-empty';empty.textContent='No hay contenidos con esos filtros.';$('#v30Catalog')?.appendChild(empty)}}else empty?.remove();setTimeout(()=>window.EDITORIAL_DND_V36?.rebuild?.(),20)}
function boot(){if(mount())return;const mo=new MutationObserver(()=>{if(mount())mo.disconnect()});mo.observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.EDITORIAL_CATALOG_V37={open:()=>setOpen(true),close:()=>setOpen(false),state:()=>({...state})};
})();