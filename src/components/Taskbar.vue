<template>
  <div :class="$style.taskbar">
    <div :class="$style.orb" @click="orbClick" />
    <div :class="$style.windowsList">
      <TaskbarRunningWindow v-for="window in $os.list" :key="window.id" v-bind="window"/>
    </div>
    <!--
    <section class="dark to-left">
      <img class="notif-icon" src="/winvista/icons/152.ico" alt="i" @click="$emit('click', $event)"/>
      <img class="notif-icon" src="/winvista/icons/vol.svg" alt="i" @click="$emit('click', $event)"/>
      <img class="notif-icon" src="/winvista/icons/105.ico" alt="i" @click="$emit('click', $event)"/>
      <span class="clock" v-html="dateString" @click="$emit('click', $event)" />
    </section> -->
  </div>
</template>

<script>
import { panelSize } from '/src/styles/constants';
import { rgba } from '/src/styles/utils';
import OrbNormal from '/src/assets/orb/normal.png';
import TaskbarRunningWindow from '/src/components/TaskbarRunningWindow.vue';

export default {
  inject: ['$os'],
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
      this.$os.openWindow('div', {
        title: 'ORB App ' + Date.now(),
      });
    },
    clickWindow(window) {
      this.$os.focusWindow(window.id);
      console.log(window);
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
        padding: '0 9px',
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

<!-- stylez scoped langz="scss">
@import '../assets/mixins';

.panel {
  @include gradient(#2b2b2b, 0.7);
  height: 30px;
  min-height: 30px;
  max-height: 30px;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 14px;
  overflow: visible;
  z-index: 99;

  & section {
    padding: 0 3px;
    display: flex;
    align-items: center;
    justify-content: center;

    &.dark {
      $darkColor: rgba(9, 65, 80, 0.2);

      background: $darkColor;
      height: 100%;
      min-height: 100%;

      &.to-right {
        box-shadow: 15px 0 25px $darkColor;
        padding-right: 25px;
      }
      &.to-left {
        box-shadow: -15px 0 25px $darkColor;
        padding-left: 45px;

        & > * {
          border: solid 1px transparent;
          padding: 0 8px;
          cursor: pointer;

          &:hover {
            border-left: solid 1px rgba(255, 255, 255, 0.2);
            border-right: solid 1px rgba(255, 255, 255, 0.2);
          }

          &.notif-icon {
            height: 70%;
          }
        }
      }
    }
  }

  & > .orb-container {
    padding: 0 10px;

    & .orb {
      background-image: url('/winvista/orb/normal.png');
      width: 43px;
      height: 43px;
      background-size: 100%;
      transition: all 0.3s;
      border-radius: 20px;
      box-shadow:
        5px 0 0.7px -3px rgba(1, 21, 35, 0.9),
        -5px 0 0.7px -3px rgba(0, 0, 0, 0.8),
        7px 0 0.4px -3px rgba(255, 255, 255, 0.4),
        -7px 0 0.4px -3px rgba(255, 255, 255, 0.4)
      ;
      cursor: pointer;

      &:hover,
      &:focus {
        background-image: url('/winvista/orb/hover.png');
      }

      &:active {
        background-image: url('/winvista/orb/active.png');
      }
    }
  }
  & .windows-list {
    flex-grow: 1;
    height: 100%;
    display: flex;
    align-items: center;

    & > .window {
      @include gradient(#6e6e6e, 0.7);
      height: calc(100% - 4px);
      display: flex;
      align-items: center;
      padding: 0 10px;
      margin: 3px 2px;
      min-width: 200px;
      border-radius: 2px;
      box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.2);

      &:hover {
        @include gradient(#6b7c80, 0.7);
      }
    }
  }

  & .clock {
    font-size: 13px;
    min-width: 80px;
    text-align: center;
  }

}
</stylez !-->
