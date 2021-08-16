<template>
  <div
    :class="$style.orb"
    @click.capture="showPopup"
  />
  <Popup
    v-model:visible="popup"
    :class="$style.popupStyle"
    auto-close
    dark
  >
    <div :class="$style.popup">
      <div class="left-container">
        <div class="files">
          <File
            v-for="file in leftContainerFiles"
            :key="file.path"
            :file="file"
            block
            dark-text
            single-click
          />
        </div>
        <input
          ref="searchInput"
          v-model="searchString"
          class="search"
          placeholder="Search programs and files"
        >
      </div>
      <div class="right-container">
        <File
          v-for="file in rightContainerFiles"
          :key="file.path"
          :file="file"
          block
          no-icon
          shadow
          single-click
        />
      </div>
    </div>
  </Popup>
</template>

<script>
import Popup from '../Popup.vue';
import File from '../File.vue';
import { inject } from '../../utils/vue';
import { panelSize } from '../../styles/constants';
import OrbNormal from '../../assets/orb/normal.png';
import { rgba } from '../../styles/utils';

export default {
  ...inject('$fs'),
  components: {
    Popup,
    File,
  },
  data() {
    return {
      popup: false,
      searchString: '',
      leftFiles: [],
      rightFiles: [],
    };
  },
  async created() {
    this.fetchLeftFiles();

    this.$fs.readDirectory('/C:/User/Start Menu')
      .then(files => {
        this.rightFiles = [...files];
      });
  },
  computed: {
    leftContainerFiles() {
      return this.leftFiles;
    },
    rightContainerFiles() {
      return this.rightFiles;
    },
  },
  watch: {
    searchString(n, o) {
      this.fetchLeftFiles();
    },
    popup(popup) {
      if (popup) {
        this.$nextTick(() => {
          try {
            this.$refs.searchInput.focus();
          } catch (e) {
            console.error(e);
          }
        });
      }
    },
  },
  methods: {
    showPopup() {
      this.searchString = '';
      this.popup = true;
    },
    fetchLeftFiles() {
      this.leftFiles = [];
      const {
        searchString,
        $fs
      } = this;
      if (searchString && searchString.trim().length) {
        $fs.searchInDirectory('/C:/Program Files', searchString, file => {
          this.leftFiles.push(file);
        });
      } else {
        $fs.readDirectory('/C:/Program Files')
          .then(files => {
            this.leftFiles = [...files];
          });
      }
    }
  },
  style({ className }) {
    const height = '600px';
    const searchInputHeight = '30px';
    const itemSize = `${(parseInt(panelSize, 10) - 1)}px`;

    return [
      className('popup', {
        display: 'flex',
        flexDirection: 'row',
        height,
        '& > .left-container': {
          display: 'flex',
          flexDirection: 'column',
          width: '62%',
          backgroundColor: rgba(255, 1),
          borderRadius: '4px',
          border: `solid 1px ${rgba(0, 0.4)}`,
          '& > .files': {
            flexGrow: 1,
            maxHeight: `${parseInt(height, 10) - parseInt(searchInputHeight, 10) - 20}px`,
            overflow: 'auto',
          },
          '& > .search': {
            lineHeight: searchInputHeight,
            padding: '0 5px',
            fontSize: '15px',
            border: `solid 1px ${rgba(1, 0.5)}`,
            background: rgba(255, 1),
            borderRadius: '2px',
            height: searchInputHeight,
            margin: '10px',
          },
        },
        '& > .right-container': {
          flexGrow: 1,
        },
      }),
      className('popupStyle', {
        left: '0',
        bottom: `${parseInt(panelSize, 10) + 2}px`,
        borderBottomLeftRadius: '0 !important',
        borderBottomRightRadius: '0 !important',
        width: '550px',
      }),
      className('orb', {
        margin: '0 9px',
        width: panelSize,
        minWidth: panelSize,
        height: panelSize,
        backgroundImage: `url("${OrbNormal}");`,
        backgroundPosition: 'center',
        backgroundSize: itemSize,
        backgroundRepeat: 'no-repeat',
        filter: 'brightness(1)',
        transition: 'filter 0.1s',
        '&:hover, &:focus': {
          filter: 'brightness(1.2)',
        },
        '&:active': {
          filter: 'brightness(1)',
        },
      }),
    ];
  },
};
</script>
