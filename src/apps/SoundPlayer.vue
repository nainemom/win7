<template>
<audio autoplay @ended="onEnd">
  <source :src="soundData.value">
</audio>
</template>

<script>
export default {
  inject: ['$wm'],
  canHandle: (file) => file.type === 'sound',
  windowProperties: () => ({
    hidden: true,
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
      this.$nextTick(() => {
        this.$wm.closeWindow(this.wmId);
      });
    },
  },
}
</script>
