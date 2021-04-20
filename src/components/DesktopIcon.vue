<template>
  <div :class="$style.desktopIcon" @dblclick="click">
    <img :src="icon" />
    <div> {{ title }} </div>
  </div>
</template>

<script>
import { rgba } from '/src/styles/utils';


export default {
  props: ['icon', 'title', 'component', 'type', 'data'],
  inject: ['$os'],
  methods: {
    click() {
      this.$os.openWindow(this.component, {
        title: this.title,
        data: this.data,
      });
    },
  },
  style({ className }) {
    return [
      className('desktopIcon', {
        width: '96px',
        height: 'auto',
        fontFamily: 'sans-serif',
        fontSize: '15px',
        color: rgba(255, 1),
        textShadow: new Array(4).fill(`0 0 5px ${rgba(0, 0.4)}`).join(','),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '15px 10px',
        '& > img': {
          width: '75%',
          marginBottom: '4px',
          filter: `drop-shadow(2px 4px 6px ${rgba(0, 0.5)})`,
        }
      }),
    ];
  },
};
</script>
