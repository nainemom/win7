<template>
  <div :class="$style.notepad">
    <div class="menubar">
      <span @click="save"> Save </span>
      <span @click="exit"> Exit </span>
    </div>
    <textarea ref="textarea" v-model="value" />
  </div>
</template>

<script>
import icon from '/src/assets/icons/notepad.png';
import fileIcon from '/src/assets/icons/txt.png';
import { rgba } from '/src/styles/utils';

export default {
  inject: ['$wm', '$fs'],
  canHandle: (file) => file.type === 'text',
  windowProperties: (file) => ({
    icon: file ? fileIcon : icon,
    width: 600,
    height: 500,
  }),
  props: ['file', 'wmId'],
  mounted() {
    this.$refs.textarea.focus();
  },
  data() {
    return {
      value: this.file ? this.file.data.value : '',
    }
  },
  methods: {
    exit() {
      this.$wm.closeWindow(this.wmId);
    },
    save() {
      if (this.file) {
        this.file.data.value = this.value;
        this.$wm.openDialog({
          type: 'info',
          content: 'File Saved!',
          buttons: ['OK'],
        });
      } else {
        const fileName = `Text File ${Date.now()}.txt`;
        const filePath = `C:/User/Documents/${fileName}`;
        this.$fs.createNewFile(this.$fs.fileObject(filePath, 'text', {
          value: this.value,
        }));
        this.$fs.createNewFile(this.$fs.fileObject(`C:/User/Desktop/${fileName}`, 'shortcut', {
          src: filePath,
        }));
        this.exit();
      }
    },
  },
  style({ className }){
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
          }
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
          }
        }
      }),
    ];
  },
}
</script>

