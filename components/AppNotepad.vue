<template>
    <textarea class="notepad" :value="$attrs.content || ''" />
</template>
<style>
  .notepad {
    width: 100%;
    height: 100%;
    border: none;
    padding: 8px;
    resize: none;
  }
</style>

