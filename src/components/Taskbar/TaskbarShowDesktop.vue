<template>
  <div
    :class="$style.showDesktop"
    @click="onClick"
  />
</template>

<script>
import { panelSize } from '@/styles/constants';
import { rgba } from '@/styles/utils';
import { windows, minimizeWindow } from '@/services/wm';

export default {
  methods: {
    onClick() {
      const windowsList = windows.list;
      const isAllWindowsMinimized = windowsList.every((win) => win.minimized);
      windowsList.forEach((win) => {
        minimizeWindow(win.id, !isAllWindowsMinimized);
      });
    },
  },
  style({ className }) {
    const itemSize = `${(parseInt(panelSize, 10) - 1)}px`;

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
};
</script>
