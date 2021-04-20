<template>
    <video class="camera" muted autoplay playsinline />
</template>
<script>
export default {
  mounted() {
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: 'user'
      }
    }).then(stream => {
      this.$el.srcObject = stream;
    });
  }
}
</script>

<style>
  .camera {
    width: 100%;
    height: 100%;
    border: none;
    resize: none;
  }
</style>

