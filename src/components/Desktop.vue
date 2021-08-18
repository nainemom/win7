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
import { fitSize } from '@/styles/common';
import { panelSize } from '@/styles/constants';
import FilesContainer from '@/components/FilesContainer.vue';
import { resolveFileByPath } from '@/services/fs';
import { openFile } from '@/services/wm';
import { config } from '@/services/cnf';

export default {
  name: 'Desktop',
  components: {
    FilesContainer,
  },
  style({ className }) {
    return [
      className('desktop', {
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
        return `url("${resolveFileByPath(config.wallpaperPath).data}")`;
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
      openFile(
        resolveFileByPath('C:/Windows/ChangeBackground.vue'),
      );
    },
  },
};
</script>
