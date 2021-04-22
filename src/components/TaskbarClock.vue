<template>
  <div :class="$style.taskbarClock" @click.capture="showPopup">
    {{ formattedFime }}
    <StaticWindow v-model:visible="popup" :position="popupPosition">
      alam
    </StaticWindow>
  </div>
</template>

<script>
import { rgba } from '/src/styles/utils';
import { panelSize } from '/src/styles/constants';
import StaticWindow from '/src/components/StaticWindow.vue';

export default {
  components: {
    StaticWindow,
  },
  data() {
    return {
      time: new Date(),
      popup: false,
    };
  },
  created() {
    setInterval(() => {
      this.time = new Date();
    }, 1000);
  },
  methods: {
    showPopup() {
      this.popup = true;
    },
  },
  computed: {
    formattedFime() {
      const { time } = this;
      return `${time.getHours() % 12}:${time.getMinutes()} ${time.getHours() > 12 ? 'PM':'AM'}\n${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}`;
    },
    popupPosition() {
      return {
        right: '15px',
        bottom: `${parseInt(panelSize) + 15}px`,
      }
    },
  },
  style({ className }) {
    return [
      className('taskbarClock', {
        width: 'auto',
        // minWidth: '100px',
        whiteSpace: 'pre',
        textAlign: 'center',
        color: rgba(255, 1),
        textShadow: `0 0 2px ${rgba(0, 0.8)}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1.25,
        fontSize: '15px',
      }),
    ];
  },
}
</script>
