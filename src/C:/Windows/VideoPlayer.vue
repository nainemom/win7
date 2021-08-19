<template>
  <video
    autoplay
    controls
    :class="$style.player"
    class="no-border"
  >
    <source :src="videoData">
  </video>
</template>

<script>
import { props } from '@/utils/vue';
import { resolveFileByPath } from '@/services/fs';

export default {
  canHandle: (file) => file && (file.path.endsWith('.mp4') || file.path.endsWith('.mkv')),
  metaData: () => ({
    icon: resolveFileByPath('C:/Windows/system/icons/mp4.png'),
    width: 600,
    height: 400,
    resizable: true,
    maximizable: true,
    title: 'Video Player',
  }),
  ...props({
    file: props.obj(null),
  }),
  computed: {
    videoData() {
      return this.file ? this.file.data : '';
    },
  },
  style({ className }) {
    return [
      className('player', {
        background: '#000',
        width: '100%',
        padding: '15px 0',
      }),
    ];
  },
};
</script>
