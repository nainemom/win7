<template>
  <div v-if="loading">
    Loading ...
  </div>
  <template v-if="data">
    <audio
      autoplay
      controls
      :class="$style.player"
      class="no-border"
      @ended="onEnd"
    >
      <source :src="data">
    </audio>
  </template>
</template>

<script>
import { props, inject } from '../../utils/vue';
import { fetchTextFile } from '../../services/fs';

export default {
  ...inject('$wm','$fs'),
  ...props({
    filePath: props.obj(null),
  }),
  data() {
    return {
      data:null,
      loading:false,
    }
  },
  async created() {
    if (this.filePath) {
      this.loading = true;
      try {
        this.data = await this.$fs.fetchTextFile(this.filePath);
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    }
  },
  methods: {
    onEnd() {

    },
  },
  style({ className }) {
    return [
      className('player', {
        background: '#f1f3f4',
        width: '100%',
        padding: '15px 0',
      }),
    ];
  },
};
</script>
