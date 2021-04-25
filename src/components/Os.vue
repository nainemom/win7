<template>
  <div :class="$style.os" @contextmenu.prevent>
    <Desktop />
    <Taskbar />
    <Window
      v-for="win in windowsList"
      :key="win.windowProps.id"
      v-bind="win"
    />
    <ContextMenu ref="contextMenu" />
  </div>
</template>

<script>
import Window from '/src/components/Window.vue';
import Desktop from '/src/components/Desktop.vue';
import Taskbar from '/src/components/Taskbar/Taskbar.vue';

import ContextMenu from '/src/components/ContextMenu.vue';

import Explorer from '/src/apps/Explorer.vue';
import Dialog from '/src/apps/Dialog.vue';
import Camera from '/src/apps/Camera.vue';
import Notepad from '/src/apps/Notepad.vue';
import WebAppRunner from '/src/apps/WebAppRunner.vue';

import { initFileManager, directory, app, file, shortcut, resolveFile, resolveFileRunner, resolvePath, createFile, createFolder, deleteFile, searchFiles } from '/src/services/fileSystem';
import { initWindowManager, openFile, findWindowById, closeWindow, focusWindow, isWindowFocused, maximizeWindow, minimizeWindow } from '/src/services/windowManager';
import { fitSize } from '/src/styles/common';

export default {
  data() {
    return {
      windowsList: [],
      files: [
        directory('C:', [
          directory('Windows', [
            app('Explorer.dll', Explorer),
            app('Dialog.dll', Dialog),
            app('WebAppRunner.dll', WebAppRunner),
          ]),
          directory('Program Files', [
            app('Camera.exe', Camera),
            app('Notepad.exe', Notepad),
          ]),
          directory('User', [
            directory('Desktop', [
              shortcut('My Computer', ['C:', 'Windows', 'Explorer.dll']),
              shortcut('Camera', ['C:', 'Program Files', 'Camera.exe']),
              shortcut('Notepad', ['C:', 'Program Files', 'Notepad.exe']),
              file('Viska', 'webapp', {
                icon: 'https://viska.chat/logo-transparent.png',
                url: 'https://viska.chat/',
                width: '500px',
                height: '800px',
              }),
              file('Method Draw', 'webapp', {
                icon: 'https://editor.method.ac/images/favicon.svg',
                url: 'https://editor.method.ac/',
                width: '900px',
                height: '700px',
              }),
              file('Tower Game', 'webapp', {
                icon: 'https://www.towergame.app/assets/apple-touch-icon.png',
                url: 'https://www.towergame.app/',
                width: '400px',
                height: '700px',
              }),
              file('Windows 93 (vm)', 'webapp', {
                icon: 'http://v1.windows93.net/favicon.ico',
                url: 'http://v1.windows93.net/',
                width: '1000px',
                height: '800px',
              }),
              file('Snapp!', 'webapp', {
                icon: 'https://passenger-pwa-cdn.snapp.ir/logos/square-minimal-144.png',
                url: 'https://app.snapp.taxi/',
                width: '500px',
                height: '800px',
              }),
              file('Creator.txt', 'text', {
                value: 'Created by Amir Momenian <nainemom@gmail.com>\nRepo Address: https://github.com/nainemom/win7',
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
    };
  },
  components: {
    Window,
    Desktop,
    Taskbar,
    ContextMenu,
  },
  provide() {
    return {
      $wm: {
        windowsList: this.windowsList,
        openFile,
        findWindowById,
        closeWindow,
        focusWindow,
        isWindowFocused,
        maximizeWindow,
        minimizeWindow,
        openContextMenu: this.openContextMenu,
      },
      $fs: {
        files: this.files,
        directory,
        app,
        file,
        shortcut,
        resolveFile,
        resolveFileRunner,
        resolvePath,
        createFile,
        createFolder,
        deleteFile,
        searchFiles,
      },
    };
  },
  methods: {
    openContextMenu(...args) {
      this.$refs.contextMenu.open(...args);
    },
  },
  created() {
    initFileManager(this.files);
    initWindowManager(this.windowsList);
  },
  mounted() {
    const isFullScreen = !!window.document.fullscreenElement;
    if (!isFullScreen) {
      const fullScreenDialog = openFile(file('Fullscreen Request', 'dialog', {
        type: 'info',
        content: 'Do you want to run this app in Fullscreen mode?',
        buttons: ['Cancel', 'OK'],
        onButtonClick: (btn) => {
          if (btn === 'OK') {
            const elem = document.documentElement;
            if (elem.requestFullscreen) {
              elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) {
              elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
              elem.msRequestFullscreen();
            }
          }
          closeWindow(fullScreenDialog.windowProps.id);
        },
      }));
    }
  },
  errorCaptured(e) {
    const errorDialog = openFile(file('Error', 'dialog', {
      type: 'error',
      content: e.toString(),
      buttons: ['OK'],
      onButtonClick: () => {
        closeWindow(errorDialog.windowProps.id);
      },
    }));
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
