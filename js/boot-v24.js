const BUILD='2.4';
function showBootError(error){
  console.error('Editorial Emulator boot failed',error);
  document.documentElement.dataset.emulatorBuild=BUILD;
  const box=document.getElementById('bootError');
  if(box){
    box.hidden=false;
    const detail=box.querySelector('[data-boot-detail]');
    if(detail)detail.textContent=String(error?.message||error||'Error desconocido');
  }
}
async function registerSW(){
  if(!('serviceWorker' in navigator))return;
  try{
    const registration=await navigator.serviceWorker.register('./sw.js?v=24',{updateViaCache:'none'});
    registration.update().catch(()=>{});
  }catch(error){console.info('Service Worker no disponible',error)}
}
async function boot(){
  document.documentElement.dataset.emulatorBuild=BUILD;
  registerSW();
  const [{initUI},{cloud}]=await Promise.all([
    import('./ui-v24.js?v=24'),
    import('./cloud.js')
  ]);
  initUI();
  window.__editorialEmulatorBooted=true;
  window.dispatchEvent(new CustomEvent('editorial-emulator:ready',{detail:{build:BUILD}}));
  queueMicrotask(()=>{try{cloud.init()}catch(error){console.info('Supabase no disponible al iniciar; la UI sigue operativa.',error)}});
}
boot().catch(showBootError);
