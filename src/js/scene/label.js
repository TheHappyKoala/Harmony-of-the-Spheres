import worldToScreenCoordinates from './worldToScreenCoordinates';

export default function(ctx, camera, massManifestationPosition, w, h, name) {
  const position = worldToScreenCoordinates(
    massManifestationPosition.x,
    massManifestationPosition.y,
    massManifestationPosition.z,
    camera,
    w,
    h
  );

  if (position !== null) {
    ctx.font = '12px Arial';

    const textBoxWidth = ctx.measureText(name).width + 6;

    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.arc(position.x, position.y, 8, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#545454';
    ctx.fillRect(position.x + 13, position.y - 10, textBoxWidth, 20);

    ctx.globalAlpha = 1;
    ctx.fillStyle = 'white';
    ctx.fillText(name, position.x + 16, position.y + 3);

    ctx.strokeRect(position.x + 13, position.y - 10, textBoxWidth, 20);
  }
}
