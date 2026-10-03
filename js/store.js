import {defaultAppData,seededDraft,emptyDraft,DEFAULT_TEMPLATES} from './defaults.js';
const K_STATE='jocEditorialV9',K_APP='jocEditorialV9AppData',K_SC='jocEditorialV9Scenarios',K_CLOUD='jocEditorialV9Cloud';
const safeParse=(v,f)=>{try{return JSON.parse(v)||f}catch{return f}};
const clone=x=>structuredClone(x);
function normalizeDraft(d){const out=emptyDraft();Object.keys(out).forEach(k=>out[k]=Array.isArray(d?.[k])?d[k]:[]);return out}
const baseState=safeParse(localStorage.getItem(K_STATE),{});
const baseApp=defaultAppData(),storedApp=safeParse(localStorage.getItem(K_APP),null);
const state={
 ui:{view:'plan',selectedDow:new Date().getDay(),platform:'instagram',instagramMode:'profile',libraryTab:'content',catalogFilter:'all',anchorDate:baseState.anchorDate||new Date().toISOString().slice(0,10),simIndex:0,simPlaying:false},
 appData:storedApp?{...baseApp,...storedApp,brands:storedApp.brands||baseApp.brands,pillars:storedApp.pillars||baseApp.pillars,families:storedApp.families||baseApp.families,customContent:storedApp.customContent||[],history:storedApp.history||[],completion:storedApp.completion||{},production:storedApp.production||{}}:baseApp,
 plannerDraft:normalizeDraft(safeParse(localStorage.getItem('editorialEmulatorDraft'),null)||safeParse(localStorage.getItem('jocEditorialV9PlannerDraft'),null)||seededDraft()),
 savedScenarios:safeParse(localStorage.getItem(K_SC),[]),
 revision:0,dataRevision:0,dirty:false,cloud:{status:'local',session:null,remoteRevision:0,lastPayload:null}
};
if(!Object.values(state.plannerDraft).some(a=>a.length))state.plannerDraft=seededDraft();
const listeners=new Set();let queued=false;
function emit(reason='update'){state.revision++; if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;listeners.forEach(fn=>fn(state,reason))})}
function persist(){localStorage.setItem(K_APP,JSON.stringify(state.appData));localStorage.setItem(K_SC,JSON.stringify(state.savedScenarios));localStorage.setItem('editorialEmulatorDraft',JSON.stringify(state.plannerDraft));state.dirty=true;state.dataRevision++;emit('data')}
export const store={
 state,subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn)},emit,
 setUI(patch){Object.assign(state.ui,patch);emit('ui')},
 setCloud(patch){Object.assign(state.cloud,patch);emit('cloud')},
 activeBrand(){return state.appData.brands.find(x=>x.id===state.appData.activeBrandId)||state.appData.brands[0]},
 setActiveBrand(id){if(!state.appData.brands.some(x=>x.id===id))return;state.appData.activeBrandId=id;persist()},
 allTemplates(){return [...DEFAULT_TEMPLATES,...state.appData.customContent].filter(x=>!x.archived)},
 template(id){return this.allTemplates().find(x=>x.id===id)},
 addToDay(templateId,dow){const t=this.template(templateId);if(!t)return;state.plannerDraft[dow].push({...clone(t),templateId:t.id,instanceId:`em-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`});persist()},
 removeFromDay(dow,instanceId){state.plannerDraft[dow]=state.plannerDraft[dow].filter(x=>x.instanceId!==instanceId);persist()},
 moveWithin(dow,instanceId,delta){const a=state.plannerDraft[dow],i=a.findIndex(x=>x.instanceId===instanceId);if(i<0)return;const j=Math.max(0,Math.min(a.length-1,i+delta));if(i===j)return;const [item]=a.splice(i,1);a.splice(j,0,item);persist()},
 moveToDay(fromDow,instanceId,toDow){const from=state.plannerDraft[fromDow],i=from.findIndex(x=>x.instanceId===instanceId);if(i<0)return;const [item]=from.splice(i,1);state.plannerDraft[toDow].push(item);persist()},
 reorderDay(dow,orderedIds){const map=new Map(state.plannerDraft[dow].map(x=>[x.instanceId,x]));state.plannerDraft[dow]=orderedIds.map(id=>map.get(id)).filter(Boolean);persist()},
 createContent(data){const id=`custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`;const item={id,title:data.title,type:data.type||'Contenido',lot:data.lot||'L2',surface:data.surface||'Feed',platforms:data.platforms||['instagram'],role:data.role||'Contenido personalizado',description:data.description||'',pillarId:data.pillarId||'',familyId:data.familyId||'',color:data.color||'#6d5dfc',custom:true,archived:false};state.appData.customContent.push(item);const b=this.activeBrand();b.enabledContentIds=[...new Set([...(b.enabledContentIds||[]),id])];persist();return item},
 createPillar(data){const id=`pillar-${Date.now().toString(36)}`;state.appData.pillars.push({id,name:data.name,description:data.description||'',archived:false});persist();return id},
 createFamily(data){const id=`family-${Date.now().toString(36)}`;state.appData.families.push({id,name:data.name,pillarId:data.pillarId||'',description:data.description||'',archived:false});persist();return id},
 createBrand(data){const id=`brand-${Date.now().toString(36)}`;state.appData.brands.push({id,name:data.name,initials:data.name.slice(0,2).toUpperCase(),color:data.color||'#6d5dfc',platforms:data.platforms||['instagram','linkedin'],enabledContentIds:this.allTemplates().map(x=>x.id),archived:false});state.appData.activeBrandId=id;persist();return id},
 saveScenario(name){const sc={id:`saved-${Date.now().toString(36)}`,name:name||`Escenario ${state.savedScenarios.length+1}`,brandId:state.appData.activeBrandId,createdAt:new Date().toISOString(),range:{start:state.ui.anchorDate,end:new Date(new Date(state.ui.anchorDate+'T12:00:00').getTime()+6*86400000).toISOString().slice(0,10)},slots:clone(state.plannerDraft)};state.savedScenarios.unshift(sc);persist();return sc},
 loadScenario(id){const sc=state.savedScenarios.find(x=>x.id===id);if(!sc)return;state.plannerDraft=normalizeDraft(clone(sc.slots));if(sc.range?.start)state.ui.anchorDate=sc.range.start;persist()},
 mergeCloudPayload(payload){if(!payload)return; if(payload.appData)state.appData={...state.appData,...payload.appData,brands:payload.appData.brands||state.appData.brands,pillars:payload.appData.pillars||state.appData.pillars,families:payload.appData.families||state.appData.families,customContent:payload.appData.customContent||state.appData.customContent,history:payload.appData.history||state.appData.history,completion:{...(state.appData.completion||{}),...(payload.appData.completion||{})},production:{...(state.appData.production||{}),...(payload.appData.production||{})}};if(payload.plannerDraft)state.plannerDraft=normalizeDraft(clone(payload.plannerDraft));if(Array.isArray(payload.savedScenarios))state.savedScenarios=payload.savedScenarios;localStorage.setItem(K_APP,JSON.stringify(state.appData));localStorage.setItem(K_SC,JSON.stringify(state.savedScenarios));localStorage.setItem('editorialEmulatorDraft',JSON.stringify(state.plannerDraft));state.dirty=false;state.dataRevision++;emit('cloud-pull')},
 exportOwned(){return {appData:clone(state.appData),plannerDraft:clone(state.plannerDraft),savedScenarios:clone(state.savedScenarios)}},markSynced(){state.dirty=false;emit('cloud')}
};
export const STORAGE_KEYS={K_STATE,K_APP,K_SC,K_CLOUD};
