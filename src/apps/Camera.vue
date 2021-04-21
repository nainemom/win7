<template>
  <div :class="$style.camera">
    <video ref="video" muted autoplay playsinline />
    <span class="button" @click="takePhoto">Take Photo</span>
  </div>
</template>

<script>
import icon from '/src/assets/icons/camera.ico';

export default {
  appConfig: {
    icon,
    exts: [],
    types: [],
    fileIcon: null,
    windowConfig: {
      width: '600px',
      height: '500px',
    },
  },
  mounted() {
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: 'user'
      }
    }).then(stream => {
      this.$refs.video.srcObject = stream;
    });
  },
  methods: {
    takePhoto() {
      const canvas = document.createElement("canvas");
      canvas.width = this.$refs.video.clientWidth;
      canvas.height = this.$refs.video.clientHeight;
      canvas.getContext('2d').drawImage(this.$refs.video, 0, 0, canvas.width, canvas.height);
      const image = new Image()
      image.src = canvas.toDataURL();
    },
  },
  style({ className }){
    return [
      className('camera', {
        position: 'relative',
        '& > video': {
          width: '100%',
          height: '100%',
          border: 'none',
          resize: 'none',
          objectFit: 'cover',
        },
        '& > .button': {
          position: 'absolute',
          bottom: '15px',
          left: '50%',
          transform: 'translateX(-50%)',
          border: '0',
          backgroundColor: '#ff180078',
          borderRadius: '20px',
          padding: '15px',
          color: '#fff',
          fontWeight: 'bold',
          cursor: 'pointer',
          '&:hover, &:focus': {
            backgroundColor: '#ff1800aa',
          },
          '&:active': {
            backgroundColor: '#ff1800',
          },
        },
      }),
    ];
  },
}
</script>

