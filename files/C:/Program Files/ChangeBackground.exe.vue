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
          v-for="(it,key) in list"
          :key="key"
          width="90"
          height="60"
          :src="it"
          alt=""
          @click="changeBackground(it)"
        >
      </div>
    </div>
  </div>
</template>

<script>
import icon from '../../../src/assets/icons/background-capplet.png';
import { props, inject } from '../../../src/utils/vue';
import { wallpapers } from '../../../src/styles/constants';
import { px } from '../../../src/styles/utils';

export default {
  name: 'ChangeBackground',
  canHandle: () => false,
  windowProperties: () => ({
    title: 'Change Background',
    icon,
    width: 900,
    height: 600,
  }),
  ...inject('$wm'),
  ...props({
    file: props.obj(null),
    wmId: props.any(),
  }),
  data() {
    return { list: [], loading: true };
  },
  async mounted() {
    let val = await Promise.all(wallpapers);
    val = val.map((it) => it.default);
    this.list = val;
    this.loading = false;
  },
  methods: {
    changeBackground(src) {
      this.$wm.currentWallpaper.src = src;
      localStorage.setItem('wallpaper', src);
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

<style scoped>

</style>
