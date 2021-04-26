<template>
  <div :class="$style.desktop">
    <FilesContainer path="C:/User/Desktop" direction="column" :file-props="{ shadow: true }" />
  </div>
</template>

<script>
import { fitSize } from '/src/styles/common';
import { inject } from '/src/utils/vue';
import { panelSize } from '/src/styles/constants';
import WallpaperImage from '/src/assets/wallpaper.jpg';
import FilesContainer from '/src/components/FilesContainer.vue';

export default {
  components: {
    File,
    FilesContainer,
  },
  ...inject('$fs'),
  style({ className }) {
    return [
      className('desktop', {
        background: `url("${WallpaperImage}")`,
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
