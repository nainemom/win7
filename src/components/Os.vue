<template>
  <div :class="$style.os">
    <slot />
    <Window
      v-for="window in list"
      :key="window.windowProps.id"
      v-bind="window"
    />
  </div>
</template>

<script>
import { fitSize } from '/src/styles/common';
import Window from '/src/components/Window.vue'
import { resolveFile, resolveFileRunner, resolvePath, createFile, onReload, offReload } from '/src/services/fileSystem';


export default {
  data() {
    return {
      list: [],
      latestZIndex: 0,
    };
  },
  components: {
    Window,
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
      this.list.push({
        windowProps: Object.freeze({
          id: `x-${Date.now()}`,
          createdDate: Date.now(),
          width: runner.component.appConfig.windowConfig(file)?.width || '400px',
          height: runner.component.appConfig.windowConfig(file)?.height || '300px',
          left: `${(Math.random() * 400)}px`,
          top: `${(Math.random() * 400)}px`,
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
      });
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
      const window = this.findById(id);
      if (window) {
        window.runtimeProps.zIndex = ++this.latestZIndex;
      }
    },
    isWindowFocused(id) {
      const window = this.findById(id);
      if (window) {
        return Math.max(...this.list.map((w) => w.runtimeProps.zIndex)) === window.runtimeProps.zIndex;
      }
      return false;
    },
    maximizeWindow(id, newValue) {
      const window = this.findById(id);
      if (window) {
        window.runtimeProps.maximized = typeof newValue !== 'undefined' ? newValue : !window.runtimeProps.maximized;
      }
    },
    minimizeWindow(id, newValue) {
      const window = this.findById(id);
      if (window) {
        window.runtimeProps.minimized = typeof newValue !== 'undefined' ? newValue : !window.runtimeProps.minimized;
        if (window.runtimeProps.minimized) {
          window.runtimeProps.zIndex = -1;
        } else {
          window.runtimeProps.zIndex = ++this.latestZIndex;
        }
      }
    }
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
