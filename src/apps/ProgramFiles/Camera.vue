<template>
  <div :class="$style.camera">
    <template v-if="!file">
      <video
        ref="video"
        muted
        autoplay
        playsinline
      />
      <span
        class="button"
        @click="takePhoto"
      >
        Take Photo
      </span>
    </template>
    <template v-else>
      <img :src="file.data.value">
    </template>
  </div>
</template>

<script>
import NotifSound from '../../assets/sounds/notif.wav';
import icon from '../../assets/icons/camera.png';
import fileIcon from '../../assets/icons/jpg.png';
import { props, inject } from '../../utils/vue';
import { rgba } from '../../styles/utils';
import { getPathName } from '../../services/fs';

export default {
  ...inject('$fs', '$snd'),
  ...props({
    file: props.obj(null),
  }),
  mounted() {
    if (!this.file) {
      navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: 'user',
        },
      }).then((stream) => {
        this.$refs.video.srcObject = stream;
      });
    }
  },
  beforeUnmount() {
    if (this.$refs.video) {
      this.$refs.video.srcObject.getTracks().forEach((track) => {
        track.stop();
      });
    }
  },
  methods: {
    takePhoto() {
      const canvas = document.createElement('canvas');
      canvas.width = this.$refs.video.clientWidth;
      canvas.height = this.$refs.video.clientHeight;
      canvas.getContext('2d').drawImage(this.$refs.video, 0, 0, canvas.width, canvas.height);
      const fileName = `Photo ${Date.now()}.jpg`;
      const filePath = `C:/User/Pictures/${fileName}`;
      this.$snd.playSound(NotifSound);
      this.$fs.createNewFile(this.$fs.fileObject(filePath, 'image', {
        value: canvas.toDataURL(),
      }));
      this.$fs.createNewFile(this.$fs.fileObject(`C:/User/Desktop/${fileName}`, 'shortcut', {
        src: filePath,
      }));
    },
  },
  style({ className }) {
    return [
      className('camera', {
        position: 'relative',
        '& > video, & > img': {
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
            filter: 'brightness(1.2)',
          },
          '&:not(.disabled):active': {
            filter: 'brightness(0.8)',
          },
          '&.disabled': {
            filter: 'grayscale(1)',
          },
        },
      }),
    ];
  },
};
</script>
