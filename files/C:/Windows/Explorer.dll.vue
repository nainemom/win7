<template>
  <div
    :class="$style.myComputer"
    class="no-border"
  >
    <div :class="$style.pathBar">
      <span
        class="back"
        :class="path.length === 0 ? 'disabled' : ''"
        @click="back"
      />
      <div class="path">
        {{ pathBar }}
      </div>
      <input
        v-model="search"
        class="search"
        :placeholder="searchPlaceholder"
      >
    </div>
    <FilesContainer
      :class="$style.content"
      v-bind="filesContainerProps"
      :file-props="{ darkText: true, onClick: click }"
    />
  </div>
</template>

<script>
import NavigateSound from '../../../src/assets/sounds/navigate.wav';
import icon from '../../../src/assets/icons/my-computer.png';
import folderIcon from '../../../src/assets/icons/folder.png';
import driveIcon from '../../../src/assets/icons/drive.png';
import { rgba } from '../../../src/styles/utils';
import backIcon from '../../../src/assets/icons/back.png';
import FilesContainer from '../../../src/components/FilesContainer.vue';
import { props, inject } from '../../../src/utils/vue';

const calcIcon = (file) => {
  if (!file) {
    return icon;
  }
  return file.path.endsWith(':') ? driveIcon : folderIcon;
};

export default {
  canHandle: (file) => file.type === 'directory',
  windowProperties: (file) => ({
    icon: calcIcon(file),
    width: 600,
    height: 500,
    title: !file ? 'Computer' : file.path,
  }),
  ...inject('$fs', '$wm', '$snd'),
  ...props({
    file: props.obj(null),
  }),
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
          files: this.$fs.searchFiles(
            this.path,
            (file) => this.$fs.getPathName(file.path).includes(this.search),
            true,
          ),
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
        this.$snd.playSound(NavigateSound);
        this.path = theFile.path;
        return true;
      }
      return false;
    },
    back() {
      this.$snd.playSound(NavigateSound);
      if (this.path.includes('/')) {
        this.path = this.path.substr(0, this.path.lastIndexOf('/'));
      } else {
        this.path = '';
      }
    },
  },
  style({ className }) {
    return [
      className('myComputer', {
        display: 'flex',
        flexDirection: 'column',
      }),
      className('pathBar', {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'nowrap',
        marginBottom: '6px',
        '& > .back': {
          backgroundImage: `url("${backIcon}")`,
          width: '32px',
          height: '32px',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain',
          cursor: 'pointer',
          marginRight: '5px',
          transition: 'filter 0.1s',
          '&:not(.disabled):hover, &:not(.disabled):focus': {
            filter: 'brightness(1.2)',
          },
          '&:not(.disabled):active': {
            filter: 'brightness(0.8)',
          },
          '&.disabled': {
            filter: 'grayscale(1)',
          },
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
        },
      }),
      className('content', {
        background: rgba(255, 1),
        flexGrow: 1,
        position: 'relative',
      }),
    ];
  },
};
</script>
