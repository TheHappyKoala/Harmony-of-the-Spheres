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
    color: string
  ): void {
    p = this.threeToTwo(p, camera, isTarget);

    if (p) {
      const ctx = this.ctx;

      this.ctx.font = "16px Arial";

      const { x, y } = p;

      ctx.fillStyle = color;
      ctx.fillText(name, x, y);
    }
  }
}
