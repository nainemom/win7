/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import replace from '@rollup/plugin-replace';
import files from './build/plugins/files';

export default defineConfig({
  plugins: [
    vue(),
    files(),
    replace({
      preventAssignment: true,
      values: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '/src/C:/Windows/system'),
    },
  },
});
