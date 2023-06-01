<template>
  <canvas
    ref="clock"
    width="200"
    height="200"
  />
</template>

<script>
export default {
  mounted() {
    this.drawClock();
  },
  methods: {
    drawClock() {
      const canvas = this.$refs.clock;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
      let radius = canvas.height / 2;
      ctx.translate(radius, radius);
      radius *= 0.90;
      this.drawFace(ctx, radius);
      this.drawNumbers(ctx, radius);
      this.drawTime(ctx, radius);
    },
    drawFace(ctx, radius) {
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, 2 * Math.PI);
      ctx.fillStyle = '#edfefd';
      ctx.fill();
      const grad = ctx.createRadialGradient(0, 0, radius * 0.95, 0, 0, radius * 1.05);
      grad.addColorStop(0, '#315454');
      grad.addColorStop(0.4, '#fff');
      grad.addColorStop(0.6, '#fff');
      grad.addColorStop(1, '#315454');
      ctx.strokeStyle = grad;
      ctx.lineWidth = radius * 0.1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
      ctx.fillStyle = '#333';
      ctx.fill();
    },
    drawNumbers(ctx, radius) {
      let ang;
      let num;
      ctx.font = `${radius * 0.15}px arial`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      for (num = 1; num < 13; num += 1) {
        ang = (num * Math.PI) / 6;
        ctx.rotate(ang);
        ctx.translate(0, -radius * 0.85);
        ctx.rotate(-ang);
        ctx.fillText(num % 3 === 0 ? num : '.', 0, 0);
        ctx.rotate(ang);
        ctx.translate(0, radius * 0.85);
        ctx.rotate(-ang);
      }
    },
    drawTime(ctx, radius) {
      const now = new Date();
      let hour = now.getHours();
      let minute = now.getMinutes();
      const second = now.getSeconds();
      // hour
      hour %= 12;
      hour = ((hour * Math.PI) / 6)
        + ((minute * Math.PI) / (6 * 60))
        + ((second * Math.PI) / (360 * 60));
      this.drawHand(ctx, hour, radius * 0.5, radius * 0.07);
      // minute
      minute = ((minute * Math.PI) / 30) + ((second * Math.PI) / (30 * 60));
      this.drawHand(ctx, minute, radius * 0.8, radius * 0.07);
      // second
      // second = ((second * Math.PI) / 30);
      // this.drawHand(ctx, second, radius * 0.9, radius * 0.02);
    },
    drawHand(ctx, pos, length, width) {
      ctx.beginPath();
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.moveTo(0, 0);
      ctx.rotate(pos);
      ctx.lineTo(0, -length);
      ctx.stroke();
      ctx.rotate(-pos);
    },
  },
};
</script>
