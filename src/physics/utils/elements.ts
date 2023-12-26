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

const getDistanceParams = (p1: VectorType, p2: VectorType) => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dz = p2.z - p1.z;

  return { dx, dy, dz, dSquared: dx * dx + dy * dy + dz * dz };
};

const getObjFromArrByKeyValuePair = (arr: any[], key: string, val: any) => {
  const obj = arr.filter((entry) => entry[key].indexOf(val) > -1)[0];

  return typeof obj !== "undefined" ? obj : {};
};

const radiusSOI = (largerMass: any, smallerMass: any): number => {
  const d = Math.sqrt(getDistanceParams(largerMass, smallerMass).dSquared);
  return d * Math.pow(smallerMass.m / largerMass.m, 2 / 5);
};

const recursiveTree = (tree: any): any => {
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
          getDistanceParams(children[i], children[j]).dSquared,
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
};

// remove position as it may change
const simplifyTree = (tree: any): any => {
  let newTree = {
    name: tree.name,
    children: tree.children,
    SOIradius: tree.SOIradius,
  };
  if (newTree.children.length == 0) {
    return newTree;
  }
  for (let i = 0; i < newTree.children.length; i++) {
    newTree.children[i] = simplifyTree(newTree.children[i]);
  }
  return newTree;
};

// masses is scenario.masses
const constructSOITree = (masses: any): any => {
  //const sun: MassType = getObjFromArrByKeyValuePair(masses, 'name', 'Sun');
  let sun = masses[0];
  // Search for the first star, otherwise use the first mass as root
  for (let i = 0; i < masses.length; i++) {
    if (masses[i].type == "star") {
      sun = masses[i];
      break;
    }
  }
  let tree = {
    SOIradius: 1e100,
    children: [],
    name: sun?.name,
    m: sun?.m,
    x: sun?.position.x,
    y: sun?.position.y,
    z: sun?.position.z,
  };

  masses.forEach((val: any) => {
    if (val.name != sun.name) {
      let newVal = {
        SOIradius: 0,
        children: [],
        name: val.name,
        m: val.m,
        x: val.position.x,
        y: val.position.y,
        z: val.position.z,
      };

      // @ts-ignore
      tree.children.push(newVal);
    }
  });
  tree = recursiveTree(tree);
  // construct simplified tree with just name and SOIradius
  const simpleTree = simplifyTree(tree);
  return simpleTree;
};

export { stateToKepler, keplerToState, constructSOITree };
