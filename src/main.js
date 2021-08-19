import { createApp } from 'vue';
import VueComponentStyle from 'vue-component-style';
import App from '@/App.vue';
import * as $fs from '@/services/fs';
import { log } from '@/utils/log';
import files from './.files';

files.forEach((file) => {
  const fileObject = $fs.fileObject(file.path, file.type, file.data);
  return $fs.createNewFile(fileObject);
});

log('Files', files);

window.$fs = $fs;
window.$app = createApp(App)
  .use(VueComponentStyle)
  .mount('#app');

setTimeout(() => {
  document.body.classList.remove('loading');
});
