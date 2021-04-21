<template>
  <div :class="$style.camera">
    <template v-if="!value">
      <video ref="video" muted autoplay playsinline />
      <span class="button" @click="takePhoto">Take Photo</span>
    </template>
    <template v-else>
      <img :src="value" />
    </template>
  </div>
</template>

<script>
import icon from '/src/assets/icons/camera.ico';
import fileIcon from '/src/assets/icons/jpg.png';
import { rgba } from '/src/styles/utils';


export default {
  appConfig: {
    icon: () => icon,
    fileIcon: () => fileIcon,
    canHandle: (file) => {
      if (file.type === 'file' && file.name.endsWith('jpg')) {
        return true;
      }
    },
    windowConfig: {
      width: '600px',
      height: '500px',
    },
  },
  inject: ['$fs'],
  props: ['value'],
  mounted() {
    if (!this.value) {
      navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: 'user'
        }
      }).then(stream => {
        this.$refs.video.srcObject = stream;
      });
    }
  },
  methods: {
    takePhoto() {
      const canvas = document.createElement("canvas");
      canvas.width = this.$refs.video.clientWidth;
      canvas.height = this.$refs.video.clientHeight;
      canvas.getContext('2d').drawImage(this.$refs.video, 0, 0, canvas.width, canvas.height);
      this.$fs.createFile(`Photo ${Date.now()}.jpg`, ['C:', 'User', 'Desktop'], {
        value: canvas.toDataURL(),
      });
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
          borderRadius: '20px',
          padding: '15px',
          color: '#fff',
          fontWeight: 'bold',
          cursor: 'pointer',
          background: `linear-gradient(180deg,
            ${rgba([200, 0, 0], 0.8)} 0%,
            ${rgba([214, 0, 0], 0.8)} 47%,
            ${rgba([132, 0, 0], 0.8)} 53%,
            ${rgba([170, 0, 0], 0.8)} 100%
          )`,
          '&:not(.disabled):hover, &:not(.disabled):focus': {
            filter: 'brightness(1.2)'
          },
          '&:not(.disabled):active': {
            filter: 'brightness(0.8)'
          },
          '&.disabled': {
            filter: 'grayscale(1)',
          }
        },
      }),
    ];
  },
}
</script>

