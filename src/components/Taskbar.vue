<template>
  <div :class="$style.taskbar">
    <div :class="$style.orb" @click="orbClick" />
    <div :class="$style.windowsList">
      <TaskbarRunningWindow v-for="window in $wm.list" :key="window.id" v-bind="window"/>
    </div>
  </div>
</template>

<script>
import { panelSize } from '/src/styles/constants';
import { rgba } from '/src/styles/utils';
import OrbNormal from '/src/assets/orb/normal.png';
import TaskbarRunningWindow from '/src/components/TaskbarRunningWindow.vue';

export default {
  inject: ['$wm'],
  components: {
    TaskbarRunningWindow,
  },
  data() {
    return {
      clockTimer: null,
      dateString: ''
    }
  },
  created() {
    this.syncTime()
    this.clockTimer = setInterval(this.syncTime, 1000)
  },
  methods: {
    orbClick() {
    },
    clickWindow(window) {
      this.$wm.focusWindow(window.id);
    },
    syncTime(){
      const dt = new Date()
      let time
      const hour = dt.getHours()
      const min = dt.getMinutes()
      if (hour - 12 > 0) {
        time = `${hour - 12}:${min} PM`
      } else {
        time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')} AM`
      }
      this.dateString = time
    }
  },
  beforeUnmount() {
    clearInterval(this.clockTimer)
  },
  style({ className }) {
    const baseAlpha = 0.9;
    return [
      className('taskbar', {
        position: 'absolute',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'row',
        height: panelSize,
        width: '100%',
        left: 0,
        bottom: 0,
        background: `linear-gradient(180deg,
          ${rgba(40, baseAlpha)} 0%,
          ${rgba(200, baseAlpha)} 4%,
          ${rgba(150, baseAlpha)} 6%,
          ${rgba(124, baseAlpha)} 47%,
          ${rgba(82, baseAlpha)} 53%,
          ${rgba(40, baseAlpha)} 100%
        )`,
        backdropFilter: 'hue-rotate(300deg) brightness(0.75)',
      }),
      className('orb', {
        margin: '0 9px',
        width: `calc(${panelSize} + 6px)`,
        minWidth: `calc(${panelSize} + 6px)`,
        height: `calc(${panelSize} + 6px)`,
        backgroundImage: `url("${OrbNormal}");`,
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        marginTop: '-6px',
        filter: 'drop-shadow(0 0 1px #000) brightness(1)',
        transition: 'filter 0.3s',
        '&:hover, &:focus': {
          filter: 'drop-shadow(0 0 1px #000) brightness(1.5)'
        },
        '&:active': {
          filter: 'drop-shadow(0 0 1px #000) brightness(0.8)'
        }
      }),
      className('windowsList', {
        flexGrow: 1,
        display: 'flex',
        maxWidth: '70%'
      }),
    ];
  },
}
</script>
