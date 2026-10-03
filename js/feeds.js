import {store} from './store.js';
const DOWS=[1,2,3,4,5,6,0];
const names={instagram:'Instagram',tiktok:'TikTok',linkedin:'LinkedIn',youtube:'YouTube',facebook:'Facebook'};
let cache={revision:-1,anchor:'',data:null};
function weekStart(anchor){const d=new Date(anchor+'T12:00:00'),diff=(d.getDay()+6)%7;d.setDate(d.getDate()-diff);return d}
function dateFor(dow){const s=weekStart(store.state.ui.anchorDate),i=DOWS.indexOf(Number(dow)),d=new Date(s);d.setDate(s.getDate()+Math.max(0,i));return d.toISOString().slice(0,10)}
function normalize(item,dow,index,platform){const pillar=store.state.appData.pillars.find(x=>x.id===item.pillarId)?.name||'';const family=store.state.appData.families.find(x=>x.id===item.familyId)?.name||'';return {...item,dow:Number(dow),date:dateFor(dow),platform,pillar,family,caption:item.caption||item.description||item.role||item.title,occurrenceId:`${dateFor(dow)}::${item.instanceId||item.templateId||item.id}::${platform}::${index}`}}
function derive(){const s=store.state;if(cache.revision===s.dataRevision&&cache.anchor===s.ui.anchorDate&&cache.data)return cache.data;const data={instagram:[],tiktok:[],linkedin:[],youtube:[],facebook:[],all:[]};for(const dow of DOWS){(s.plannerDraft[dow]||[]).forEach((item,index)=>{for(const p of item.platforms||[]){if(!data[p])continue;const o=normalize(item,dow,index,p);data[p].push(o);data.all.push(o)}})}data.all.sort((a,b)=>a.date.localeCompare(b.date)||String(a.lot).localeCompare(String(b.lot))||a.title.localeCompare(b.title));cache={revision:s.dataRevision,anchor:s.ui.anchorDate,data};return data}
export const feeds={get(platform){return derive()[platform]||[]},all(){return derive().all},name:p=>names[p]||p,invalidate(){cache.revision=-1},find(id){return derive().all.find(x=>x.occurrenceId===id)||null}};
