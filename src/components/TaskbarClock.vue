<template>
  <div :class="$style.taskbarClock">
    {{ formattedFime }}
  </div>
</template>

<script>
import { rgba } from '/src/styles/utils';

export default {
  data() {
    return {
      time: new Date(),
    };
  },
  created() {
    setInterval(() => {
      this.time = new Date();
    }, 1000);
  },
  computed: {
    formattedFime() {
      const { time } = this;
      return `${time.getHours() % 12}:${time.getMinutes()} ${time.getHours() > 12 ? 'PM':'AM'}\n${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}`;
    },
  },
  methods: {
    click() {
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
