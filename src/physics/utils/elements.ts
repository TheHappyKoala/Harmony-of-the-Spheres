import H3 from "./vector";
import { VectorType } from "../../types/physics";

/*

Code written by Hugo Granström

https://github.com/HugoGranstrom

*/

const stateToKepler = (r: VectorType, v: VectorType, gm: number) => {
  let v1 = new H3();
  let v2 = new H3();
  const kHat = { x: 0, y: 0, z: 1 };
  const rNorm = v1.set(r).getLength();
  const vNorm = v1.set(v).getLength();

  const h = v1.set(r).cross(v2.set(v)).toObject(); // v1.set(r).cross(v).toObject();
  const hNorm = v1.set(h).getLength();
  const n = v1.set(kHat).cross(v2.set(h)).toObject(); // normalise?
  const nNorm = v1.set(n).getLength();
  const e1 = v1
    .set(r)
    .multiplyByScalar(vNorm ** 2 - gm / rNorm)
    .toObject();
  const e2 = v1.set(r).dot(v2.set(v));
  const eVec = v1
    .set(e1)
    .subtractScaledVector(e2, v2.set(v))
    .divideByScalar(gm)
    .toObject();
  const e = v1.set(eVec).getLength();
  const E = vNorm ** 2 / 2 - gm / rNorm;
  let a = 0;
  if (e != 1) {
    a = -gm / (2 * E);
  } else {
    a = Infinity;
  }

  const neDot = v1.set(eVec).dot(v2.set(n));
  const reDot = v1.set(r).dot(v2.set(eVec));
  const rvDot = v1.set(r).dot(v2.set(v));

  const i = Math.acos(h.z / hNorm);
  if (i == 0) {
    var lAn = 0;
  } else {
    var lAn = Math.acos(n.x / nNorm);
  }
  if (n.y < 0) {
    lAn = 2 * Math.PI - lAn;
  }
  if (i == 0) {
    var argP = Math.atan2(eVec.y, eVec.x);
    if (h.z < 0) {
      argP = 2 * Math.PI - argP;
    }
  } else {
    var argP = Math.acos(neDot / (nNorm * e));
    if (eVec.z < 0) {
      argP = 2 * Math.PI - argP;
    }
  }

  let trueAnom = Math.acos(reDot / (e * rNorm));

  if (rvDot < 0) {
    trueAnom = 2 * Math.PI - trueAnom;
  }

  let eccAnom = 0;
  let meanAnom = 0;
  if (e > 1) {
    eccAnom =
      2 * Math.atanh(Math.sqrt((e - 1) / (e + 1)) * Math.tan(trueAnom / 2));
    meanAnom = e * Math.sinh(eccAnom) - eccAnom;
  } else if (e < 1) {
    eccAnom =
      2 * Math.atan2(Math.tan(trueAnom / 2), Math.sqrt((1 + e) / (1 - e)));
    meanAnom = eccAnom - e * Math.sin(eccAnom);
  }

  //const convFactor = 180 / Math.PI;

  return {
    a: a, // semi-major axis
    e: e, // eccentricity
    i: i, // inclination
    argP: argP, // argument of periapsis
    lAn: lAn, // longitude of ascending node
    trueAnom: trueAnom, // true anomaly
    eccAnom: eccAnom, // eccentric anomly
    meanAnom: meanAnom, // mean anomaly
  };
};

const keplerToState = (
  orb: any,
  gm: number,
): { posRel: VectorType; velRel: VectorType } => {
  // returns the position and velocity of the orbiting body RELATIVE to the primary body.
  const a = orb.a;
  const e = orb.e;
  const i = orb.i;
  const argP = orb.argP;
  const lAn = orb.lAn;
  const eccAnom = orb.eccAnom;

  let o = { x: 0, y: 0, z: 0 };
  let o_dot = { x: 0, y: 0, z: 0 };
  if (e < 1) {
    const r_c = a * (1 - e * Math.cos(eccAnom)); // distance to central body
    //vectors in orbital plane
    //o = {x: r_c * Math.cos(trueAnom), y: r_c * Math.sin(trueAnom), z: 0}; // position in orbital plane
    const o_dot_factor = Math.sqrt(gm * a) / r_c;
    o.x = a * (Math.cos(eccAnom) - e);
    o.y = a * Math.sin(eccAnom) * Math.sqrt(1 - Math.pow(e, 2));
    o_dot = {
      x: -Math.sin(eccAnom) * o_dot_factor,
      y: Math.sqrt(1 - e * e) * Math.cos(eccAnom) * o_dot_factor,
      z: 0,
    }; // velocity in orbital plane
  } else if (e > 1) {
    o = {
      x: -a * (e - Math.cosh(eccAnom)),
      y: -a * Math.sqrt(e * e - 1) * Math.sinh(eccAnom),
      z: 0,
    };
    const mean_motion = Math.sqrt(gm / Math.pow(Math.abs(a), 3));
    const o_dot_factor = (a * mean_motion) / (e * Math.cosh(eccAnom) - 1);
    o_dot.x = o_dot_factor * Math.sinh(eccAnom);
    o_dot.y = -o_dot_factor * Math.sqrt(e * e - 1) * Math.cosh(eccAnom);
  }
  const X =
    o.x *
      (Math.cos(argP) * Math.cos(lAn) -
        Math.sin(argP) * Math.cos(i) * Math.sin(lAn)) -
    o.y *
      (Math.sin(argP) * Math.cos(lAn) +
        Math.cos(argP) * Math.cos(i) * Math.sin(lAn)); // x-coordinate of position in inertial reference frame
  const Y =
    o.x *
      (Math.cos(argP) * Math.sin(lAn) +
        Math.sin(argP) * Math.cos(i) * Math.cos(lAn)) +
    o.y *
      (Math.cos(argP) * Math.cos(i) * Math.cos(lAn) -
        Math.sin(argP) * Math.sin(lAn));
  const Z =
    o.x * (Math.sin(argP) * Math.sin(i)) + o.y * (Math.cos(argP) * Math.sin(i));
  const VX =
    o_dot.x *
      (Math.cos(argP) * Math.cos(lAn) -
        Math.sin(argP) * Math.cos(i) * Math.sin(lAn)) -
    o_dot.y *
      (Math.sin(argP) * Math.cos(lAn) +
        Math.cos(argP) * Math.cos(i) * Math.sin(lAn));
  const VY =
    o_dot.x *
      (Math.cos(argP) * Math.sin(lAn) +
        Math.sin(argP) * Math.cos(i) * Math.cos(lAn)) +
    o_dot.y *
      (Math.cos(argP) * Math.cos(i) * Math.cos(lAn) -
        Math.sin(argP) * Math.sin(lAn));
  const VZ =
    o_dot.x * (Math.sin(argP) * Math.sin(i)) +
    o_dot.y * (Math.cos(argP) * Math.sin(i));
  return { posRel: { x: X, y: Y, z: Z }, velRel: { x: VX, y: VY, z: VZ } };
};

export { stateToKepler, keplerToState };
