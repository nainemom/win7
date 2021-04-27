<template>
  <div
    :class="[$style.window, focused && 'focused', window.maximized && 'maximized', window.minimized && 'minimized']"
    :style="{ zIndex: window.zIndex }"
    @click.capture="focus">
    <div :class="$style.titlebar">
      <div class="title" ref="title">
        <img :src="window.icon" />
        {{window.title}}
      </div>
      <div class="buttons" :class="focused && 'focused'">
        <div class="minimize" v-if="window.minimizable" @click="minimize">
          <img :src="icons.minimize" />
        </div>
        <div class="maximize" v-if="window.maximizable" @click="maximize">
          <img v-if="window.maximized" :src="icons.unmaximize" />
          <img v-else :src="icons.maximize" />
        </div>
        <div class="close" v-if="window.closable" @click="close">
          <img :src="icons.close" />
        </div>
      </div>
    </div>
    <!-- <div :class="$style.content"> {{ window }} </div> -->
    <component :class="$style.content" ref="content" :is="window.fsData.runner.data.component" :file="window.fsData.file" />
  </div>
</template>

<script>
import { inject, props } from '/src/utils/vue';
import { each } from '/src/utils/utils';
import { rgba, px } from '/src/styles/utils';
import { panelSize } from '/src/styles/constants';
import swipe from '/src/utils/swipe';
import MaximizeIcon from '/src/assets/window/maximize.png';
import UnmaximizeIcon from '/src/assets/window/unmaximize.png';
import MinimizeIcon from '/src/assets/window/minimize.png';
import CloseIcon from '/src/assets/window/close.png';

export default {
  ...props({
    window: props.obj(null),
  }),
  ...inject('$wm'),
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
      return this.$wm.isWindowFocused(this.window.id);
    },
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
    this.mover && this.mover.stop();
  },
  methods: {
    close() {
      this.$wm.closeWindow(this.window.id);
    },
    focus() {
      this.$wm.focusWindow(this.window.id);
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
      this.$wm.minimizeWindow(this.window.id);
    },
    maximize() {
      this.$wm.maximizeWindow(this.window.id);
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
              filter: `drop-shadow(0 0 1px ${rgba(0, 1)})`,
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
