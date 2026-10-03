import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { DEFAULT_TEMPLATES, emptyDraft, seededDraft } from '../js/defaults.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const WORKSPACE = process.env.EDITORIAL_WORKSPACE || 'editorial-os';
const TABLE = 'editorial_state';
const DOWS = [1,2,3,4,5,6,0];
const DAY_NAMES = {1:'Lunes',2:'Martes',3:'Miércoles',4:'Jueves',5:'Viernes',6:'Sábado',0:'Domingo'};
const PLATFORMS = ['instagram','tiktok','linkedin','youtube','facebook'];
const APP_URL = 'https://lordjeferies.github.io/editorial-emulator/?v=31';
const PRODUCT_URL = 'https://lordjeferies.github.io/editorial-emulator/product.html?v=31';
const MCP_URL = 'https://lordjeferies.github.io/editorial-emulator/mcp.html?v=31';

function readFrontendConfig(){
  let url = process.env.EDITORIAL_SUPABASE_URL || '';
  let key = process.env.EDITORIAL_SUPABASE_ANON_KEY || '';
  if(url && key) return {url,key};
  try{
    const src = fs.readFileSync(path.join(ROOT,'supabase-config.js'),'utf8');
    url ||= src.match(/url:\s*["']([^"']+)["']/)?.[1] || '';
    key ||= src.match(/key:\s*["']([^"']+)["']/)?.[1] || '';
  }catch{}
  return {url,key};
}

const cfg = readFrontendConfig();
let client = null;
let session = null;

const clone = x => x == null ? x : JSON.parse(JSON.stringify(x));
const uid = p => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
const now = () => new Date().toISOString();
const normalizeSlots = s => {
  const out = emptyDraft();
  DOWS.forEach(d => out[d] = Array.isArray(s?.[d]) ? s[d] : []);
  return out;
};
const text = data => ({content:[{type:'text',text:typeof data==='string'?data:JSON.stringify(data,null,2)}]});
const fail = message => ({isError:true,content:[{type:'text',text:message}]});

async function ensureAuth(){
  if(!cfg.url || !cfg.key) throw new Error('Supabase no está configurado. Revisa supabase-config.js o EDITORIAL_SUPABASE_URL/ANON_KEY.');
  if(!client) client = createClient(cfg.url,cfg.key,{auth:{persistSession:false,autoRefreshToken:true,detectSessionInUrl:false}});
  if(session?.user) return session;
  const email = process.env.EDITORIAL_SUPABASE_EMAIL || '';
  const password = process.env.EDITORIAL_SUPABASE_PASSWORD || '';
  if(!email || !password) throw new Error('Faltan EDITORIAL_SUPABASE_EMAIL y EDITORIAL_SUPABASE_PASSWORD en el entorno del MCP.');
  const {data,error} = await client.auth.signInWithPassword({email,password});
  if(error) throw error;
  session = data.session;
  return session;
}

async function readPayload(){
  const s = await ensureAuth();
  const {data,error} = await client.from(TABLE).select('payload,updated_at').eq('user_id',s.user.id).eq('workspace_key',WORKSPACE).maybeSingle();
  if(error) throw error;
  const payload = data?.payload && typeof data.payload === 'object' ? clone(data.payload) : {version:9,appData:{},savedScenarios:[]};
  payload.version = 9;
  payload.appData ||= {};
  payload.appData.brands ||= [];
  payload.appData.pillars ||= [];
  payload.appData.families ||= [];
  payload.appData.customContent ||= [];
  payload.savedScenarios ||= [];
  return {payload,updatedAt:data?.updated_at||null,user:s.user};
}

function stripBackups(payload){
  const x = clone(payload);
  delete x.mcpBackups;
  return x;
}

async function writePayload(next, action='mcp_update'){
  const {payload:before,user} = await readPayload();
  const backups = Array.isArray(before.mcpBackups) ? before.mcpBackups : [];
  next.version = 9;
  next.mcpBackups = [{id:uid('backup'),at:now(),action,payload:stripBackups(before)},...backups].slice(0,8);
  next.syncMeta = {...(next.syncMeta||{}),revision:Number(next.syncMeta?.revision||before.syncMeta?.revision||0)+1,deviceId:'mcp',productVersion:'emulator-3.1-mcp',updatedAt:now()};
  const row = {user_id:user.id,workspace_key:WORKSPACE,payload:next,updated_at:now()};
  const {error} = await client.from(TABLE).upsert(row,{onConflict:'user_id,workspace_key'});
  if(error) throw error;
  return next;
}

async function mutate(action, fn){
  const {payload} = await readPayload();
  const next = clone(payload);
  const result = await fn(next);
  await writePayload(next,action);
  return result;
}

function findScenario(payload,id){
  const s = payload.savedScenarios.find(x=>x.id===id);
  if(!s) throw new Error(`Escenario no encontrado: ${id}`);
  s.slots = normalizeSlots(s.slots);
  return s;
}

function allContent(payload){
  const custom = payload.appData?.customContent || [];
  const map = new Map(DEFAULT_TEMPLATES.map(x=>[x.id,clone(x)]));
  custom.forEach(x=>map.set(x.id,{...(map.get(x.id)||{}),...clone(x),custom:true}));
  return [...map.values()].filter(x=>!x.archived);
}

function findContent(payload,id){
  const x = allContent(payload).find(x=>x.id===id);
  if(!x) throw new Error(`Contenido/template no encontrado: ${id}`);
  return x;
}

function updateScenarioMeta(sc){
  sc.updatedAt = now();
  sc.revision = Number(sc.revision||0)+1;
}

function daySchema(){return z.number().int().refine(v=>DOWS.includes(v),'Día inválido. Usa 1..6 o 0 para domingo.');}

const server = new McpServer({name:'editorial-emulator',version:'3.1.0'});

server.tool('editorial_status','Estado general del workspace, autenticación, versión y conteos.',{},async()=>{
  try{
    const {payload,updatedAt,user} = await readPayload();
    return text({ok:true,workspace:WORKSPACE,user:{id:user.id,email:user.email},payloadVersion:payload.version,remoteUpdatedAt:updatedAt,scenarios:payload.savedScenarios.length,brands:payload.appData.brands.length,pillars:payload.appData.pillars.length,families:payload.appData.families.length,customContent:payload.appData.customContent.length,backups:(payload.mcpBackups||[]).length,appUrl:APP_URL,mcpGuide:MCP_URL});
  }catch(e){return fail(e.message)}
});

server.tool('editorial_get_capabilities','Lista las capacidades, herramientas, reglas de seguridad y enlaces del MCP.',{},async()=>text({
  version:'3.1.0',
  model:'Supabase canonical workspace + realtime clients',
  can:['listar/crear/duplicar/renombrar/eliminar escenarios','leer/editar planes semanales','añadir/mover/reordenar/eliminar contenido','crear/editar/archivar contenido personalizado','gestionar marcas/pilares/familias','generar preview de ocurrencias por red','validar estado','crear backups automáticos','restaurar backups','aplicar lotes de operaciones'],
  rules:['usar IDs estables','no sobrescribir campos desconocidos','crear backup antes de cada mutación','confirm=true para operaciones destructivas','no guardar contraseñas en el repo','la app debe estar conectada a Supabase para recibir cambios en tiempo real'],
  links:{app:APP_URL,product:PRODUCT_URL,mcp:MCP_URL,repo:'https://github.com/LordJeferies/editorial-emulator'}
}));

server.tool('editorial_list_scenarios','Lista escenarios guardados con rango, marca y cantidad de piezas.',{},async()=>{
  try{const {payload}=await readPayload();return text(payload.savedScenarios.map(s=>({id:s.id,name:s.name,brandId:s.brandId,range:s.range,revision:s.revision,updatedAt:s.updatedAt,pieces:Object.values(s.slots||{}).flat().length})));}catch(e){return fail(e.message)}
});

server.tool('editorial_get_scenario','Devuelve un escenario completo.',{scenario_id:z.string().min(1)},async({scenario_id})=>{
  try{const {payload}=await readPayload();return text(findScenario(payload,scenario_id));}catch(e){return fail(e.message)}
});

server.tool('editorial_create_scenario','Crea escenario vacío, Base JOC o duplicado.',{
  name:z.string().min(1),brand_id:z.string().default('joc'),start_date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),mode:z.enum(['empty','joc_base','duplicate']).default('empty'),source_scenario_id:z.string().optional()
},async(args)=>{
  try{return text(await mutate('create_scenario',payload=>{
    let slots = emptyDraft();
    if(args.mode==='joc_base') slots = seededDraft();
    if(args.mode==='duplicate') slots = clone(findScenario(payload,args.source_scenario_id).slots);
    const d = new Date(args.start_date+'T12:00:00'); d.setDate(d.getDate()+6);
    const sc={id:uid('scenario'),name:args.name,brandId:args.brand_id,createdAt:now(),updatedAt:now(),revision:1,source:args.mode,range:{start:args.start_date,end:d.toISOString().slice(0,10)},slots:normalizeSlots(slots)};
    payload.savedScenarios.unshift(sc); return sc;
  }));}catch(e){return fail(e.message)}
});

server.tool('editorial_duplicate_scenario','Duplica un escenario completo.',{scenario_id:z.string(),name:z.string().optional()},async({scenario_id,name})=>{
  try{return text(await mutate('duplicate_scenario',payload=>{const src=findScenario(payload,scenario_id);const copy={...clone(src),id:uid('scenario'),name:name||`${src.name} · copia`,createdAt:now(),updatedAt:now(),revision:1,source:'duplicate'};payload.savedScenarios.unshift(copy);return copy;}));}catch(e){return fail(e.message)}
});

server.tool('editorial_rename_scenario','Renombra un escenario.',{scenario_id:z.string(),name:z.string().min(1)},async({scenario_id,name})=>{
  try{return text(await mutate('rename_scenario',payload=>{const s=findScenario(payload,scenario_id);s.name=name;updateScenarioMeta(s);return {id:s.id,name:s.name};}));}catch(e){return fail(e.message)}
});

server.tool('editorial_delete_scenario','Elimina un escenario. Requiere confirm=true.',{scenario_id:z.string(),confirm:z.boolean()},async({scenario_id,confirm})=>{
  if(!confirm) return fail('Operación cancelada: delete_scenario requiere confirm=true.');
  try{return text(await mutate('delete_scenario',payload=>{const before=payload.savedScenarios.length;payload.savedScenarios=payload.savedScenarios.filter(x=>x.id!==scenario_id);if(payload.savedScenarios.length===before)throw new Error('Escenario no encontrado');return {deleted:scenario_id};}));}catch(e){return fail(e.message)}
});

server.tool('editorial_get_plan','Devuelve el plan semanal de un escenario por día.',{scenario_id:z.string()},async({scenario_id})=>{
  try{const {payload}=await readPayload();const s=findScenario(payload,scenario_id);return text({scenario:{id:s.id,name:s.name,range:s.range},days:Object.fromEntries(DOWS.map(d=>[d,{name:DAY_NAMES[d],items:s.slots[d]}]))});}catch(e){return fail(e.message)}
});

server.tool('editorial_add_content','Añade una pieza existente del catálogo a un día.',{scenario_id:z.string(),day:daySchema(),content_id:z.string(),index:z.number().int().nonnegative().optional()},async(args)=>{
  try{return text(await mutate('planner_add',payload=>{const s=findScenario(payload,args.scenario_id);const t=findContent(payload,args.content_id);const item={...clone(t),templateId:t.id,instanceId:uid('item')};const a=s.slots[args.day];const i=args.index==null?a.length:Math.min(args.index,a.length);a.splice(i,0,item);updateScenarioMeta(s);return {day:args.day,index:i,item};}));}catch(e){return fail(e.message)}
});

server.tool('editorial_move_item','Mueve una pieza entre días o dentro del mismo día.',{scenario_id:z.string(),instance_id:z.string(),to_day:daySchema(),to_index:z.number().int().nonnegative().optional()},async(args)=>{
  try{return text(await mutate('planner_move',payload=>{const s=findScenario(payload,args.scenario_id);let item=null,fromDay=null,fromIndex=-1;for(const d of DOWS){const i=s.slots[d].findIndex(x=>x.instanceId===args.instance_id);if(i>=0){fromDay=d;fromIndex=i;[item]=s.slots[d].splice(i,1);break}}if(!item)throw new Error('instance_id no encontrado');const target=s.slots[args.to_day];const i=args.to_index==null?target.length:Math.min(args.to_index,target.length);target.splice(i,0,item);updateScenarioMeta(s);return {instanceId:item.instanceId,fromDay,fromIndex,toDay:args.to_day,toIndex:i};}));}catch(e){return fail(e.message)}
});

server.tool('editorial_reorder_day','Reordena un día usando todos sus instance_id en el orden deseado.',{scenario_id:z.string(),day:daySchema(),ordered_instance_ids:z.array(z.string()).min(1)},async(args)=>{
  try{return text(await mutate('planner_reorder',payload=>{const s=findScenario(payload,args.scenario_id);const current=s.slots[args.day];const map=new Map(current.map(x=>[x.instanceId,x]));const ordered=args.ordered_instance_ids.map(id=>map.get(id)).filter(Boolean);if(ordered.length!==current.length)throw new Error('ordered_instance_ids debe incluir todas las piezas del día exactamente una vez');s.slots[args.day]=ordered;updateScenarioMeta(s);return {day:args.day,order:ordered.map(x=>x.instanceId)};}));}catch(e){return fail(e.message)}
});

server.tool('editorial_remove_item','Elimina una pieza del plan por instance_id.',{scenario_id:z.string(),instance_id:z.string()},async(args)=>{
  try{return text(await mutate('planner_remove',payload=>{const s=findScenario(payload,args.scenario_id);for(const d of DOWS){const i=s.slots[d].findIndex(x=>x.instanceId===args.instance_id);if(i>=0){const [removed]=s.slots[d].splice(i,1);updateScenarioMeta(s);return {day:d,removed};}}throw new Error('instance_id no encontrado');}));}catch(e){return fail(e.message)}
});

server.tool('editorial_clear_plan','Vacía todo el plan. Requiere confirm=true. Se crea backup automático.',{scenario_id:z.string(),confirm:z.boolean()},async({scenario_id,confirm})=>{
  if(!confirm)return fail('Operación cancelada: clear_plan requiere confirm=true.');
  try{return text(await mutate('planner_clear',payload=>{const s=findScenario(payload,scenario_id);const count=Object.values(s.slots).flat().length;s.slots=emptyDraft();updateScenarioMeta(s);return {cleared:count};}));}catch(e){return fail(e.message)}
});

server.tool('editorial_apply_batch','Aplica varias operaciones de plan en una sola escritura/backup.',{
  scenario_id:z.string(),operations:z.array(z.object({type:z.enum(['add','move','remove']),day:z.number().optional(),content_id:z.string().optional(),instance_id:z.string().optional(),to_day:z.number().optional(),to_index:z.number().optional()})).min(1)
},async({scenario_id,operations})=>{
  try{return text(await mutate('planner_batch',payload=>{const s=findScenario(payload,scenario_id);const results=[];for(const op of operations){if(op.type==='add'){if(!DOWS.includes(op.day))throw new Error('add requiere day válido');const t=findContent(payload,op.content_id);const item={...clone(t),templateId:t.id,instanceId:uid('item')};s.slots[op.day].push(item);results.push({type:'add',instanceId:item.instanceId,day:op.day});}else if(op.type==='move'){let item=null,from=null;for(const d of DOWS){const i=s.slots[d].findIndex(x=>x.instanceId===op.instance_id);if(i>=0){from=d;[item]=s.slots[d].splice(i,1);break}}if(!item||!DOWS.includes(op.to_day))throw new Error('move inválido');const target=s.slots[op.to_day];target.splice(op.to_index==null?target.length:Math.min(op.to_index,target.length),0,item);results.push({type:'move',instanceId:item.instanceId,from,to:op.to_day});}else{let removed=false;for(const d of DOWS){const i=s.slots[d].findIndex(x=>x.instanceId===op.instance_id);if(i>=0){s.slots[d].splice(i,1);removed=true;results.push({type:'remove',instanceId:op.instance_id,day:d});break}}if(!removed)throw new Error(`remove: ${op.instance_id} no encontrado`);}}updateScenarioMeta(s);return results;}));}catch(e){return fail(e.message)}
});

server.tool('editorial_list_content','Lista catálogo base + contenido personalizado. Puede filtrar por plataforma/lote.',{platform:z.enum(PLATFORMS).optional(),lot:z.enum(['L1','L2','L3']).optional()},async({platform,lot})=>{
  try{const {payload}=await readPayload();let list=allContent(payload);if(platform)list=list.filter(x=>(x.platforms||[]).includes(platform));if(lot)list=list.filter(x=>x.lot===lot);return text(list);}catch(e){return fail(e.message)}
});

server.tool('editorial_create_content','Crea contenido personalizado reutilizable.',{
  title:z.string().min(1),type:z.string().default('Contenido'),lot:z.enum(['L1','L2','L3']).default('L2'),surface:z.string().default('Feed'),platforms:z.array(z.enum(PLATFORMS)).min(1),pillar_id:z.string().optional(),family_id:z.string().optional(),caption:z.string().optional(),description:z.string().optional()
},async(args)=>{
  try{return text(await mutate('create_content',payload=>{const item={id:uid('custom'),title:args.title,type:args.type,lot:args.lot,surface:args.surface,platforms:args.platforms,pillarId:args.pillar_id||'',familyId:args.family_id||'',caption:args.caption||args.title,description:args.description||'',custom:true,archived:false};payload.appData.customContent.push(item);return item;}));}catch(e){return fail(e.message)}
});

server.tool('editorial_update_content','Edita un contenido personalizado existente.',{content_id:z.string(),patch:z.object({title:z.string().optional(),type:z.string().optional(),lot:z.enum(['L1','L2','L3']).optional(),surface:z.string().optional(),platforms:z.array(z.enum(PLATFORMS)).optional(),pillarId:z.string().optional(),familyId:z.string().optional(),caption:z.string().optional(),description:z.string().optional(),archived:z.boolean().optional()})},async({content_id,patch})=>{
  try{return text(await mutate('update_content',payload=>{const x=payload.appData.customContent.find(x=>x.id===content_id);if(!x)throw new Error('Sólo se pueden editar contenidos personalizados por este tool');Object.assign(x,patch,{updatedAt:now()});return x;}));}catch(e){return fail(e.message)}
});

server.tool('editorial_get_taxonomy','Lista marcas, pilares y familias.',{},async()=>{
  try{const {payload}=await readPayload();return text({brands:payload.appData.brands||[],pillars:payload.appData.pillars||[],families:payload.appData.families||[]});}catch(e){return fail(e.message)}
});

server.tool('editorial_create_taxonomy','Crea marca, pilar o familia.',{
  kind:z.enum(['brand','pillar','family']),name:z.string().min(1),description:z.string().optional(),color:z.string().optional(),pillar_id:z.string().optional(),platforms:z.array(z.enum(PLATFORMS)).optional()
},async(args)=>{
  try{return text(await mutate('create_taxonomy',payload=>{const id=uid(args.kind);let item;if(args.kind==='brand'){item={id,name:args.name,initials:args.name.slice(0,2).toUpperCase(),color:args.color||'#6d5dfc',platforms:args.platforms||PLATFORMS,enabledContentIds:allContent(payload).map(x=>x.id),archived:false};payload.appData.brands.push(item);}else if(args.kind==='pillar'){item={id,name:args.name,description:args.description||'',archived:false};payload.appData.pillars.push(item);}else{item={id,name:args.name,pillarId:args.pillar_id||'',description:args.description||'',archived:false};payload.appData.families.push(item);}return item;}));}catch(e){return fail(e.message)}
});

server.tool('editorial_preview_feeds','Deriva las ocurrencias de feed del escenario, opcionalmente por plataforma.',{scenario_id:z.string(),platform:z.enum(PLATFORMS).optional()},async({scenario_id,platform})=>{
  try{const {payload}=await readPayload();const s=findScenario(payload,scenario_id);const out=[];for(const d of DOWS){for(const [i,x] of s.slots[d].entries()){for(const p of x.platforms||[]){if(platform&&p!==platform)continue;out.push({platform:p,day:d,dayName:DAY_NAMES[d],order:i,title:x.title,type:x.type,lot:x.lot,surface:x.surface,instanceId:x.instanceId});}}}return text({scenario:{id:s.id,name:s.name},count:out.length,occurrences:out});}catch(e){return fail(e.message)}
});

server.tool('editorial_validate_state','Audita integridad básica del workspace y del plan.',{},async()=>{
  try{const {payload}=await readPayload();const issues=[];const ids=new Set();for(const s of payload.savedScenarios){if(ids.has(s.id))issues.push(`scenario id duplicado: ${s.id}`);ids.add(s.id);for(const d of DOWS){if(!Array.isArray(s.slots?.[d]))issues.push(`${s.name}: día ${d} inválido`);const seen=new Set();for(const x of s.slots?.[d]||[]){if(!x.instanceId)issues.push(`${s.name}/${DAY_NAMES[d]}: pieza sin instanceId`);if(seen.has(x.instanceId))issues.push(`${s.name}/${DAY_NAMES[d]}: instanceId duplicado ${x.instanceId}`);seen.add(x.instanceId);}}}return text({ok:issues.length===0,issues,counts:{scenarios:payload.savedScenarios.length,content:allContent(payload).length}});}catch(e){return fail(e.message)}
});

server.tool('editorial_list_backups','Lista backups automáticos creados antes de mutaciones MCP.',{},async()=>{
  try{const {payload}=await readPayload();return text((payload.mcpBackups||[]).map(({id,at,action})=>({id,at,action})));}catch(e){return fail(e.message)}
});

server.tool('editorial_restore_backup','Restaura un backup MCP. Requiere confirm=true.',{backup_id:z.string(),confirm:z.boolean()},async({backup_id,confirm})=>{
  if(!confirm)return fail('Operación cancelada: restore_backup requiere confirm=true.');
  try{const {payload}=await readPayload();const b=(payload.mcpBackups||[]).find(x=>x.id===backup_id);if(!b)throw new Error('Backup no encontrado');const restored=clone(b.payload);await writePayload(restored,'restore_backup');return text({restored:backup_id,from:b.at,action:b.action});}catch(e){return fail(e.message)}
});

server.tool('editorial_get_usage_criteria','Devuelve criterios recomendados para que un agente use la app sin romper datos.',{},async()=>text({
  planning:['preservar coherencia narrativa y objetivo del escenario','usar Board/Timeline/Agenda sólo como vistas del mismo estado','preferir IDs existentes antes de crear duplicados','mantener balance por plataforma, lote y día'],
  mutation:['leer antes de escribir','usar batch para cambios relacionados','confirm=true sólo cuando el usuario haya pedido una operación destructiva','no borrar taxonomías referenciadas','validar después de cambios grandes'],
  cloud:['Supabase es la fuente compartida entre Web/PWA/Desktop/MCP','la app cliente debe tener sesión Cloud para recibir cambios realtime','no usar service_role ni secret keys en clientes'],
  recovery:['cada mutación MCP crea backup','usar editorial_list_backups + editorial_restore_backup si un cambio quedó mal']
}));

const transport = new StdioServerTransport();
await server.connect(transport);
