<template>
  <div :class="$style.os" @contextmenu.prevent>
    <Desktop />
    <Taskbar />
    <Window
      v-for="win in windowsList"
      :key="win.id"
      :window="win"
    />
    <ContextMenu v-bind="contextMenu" />
  </div>
</template>

<script>
import Window from '/src/components/Window.vue';
import Desktop from '/src/components/Desktop.vue';
import Taskbar from '/src/components/Taskbar/Taskbar.vue';

import ContextMenu from '/src/components/ContextMenu.vue';

import StartupSound from '/src/assets/sounds/startup.wav';

import * as $fs from '/src/services/fs';
import * as $wm from '/src/services/wm';
import * as $snd from '/src/services/snd';
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
      $snd,
      $os: this,
    };
  },
  data() {
    return {
      copyingFiles: [],
      cuttingFiles: [],
    }
  },
  computed: {
    windowsList() {
      return $wm.windows.list;
    },
    contextMenu() {
      return $wm.contextMenu;
    },
  },
  methods: {
    openContextMenu(...args) {
      this.$refs.contextMenu.open(...args);
    },
  },
  mounted() {
    const isFullScreen = !!window.document.fullscreenElement;
    if (!isFullScreen) {
      $wm.openDialog({
        type: 'info',
        title: 'Fullscreen Request',
        content: 'Do you want to run this app in Fullscreen mode?',
        buttons: ['Cancel', 'OK'],
        autoClose: true,
      }).then((btn) => {
        if (btn === 'OK') {
          const elem = document.documentElement;
          const method = elem.requestFullscreen || elem.webkitRequestFullscreen || elem.msRequestFullscreen;
          method && method.call(elem);
        }
        $snd.playSound(StartupSound);
      });
    }
  },
  errorCaptured(e) {
    $wm.openDialog({
      type: 'error',
      content: e.toString(),
      buttons: ['OK'],
      title: 'Unhandled Error',
      autoClose: true,
    });
    return false;
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
