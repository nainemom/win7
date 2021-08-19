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
          :src="item.data"
          alt=""
          @click="changeBackground(item)"
        >
      </div>
    </div>
  </div>
</template>

<script>
import { props } from '@/utils/vue';
import { px } from '@/styles/utils';
import { resolveFileByPath, getDirectoryFiles } from '@/services/fs';
import { setConfig } from '@/services/cnf';

export default {
  name: 'ChangeBackground',
  canHandle: (file) => !file,
  metaData: () => ({
    title: 'Change Background',
    icon: resolveFileByPath('C:/Windows/system/icons/background-capplet.png'),
    width: 900,
    height: 490,
    maximizable: false,
  }),
  ...props({
    file: props.obj(null),
    wmId: props.any(),
  }),
  data() {
    return { list: [], loading: true };
  },
  async mounted() {
    this.list = getDirectoryFiles('C:/Windows/system/wallpapers');
    this.loading = false;
  },
  methods: {
    changeBackground(item) {
      setConfig({
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
