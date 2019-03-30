<template>
  <div>
    <slot />
  </div>
</template>

<style scoped>
div {
  position: absolute;
  height: calc(100% + 150px);
  min-height: calc(100% + 150px);
  max-height: calc(100% + 150px);
  overflow: hidden;
  width: auto;
  min-width: 500px;
  /* padding: 15px; */
  text-align: right;
  top: -75px;
  padding: 90px 15px;
  /* padding: 15% 0; */
  right: 0;
  box-shadow: inset -130px 0 130px rgba(0, 0, 0, 0.4);
}
</style>
