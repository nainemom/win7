<template>
  <div :class="$style.camera">
    <div class="video">
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
      <span
        class="toggle"
        @click="openDirectory"
      >
        Open Taked Photos Directory
      </span>
    </div>
  </div>
</template>

<script>
import { rgba } from '@/styles/utils';
import { openFile } from '@/services/wm';
import { resolveFileByPath, createNewFile, fileObject } from '@/services/fs';
import { playBackgroundSound } from '@/services/snd';

export default {
  canHandle: (file) => !file,
  metaData: () => ({
    icon: resolveFileByPath('C:/Windows/system/icons/camera.png'),
    width: 600,
    height: 500,
    title: 'Camera',
  }),
  mounted() {
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: 'user',
      },
    }).then((stream) => {
      this.$refs.video.srcObject = stream;
    });
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
      createNewFile(fileObject(filePath, 'image', canvas.toDataURL()));
      playBackgroundSound(resolveFileByPath('C:/Windows/system/sounds/notif.mp3'));
    },
    openDirectory() {
      openFile(fileObject('C:/User/Pictures', 'directory'));
    },
  },
  style({ className }) {
    return [
      className('camera', {
        position: 'relative',
        '& > .video': {
          position: 'relative',
          width: '100%',
          height: '100%',
          '& > video, & > img': {
            width: '100%',
            height: '100%',
            border: 'none',
            resize: 'none',
            objectFit: 'cover',
          },
          '& > .toggle': {
            position: 'absolute',
            bottom: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '2px 15px',
            borderTopRightRadius: '15px',
            borderTopLeftRadius: '15px',
            color: '#111',
            background: `linear-gradient(180deg,
              #eee 0%,
              #aaa 100%
            )`,
            border: 'solid 1px #ddd',
          },
          '& > .button': {
            position: 'absolute',
            bottom: '35px',
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
        },
      }),
    ];
  },
};
</script>
