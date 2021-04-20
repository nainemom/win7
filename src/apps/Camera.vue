<template>
  <video :class="$style.camera" muted autoplay playsinline />
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
  },
  style({ className }){
    return [
      className('camera', {
        border: 'none',
        resize: 'none',
        objectFit: 'cover',
      }),
    ];
  },
}
</script>

