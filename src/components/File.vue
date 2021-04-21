<template>
  <div :class="$style.desktopIcon" @dblclick="click">
    <img :src="icon" />
    <div> {{ file.name }} </div>
  </div>
</template>

<script>
import { rgba } from '/src/styles/utils';


export default {
  props: ['file', 'onClick'],
  inject: ['$wm', '$fs'],
  methods: {
    click() {
      if (this.onClick && this.onClick(this.resolvedFile) === true) {
        return;
      }
      this.$wm.openWindow(this.resolvedFile);
    },
  },
  computed: {
    resolvedFile() {
      return this.$fs.resolveFile(this.file);
    },
    runner() {
      return this.$fs.resolveFileRunner(this.resolvedFile);
    },
    icon() {
      return this.runner.component.appConfig[this.resolvedFile.type === 'app' ? 'icon' : 'fileIcon'](this.resolvedFile);
    },
  },
  style({ className }) {
    return [
      className('desktopIcon', {
        width: '96px',
        height: 'auto',
        fontSize: '15px',
        color: rgba(255, 1),
        textShadow: new Array(2).fill(`0 0 5px ${rgba(0, 0.8)}`).join(','),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '15px',
        padding: '2px',
        textAlign: 'center',
        '& > img': {
          width: '55px',
          marginBottom: '14px',
          filter: `drop-shadow(2px 4px 6px ${rgba(0, 0.5)})`,
        },
        '& > div':{
          width: '100%',
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
      }),
    ];
  },
};
</script>
