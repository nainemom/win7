<template>
  <div :class="$style.desktopIcon" @dblclick="click">
    <img :src="trueProps.icon" />
    <div> {{ trueProps.name }} </div>
  </div>
</template>

<script>
import { rgba } from '/src/styles/utils';
import { getFile } from '/src/services/files';


export default {
  props: ['icon', 'name', 'component', 'type', 'data', 'target', 'files', 'onClick'],
  inject: ['$os'],
  methods: {
    click() {
      if (this.onClick && this.onClick(this.$props) === true) {
        return;
      }
      this.$os.openWindow(this.trueProps.component, {
        title: this.trueProps.name,
        data: this.trueProps.data,
      });
    },
  },
  computed: {
    trueProps() {
      if (this.type === 'shortcut') {
        return getFile(this.target);
      }
      return this.$props;
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
