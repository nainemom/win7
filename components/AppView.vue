<template>
  <div class="view">
    <slot />
  </div>
</template>

<style scoped>
.view {
  position: relative;
  height: 100%;
  min-height: 100%;
  max-height: 100%;
  overflow: hidden;
}
</style>
