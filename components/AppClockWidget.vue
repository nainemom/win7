<template>
  <canvas ref="clock" width="200" height="200" />
</template>

<script>
  export default {
    data() {
      return {
        clockTimer: null
      }
    },
    mounted() {
      this.drawClock()
      setInterval(this.drawClock, 1000)
    },
    methods: {
      drawClock(){
        var canvas = this.$refs.clock;
        var ctx = canvas.getContext("2d");
        canvas.width = canvas.width;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
        var radius = canvas.height / 2;
        ctx.translate(radius, radius);
        radius = radius * 0.90;
        this.drawFace(ctx, radius);
        this.drawNumbers(ctx, radius);
        this.drawTime(ctx, radius);
      },
      drawFace(ctx, radius) {
        var grad;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2*Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
        grad = ctx.createRadialGradient(0,0,radius*0.95, 0,0,radius*1.05);
        grad.addColorStop(0, '#333');
        grad.addColorStop(0.5, 'white');
        grad.addColorStop(1, '#333');
        ctx.strokeStyle = grad;
        ctx.lineWidth = radius*0.1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, radius*0.1, 0, 2*Math.PI);
        ctx.fillStyle = '#333';
        ctx.fill();
      },

      drawNumbers(ctx, radius) {
        var ang;
        var num;
        ctx.font = radius*0.15 + "px arial";
        ctx.textBaseline="middle";
        ctx.textAlign="center";
        for(num = 1; num < 13; num++){
          ang = num * Math.PI / 6;
          ctx.rotate(ang);
          ctx.translate(0, -radius*0.85);
          ctx.rotate(-ang);
          ctx.fillText(num.toString(), 0, 0);
          ctx.rotate(ang);
          ctx.translate(0, radius*0.85);
          ctx.rotate(-ang);
        }
      },

      drawTime(ctx, radius){
        var now = new Date();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();
        //hour
        hour=hour%12;
        hour=(hour*Math.PI/6)+
        (minute*Math.PI/(6*60))+
        (second*Math.PI/(360*60));
        this.drawHand(ctx, hour, radius*0.5, radius*0.07);
        //minute
        minute=(minute*Math.PI/30)+(second*Math.PI/(30*60));
        this.drawHand(ctx, minute, radius*0.8, radius*0.07);
        // second
        second=(second*Math.PI/30);
        this.drawHand(ctx, second, radius*0.9, radius*0.02);
      },

      drawHand(ctx, pos, length, width) {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.moveTo(0,0);
        ctx.rotate(pos);
        ctx.lineTo(0, -length);
        ctx.stroke();
        ctx.rotate(-pos);
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
