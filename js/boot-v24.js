import('./boot-v25.js?v=25').catch(error=>{
  console.error('Editorial Emulator V2.5 boot failed',error);
  const box=document.getElementById('bootError');
  if(box){box.hidden=false;const detail=box.querySelector('[data-boot-detail]');if(detail)detail.textContent=String(error?.message||error||'Error desconocido')}
});
