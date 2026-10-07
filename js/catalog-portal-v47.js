(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s);
let portal=null,lib=null,mounted=false,tries=0;
function root(){return $('#plannerV30')}
function planVisible(){const plan=$('#planView'),app=$('#app');return !!plan&&plan.classList.contains('active')&&!app?.hidden}
function sync(){const r=root();if(!r||!lib)return;const open=!lib.hidden&&!r.classList.contains('v37-catalog-closed')&&planVisible();document.documentElement.classList.toggle('v47-library-open',open);document.documentElement.classList.toggle('v47-library-expanded',open&&r.classList.contains('v37-catalog-expanded'));portal.hidden=!open}
function mount(){if(mounted){sync();return true}const candidate=$('.v37-library'),r=root();if(!candidate||!r)return false;portal=$('#v47LibraryPortal');if(!portal){portal=document.createElement('div');portal.id='v47LibraryPortal';portal.className='v47-library-portal';portal.hidden=true;document.body.appendChild(portal)}lib=candidate;if(lib.parentElement!==portal)portal.appendChild(lib);lib.dataset.v47Portaled='1';if(!$('.v47-sheet-grab',lib)){const grab=document.createElement('div');grab.className='v47-sheet-grab';grab.setAttribute('aria-hidden','true');lib.prepend(grab)}mounted=true;sync();return true}
function ensure(){if(mount())return;if(++tries>80)return;setTimeout(ensure,50)}
['editorial:catalog-state','editorial:planner-rendered','editorial:boot-ready','editorial:scenariochange'].forEach(ev=>window.addEventListener(ev,()=>{mount();sync()},{passive:true}));
window.addEventListener('resize',sync,{passive:true});
document.addEventListener('click',e=>{const nav=e.target.closest?.('[data-nav]');if(!nav)return;queueMicrotask(()=>{if(nav.dataset.nav!=='plan')window.EDITORIAL_CATALOG_V45?.close?.();sync()})},true);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensure,{once:true});else ensure();
window.EDITORIAL_CATALOG_PORTAL_V47={mount:()=>mount(),sync:()=>sync()};
})();
