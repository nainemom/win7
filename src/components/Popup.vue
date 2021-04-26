<template>
  <Teleport to="body">
    <div
      :class="$style.staticWindow"
      v-bind="$attrs"
      ref="popup"
      @mouseup.stop="closeIf"
      @touchend.stop="closeIf"
      v-if="visible">
      <div :class="$style.content">
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script>
import { rgba } from '/src/styles/utils';
import { props } from '/src/utils/vue';
import { addEventListener, removeEventListener } from '/src/utils/eventListener';

export default {
  emits: ['update:visible'],
  inheritAttrs: false,
  ...props({
    visible: props.bool(false),
    autoClose: props.bool(false),
    dark: props.bool(false),
  }),
  watch: {
    visible: {
      handler(visible) {
        if (visible) {
          setTimeout(() => {
            this.bindEvents();
          })
        } else {
          this.unbindEvents();
        }
      },
      immidiate: true,
    }
  },
  methods: {
    closeIf(event) {
      if (this.autoClose || !this.$refs.popup.contains(event.target)) {
        setTimeout(() => {
          this.$emit('update:visible', false);
        })
      }
    },
    bindEvents() {
      addEventListener(window, ['mouseup', 'touchend'], this.closeIf);
    },
    unbindEvents() {
      removeEventListener(window, ['mouseup', 'touchend'], this.closeIf);
    },
  },
  beforeUnmount() {
    this.unbindEvents();
  },
  style({ className }) {
    const baseAlpha = 0.1;

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
        ...(this.dark ? {
          backdropFilter: 'blur(8px) brightness(0.5)',
          boxShadow: `
            0 0 0 1px ${rgba(180, 0.5)},
            0 0 8px 3px ${rgba(10, 0.3)}
          `,
        } : {
          backdropFilter: 'blur(8px) brightness(0.9)',
          boxShadow: `
            0 0 0 1px ${rgba(255, 0.9)},
            0 0 8px 3px ${rgba(10, 0.6)}
          `,
        }),
        borderRadius: '8px',
        overflow: 'hidden',
        fontSize: '15px',
        zIndex: 99999,
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
