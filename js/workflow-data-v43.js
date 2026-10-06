(()=>{'use strict';
const K_APP='jocEditorialV9AppData',K_DRAFT='editorialEmulatorV2Draft',K_WORK='editorialEmulatorV43Workflow';
const STATUSES=[['idea','Sin empezar'],['created','Creado'],['in_design','En diseño'],['review','En revisión'],['correction_pending','Corrección pendiente'],['corrected','Corregido'],['ready','Listo'],['scheduled','Programado'],['published','Publicado'],['done','Hecho']];
const STATUS_MAP=Object.fromEntries(STATUSES),parse=(v,f)=>{try{return JSON.parse(v)??f}catch{return f}},clone=x=>JSON.parse(JSON.stringify(x)),now=()=>new Date().toISOString(),uid=p=>`${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
let state=normalize(parse(localStorage.getItem(K_WORK),{}));
function normalize(x){return {version:1,updatedAt:x?.updatedAt||'',templates:{...(x?.templates||{})},instances:{...(x?.instances||{})}}}
function base(seed={}){return {status:seed.status||'idea',assetUrl:seed.assetUrl||'',notes:Array.isArray(seed.notes)?seed.notes:[],updatedAt:seed.updatedAt||now()}}
function app(){return parse(localStorage.getItem(K_APP),{})}
function saveApp(v){localStorage.setItem(K_APP,JSON.stringify(v));window.dispatchEvent(new CustomEvent('editorial:v43-appdata'))}
function draft(){return parse(localStorage.getItem(K_DRAFT),{})}
function instance(id){for(const [dow,list] of Object.entries(draft()||{})){if(!Array.isArray(list))continue;const x=list.find(y=>(y?.instanceId||'')===id);if(x)return {...x,dow:Number(dow)}}return null}
function template(id){const custom=(app().customContent||[]).find(x=>x.id===id);if(custom)return custom;const card=document.querySelector(`#v30Catalog .v30-source[data-template="${css(id)}"]`);return card?{id,title:card.querySelector('b')?.textContent?.trim()||id,type:card.dataset.v42Type||card.querySelector('small')?.textContent?.split('·')[0]?.trim()||'Contenido',lot:card.dataset.v42Lot||card.querySelector('.lot')?.textContent?.trim()||'',familyId:card.dataset.v42Family||''}:{id,title:id,type:'Contenido',lot:'',familyId:''}}
function refFor(card){const instanceId=card?.dataset?.v30Item||card?.dataset?.instance||'',it=instance(instanceId),templateId=card?.dataset?.template||card?.dataset?.v42Template||it?.templateId||it?.id||'';if(instanceId)return {scope:'instance',id:instanceId,templateId};if(templateId)return {scope:'template',id:templateId,templateId};return null}
function templateRecord(id,create=false){if(!state.templates[id]&&create)state.templates[id]=base();return state.templates[id]||base()}
function instanceRecord(id,templateId,create=false){if(!state.instances[id]&&create){const t=templateRecord(templateId,false);state.instances[id]=base({status:t.status,assetUrl:t.assetUrl})}return state.instances[id]||base(templateRecord(templateId,false))}
function record(ref,create=false){return !ref?null:ref.scope==='instance'?instanceRecord(ref.id,ref.templateId,create):templateRecord(ref.id,create)}
function persist(){state.updatedAt=now();localStorage.setItem(K_WORK,JSON.stringify(state));window.dispatchEvent(new CustomEvent('editorial:v43-changed',{detail:{updatedAt:state.updatedAt}}))}
function replaceState(next){state=normalize(next||{});localStorage.setItem(K_WORK,JSON.stringify(state));window.dispatchEvent(new CustomEvent('editorial:v43-changed',{detail:{updatedAt:state.updatedAt,source:'cloud'}}))}
function statusLabel(id){return STATUS_MAP[id]||'Sin empezar'}
function summary(rec){const notes=rec?.notes||[],open=notes.filter(n=>!n.done),corr=open.filter(n=>n.kind==='correction'),doneCorr=notes.some(n=>n.kind==='correction'&&n.done);if(corr.length)return {kind:'correction',label:corr.length>1?`${corr.length} correcciones`:'Corrección pendiente'};if(open.length)return {kind:'note',label:open.length>1?`${open.length} notas`:'Nota pendiente'};if(rec?.status==='corrected'||doneCorr)return {kind:'ready',label:'Corrección lista'};if(notes.length)return {kind:'ready',label:'Notas listas'};return null}
function setStatus(ref,status){if(!STATUS_MAP[status])return;const r=record(ref,true);r.status=status;r.updatedAt=now();persist()}
function setLink(ref,value){const r=record(ref,true),url=validUrl(value);if(String(value||'').trim()&&!url)return false;r.assetUrl=url;r.updatedAt=now();persist();return true}
function addNote(ref,text,kind='note'){const v=String(text||'').trim();if(!v)return false;const r=record(ref,true);r.notes.push({id:uid('note'),kind:kind==='correction'?'correction':'note',text:v,done:false,createdAt:now(),doneAt:''});if(kind==='correction'&&!['published','done'].includes(r.status))r.status='correction_pending';r.updatedAt=now();persist();return true}
function toggleNote(ref,id){const r=record(ref,true),n=r.notes.find(x=>x.id===id);if(!n)return;n.done=!n.done;n.doneAt=n.done?now():'';if(n.kind==='correction'){const open=r.notes.some(x=>x.kind==='correction'&&!x.done);if(!open&&r.status==='correction_pending')r.status='corrected';if(open&&r.status==='corrected')r.status='correction_pending'}r.updatedAt=now();persist()}
function deleteNote(ref,id){const r=record(ref,true);r.notes=r.notes.filter(x=>x.id!==id);r.updatedAt=now();persist()}
function validUrl(v){let s=String(v||'').trim();if(!s)return '';if(!/^https?:\/\//i.test(s))s='https://'+s;try{const u=new URL(s);return ['http:','https:'].includes(u.protocol)?u.href:''}catch{return ''}}
function css(s){return globalThis.CSS?.escape?CSS.escape(String(s)):String(s).replace(/(["'\\.#:[\]()>+~*])/g,'\\$1')}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function toast(t){const r=document.querySelector('#toastRegion');if(!r)return;const n=document.createElement('div');n.className='toast';n.textContent=t;r.append(n);setTimeout(()=>n.remove(),2200)}
window.EDITORIAL_V43={STATUSES,STATUS_MAP,app,saveApp,draft,instance,template,refFor,record,persist,replaceState,statusLabel,summary,setStatus,setLink,addNote,toggleNote,deleteNote,validUrl,css,esc,toast,clone,state:()=>clone(state)};
})();
