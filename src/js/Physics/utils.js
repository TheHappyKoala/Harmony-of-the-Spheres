export function getDistanceParams(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dz = p2.z - p1.z;

  return { dx, dy, dz, dSquared: dx * dx + dy * dy + dz * dz };
}

export function getIdealCircularOrbit(primary, secondary, g) {
  const dParams = getDistanceParams(primary, secondary);

  const d = Math.sqrt(dParams.dSquared);

  const vMag = Math.sqrt(g * primary.m / d);

  return {
    ...secondary,
    vx: primary.vx + -dParams.dy * vMag / d,
    vy: primary.vy + dParams.dx * vMag / d,
    vz: primary.vz + dParams.dz * vMag / d
  };
}
