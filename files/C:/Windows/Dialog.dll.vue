<template>
  <div :class="$style.dialog">
    <div class="body">
      <div class="icon">
        <img :src="icon" />
      </div>
      <div class="content"> {{ file.data.content }} </div>
    </div>
    <div class="buttons">
      <button v-for="button in file.data.buttons" :key="button" @click="emitClick(button)"> {{ button }} </button>
    </div>
  </div>
</template>

<script>
import ErrorIcon from '/src/assets/icons/error.png';
import InfoIcon from '/src/assets/icons/info.png';
import WarningIcon from '/src/assets/icons/warning.png';
import QuestionIcon from '/src/assets/icons/question.png';
import ErrorSound from '/src/assets/sounds/error.wav';
import DingSound from '/src/assets/sounds/ding.wav';

import { rgba } from '/src/styles/utils';

const typeToIconMap = {
  error: ErrorIcon,
  info: InfoIcon,
  warning: WarningIcon,
  question: QuestionIcon,
}

const typeToSoundMap = {
  error: ErrorSound,
  info: DingSound,
  warning: DingSound,
  question: DingSound,
}


export default {
  canHandle: (file) => file.type === 'dialog',
  windowProperties: (file) => ({
    icon: file && file.data.type ? typeToIconMap[file.data.type] : WarningIcon,
    width: 580,
    height: 200,
    maximizable: false,
    title: file && file.data.title ? file.data.title : 'Dialog',
  }),
  inject: ['$fs', '$wm', '$snd'],
  props: ['file', 'wmId'],
  computed: {
    dialogData() {
      return {
        ...(this.file  && this.file.data)
      };
    },
    icon() {
      return typeToIconMap[this.dialogData.type];
    },
    sound() {
      return typeToSoundMap[this.dialogData.type];
    },
  },
  methods: {
    emitClick(button) {
      if (typeof this.dialogData.onClick === 'function') {
        this.dialogData.onClick(button);
      }
      if (this.dialogData.autoClose) {
        this.$wm.closeWindow(this.wmId);
      }
    }
  },
  mounted() {
    this.$snd.playSound(this.sound);
  },
  style({ className }){
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
          }
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
            }
          },
        }
      }),
    ];
  },
}
</script>
