<template>
  <div :class="$style.desktop">
    <DesktopIcon v-for="(icon, index) in icons" :key="index" v-bind="icon" />
  </div>
</template>

<script>
import { fitSize } from '/src/styles/common';
import { panelSize } from '/src/styles/constants';
import DesktopIcon from '/src/components/DesktopIcon.vue';

export default {
  props: ['wallpaper', 'icons'],
  components: {
    DesktopIcon,
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
