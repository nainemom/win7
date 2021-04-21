<template>
  <div :class="$style.myComputer">
    <div :class="$style.pathBar">
      {{ localPath.join('\\') }}
    </div>
    <div :class="$style.content">
      <component :is="File" v-for="(file, index) in dirContent" :key="file.name + index" :file="file" @click="click"/>
    </div>
  </div>
</template>

<script>
import icon from '/src/assets/icons/my-computer.png';
import fileIcon from '/src/assets/icons/folder.png';
import File from '/src/components/File.vue';
import { getFile } from '/src/services/files';


export default {
  appConfig: {
    icon,
    exts: [],
    types: ['folder'],
    fileIcon,
  },
  props: ['path'],
  data() {
    return {
      dirContent: getFile(this.path || []),
      localPath: this.path || [],
    };
  },
  computed: {
    File() {
      return File;
    },
  },
  methods: {
    click(file) {
      const target = file.type === 'shortcut' ? file.target : file;
      if (target.files) {
        this.localPath.push(target.name);
        this.dirContent = target.files;
        return true;
      }
      return false;
    },
  },
  style({ className }){
    return [
      className('myComputer', {
        // color: 'red',
      }),
      className('pathBar', {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
      }),
      className('content', {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
      }),
    ];
  },
}
</script>
