const CACHE='editorial-emulator-v2-5';
const CORE=[
  './','./index.html','./help.html',
  './css/app.css','./css/onboarding-v23.css','./css/system-v24.css','./css/system-v25.css',
  './js/boot-v24.js','./js/boot-v25.js','./js/ui-v25.js','./js/store.js','./js/defaults.js','./js/cloud.js','./js/feeds.js','./js/controllers.js',
  './manifest.webmanifest','./icons/icon.svg','./supabase-config.js'
];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(key=>key.startsWith('editorial-emulator-')&&key!==CACHE).map(key=>caches.delete(key)));await self.clients.claim()})())});
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting()});
async function networkFirst(request){const cache=await caches.open(CACHE);try{const response=await fetch(request,{cache:'no-store'});if(response?.ok)await cache.put(request,response.clone());return response}catch(error){return(await cache.match(request))||(request.mode==='navigate'?cache.match('./index.html'):Promise.reject(error))}}
async function cacheFirst(request){const cache=await caches.open(CACHE);const cached=await cache.match(request);if(cached)return cached;const response=await fetch(request);if(response?.ok)await cache.put(request,response.clone());return response}
self.addEventListener('fetch',event=>{const request=event.request;if(request.method!=='GET')return;const url=new URL(request.url);if(url.origin!==location.origin)return;const isCode=request.mode==='navigate'||/\.(?:html|css|js|webmanifest)$/.test(url.pathname)||url.pathname.endsWith('/');event.respondWith(isCode?networkFirst(request):cacheFirst(request))});
