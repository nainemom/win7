<template>
  <div :class="$style.showDesktop" @click="onClick" />
</template>

<script>
import { panelSize } from '/src/styles/constants';
import { rgba } from '/src/styles/utils';

export default {
  inject: ['$wm'],
  methods: {
    onClick() {
      const isAllWindowsMinimized = this.$wm.list.every((window) => window.runtimeProps.minimized);
      this.$wm.list.forEach((window) => {
        if (isAllWindowsMinimized || !window.runtimeProps.minimized) {
          this.$wm.minimizeWindow(window.windowProps.id);
        }
      });
    },
  },
  style({ className }) {
    const itemSize = `${(parseInt(panelSize) - 1)}px`;

    return [
      className('showDesktop', {
        width: '12px',
        minWidth: '12px',
        height: itemSize,
        marginTop: '2px',
        background: `linear-gradient(150deg,
          ${rgba(250, 0.2)} 0%,
          ${rgba(200, 0.2)} 15%,
          ${rgba(10, 0.3)} 30%,
          ${rgba(10, 0.3)} 80%,
          ${rgba(200, 0.3)} 100%
        )`,
        borderLeft: `solid 1px ${rgba(200, 0.3)}`,
        '&:hover, &:focus': {
          filter: 'brightness(1.6)',
        },
        '&:active': {
          filter: 'brightness(1)',
        },
      }),
    ];
  },
}
</script>
