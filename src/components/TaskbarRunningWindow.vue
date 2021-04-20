
<template>
  <div :class="[focused && 'focused', $style.taskbarRunningWindow]" @click="click">
    {{ title }}
  </div>
</template>

<script>
import { rgba } from '/src/styles/utils';

export default {
  emits: ['close', 'minimize'],
  inject: ['$os'],
  props: ['id', 'title', 'zIndex', 'minimized'],
  computed: {
    focused() {
      return this.$os.isWindowFocused(this.id);
    },
  },
  methods: {
    click() {
      if (this.minimized) {
        this.$os.minimizeWindow(this.id, false);
      } else if (this.focused) {
        this.$os.minimizeWindow(this.id, true);
      } else {
        this.$os.focusWindow(this.id);
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
        justifyContent: 'center',
        padding: '0 10px',
        fontFamily: 'sans-serif',
        fontSize: '14px',
        fontWeight: 'bold',
        color: rgba(255, 1),
        textShadow: new Array(4).fill(`0 0 1px ${rgba(0, 1)}`).join(','),
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'clip',
        maxWidth: '180px',

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
