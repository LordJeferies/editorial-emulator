const BUILD='2.5';
function ensureV25Styles(){
  if(document.querySelector('link[data-v25]'))return;
  const link=document.createElement('link');link.rel='stylesheet';link.href='./css/system-v25.css?v=25';link.dataset.v25='1';document.head.append(link);
}
function showBootError(error){
  console.error('Editorial Emulator boot failed',error);
  document.documentElement.dataset.emulatorBuild=BUILD;
  const box=document.getElementById('bootError');
  if(box){box.hidden=false;const detail=box.querySelector('[data-boot-detail]');if(detail)detail.textContent=String(error?.message||error||'Error desconocido')}
}
async function registerSW(){
  if(!('serviceWorker' in navigator))return;
  try{const registration=await navigator.serviceWorker.register('./sw.js?v=25',{updateViaCache:'none'});registration.update().catch(()=>{})}catch(error){console.info('Service Worker opcional no disponible',error)}
}
async function boot(){
  ensureV25Styles();document.documentElement.dataset.emulatorBuild=BUILD;
  document.title='Editorial Emulator V2.5';
  document.querySelector('.startup .eyebrow')?.replaceChildren(document.createTextNode('EDITORIAL EMULATOR V2.5'));
  registerSW();
  const {initUI}=await import('./ui-v25.js?v=25');
  initUI();
  window.__editorialEmulatorBooted=true;
  window.dispatchEvent(new CustomEvent('editorial-emulator:ready',{detail:{build:BUILD}}));
  queueMicrotask(async()=>{try{const {cloud}=await import('./cloud.js?v=25');cloud.init()}catch(error){console.info('Supabase no disponible al iniciar; la UI sigue operativa.',error)}});
}
boot().catch(showBootError);
