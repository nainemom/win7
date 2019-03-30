<template>
  <span class="icon" tabindex="0" @dblclick="$emit('click', $event)">
    <div class="icon" :style="{backgroundImage: 'url(' + icon + ')'}" alt="i" />
    <img class="short" src="/icons/163.ico" alt="i" v-if="typeof $attrs.shortcut !== 'undefined'"/>
    <div class="title"> {{title}} </div>
  </span>
</template>

<script>
  export default {
    props: {
      icon: {
        type: String,
        default: undefined
      },
      title: {
        type: String,
        default: 'Icon'
      }
    }
  }
</script>

<style scoped lang="scss">
.icon {
  margin: 5px 15px;
  width: auto;
  width: 135px;
  position: relative;
  padding: 10px 1px;
  cursor: default;

  &:focus {
    background: rgba(6, 100, 121, 0.7);
  }

  & > .icon {
    width: auto;
    background-position: center center;
    background-size: 64px auto;
    background-repeat: no-repeat;
    height: 64px;
  }
  & > img.short {
    position: absolute;
    width: 36px;
    height: 36px;
    top: 44px;
    left: 15px;
  }

  & > .title {
    width: 100%;
    text-align: center;
    color: #fff;
    font-size: 14px;
    text-shadow: 0 0 3px #000, 0 0 2px #000;
    overflow: visible;
    white-space: nowrap;
    margin-top: 8px;
  }
}
</style>
