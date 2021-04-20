<template>
    <div class="err">
      <div class="top">
        <img class="icon" src="/winvista/icons/98.ico" width="36" height="36"/>
        The program can't start because MSVCP120.dll is missing from your computer. Try reinstalling the program to fix this propblem.
      </div>
      <div class="btn">
        <button @click="$emit('click')"> OK </button>
      </div>
    </div>
</template>
<style lang="scss" scoped>
  .err {
    width: 100%;
    height: 100%;
    border: none;
    resize: none;
    text-align: center;

    & > .top {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin: 0 auto;
      font-size: 13px;
      text-align: left;
      padding: 35px 20px;

      & .icon{
        min-width: 36px;
        max-width: 36px;
        width: 36px;
        min-height: 36px;
        max-height: 36px;
        height: 36px;
        margin-right: 15px;
      }
    }

    & > .btn {
      text-align: right;
      background: rgba(0, 0, 0, 0.1);
      padding: 8px;
      & button {
        padding: 5px 15px;
      }

    }
  }
</style>

