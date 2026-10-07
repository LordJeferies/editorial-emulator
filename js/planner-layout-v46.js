(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s);
let raf=0;
function modeFromChild(surface){const child=surface?.firstElementChild;if(!child)return'board';if(child.classList.contains('v30-timeline'))return'timeline';if(child.classList.contains('v30-agenda'))return'agenda';return'board'}
function normalize(){cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{const surface=$('#v30Surface');if(!surface)return;const mode=modeFromChild(surface);surface.className=`v30-surface v30-surface-${mode}`;document.documentElement.dataset.planner='v46';document.documentElement.dataset.plannerLayout='stable-v46'})}
function boot(){if(!$('#plannerV30')){setTimeout(boot,30);return}normalize();window.addEventListener('editorial:planner-rendered',normalize,{passive:true});window.addEventListener('editorial:cyclechange',normalize,{passive:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.EDITORIAL_PLANNER_LAYOUT_V46={normalize};
})();
