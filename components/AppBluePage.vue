<template>
  <div class="blu" v-if="value" @dblclick="$emit('input', false)">
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
      Check to make sure any new hardware or software is properly installed. If this is a new installation, ask your hardware or software manufacturer or any windows updates you might need.
      <br>
      <br>
      If problems continue, disable or remove any newly installed hardware or software. Disable BIOS memory options such as caching or shadowing. If you need to use safe mode to remove or disable components, restart sour computer, press F8 to select Advanced startup Options, and then select safe mode. 
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
      *** SPCmDCON.SYS - Address F6FE7617 base at FEFE5000, timestamp 3d6dd67c 
      <br>
      <br>
      <br>
      <br>
      <h2 class="support">
      If you like this funny repository, star it on github before system restarts:
      <br>
      <br>
      <a class="repo-link" target="_blank" :href="$attrs.repo"> WinVista by Nainemom </a>
      </h2>
      <br>
      <br>
      System will be restart in:
      <b>{{remainingTime}}</b>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      secs: 0
    }
  },
  computed: {
    remainingTime() {
      return `00:${(15 - this.secs).toString().padStart(2, '0')}`
    }
  },
  watch: {
    value(v) {
      if (v) {
        this.secs = 0
        const timer = setInterval(() => {
          this.secs++
          if (this.secs === 15) {
            this.$emit('input', false)
          }
        }, 1000)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.blu {
  position: fixed;
  height: 100%;
  width: 100%;
  overflow: hidden;
  left: 0;
  top: 0;
  background: #000082;
  color: #fff;
  z-index: 999;
  padding: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  & > .content {
    min-width: 400px;
    width: 1080px;
    max-width: 90%;

    & .support {

      & .repo-link {
        color: #fff;
        text-decoration: underline;
        cursor: pointer;
      }
    }

  }
}
</style>
