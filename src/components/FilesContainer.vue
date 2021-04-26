<template>
  <div :class="$style.filesContainer" @contextmenu.capture="openContextMenu">
    <File v-for="file in dirFiles" :ref="addFileToRefs" :key="file.path" :file="file" v-bind="fileProps" />
    <div v-if="selecting" ref="selection" :class="$style.selection" />
  </div>
</template>

<script>
import { rgba, px } from '/src/styles/utils';
import { props, provideAs, inject } from '/src/utils/vue';
import { offsetTo } from '/src/utils/utils';


import File from '/src/components/File.vue';
import Swipe from '/src/utils/Swipe';

const fixSelectionPosition = (selection) => {
    if (!selection) {
      return null;
    }
    const ret = {};
    if (selection.width < 0) {
      ret.left = selection.left + selection.width;
      ret.width = Math.abs(selection.width);
    } else {
      ret.left = selection.left;
      ret.width = selection.width;
    }
    if (selection.height < 0) {
      ret.top = selection.top + selection.height;
      ret.height = Math.abs(selection.height);
    } else {
      ret.top = selection.top;
      ret.height = selection.height;
    }
    return ret;
}

export default {
  ...inject('$os', '$fs'),
  components: {
    File,
  },
  ...props({
    files: props.arr([]),
    path: props.str(null),
    fileProps: props.obj(),
    direction: props.oneOf(['row', 'column'], 'row'),
  }),
  ...provideAs('$filesContainer'),
  data() {
    return {
      mover: null,
      selecting: false,
      fileRefs: [],
    }
  },
  computed: {
    staticPath() {
      return this.path !== null;
    },
    dirFiles() {
      if (this.staticPath) {
        return this.$fs.getDirectoryFiles(this.path);
      }
      return this.files;
    },
    selectionCalculated() {
      const { selection } = this;
      return fixSelectionPosition(selection);
    },
    selectionStyle() {
      const ret = {};
      Object.keys(this.selectionCalculated || {}).forEach((key) => {
        ret[key] = px(this.selectionCalculated[key]);
      });
      return ret;
    },
  },
  mounted() {
    this.mover = Swipe(this.$el);
    this.mover.before(this.selectStart);
    this.mover.while(this.whileSelect);
    this.mover.after(this.selectEnd);
    this.mover.on();
  },
  beforeUnmount() {
    this.mover && this.mover.off();
  },
  methods: {
    getSelectedFiles() {
      return this.fileRefs.filter((file) => file.selected);
    },
    openContextMenu(e) {
      const selectedFiles = this.getSelectedFiles();
      if (selectedFiles.length === 0) {
        this.$os.openContextMenu(e, [
          'Refresh',
          '',
          ...(this.staticPath ? ['Create New Folder'] : []),
        ], (item) => {
          if (item === 'Refresh') {
            this.$el.classList.add('refreshing');
            this.$nextTick(() => {
              setTimeout(() => {
                this.$el.classList.remove('refreshing');
              }, 100);
            });
          } else if (item === 'Create New Folder') {
            this.$fs.createNewFolder(this.path);
          };
        });
      } else {
        this.$os.openContextMenu(e, [
          'Open',
          '',
          'Delete',
        ], (item) => {
          if (item === 'Open') {
            selectedFiles.forEach((file) => file.click(null));
          } else if (item === 'Delete') {
            selectedFiles.forEach((file) => this.$fs.deleteFileByPath(file.file.path));
            ;
          }
        });
      }
    },
    selectStart(pos) {
      const elRect = offsetTo(this.$el, document.body);
      window.rectangeSelection = {
        left: pos.x - elRect.left,
        top: pos.y - elRect.top,
        width: 0,
        height: 0,
      };
      this.$el.style.overflow = 'hidden';
      this.selecting = true;
    },
    whileSelect(_pos, pos) {
      if (!window.rectangeSelection) return;
      const selection = fixSelectionPosition({
        ...window.rectangeSelection,
        width: pos.x,
        height: pos.y,
      });
      Object.keys(selection|| {}).forEach((key) => {
        this.$refs.selection.style[key] = px(selection[key]);
      });
    },
    selectEnd(_pos, pos) {
      if (pos.x === pos.y === 0 || !window.rectangeSelection) return;
      const selectionPos = fixSelectionPosition({
        ...window.rectangeSelection,
        width: pos.x,
        height: pos.y,
      });

      const inRange = (fp, sp) => (
        ((fp.left > sp.left && fp.left+fp.width < sp.left+sp.width) || (fp.left+fp.width > sp.left && fp.left < sp.left+sp.width)) &&
        ((fp.top > sp.top && fp.top+fp.height < sp.top+sp.height) || (fp.top+fp.height > sp.top && fp.top < sp.top+sp.height))
      );
      this.fileRefs.forEach((file) => {
        const el = file.$el;
        const filePos = {
          width: el.offsetWidth,
          height: el.offsetHeight,
          left: el.offsetLeft,
          top: el.offsetTop,
        };
        file.selected = inRange(filePos, selectionPos);
      });
      this.selecting = false;
      this.$el.style.overflow = null;
    },
    unselectAll() {
      this.fileRefs.forEach((file) => {
        file.selected = false;
      });
    },
    addFileToRefs(el) {
      el && this.fileRefs.push(el);
    },
  },
  beforeUpdate() {
    this.fileRefs = []
  },
  style({ className }) {
    return [
      className('filesContainer', {
        position: 'relative',
        flexGrow: 1,
        display: 'flex',
        flexDirection: this.direction,
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        alignContent: 'flex-start',
        width: '100%',
        height: '100%',
        overflow: 'auto',
        '&.refreshing': {
          '& > *': {
            display: 'none',
          },
        },
      }),
      className('selection', {
        // zIndex: 999999,
        background: rgba([26, 86, 148], 0.4),
        border: `solid 1px ${rgba([26, 86, 148], 0.6)}`,
        position: 'absolute',
      }),
    ];
  },
}
</script>
