<template>
  <div :class="$style.os">
    <slot />
    <Window
      v-for="window in list"
      :key="window.id"
      :window="window"
    />
  </div>
</template>

<script>
import { fitSize } from '/src/styles/common';
import Window from '/src/components/Window.vue'


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
      $os: this,
    };
  },
  methods: {
    openWindow(file) {
      const id = `x-${Date.now()}`;
      console.log(file);
      const component = file.component || file.app().component;
      // return;
      this.list.push({
        id,
        createdDate: Date.now(),
        _: Object.freeze({
          component
        }),
        title: file.name,
        width: '200px',
        height: '200px',
        left: `${(Math.random() * 400)}px`,
        top: `${(Math.random() * 400)}px`,
        maximizable: true,
        data: file.data || {},
        maximized: false,
        minimized: false,
        zIndex: ++this.latestZIndex,
      });
    },
    closeWindow(id) {
      const listIndex = this.list.findIndex((w) => w.id === id);
      if (listIndex !== -1) {
        this.list.splice(listIndex, 1);
      }
    },
    focusWindow(id) {
      const window = this.list.find((w) => w.id === id);
      if (window !== -1) {
        window.zIndex = ++this.latestZIndex;
      }
    },
    isWindowFocused(id) {
      const window = this.list.find((w) => w.id === id);
      if (window) {
        return Math.max(...this.list.map((w) => w.zIndex)) === window.zIndex;
      }
      return false;
    },
    maximizeWindow(id, newValue) {
      const window = this.list.find((w) => w.id === id);
      if (window) {
        window.maximized = typeof newValue !== 'undefined' ? newValue : !window.maximized;
      }
    },
    minimizeWindow(id, newValue) {
      const window = this.list.find((w) => w.id === id);
      if (window) {
        window.minimized = typeof newValue !== 'undefined' ? newValue : !window.minimized;
        if (window.minimized) {
          window.zIndex = -1;
        } else {
          window.zIndex = ++this.latestZIndex;
        }
      }
    }
  },
  style({ className }) {
    return [
      className('os', {
        position: 'fixed',
        ...fitSize,
        '& *, & *:after': {
          bixSizing: 'content-box',
        },
      }),
    ];
  },
};
</script>
