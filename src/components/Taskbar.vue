<template>
  <div :class="$style.taskbar">
    <div :class="$style.orb" @click="orbClick" />
    <div :class="$style.windowsList">
      <TaskbarRunningWindow v-for="window in $wm.list" :key="window.id" v-bind="window"/>
    </div>
    <div :class="$style.showDesktop" @click="showDesktop" />
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
    showDesktop() {
      const isAllWindowsMinimized = this.$wm.list.every((window) => window.runtimeProps.minimized);
      this.$wm.list.forEach((window) => {
        if (isAllWindowsMinimized || !window.runtimeProps.minimized) {
          this.$wm.minimizeWindow(window.windowProps.id);
        }
      });
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
    const itemSize = `${(parseInt(panelSize) - 1)}px`;

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
          ${rgba(10, 0.8)} 0%,
          ${rgba(200, 0.9)} 4%,
          ${rgba(70, 0.4)} 5%,
          ${rgba(70, 0.4)} 100%
        )`,
        backdropFilter: 'blur(4px)',
      }),
      className('orb', {
        margin: '0 9px',
        width: panelSize,
        minWidth: panelSize,
        height: panelSize,
        backgroundImage: `url("${OrbNormal}");`,
        backgroundPosition: 'center',
        backgroundSize: itemSize,
        backgroundRepeat: 'no-repeat',
        filter: 'brightness(1)',
        transition: 'filter 0.1s',
        '&:hover, &:focus': {
          filter: 'brightness(1.2)'
        },
        '&:active': {
          filter: 'brightness(1)'
        },
      }),
      className('windowsList', {
        flexGrow: 1,
        display: 'flex',
      }),
      className('showDesktop', {
        width: '12px',
        minWidth: '12px',
        height: itemSize,
        marginTop: '2px',
        background: `linear-gradient(150deg,
          ${rgba(250, 0.3)} 0%,
          ${rgba(200, 0.3)} 15%,
          ${rgba(70, 0.3)} 30%,
          ${rgba(70, 0.3)} 80%,
          ${rgba(200, 0.3)} 100%
        )`,
        borderLeft: `solid 1px ${rgba(200, 0.3)}`,
        '&:hover, &:focus': {
          filter: 'brightness(1.4)',
        },
        '&:active': {
          filter: 'brightness(1)',
        },
      }),
    ];
  },
}
</script>
