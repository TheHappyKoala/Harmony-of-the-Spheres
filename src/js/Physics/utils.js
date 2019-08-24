import H3 from './vectors';

export function getDistanceParams(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dz = p2.z - p1.z;

  return { dx, dy, dz, dSquared: dx * dx + dy * dy + dz * dz };
}

export function getVMag(g, primary, d, a = d) {
  return Math.sqrt(Math.abs(g * primary.m * (2 / d - 1 / a)));
}

export function getEscapeVMag(g, m, d) {
  return Math.sqrt(2 * g * m / d);
}

export function clampAbs(min, max, value) {
  return Math.min(Math.max(Math.abs(value), min), max);
}

export function getOrbit(primary, secondary, g) {
  const x = primary.x !== undefined ? primary.x : 0;
  const y = primary.y !== undefined ? primary.y : 0;
  const z = primary.z !== undefined ? primary.z : 0;
  const { vx, vy, vz } = primary;

  const apoapsis = getApoapsis(secondary.a, secondary.e);

  const dParams = getDistanceParams(primary, {
    x: x + apoapsis,
    y: y,
    z: z
  });

  const d = Math.sqrt(dParams.dSquared);

  const vMag = getVMag(g, primary, d, secondary.a);

  const secondaryP = new H3()
    .set({ x: apoapsis, y: 0, z: 0 })
    .rotate({ x: 0, y: 0, z: 1 }, secondary.w)
    .rotate({ x: 0, y: 1, z: 0 }, secondary.i);

  const secondaryV = new H3()
    .set({
      x: -dParams.dy * vMag / d,
      y: dParams.dx * vMag / d,
      z: dParams.dz * vMag / d
    })
    .rotate({ x: 0, y: 0, z: 1 }, secondary.w)
    .rotate({ x: 0, y: 1, z: 0 }, secondary.i);

  return {
    ...secondary,
    x: x + secondaryP.x,
    y: y + secondaryP.y,
    z: z + secondaryP.z,
    vx: vx + secondaryV.x,
    vy: vy + secondaryV.y,
    vz: vz + secondaryV.z
  };
}

export function getPeriapsis(a, e) {
  return a * (1 - e);
}

export function getApoapsis(a, e) {
  return a * (1 + e);
}

export function getSemiMinorAxis(a, e) {
  return a * Math.sqrt(1 - e * e);
}

export function getFocusOfEllipse(a, b) {
  return Math.sqrt(a * a - b * b);
}

export function getEllipse(a, e) {
  const b = getSemiMinorAxis(a, e);

  return {
    focus: getFocusOfEllipse(a, b),
    xRadius: a,
    yRadius: b
  };
}

export function elementsToVectors(primary, masses, g) {
  const primaryWithVectors = {
    ...primary,
    x: 0,
    y: 0,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0
  };

  const output = [primaryWithVectors];

  const referencePlane = masses[0].i;

  for (let i = 0; i < masses.length; i++) {
    const mass = masses[i];

    mass.i = referencePlane - (!isNaN(masses[0].i) ? masses[0].i : 0);

    output.push(getOrbit(primaryWithVectors, mass, g));
  }

  return output;
}

export function getA(apsisOne, apsisTwo) {
  return (apsisOne + apsisTwo) / 2;
}

export function degreesToRadians(degrees) {
  return Math.PI / 180 * degrees;
}

export const calculateOrbitalVertices = (orbitalPeriod, dt, drawLineEvery) => {
  const maxVertices = 2000;
  const orbitalVertices = parseFloat(
    (orbitalPeriod / (dt * drawLineEvery) * 1.1).toFixed(0)
  );

  return orbitalVertices > maxVertices || isNaN(orbitalVertices)
    ? maxVertices
    : orbitalVertices;
};

export function getRandomNumberInRange(min, max) {
  return Math.random() * (max - min) + min;
}

export function getRandomRadian() {
  return Math.PI * 2 * Math.random();
}

export function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function setBarycenter(masses, p = new H3()) {
  const massesLen = masses.length;
  let systemMass = 0;

  p.set({ x: 0, y: 0, z: 0 });
  const massPosition = new H3();

  for (let i = 0; i < massesLen; i++) {
    const mass = masses[i];

    p.add(
      massPosition
        .set({ x: mass.x, y: mass.y, z: mass.z })
        .multiplyByScalar(mass.m)
    );

    systemMass += mass.m;
  }

  p.divideByScalar(systemMass);

  return { m: systemMass, x: p.x, y: p.y, z: p.z, vx: 0, vy: 0, vz: 0 };
}
