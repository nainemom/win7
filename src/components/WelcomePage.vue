<template>
  <div :class="$style.welcomePage">
    <button
      v-if="!isFullScreen"
      @click="startFullscreen"
    >
      Start Fullscreen
    </button>
    <button @click="start">
      Start Normally
    </button>
  </div>
</template>

<script>
import { inject } from '../utils/vue';
import { rgba } from '../styles/utils';
import LoginWallpaper from '../assets/login.png';
import StartupSound from '../assets/sounds/startup.wav?url';

export default {
  ...inject('$wm', '$snd'),
  mounted() {
    this.start();
  },
  computed: {
    isFullScreen() {
      return !!window.document.fullscreenElement;
    },
  },
  methods: {
    requestFullscreen() {
      const elem = document.documentElement;
      const method = elem.requestFullscreen
        || elem.webkitRequestFullscreen
        || elem.msRequestFullscreen;
      if (method) {
        method.call(elem);
      }
    },
    start() {
      this.$wm.startWindowManager();
      this.$snd.playSound(StartupSound);
    },
    startFullscreen() {
      this.requestFullscreen();
      this.start();
    },
  },
  style({ className }) {
    return [
      className('welcomePage', {
        position: 'fixed',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        left: 0,
        top: 0,
        background: `url("${LoginWallpaper}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'bottom',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& > button': {
          border: `solid 1px ${rgba(0, 0.4)}`,
          height: '48px',
          cursor: 'pointer',
          padding: '0 30px',
          borderRadius: '8px',
          margin: '5px',
          color: rgba(255, 1),
          textShadow: `0 0 3px ${rgba(0, 1)}`,
          background: `linear-gradient(180deg,
            ${rgba([165, 230, 255], 1)} 0%,
            ${rgba([125, 200, 240], 1)} 15%,
            ${rgba([60, 168, 230], 1)} 48%,
            ${rgba([44, 140, 200], 1)} 52%,
            ${rgba([47, 158, 220], 1)} 80%,
            ${rgba([115, 198, 238], 1)} 100%
          )`,
          transition: 'filter 0.2s',
          '&:hover, &:focus': {
            filter: 'brightness(1.1)',
          },
          '&:active': {
            filter: 'brightness(0.95)',
          },
        },
      }),
    ];
  },
};
</script>
