const BUILD='2.3';
const BUILD_KEY='editorialEmulatorBootBuild';
const APP_ASSETS=[
  './js/ui.js','./js/store.js','./js/defaults.js','./js/cloud.js','./js/feeds.js','./js/controllers.js','./css/app.css'
];

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

async function clearOldAppCaches(){
  if(!('caches' in window))return;
  try{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith('editorial-emulator-')).map(k=>caches.delete(k)));
  }catch(error){
    console.info('No se pudieron limpiar caches anteriores',error);
  }
}

async function refreshServiceWorker(){
  if(!('serviceWorker' in navigator))return;
  try{
    const registration=await navigator.serviceWorker.register('./sw.js?v=23',{updateViaCache:'none'});
    registration.update().catch(()=>{});
  }catch(error){
    console.info('Service Worker no disponible; la app seguirá online.',error);
  }
}

async function warmFreshModules(){
  await Promise.all(APP_ASSETS.map(async url=>{
    try{await fetch(url,{cache:'reload'})}catch{}
  }));
}

async function migrateMixedCachesOnce(){
  let current='';
  try{current=localStorage.getItem(BUILD_KEY)||''}catch{}
  if(current===BUILD)return;
  await clearOldAppCaches();
  await warmFreshModules();
  try{localStorage.setItem(BUILD_KEY,BUILD)}catch{}
}

async function boot(){
  document.documentElement.dataset.emulatorBuild=BUILD;
  await migrateMixedCachesOnce();
  const [{initUI},{cloud}]=await Promise.all([
    import('./ui.js?v=23'),
    import('./cloud.js?v=23')
  ]);
  cloud.init();
  initUI();
  window.__editorialEmulatorBooted=true;
  window.dispatchEvent(new CustomEvent('editorial-emulator:ready',{detail:{build:BUILD}}));
  refreshServiceWorker();
}

boot().catch(showBootError);
