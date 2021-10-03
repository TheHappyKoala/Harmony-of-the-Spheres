import H3 from "./vectors";

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
  return Math.sqrt((2 * g * m) / d);
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
    .rotate({ x: 0, y: 0, z: 1 }, secondary.w - 180)
    .rotate({ x: 1, y: 0, z: 0 }, secondary.i)
    .rotate({ x: 0, y: 0, z: 1 }, secondary.o);

  const secondaryV = new H3()
    .set({
      x: (-dParams.dy * vMag) / d,
      y: (dParams.dx * vMag) / d,
      z: (dParams.dz * vMag) / d
    })
    .rotate({ x: 0, y: 0, z: 1 }, secondary.w - 180)
    .rotate({ x: 1, y: 0, z: 0 }, secondary.i)
    .rotate({ x: 0, y: 0, z: 1 }, secondary.o);

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

  const referencePlane = 0;

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
  return (Math.PI / 180) * degrees;
}

export const radiansToDegrees = radians => radians * 57.295779513;

export const calculateOrbitalVertices = (orbitalPeriod, dt) => {
  const maxVertices = 30000;
  const orbitalVertices = parseFloat(((orbitalPeriod / dt) * 1.1).toFixed(0));

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

export function setBarycenter(masses, p = new H3(), v = new H3()) {
  const massesLen = masses.length;
  let systemMass = 0;

  p.set({ x: 0, y: 0, z: 0 });
  v.set({ x: 0, y: 0, z: 0 });

  const massPosition = new H3();
  const massVelocity = new H3();

  for (let i = 0; i < massesLen; i++) {
    const mass = masses[i];

    p.add(
      massPosition
        .set({ x: mass.x, y: mass.y, z: mass.z })
        .multiplyByScalar(mass.m)
    );

    v.add(
      massVelocity
        .set({ x: mass.vx, y: mass.vy, z: mass.vz })
        .multiplyByScalar(mass.m)
    );

    systemMass += mass.m;
  }

  p.divideByScalar(systemMass);
  v.divideByScalar(systemMass);

  return { m: systemMass, x: p.x, y: p.y, z: p.z, vx: v.x, vy: v.y, vz: v.z };
}

export const clamp = (x, min, max) => {
  if (x < min) {
    return min;
  }
  if (x > max) {
    return max;
  }

  return x;
};

export const colorTemperatureToRGB = kelvin => {
  var temp = kelvin / 100;

  var red, green, blue;

  if (temp <= 66) {
    red = 255;

    green = temp;
    green = 99.4708025861 * Math.log(green) - 161.1195681661;

    if (temp <= 19) {
      blue = 0;
    } else {
      blue = temp - 10;
      blue = 138.5177312231 * Math.log(blue) - 305.0447927307;
    }
  } else {
    red = temp - 60;
    red = 329.698727446 * Math.pow(red, -0.1332047592);

    green = temp - 60;
    green = 288.1221695283 * Math.pow(green, -0.0755148492);

    blue = 255;
  }

  return {
    r: clamp(red, 0, 255),
    g: clamp(green, 0, 255),
    b: clamp(blue, 0, 255)
  };
};

const calculateAlpha = (m1, m2) => m2 / (m1 + m2);

const calculateBeta = (m1, m2) => (m1 - m2) / (m1 + m2);

const calculateL1R = (alpha, d, v) => ({
  x: d - d * (1 - Math.pow(alpha / 3, 1 / 3)),
  y: 0,
  z: 0
});

const calculateL2R = (alpha, d, v) => ({
  x: d - d * (1 + Math.pow(alpha / 3, 1 / 3)),
  y: 0,
  z: 0
});

const calculateL3R = (alpha, d, v) => ({
  x: d - -d * (1 + (5 * alpha) / 12),
  y: 0,
  z: 0
});

const calculateL4R = (beta, d, v) => ({
  x: d - (d / 2) * beta,
  y: (Math.sqrt(3) / 2) * d,
  z: 0
});

const calculateL5R = (beta, d, v) => ({
  x: d - (d / 2) * beta,
  y: -(Math.sqrt(3) / 2) * d,
  z: 0
});

export const getLagrangePoints = (m1, m2) => {
  const d = Math.sqrt(getDistanceParams(m1, m2).dSquared);
  const alpha = calculateAlpha(m1.m, m2.m);
  const beta = calculateBeta(m1.m, m2.m);

  return [
    calculateL1R(alpha, d),
    calculateL2R(alpha, d),
    calculateL3R(alpha, d),
    calculateL4R(beta, d),
    calculateL5R(beta, d)
  ];
};
