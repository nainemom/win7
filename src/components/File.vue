<template>
  <div :class="$style.desktopIcon" @dblclick.capture="click" @click.capture="click" >
    <img v-if="!noIcon" :src="icon" />
    <div> {{ file.name }} </div>
  </div>
</template>

<script>
import { rgba } from '/src/styles/utils';

export default {
  props: {
    file: Object,
    darkText: Boolean,
    noIcon: Boolean,
    shadow: Boolean,
    block: Boolean,
    singleClick: Boolean,
    onClick: Function,
  },
  inject: ['$wm', '$fs'],
  methods: {
    click(e) {
      if (e.type === 'click' && !this.singleClick) return;
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
        height: 'auto',
        fontSize: '15px',
        ...(this.darkText ? {
          color: `${rgba(0, 1)} !important`,
        } : {
          color: rgba(255, 1),
        }),
        ...(this.shadow && {
          textShadow: new Array(2).fill(`0 0 3px ${rgba(0, 0.8)}`).join(','),
        }),
        display: 'flex',
        ...(this.block ? {
          flexDirection: 'row',
          flexGrow: 1,
          textAlign: 'left',
        } : {
          flexDirection: 'column',
          width: '120px',
          textAlign: 'center',
        }),
        alignItems: 'center',
        justifyContent: 'center',
        padding: '15px',
        // padding: '2px',
        '& > img': {
          ...(this.block ? {
            height: '34px',
            marginRight: '14px',
          } : {
            width: '55px',
            marginBottom: '14px',
          }),
          filter: `drop-shadow(2px 4px 6px ${rgba(0, 0.5)})`,
          borderRadius: '9px',
        },
        '& > div':{
          width: '100%',
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          padding: '3px',
        },
      }),
    ];
  },
};
</script>
