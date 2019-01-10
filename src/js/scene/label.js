import worldToScreenCoordinates from './worldToScreenCoordinates';

export default function(
  ctx,
  camera,
  positionVector,
  w,
  h,
  name,
  isOrbital,
  isTarget
) {
  const position = worldToScreenCoordinates(
    positionVector,
    camera,
    w,
    h,
    isOrbital,
    isTarget
  );

  if (position !== null) {
    ctx.font = '12px Arial';

    const { x, y } = position;

    const textBoxWidth = ctx.measureText(name).width + 6;

    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#545454';
    ctx.fillRect(x + 13, y - 10, textBoxWidth, 20);

    ctx.globalAlpha = 1;
    ctx.fillStyle = 'white';
    ctx.fillText(name, x + 16, y + 3);

    ctx.strokeRect(x + 13, y - 10, textBoxWidth, 20);
  }
}
