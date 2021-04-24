<template>
  <div :class="$style.dialog">
    <div class="body">
      <div class="icon">
        <img :src="icon" />
      </div>
      <div class="content"> {{ content }} </div>
    </div>
    <div class="buttons">
      <button v-for="button in buttons" :key="button" @click="emitButtonClick(button)"> {{ button }} </button>
    </div>
  </div>
</template>

<script>
import ErrorIcon from '/src/assets/icons/error.png';
import InfoIcon from '/src/assets/icons/info.png';
import WarningIcon from '/src/assets/icons/warning.png';
import { rgba } from '/src/styles/utils';

const typeToIconMap = {
  error: ErrorIcon,
  info: InfoIcon,
  warning: WarningIcon,
}

export default {
  appConfig: {
    icon: () => ErrorIcon,
    fileIcon: (file) => {
      return typeToIconMap[file.data.type] || ErrorIcon;
    },
    canHandle: (file) => {
      if (file.type === 'dialog') {
        return true;
      }
    },
    windowConfig: (file) => ({
      width: file.data.width || '500px',
      height: file.data.height || '200px',
    }),
  },
  inject: ['$fs'],
  props: {
    type: String,
    buttons: Array,
    content: String,
    onButtonClick: Function,
  },
  computed: {
    icon() {
      return typeToIconMap[this.type] || ErrorIcon;
    },
  },
  methods: {
    emitButtonClick(button) {
      this.$emit('buttonClick', button);
    }
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
              width: '48px',
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
