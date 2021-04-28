<template>
  <div :class="[$style.desktopIcon, selected && 'selected', isCutting && 'cutting', renaming && 'renaming']" @dblclick="click" @click="click" @pointerdown="selectIf" draggable="true">
    <div class="icons" v-if="!noIcon">
      <img class="icon" :src="icon" draggable="false" />
      <img v-if="shortcutIcon" class="shortcut" :src="shortcutIcon" draggable="false" />
    </div>
    <div class="name" v-if="!renaming"> {{ name }} </div>
    <input class="name" v-if="renaming" ref="renameInput" v-model="renaming" @keypress.enter="renameDone" @blur="renameDone(false)"/>
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
  ...inject('$wm', '$fs', '$filesContainer'),
  data() {
    return {
      selected: false,
      renaming: false,
    };
  },
  methods: {
    select(e) {
      if (this.$filesContainer) {
        this.$filesContainer.unselectAll();
        this.selected = true;
      }
    },
    selectIf() {
      if (this.$filesContainer) {
        const selectedFiles = this.$filesContainer.getSelectedFiles();
        if (selectedFiles.length === 0 || selectedFiles.findIndex(file => file.file.path === this.file.path) === -1) {
          this.select();
        }
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
    startRename() {
      this.renaming = this.name;
      this.$nextTick(() => {
        this.$refs.renameInput.select();
      });
    },
    renameDone(isOk) {
      if (isOk) {
        this.$fs.moveFileByPath(this.file.path, `${this.$fs.getPathDir(this.file.path)}/${this.renaming}`);
      }
      this.renaming = false;
    }
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
    },
    isCutting() {
      return this.$wm.markedFiles.cutList.includes(this.file.path);
    },
    isCopying() {
      return this.$wm.markedFiles.copyList.includes(this.file.path);
    }
  },
  style({ className }) {
    return [
      className('desktopIcon', {
        height: 'auto',
        fontSize: '15px',
        border: 'solid 1px transparent',
        zIndex: 1,
        '&.cutting': {
          opacity: 0.8,
        },
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
        display: 'flex',
        ...(this.block ? {
          flexDirection: 'row',
          flexGrow: 1,
        } : {
          flexDirection: 'column',
          width: '120px',
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
          ...(this.block ? {
            textAlign: 'left',
          } : {
            textAlign: 'center',
          }),
          border: 'none',
          background: 'transparent',
          ...(this.darkText ? {
            color: `${rgba(0, 1)} !important`,
          } : {
            color: rgba(255, 1),
          }),
          ...(this.shadow && {
            textShadow: new Array(2).fill(`0 0 3px ${rgba(0, 0.8)}`).join(','),
          }),
        },
        '&.renaming > .name': {
          overflow: 'visible',
          width: 'auto',
          maxWidth: 'auto',
        }
      }),
    ];
  },
};
</script>
