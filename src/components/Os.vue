<template>
  <div :class="$style.view">
    <slot />
    <Window
      v-for="window in list"
      :key="window.id"
      v-bind="window"
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
    openWindow(component, config = {}) {
      const id = `x-${Date.now()}`;
      this.list.push({
        id,
        createdDate: Date.now(),
        component,
        title: `New Window #${id}`,
        width: '200px',
        height: '200px',
        left: `${(Math.random() * 400)}px`,
        top: `${(Math.random() * 400)}px`,
        maximizable: true,
        maximized: false,
        minimized: false,
        zIndex: ++this.latestZIndex,
        ...config,
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
      className('view', {
        position: 'fixed',
        ...fitSize,
      }),
    ];
  },
};
</script>
