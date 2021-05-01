import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import datauri from './build/plugins/datauri.js';
import files from './build/plugins/files.js';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    datauri(),
    files(),
  ],
  // resolve: {
  //   alias: {
  //     '#files': path.resolve(__dirname, '/src'),
  //   },
  // },
});
