<template>
  <div class="downloading">
    <div> Windows is starting </div>
    <div class="loading"><span v-for="i in count" :key="i">.</span></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timer: null,
      count: 1
    }
  },
  created() {
    this.timer = setInterval(() => {
      this.count++
      if (this.count === 100) {
        this.count = 1
      }
    }, 700)
  },
  beforeUnmount() {
    clearInterval(this.timer)
  }
}
</script>

<style scoped lang="scss">
.downloading {
  background: #000;
  color: #fff;
  padding: 10%;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  & .loading {
    padding: 15px 0;
  }
}
</style>
