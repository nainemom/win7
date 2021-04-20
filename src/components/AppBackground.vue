<template>
  <div :class="$style.bg" />
</template>

<script>
import { fitSize } from '../styles/common'

export default {
  style({ className }) {
    const backgroundImageFile = require('../assets/wallpapaer.jpg');
    return [
      className('bg', {
        position: 'absolute',
        ...fitSize,
        background: `url("${backgroundImageFile}")`,
        backgroundPosition: 'bottom center',
        backgroundSize: '100% 100%',
        backgroundEepeat: 'no-repeat',
      }),
    ];
  },
}
</script>
