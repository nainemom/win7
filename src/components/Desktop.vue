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
      try {
        return `url("${this.$fs.resolveFileByPath(this.$cnf.values.wallpaperPath).data.value}")`;
      } catch (_e) {
        return '';
      }
    },
    contextMenuExtras() {
      return {
        'Change Background': this.openChangeBackground,
      };
    },
  },
  methods: {
    openChangeBackground() {
      this.$wm.openFile(
        this.$fs.resolveFileByPath('C:/Program Files/ChangeBackground.exe'),
      );
    },
  },
};
</script>
