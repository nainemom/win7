<template>
  <div>
    <slot />
  </div>
</template>

<style scoped>
div {
  position: relative;
  height: 100%;
  min-height: 100%;
  max-height: 100%;
  overflow: hidden;
  flex-direction: column;
  display: flex;
}
</style>
