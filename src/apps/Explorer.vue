<template>
  <div :class="$style.myComputer" class="no-border">
    <div :class="$style.pathBar">
      <span class="back" :class="path.length === 0 ? 'disabled' : ''" @click="back" />
      <div class="path">{{ pathBar }}</div>
      <input class="search" :placeholder="searchPlaceholder" v-model="search">
    </div>
    <FilesContainer :class="$style.content" v-bind="filesContainerProps" :file-props="{ darkText: true, onClick: click }" />
      <!-- <File v-for="file in dirFiles" :key="file.path" :file="file" dark-text @click="click" /> -->
    <!-- </div> -->
  </div>
</template>

<script>
import icon from '/src/assets/icons/my-computer.png';
import folderIcon from '/src/assets/icons/folder.png';
import driveIcon from '/src/assets/icons/drive.png';
import { rgba } from '/src/styles/utils';
import goPrevious from '/src/assets/icons/go-previous.svg';
import FilesContainer from '/src/components/FilesContainer.vue';


export default {
  canHandle: (file) => file.type === 'directory',
  windowProperties: (file) => ({
    icon: !file ? icon : (file.path.endsWith(':') ? driveIcon : folderIcon),
    width: 600,
    height: 500,
    title: !file ? 'Computer' : file.path,
  }),
  inject: ['$fs', '$wm', '$os'],
  props: ['file'],
  components: {
    FilesContainer,
  },
  data() {
    const hasFile = this.file && this.file.path;
    return {
      path: hasFile ? this.file.path : '',
      search: hasFile ? this.file.data.search : '',
    };
  },
  computed: {
    pathBar() {
      return this.path.split('/').join('\\') || 'Computer';
    },
    searchPlaceholder() {
      return `Search in ${this.$fs.getPathName(this.path) || 'Computer'}`;
    },
    filesContainerProps() {
      if (this.search) {
        return {
          files: this.$fs.searchFiles(this.path, (file) => this.$fs.getPathName(file.path).includes(this.search), true),
        };
      }
      return {
        path: this.path,
      };
    },
  },
  methods: {
    click(file) {
      const theFile = this.$fs.resolveFileSource(file);
      if (theFile.type === 'directory') {
        this.path = theFile.path;
        return true;
      }
      return false;
    },
    back() {
      if (this.path.includes('/')) {
        this.path = this.path.substr(0, this.path.lastIndexOf('/'));
      } else {
        this.path = '';
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
        position: 'relative',
      }),
    ];
  },
}
</script>
