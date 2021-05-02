/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import eslint from '@rollup/plugin-eslint';
import datauri from './build/plugins/datauri';
import files from './build/plugins/files';

export default defineConfig({
  plugins: [
    vue(),
    datauri(),
    files(),
    eslint(),
  ],
});
