<template>
  <Teleport to="body">
    <div
      :class="$style.staticWindow"
      v-show="visible"
      @click.capture="focus">
      <div :class="$style.content">
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script>
import { rgba } from '/src/styles/utils';
import { panelSize } from '/src/styles/constants';

export default {
  inject: ['$wm'],
  props: {
    visible: Boolean,
    position: Object,
  },
  methods: {
    close() {
      this.$wm.closeWindow(this.windowProps.id);
    },
    focus() {
      this.$wm.focusWindow(this.windowProps.id);
    },
  },
  style({ className }) {
    const baseAlpha = 0.1;
    const titleHeight = '32px';

    return [
      className('staticWindow', {
        userSelect: 'none',
        position: 'absolute',
        background: `linear-gradient(180deg,
          ${rgba(250, baseAlpha)} 0%,
          ${rgba(250, baseAlpha)} 40%,
          ${rgba(140, baseAlpha)} 43%,
          ${rgba(170, baseAlpha)} 100%
        )`,
        boxShadow: `
          0 0 0 1px ${rgba(255, 0.9)},
          0 0 8px 3px ${rgba(10, 0.6)}
        `,
        backdropFilter: 'blur(8px) brightness(0.9)',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontSize: '15px',
        minWidth: '400px',
        minHeight: '200px',
        zIndex: 99999,
        ...this.position,
      }),
      className('content', {
        flexGrow: 1,
        overflow: 'hidden',
        margin: '5px',
        maxWidth: 'calc(100% - 10px)',
        '&.no-border': {
          border: 0,
        },
      }),
    ];
  },
}
</script>
