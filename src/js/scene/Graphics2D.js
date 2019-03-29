export default class {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  setDimensions(w, h) {
    this.canvas.width = w;
    this.canvas.height = h;

    return this;
  }

  threeToTwo(p, camera, isOrbital, isTarget) {
    const w = this.canvas.width;
    const h = this.canvas.height;

    if ((isOrbital && isTarget) || isTarget) return { x: w / 2, y: h / 2 };

    p = p.project(camera);

    p.x = (p.x + 1) / 2 * w;
    p.y = -(p.y - 1) / 2 * h;

    if (p.z < 1 && p.x > 0 && p.x < w && p.y > 0 && p.y < h) return p;

    return false;
  }

  drawLabel(
    name,
    p,
    camera,
    isOrbital,
    isTarget,
    placement,
    color,
    drawSymbolCallback
  ) {
    p = this.threeToTwo(p, camera, isOrbital, isTarget);

    if (p) {
      const ctx = this.ctx;

      this.ctx.font = '12px Arial';

      const { x, y } = p;

      const textBoxWidth = ctx.measureText(name).width + 6;

      const offset = placement === 'right' ? 0 : textBoxWidth + 20;

      drawSymbolCallback(ctx, x, y, color);

      ctx.lineWidth = 1;

      ctx.globalAlpha = 0.5;
      ctx.fillStyle = '#545454';
      ctx.fillRect(x + 13 - offset, y - 10, textBoxWidth, 20);

      ctx.globalAlpha = 1;
      ctx.fillStyle = color;
      ctx.fillText(name, x + 16 - offset, y + 3);

      ctx.strokeRect(x + 13 - offset, y - 10, textBoxWidth, 20);
    }
  }
}
