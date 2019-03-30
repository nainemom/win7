<template>
  <div class="blu">
    <div class="content">
      problem has been detected and windows has been shut down to prevent damage o your computer.
      <br>
      <br>
      he problem seems to be caused by the following file: SPCmDCON.SYS
      <br>
      <br>
      PAGE_FAULT_XN_NONPAGEO_AREA 
      <br>
      <br>
      if this is the first time you've seen this stop error screen, estart your computer. if this screen appears again, follow hese steps:
      <br>
      <br>
      check to make sure any new hardware or software is properly installed. If this is a new installation, ask your hardware or software manufacturer or any windows updates you might need.
      <br>
      <br>
      If problems continue, disable or remove any newly installed hardware software. Disable BIOS memory options such as caching or shadowing. If you need to use safe mode to remove or disable components, restart sour computer, press F8 to select Advanced startup Options, and then select safe mode. 
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
      *** SPCmDCON.SYS - Address F6FE7617 base at FEFE5000, oatestamp 3d6dd67c 
    </div>
  </div>
</template>

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
  }
}
</style>
