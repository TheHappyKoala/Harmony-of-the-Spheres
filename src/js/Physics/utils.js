import * as THREE from 'three';
import H3 from './vectors';

export function getDistanceParams(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dz = p2.z - p1.z;

  return { dx, dy, dz, dSquared: dx * dx + dy * dy + dz * dz };
}

/*
 * Get the magnitude of the velocity of a celestial object orbiting a significantly more massive primary
 * Like, for example, Jupiter, or Earth, around the Sun
 * g is the gravitational constant, primary is the more massive object around which the other orbits
 * d is the distance between the primary and secondary and sm is the semimajor axis
 * If the semimajor axis and the distance are the same, you have the special case of a perfectly circular orbit
 * If an argument is not provided for the sm parameter, it is set to be equal to d, so you get the velocity for a circular orbit
*/

export function getVMag(g, primary, d, a = d) {
  return Math.sqrt(Math.abs(g * primary.m * (2 / d - 1 / a)));
}

export function getOrbit(primary, secondary, g, fromElements = true) {
  const x = primary.x !== undefined ? primary.x : 0;
  const y = primary.y !== undefined ? primary.y : 0;
  const z = primary.z !== undefined ? primary.z : 0;
  const { vx, vy, vz } = primary;

  secondary = {
    ...secondary,
    x:
      fromElements === true
        ? getApoapsis(secondary.a, secondary.e)
        : secondary.x,
    y: fromElements === true ? 0 : secondary.y,
    z: fromElements === true ? 0 : secondary.z
  };

  const dParams = getDistanceParams(primary, secondary);

  const d = Math.sqrt(dParams.dSquared);

  const vMag = getVMag(g, primary, d, secondary.a);

  const orbit = {
    ...secondary,
    vx: -dParams.dy * vMag / d,
    vy: dParams.dx * vMag / d,
    vz: dParams.dz * vMag / d
  };

  if (fromElements) {
    const pWithW = rotateVector(orbit.x, orbit.y, orbit.z, secondary.w);
    const vWithW = rotateVector(orbit.vx, orbit.vy, orbit.vz, secondary.w);

    const pWithI = rotateVector(
      pWithW.x,
      pWithW.y,
      pWithW.z,
      secondary.i,
      new THREE.Vector3(0, 1, 0)
    );
    const vWithI = rotateVector(
      vWithW.x,
      vWithW.y,
      vWithW.z,
      secondary.i,
      new THREE.Vector3(0, 1, 0)
    );

    return {
      ...secondary,
      x: x + pWithI.x,
      y: y + pWithI.y,
      z: z + pWithI.z,
      vx: vx + vWithI.x,
      vy: vy + vWithI.y,
      vz: vz + vWithI.z
    };
  } else
    return {
      ...orbit,
      x: x + orbit.x,
      y: y + orbit.y,
      z: z + orbit.z,
      vx: vx + orbit.vx,
      vy: vy + orbit.vy,
      vz: vz + orbit.vz
    };
}

export function getPeriapsis(a, e) {
  return a * (1 - e);
}

export function getApoapsis(a, e) {
  return a * (1 + e);
}

/*
 * Converts an array of masses whose orbits are defined by orbital elements 
 * into an array of masses whose orbits are defined by state vectors
 * 
 * Used mostly for simulating exoplanetary systems for which data is usually only available
 * in the form of orbital elements.
 *
 * Accepts a primary, {}, i.e the mass around which the other masses orbit
 * An array of masses whose orbits are defined by orbital elements
 * The value of the gravitational constant
*/

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

    mass.i = referencePlane - mass.i;

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

/*
 * This method takes a point in 3D space and calculates the point on a given sphere that is closest to it
 * It takes the rotation of the sphere into account 
*/

export function getClosestPointOnSphere(point, spherePos, radius, rotation) {
  return point
    .sub(spherePos)
    .normalize()
    .multiplyScalar(radius)
    .add(spherePos)
    .applyAxisAngle(new THREE.Vector3(1, 0, 0), -rotation.x)
    .applyAxisAngle(new THREE.Vector3(0, 1, 0), -rotation.y)
    .applyAxisAngle(new THREE.Vector3(0, 0, 1), -rotation.z);
}

export function rotateVector(
  x,
  y,
  z,
  degrees = 0,
  axis = new THREE.Vector3(0, 0, 1),
  vector = new THREE.Vector3()
) {
  return vector.set(x, y, z).applyAxisAngle(axis, degreesToRadians(degrees));
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
