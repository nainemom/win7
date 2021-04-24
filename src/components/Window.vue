<template>
  <div
    :class="[$style.window, runtimeProps, focused && 'focused']"
    :style="{ zIndex: runtimeProps.zIndex }"
    @click.capture="focus">
    <div :class="$style.titlebar">
      <div class="title" ref="title">
        <img :src="windowProps.icon" />
        {{windowProps.title}}
      </div>
      <div class="buttons" :class="focused && 'focused'">
        <div class="minimize" @click="minimize">
          <img :src="icons.minimize" />
        </div>
        <div class="maximize" v-show="windowProps.maximizable" @click="maximize">
          <img v-if="runtimeProps.maximized" :src="icons.unmaximize" />
          <img v-else :src="icons.maximize" />
        </div>
        <div class="close" @click="close">
          <img :src="icons.close" />
        </div>
      </div>
    </div>
    <component :class="$style.content" ref="content" :is="componentProps.runner.component" v-bind="componentProps.data" />
  </div>
</template>

<script>
import { rgba } from '/src/styles/utils';
import { panelSize } from '/src/styles/constants';
import Swipe from '/src/utils/Swipe';
import MaximizeIcon from '/src/assets/window/maximize.png';
import UnmaximizeIcon from '/src/assets/window/unmaximize.png';
import MinimizeIcon from '/src/assets/window/minimize.png';
import CloseIcon from '/src/assets/window/close.png';

export default {
  inject: ['$wm'],
  props: ['runtimeProps', 'componentProps', 'windowProps'],
  data() {
    return {
      mover: null,
      moveStartPosition: null,
    };
  },
  computed: {
    icons() {
      return {
        maximize: MaximizeIcon,
        unmaximize: UnmaximizeIcon,
        minimize: MinimizeIcon,
        close: CloseIcon,
      };
    },
    focused() {
      return this.$wm.isWindowFocused(this.windowProps.id);
    },
  },
  mounted() {
    this.setPosition({
      height: this.windowProps.height,
      width: this.windowProps.width,
      left: this.windowProps.left,
      top: this.windowProps.top,
    });
    this.mover = Swipe(this.$refs.title);
    this.mover.before(this.moveStart);
    this.mover.while(this.whileMove);
    this.mover.on();
  },
  beforeUnmount() {
    this.mover.off();
  },
  methods: {
    close() {
      this.$wm.closeWindow(this.windowProps.id);
    },
    focus() {
      this.$wm.focusWindow(this.windowProps.id);
    },
    moveStart() {
      if (this.runtimeProps.maximized) {
        this.maximize();
      }
      this.focus();
      this.moveStartPosition = this.getPosition(true);
    },
    whileMove(_touchPos, { x, y }) {
      this.setPosition({
        left: x + this.moveStartPosition.left,
        top: y + this.moveStartPosition.top,
      });
    },
    minimize() {
      this.$wm.minimizeWindow(this.windowProps.id);
    },
    maximize() {
      this.$wm.maximizeWindow(this.windowProps.id);
    },
    setPosition(position) {
      Object.keys(position).forEach((key) => {
        this.$el.style[key] = position[key] + (typeof position[key] !== 'string' ? 'px' : '');
      });
    },
    getPosition(numeric = false) {
      const keys = ['top', 'left', 'width', 'height'];
      const ret = {};
      keys.forEach((key) => {
        ret[key] = this.$el[`offset${key[0].toUpperCase()}${key.slice(1)}`] + (numeric ? 0 : 'px');
      });
      return ret;
    },
  },
  style({ className }) {
    const baseAlpha = 0.1;
    const titleHeight = '32px';

    return [
      className('window', {
        userSelect: 'none',
        position: 'absolute',
        resize: 'both',
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
        backdropFilter: 'blur(7px) brightness(1.1)',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontSize: '15px',
        minWidth: '400px',
        minHeight: '200px',
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
          opacity: 0.83,
          backdropFilter: 'blur(4px)',
          boxShadow: `
            0 0 0 1px ${rgba(255, 0.9)},
            0 0 8px 3px ${rgba(10, 0.4)}
          `,
        },
      }),
      className('titlebar', {
        height: titleHeight,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '0 10px',
        '& > .title': {
          textShadow: new Array(4).fill(`0 0 5px ${rgba(255, 1)}`).join(','),
          flexGrow: 1,
          height: '100%',
          lineHeight: titleHeight,
          '& > img': {
            width: '20px',
            marginRight: '5px',
            verticalAlign: 'middle',
          },
        },
        '& > .buttons': {
          display: 'flex',
          flexDirection: 'row',
          height: '18px',
          alignSelf: 'flex-start',
          border: `solid 1px ${rgba(0, 0.6)}`,
          borderTop: 'none',
          borderBottomLeftRadius: '5px',
          borderBottomRightRadius: '5px',
          backdropFilter: 'hue-rotate(16deg)',
          overflow: 'hidden',
          '& > *': {
            textAlign: 'center',
            lineHeight: '18px',
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#fff',
            width: '26px',
            background: `linear-gradient(180deg,
              ${rgba(250, 0.4)} 0%,
              ${rgba(250, 0.4)} 30%,
              ${rgba(160, 0.3)} 70%,
              ${rgba(200, 0.3)} 90%,
              ${rgba(230, 0.3)} 100%
            )`,
            '& > img': {
              height: '12px',
              marginTop: '2px',
              filter: `drop-shadow(1px 0 1px ${rgba(0, 0.4)})`,
            },

            '&:not(:last-child)': {
              borderRight: `solid 1px ${rgba(0, 0.4)}`,
            },
            '&:hover': {
              filter: 'brightness(1.3)'
            },
            '&:active': {
              filter: 'brightness(0.9)'
            },
          },
          '& > .close': {
            width: '42px',
          },
          '&.focused > .close': {
            background: `linear-gradient(180deg,
              rgba(255, 107, 63, 0.8) 0%,
              rgba(255, 104, 79, 0.7) 43%,
              rgba(175, 61, 44, 0.9) 64%,
              rgba(204, 33, 33, 0.7) 90%,
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
}
</script>
