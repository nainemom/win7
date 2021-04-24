<template>
  <div :class="$style.myComputer" class="no-border">
    <div :class="$style.pathBar">
      <span class="back" :class="localPath.length === 0 ? 'disabled' : ''" @click="back" />
      <div class="path">{{ pathBar }}</div>
      <input class="search" :placeholder="searchPlaceholder" v-model="searchString">
    </div>
    <div :class="$style.content">
      <File v-for="(file, index) in dirFiles" :key="file.name + index" :file="file" dark-text @click="click" />
    </div>
  </div>
</template>

<script>
import icon from '/src/assets/icons/my-computer.png';
import folderIcon from '/src/assets/icons/folder.png';
import driveIcon from '/src/assets/icons/drive.png';
import File from '/src/components/File.vue';
import { rgba } from '/src/styles/utils';
import goPrevious from '/src/assets/icons/go-previous.svg';

export default {
  appConfig: {
    icon: () => icon,
    fileIcon: (file) => {
      if (file.name.endsWith(':')) {
        return driveIcon;
      }
      return folderIcon;
    },
    canHandle: (file) => {
      if (file.type === 'directory') {
        return true;
      }
    },
    windowConfig: () => ({
      width: '600px',
      height: '500px',
    }),
  },
  inject: ['$fs'],
  props: {
    path: Array,
    search: String,
  },
  components: {
    File,
  },
  data() {
    let localPath = this.path || [];
    if (localPath.join('\\') === 'C:\\Windows\\Explorer.dll') {
      localPath = [];
    }
    return {
      localPath,
      searchString: (this.search || ''),
    };
  },
  computed: {
    pathBar() {
      return this.localPath.join('\\') || 'My Computer';
    },
    searchPlaceholder() {
      return `Search ${this.localPath.length ? this.localPath[this.localPath.length - 1] : 'My Computer'}`;
    },
    dirFiles() {
      if (this.searchString) {
        return this.$fs.searchFiles(this.searchString, this.localPath, true);
      }
      return this.$fs.resolvePath(this.localPath).files;
    },
  },
  methods: {
    click(file) {
      const resolvedFile = this.$fs.resolveFile(file);
      while (resolvedFile.type === 'directory') {
        this.localPath.push(resolvedFile.name);
        return true;
      }
      return false;
    },
    back() {
      if (this.localPath.length) {
        this.localPath.splice(this.localPath.length - 1);
      }
    },
  },
  style({ className }){
    return [
      className('myComputer', {
        display: 'flex',
        flexDirection: 'column',
      }),
      className('pathBar', {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        marginBottom: '6px',
        '& > .back': {
          backgroundImage: `url("${goPrevious}")`,
          width: '30px',
          height: '30px',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          cursor: 'pointer',
          marginRight: '5px',
          transition: 'filter 0.1s',
          '&:not(.disabled):hover, &:not(.disabled):focus': {
            filter: 'brightness(1.2)'
          },
          '&:not(.disabled):active': {
            filter: 'brightness(0.8)'
          },
          '&.disabled': {
            filter: 'grayscale(1)',
          }
        },
        '& > .path, & > .search': {
          height: '24px',
          lineHeight: '24px',
          padding: '0 5px',
          fontSize: '15px',
          border: `solid 1px ${rgba(1, 0.5)}`,
          background: rgba(255, 1),
          borderRadius: '2px',
        },
        '& > .path': {
          flexGrow: 1,
          color: rgba(0, 1),
          marginRight: '5px',
        }
      }),
      className('content', {
        background: rgba(255, 1),
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        alignContent: 'flex-start',
      }),
    ];
  },
}
</script>
