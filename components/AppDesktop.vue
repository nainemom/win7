<template>
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
</style>
