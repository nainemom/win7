<template>
  <div :class="$style.notepad">
    <textarea :value="value" />
  </div>
</template>

<script>
export default {
  props: ['value'],
  style({ className }){
    return [
      className('notepad', {
        '& > textarea': {
          border: 'none',
          resize: 'none',
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

