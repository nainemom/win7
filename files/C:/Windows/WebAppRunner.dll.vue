<template>
  <div
    :class="$style.webAppRunner"
    class="no-border"
  >
    <iframe :src="file.data.url" />
  </div>
</template>

<script>
import icon from '../../../src/assets/icons/html.png';
import { rgba } from '../../../src/styles/utils';
import { props } from '../../../src/utils/vue';

export default {
  canHandle: (file) => file.type === 'webapp',
  windowProperties: (file) => ({
    icon: file && file.data.icon ? file.data.icon : icon,
    width: file && file.data.width ? file.data.width : 600,
    height: file && file.data.height ? file.data.height : 500,
  }),
  ...props({
    file: props.obj(null),
  }),
  style({ className }) {
    return [
      className('webAppRunner', {
        '& > iframe': {
          background: rgba(255, 1),
          width: '100%',
          height: '100%',
        },
      }),
    ];
  },
};
</script>
