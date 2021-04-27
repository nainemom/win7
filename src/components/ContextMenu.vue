<template>
  <Teleport to="body">
    <ul v-if="visible" :class="$style.contextMenu" :style="position" @pointerup.stop>
      <li
        v-for="(item, i) in items"
        :key="item + i"
        :class="!item && 'hr'"
        @click="emitItemClick(item)">
        {{ item }}
      </li>
    </ul>
  </Teleport>
</template>

<script>
import { inject, props } from '/src/utils/vue';
import { each } from '/src/utils/utils';
import { contextMenuWidth, contextMenuItemHeight } from '/src/styles/constants';
import { rgba, px } from '/src/styles/utils';
import { addEventListener, removeEventListener } from '/src/utils/eventListener';


export default {
  // emits: ['click'],
  ...props({
    visible: props.bool(false),
    event: props.any(null),
    items: props.arr([]),
    onClick: props.func(() => {}),
  }),
  ...inject(['$wm']),
  data() {
    return {
      position: null,
    };
  },
  watch: {
    visible: {
      handler(visible) {
        console.log(visible);
        if (visible) {
          this.open();
        } else {
          this.close();
        }
      },
      immidiate: true,
    }
  },
  methods: {
    open() {
      const { event } = this;
      let position = {
        width: parseInt(contextMenuWidth),
        height: parseInt(contextMenuItemHeight) * this.items.length,
      };
      if (event) {
        event.preventDefault();
        event.stopPropagation();
        position = {
          ...position,
          left: event.clientX,
          top: event.clientY,
        };
        if (position.left + position.width > window.innerWidth) {
          position.left = window.innerWidth - position.width;
        }
        if (position.top + position.height > window.innerHeight) {
          position.top = window.innerHeight - position.height;
        }
      }
      console.log(event, position);
      this.position = {};
      each(position, (key, value) => {
        this.position[key] = px(value);
      });
      this.bindEvents();
    },
    emitItemClick(item) {
      if (item === '') return;
      this.$emit('click', item);
      this.close();
    },
    close() {
      this.unbindEvents();
      this.$wm.closeContextMenu();
    },
    bindEvents() {
      setTimeout(() => {
        addEventListener(window, 'pointerup', this.close);
      }, 200);
    },
    unbindEvents() {
      removeEventListener(window, 'pointerup', this.close);
    },
  },
  beforeUnmount() {
    this.unbindEvents();
  },
  style({ className }) {
    return [
      className('contextMenu', {
        position: 'absolute',
        zIndex: 999999,
        width: contextMenuWidth,
        height: 'auto',
        background: rgba(230, 1),
        borderRadius: '2px',
        overflow: 'hidden',
        fontSize: '13px',
        boxShadow: `0 3px 6px 1px ${rgba(0, 0.3)}`,
        '& > li': {
          display: 'block',
          height: contextMenuItemHeight,
          lineHeight: contextMenuItemHeight,
          padding: '0 20px',
          whiteSpace: 'nowrap',
          '&.hr': {
            height: '1px',
            background: rgba(0, 0.2),
            borderBottom: `solid 1px ${rgba(250, 0.2)}`,
          },
          '&:not(.hr):hover': {
            color: rgba(255, 1),
            background: '#4082c1',
          },
        }
      }),
    ];
  },
}
</script>
