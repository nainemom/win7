<template>
  <div
    :class="$style.filesContainer"
    @contextmenu="openContextMenu"
  >
    <File
      v-for="file in dirFiles"
      :ref="addFileToRefs"
      :key="file.path"
      :file="file"
      v-bind="fileProps"
    />
    <div
      v-if="selecting"
      ref="selection"
      :class="$style.selection"
    />
  </div>
</template>

<script>
import { rgba, px } from '../styles/utils';
import { props, provideAs, inject } from '../utils/vue';
import { offsetTo, asyncEach } from '../utils/utils';
import swipe from '../utils/swipe';
import { drag, drop } from '../utils/dragndrop';
import File from './File.vue';

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
};

export default {
  ...inject('$wm', '$fs'),
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
      dragger: null,
      dropper: null,
      selecting: false,
      fileRefs: [],
      selectionRectangle: null,
    };
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
  },
  mounted() {
    this.mover = swipe(
      this.$el,
      this.selectStart,
      this.whileSelect,
      this.selectEnd,
    );
    this.droper = drop(this.$el, this.onDrop);
    this.dragger = drag(this.$el, this.onDrag);
  },
  beforeUnmount() {
    if (this.mover) {
      this.mover.stop();
    }
    if (this.droper) {
      this.droper.stop();
    }
    if (this.dragger) {
      this.dragger.stop();
    }
  },
  beforeUpdate() {
    this.fileRefs = [];
  },
  methods: {
    onDrag(e) {
      const isOnFile = this.isEventOnFile(e);
      if (isOnFile) {
        if (this.mover) {
          this.mover.cancelMove();
        }
        this.$nextTick(() => {
          this.selecting = false;
          this.$el.style.overflow = null;
        });
        return this.getSelectedFiles().map((file) => file.file.path);
      }
      return false;
    },
    onDrop(data) {
      this.copyOrMoveFilesHere('move', data);
    },
    getSelectedFiles() {
      return this.fileRefs.filter((file) => file.selected);
    },
    isEventOnFile(e) {
      const selectedFiles = this.getSelectedFiles();
      return selectedFiles.some((file) => file.$el.contains(e.target));
    },
    openContextMenu(e) {
      const selectedFiles = this.getSelectedFiles();
      const isOnFile = this.isEventOnFile(e);
      let contextMenuItems = [];
      if (!isOnFile) {
        this.unselectAll();
        contextMenuItems = [
          ...contextMenuItems,
          'Refresh',
          ...(this.staticPath ? ['Create New Folder', 'Create New Text File'] : []),
          ...(this.staticPath && (this.$wm.markedFiles.copyList.length || this.$wm.markedFiles.cutList.length) ? ['Paste'] : []),
        ];
      } else {
        contextMenuItems = [
          ...contextMenuItems,
          'Open',
          'Delete',
          'Cut',
          'Copy',
        ];
        if (selectedFiles.length === 1) {
          contextMenuItems = [
            ...contextMenuItems,
            'Rename',
          ];
        }
      }

      this.$wm.openContextMenu(e, contextMenuItems, (item) => {
        if (item === 'Open') {
          selectedFiles.forEach((file) => file.click(null));
        } else if (item === 'Delete') {
          selectedFiles.forEach((file) => this.$fs.deleteFileByPath(file.file.path));
        } else if (item === 'Refresh') {
          this.$el.classList.add('refreshing');
          this.$nextTick(() => {
            setTimeout(() => {
              this.$el.classList.remove('refreshing');
            }, 100);
          });
        } else if (item === 'Create New Folder') {
          this.$fs.createNewFolder(this.path);
        } else if (item === 'Create New Text File') {
          const dst = `${this.path}/Text File ${Date.now()}.txt`;
          this.$fs.createNewFile(this.$fs.fileObject(dst, 'text'));
        } else if (item === 'Rename') {
          selectedFiles.forEach((file) => file.startRename());
        } else if (item === 'Cut') {
          selectedFiles.forEach((file) => this.$wm.markFileForCut(file.file));
        } else if (item === 'Copy') {
          selectedFiles.forEach((file) => this.$wm.markFileForCopy(file.file));
        } else if (item === 'Paste') {
          Promise.all([
            this.copyOrMoveFilesHere('copy', this.$wm.markedFiles.copyList),
            this.copyOrMoveFilesHere('move', this.$wm.markedFiles.cutList),
          ]).then(() => {
            this.$wm.unmarkFiles();
          });
        }
      });
    },
    selectStart(pos) {
      const elRect = offsetTo(this.$el, document.body);
      this.selectionRectangle = {
        left: pos.left - elRect.left,
        top: pos.top - elRect.top,
        width: 0,
        height: 0,
      };
      this.selecting = true;
    },
    whileSelect(pos) {
      this.$el.style.overflow = 'hidden';
      const selection = fixSelectionPosition({
        ...this.selectionRectangle,
        width: pos.left,
        height: pos.top,
      });
      Object.keys(selection || {}).forEach((key) => {
        this.$refs.selection.style[key] = px(selection[key]);
      });
    },
    selectEnd(pos) {
      this.$el.style.overflow = null;
      const selectionPos = fixSelectionPosition({
        ...this.selectionRectangle,
        width: pos.left,
        height: pos.top,
      });

      const inRange = (fp, sp) => (
        (
          (fp.left > sp.left && fp.left + fp.width < sp.left + sp.width)
          || (fp.left + fp.width > sp.left && fp.left < sp.left + sp.width)
        )
        && (
          (fp.top > sp.top && fp.top + fp.height < sp.top + sp.height)
          || (fp.top + fp.height > sp.top && fp.top < sp.top + sp.height)
        )
      );
      this.fileRefs.forEach((file) => {
        const el = file.$el;
        const filePos = {
          width: el.offsetWidth,
          height: el.offsetHeight,
          left: el.offsetLeft,
          top: el.offsetTop,
        };
        // eslint-disable-next-line no-param-reassign
        file.selected = inRange(filePos, selectionPos);
      });
      this.selecting = false;
    },
    unselectAll() {
      this.fileRefs.forEach((file) => {
        // eslint-disable-next-line no-param-reassign
        file.selected = false;
      });
    },
    async copyOrMoveFilesHere(action, listOfFiles) {
      const doActionOnSingleFile = (filePath) => new Promise((resolve, reject) => {
        const newPath = `${this.path}/${this.$fs.getPathName(filePath)}`;
        if (filePath !== newPath) {
          if (this.$fs.isPathExists(newPath)) {
            this.$wm.openDialog({
              type: 'warning',
              title: 'File Already Exists',
              content: `The '${newPath}' is already exists. Do you want to override?`,
              buttons: ['Cancel All', 'No', 'Yes'],
              autoClose: true,
            }).then((userAnswer) => {
              if (userAnswer === 'No') {
                resolve();
              } else if (userAnswer === 'Cancel All') {
                reject(new Error('canceled'));
              }
            });
          }
          this.$fs[`${action}FileByPath`](filePath, newPath, true);
        }
      });
      asyncEach(listOfFiles, doActionOnSingleFile);
    },
    addFileToRefs(el) {
      if (el) {
        this.fileRefs.push(el);
      }
    },
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
};
</script>
