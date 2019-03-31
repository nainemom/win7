<template>
  <div class="window">
    <div class="header">
      <div class="title" @mousedown="moveStart"> Notepad - untitled.txt* </div>
      <div class="btns">
        <span class="minimize"> - </span>
        <span class="maxmize"> # </span>
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
      movingData: {}
    }
  },
  methods: {
    moveStart(event) {
      this.movingData = {
        offsetX: event.x - this.$el.offsetLeft,
        offsetY: event.y - this.$el.offsetTop
      }
      document.body.addEventListener('mousemove', this.moving, false)
      document.body.addEventListener('mouseup', this.moveEnd, false)
    },
    moving(event) {
      this.$el.style.left = (event.x - this.movingData.offsetX) + 'px'
      this.$el.style.top = (event.y - this.movingData.offsetY) + 'px'
      console.log('moving')
    },
    moveEnd() {
      document.body.removeEventListener('mousemove', this.moving)
      document.body.removeEventListener('mouseup', this.moveEnd)
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
  max-height: 500px;
  width: 40%;
  min-width: 300px;
  max-width: 850px;
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
