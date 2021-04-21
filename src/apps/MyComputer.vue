<template>
  <div :class="$style.myComputer">
    <div :class="$style.pathBar">
      {{ localPath.join('\\') }}
    </div>
    <div :class="$style.content">
      <component :is="File" v-for="(file, index) in dirContent" :key="file.name + index" v-bind="file" @click="click"/>
    </div>
  </div>
</template>

<script>
import File from '/src/components/File.vue';
import { getFile } from '/src/services/files';


export default {
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
