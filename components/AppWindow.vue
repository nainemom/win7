<template>
  <div class="window">
    <div class="header">
      <div class="title" @mousedown="moveStart" @touchstart="moveStart"> Notepad - untitled.txt* </div>
      <div class="btns">
        <span class="minimize"> - </span>
        <span class="maxmize" @click="toggleMaxmize"> # </span>
        <span class="close"> x </span>
      </div>
    </div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      movingData: {},
      normalState: null,
      maxmized: false
    }
  },
  methods: {
    getPos(event) {
      if (event.type.indexOf('touch') === -1) {
        return {
          x: event.clientX,
          y: event.clientY
        }
      } else {
        return {
          x: event.changedTouches[0].clientX,
          y: event.changedTouches[0].clientY
        }
      }
    },
    moveStart(event) {
      const pos = this.getPos(event)
      this.movingData = {
        offsetX: pos.x - this.$el.offsetLeft,
        offsetY: pos.y - this.$el.offsetTop
      }
      document.body.addEventListener('mousemove', this.moving, false)
      document.body.addEventListener('touchmove', this.moving, false)
      document.body.addEventListener('mouseup', this.moveEnd, false)
      document.body.addEventListener('touchend', this.moveEnd, false)
    },
    moving(event) {
      const pos = this.getPos(event)
      this.$el.style.left = (pos.x - this.movingData.offsetX) + 'px'
      this.$el.style.top = (pos.y - this.movingData.offsetY) + 'px'
    },
    moveEnd() {
      document.body.removeEventListener('mousemove', this.moving)
      document.body.removeEventListener('touchmove', this.moving)
      document.body.removeEventListener('mouseup', this.moveEnd)
      document.body.removeEventListener('touchend', this.moveEnd)
    },
    toggleMaxmize() {
      if (this.maxmized) {
        this.normalState = {
          left: this.$el.style.left,
          top: this.$el.style.top,
          width: this.$el.style.width,
          height: this.$el.style.height
        }
        this.$el.style.left = '0px'
        this.$el.style.top = '0px'
        this.$el.style.width = '100%'
        this.$el.style.height = '100%'
      } else {
        if (this.normalState) {
          this.$el.style.left = this.normalState.left
          this.$el.style.top = this.normalState.top
          this.$el.style.width = this.normalState.width
          this.$el.style.height = this.normalState.height
        } else {
          this.$el.style.left = '40px'
          this.$el.style.top = '50px'
          this.$el.style.width = '40%'
          this.$el.style.height = '40%'
        }
      }
      this.maxmized = !this.maxmized

    }
  }
}
</script>

<style scoped lang="scss">
@import '../assets/mixins';

.window {
  position: absolute;
  @include gradient(#a8b8ca, 0.85);
  // background: rgba(206, 218, 233, 0.8);
  height: 40%;
  min-height: 420px;
  width: 40%;
  min-width: 300px;
  left: 40px;
  top: 50px;
  display: flex;
  flex-direction: column;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.2);
  overflow: hidden;

  & > .header {
    padding: 0 8px;
    min-height: 31px;
    height: 31px;
    max-height: 31px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    & .title {
      flex-grow: 1;
    }

    & .btns {
      min-width: 100px;
      max-width: 100px;
      width: 100px;
      text-align: right;
      border-radius: 6px;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      box-shadow: 0 0 1px 1px #c5d9e1, 0 0 2px 2px rgba(0, 0, 0, 0.25);
      font-weight: bold;
      overflow: hidden;
      border-top: none;
      display: flex;
      flex-direction: row;
      overflow: hidden;
      align-self: flex-start;
      color: #fff;
      text-shadow: 0 0 5px #000;
      height: 20px;
      min-height: 20px;
      max-height: 20px;

      & > * {
        @include gradient(#9eb4ce);
        flex-grow: 1;
        text-align: center;
        box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.5);

        &:hover {
          @include gradient(#728eb1);
        }

        &.close {
          @include gradient(#bd351d);
          flex-grow: 2;
          &:hover {
            @include gradient(#e74f35);
          }
        }
      }
    }
  }

  & > .content {
    background: #fff;
    flex-grow: 1;
    margin: 6px;
  }
}
</style>
