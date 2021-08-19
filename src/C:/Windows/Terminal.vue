<template>
  <div
    :class="$style.terminal"
    class="no-border"
    tabindex="0"
    @focus="resetFocus"
  >
    <div class="lines">
      <div
        v-for="(line, i) in lines"
        :key="i"
      >
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div> <span class="prefix">&#62;</span><span v-html="line.command" /> </div>
        <div
          class="logs"
          v-text="line.logs"
        />
      </div>
    </div>
    <div class="new-line">
      <span class="prefix">&#62;</span><span
        ref="code"
        contenteditable=""
        tabindex="0"
        @keydown.enter="enter"
      />
    </div>
  </div>
</template>

<script>
import { resolveFileByPath } from '@/services/fs';
import { drop } from '@/utils/dragndrop';

export default {
  canHandle: (file) => !file,
  metaData: () => ({
    icon: resolveFileByPath('C:/Windows/system/icons/terminal.png'),
    width: 600,
    height: 400,
    resizable: true,
    maximizable: true,
    title: 'Terminal',
  }),
  data() {
    return {
      lines: [],
    };
  },
  mounted() {
    this.resetFocus();
    this.droper = drop(this.$el, this.onDrop);
  },
  beforeUnmount() {
    if (this.droper) {
      this.droper.stop();
    }
  },
  methods: {
    resetFocus() {
      this.$refs.code.focus();
    },
    enter(e) {
      e.preventDefault();
      const command = this.$refs.code.innerHTML;
      let logs;
      try {
        // eslint-disable-next-line no-eval
        logs = eval(command);
      } catch (_e) {
        logs = `Command "${command.split(' ')[0]}" not found!`;
      }
      this.lines.push({
        command,
        logs,
      });
      this.$refs.code.innerHTML = '';
    },
    onDrop(data) {
      if (data && Array.isArray(data) && data.length === 1) {
        this.$refs.code.innerHTML += data[0];
      }
      this.resetFocus();
    },
  },
  style({ className }) {
    return [
      className('terminal', {
        background: '#000',
        color: '#fff',
        fontWeight: 'bold',
        fontFamily: 'monospace',
        width: '100%',
        fontSize: '12px',
        padding: '10px',
        '& .prefix': {
          marginRight: '10px',
        },
        '& .logs': {
          margin: '4px 2px',
          fontWeight: 'normal',
        },
        '& > .new-line': {
          '& .prefix': {
            marginRight: '10px',
          },
        },
      }),
    ];
  },
};
</script>
