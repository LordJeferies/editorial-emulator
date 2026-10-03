export const PLATFORMS=[
  ['instagram','Instagram'],['tiktok','TikTok'],['linkedin','LinkedIn'],['youtube','YouTube'],['facebook','Facebook']
];
export const DEFAULT_TEMPLATES=[
 {id:'pressure',title:'Presión vs Foco',type:'Presión vs Foco',lot:'L1',surface:'Feed',platforms:['instagram','facebook','tiktok'],fixed:true,defaultDow:1,role:'Ancla semanal',familyId:'memes',pillarId:'negocio'},
 {id:'main-carousel',title:'Carrusel principal de la semana',type:'Carrusel LinkedIn',lot:'L1',surface:'Carrusel',platforms:['instagram','facebook','linkedin'],fixed:true,defaultDow:2,role:'Carrusel principal',familyId:'carruseles',pillarId:'autoridad'},
 {id:'main-video',title:'Video importante de la semana',type:'JOC original',lot:'L1',surface:'Video',platforms:['instagram','facebook','tiktok','linkedin'],fixed:true,defaultDow:3,role:'Video principal',familyId:'carruseles',pillarId:'autoridad'},
 {id:'pod-intro',title:'Intro / trailer del episodio',type:'Podcast · Intro',lot:'L1',surface:'Short',platforms:['instagram','facebook','tiktok','youtube'],fixed:true,defaultDow:4,role:'Lanzamiento podcast',familyId:'podcast',pillarId:'podcast'},
 {id:'philo',title:'Filosofando con Gigantes',type:'Filosofando',lot:'L1',surface:'Reel',platforms:['instagram','facebook','tiktok'],fixed:true,defaultDow:5,role:'Serie fija',familyId:'filosofando',pillarId:'marca-personal'},
 {id:'reaction-fixed',title:'Reacción JOC',type:'Reacción',lot:'L1',surface:'Reel',platforms:['instagram','facebook','tiktok'],fixed:true,defaultDow:6,role:'Reacción fija',familyId:'reacciones',pillarId:'marca-personal'},
 {id:'famous',title:'Famoso + frase / principio',type:'Famoso / Quote',lot:'L1',surface:'Feed',platforms:['instagram','facebook','tiktok'],fixed:true,defaultDow:0,role:'Serie cultural',familyId:'memes',pillarId:'negocio'},
 {id:'pod-main',title:'Podcast · clip vertical principal',type:'Podcast · Vertical',lot:'L2',surface:'Vertical',platforms:['instagram','facebook','tiktok','youtube'],role:'Episodio actual',familyId:'podcast',pillarId:'podcast'},
 {id:'pod-secondary',title:'Podcast · clip vertical secundario',type:'Podcast · Vertical secundario',lot:'L2',surface:'Short',platforms:['youtube'],role:'Episodio actual',familyId:'podcast',pillarId:'podcast'},
 {id:'pod-carousel',title:'Carrusel del podcast',type:'Podcast · Carrusel',lot:'L2',surface:'Carrusel',platforms:['instagram','facebook','linkedin'],role:'Documento podcast',familyId:'podcast',pillarId:'podcast'},
 {id:'guest-carousel',title:'Carrusel del invitado / lanzamiento',type:'Podcast · Carrusel',lot:'L2',surface:'Carrusel',platforms:['instagram','facebook','youtube','linkedin'],role:'Podcast / networking',familyId:'podcast',pillarId:'podcast'},
 {id:'webinar',title:'Webinar · clip',type:'Webinar',lot:'L2',surface:'Vertical',platforms:['instagram','facebook','tiktok','youtube','linkedin'],role:'Insight de Webinar',familyId:'webinar',pillarId:'autoridad'},
 {id:'meme-humor',title:'Meme rotativo · humor',type:'Meme · Humor',lot:'L2',surface:'Feed',platforms:['instagram','facebook','tiktok'],role:'Shareability',familyId:'memes',pillarId:'negocio'},
 {id:'meme-emotional',title:'Meme rotativo · emotivo/mindset',type:'Meme · Emotivo',lot:'L2',surface:'Feed',platforms:['instagram','facebook','tiktok'],role:'Afinidad / mindset',familyId:'memes',pillarId:'negocio'},
 {id:'li-note',title:'Nota de tesis contraria / aprendizaje operativo',type:'LinkedIn · Nota',lot:'L2',surface:'Nota',platforms:['linkedin'],role:'Texto nativo compartible',familyId:'linkedin-l2',pillarId:'autoridad'},
 {id:'li-doc',title:'Carrusel diagnóstico / checklist',type:'LinkedIn · Carrusel',lot:'L2',surface:'Documento',platforms:['linkedin'],role:'Documento guardable',familyId:'linkedin-l2',pillarId:'autoridad'},
 {id:'li-video',title:'Video de tesis / caso',type:'LinkedIn · Video',lot:'L2',surface:'Video',platforms:['linkedin'],role:'Video nativo 45–90 s',familyId:'linkedin-l2',pillarId:'autoridad'},
 {id:'tip',title:'Tip gráfico fijo',type:'Tip gráfico',lot:'L3',surface:'Feed',platforms:['instagram','facebook','tiktok'],role:'Tip visual',familyId:'memes',pillarId:'negocio'},
 {id:'testimonial',title:'Testimonio',type:'Testimonio',lot:'L3',surface:'Video',platforms:['instagram','facebook','tiktok','linkedin','youtube'],role:'Prueba social',familyId:'testimonios',pillarId:'prueba'},
 {id:'reaction-extra',title:'Reacción extra',type:'Reacción',lot:'L3',surface:'Reel',platforms:['instagram','facebook','tiktok'],role:'Reacción adicional',familyId:'reacciones',pillarId:'marca-personal'},
 {id:'lifestyle',title:'Lifestyle / backstage',type:'Lifestyle',lot:'L3',surface:'Feed',platforms:['instagram','facebook','tiktok'],role:'Marca personal',familyId:'lifestyle',pillarId:'marca-personal'},
 {id:'voiceover',title:'Voiceover de JOC',type:'Voiceover',lot:'L3',surface:'Video',platforms:['instagram','facebook','tiktok'],role:'Reflexión audiovisual',familyId:'lifestyle',pillarId:'marca-personal'},
 {id:'yt-episode',title:'Episodio completo del podcast',type:'Podcast · Episodio',lot:'L1',surface:'Horizontal',platforms:['youtube'],role:'YouTube horizontal',familyId:'youtube',pillarId:'podcast'},
 {id:'yt-horizontal',title:'Clip horizontal del episodio',type:'Podcast · Horizontal',lot:'L2',surface:'Horizontal',platforms:['youtube'],role:'YouTube horizontal',familyId:'youtube',pillarId:'podcast'},
 {id:'yt-old',title:'Short de episodio anterior / flexible',type:'Podcast · Anterior',lot:'L3',surface:'Short',platforms:['youtube'],role:'Flexible',familyId:'youtube',pillarId:'podcast'}
];
export const DEFAULT_PILLARS=[
 {id:'negocio',name:'Negocio',description:'Criterio empresarial, ejecución y decisiones.',archived:false},
 {id:'ventas',name:'Ventas',description:'Ventas, seguimiento, fricción y decisión.',archived:false},
 {id:'podcast',name:'Podcast',description:'Episodios, invitados, clips y distribución.',archived:false},
 {id:'autoridad',name:'Autoridad / Educación',description:'Webinars, frameworks, casos y enseñanza.',archived:false},
 {id:'marca-personal',name:'Marca personal',description:'Lifestyle, voz, perspectiva y presencia.',archived:false},
 {id:'prueba',name:'Prueba social',description:'Testimonios, casos y resultados.',archived:false}
];
export const DEFAULT_FAMILIES=[
 {id:'memes',name:'Memes',pillarId:'negocio',description:'Shareability, criterio, emoción y humor.',archived:false},
 {id:'podcast',name:'Podcast',pillarId:'podcast',description:'Episodio, clips, horizontales y carruseles.',archived:false},
 {id:'webinar',name:'Webinar',pillarId:'autoridad',description:'Clips educativos y tesis.',archived:false},
 {id:'testimonios',name:'Testimonios',pillarId:'prueba',description:'Prueba social y casos.',archived:false},
 {id:'reacciones',name:'Reacciones',pillarId:'marca-personal',description:'Reacciones y postura.',archived:false},
 {id:'carruseles',name:'Carruseles',pillarId:'autoridad',description:'Documentos, frameworks y piezas guardables.',archived:false},
 {id:'linkedin-l2',name:'LinkedIn L2',pillarId:'autoridad',description:'Notas, documentos y videos nativos viralizables.',archived:false},
 {id:'filosofando',name:'Filosofando',pillarId:'marca-personal',description:'Filosofando con Gigantes.',archived:false},
 {id:'lifestyle',name:'Lifestyle / Voiceover',pillarId:'marca-personal',description:'Vida, backstage, voz y presencia.',archived:false},
 {id:'youtube',name:'YouTube',pillarId:'podcast',description:'Formatos específicos de YouTube.',archived:false},
 {id:'eventos',name:'Eventos',pillarId:'marca-personal',description:'Cobertura y resumen de eventos.',archived:false}
];
export function defaultAppData(){return {
 activeBrandId:'joc',
 brands:[{id:'joc',name:'JOC',initials:'J',color:'#A91616',platforms:PLATFORMS.map(x=>x[0]),enabledContentIds:DEFAULT_TEMPLATES.map(x=>x.id),archived:false}],
 pillars:structuredClone(DEFAULT_PILLARS),families:structuredClone(DEFAULT_FAMILIES),customContent:[],history:[],completion:{},production:{}
}}
export function emptyDraft(){return {1:[],2:[],3:[],4:[],5:[],6:[],0:[]}}
export function seededDraft(){const out=emptyDraft();DEFAULT_TEMPLATES.filter(x=>x.fixed&&x.defaultDow!==undefined).forEach(t=>out[t.defaultDow].push({...structuredClone(t),instanceId:`fixed-${t.id}-${t.defaultDow}`,templateId:t.id,masterKey:`scenario-fixed-${t.id}`}));return out}
