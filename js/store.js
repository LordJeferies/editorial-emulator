import {defaultAppData,seededDraft,emptyDraft,DEFAULT_TEMPLATES} from './defaults.js';
const K_STATE='jocEditorialV9',K_APP='jocEditorialV9AppData',K_SC='jocEditorialV9Scenarios',K_CLOUD='jocEditorialV9Cloud';
const K_DRAFT='editorialEmulatorV2Draft',K_CURRENT='editorialEmulatorV2CurrentScenario';
const safeParse=(v,f)=>{try{return JSON.parse(v)??f}catch{return f}};
const clone=x=>structuredClone(x);
const uid=p=>`${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`;
function normalizeDraft(d){const out=emptyDraft();Object.keys(out).forEach(k=>out[k]=Array.isArray(d?.[k])?d[k]:[]);return out}
const baseState=safeParse(localStorage.getItem(K_STATE),{});
const baseApp=defaultAppData(),storedApp=safeParse(localStorage.getItem(K_APP),null);
const savedScenarios=safeParse(localStorage.getItem(K_SC),[]);
const currentScenarioId=localStorage.getItem(K_CURRENT)||'';
const current=savedScenarios.find(x=>x.id===currentScenarioId);
const state={
 ui:{view:'plan',selectedDow:new Date().getDay(),platform:'instagram',instagramMode:'profile',libraryTab:'content',catalogFilter:'all',anchorDate:current?.range?.start||baseState.anchorDate||new Date().toISOString().slice(0,10),simIndex:0,simPlaying:false,activeOccurrenceId:''},
 appData:storedApp?{...baseApp,...storedApp,brands:storedApp.brands||baseApp.brands,pillars:storedApp.pillars||baseApp.pillars,families:storedApp.families||baseApp.families,customContent:storedApp.customContent||[],history:storedApp.history||[],completion:storedApp.completion||{},production:storedApp.production||{}}:baseApp,
 plannerDraft:normalizeDraft(current?.slots||safeParse(localStorage.getItem(K_DRAFT),null)||seededDraft()),
 savedScenarios,
 currentScenarioId:current?.id||'',revision:0,dataRevision:0,dirty:false,cloud:{status:'local',session:null,remoteRevision:0,lastPayload:null},autosave:{status:'saved',at:Date.now()}
};
const channels=new Map();const all=new Set();let frame=0,pending=new Set();
function flush(){frame=0;const list=[...pending];pending.clear();for(const ch of list){for(const fn of channels.get(ch)||[])fn(state,ch)}for(const fn of all)fn(state,list)}
function emit(...names){state.revision++;names.forEach(x=>pending.add(x));if(!frame)frame=requestAnimationFrame(flush)}
function subscribe(channel,fn){if(typeof channel==='function'){all.add(channel);return()=>all.delete(channel)}if(!channels.has(channel))channels.set(channel,new Set());channels.get(channel).add(fn);return()=>channels.get(channel)?.delete(fn)}
function currentScenario(){return state.savedScenarios.find(x=>x.id===state.currentScenarioId)||null}
function touchScenario(){const sc=currentScenario();if(!sc)return;sc.slots=clone(state.plannerDraft);sc.brandId=state.appData.activeBrandId;sc.range=sc.range||{};sc.range.start=state.ui.anchorDate;const d=new Date(state.ui.anchorDate+'T12:00:00');d.setDate(d.getDate()+6);sc.range.end=d.toISOString().slice(0,10);sc.updatedAt=new Date().toISOString();sc.revision=Number(sc.revision||0)+1}
function persist(chs=['planner']){touchScenario();localStorage.setItem(K_APP,JSON.stringify(state.appData));localStorage.setItem(K_SC,JSON.stringify(state.savedScenarios));localStorage.setItem(K_DRAFT,JSON.stringify(state.plannerDraft));if(state.currentScenarioId)localStorage.setItem(K_CURRENT,state.currentScenarioId);state.dirty=true;state.dataRevision++;state.autosave={status:'saved',at:Date.now()};emit(...chs,'autosave','persist')}
export const store={
 state,subscribe,emit,currentScenario,
 setUI(patch){Object.assign(state.ui,patch);emit('ui')},
 setCloud(patch){Object.assign(state.cloud,patch);emit('cloud')},
 setAnchorDate(date){state.ui.anchorDate=date;persist(['planner','feeds'])},
 activeBrand(){return state.appData.brands.find(x=>x.id===state.appData.activeBrandId)||state.appData.brands[0]},
 allTemplates(){return [...DEFAULT_TEMPLATES,...state.appData.customContent].filter(x=>!x.archived)},template(id){return this.allTemplates().find(x=>x.id===id)},
 setActiveBrand(id){if(!state.appData.brands.some(x=>x.id===id))return;state.appData.activeBrandId=id;persist(['planner','library'])},
 openScenario(id){const sc=state.savedScenarios.find(x=>x.id===id);if(!sc)return false;state.currentScenarioId=sc.id;state.plannerDraft=normalizeDraft(clone(sc.slots));if(sc.range?.start)state.ui.anchorDate=sc.range.start;if(sc.brandId)state.appData.activeBrandId=sc.brandId;localStorage.setItem(K_CURRENT,sc.id);localStorage.setItem(K_DRAFT,JSON.stringify(state.plannerDraft));state.dataRevision++;emit('scenario','planner','feeds','library');return true},
 createScenario({name,brandId,mode='base',sourceId='',start}={}){let slots=mode==='empty'?emptyDraft():mode==='duplicate'&&sourceId?(clone(state.savedScenarios.find(x=>x.id===sourceId)?.slots)||seededDraft()):seededDraft();const id=uid('scenario'),anchor=start||new Date().toISOString().slice(0,10),d=new Date(anchor+'T12:00:00');d.setDate(d.getDate()+6);const sc={id,name:name||`Escenario ${state.savedScenarios.length+1}`,brandId:brandId||state.appData.activeBrandId,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),revision:1,source:mode,range:{start:anchor,end:d.toISOString().slice(0,10)},slots:normalizeDraft(clone(slots))};state.savedScenarios.unshift(sc);state.currentScenarioId=id;state.plannerDraft=normalizeDraft(clone(sc.slots));state.ui.anchorDate=anchor;state.appData.activeBrandId=sc.brandId;persist(['scenario','planner','feeds','library']);return sc},
 duplicateCurrent(name){const sc=currentScenario();if(!sc)return null;return this.createScenario({name:name||`${sc.name} · copia`,brandId:sc.brandId,mode:'duplicate',sourceId:sc.id,start:sc.range?.start})},
 renameCurrent(name){const sc=currentScenario();if(!sc||!name.trim())return;sc.name=name.trim();persist(['scenario','library'])},
 addToDay(templateId,dow){const t=this.template(templateId);if(!t)return;state.plannerDraft[dow].push({...clone(t),templateId:t.id,instanceId:uid('item')});persist(['planner','feeds'])},
 removeFromDay(dow,id){state.plannerDraft[dow]=state.plannerDraft[dow].filter(x=>x.instanceId!==id);persist(['planner','feeds'])},
 moveToDay(from,id,to,index){const a=state.plannerDraft[from],i=a.findIndex(x=>x.instanceId===id);if(i<0)return;const [item]=a.splice(i,1);const target=state.plannerDraft[to];target.splice(Number.isFinite(index)?Math.max(0,Math.min(index,target.length)):target.length,0,item);persist(['planner','feeds'])},
 reorderDay(dow,orderedIds){const map=new Map(state.plannerDraft[dow].map(x=>[x.instanceId,x]));state.plannerDraft[dow]=orderedIds.map(id=>map.get(id)).filter(Boolean);persist(['planner','feeds'])},
 createContent(data){const id=uid('custom');const item={id,title:data.title,type:data.type||'Contenido',lot:data.lot||'L2',surface:data.surface||'Feed',platforms:data.platforms?.length?data.platforms:['instagram'],role:data.role||'Contenido personalizado',description:data.description||'',pillarId:data.pillarId||'',familyId:data.familyId||'',color:data.color||'#6d5dfc',custom:true,archived:false,caption:data.caption||data.title};state.appData.customContent.push(item);const b=this.activeBrand();b.enabledContentIds=[...new Set([...(b.enabledContentIds||[]),id])];persist(['catalog','library']);return item},
 createPillar(data){const id=uid('pillar');state.appData.pillars.push({id,name:data.name,description:data.description||'',archived:false});persist(['library']);return id},
 createFamily(data){const id=uid('family');state.appData.families.push({id,name:data.name,pillarId:data.pillarId||'',description:data.description||'',archived:false});persist(['library']);return id},
 createBrand(data){const id=uid('brand');state.appData.brands.push({id,name:data.name,initials:data.name.slice(0,2).toUpperCase(),color:data.color||'#6d5dfc',platforms:data.platforms||['instagram','linkedin'],enabledContentIds:this.allTemplates().map(x=>x.id),archived:false});persist(['library']);return id},
 mergeCloudPayload(payload){if(!payload)return;if(payload.appData)state.appData={...state.appData,...payload.appData,brands:payload.appData.brands||state.appData.brands,pillars:payload.appData.pillars||state.appData.pillars,families:payload.appData.families||state.appData.families,customContent:payload.appData.customContent||state.appData.customContent,history:payload.appData.history||state.appData.history,completion:{...(state.appData.completion||{}),...(payload.appData.completion||{})},production:{...(state.appData.production||{}),...(payload.appData.production||{})}};if(Array.isArray(payload.savedScenarios))state.savedScenarios=payload.savedScenarios;const remoteCurrent=state.savedScenarios.find(x=>x.id===state.currentScenarioId);if(remoteCurrent&&!state.dirty)state.plannerDraft=normalizeDraft(clone(remoteCurrent.slots));localStorage.setItem(K_APP,JSON.stringify(state.appData));localStorage.setItem(K_SC,JSON.stringify(state.savedScenarios));state.dirty=false;state.dataRevision++;emit('cloud','scenario','planner','feeds','library','catalog')},
 exportOwned(){touchScenario();return {appData:clone(state.appData),plannerDraft:clone(state.plannerDraft),savedScenarios:clone(state.savedScenarios)}},markSynced(){state.dirty=false;emit('cloud')}
};
export const STORAGE_KEYS={K_STATE,K_APP,K_SC,K_CLOUD};
