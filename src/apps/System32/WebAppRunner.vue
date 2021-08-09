<template>
  <div
    :class="$style.webAppRunner"
    class="no-border"
  >
    <iframe :src="file.data.url" />
  </div>
</template>

<script>
import { rgba } from '../../styles/utils';
import { props } from '../../utils/vue';

export default {
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
