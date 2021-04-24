<template>
  <div :class="$style.os">
    <Desktop />
    <Taskbar />
    <Window
      v-for="win in windowsList"
      :key="win.windowProps.id"
      v-bind="win"
    />
    <BluePage v-model:value="bluePage" />
  </div>
</template>

<script>
import BluePage from '/src/components/BluePage.vue';
import Window from '/src/components/Window.vue';
import Desktop from '/src/components/Desktop.vue';
import Taskbar from '/src/components/Taskbar.vue';

import MyComputer from '/src/apps/MyComputer.vue';
import Camera from '/src/apps/Camera.vue';
import Notepad from '/src/apps/Notepad.vue';
import WebAppRunner from '/src/apps/WebAppRunner.vue';

import { initFileManager, directory, app, file, shortcut, webapp, resolveFile, resolveFileRunner, resolvePath, createFile, searchFiles } from '/src/services/fileSystem';
import { initWindowManager, openWindow, findWindowById, closeWindow, focusWindow, isWindowFocused, maximizeWindow, minimizeWindow } from '/src/services/windowManager';
import { fitSize } from '/src/styles/common';

export default {
  data() {
    return {
      windowsList: [],
      files: [
        directory('C:', [
          directory('Program Files', [
            app('My Computer', MyComputer),
            app('Camera.exe', Camera),
            app('Notepad.exe', Notepad),
            app('Web App Runner.exe', WebAppRunner),
          ]),
          directory('User', [
            directory('Desktop', [
              shortcut('My Computer', ['C:', 'Program Files', 'My Computer']),
              shortcut('Camera', ['C:', 'Program Files', 'Camera.exe']),
              shortcut('Notepad', ['C:', 'Program Files', 'Notepad.exe']),
              webapp('Viska', {
                icon: 'https://viska.chat/logo-transparent.png',
                url: 'https://viska.chat/',
                width: '500px',
                height: '800px',
              }),
              webapp('Method Draw', {
                icon: 'https://editor.method.ac/images/favicon.svg',
                url: 'https://editor.method.ac/',
                width: '900px',
                height: '700px',
              }),
              webapp('Tower Game', {
                icon: 'https://www.towergame.app/assets/apple-touch-icon.png',
                url: 'https://www.towergame.app/',
                width: '400px',
                height: '700px',
              }),
              webapp('Windows 93 (vm)', {
                icon: 'http://v1.windows93.net/favicon.ico',
                url: 'http://v1.windows93.net/',
                width: '1000px',
                height: '800px',
              }),
              webapp('Snapp!', {
                icon: 'https://passenger-pwa-cdn.snapp.ir/logos/square-minimal-144.png',
                url: 'https://app.snapp.taxi/',
                width: '500px',
                height: '800px',
              }),
              file('Creator.txt', {
                value: 'My Name is Amir!!!',
              }),
            ]),
          ]),
        ]),
        directory('D:', [
          directory('New Folder', [
            directory('New Folder (2)', [

            ]),
          ]),
        ]),
      ],
      bluePage: false,
    };
  },
  components: {
    Window,
    BluePage,
    Desktop,
    Taskbar,
  },
  provide() {
    return {
      $wm: {
        windowsList: this.windowsList,
        openWindow,
        findWindowById,
        closeWindow,
        focusWindow,
        isWindowFocused,
        maximizeWindow,
        minimizeWindow,
      },
      $fs: {
        files: this.files,
        resolveFile,
        resolveFileRunner,
        resolvePath,
        createFile,
        searchFiles,
      },
    };
  },
  methods: {

  },
  created() {
    initFileManager(this.files);
    initWindowManager(this.windowsList);
  },
  errorCaptured(e) {
    this.bluePage = e.toString();
    return true;
  },
  style({ className, custom }) {
    return [
      className('os', {
        position: 'fixed',
        ...fitSize,
        '& *, & *:after': {
          bixSizing: 'content-box',
        },
      }),
      custom('html, body', {
        fontFamily: 'sans-serif',
      }),
      custom('*', {
        userSelect: 'none',
        fontFamily: 'inherit',
        padding: 0,
        margin: 0,
        listStyle: 'none',
        borderStyle: 'solid',
        borderWidth: '0px',
        verticalAlign: 'baseline',
        backfaceVisibility: 'hidden',
        color: 'inherit',
        borderColor: 'inherit',
        backgroundColor: 'transparent',
        borderSpacing: 0,
        font: 'unset',
        '-webkitOverflowScrolling': 'touch',
        '-webkitTapHighlightColor': 'rgba(0, 0, 0, 0)',
        touchAction: 'pan-y',
        boxSizing: 'border-box',
        '&::-moz-focus-inner': {
          border: 0,
        },
        '&:focus': {
          outline: 'none',
        },
      }),
      custom('a, a:hover, a:visited', {
        textDecoration: 'none',
      }),
    ];
  },
};
</script>
