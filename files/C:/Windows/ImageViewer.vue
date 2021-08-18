<template>
  <div :class="$style.imageViewer" />
</template>

<script>
import { props } from '@/utils/vue';
import { resolveFileByPath } from '@/services/fs';
import { rgba } from '@/styles/utils';

export default {
  canHandle: (file) => file && (file.path.endsWith('.png') || file.path.endsWith('.jpg') || file.path.endsWith('.jpeg')),
  metaData: (file) => ({
    icon: resolveFileByPath('C:/Windows/system/icons/jpg.png'),
    width: 600,
    height: 500,
    title: file ? file.path : '',
  }),
  ...props({
    file: props.obj(null),
  }),
  style({ className }) {
    return [
      className('imageViewer', {
        position: 'relative',
        backgroundImage: `url("${this.file.data}")`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: rgba(0, 0.5),
      }),
    ];
  },
};
</script>
