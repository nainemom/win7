<template>
  <div
    :class="$style.webAppRunner"
    class="no-border"
  >
    <iframe :src="url" />
  </div>
</template>

<script>
import { rgba } from '../../styles/utils';
import { props } from '../../utils/vue';

export default {
  ...props({
    url: props.str(),
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
