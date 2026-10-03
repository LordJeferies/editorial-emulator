(()=>{'use strict';
function addStyle(){if(document.querySelector('link[data-editorial-v30]'))return;const l=document.createElement('link');l.rel='stylesheet';l.href='./css/system-v30.css?v=30';l.dataset.editorialV30='1';document.head.appendChild(l)}
function addPlanner(){if(document.querySelector('script[data-editorial-v30]'))return;const s=document.createElement('script');s.src='./js/planner-v30.js?v=30';s.defer=true;s.dataset.editorialV30='1';document.head.appendChild(s)}
function boot(){addStyle();addPlanner();document.documentElement.dataset.editorialVersion='3.0'}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
