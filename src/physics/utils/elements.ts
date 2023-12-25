import H3 from "./vector";
import { VectorType } from "../../types/physics";

/*

Code written by Hugo Granström

https://github.com/HugoGranstrom

*/

const stateToKepler = (r: VectorType, v: VectorType, mu: number) => {
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
    .multiplyByScalar(vNorm ** 2 - mu / rNorm)
    .toObject();
  const e2 = v1.set(r).dot(v2.set(v));
  const eVec = v1
    .set(e1)
    .subtractScaledVector(e2, v2.set(v))
    .divideByScalar(mu)
    .toObject();
  const e = v1.set(eVec).getLength();
  const E = vNorm ** 2 / 2 - mu / rNorm;
  let a = 0;
  if (e != 1) {
    a = -mu / (2 * E);
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

export { stateToKepler };
