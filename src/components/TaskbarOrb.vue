<template>
  <div :class="$style.orb" @click.capture="showPopup" />
  <Popup :class="$style.popupStyle" v-model:visible="popup">
    <div :class="$style.popup">
      <div class="left-container"></div>
      <div class="right-container"></div>
    </div>
  </Popup>
</template>

<script>
import { panelSize } from '/src/styles/constants';
import Popup from '/src/components/Popup.vue';
import OrbNormal from '/src/assets/orb/normal.png';
import { rgba } from '/src/styles/utils';

export default {
  components: {
    Popup,
  },
  data() {
    return {
      popup: false,
    };
  },
  methods: {
    showPopup() {
      this.popup = true;
    },
  },
  style({ className }) {
    const itemSize = `${(parseInt(panelSize) - 1)}px`;

    return [
      className('popup', {
        display: 'flex',
        flexDirection: 'row',
        height: '600px',
        '& > .left-container': {
          width: '65%',
          backgroundColor: rgba(255, 1),
          borderRadius: '4px',
          border: `solid 1px ${rgba(0, 0.4)}`,
        },
        '& > .right-container': {

        },
      }),
      className('popupStyle', {
        left: '0',
        bottom: `${parseInt(panelSize) + 2}px`,
        borderBottomLeftRadius: '0 !important',
        borderBottomRightRadius: '0 !important',
        width: '500px',
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
