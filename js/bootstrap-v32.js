(()=>{'use strict';
function css(href,key){if(document.querySelector(`link[data-${key}]`))return;const l=document.createElement('link');l.rel='stylesheet';l.href=href;l.dataset[key]='1';document.head.appendChild(l)}
function script(src,key){if(document.querySelector(`script[data-${key}]`))return;const s=document.createElement('script');s.src=src;s.defer=true;s.dataset[key]='1';document.head.appendChild(s)}
function patchVersionedLinks(){
  const manifest=document.querySelector('link[rel="manifest"]');if(manifest)manifest.href='./manifest.webmanifest?v=32';
  document.querySelectorAll('a[href]').forEach(a=>{const h=a.getAttribute('href')||'';if(h.startsWith('./?v=29'))a.setAttribute('href',h.replace('?v=29','?v=32'));if(h.startsWith('./help.html?v=29'))a.setAttribute('href',h.replace('?v=29','?v=32'));if(h.startsWith('./product.html?v=30')||h.startsWith('./product.html?v=31'))a.setAttribute('href','./product.html?v=32');if(h.startsWith('./mcp.html?v=31'))a.setAttribute('href','./mcp.html?v=32')});
}
async function registerSW(){if(!('serviceWorker' in navigator))return;try{const reg=await navigator.serviceWorker.register('./sw.js?v=32',{scope:'./'});reg.update?.()}catch(e){console.info('Service Worker no disponible; la app continúa online.',e)}}
function boot(){css('./css/system-v30.css?v=32','editorialV30');css('./css/system-v31.css?v=32','editorialV31');css('./css/system-v32.css?v=32','editorialV32');script('./js/progress-v32.js?v=32','editorialProgressV32');script('./js/planner-v30.js?v=32','editorialPlannerV30');script('./js/mcp-ui-v31.js?v=32','editorialMcpV31');script('./js/activity-v32.js?v=32','editorialActivityV32');patchVersionedLinks();registerSW();document.documentElement.dataset.editorialVersion='3.2'}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
