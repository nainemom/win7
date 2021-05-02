import { createApp } from 'vue';
import VueComponentStyle from 'vue-component-style';
import App from './App.vue';
import * as $fs from './services/fs';
// eslint-disable-next-line import/extensions
import files from '../files/.files';

files.forEach((file) => $fs.createNewFile(
  $fs.fileObject(...file),
));

window.$fs = $fs;
window.$app = createApp(App)
  .use(VueComponentStyle)
  .mount('#app');

setTimeout(() => {
  document.body.classList.remove('loading');
});
