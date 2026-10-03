(()=>{'use strict';
const WORKSPACE='editorial-os';
const TABLE='editorial_state';
const SUPABASE_ESM='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
const KEYS={app:'jocEditorialV9AppData',scenarios:'jocEditorialV9Scenarios',draft:'editorialEmulatorV2Draft',current:'editorialEmulatorV2CurrentScenario'};
const WATCHED=new Set([KEYS.app,KEYS.scenarios,KEYS.draft,KEYS.current]);
let client=null,channel=null,pushTimer=null,dirty=false,internalWrite=false,started=false;
const safeParse=(v,f)=>{try{return JSON.parse(v)??f}catch{return f}};
const clone=x=>x==null?x:JSON.parse(JSON.stringify(x));
const uid=()=>globalThis.crypto?.randomUUID?.()||`emu-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
const config=()=>({url:window.EDITORIAL_SUPABASE?.url||'',key:window.EDITORIAL_SUPABASE?.key||''});
function mergeById(remote=[],local=[],prefer='local'){
  const m=new Map();
  const rr=Array.isArray(remote)?remote:[],ll=Array.isArray(local)?local:[];
  for(const x of rr)if(x?.id)m.set(x.id,clone(x));
  for(const x of ll)if(x?.id){const prev=m.get(x.id)||{};m.set(x.id,prefer==='remote'?{...clone(x),...prev}:{...prev,...clone(x)})}
  return [...m.values()];
}
function localOwned(){
  const appData=safeParse(localStorage.getItem(KEYS.app),{});
  const savedScenarios=safeParse(localStorage.getItem(KEYS.scenarios),[]);
  const plannerDraft=safeParse(localStorage.getItem(KEYS.draft),null);
  const currentId=localStorage.getItem(KEYS.current)||'';
  const current=savedScenarios.find(x=>x?.id===currentId);
  if(current&&plannerDraft)current.slots=clone(plannerDraft);
  return {appData,savedScenarios,plannerDraft};
}
function mergeForPush(remote,owned){
  const r=remote&&typeof remote==='object'?clone(remote):{};
  const ra=r.appData||{},la=owned.appData||{};
  r.version=9;
  r.appData={...ra,...la,
    brands:mergeById(ra.brands,la.brands,'local'),
    pillars:mergeById(ra.pillars,la.pillars,'local'),
    families:mergeById(ra.families,la.families,'local'),
    customContent:mergeById(ra.customContent,la.customContent,'local'),
    completion:{...(ra.completion||{}),...(la.completion||{})},
    production:{...(ra.production||{}),...(la.production||{})},
    history:[...(la.history||[]),...(ra.history||[])].filter((x,i,a)=>x?.id&&a.findIndex(y=>y?.id===x.id)===i).slice(0,300)
  };
  r.savedScenarios=mergeById(r.savedScenarios||[],owned.savedScenarios||[],'local');
  r.plannerDraft=owned.plannerDraft||r.plannerDraft||null;
  const prev=Number(r.syncMeta?.revision||0),deviceId=localStorage.getItem('editorialEmulatorDeviceId')||uid();
  internalWrite=true;try{localStorage.setItem('editorialEmulatorDeviceId',deviceId)}finally{internalWrite=false}
  r.syncMeta={...(r.syncMeta||{}),revision:prev+1,baseRevision:prev,deviceId,productVersion:'emulator-3.2',updatedAt:new Date().toISOString()};
  return r;
}
function mergeForRemote(remote,owned){
  const r=remote&&typeof remote==='object'?clone(remote):{};
  const ra=r.appData||{},la=owned.appData||{};
  const out={...clone(owned||{}),...r,version:9};
  out.appData={...la,...ra,
    brands:mergeById(ra.brands,la.brands,'remote'),
    pillars:mergeById(ra.pillars,la.pillars,'remote'),
    families:mergeById(ra.families,la.families,'remote'),
    customContent:mergeById(ra.customContent,la.customContent,'remote'),
    completion:{...(la.completion||{}),...(ra.completion||{})},
    production:{...(la.production||{}),...(ra.production||{})},
    history:[...(ra.history||[]),...(la.history||[])].filter((x,i,a)=>x?.id&&a.findIndex(y=>y?.id===x.id)===i).slice(0,300)
  };
  out.savedScenarios=mergeById(r.savedScenarios||[],owned.savedScenarios||[],'remote');
  out.plannerDraft=r.plannerDraft||owned.plannerDraft||null;
  return out;
}
function setStatus(text,kind=''){
  const el=document.getElementById('syncPill');if(!el)return;
  el.textContent=text;el.classList.toggle('ok',kind==='ok');el.dataset.cloud=kind||'local';
  el.setAttribute('role','button');el.setAttribute('tabindex','0');el.setAttribute('title','Estado de Supabase · clic para administrar');
}
function toast(text){const host=document.getElementById('toastRegion');if(!host)return;const n=document.createElement('div');n.className='toast';n.textContent=text;host.appendChild(n);setTimeout(()=>n.remove(),2600)}
async function ensureClient(){
  if(client)return client;const c=config();if(!c.url||!c.key)return null;
  let lib=window.supabase;if(!lib?.createClient){try{lib=await import(SUPABASE_ESM)}catch(e){console.info('Supabase SDK no disponible.',e);return null}}
  client=lib.createClient(c.url,c.key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});return client;
}
async function session(){const c=await ensureClient();if(!c)return null;const {data,error}=await c.auth.getSession();if(error)return null;return data.session||null}
function writeRemote(payload){
  const local=localOwned(),merged=mergeForRemote(payload||{},local);
  internalWrite=true;
  try{
    localStorage.setItem(KEYS.app,JSON.stringify(merged.appData||{}));
    localStorage.setItem(KEYS.scenarios,JSON.stringify(merged.savedScenarios||[]));
    const currentId=localStorage.getItem(KEYS.current)||'';
    const current=(merged.savedScenarios||[]).find(x=>x?.id===currentId);
    if(current?.slots)localStorage.setItem(KEYS.draft,JSON.stringify(current.slots));
    else if(merged.plannerDraft)localStorage.setItem(KEYS.draft,JSON.stringify(merged.plannerDraft));
  }finally{internalWrite=false}
  window.dispatchEvent(new CustomEvent('editorial:cloud-applied',{detail:{revision:merged.syncMeta?.revision||0}}));
  return merged;
}
async function pull({reload=false,silent=false}={}){
  const c=await ensureClient(),s=await session();if(!c||!s)return false;
  setStatus('Sincronizando…');
  const {data,error}=await c.from(TABLE).select('payload').eq('user_id',s.user.id).eq('workspace_key',WORKSPACE).maybeSingle();
  if(error){setStatus('Cloud · error');if(!silent)toast('No se pudo leer Supabase');return false}
  if(data?.payload){writeRemote(data.payload);dirty=false;setStatus('Cloud · sincronizado','ok');if(reload){sessionStorage.setItem('editorialCloudHydrated','1');location.reload();return true}}
  else setStatus('Cloud · listo','ok');
  return true;
}
async function push({silent=true}={}){
  clearTimeout(pushTimer);if(!navigator.onLine)return false;
  const c=await ensureClient(),s=await session();if(!c||!s){setStatus('Cloud · iniciar sesión');return false}
  setStatus('Sincronizando…');
  const {data,error}=await c.from(TABLE).select('payload').eq('user_id',s.user.id).eq('workspace_key',WORKSPACE).maybeSingle();
  if(error){setStatus('Cloud · error');if(!silent)toast('No se pudo leer Supabase');return false}
  const merged=mergeForPush(data?.payload,localOwned());
  const row={user_id:s.user.id,workspace_key:WORKSPACE,payload:merged,updated_at:new Date().toISOString()};
  const {error:upErr}=await c.from(TABLE).upsert(row,{onConflict:'user_id,workspace_key'});
  if(upErr){setStatus('Cloud · error');if(!silent)toast('No se pudo guardar en Supabase');return false}
  dirty=false;setStatus('Cloud · sincronizado','ok');return true;
}
function schedulePush(){dirty=true;setStatus(navigator.onLine?'Cloud · pendiente':'Offline');clearTimeout(pushTimer);pushTimer=setTimeout(()=>push({silent:true}),1000)}
async function subscribe(){
  const c=await ensureClient(),s=await session();if(!c||!s)return;if(channel)c.removeChannel(channel);
  channel=c.channel(`editorial-emulator-${s.user.id}`).on('postgres_changes',{event:'UPDATE',schema:'public',table:TABLE,filter:`user_id=eq.${s.user.id}`},payload=>{
    if(payload.new?.workspace_key!==WORKSPACE)return;
    if(!dirty){writeRemote(payload.new?.payload);setStatus('Cloud · actualizado','ok');toast('Datos actualizados desde Supabase')}
    else setStatus('Cloud · cambios remotos');
  }).subscribe();
}
function injectStyles(){if(document.getElementById('cloudV29Style'))return;const s=document.createElement('style');s.id='cloudV29Style';s.textContent=`.cloud-v29-backdrop{position:fixed;inset:0;z-index:9998;background:rgba(0,0,0,.48);display:grid;place-items:center;padding:20px}.cloud-v29{width:min(460px,100%);background:var(--surface-floating,#17191f);color:var(--text-primary,#fff);border:1px solid var(--border-default,rgba(255,255,255,.12));border-radius:20px;padding:20px;box-shadow:0 24px 80px rgba(0,0,0,.42)}.cloud-v29 h2{margin:0 0 6px}.cloud-v29 p{color:var(--text-secondary,#aaa);line-height:1.45}.cloud-v29 .row{display:grid;gap:10px;margin-top:14px}.cloud-v29 input{width:100%;min-height:44px;border-radius:12px;border:1px solid var(--border-default,rgba(255,255,255,.14));background:var(--surface-raised,#22252c);color:inherit;padding:0 12px;font-size:16px}.cloud-v29 .actions{display:flex;gap:8px;justify-content:flex-end;margin-top:16px;flex-wrap:wrap}`;document.head.appendChild(s)}
async function openCloud(){
  injectStyles();const c=await ensureClient();const s=await session();
  const wrap=document.createElement('div');wrap.className='cloud-v29-backdrop';
  if(!c){wrap.innerHTML=`<div class="cloud-v29"><h2>Supabase no disponible</h2><p>La app sigue funcionando localmente. Verifica la conexión a internet.</p><div class="actions"><button class="btn btn-primary" data-close>Cerrar</button></div></div>`}
  else if(s){wrap.innerHTML=`<div class="cloud-v29"><h2>Supabase conectado</h2><p>${s.user.email||'Sesión activa'}<br>Workspace: <b>${WORKSPACE}</b></p><div class="actions"><button class="btn btn-secondary" data-pull>Traer datos</button><button class="btn btn-primary" data-push>Sincronizar ahora</button><button class="btn btn-ghost" data-signout>Cerrar sesión</button></div></div>`}
  else{wrap.innerHTML=`<div class="cloud-v29"><h2>Conectar Supabase</h2><p>La URL y la clave pública ya están configuradas desde Editorial OS. Sólo necesitas iniciar sesión una vez en este cliente para acceder a tus datos protegidos por usuario.</p><div class="row"><input data-email type="email" autocomplete="username" placeholder="Email"><input data-password type="password" autocomplete="current-password" placeholder="Contraseña"></div><div class="actions"><button class="btn btn-secondary" data-close>Cancelar</button><button class="btn btn-primary" data-signin>Iniciar sesión</button></div></div>`}
  document.body.appendChild(wrap);
  wrap.addEventListener('click',async e=>{
    if(e.target===wrap||e.target.closest('[data-close]'))wrap.remove();
    if(e.target.closest('[data-signin]')){const email=wrap.querySelector('[data-email]')?.value.trim(),password=wrap.querySelector('[data-password]')?.value||'';if(!email||!password)return;setStatus('Conectando…');const {error}=await c.auth.signInWithPassword({email,password});if(error){toast(error.message);setStatus('Cloud · iniciar sesión');return}wrap.remove();toast('Supabase conectado');await pull({reload:true})}
    if(e.target.closest('[data-push]')){await push({silent:false});toast('Sincronización completada');wrap.remove()}
    if(e.target.closest('[data-pull]')){await pull({reload:true,silent:false})}
    if(e.target.closest('[data-signout]')){await c.auth.signOut();if(channel)c.removeChannel(channel);channel=null;setStatus('Cloud · iniciar sesión');wrap.remove();toast('Sesión de Supabase cerrada')}
  })
}
function patchStorage(){const original=Storage.prototype.setItem;if(original.__editorialCloudPatched)return;function patched(k,v){const r=original.call(this,k,v);if(this===localStorage&&!internalWrite&&WATCHED.has(String(k)))schedulePush();return r}patched.__editorialCloudPatched=true;Storage.prototype.setItem=patched}
async function start(){
  if(started)return;started=true;patchStorage();
  const pill=document.getElementById('syncPill');if(pill){pill.addEventListener('click',openCloud);pill.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openCloud()}})}
  const c=config();if(!c.url||!c.key){setStatus('Local');return}
  const s=await session();if(!s){setStatus('Cloud · iniciar sesión');return}
  setStatus('Cloud · conectado','ok');
  if(sessionStorage.getItem('editorialCloudHydrated')!=='1')await pull({reload:true,silent:true});else{await pull({reload:false,silent:true});await subscribe()}
}
window.addEventListener('online',()=>{if(dirty)push({silent:true});else setStatus('Cloud · conectado','ok')});window.addEventListener('offline',()=>setStatus('Offline'));
window.EDITORIAL_CLOUD={start,pull,push,open:openCloud,getSession:session};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();