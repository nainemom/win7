
<template>
  <div :class="[focused && 'focused', runtimeProps, $style.taskbarRunningWindow]" @click="click" @contextmenu="openContextMenu">
    <img :src="windowProps.icon" /> {{ windowProps.title }}
  </div>
</template>

<script>
import { rgba } from '/src/styles/utils';

export default {
  emits: ['close', 'minimize'],
  inject: ['$wm'],
  props: ['runtimeProps', 'windowProps', 'componentProps'],
  computed: {
    focused() {
      return this.$wm.isWindowFocused(this.windowProps.id);
    },
  },
  methods: {
    click() {
      if (this.runtimeProps.minimized) {
        this.$wm.minimizeWindow(this.windowProps.id, false);
      } else if (this.focused) {
        this.$wm.minimizeWindow(this.windowProps.id, true);
      } else {
        this.$wm.focusWindow(this.windowProps.id);
      }
    },
    openContextMenu(event) {
      this.$wm.openContextMenu(event, [
        ...(this.windowProps.maximizable ? ['Maximize'] : []),
        'Minimize',
        'Close',
      ], (item) => {
        if (item === 'Maximize') {
          this.$wm.maximizeWindow(this.windowProps.id);
        } else if (item === 'Minimize') {
          this.$wm.minimizeWindow(this.windowProps.id);
        } else if (item === 'Close') {
          this.$wm.closeWindow(this.windowProps.id);
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
        textShadow: new Array(4).fill(`0 0 1px ${rgba(0, 1)}`).join(','),
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'clip',
        width: '200px',
        textAlign: 'left',
        '& > img': {
          width: '20px',
          marginRight: '5px',
          verticalAlign: 'middle',
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
            ${rgba(20, 0.4)} 0%,
            ${rgba(20, 0.4)} 15%,
            ${rgba(40, 0.1)} 30%,
            ${rgba(40, 0.2)} 80%,
            ${rgba(20, 0.4)} 100%
          )`,
        },
        '&.minimized': {
          fontStyle: 'italic',
        },
      }),
    ];
  },
}
</script>
