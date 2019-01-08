import * as THREE from 'three';

export function getDistanceParams(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dz = p2.z - p1.z;

  return { dx, dy, dz, dSquared: dx * dx + dy * dy + dz * dz };
}

export function getVMag(g, primary, d) {
  return Math.sqrt(g * primary.m / d);
}

export function getIdealCircularOrbit(primary, secondary, g) {
  const dParams = getDistanceParams(primary, secondary);

  const d = Math.sqrt(dParams.dSquared);

  const vMag = getVMag(g, primary, d);

  return {
    ...secondary,
    vx: primary.vx + -dParams.dy * vMag / d,
    vy: primary.vy + dParams.dx * vMag / d,
    vz: primary.vz + dParams.dz * vMag / d
  };
}

export function degreesToRadians(degrees) {
  return Math.PI / 180 * degrees;
}

export function calculateOrbitalVertices(orbitalPeriod, dt) {
  return (orbitalPeriod / dt * 1.1).toFixed(0);
}

export function getRandomNumberInRange(min, max) {
  return Math.random() * (max - min) + min;
}

export function getRandomRadian() {
  return Math.PI * 2 * Math.random();
}

export function createParticleDisc(particlesNumber, primary, g, minD, maxD) {
  const particles = [];

  for (let i = 0; i < particlesNumber; i++) {
    const radian = getRandomRadian();
    const dist = getRandomNumberInRange(minD, maxD);

    const x = Math.cos(radian) * dist;
    const y = Math.sin(radian) * dist;
    const z = 0;

    const dParams = getDistanceParams({ x: 0, y: 0, z: 0 }, { x, y, z });

    const d = Math.sqrt(dParams.dSquared);

    const vMag = getVMag(g, primary, d);

    particles.push({
      x: x,
      y: y,
      z: z,
      vx: -dParams.dy * vMag / d,
      vy: dParams.dx * vMag / d,
      vz: 0
    });
  }

  return particles;
}

export function tiltParticleSystem(vectors, axis, tilt, primary) {
  const tiltedVectors = [];

  vectors.forEach(vector => {
    const p = new THREE.Vector3(vector.x, vector.y, vector.z).applyAxisAngle(
      axis,
      degreesToRadians(tilt)
    );
    const v = new THREE.Vector3(vector.vx, vector.vy, vector.vz).applyAxisAngle(
      axis,
      degreesToRadians(tilt)
    );

    tiltedVectors.push({
      x: primary.x + p.x,
      y: primary.y + p.y,
      z: primary.z + p.z,
      vx: primary.vx + v.x,
      vy: primary.vy + v.y,
      vz: primary.vz + v.z
    });
  });

  return tiltedVectors;
}
