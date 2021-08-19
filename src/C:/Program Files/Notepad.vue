<template>
  <div :class="$style.notepad">
    <div class="menubar">
      <span @click="save"> Save </span>
      <span @click="exit"> Exit </span>
    </div>
    <textarea
      ref="textarea"
      v-model="value"
    />
  </div>
</template>

<script>
import { rgba } from '@/styles/utils';
import { props } from '@/utils/vue';
import { resolveFileByPath, createNewFile, fileObject } from '@/services/fs';
import { closeWindow, openDialog } from '@/services/wm';

export default {
  canHandle: (file) => !file || (file.path.endsWith('.txt') || file.path.endsWith('.json') || file.path.endsWith('.js')),
  metaData: (file) => ({
    icon: resolveFileByPath(`C:/Windows/system/icons/${file ? 'txt' : 'notepad'}.png`),
    width: 600,
    height: 500,
    title: file ? file.path : 'Notepad',
  }),
  ...props({
    file: props.obj(null),
    wmId: props.any(),
  }),
  data() {
    return {
      value: this.file ? this.file.data : '',
    };
  },
  mounted() {
    this.$refs.textarea.focus();
  },
  methods: {
    exit() {
      closeWindow(this.wmId);
    },
    save() {
      if (this.file) {
        this.file.data = this.value;
        openDialog({
          type: 'info',
          content: 'File Saved!',
          buttons: ['OK'],
        });
      } else {
        const fileName = `Text File ${Date.now()}.txt`;
        const filePath = `C:/User/Documents/${fileName}`;
        createNewFile(fileObject(filePath, 'text', {
          value: this.value,
        }));
        createNewFile(fileObject(`C:/User/Desktop/${fileName}`, 'shortcut', {
          src: filePath,
        }));
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
