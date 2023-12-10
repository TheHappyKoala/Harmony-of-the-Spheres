export const drawMassLabel = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
): void => {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 8, 0, 2 * Math.PI);
  ctx.stroke();
};
