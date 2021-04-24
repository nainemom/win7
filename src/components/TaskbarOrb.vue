<template>
  <div :class="$style.orb" @click.capture="showPopup" />
</template>

<script>
import { panelSize } from '/src/styles/constants';
import Popup from '/src/components/Popup.vue';
import OrbNormal from '/src/assets/orb/normal.png';

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
