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
      :key="path"
      :class="$style.content"
      v-bind="filesContainerProps"
      :file-props="{ darkText: true, onClick: click,}"
    />
  </div>
</template>

<script>
import NavigateSound from '../../assets/sounds/navigate.wav?url';
import { rgba } from '../../styles/utils';
import backIcon from '../../assets/icons/back.png?url';
import FilesContainer from '../../components/FilesContainer.vue';
import { props, inject } from '../../utils/vue';
import { getFileType } from '../../services/apps';

export default {
  ...inject('$fs', '$wm', '$snd'),
  ...props({
    filePath: props.obj(null),
  }),
  components: {
    FilesContainer,
  },
  data() {
    const hasFile = this.filePath;
    return {
      path: hasFile ? this.filePath : '/',
      search: hasFile ? {} /*this.file.data.search*/ : '',
    };
  },
  computed: {
    pathBar() {
      return this.path.split('/')
        .join('\\') || 'Computer';
    },
    searchPlaceholder() {
      return `Search in ${this.$fs.getPathName(this.path) || 'Computer'}`;
    },
    filesContainerProps() {
      //todo search
      /*if (this.search) {
        return {
          files: this.$fs.searchFiles(
            this.path,
            (file) => this.$fs
              .getPathName(file.path)
              .toLowerCase()
              .includes(this.search.toLowerCase()),
            true,
          ),
        };
      }*/
      return {
        path: this.path || '/',
      };
    },
  },
  methods: {
    click(filePath) {
      const fileType = getFileType(filePath);
      if (fileType === 'directory') {
        this.$snd.playSound(NavigateSound);
        this.path = filePath;
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
