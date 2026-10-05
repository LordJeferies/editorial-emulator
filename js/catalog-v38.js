(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const KEY='editorialEmulatorCatalogTrayV38';
const mq=()=>matchMedia?.('(max-width: 900px)')?.matches;
const parse=(v,f)=>{try{return JSON.parse(v)??f}catch{return f}};
let tray={height:46,...parse(localStorage.getItem(KEY),{})},drag=null,mounted=false,obs=null;
function save(){localStorage.setItem(KEY,JSON.stringify(tray))}
function clamp(n,a,b){return Math.max(a,Math.min(b,n))}
function catalog(){return $('.v37-library')}
function planner(){return $('#plannerV30')}
function visibleCount(){return $$('#v30Catalog .v30-source:not([hidden])').length}
function updateButton(){const b=$('#v38CatalogToggle'),lib=catalog();if(!b||!lib)return;const open=!lib.hidden&&!planner()?.classList.contains('v37-catalog-closed');b.setAttribute('aria-expanded',open?'true':'false');b.classList.toggle('active',open);const n=visibleCount();const label=$('[data-v38-label]',b),count=$('[data-v38-count]',b);if(label)label.textContent=open?'Cerrar contenido':'Contenido';if(count)count.textContent=String(n)}
function setOpen(open){if(open)window.EDITORIAL_CATALOG_V37?.open?.();else window.EDITORIAL_CATALOG_V37?.close?.();requestAnimationFrame(()=>{syncTray();updateButton();window.EDITORIAL_DND_V36?.rebuild?.()})}
function toggle(){const lib=catalog();if(!lib)return;const open=!lib.hidden&&!planner()?.classList.contains('v37-catalog-closed');setOpen(!open)}
function setHeight(v){tray.height=clamp(Math.round(v),18,72);save();const lib=catalog();if(lib)lib.style.setProperty('--v38-tray-height',`${tray.height}dvh`)}
function snapHeight(){const h=tray.height;setHeight(h<31?18:h<59?46:72)}
function beginResize(e){if(!mq())return;e.preventDefault();drag={id:e.pointerId,startY:e.clientY,startH:tray.height,viewport:Math.max(1,innerHeight)};e.currentTarget.setPointerCapture?.(e.pointerId);document.body.classList.add('v38-resizing')}
function moveResize(e){if(!drag||e.pointerId!==drag.id)return;e.preventDefault();const dy=drag.startY-e.clientY;setHeight(drag.startH+(dy/drag.viewport)*100)}
function endResize(e){if(!drag||e.pointerId!==drag.id)return;drag=null;snapHeight();document.body.classList.remove('v38-resizing');window.EDITORIAL_DND_V36?.rebuild?.()}
function addGrabber(){const lib=catalog();if(!lib||$('#v38TrayGrabber',lib))return;const g=document.createElement('div');g.id='v38TrayGrabber';g.className='v38-tray-grabber';g.innerHTML='<span></span><b>Contenido disponible</b><small>Desliza para cambiar el tamaño</small>';lib.insertBefore(g,lib.firstChild);g.addEventListener('pointerdown',beginResize,{passive:false});g.addEventListener('pointermove',moveResize,{passive:false});g.addEventListener('pointerup',endResize,{passive:false});g.addEventListener('pointercancel',endResize,{passive:false});g.addEventListener('dblclick',()=>{setHeight(tray.height>50?18:72);window.EDITORIAL_DND_V36?.rebuild?.()})}
function addToolbarButton(){const root=planner();if(!root||$('#v38CatalogToggle'))return;const head=$('.v30-planner-head',root);if(!head)return;const b=document.createElement('button');b.id='v38CatalogToggle';b.className='v38-catalog-toggle';b.type='button';b.setAttribute('aria-controls','v30Catalog');b.innerHTML='<span class="v38-toggle-icon">▦</span><span data-v38-label>Contenido</span><span data-v38-count class="v38-count">0</span>';const seg=$('.v30-viewseg',head);if(seg)seg.insertAdjacentElement('afterend',b);else head.appendChild(b);b.addEventListener('click',toggle)}
function addMobileFab(){const root=planner();if(!root||$('#v38CatalogFab'))return;const b=document.createElement('button');b.id='v38CatalogFab';b.className='v38-catalog-fab';b.type='button';b.innerHTML='<span>▦</span><b>Contenido</b>';b.addEventListener('click',()=>setOpen(true));root.appendChild(b)}
function syncTray(){const lib=catalog(),root=planner();if(!lib||!root)return;lib.style.setProperty('--v38-tray-height',`${tray.height}dvh`);root.classList.toggle('v38-mobile-tray',mq());const open=!lib.hidden&&!root.classList.contains('v37-catalog-closed');document.documentElement.classList.toggle('v38-catalog-open',open&&mq());const fab=$('#v38CatalogFab');if(fab)fab.hidden=open||!mq();const old=$('#v37CatalogReopen');if(old)old.hidden=true;updateButton()}
function decorateCards(){ $$('#v30Catalog .v30-source').forEach(card=>{const btn=$('.v30-add',card);if(btn)btn.textContent='Elegir día';});updateButton() }
function mount(){if(mounted)return true;if(!planner()||!catalog())return false;mounted=true;addToolbarButton();addMobileFab();addGrabber();decorateCards();syncTray();obs=new MutationObserver(()=>{decorateCards();syncTray()});obs.observe(planner(),{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','class']});window.addEventListener('resize',()=>{syncTray();window.EDITORIAL_DND_V36?.rebuild?.()},{passive:true});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&mq()&&!catalog()?.hidden)setOpen(false)});return true}
function boot(){if(mount())return;const mo=new MutationObserver(()=>{if(mount())mo.disconnect()});mo.observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.EDITORIAL_CATALOG_V38={open:()=>setOpen(true),close:()=>setOpen(false),toggle,setHeight,state:()=>({...tray})};
})();
