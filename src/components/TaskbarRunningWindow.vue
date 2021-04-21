
<template>
  <div :class="[focused && 'focused', $style.taskbarRunningWindow]" @click="click">
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
  },
  style({ className }) {
    return [
      className('taskbarRunningWindow', {
        userSelect: 'none',
        backgroundColor: rgba(255, 0.14),
        height: 'calc(100% - 6px)',
        borderRadius: '4px',
        marginRight: '2px',
        marginTop: '3px',
        border: `solid 1px ${rgba(0, 0.6)}`,
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
        '&.focused': {
          backgroundColor: rgba(0, 0.3),
        },
        '&.minimized': {
          fontWeight: 'normal',
        },
      }),
    ];
  },
}
</script>
