(()=>{'use strict';
const WORKSPACE='editorial-os';let client=null,timer=0,hydrating=false;
const E=()=>window.EDITORIAL_V43;
async function ensure(){if(client)return client;const cfg=window.EDITORIAL_SUPABASE;if(!cfg?.url||!cfg?.key)return null;if(!window.supabase){await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';s.onload=resolve;s.onerror=reject;document.head.appendChild(s)})}client=window.supabase?.createClient?.(cfg.url,cfg.key)||null;return client}
async function read(){const c=await ensure();if(!c)return null;const {data:{session}}=await c.auth.getSession();if(!session)return null;const {data}=await c.from('editorial_state').select('payload').eq('user_id',session.user.id).eq('workspace_key',WORKSPACE).maybeSingle();return {c,session,payload:data?.payload||{}}}
async function hydrate(){if(hydrating)return;hydrating=true;try{const x=await read();if(!x)return;const remote=x.payload?.appData?.editorialWorkflowV43;if(!remote?.updatedAt)return;const local=E().state(),rt=Date.parse(remote.updatedAt)||0,lt=Date.parse(local.updatedAt)||0;if(rt>lt)E().replaceState(remote);else if(lt>rt)schedule()}catch(err){console.info('Workflow cloud opcional no disponible',err)}finally{hydrating=false}}
function schedule(){clearTimeout(timer);timer=setTimeout(sync,900)}
async function sync(){try{const x=await read();if(!x)return;const local=E().state(),payload=x.payload||{},next={...payload,version:9,appData:{...(payload.appData||{}),editorialWorkflowV43:local},syncMeta:{...(payload.syncMeta||{}),workflowVersion:'4.3',workflowUpdatedAt:local.updatedAt}};await x.c.from('editorial_state').upsert({user_id:x.session.user.id,workspace_key:WORKSPACE,payload:next,updated_at:new Date().toISOString()},{onConflict:'user_id,workspace_key'})}catch(err){console.info('Workflow V4.3 permanece local',err)}}
function boot(){if(!E())return setTimeout(boot,80);window.addEventListener('editorial:v43-changed',ev=>{if(ev.detail?.source!=='cloud')schedule()});setTimeout(hydrate,1500)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
