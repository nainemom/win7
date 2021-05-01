import { createApp } from 'vue'
import VueComponentStyle from 'vue-component-style'
import App from './App.vue'
import * as $fs from '/src/services/fs';
import files from '/files/.files';

files.forEach((file) => $fs.createNewFile(
  $fs.fileObject(...file),
));

window.$app = createApp(App)
  .use(VueComponentStyle)
  .mount('#app')
