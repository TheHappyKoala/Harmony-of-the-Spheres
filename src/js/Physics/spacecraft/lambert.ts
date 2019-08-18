// Implementation from https://github.com/poliastro/poliastro/

import H3 from '../vectors';
import { VectorType, MassType, SOITree } from '../types';
import { getDistanceParams } from '../utils';
import { getObjFromArrByKeyValuePair } from '../../utils';
function hyp2f1b(x: number): number {
  let res = 1.0;
  let resOld = 1.0;
  let term = 1.0;
  let ii = 0;
  while (true) {
    term = term * (3 + ii) * (1 + ii) / (5 / 2 + ii) * x / (ii + 1);
    resOld = res;
    res += term;
    if (resOld == res) {
      return res;
    }
    ii += 1;
  }
}

function initial_guess(T: number, ll: number, M: number): Array<number> {
  if (M == 0) {
    const T0 = Math.acos(ll) + ll * Math.sqrt(1 - ll * ll) + M * Math.PI;
    const T1 = 2 * (1 - ll * ll * ll) / 3;
    let x0 = 0;
    if (T >= T0) {
      x0 = Math.pow(T0 / T, 2 / 3) - 1;
    } else if (T < T1) {
      x0 = 5 / 2 * T1 / T * (T1 - T) / (1 - Math.pow(ll, 5)) + 1;
    } else {
      x0 = Math.pow(T0 / T, Math.log2(T1 / T0)) - 1;
    }
    return [x0];
  } else {
    const pi = Math.PI;
    const x_0l =
      (((M * pi + pi) / (8 * T)) ** (2 / 3) - 1) /
      (((M * pi + pi) / (8 * T)) ** (2 / 3) + 1);
    const x_0r =
      ((8 * T / (M * pi)) ** (2 / 3) - 1) / ((8 * T / (M * pi)) ** (2 / 3) + 1);

    return [x_0l, x_0r];
  }
}

function tofEq(x: number, T0: number, ll: number, M: number): number {
  return tofEqY(x, computeY(x, ll), T0, ll, M);
}

function computeTmin(
  ll: number,
  M: number,
  numiter: number,
  rtol: number
): number {
  if (ll == 1) {
    return tofEq(0.0, 0.0, ll, M);
  } else {
    if (M == 0) {
      return 0.0;
    } else {
      const xi = 0.1;
      const Ti = tofEq(xi, 0.0, ll, M);
      const xTmin = halley(xi, Ti, ll, rtol, numiter);
      const Tmin = tofEq(xTmin, 0.0, ll, M);
      return Tmin;
    }
  }
}

function computeY(x: number, ll: number): number {
  return Math.sqrt(1 - ll ** 2 * (1 - x ** 2));
}

function computePsi(x: number, y: number, ll: number): number {
  if (-1 <= x && x < 1) {
    return Math.acos(x * y + ll * (1 - x * x));
  } else if (1 < x) {
    return Math.asinh((y - x * ll) * Math.sqrt(x * x - 1));
  } else {
    return 0.0;
  }
}

function tofEqY(x: number, y: number, T0: number, ll: number, M: number) {
  let T = 0;
  if (M == 0 && (Math.sqrt(0.6) < x && x < Math.sqrt(1.4))) {
    const eta = y - ll * x;
    const S1 = (1 - ll - x * eta) * 0.5;
    const Q = 4 / 3 * hyp2f1b(S1);
    T = (eta * eta * eta * Q + 4 * ll * eta) * 0.5;
  } else {
    const psi = computePsi(x, y, ll);
    T =
      ((psi + M * Math.PI) / Math.sqrt(Math.abs(1 - x * x)) - x + ll * y) /
      (1 - x * x);
  }
  return T - T0;
}

function tofEqP(x: number, y: number, T: number, ll: number): number {
  return (3 * T * x - 2 + 2 * ll * ll * ll * x / y) / (1 - x * x);
}

function tofEqP2(
  x: number,
  y: number,
  T: number,
  dT: number,
  ll: number
): number {
  return (
    (3 * T + 5 * x * dT + 2 * (1 - ll * ll) * ll * ll * ll / (y * y * y)) /
    (1 - x * x)
  );
}

function tofEqP3(
  x: number,
  y: number,
  trash: number,
  dT: number,
  ddT: number,
  ll: number
): number {
  return (
    (7 * x * ddT + 8 * dT - 6 * (1 - ll * ll) * ll ** 5 * x / y ** 5) /
    (1 - x ** 2)
  );
}

function halley(
  p0: number,
  T0: number,
  ll: number,
  tol: number,
  maxiter: number
): number {
  let y = 0;
  let p = 0;
  let fder = 0;
  let fder2 = 0;
  let fder3 = 0;
  for (let ii = 0; ii < maxiter; ii++) {
    y = computeY(p0, ll);
    fder = tofEqP(p0, y, T0, ll);
    fder2 = tofEqP2(p0, y, T0, fder, ll);
    if (fder2 == 0) {
      console.log('fder2 was 0');
    }
    fder3 = tofEqP3(p0, y, T0, fder, fder2, ll);
    p = p0 - 2 * fder * fder2 / (2 * fder2 ** 2 - fder * fder3);
    if (Math.abs(p - p0) < tol) {
      return p;
    }
    p0 = p;
  }
  console.log('halley failed :(');
}

function householder(
  p0: number,
  T0: number,
  ll: number,
  M: number,
  tol: number,
  maxiter: number
): number {
  let y = 0;
  let p = 0;
  let fval = 0;
  let T = 0;
  let fder = 0;
  let fder2 = 0;
  let fder3 = 0;
  for (let i = 0; i < maxiter; i++) {
    y = computeY(p0, ll);
    fval = tofEqY(p0, y, T0, ll, M);
    T = fval + T0;
    fder = tofEqP(p0, y, T, ll);
    fder2 = tofEqP2(p0, y, T, fder, ll);
    fder3 = tofEqP3(p0, y, T, fder, fder2, ll);
    p =
      p0 -
      fval *
        ((fder * fder - fval * fder2 / 2) /
          (fder * (fder * fder - fval * fder2) + fder3 * fval * fval / 6));
    if (Math.abs(p - p0) < tol) {
      return p;
    }
    p0 = p;
  }
  console.log('householder failed');
}

export function findXY(
  ll: number,
  T: number,
  M: number,
  numiter: number,
  rtol: number
): Array<{ x: number; y: number }> {
  let Mmax = Math.floor(T / Math.PI);
  const T00 = Math.acos(ll) + ll * Math.sqrt(1 - ll * ll);

  // Refine maximum number of revolutions if necessary (NotImplemented)
  if (T < T00 + Mmax * Math.PI && Mmax > 0) {
    const Tmin = computeTmin(ll, Mmax, numiter, rtol);
    if (T < Tmin) {
      Mmax -= 1;
    }
  }
  if (M > Mmax) {
    console.log('M > Mmax error');
  }

  const initGuesses = initial_guess(T, ll, M);
  let xys: Array<{ x: number; y: number }> = [];
  initGuesses.forEach(x0 => {
    const x = householder(x0, T, ll, M, rtol, numiter);
    const y = computeY(x, ll);
    xys.push({ x: x, y: y });
  });
  return xys;
}

export function reconstruct(
  x: number,
  y: number,
  r1: number,
  r2: number,
  ll: number,
  gamma: number,
  rho: number,
  sigma: number
): { Vr1: number; Vr2: number; Vt1: number; Vt2: number } {
  const Vr1 = gamma * (ll * y - x - rho * (ll * y + x)) / r1;
  const Vr2 = -gamma * (ll * y - x + rho * (ll * y + x)) / r2;
  const Vt1 = gamma * sigma * (y + ll * x) / r1;
  const Vt2 = gamma * sigma * (y + ll * x) / r2;
  return { Vr1, Vr2, Vt1, Vt2 };
}

// centralBody needs m, x, y, z, vx, vy, vz
// r1, r2 relative to inertial ref. system (ie not relative to centralBody)
export function planFlight(
  tof: number,
  r1: VectorType,
  r2: VectorType,
  centralBody: MassType,
  g = 39.5,
  M = 0,
  rtol = 1e-8,
  maxiter = 35
): Array<{ initVel: VectorType; finalVel: VectorType }> {
  const v1 = new H3();
  const rCentral = { x: centralBody.x, y: centralBody.y, z: centralBody.z };
  const vCentral = { x: centralBody.vx, y: centralBody.vy, z: centralBody.vz };
  const r1Rel = v1
    .set(r1)
    //.subtract(rCentral)
    .toObject();
  const r2Rel = v1
    .set(r2)
    //.subtract(rCentral)
    .toObject();
  const gm = g * centralBody.m;

  const c = v1
    .set(r2Rel)
    .subtract(r1Rel)
    .toObject();
  const cNorm = v1.set(c).getLength();
  const r1Norm = v1.set(r1Rel).getLength();
  const r2Norm = v1.set(r2Rel).getLength();
  const s = 0.5 * (r1Norm + r2Norm + cNorm);

  const ir1 = v1
    .set(r1)
    .divideByScalar(r1Norm)
    .toObject();
  const ir2 = v1
    .set(r2)
    .divideByScalar(r2Norm)
    .toObject();
  let ih = v1
    .set(ir1)
    .cross(ir2)
    .normalise()
    .toObject();

  let ll = Math.sqrt(1 - Math.min(1.0, cNorm / s));

  if (ih.z < 0) {
    ll = -ll;
    ih = v1
      .set(ih)
      .multiplyByScalar(-1)
      .toObject();
  }

  const it1 = v1
    .set(ih)
    .cross(ir1)
    .toObject();
  const it2 = v1
    .set(ih)
    .cross(ir2)
    .toObject();

  const T = Math.sqrt(2 * gm / s ** 3) * tof;

  const xy = findXY(ll, T, M, maxiter, rtol);

  const gamma = Math.sqrt(gm * s / 2);
  const rho = (r1Norm - r2Norm) / cNorm;
  const sigma = Math.sqrt(1 - rho ** 2);

  let result: Array<{ initVel: VectorType; finalVel: VectorType }> = [];
  xy.forEach(i => {
    const { Vr1, Vr2, Vt1, Vt2 } = reconstruct(
      i.x,
      i.y,
      r1Norm,
      r2Norm,
      ll,
      gamma,
      rho,
      sigma
    );
    const initVel = v1
      .set(ir1)
      .multiplyByScalar(Vr1)
      .addScaledVector(Vt1, it1)
      .add(vCentral)
      .toObject();
    const finalVel = v1
      .set(ir2)
      .multiplyByScalar(Vr2)
      .addScaledVector(Vt2, it2)
      .add(vCentral)
      .toObject();
    result.push({ initVel: initVel, finalVel: finalVel });
  });

  return result;
}

export function stateToKepler(
  r: { x: number; y: number; z: number },
  v: { x: number; y: number; z: number },
  mu: number
): {
  a: number;
  e: number;
  i: number;
  argp: number;
  omega: number;
  vi: number;
} {
  let v1 = new H3();
  let v2 = new H3();
  const kHat = { x: 0, y: 0, z: 1 };
  const rNorm = v1.set(r).getLength();
  const vNorm = v1.set(v).getLength();

  const h = v1
    .set(r)
    .cross(v2.set(v))
    .toObject(); // v1.set(r).cross(v).toObject();
  const hNorm = v1.set(h).getLength();
  const n = v1
    .set(kHat)
    .cross(v2.set(h))
    .toObject(); // normalise?
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
  let p = 0;
  if (e != 1) {
    a = -mu / (2 * E);
    p = a * (1 - e ** 2);
  } else {
    p = hNorm ** 2 / mu;
    a = Infinity;
  }

  const neDot = v1.set(eVec).dot(v2.set(n));
  const reDot = v1.set(r).dot(v2.set(eVec));
  const rvDot = v1.set(r).dot(v2.set(v));

  const i = Math.acos(h.z / hNorm);
  let omega = Math.acos(n.x / nNorm);
  if (n.y < 0) {
    omega = 2 * Math.PI - omega;
  }
  let w = Math.acos(neDot / (nNorm * e));
  if (eVec.z < 0) {
    w = 2 * Math.PI - w;
  }
  let vi = Math.acos(reDot / (e * rNorm));
  if (rvDot < 0) {
    vi = 2 * Math.PI - vi;
  }

  const convFactor = 180 / Math.PI;

  return {
    a: a,
    e: e,
    i: i * convFactor,
    argp: w * convFactor,
    omega: omega * convFactor,
    vi: vi * convFactor
  };
}

function radiusSOI(largerMass: SOITree, smallerMass: SOITree): number {
  const d = Math.sqrt(getDistanceParams(largerMass, smallerMass).dSquared);
  return d * Math.pow(smallerMass.m / largerMass.m, 2 / 5);
}

function recursiveTree(tree: SOITree): SOITree {
  if (tree.children.length == 0) {
    return tree;
  }
  let children = tree.children;
  // Calculate the Sphere of Influence relative to the tree root
  for (let i = 0; i < tree.children.length; i++) {
    children[i].SOIradius = radiusSOI(tree, children[i]);
  }
  // Sort and place bodies
  var len = children.length;
  var i = 0;
  while (i < len) {
    var j = 0;
    while (j < len) {
      if (i != j) {
        const d = Math.sqrt(
          getDistanceParams(children[i], children[j]).dSquared
        );
        if (d < children[i].SOIradius) {
          children[i].children.push(children[j]);
          children.splice(j, 1);
          len -= 1;
          if (j < i) {
            i--;
          }
        } else {
          j++;
        }
      } else {
        j++;
      }
    }
    i = i + 1;
  }
  // Do all of the above recursivly for all remaining direct children of the root
  for (let i = 0; i < children.length; i++) {
    children[i] = recursiveTree(children[i]);
  }
  tree.children = children;
  return tree;
}

function simplifyTree(tree: SOITree): SOITree {
  let newTree = {
    name: tree.name,
    children: tree.children,
    SOIradius: tree.SOIradius
  };
  if (newTree.children.length == 0) {
    return newTree;
  }
  for (let i = 0; i < newTree.children.length; i++) {
    newTree.children[i] = simplifyTree(newTree.children[i]);
  }
  return newTree;
}

// masses is scenario.masses
export function constructSOITree(masses: Array<MassType>): SOITree {
  const sun: MassType = getObjFromArrByKeyValuePair(masses, 'name', 'Sun');
  let tree: SOITree = {
    SOIradius: 1e100,
    children: [],
    name: 'Sun',
    m: sun.m,
    x: sun.x,
    y: sun.y,
    z: sun.z
  };
  masses.forEach(val => {
    if (val.name != 'Sun') {
      let newVal: SOITree = {
        SOIradius: 0,
        children: [],
        name: val.name,
        m: val.m,
        x: val.x,
        y: val.y,
        z: val.z
      };
      tree.children.push(newVal);
    }
  });
  tree = recursiveTree(tree);
  // construct simplified tree with just name and SOIradius
  const simpleTree = simplifyTree(tree);
  return simpleTree;
}

// pos is the position and masses is scenario.masses
export function findCurrentSOI(
  pos: MassType,
  tree: SOITree,
  masses: Array<MassType>
): MassType {
  if (tree.children.length == 0) {
    return getObjFromArrByKeyValuePair(masses, 'name', tree.name);
  }
  for (let i = 0; i < tree.children.length; i++) {
    if (tree.children[i].name == pos.name) {
      continue;
    }
    const currentBody: MassType = getObjFromArrByKeyValuePair(
      masses,
      'name',
      tree.children[i].name
    );
    const d = Math.sqrt(getDistanceParams(currentBody, pos).dSquared);
    if (d < tree.children[i].SOIradius) {
      return findCurrentSOI(pos, tree.children[i], masses);
    }
  }
  return getObjFromArrByKeyValuePair(masses, 'name', tree.name);
}

export function reverseAcceleration(
  pos: MassType,
  primary: MassType,
  g = 39.5
): VectorType {
  const rVec = new H3().set({
    x: pos.x - primary.x,
    y: pos.y - primary.y,
    z: pos.z - primary.z
  });
  const r = rVec.getLength();
  const reverseAcc = rVec.multiplyByScalar(g * primary.m / r ** 3).toObject();
  return reverseAcc;
}
/*
export function allPassingSOI(tree: SOITree, name: string){
  if (tree.name == name){
    return name;
  }
  // Check tree's children
  for (let i = 0; i < tree.children.length; i++){
    if (tree.children[i].name == name){
      return name;
    }
  }
  // Check tree's grandchildren
  for (let i = 0; i < tree.children.length; i++){

  }
}
*/

// ellipseTest() {

//   /*
//   const rEarth = {x: 0.4240363252016235, y: -0.9248449798862485, z: -1.232690294681233e-4};
//   const rMars = {x: 0.1609433119907515, y: -1.432665781988499, z: -0.03393579925893126};
//   const g = 39.5;
//   const Sun = {m: 1, x: 0.004494747940528018,
//     y: 9.145777867796766e-4,
//     z: -6.127893755128986e-5,
//     vx: -1.7443876658803292e-4,
//     vy: 0.002043973630637931,
//     vz: -4.697196039923407e-6
//   };

//   const tof = 0.5;
//   const maxiter = 35;
//   const M = 0;
//   const rtol = 1e-8;
//   const vs = planFlight(tof, rEarth, rMars, Sun, g, M, rtol, maxiter);
//   console.log(vs);

//   const scenario = this.scenario;
//   const primary = getObjFromArrByKeyValuePair(
//     scenario.masses,
//     'name',
//     scenario.primary
//   );
//   const scale = scenario.scale;
//   const ellipse = getEllipse(0.7776923423682557, 0.8667555109899555);
//   this.ellipseCurve.position.z =
//     (this.rotatingReferenceFrame.z - primary.z) * scale;
//   this.ellipseCurve.update(
//     (this.rotatingReferenceFrame.x - primary.x - ellipse.focus) * scale,
//     (this.rotatingReferenceFrame.y - primary.y) * scale,
//     ellipse.xRadius * scale,
//     ellipse.yRadius * scale,
//     0,
//     2 * Math.PI,
//     false,
//     0,
//     { x: scenario.i, y: 0, z: scenario.w + scenario.e * 360 }
//   );
//   */
//   this.ellipseCurve.visible = true;
//   const scenario = this.scenario;
//   const primary = getObjFromArrByKeyValuePair(
//     scenario.masses,
//     'name',
//     scenario.primary
//   );

//   const earth = getObjFromArrByKeyValuePair(scenario.masses, 'name', 'Earth');
//   const mars = getObjFromArrByKeyValuePair(scenario.masses, 'name', 'Mars');
//   const tof = 0.5;
//   const M = 0;
//   const numiter = 35;
//   const rtol = 1e-15;
//   const k = primary.m * 39.5;

//   const vs = planFlight(tof, earth, mars, primary, 39.5, M, rtol, numiter);
//   const initVelocity = vs[0].initVel;

//   /*
//   const c = v2.set(vecMars).subtract(v1.set(vecEarth)).toObject();
//   const cNorm = v1.set(c).getLength();
//   const r1 = v1.set(vecEarth).getLength();
//   const r2 = v1.set(vecMars).getLength();
//   const s = 0.5 * (r1 + r2 + cNorm);

//   const ir1 = v1.set(vecEarth).normalise().toObject();
//   const ir2 = v1.set(vecMars).normalise().toObject();
//   let ih = v1.set(vecEarth).cross(v2.set(vecMars)).normalise().toObject();

//   let ll = Math.sqrt(1 - Math.min(1.0, cNorm / s));
//   if (ih.z < 0) {
//     ll = -ll;
//     ih = v1.set(ih).multiplyByScalar(-1).toObject();
//   }
//   const it1 = v1.set(ih).cross(v2.set(ir1)).toObject();
//   const it2 = v1.set(ih).cross(v2.set(ir2)).toObject();

//   const T = Math.sqrt(2 * k /(s ** 3)) * tof;

//   const gamma = Math.sqrt(k * s / 2);
//   const rho = (r1 - r2) / cNorm;
//   const sigma = Math.sqrt(1 - rho * rho);
//   const sol = findXY(ll, T, M, numiter, rtol);
//   const {x, y} = sol[0];
//   const {Vr1, Vr2, Vt1, Vt2} = reconstruct(x, y, r1, r2, ll, gamma, rho, sigma);
//   const initVelocity = v1.set(ir1).multiplyByScalar(Vr1).addScaledVector(Vt1, v2.set(it1)).toObject();
//   const finalVelocity = v1.set(ir2).multiplyByScalar(Vr2).addScaledVector(Vt2, v2.set(it2)).toObject();
//   console.log("Final: ", finalVelocity);
//   console.log("Initial: ", initVelocity);
//   */

//   const keplerElements = stateToKepler(earth, initVelocity, k);
//   //console.log("a: ", keplerElements.a)
//   //console.log("e: ", keplerElements.e)
//   //console.log("blandat: ", { x: keplerElements.argp, y: keplerElements.i, z: keplerElements.omega })
//   const scale = scenario.scale;
//   const ellipse = getEllipse(keplerElements.a, keplerElements.e);
//   this.ellipseCurve.position.z =
//     (this.rotatingReferenceFrame.z - primary.z) * scale;
//   console.log({ x: keplerElements.argp, y: keplerElements.i, z: keplerElements.omega })
//   console.log(keplerElements.a, keplerElements.e)
//   this.ellipseCurve.update(
//     (this.rotatingReferenceFrame.x - primary.x - ellipse.focus) * scale,
//     (this.rotatingReferenceFrame.y - primary.y) * scale,
//     ellipse.xRadius * scale,
//     ellipse.yRadius * scale,
//     0,
//     2 * Math.PI,
//     false,
//     0,
//     { x: scenario.i, y: scenario.w, z: keplerElements.argp + keplerElements.omega - 180 }
//   );

//   //if (v1.cross(v2).x === 0) {return}

//   /*
//   const r1 = Math.sqrt(
//     Math.pow(Math.abs(earth.x - primary.x), 2) +
//       Math.pow(Math.abs(earth.y - primary.y), 2) +
//       Math.pow(Math.abs(earth.z - primary.z), 2)
//   );
//   const r2 = Math.sqrt(
//     Math.pow(Math.abs(mars.x - primary.x), 2) +
//       Math.pow(Math.abs(mars.y - primary.y), 2) +
//       Math.pow(Math.abs(mars.z - primary.z), 2)
//   );
//   const rm = (r1 + r2) / 2;
//   const dotProduct = earth.x * mars.x + earth.y * mars.y + earth.z * mars.z;
//   const cosAlpha = dotProduct / (r1 * r2);
//   //const alpha = Math.acos(cosAlpha)
//   //const sinAlpha = Math.sin(alpha)
//   const d = Math.sqrt(r1 * r1 + r2 * r2 - 2 * r1 * r2 * cosAlpha) / 2;
//   const A = (r2 - r1) / 2;
//   const B = Math.sqrt(d * d - A * A);
//   const E = d / A;
//   const x0 = -rm / E;
//   const y0 = B * Math.sqrt(Math.pow(Math.abs(x0 / A), 2) - 1);
//   const y = 1;
//   const x = A * Math.sqrt(1 + Math.pow(Math.abs(y / B), 2));
//   const a = (rm + E * x) / 2;
//   const e =
//     Math.sqrt(Math.pow(Math.abs(x0 - x), 2) + Math.pow(Math.abs(y0 - y), 2)) /
//     (2 * a);

//   const normalVector = {
//     x: earth.y * mars.z - earth.z * mars.y,
//     y: earth.z * mars.x - earth.x * mars.z,
//     z: earth.x * mars.y - earth.y * mars.x
//   };
//   const normalLength = Math.sqrt(
//     normalVector.x * normalVector.x +
//       normalVector.y * normalVector.y +
//       normalVector.z * normalVector.z
//   );
//   const cosIncl = normalVector.z / normalLength;
//   const i = Math.acos(cosIncl) * 180 / Math.PI;
//   //let sinTrueAnomaly = ((x0 + d) - y0) / r1
//   //if (sinAlpha < 0) {
//   //  sinTrueAnomaly = -sinTrueAnomaly
//   //}

//   const ellipse = getEllipse(a, e);
//   */
// },
