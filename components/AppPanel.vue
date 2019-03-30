<template>
  <div class="panel">
    <section class="orb-container">
      <div class="orb" />
    </section>
    <section class="dark to-left">
      <img class="notif-icon" src="/icons/152.ico" alt="i"/>
      <img class="notif-icon" src="/icons/vol.svg" alt="i"/>
      <img class="notif-icon" src="/icons/105.ico" alt="i"/>
      <span class="clock" v-html="dateString"></span>
    </section>
  </div>
</template>

<script>
  export default {
    name: 'panel',
    data() {
      return {
        clockTimer: null,
        dateString: ''
      }
    },
    created() {
      this.syncTime()
      this.clockTimer = setInterval(this.syncTime, 1000)
    },
    methods: {
      syncTime(){
        const dt = new Date()
        let time
        const hour = dt.getHours()
        const min = dt.getMinutes()
        if (hour - 12 > 0) {
          time = `${hour - 12}:${min} PM`
        } else {
          time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')} AM`
        }
        this.dateString = time
      }
    },
    beforeDestroy() {
      clearInterval(this.clockTimer)
    }
  }
</script>

<style scoped lang="scss">
.panel {
  background: #000000;
  background: linear-gradient(to bottom,
    rgba(0,0,0,0.7) 0%,
    rgba(255,255,255,0.8) 9%,
    rgba(190,190,190,0.7) 12%,
    rgba(90,90,90,0.7) 48%,
    rgba(0,0,0,0.7) 52%,
    rgba(66,66,66,0.7) 99%,
    rgba(38,38,38,0.7) 99%,
    rgba(0,0,0,0.7) 100%
  );
  height: 30px;
  min-height: 30px;
  max-height: 30px;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 14px;
  overflow: visible;
  z-index: 99;

  & section {
    padding: 0 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &.dark {
      $darkColor: rgba(9, 65, 80, 0.2);
      
      background: $darkColor;
      height: 100%;
      min-height: 100%;

      &.to-right {
        box-shadow: 15px 0 25px $darkColor;
        padding-right: 25px;
      }
      &.to-left {
        box-shadow: -15px 0 25px $darkColor;
        padding-left: 45px;

        & > * {
          border: solid 1px transparent;
          padding: 0 8px;
          cursor: pointer;

          &:hover {
            border-left: solid 1px rgba(255, 255, 255, 0.2);
            border-right: solid 1px rgba(255, 255, 255, 0.2);
          }

          &.notif-icon {
            height: 70%;
          }
        }
      }
    }
  }

  & > .orb-container {
    padding: 0 10px;

    & .orb {
      background-image: url('../assets/orb/normal.png');
      width: 43px;
      height: 43px;
      background-size: 100%;
      transition: all 0.3s;
      border-radius: 20px;
      box-shadow: 
        5px 0 0.7px -3px rgba(1, 21, 35, 0.9),
        -5px 0 0.7px -3px rgba(0, 0, 0, 0.8),
        7px 0 0.4px -3px rgba(255, 255, 255, 0.4),
        -7px 0 0.4px -3px rgba(255, 255, 255, 0.4)
      ;
      // border-left: solid 2px rgba(0, 0, 0, 0.6);
      // border-right: solid 2px rgba(0, 0, 0, 0.6);
      cursor: pointer;

      &:hover,
      &:focus {
        background-image: url('../assets/orb/hover.png');
      }

      &:active {
        background-image: url('../assets/orb/active.png');
      }
    }
  }

  & .clock {
    font-size: 13px;
    min-width: 80px;
    text-align: center;
  }
  
}
</style>
