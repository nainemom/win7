<template>
  <div
    :class="[focused && 'focused', $style.taskbarRunningWindow]"
    @click="click"
    @contextmenu="openContextMenu"
  >
    <img :src="window.icon.data"> {{ window.title }}
  </div>
</template>

<script>
import { props } from '@/utils/vue';
import { rgba } from '@/styles/utils';
import {
  isWindowFocused,
  openContextMenu,
  minimizeWindow,
  maximizeWindow,
  closeWindow,
} from '@/services/wm';

export default {
  emits: ['close', 'minimize'],
  ...props({
    window: props.obj(),
  }),
  computed: {
    focused() {
      return isWindowFocused(this.window.id);
    },
  },
  methods: {
    click() {
      minimizeWindow(this.window.id, this.focused);
    },
    openContextMenu(event) {
      openContextMenu(event, [
        ...(this.window.maximizable && !this.window.minimized ? [this.window.maximized ? 'Unmaximize' : 'Maximize'] : []),
        ...(this.window.minimizable ? [this.window.minimized ? 'Restore' : 'Minimize'] : []),
        ...(this.window.closable ? ['Close'] : []),
      ], (item) => {
        if (['Maximize', 'Unmaximize'].includes(item)) {
          maximizeWindow(this.window.id);
        } else if (['Minimize', 'Restore'].includes(item)) {
          minimizeWindow(this.window.id);
        } else if (item === 'Close') {
          closeWindow(this.window.id);
        }
      });
    },
  },
  style({ className }) {
    return [
      className('taskbarRunningWindow', {
        userSelect: 'none',
        background: `linear-gradient(150deg,
          ${rgba(255, 0.4)} 0%,
          ${rgba(255, 0.4)} 15%,
          ${rgba(200, 0.1)} 30%,
          ${rgba(200, 0.2)} 80%,
          ${rgba(255, 0.4)} 100%
        )`,
        border: `solid 1px ${rgba(10, 0.3)}`,
        height: 'calc(100% - 6px)',
        borderRadius: '4px',
        marginRight: '2px',
        marginTop: '3px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '0 10px',
        fontSize: '14px',
        fontWeight: 'bold',
        color: rgba(255, 1),
        textShadow: new Array(2).fill(`0 0 1px ${rgba(0, 1)}`).join(','),
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'clip',
        width: '200px',
        textAlign: 'left',
        '& > img': {
          width: '24px',
          marginRight: '5px',
        },
        '&:hover': {
          background: `linear-gradient(150deg,
            ${rgba(255, 0.6)} 0%,
            ${rgba(255, 0.6)} 15%,
            ${rgba(200, 0.3)} 30%,
            ${rgba(200, 0.4)} 80%,
            ${rgba(255, 0.6)} 100%
          )`,
        },
        '&.focused': {
          background: `linear-gradient(150deg,
            ${rgba(50, 0.4)} 0%,
            ${rgba(50, 0.4)} 15%,
            ${rgba(50, 0.1)} 30%,
            ${rgba(50, 0.2)} 80%,
            ${rgba(50, 0.4)} 100%
          )`,
        },
        '&.minimized': {
          fontStyle: 'italic',
        },
      }),
    ];
  },
};
</script>
