<template>
  <div :class="$style.desktop">
    <File v-for="(file, index) in desktopFiles" :key="index" v-bind="file" />
  </div>
</template>

<script>
import { fitSize } from '/src/styles/common';
import { panelSize } from '/src/styles/constants';
import File from '/src/components/File.vue';
import { getFile } from '/src/services/files';

export default {
  props: ['wallpaper'],
  components: {
    File,
  },
  computed: {
    desktopFiles() {
      return getFile(['C:', 'User', 'Desktop']).files;
    },
  },
  style({ className }) {
    return [
      className('desktop', {
        background: `url("${this.wallpaper}") blue`,
        position: 'absolute',
        ...fitSize,
        paddingBottom: panelSize,
        backgroundPosition: 'bottom center',
        backgroundSize: 'cover',
      }),
    ];
  },
};
</script>
