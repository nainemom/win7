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
import { rgba } from '@/styles/utils';
import FilesContainer from '@/components/FilesContainer.vue';
import { props } from '@/utils/vue';
import {
  resolveFileByPath,
  getPathName,
  searchFiles,
  resolveFileSource,
} from '@/services/fs';
import { playBackgroundSound } from '@/services/snd';

const calcIcon = (file) => {
  if (!file) {
    return resolveFileByPath('C:/Windows/system/icons/my-computer.png');
  }
  return resolveFileByPath(`C:/Windows/system/icons/${file.path.endsWith(':') ? 'drive' : 'folder'}.png`);
};

export default {
  canHandle: (file) => !file || file.type === 'directory',
  metaData: (file) => ({
    icon: calcIcon(file),
    width: 600,
    height: 500,
    title: !file ? 'Computer' : file.path,
  }),
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
      search: hasFile ? this.file.extraData?.search : '',
    };
  },
  computed: {
    pathBar() {
      return this.path || 'Computer';
    },
    searchPlaceholder() {
      return `Search in ${getPathName(this.path) || 'Computer'}`;
    },
    navigateSound() {
      return resolveFileByPath('C:/Windows/system/sounds/navigate.mp3');
    },
    filesContainerProps() {
      if (this.search) {
        return {
          files: searchFiles(
            this.path,
            (file) => getPathName(file.path).toLowerCase().includes(this.search.toLowerCase()),
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
      const theFile = resolveFileSource(file);
      if (theFile.type === 'directory') {
        playBackgroundSound(this.navigateSound);
        this.path = theFile.path;
        return true;
      }
      return false;
    },
    back() {
      playBackgroundSound(this.navigateSound);
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
          backgroundImage: `url("${resolveFileByPath('C:/Windows/system/icons/back.png').data}")`,
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
          border: `solid 1px ${rgba(0, 0.5)}`,
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
