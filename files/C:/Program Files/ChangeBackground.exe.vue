<template>
  <div :class="$style.fill">
    <div :class="$style.content">
      <h4 :class="$style.head">
        Choose your desktop background
      </h4>
      <p :class="$style.desc">
        Click a picture to make it your desktop background.
      </p>
      <div :class="$style.box">
        <img
          v-for="(item, key) in list"
          :key="key"
          width="90"
          height="60"
          :src="item.data.value"
          alt=""
          @click="changeBackground(item)"
        >
      </div>
    </div>
  </div>
</template>

<script>
import icon from '../../../src/assets/icons/background-capplet.png';
import { props, inject } from '../../../src/utils/vue';
import { px } from '../../../src/styles/utils';

export default {
  name: 'ChangeBackground',
  canHandle: () => false,
  windowProperties: () => ({
    title: 'Change Background',
    icon,
    width: 900,
    height: 490,
    maximizable: false,
  }),
  ...inject('$wm', '$fs', '$cnf'),
  ...props({
    file: props.obj(null),
    wmId: props.any(),
  }),
  data() {
    return { list: [], loading: true };
  },
  async mounted() {
    this.list = this.$fs.getDirectoryFiles('C:/Windows/Wallpapers');
    this.loading = false;
  },
  methods: {
    changeBackground(item) {
      this.$cnf.setConfig({
        wallpaperPath: item.path,
      });
    },
  },
  style({ className }) {
    return [
      className('fill', {
        background: 'white',
        padding: '1rem',
      }),
      className('content', {
        width: px(800),
        margin: '0 auto',
        background: 'white',
      }),
      className('box', {
        width: '100%',
        height: px(300),
        overflowY: 'scroll',
        overflowX: 'hide',
        border: '1px solid black',
        borderRadius: px(2),
        padding: '1rem 0',
        textAlign: 'center',
        img: {
          margin: '.5rem',
        },
      }),
      className('head', {
        fontSize: '1.25rem',
        marginBottom: px(16),
      }),
      className('desc', {
        marginBottom: '2rem',
      }),
    ];
  },
};
</script>
