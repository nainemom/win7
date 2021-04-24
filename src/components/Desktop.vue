<template>
  <div :class="$style.desktop">
    <File v-for="(file, index) in desktopFiles" :key="file.name + index" :file="file" />
  </div>
</template>

<script>
import { fitSize } from '/src/styles/common';
import { panelSize } from '/src/styles/constants';
import File from '/src/components/File.vue';
import WallpaperImage from '/src/assets/wallpaper.jpg';

export default {
  components: {
    File,
  },
  inject: ['$fs'],
  computed: {
    desktopFiles() {
      return this.$fs.resolvePath(['C:', 'User', 'Desktop']).files;
    },
  },
  style({ className }) {
    return [
      className('desktop', {
        background: `url("${WallpaperImage}")`,
        position: 'absolute',
        ...fitSize,
        paddingBottom: panelSize,
        backgroundPosition: 'bottom center',
        backgroundSize: 'cover',
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        alignContent: 'flex-start',
      }),
    ];
  },
};
</script>
