import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import datauri from './build/plugins/datauri.js';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    datauri(),
  ],
})
