<!--template>
  <div class="desk">
    <slot />
  </div>
</template>

<style scoped>
.desk {
  position: relative;
  height: calc(100% - 30px);
  min-height: calc(100% - 30px);
  max-height: calc(100% - 30px);
  overflow: hidden;
  flex-direction: column;
  display: flex;
}
</style-->

<template>
  <div :class="$style.desktop">
    <slot />
  </div>
</template>

<script>
import { fitSize } from '/src/styles/common';
import { panelSize } from '/src/styles/constants';


export default {
  props: ['wallpaper'],
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
