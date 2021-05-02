<template>
  <div :class="$style.desktop">
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
import WallpaperImage from '../assets/wallpaper.jpg';
import FilesContainer from './FilesContainer.vue';

export default {
  components: {
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
