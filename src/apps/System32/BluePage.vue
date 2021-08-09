<template>
  <div
    v-show="value"
    :class="$style.bluePage"
  >
    <div class="content">
      Problem has been detected and windows has been restart to prevent damage on your computer.
      <br>
      <br>
      he problem seems to be caused by the following file: SPCmDCON.SYS
      <br>
      <br>
      PAGE_FAULT_XN_NONPAGEO_AREA
      <br>
      <br>
      If this is the first time you've seen this stop error screen, Follow these steps:
      <br>
      <br>
      Check to make sure any new hardware or software is properly installed.
      If this is a new installation,
      ask your hardware or software manufacturer or any windows updates you might need.
      <br>
      <br>
      If problems continue,
      disable or remove any newly installed hardware or software.
      Disable BIOS memory options such as caching or shadowing.
      If you need to use safe mode to remove or disable components,
      restart sour computer, press F8 to select Advanced startup Options, and then select safe mode.
      <br>
      <br>
      <br>
      <br>
      Technical information:
      <br>
      <br>
      *** STOP: 0x00000050 (OxFD30940,0x00000001,0xFPFE7617,0x00000000)
      <br>
      <br>
      Address F6FE7617 base at FEFE5000, timestamp 3d6dd67c
      <br>
      <br>
      *** SPCmDCON.SYS - {{ value }}
      <br>
      <br>
      <br>
      <br>
      <br>
      System will be restart in 5 seconds...
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: Boolean,
  },
  emits: ['update:value'],
  watch: {
    value(v) {
      if (v) {
        setTimeout(() => {
          this.$emit('update:value', false);
        }, 5000);
      }
    },
  },
  style({ className }) {
    return [
      className('bluePage', {
        position: 'fixed',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        left: 0,
        top: 0,
        background: '#000082',
        color: '#fff',
        zIndex: 99999,
        padding: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }),
    ];
  },
};
</script>
