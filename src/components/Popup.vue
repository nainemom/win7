<template>
  <Teleport to="body">
    <div
      v-if="visible"
      v-bind="$attrs"
      ref="popup"
      :class="$style.staticWindow"
      @pointerup.stop="closeIf"
    >
      <div :class="$style.content">
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script>
import { rgba } from '@/styles/utils';
import { props } from '@/utils/vue';
import { addEventListener, removeEventListener } from '@/utils/eventListener';

export default {
  inheritAttrs: false,
  emits: ['update:visible'],
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
          });
        } else {
          this.unbindEvents();
        }
      },
      immidiate: true,
    },
  },
  beforeUnmount() {
    this.unbindEvents();
  },
  methods: {
    closeIf(event) {
      if (this.autoClose || !this.$refs.popup.contains(event.target)) {
        setTimeout(() => {
          this.$emit('update:visible', false);
        });
      }
    },
    bindEvents() {
      addEventListener(window, 'pointerup', this.closeIf);
    },
    unbindEvents() {
      removeEventListener(window, 'pointerup', this.closeIf);
    },
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
};
</script>
