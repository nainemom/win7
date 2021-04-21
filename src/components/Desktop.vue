<template>
  <div :class="$style.desktop">
    <File v-for="(file, index) in desktopFiles" :key="file.name + index" :file="file" />
  </div>
</template>

<script>
import { fitSize } from '/src/styles/common';
import { panelSize } from '/src/styles/constants';
import File from '/src/components/File.vue';

export default {
  props: ['wallpaper'],
  components: {
    File,
  },
  inject: ['$fs'],
  data() {
    return {
      desktopFiles: [],
    };
  },
  created() {
    this.reload();
    this.$fs.onReload(this.reload);
  },
  beforeUnmount() {
    this.$fs.offReload(this.reload);
  },
  methods: {
    reload() {
      this.desktopFiles = [...this.$fs.resolvePath(['C:', 'User', 'Desktop']).files];
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
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        alignContent: 'flex-start',
      }),
    ];
  },
};
</script>
