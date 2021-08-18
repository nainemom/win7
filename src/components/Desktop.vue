<template>
  <div
    :class="$style.desktop"
    :style="{ backgroundImage: wallpaper }"
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
  ...inject('$wm', '$fs', '$cnf'),
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
    wallpaper() {
      return `url("${this.$cnf.values.wallpaperPath}")`;
    },
    contextMenuExtras() {
      return {
        'Change Background': this.openChangeBackground,
      };
    },
  },
  methods: {
    openChangeBackground() {
      this.$wm.openFile('/C:/Windows/System32/ChangeBackground.exe');
    },
  },
};
</script>
