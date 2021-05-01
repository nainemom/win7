<template>
  <div :class="$style.orb" @click.capture="showPopup" />
  <Popup :class="$style.popupStyle" v-model:visible="popup" auto-close dark>
    <div :class="$style.popup">
      <div class="left-container">
        <div class="files">
          <File v-for="file in leftContainerFiles" :key="file.path" :file="file" block dark-text single-click />
        </div>
        <input ref="searchInput" class="search" placeholder="Search programs and files" v-model="searchString">
      </div>
      <div class="right-container">
        <File v-for="file in rightContainerFiles" :key="file.path" :file="file" block no-icon shadow single-click />
      </div>
    </div>
  </Popup>
</template>

<script>
import { inject } from '/src/utils/vue';

import { panelSize } from '/src/styles/constants';
import Popup from '/src/components/Popup.vue';
import File from '/src/components/File.vue';
import OrbNormal from '/src/assets/orb/normal.png';
import { rgba } from '/src/styles/utils';

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
    };
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
  computed: {
    leftContainerFiles() {
      if (this.searchString) {
        return this.$fs.searchFiles('', (theFile) => theFile.path.includes(this.searchString), true);
      }
      return this.$fs.getDirectoryFiles('C:/Program Files');
    },
    rightContainerFiles() {
      return this.$fs.getDirectoryFiles('C:/User/Start Menu');;
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
    const itemSize = `${(parseInt(panelSize) - 1)}px`;

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
            maxHeight: `${parseInt(height) - parseInt(searchInputHeight) - 20}px`,
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
        bottom: `${parseInt(panelSize) + 2}px`,
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
          filter: 'brightness(1.2)'
        },
        '&:active': {
          filter: 'brightness(1)'
        },
      }),
    ];
  },
}
</script>
