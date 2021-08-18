<template>
  <div :class="$style.dialog">
    <div class="body">
      <div class="icon">
        <img :src="iconSrc">
      </div>
      <div class="content">
        {{ file.data.content }}
      </div>
    </div>
    <div class="buttons">
      <button
        v-for="button in file.data.buttons"
        :key="button"
        @click="emitClick(button)"
      >
        {{ button }}
      </button>
    </div>
  </div>
</template>

<script>
import { props } from '@/utils/vue';
import { rgba } from '@/styles/utils';
import { resolveFileByPath } from '@/services/fs';
import { playBackgroundSound } from '@/services/snd';
import { closeWindow } from '@/services/wm';

const typeToIconMap = {
  error: 'C:/Windows/system/icons/error.png',
  info: 'C:/Windows/system/icons/info.png',
  warning: 'C:/Windows/system/icons/warning.png',
  question: 'C:/Windows/system/icons/question.png',
};

const typeToSoundMap = {
  error: 'C:/Windows/system/sounds/error.mp3',
  info: 'C:/Windows/system/sounds/ding.mp3',
  warning: 'C:/Windows/system/sounds/ding.mp3',
  question: 'C:/Windows/system/sounds/ding.mp3',
};

export default {
  canHandle: (file) => file && file.path.endsWith('.dialog'),
  metaData: (file) => ({
    ...(file && {
      icon: resolveFileByPath(typeToIconMap[file.data.type]),
      title: file.data.title,
    }),
    width: 580,
    height: 200,
    maximizable: false,
  }),
  ...props({
    file: props.obj(null),
    wmId: props.any(),
  }),
  computed: {
    iconSrc() {
      return resolveFileByPath(typeToIconMap[this.file.data.type] || typeToIconMap.error).data;
    },
    sound() {
      return resolveFileByPath(typeToSoundMap[this.file.data.type] || typeToSoundMap.error);
    },
  },
  mounted() {
    playBackgroundSound(this.sound);
  },
  methods: {
    emitClick(button) {
      if (typeof this.file.data.onClick === 'function') {
        this.file.data.onClick(button);
      }
      if (this.file.data.autoClose) {
        closeWindow(this.wmId);
      }
    },
  },
  style({ className }) {
    return [
      className('dialog', {
        display: 'flex',
        flexDirection: 'column',
        background: rgba(244, 1),
        '& > .body': {
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'row',
          '& > .icon': {
            '&, & > img': {
              width: '64px',
            },
            padding: '10px',
            marginRight: '3px',
          },
          '& > .content': {
            flexGrow: 1,
            padding: '20px',
          },
        },
        '& > .buttons': {
          display: 'flex',
          justifyContent: 'flex-end',
          borderTop: `solid ${rgba(0, 0.1)} 1px`,
          '& > button': {
            padding: '8px 15px',
            minWidth: '60px',
            margin: '10px 0',
            marginRight: '10px',
            border: `solid ${rgba(0, 0.2)} 1px`,
            borderRadius: '3px',
            background: `linear-gradient(180deg,
              ${rgba(250, 1)} 0%,
              ${rgba(220, 1)} 100%
            )`,
            '&:hover, &:focus': {
              background: `linear-gradient(180deg,
                ${rgba(255, 1)} 0%,
                ${rgba(230, 1)} 100%
              )`,
            },
            '&:active': {
              background: `linear-gradient(180deg,
                ${rgba(230, 1)} 0%,
                ${rgba(250, 1)} 100%
              )`,
            },
          },
        },
      }),
    ];
  },
};
</script>
