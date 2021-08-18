<template>
  <div
    :class="$style.os"
    @contextmenu.prevent
  >
    <WelcomePage v-if="!isWmStarted" />
    <template v-else>
      <Desktop />
      <Taskbar />
      <Window
        v-for="win in windowsList"
        :key="win.id"
        :window="win"
      />
      <ContextMenu v-bind="contextMenu" />
    </template>
  </div>
</template>

<script>
import WelcomePage from '@/components/WelcomePage.vue';
import Window from '@/components/Window.vue';
import Desktop from '@/components/Desktop.vue';
import Taskbar from '@/components/Taskbar/Taskbar.vue';
import ContextMenu from '@/components/ContextMenu.vue';

import * as $wm from '@/services/wm';
import { fitSize } from '@/styles/common';
import { customLog } from '@/utils/log';

export default {
  components: {
    WelcomePage,
    Window,
    Desktop,
    Taskbar,
    ContextMenu,
  },
  computed: {
    windowsList() {
      return $wm.windows.list;
    },
    contextMenu() {
      return $wm.contextMenu;
    },
    isWmStarted() {
      return $wm.state.started;
    },
  },
  errorCaptured(e) {
    customLog('error', e);
    $wm.openDialog({
      type: 'error',
      content: e.toString(),
      buttons: ['OK'],
      title: 'Unhandled Error',
      autoClose: true,
    });
    return false;
  },
  methods: {
    openContextMenu(...args) {
      this.$refs.contextMenu.open(...args);
    },
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
