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
import Popup from '@/components/Popup.vue';
import File from '@/components/File.vue';
import { panelSize } from '@/styles/constants';
import { rgba } from '@/styles/utils';
import { searchFiles, getDirectoryFiles, resolveFileByPath } from '@/services/fs';

export default {
  components: {
    Popup,
    File,
  },
  data() {
    return {
      popup: false,
      searchString: '',
    };
  },
  computed: {
    leftContainerFiles() {
      if (this.searchString) {
        return searchFiles('', (theFile) => theFile.path.toLowerCase().includes(this.searchString.toLowerCase()), true);
      }
      return getDirectoryFiles('C:/Program Files');
    },
    rightContainerFiles() {
      return getDirectoryFiles('C:/User/Start Menu');
    },
  },
  watch: {
    popup(popup) {
      if (popup) {
        this.$nextTick(() => {
          this.$refs.searchInput.focus();
        });
      }
    },
  },
  methods: {
    showPopup() {
      this.searchString = '';
      this.popup = true;
    },
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
        backgroundImage: `url("${resolveFileByPath('C:/Windows/system/orb/normal.png').data}");`,
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
