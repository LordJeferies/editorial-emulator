import {initUI} from './ui.js';
import {cloud} from './cloud.js';
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
cloud.init();initUI();
