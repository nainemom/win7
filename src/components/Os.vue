<template>
  <div :class="$style.os" @contextmenu.prevent>
    <Desktop />
    <Taskbar />
    <Window
      v-for="win in windowsList"
      :key="win.id"
      :window="win"
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
import WebAppRunner from '/src/apps/WebAppRunner.vue';

import Camera from '/src/apps/Camera.vue';
import Notepad from '/src/apps/Notepad.vue';

import * as $fs from '/src/services/fs';
import * as $wm from '/src/services/wm';

import { fitSize } from '/src/styles/common';

export default {
  components: {
    Window,
    Desktop,
    Taskbar,
    ContextMenu,
  },
  provide() {
    return {
      $wm,
      $fs,
      $os: this,
    };
  },
  computed: {
    windowsList() {
      return $wm.getWindows();
    },
  },
  methods: {
    openContextMenu(...args) {
      this.$refs.contextMenu.open(...args);
    },
  },
  created() {
    [
      $fs.fileObject('C:/Windows/Explorer.dll', 'app', { component: Explorer }),
      $fs.fileObject('C:/Windows/Dialog.dll', 'app', { component: Dialog }),
      $fs.fileObject('C:/Windows/WebAppRunner.dll', 'app', { component: WebAppRunner }),

      $fs.fileObject('C:/Program Files/Camera.exe', 'app', { component: Camera }),
      $fs.fileObject('C:/Program Files/Notepad.exe', 'app', { component: Notepad }),
      $fs.fileObject('C:/Program Files/Viska.exe', 'webapp', {
        icon: 'https://viska.chat/logo-transparent.png',
        url: 'https://viska.chat/',
        width: 500,
        height: 800,
      }),
      $fs.fileObject('C:/Program Files/Method Draw.exe', 'webapp', {
        icon: 'https://editor.method.ac/images/favicon.svg',
        url: 'https://editor.method.ac/',
        width: 900,
        height: 700,
      }),
      $fs.fileObject('C:/Program Files/Tower Game.exe', 'webapp', {
        icon: 'https://www.towergame.app/assets/apple-touch-icon.png',
        url: 'https://www.towergame.app/',
        width: 400,
        height: 700,
      }),
      $fs.fileObject('C:/Program Files/Windows 93.exe', 'webapp', {
        icon: 'http://v1.windows93.net/favicon.ico',
        url: 'http://v1.windows93.net/',
        width: 1000,
        height: 800,
      }),
      $fs.fileObject('C:/Program Files/Snapp!.exe', 'webapp', {
        icon: 'https://passenger-pwa-cdn.snapp.ir/logos/square-minimal-144.png',
        url: 'https://app.snapp.taxi/',
        width: 500,
        height: 800,
      }),

      $fs.fileObject('C:/User/Desktop/Computer', 'shortcut', { src: 'C:/Windows/Explorer.dll' }),
      $fs.fileObject('C:/User/Desktop/Notepad', 'shortcut', { src: 'C:/Program Files/Notepad.exe' }),
      $fs.fileObject('C:/User/Desktop/Camera', 'shortcut', { src: 'C:/Program Files/Camera.exe' }),
      $fs.fileObject('C:/User/Desktop/Viska', 'shortcut', { src: 'C:/Program Files/Viska.exe' }),
      $fs.fileObject('C:/User/Desktop/Method Draw', 'shortcut', { src: 'C:/Program Files/Method Draw.exe' }),
      $fs.fileObject('C:/User/Desktop/Tower Game', 'shortcut', { src: 'C:/Program Files/Tower Game.exe' }),
      $fs.fileObject('C:/User/Desktop/Windows 93', 'shortcut', { src: 'C:/Program Files/Windows 93.exe' }),
      $fs.fileObject('C:/User/Desktop/Snapp!', 'shortcut', { src: 'C:/Program Files/Snapp!.exe' }),
      $fs.fileObject('C:/User/Desktop/Creator.txt', 'text', {
        value: 'Created by Amir Momenian <nainemom@gmail.com>\nRepo Address: https://github.com/nainemom/win7',
      }),
    ].forEach((theFile) => $fs.createNewFile(theFile));
  },
  mounted() {
    const isFullScreen = !!window.document.fullscreenElement;
    if (!isFullScreen) {
      const fullScreenDialog = $wm.openFile($fs.fileObject('', 'dialog', {
        type: 'info',
        title: 'Fullscreen Request',
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
          $wm.closeWindow(fullScreenDialog.id);
        },
      }));
    }
  },
  errorCaptured(e) {
    const errorDialog = $wm.openFile($fs.fileObject('', 'dialog', {
      type: 'error',
      content: e.toString(),
      buttons: ['OK'],
      title: 'Unhandled Error',
      onButtonClick: () => {
        $wm.closeWindow(errorDialog.id);
      },
    }));
    return true;
  },
  style({ className, custom }) {
    return [
      className('os', {
        position: 'fixed',
        ...fitSize,
      }),
      custom('html, body', {
        fontFamily: 'sans-serif',
      }),
      custom('*, *:after, &:before', {
        bixSizing: 'content-box',
        touchAction: 'none !important',
      }),
      custom('*', {
        touchAction: 'none !important',
        // pointerEvents: 'none',
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
