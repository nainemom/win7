<template>
  <div :class="$style.desktopIcon" @dblclick="click">
    <img :src="icon" />
    <div> {{ target.name }} </div>
  </div>
</template>

<script>
import { rgba } from '/src/styles/utils';
import { getFile } from '/src/services/files';


export default {
  props: ['file', 'onClick'],
  inject: ['$os'],
  methods: {
    click() {
      if (this.onClick && this.onClick(this.target) === true) {
        return;
      }
      console.log(this.target);
      this.$os.openWindow(this.target);
    },
  },
  computed: {
    target() {
      let target = this.file;
      while (target.type === 'shortcut') {
        target = target.target();
      }
      return target;
    },
    icon() {
      if (this.target.app) {
        return this.target.app().config.fileIcon;
      }
      return this.target.config.icon;
    },
  },
  style({ className }) {
    return [
      className('desktopIcon', {
        width: '96px',
        height: 'auto',
        fontFamily: 'sans-serif',
        fontSize: '15px',
        color: rgba(255, 1),
        textShadow: new Array(4).fill(`0 0 5px ${rgba(0, 0.4)}`).join(','),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '15px 10px',
        '& > img': {
          width: '75%',
          marginBottom: '4px',
          filter: `drop-shadow(2px 4px 6px ${rgba(0, 0.5)})`,
        }
      }),
    ];
  },
};
</script>
