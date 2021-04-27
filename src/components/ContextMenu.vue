<template>
  <Teleport to="body">
    <ul v-show="visible" :class="$style.contextMenu" :style="{ top: position.top, left: position.left }" @pointerup.stop>
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
import { contextMenuWidth, contextMenuItemHeight } from '/src/styles/constants';
import { rgba } from '/src/styles/utils';
import { addEventListener, removeEventListener } from '/src/utils/eventListener';


export default {
  data() {
    return {
      visible: false,
      onItemClick: () => {},
      items: [],
      position: {
        top: 0,
        left: 0,
      },
    };
  },
  methods: {
    open(event, items, onItemClick) {
      event.preventDefault();
      event.stopPropagation();
      this.items = items;
      this.onItemClick = onItemClick;

      const width = parseInt(contextMenuWidth);
      const itemHeight = parseInt(contextMenuItemHeight);
      const height = items.length * itemHeight;

      const offset = {
        left: event.clientX,
        top: event.clientY,
      };

      if (offset.left + width > window.innerWidth) {
        offset.left = window.innerWidth - width;
      }
      if (offset.top + height > window.innerHeight) {
        offset.top = window.innerHeight - height;
      }
      this.position.top = `${offset.top}px`;
      this.position.left = `${offset.left}px`;

      // setup position
      this.visible = true;
      this.bindEvents();
    },
    emitItemClick(item) {
      if (item === '') return;
      this.onItemClick(item);
      this.items = [];
      this.onItemClick = () => {};
      this.visible = false;
    },
    close(e) {
      this.visible = false;
      this.unbindEvents();
    },
    bindEvents() {
      addEventListener(window, 'pointerup', this.close);
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
        borderRadius: '3px',
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
