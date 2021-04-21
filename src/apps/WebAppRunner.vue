<template>
  <div :class="$style.webAppRunner" class="no-border">
    <iframe :src="url" />
  </div>
</template>

<script>
import icon from '/src/assets/icons/html.png';

export default {
  appConfig: {
    icon: () => icon,
    fileIcon: (file) => {
      return file.data.icon || icon;
    },
    canHandle: (file) => {
      if (file.type === 'webapp') {
        return true;
      }
    },
    windowConfig: (file) => ({
      width: file.data.width || '600px',
      height: file.data.height || '500px',
    }),
  },
  inject: ['$fs'],
  props: ['url'],
  style({ className }){
    return [
      className('webAppRunner', {
        '& > iframe': {
          width: '100%',
          height: '100%',
        }
      }),
    ];
  },
}
</script>
