import { PerspectiveCamera, Vector3 } from "three";

export default class {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = <CanvasRenderingContext2D>this.canvas.getContext("2d");
  }

  clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  setDimensions(w: number, h: number): this {
    this.canvas.width = w;
    this.canvas.height = h;

    return this;
  }

  threeToTwo(p: Vector3, camera: PerspectiveCamera, isTarget: boolean): any {
    const w = this.canvas.width;
    const h = this.canvas.height;

    if (isTarget) return { x: w / 2, y: h / 2 };

    p = p.project(camera);

    p.x = ((p.x + 1) / 2) * w;
    p.y = (-(p.y - 1) / 2) * h;

    if (p.z < 1 && p.x > 0 && p.x < w && p.y > 0 && p.y < h)
      return { x: p.x, y: p.y };

    return false;
  }

  drawLabel(
    name: string,
    p: Vector3,
    camera: PerspectiveCamera,
    isTarget: boolean,
    placement: string,
    color: string,
    drawSymbolCallback: (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      color: string
    ) => void,
    topOffset = 0
  ): void {
    p = this.threeToTwo(p, camera, isTarget);

    if (p) {
      const ctx = this.ctx;

      this.ctx.font = "12px Arial";

      const { x, y } = p;

      const textBoxWidth = ctx.measureText(name).width + 6;

      const offset = placement === "right" ? 0 : textBoxWidth + 20;

      drawSymbolCallback(ctx, x, y + topOffset, color);

      ctx.lineWidth = 1;

      ctx.globalAlpha = 0.5;
      ctx.fillStyle = "#545454";
      ctx.fillRect(x + 13 - offset, y - 10 + topOffset, textBoxWidth, 20);

      ctx.globalAlpha = 1;
      ctx.fillStyle = color;
      ctx.fillText(name, x + 16 - offset, y + 3 + topOffset);

      ctx.strokeRect(x + 13 - offset, y - 10 + topOffset, textBoxWidth, 20);
    }
  }
}

export const drawMarkerLabel = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string
): void => {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();

  ctx.moveTo(x, y - 30);
  ctx.lineTo(x, y + 30);
  ctx.stroke();

  ctx.moveTo(x - 30, y);
  ctx.lineTo(x + 30, y);
  ctx.stroke();
};

export const drawMassLabel = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string
): void => {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 8, 0, 2 * Math.PI);
  ctx.stroke();
};