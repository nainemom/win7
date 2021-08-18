<template>
  <div :class="$style.taskbar">
    <TaskbarOrb />
    <div :class="$style.windowsList">
      <TaskbarRunningWindow
        v-for="window in windowsList"
        :key="window.id"
        :window="window"
      />
    </div>
    <div :class="$style.try">
      <TaskbarRepo />
      <TaskbarClock />
    </div>
    <TaskbarShowDesktop />
  </div>
</template>

<script>
import { windows } from '@/services/wm';
import { panelSize } from '@/styles/constants';
import { rgba } from '@/styles/utils';
import TaskbarOrb from '@/components/Taskbar/TaskbarOrb.vue';
import TaskbarRunningWindow from '@/components/Taskbar/TaskbarRunningWindow.vue';
import TaskbarClock from '@/components/Taskbar/TaskbarClock.vue';
import TaskbarRepo from '@/components/Taskbar/TaskbarRepo.vue';
import TaskbarShowDesktop from '@/components/Taskbar/TaskbarShowDesktop.vue';

export default {
  components: {
    TaskbarOrb,
    TaskbarRunningWindow,
    TaskbarClock,
    TaskbarRepo,
    TaskbarShowDesktop,
  },
  computed: {
    windowsList() {
      return windows.list.filter((win) => !win.hidden);
    },
  },
  style({ className }) {
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
        },
      }),
    ];
  },
};
</script>
