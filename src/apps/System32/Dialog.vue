<template>
  <div :class="$style.dialog">
    <div class="body">
      <div class="icon">
        <img :src="icon">
      </div>
      <div class="content">
        {{ content }}
      </div>
    </div>
    <div class="buttons">
      <button
        v-for="button in buttons"
        :key="button"
        @click="emitClick(button)"
      >
        {{ button }}
      </button>
    </div>
  </div>
</template>

<script>
import ErrorIcon from '../../assets/icons/error.png?url';
import InfoIcon from '../../assets/icons/info.png?url';
import WarningIcon from '../../assets/icons/warning.png?url';
import QuestionIcon from '../../assets/icons/question.png?url';
import ErrorSound from '../../assets/sounds/error.wav?url';
import DingSound from '../../assets/sounds/ding.wav?url';
import { props, inject } from '../../utils/vue';
import { rgba } from '../../styles/utils';

const typeToIconMap = {
  error: ErrorIcon,
  info: InfoIcon,
  warning: WarningIcon,
  question: QuestionIcon,
};

const typeToSoundMap = {
  error: ErrorSound,
  info: DingSound,
  warning: DingSound,
  question: DingSound,
};

export default {
  ...inject('$fs', '$wm', '$snd'),
  ...props({
    wmId: props.any(),
    type:{},
    content:{},
    buttons:{},
    title:{},
    defaultInput:{},
    autoClose:{},
    onClick:{},
  }),
  computed: {
    icon() {
      return typeToIconMap[this.type];
    },
    sound() {
      return typeToSoundMap[this.type];
    },
  },
  mounted() {
    this.$snd.playSound(this.sound);
  },
  methods: {
    emitClick(button) {
      if (typeof this.onClick === 'function') {
        this.onClick(button);
      }
      if (this.autoClose) {
        this.$wm.closeWindow(this.wmId);
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
