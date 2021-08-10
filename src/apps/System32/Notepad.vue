<template>
  <div :class="$style.notepad">
    <div class="menubar">
      <span @click="onSaveClicked"> Save </span>
      <span @click="exit"> Exit </span>
    </div>
    <textarea
      :disabled="loading"
      ref="textarea"
      :placeholder="loading ? 'loading...' : null"
      v-model="value"
    />
  </div>
</template>

<script>
import { rgba } from '../../styles/utils';
import { props, inject } from '../../utils/vue';

export default {
  ...inject('$wm', '$fs'),
  ...props({
    filePath: props.obj(null),
    wmId: props.any(),
  }),
  data() {
    return {
      value: '',
      loading: false,
      saving: false,
    };
  },
  created() {
    if (this.filePath) {
      this.loading = true;
      this.$fs.fetchTextFile(this.filePath)
        .then(data => {
          this.value = data;
          this.loading = false;
        });
    }
  },
  mounted() {
    this.$refs.textarea.focus();
  },
  computed: {
    isNewFile() {
      return !this.filePath;
    }
  },
  methods: {
    exit() {
      this.$wm.closeWindow(this.wmId);
    },
    async onSaveClicked() {
      let newFileName = `Text File ${Date.now()}.txt`;
      let path = this.filePath || `/C:/User/Documents/${newFileName}`;
      await this.$fs.writeTextFile(path, this.value);
      this.$wm.openDialog({
        type: 'info',
        content: 'File Saved!',
        buttons: ['OK'],
      });

      if (!this.isNewFile) {
        await this.$fs.writeTextFile(`C:/User/Desktop/${newFileName}.link`, path);
        this.exit();
      }
    },
  },
  style({ className }) {
    return [
      className('notepad', {
        background: '#fff',
        overflow: 'hidden',
        '& > .menubar': {
          height: '24px',
          background: rgba(230, 1),
          borderBottom: `solid 1px ${rgba(0, 0.1)}`,
          '& > *': {
            display: 'inline-block',
            padding: '0 6px',
            lineHeight: '24px',
            '&:hover': {
              background: rgba(255, 1),
            },
          },
          '& > *:not(:last-child)': {
            borderRight: `solid 1px ${rgba(0, 0.1)}`,
          },
        },
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
          },
        },
      }),
    ];
  },
};
</script>
