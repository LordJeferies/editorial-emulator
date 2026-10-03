import {store,STORAGE_KEYS} from './store.js';

const WORKSPACE='editorial-os';
const SUPABASE_ESM='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
let client=null;
let clientPromise=null;
let channel=null;
let timer=null;

function config(){
  let c={url:window.EDITORIAL_SUPABASE?.url||'',key:window.EDITORIAL_SUPABASE?.key||''};
  try{
    const saved=JSON.parse(localStorage.getItem(STORAGE_KEYS.K_CLOUD)||'{}');
    if(saved?.url)c.url=saved.url;
    if(saved?.key)c.key=saved.key;
  }catch{}
  return c;
}
function uid(){return globalThis.crypto?.randomUUID?.()||`emu-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`}
async function loadLibrary(){
  if(window.supabase?.createClient)return window.supabase;
  try{return await import(SUPABASE_ESM)}catch(error){console.info('Supabase SDK no disponible; el Emulador continúa local-first.',error);return null}
}
async function ensureClient(){
  if(client)return client;
  if(clientPromise)return clientPromise;
  const c=config();
  if(!c.url||!c.key)return null;
  clientPromise=(async()=>{
    const lib=await loadLibrary();
    if(!lib?.createClient)return null;
    client=lib.createClient(c.url,c.key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
    return client;
  })().finally(()=>{clientPromise=null});
  return clientPromise;
}
function mergeById(remote=[],local=[]){const m=new Map(remote.map(x=>[x.id,x]));local.forEach(x=>m.set(x.id,{...(m.get(x.id)||{}),...x}));return [...m.values()]}
function mergePayload(remote,owned){
  const r=remote&&typeof remote==='object'?structuredClone(remote):{};
  const ra=r.appData||{},la=owned.appData||{};
  r.version=9;
  r.appData={...ra,...la,brands:mergeById(ra.brands,la.brands),pillars:mergeById(ra.pillars,la.pillars),families:mergeById(ra.families,la.families),customContent:mergeById(ra.customContent,la.customContent),completion:{...(ra.completion||{}),...(la.completion||{})},production:{...(ra.production||{}),...(la.production||{})},history:[...(la.history||[]),...(ra.history||[])].filter((x,i,a)=>a.findIndex(y=>y.id===x.id)===i).slice(0,300)};
  r.plannerDraft=owned.plannerDraft;
  r.savedScenarios=mergeById(r.savedScenarios||[],owned.savedScenarios||[]);
  const prev=Number(r.syncMeta?.revision||0),deviceId=localStorage.getItem('editorialEmulatorDeviceId')||uid();
  localStorage.setItem('editorialEmulatorDeviceId',deviceId);
  r.syncMeta={...(r.syncMeta||{}),revision:prev+1,baseRevision:prev,deviceId,productVersion:'emulator-2.4',updatedAt:new Date().toISOString()};
  return r;
}
async function session(){
  const c=await ensureClient();
  if(!c)return null;
  const {data,error}=await c.auth.getSession();
  if(error){store.setCloud({status:'local',session:null});return null}
  store.setCloud({session:data.session||null});
  return data.session||null;
}
async function subscribe(){
  const c=await ensureClient(),s=await session();
  if(!s||!c)return;
  if(channel)c.removeChannel(channel);
  channel=c.channel(`editorial-emulator-${s.user.id}`).on('postgres_changes',{event:'UPDATE',schema:'public',table:'editorial_state',filter:`user_id=eq.${s.user.id}`},payload=>{
    if(!store.state.dirty&&payload.new?.payload){store.mergeCloudPayload(payload.new.payload);store.setCloud({status:'synced',lastPayload:payload.new.payload})}
    else if(payload.new?.payload)store.setCloud({status:'remote'});
  }).subscribe();
}

export const cloud={
  async init(){
    if(!this.configured()){store.setCloud({status:'local'});return false}
    store.setCloud({status:'local'});
    try{
      const c=await ensureClient();
      if(!c)return false;
      const s=await session();
      if(!s){store.setCloud({status:'local'});return true}
      await this.pull(true);
      await subscribe();
      return true;
    }catch(error){console.info('Sincronización cloud diferida.',error);store.setCloud({status:'local'});return false}
  },
  async pull(silent=false){
    const c=await ensureClient();if(!c)return false;
    const s=await session();if(!s){if(!silent)throw new Error('No hay una sesión de Supabase activa.');return false}
    store.setCloud({status:'syncing'});
    const {data,error}=await c.from('editorial_state').select('payload').eq('user_id',s.user.id).eq('workspace_key',WORKSPACE).maybeSingle();
    if(error){store.setCloud({status:'error'});if(!silent)throw error;return false}
    if(data?.payload){store.mergeCloudPayload(data.payload);store.setCloud({status:'synced',lastPayload:data.payload,remoteRevision:Number(data.payload.syncMeta?.revision||0)})}else store.setCloud({status:'synced'});
    return true;
  },
  schedule(){
    clearTimeout(timer);
    if(!this.configured())return;
    store.setCloud({status:navigator.onLine?'pending':'error'});
    timer=setTimeout(()=>this.push(true),900);
  },
  async push(silent=false){
    if(!navigator.onLine)return false;
    const c=await ensureClient();if(!c)return false;
    const s=await session();if(!s){store.setCloud({status:'local'});return false}
    store.setCloud({status:'syncing'});
    const {data,error}=await c.from('editorial_state').select('payload').eq('user_id',s.user.id).eq('workspace_key',WORKSPACE).maybeSingle();
    if(error){store.setCloud({status:'error'});if(!silent)throw error;return false}
    const merged=mergePayload(data?.payload,store.exportOwned());
    const row={user_id:s.user.id,workspace_key:WORKSPACE,payload:merged,updated_at:new Date().toISOString()};
    const {error:upErr}=await c.from('editorial_state').upsert(row,{onConflict:'user_id,workspace_key'});
    if(upErr){store.setCloud({status:'error'});if(!silent)throw upErr;return false}
    store.markSynced();store.setCloud({status:'synced',lastPayload:merged,remoteRevision:Number(merged.syncMeta.revision||0)});return true;
  },
  async signIn(email,password){
    const c=await ensureClient();if(!c)throw new Error('Supabase no está disponible en este momento. Puedes seguir usando el Emulador localmente.');
    const {data,error}=await c.auth.signInWithPassword({email,password});if(error)throw error;
    store.setCloud({session:data.session,status:'syncing'});await this.pull(true);await subscribe();return data.session;
  },
  async signOut(){const c=await ensureClient();if(c)await c.auth.signOut();if(channel&&c)c.removeChannel(channel);channel=null;store.setCloud({session:null,status:'local'})},
  configured(){const c=config();return !!(c.url&&c.key)},
  getConfig:config
};
window.addEventListener('online',()=>{if(store.state.dirty)cloud.push(true)});
