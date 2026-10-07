(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s);
let mounted=false,tries=0;
function mount(){
  const planner=$('#plannerV30'),workbench=$('#v37Workbench'),surface=$('#v30Surface'),lib=$('.v37-library');
  if(!planner||!workbench||!surface||!lib)return false;
  const oldPortal=$('#v47LibraryPortal');
  if(lib.parentElement!==workbench)workbench.insertBefore(lib,surface);
  oldPortal?.remove();
  workbench.classList.add('v48-inline-workbench');
  lib.classList.add('v48-inline-library');
  lib.dataset.v48Inline='1';
  $('.v47-sheet-grab',lib)?.remove();
  const title=$('.v37-library-title small',lib);
  if(title)title.textContent='Arrastra al plan o elige un día · el Board permanece visible debajo';
  mounted=true;
  document.documentElement.dataset.libraryLayout='inline-v48';
  window.dispatchEvent(new CustomEvent('editorial:library-layout',{detail:{version:'4.8',mode:'inline'}}));
  return true;
}
function ensure(){if(mount())return;if(++tries>100)return;setTimeout(ensure,40)}
['editorial:planner-rendered','editorial:boot-ready','editorial:catalog-state'].forEach(ev=>window.addEventListener(ev,()=>mount(),{passive:true}));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensure,{once:true});else ensure();
window.EDITORIAL_LIBRARY_LAYOUT_V48={mount};
})();
