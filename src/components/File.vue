<template>
  <div :class="[$style.desktopIcon, selected && 'selected']" @dblclick="click" @click="click" @mousedown.capture="select" @touchstart.capture="select">
    <div class="icons" v-if="!noIcon">
      <img class="icon" :src="icon" />
      <img v-if="shortcutIcon" class="shortcut" :src="shortcutIcon" />
    </div>
    <div class="name"> {{ name }} </div>
  </div>
</template>

<script>
import { inject, props } from '/src/utils/vue';
import ShortcutIcon from '/src/assets/icons/shortcut.png';
import { rgba } from '/src/styles/utils';

export default {
  ...props({
    file: props.obj(),
    darkText: props.bool(),
    noIcon: props.bool(),
    shadow: props.bool(),
    block: props.bool(),
    singleClick: props.bool(),
    onClick: props.func(null),
  }),
  ...inject('$wm', '$fs', '$os', '$filesContainer'),
  data() {
    return {
      selected: false,
    };
  },
  methods: {
    select(e) {
      if (this.$filesContainer) {
        this.$filesContainer.unselectAll();
        this.selected = true;
      }
    },
    click(e) {
      this.select();
      if (e && e.type === 'click' && !this.singleClick) return;
      if (this.onClick && this.onClick(this.file) === true) {
        return;
      }
      this.$wm.openFile(this.file);
    },
  },
  computed: {
    icon() {
      return this.$wm.calculateFileWindowProperties(this.file).icon;
    },
    shortcutIcon() {
      return this.file.type === 'shortcut' ? ShortcutIcon : '';
    },
    name() {
      return this.$fs.getPathName(this.file.path);
    }
  },
  style({ className }) {
    return [
      className('desktopIcon', {
        height: 'auto',
        fontSize: '15px',
        border: 'solid 1px transparent',
        '&.selected': {
          background: rgba([26, 86, 148], 0.4),
          border: `solid 1px ${rgba([26, 86, 148], 0.6)}`,
        },
        '&:hover:not(.selected)': {
          border: `solid 1px ${rgba(255, 0.2)}`,
          background: `linear-gradient(180deg,
            ${rgba(250, 0.15)} 0%,
            ${rgba(200, 0.15)} 100%
          )`,
        },
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
        padding: '10px',
        margin: '5px',
        '& .icons': {
          ...(this.block ? {
            marginRight: '14px',
          } : {
            marginBottom: '14px',
          }),
          position: 'relative',
          '& > .icon': {
            ...(this.block ? {
              height: '34px',
            } : {
              width: '55px',
            }),
            borderRadius: '9px',
            filter: `drop-shadow(0 2px 2px ${rgba(0, 0.3)})`,
          },
          '& > .shortcut': {
            position: 'absolute',
            left: 0,
            bottom: 0,
            height: '36px',
            width: '36px',
          }
        },
        '& > .name':{
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
