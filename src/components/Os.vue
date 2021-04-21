<template>
  <div :class="$style.os">
    <slot />
    <Window
      v-for="win in list"
      :key="win.windowProps.id"
      v-bind="win"
    />
    <BluePage v-model:value="bluePage" />
  </div>
</template>

<script>
import BluePage from '/src/components/BluePage.vue';
import Window from '/src/components/Window.vue'
import { resolveFile, resolveFileRunner, resolvePath, createFile, onReload, offReload } from '/src/services/fileSystem';
import { fitSize } from '/src/styles/common';

export default {
  data() {
    return {
      list: [],
      latestZIndex: 0,
      bluePage: false,
      time: Date.now(),
    };
  },
  components: {
    Window,
    BluePage,
  },
  provide() {
    return {
      $wm: this,
      $fs: {
        resolveFile,
        resolveFileRunner,
        resolvePath,
        createFile,
        onReload,
        offReload,
      },
    };
  },
  methods: {
    openWindow(_file) {
      const file = resolveFile(_file);
      const runner = resolveFileRunner(_file);
      const windowConfig = runner.component.appConfig.windowConfig(file) || {};
      const width = windowConfig.width || '400px';
      const height = windowConfig.height || '300px';
      const win = {
        windowProps: Object.freeze({
          id: `x-${Date.now()}`,
          createdDate: Date.now(),
          width,
          height,
          left: `${((window.innerWidth / 2) - (parseInt(width) / 2) - 25) + (Math.random() * 50)}px`,
          top: `${((window.innerHeight / 2) - (parseInt(height) / 2) - 25) + (Math.random() * 50)}px`,
          maximizable: true,
          title: file.name,
          icon: runner.component.appConfig[file.type === 'app' ? 'icon' : 'fileIcon'](file),
        }),
        componentProps: Object.freeze({
          runner,
          data: file.data,
        }),
        runtimeProps: {
          maximized: false,
          minimized: false,
          zIndex: ++this.latestZIndex,
        },
      };
      this.list.push(win);
    },
    findById(id, returnIndex = false) {
      return this.list[returnIndex ? 'findIndex' : 'find']((w) => w.windowProps.id === id);
    },
    closeWindow(id) {
      const listIndex = this.findById(id, true);
      if (listIndex !== -1) {
        this.list.splice(listIndex, 1);
      }
    },
    focusWindow(id) {
      const win = this.findById(id);
      if (win) {
        win.runtimeProps.zIndex = ++this.latestZIndex;
      }
    },
    isWindowFocused(id) {
      const win = this.findById(id);
      if (win) {
        const max = Math.max(...this.list.map((w) => w.runtimeProps.zIndex));
        return max !== -1 && max === win.runtimeProps.zIndex;
      }
      return false;
    },
    maximizeWindow(id, newValue) {
      const win = this.findById(id);
      if (win) {
        win.runtimeProps.maximized = typeof newValue !== 'undefined' ? newValue : !win.runtimeProps.maximized;
      }
    },
    minimizeWindow(id, newValue) {
      const win = this.findById(id);
      if (win) {
        win.runtimeProps.minimized = typeof newValue !== 'undefined' ? newValue : !win.runtimeProps.minimized;
        if (win.runtimeProps.minimized) {
          win.runtimeProps.zIndex = -1;
        } else {
          win.runtimeProps.zIndex = ++this.latestZIndex;
        }
      }
    }
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
