<template>
  <audio
    autoplay
    controls
    :class="$style.player"
    class="no-border"
    @ended="onEnd"
  >
    <source :src="soundData.value">
  </audio>
</template>

<script>
import icon from '../../../src/assets/icons/mp3.png';
import { props, inject } from '../../../src/utils/vue';

export default {
  canHandle: (file) => file.type === 'sound',
  windowProperties: (file) => ({
    icon,
    hidden: file ? file.data.hidden : false,
    height: 100,
    resizable: false,
    maximizable: false,
  }),
  ...inject('$wm'),
  ...props({
    file: props.obj(null),
  }),
  computed: {
    soundData() {
      return this.file ? this.file.data : {};
    },
  },
  methods: {
    onEnd() {
      if (typeof this.soundData.onEnd === 'function') {
        this.soundData.onEnd();
      }
      if (this.file.data.hidden) {
        this.$nextTick(() => {
          this.$wm.closeWindow(this.wmId);
        });
      }
    },
  },
  style({ className }) {
    return [
      className('player', {
        background: '#f1f3f4',
        width: '100%',
        padding: '15px 0',
      }),
    ];
  },
};
</script>
