<template>
  <div :class="$style.taskbar">
    <div :class="$style.orb" @click="orbClick" />
    <div :class="$style.windowsList">
      <TaskbarRunningWindow v-for="window in $wm.list" :key="window.id" v-bind="window"/>
    </div>
    <div :class="$style.try">
      <TaskbarClock />
    </div>
    <div :class="$style.showDesktop" @click="showDesktop" />
  </div>
</template>

<script>
import { panelSize } from '/src/styles/constants';
import { rgba } from '/src/styles/utils';
import OrbNormal from '/src/assets/orb/normal.png';
import TaskbarRunningWindow from '/src/components/TaskbarRunningWindow.vue';
import TaskbarClock from '/src/components/TaskbarClock.vue';

export default {
  inject: ['$wm'],
  components: {
    TaskbarRunningWindow,
    TaskbarClock,
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
      className('try', {
        width: 'auto',
        display: 'flex',
        flexDirection: 'row',
        minWidth: '200px',
        justifyContent: 'flex-end',
        background: `linear-gradient(270deg,
          ${rgba(10, 0.3)} 0%,
          ${rgba(10, 0.3)} 70%,
          transparent 100%
        )`,
        '& > *': {
          margin: '0 15px',
        }
      }),
      className('showDesktop', {
        width: '12px',
        minWidth: '12px',
        height: itemSize,
        marginTop: '2px',
        background: `linear-gradient(150deg,
          ${rgba(250, 0.2)} 0%,
          ${rgba(200, 0.2)} 15%,
          ${rgba(10, 0.3)} 30%,
          ${rgba(10, 0.3)} 80%,
          ${rgba(200, 0.3)} 100%
        )`,
        borderLeft: `solid 1px ${rgba(200, 0.3)}`,
        '&:hover, &:focus': {
          filter: 'brightness(1.6)',
        },
        '&:active': {
          filter: 'brightness(1)',
        },
      }),
    ];
  },
}
</script>
