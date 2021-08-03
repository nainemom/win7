<template>
  <div :class="$style.desktop" :style="{backgroundImage :`url(${$wm.currentWallpaper.src})`}">
    <FilesContainer
      path="C:/User/Desktop"
      direction="column"
      :file-props="{ shadow: true }"
    />
  </div>
</template>

<script>
import { fitSize } from '../styles/common';
import { inject } from '../utils/vue';
import { panelSize } from '../styles/constants';
import FilesContainer from './FilesContainer.vue';

export default {
  name: 'Desktop',
  components: {
    FilesContainer,
  },
  ...inject('$fs'),
  ...inject('$wm'),
  style({ className }) {
    return [
      className('desktop', {
      //  background: `url("${WallpaperImage}")`,
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
