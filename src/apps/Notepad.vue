<template>
  <div :class="$style.notepad">
    <textarea ref="textarea" :value="value" />
  </div>
</template>

<script>
import icon from '/src/assets/icons/notepad.png';
import fileIcon from '/src/assets/icons/txt.png';

export default {
  appConfig: {
    icon: () => icon,
    fileIcon: () => fileIcon,
    canHandle: (file) => {
      if (file.type === 'file' && file.name.endsWith('txt')) {
        return true;
      }
    },
    windowConfig: () => ({
      width: '600px',
      height: '500px',
    }),
  },
  props: ['value'],
  mounted() {
    this.$refs.textarea.focus();
  },
  style({ className }){
    return [
      className('notepad', {
        background: '#fff',
        overflow: 'hidden',
        '& > textarea': {
          border: 'none',
          resize: 'none',
          width: '100%',
          height: '100%',
          padding: '10px',
          '&:focus': {
            border: 'none',
            outline: 'none',
          }
        }
      }),
    ];
  },
}
</script>

