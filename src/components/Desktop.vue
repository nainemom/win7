<template>
  <div
    :class="$style.desktop"
    :style="{backgroundImage :`url(${$wm.currentWallpaper.src})`}"
  >
    <FilesContainer
      path="C:/User/Desktop"
      direction="column"
      :file-props="{ shadow: true }"
      :context-menu-extras="contextMenuExtras"
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
  ...inject('$wm', '$fs'),
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
  computed: {
    contextMenuExtras() {
      return {
        'Change Background': this.openChangeBackground,
      };
    },
  },
  methods: {
    openChangeBackground() {
      const file = this.$fs.resolveFileByPath('C:/Program Files/ChangeBackground.exe');
      if (!file) {
        throw new Error('Program not found!');
      }
      this.$wm.openFile(file);
    },
  },
};
</script>
