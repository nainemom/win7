<template>
  <div
    :class="$style.taskbarClock"
    @click.capture="showPopup"
  >
    {{ formattedFime }}
    <Popup
      v-model:visible="popup"
      :class="$style.popupStyle"
    >
      <div :class="$style.popup">
        <CalendarWidget />
        <ClockWidget />
      </div>
    </Popup>
  </div>
</template>

<script>
import { rgba } from '@/styles/utils';
import { panelSize } from '@/styles/constants';
import Popup from '@/components/Popup.vue';
import ClockWidget from '@/components/Taskbar/ClockWidget.vue';
import CalendarWidget from '@/components/Taskbar/CalendarWidget.vue';

export default {
  components: {
    Popup,
    ClockWidget,
    CalendarWidget,
  },
  data() {
    return {
      time: new Date(),
      popup: false,
    };
  },
  computed: {
    formattedFime() {
      const { time } = this;
      const hours = (time.getHours() % 12) || 12;
      return `${hours}:${time.getMinutes().toString().padStart(2, 0)} ${time.getHours() > 12 ? 'PM' : 'AM'}\n${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}`;
    },
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
  style({ className }) {
    return [
      className('popupStyle', {
        right: '15px',
        bottom: `${parseInt(panelSize, 10) + 15}px`,
      }),
      className('taskbarClock', {
        width: 'auto',
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
      className('popup', {
        display: 'flex',
        flexDirection: 'row',
        background: rgba(255, 1),
        borderRadius: '6px',
        padding: '15px',
        alignItems: 'center',
        justifyContent: 'center',
        border: `solid 1px ${rgba(0, 0.5)}`,
        '& > *': {
          '&:first-child': {
            marginRight: '15px',
          },
        },
      }),
    ];
  },
};
</script>
