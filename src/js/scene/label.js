import worldToScreenCoordinates from './worldToScreenCoordinates';

export default (
  ctx,
  camera,
  positionVector,
  w,
  h,
  name,
  isOrbital,
  isTarget,
  color,
  drawSymbolCallback,
  placement = 'right'
) => {
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

    const direction = placement === 'right' ? 0 : textBoxWidth + 20;

    drawSymbolCallback(ctx, { x: position.x, y: position.y }, color);

    ctx.lineWidth = 1;

    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#545454';
    ctx.fillRect(x + 13 - direction, y - 10, textBoxWidth, 20);

    ctx.globalAlpha = 1;
    ctx.fillStyle = color;
    ctx.fillText(name, x + 16 - direction, y + 3);

    ctx.strokeRect(x + 13 - direction, y - 10, textBoxWidth, 20);
  }
};
