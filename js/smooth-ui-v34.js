(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s);
const state={winY:0,catalogX:0,timelineX:0,focusId:'',armed:false};
function capture(){state.winY=window.scrollY;state.catalogX=$('#v30Catalog')?.scrollLeft||0;state.timelineX=$('.v30-timeline-track')?.scrollLeft||0;state.focusId=document.activeElement?.id||'';state.armed=true}
function restore(){if(!state.armed)return;requestAnimationFrame(()=>{window.scrollTo({top:state.winY,left:window.scrollX,behavior:'instant'});const c=$('#v30Catalog');if(c)c.scrollLeft=state.catalogX;const t=$('.v30-timeline-track');if(t)t.scrollLeft=state.timelineX;if(state.focusId){const f=document.getElementById(state.focusId);if(f&&document.activeElement!==f)f.focus({preventScroll:true})}state.armed=false})}
function patchStorage(){const original=Storage.prototype.setItem;if(original.__editorialSmoothV34)return;function patched(k,v){if(this===localStorage&&['jocEditorialV9Scenarios','editorialEmulatorV2Draft','jocEditorialV9AppData'].includes(String(k)))capture();const out=original.call(this,k,v);if(this===localStorage&&['jocEditorialV9Scenarios','editorialEmulatorV2Draft','jocEditorialV9AppData'].includes(String(k)))setTimeout(restore,0);return out}patched.__editorialSmoothV34=true;Storage.prototype.setItem=patched}
function watchPlanner(){const root=$('#plannerV30');if(!root)return false;new MutationObserver(()=>restore()).observe(root,{childList:true,subtree:true});return true}
function boot(){patchStorage();if(!watchPlanner()){const mo=new MutationObserver(()=>{if(watchPlanner())mo.disconnect()});mo.observe(document.body,{childList:true,subtree:true})}window.addEventListener('editorial:cyclechange',()=>restore());document.documentElement.dataset.smoothUpdates='v34'}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.EDITORIAL_SMOOTH={capture,restore};
})();