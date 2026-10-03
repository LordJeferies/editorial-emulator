(()=>{'use strict';
function css(href,key){if(document.querySelector(`link[data-${key}]`))return;const l=document.createElement('link');l.rel='stylesheet';l.href=href;l.dataset[key]='1';document.head.appendChild(l)}
function script(src,key){if(document.querySelector(`script[data-${key}]`))return;const s=document.createElement('script');s.src=src;s.defer=true;s.dataset[key]='1';document.head.appendChild(s)}
function boot(){css('./css/system-v30.css?v=31','editorialV30');css('./css/system-v31.css?v=31','editorialV31');script('./js/planner-v30.js?v=31','editorialPlannerV30');script('./js/mcp-ui-v31.js?v=31','editorialMcpV31');document.documentElement.dataset.editorialVersion='3.1'}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
