<template>
  <div
    v-show="!window.hidden"
    :class="[
      $style.window, focused && 'focused',
      window.maximized && 'maximized',
      window.minimized && 'minimized',
      window.resizable && 'resizable'
    ]"
    :style="{ zIndex: window.zIndex }"
    @click.capture="focus"
  >
    <div :class="$style.titlebar">
      <div
        ref="title"
        class="title"
      >
        <img :src="window.icon.data">
        {{ window.title }}
      </div>
      <div
        class="buttons"
        :class="focused && 'focused'"
      >
        <div
          v-if="window.minimizable"
          class="minimize"
          @click="minimize"
        >
          <img :src="icons.minimize">
        </div>
        <div
          v-if="window.maximizable"
          class="maximize"
          @click="maximize"
        >
          <img
            v-if="window.maximized"
            :src="icons.unmaximize"
          >
          <img
            v-else
            :src="icons.maximize"
          >
        </div>
        <div
          v-if="window.closable"
          class="close"
          @click="close"
        >
          <img :src="icons.close">
        </div>
      </div>
    </div>
    <component
      :is="window.fsData.runner.data"
      ref="content"
      :class="$style.content"
      :file="window.fsData.file"
      :wm-id="window.id"
    />
  </div>
</template>

<script>
import {
  isWindowFocused,
  closeWindow,
  focusWindow,
  minimizeWindow,
  maximizeWindow,
} from '@/services/wm';
import { resolveFileByPath } from '@/services/fs';
import { props } from '@/utils/vue';
import { rgba, px } from '@/styles/utils';
import { panelSize } from '@/styles/constants';
import swipe from '@/utils/swipe';
import { each } from '@/utils/utils';
import { log } from '@/utils/log';

export default {
  ...props({
    window: props.obj(),
  }),
  data() {
    return {
      mover: null,
      moveStartPosition: null,
    };
  },
  computed: {
    icons() {
      return {
        maximize: resolveFileByPath('C:/Windows/system/window/maximize.png').data,
        unmaximize: resolveFileByPath('C:/Windows/system/window/unmaximize.png').data,
        minimize: resolveFileByPath('C:/Windows/system/window/minimize.png').data,
        close: resolveFileByPath('C:/Windows/system/window/close.png').data,
      };
    },
    focused() {
      return isWindowFocused(this.window.id);
    },
  },
  created() {
    log(
      `Window.vue ${this.window.title}`,
      ['window:', this.window],
      ['fsData:', this.window.fsData],
    );
  },
  mounted() {
    this.setPosition({
      height: this.window.height,
      width: this.window.width,
      left: this.window.left,
      top: this.window.top,
    });
    if (this.window.movable) {
      this.mover = swipe(
        this.$refs.title,
        this.moveStart,
        this.whileMove,
        this.moveEnd,
      );
    }
  },
  beforeUnmount() {
    if (this.mover) {
      this.mover.stop();
    }
  },
  methods: {
    close() {
      closeWindow(this.window.id);
    },
    focus() {
      focusWindow(this.window.id);
    },
    moveStart() {
      if (this.window.maximized) {
        this.maximize();
      }
      if (!this.focused) {
        this.focus();
      }
      this.moveStartPosition = this.getPosition();
      return true;
    },
    whileMove({ left, top }) {
      this.setPosition({
        left: left + this.moveStartPosition.left,
        top: top + this.moveStartPosition.top,
      });
    },
    moveEnd({ left, top }) {
      this.setPosition({
        left: left + this.moveStartPosition.left,
        top: top + this.moveStartPosition.top,
      });
      each(this.getPosition(), (key, value) => {
        this.window[key] = value;
      });
    },
    minimize() {
      minimizeWindow(this.window.id);
    },
    maximize() {
      maximizeWindow(this.window.id);
    },
    setPosition(position) {
      each(position, (key, value) => {
        this.$el.style[key] = px(value);
      });
    },
    getPosition() {
      const keys = ['top', 'left', 'width', 'height'];
      const ret = {};
      keys.forEach((key) => {
        ret[key] = this.$el[`offset${key[0].toUpperCase()}${key.slice(1)}`];
      });
      return ret;
    },
  },
  style({ className }) {
    return [
      className('window', {
        userSelect: 'none',
        position: 'absolute',
        ...(this.window.resizable && {
          resize: 'both',
        }),
        background: `linear-gradient(180deg,
          ${rgba(250, 0.1)} 0%,
          ${rgba(255, 0.4)} 30%,
          ${rgba(70, 0.2)} 40%,
          ${rgba(170, 0.1)} 100%
        )`,
        boxShadow: `
          0 0 0 1px ${rgba(255, 0.8)},
          0 0 8px 3px ${rgba(10, 0.8)}
        `,
        backdropFilter: 'blur(7px) brightness(0.9)',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontSize: '15px',
        minWidth: '400px',
        minHeight: '32px',
        '&.maximized': {
          width: '100% !important',
          height: `calc(100% - ${panelSize}) !important`,
          top: '0 !important',
          left: '0 !important',
          borderRadius: '0 !important',
          resize: 'none !important',
          boxShadow: 'none !important',
        },
        '&.minimized': {
          display: 'none',
        },
        '&:not(.focused)': {
          opacity: 0.9,
          backdropFilter: 'blur(4px)',
          boxShadow: `
            0 0 0 1px ${rgba(255, 0.9)},
            0 0 8px 3px ${rgba(10, 0.4)}
          `,
        },
      }),
      className('titlebar', {
        height: '32px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '0 10px',
        '& > .title': {
          textShadow: new Array(4).fill(`0 0 5px ${rgba(255, 1)}`).join(','),
          flexGrow: 1,
          height: '100%',
          lineHeight: '32px',
          '& > img': {
            width: '20px',
            marginRight: '5px',
            verticalAlign: 'middle',
          },
        },
        '& > .buttons': {
          display: 'flex',
          flexDirection: 'row',
          height: '19px',
          alignSelf: 'flex-start',
          boxShadow: `
            0 0 3px ${rgba(255, 0.4)},
            0 0 0 1px ${rgba(0, 0.5)},
            inset 0 0 1px 2px ${rgba(255, 0.4)}
          `,
          borderTop: 'none',
          borderBottomLeftRadius: '5px',
          borderBottomRightRadius: '5px',
          overflow: 'hidden',
          '& > *': {
            textAlign: 'center',
            lineHeight: '19px',
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#fff',
            width: '28px',
            background: `linear-gradient(180deg,
              ${rgba(200, 0.5)} 0%,
              ${rgba(200, 0.5)} 40%,
              ${rgba(110, 0.4)} 60%,
              ${rgba(150, 0.4)} 90%,
              ${rgba(180, 0.4)} 100%
            )`,
            backdropFilter: 'grayscale(1)',
            '& > img': {
              height: '13px',
              marginTop: '2px',
              filter: `drop-shadow(0 0 2px ${rgba(0, 1)})`,
            },
            '&.maximize > img': {
              height: '11px',
              marginTop: '3px',
            },

            '&:not(:last-child)': {
              borderRight: `solid 1px ${rgba(0, 0.4)}`,
            },
            '&:hover': {
              filter: 'brightness(1.3)',
            },
            '&:active': {
              filter: 'brightness(0.9)',
            },
          },
          '& > .close': {
            width: '46px',
          },
          '&.focused > .close': {
            background: `linear-gradient(180deg,
              rgba(255, 107, 63, 0.8) 0%,
              rgba(212, 116, 91, 0.7) 40%,
              rgba(192, 55, 44, 0.9) 55%,
              rgba(204, 33, 33, 0.7) 80%,
              rgba(255, 125, 125, 0.9) 100%
            )`,
          },
        },
      }),
      className('content', {
        flexGrow: 1,
        border: `solid 1px ${rgba(10, 0.5)}`,
        overflow: 'hidden',
        margin: '0 5px 5px 5px',
        maxWidth: 'calc(100% - 10px)',
        '&.no-border': {
          border: 0,
        },
      }),
    ];
  },
};
</script>
