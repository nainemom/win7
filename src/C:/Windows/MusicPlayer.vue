<template>
  <audio
    autoplay
    controls
    :class="$style.player"
    class="no-border"
  >
    <source :src="soundData">
  </audio>
</template>

<script>
import { props } from '@/utils/vue';
import { resolveFileByPath } from '@/services/fs';

export default {
  canHandle: (file) => file && (file.path.endsWith('.mp3') || file.path.endsWith('.wav')),
  metaData: () => ({
    icon: resolveFileByPath('C:/Windows/system/icons/mp3.png'),
    height: 100,
    resizable: false,
    maximizable: false,
    title: 'Music Player',
  }),
  ...props({
    file: props.obj(null),
  }),
  computed: {
    soundData() {
      return this.file ? this.file.data : '';
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
