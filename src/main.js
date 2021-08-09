import { createApp } from 'vue';
import VueComponentStyle from 'vue-component-style';
import App from './App.vue';
import * as $fs from './services/fs';

import { initFS } from './services/fs';


(async ()=>{
  await initFS();

  window.$fs = $fs;
  window.$app = createApp(App)
    .use(VueComponentStyle)
    .mount('#app');

  setTimeout(() => {
    document.body.classList.remove('loading');
  });

})();
