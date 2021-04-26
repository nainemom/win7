<template>
  <div :class="$style.notepad">
    <textarea ref="textarea" :value="file ? file.data.value : ''" />
  </div>
</template>

<script>
import icon from '/src/assets/icons/notepad.png';
import fileIcon from '/src/assets/icons/txt.png';

export default {
  canHandle: (file) => file.type === 'text',
  windowProperties: (file) => ({
    icon: file ? fileIcon : icon,
    width: 600,
    height: 500,
  }),
  props: ['file'],
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
          lineHeight: 1.5,
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

