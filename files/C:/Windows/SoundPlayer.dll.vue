<template>
<audio autoplay controls @ended="onEnd" :class="$style.player" class="no-border">
  <source :src="soundData.value">
</audio>
</template>

<script>
import icon from '/src/assets/icons/mp3.png';

export default {
  inject: ['$wm'],
  canHandle: (file) => file.type === 'sound',
  windowProperties: (file) => ({
    icon,
    hidden: file ? file.data.hidden : false,
    height: 120,
    resizable: false,
    maximizable: false,
  }),
  props: ['file', 'wmId'],
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
        width: '100%',
        padding: '15px',
      }),
    ];
  },
}
</script>
