/*
 * Data used to calculate the orbits for the planets of the Trappist systemfrom 
 * https://en.wikipedia.org/wiki/TRAPPIST-1#Planetary_system
 * and
 * http://www.milkywaygalaxyatlas.com/starsystem0_100_trappist1system_trappist1_h_data.php
 * 
 * Calculated the state vectors manually in the console with the code below
 * (advanced the system a couple of iterations so the planets would not all be lined up on the x axis, 
 * ugly way of obtaining the state vectors, but the orbits are correct with the right periods and 
 * eccentricities, so yay).
 * NOTE: Need to write a node.js script for this as we will use this routine to calculate 
 * state vectors for pretty much all exo planetary systems!!!   
 * 
 * const primary = {
  name: "Trappist 1",
  m: 0.089,
  x: 0,
  y: 0,
  z: 0,
  vx: 0,
  vy: 0,
  vz: 0
};

const planets = [
  {
    name: "b",
    x: 0.01111, //Average orbital distance
    y: 0,
    z: 0,
    sm: 0.01154775 //Semimajor axis
  },
  {
    name: "c",
    x: 0.01522,
    y: 0,
    z: 0,
    sm: 0.01581512
  },
  {
    name: "d",
    x: 0.0214,
    y: 0,
    z: 0,
    sm: 0.02228038
  },
  {
    name: "e",
    x: 0.028,
    y: 0,
    z: 0,
    sm: 0.02928285
  },
  {
    name: "f",
    x: 0.037,
    y: 0,
    z: 0,
    sm: 0.03853361
  },
  {
    name: "g",
    x: 0.045,
    y: 0,
    z: 0,
    sm: 0.04687692
  },
  {
    name: "h",
    x: 0.0619,
    y: 0,
    z: 0,
    sm: 0.06193488
  }
];

function getDistanceParams(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dz = p2.z - p1.z;

  return { dx, dy, dz, dSquared: dx * dx + dy * dy + dz * dz };
}

function getVMag(g, primary, d, sm = d) {
  return Math.sqrt(g * primary.m * (2 / d - 1 / sm));
}

function getOrbit(primary, secondary, g) {
  const dParams = getDistanceParams(primary, secondary);

  const d = Math.sqrt(dParams.dSquared);

  const vMag = getVMag(g, primary, d, secondary.sm);

  return {
    ...secondary,
    vx: primary.vx + (-dParams.dy * vMag) / d,
    vy: primary.vy + (dParams.dx * vMag) / d,
    vz: primary.vz + (dParams.dz * vMag) / d
  };
}

function getTrappistOneSystem() {
  const t1System = [];

  planets.forEach(planet => t1System.push(getOrbit(primary, planet, 39.5)));

  return JSON.stringify(t1System);
}

console.log(getTrappistOneSystem());

*/

export default {
  name: 'Trappist 1 and its Seven Daughters',
  g: 39.5,
  dt: 0.00001,
  distMax: 50,
  distMin: -50,
  rotatingReferenceFrame: 'Origo',
  cameraPosition: 'Free',
  cameraFocus: 'Origo',
  freeOrigo: {
    x: 118386.2248620024,
    y: -122818.40798330265,
    z: 83059.26769450361
  },
  massBeingModified: 'Trappist 1',
  primary: 'Trappist 1',
  maximumDistance: { name: 'Moon to Earth * 10', value: 0.0256955529 },
  distanceStep: { name: 'Moon to Earth / 100', value: 0.000025695552899999998 },
  scenarioWikiUrl: 'https://en.wikipedia.org/wiki/TRAPPIST-1',
  masses: [
    {
      name: 'Trappist 1',
      x: 0.0000068211290733156635,
      y: 0.00010050003634435639,
      z: 0,
      vx: 0.0008506754010647033,
      vy: 0.0026812108031816244,
      vz: 0,
      trailVertices: 500
    },
    {
      name: 'Trappist 1 B',
      x: 0.006433915580050512,
      y: 0.009379587924806126,
      z: 0,
      vx: -14.349257826884768,
      vy: 10.605250995939931,
      vz: 0
    },
    {
      name: 'Trappist 1 C',
      x: -0.008384341851777496,
      y: 0.013847971560348686,
      z: 0,
      vx: -12.738727229872733,
      vy: -7.207413641451101,
      vz: 0
    },
    {
      name: 'Trappist 1 D',
      x: 0.0033092908437449328,
      y: -0.021735612519325688,
      z: 0,
      vx: 12.444885571774767,
      vy: 2.37298006018867,
      vz: 0
    },
    {
      name: 'Trappist 1 E',
      x: -0.030418811634225995,
      y: -0.002302581224346937,
      z: 0,
      vx: 0.8690017410225719,
      vy: -10.460262978209222,
      vz: 0
    },
    {
      name: 'Trappist 1 F',
      x: -0.021872629357739055,
      y: -0.032499300496067654,
      z: 0,
      vx: 7.949587712789728,
      vy: -4.952048469749593,
      vz: 0
    },
    {
      name: 'Trappist 1 G',
      x: -0.0007823909811820721,
      y: 0.046874169439119304,
      z: 0,
      vx: -8.675536783029266,
      vy: 0.19970066034644895,
      vz: 0
    },
    {
      name: 'Trappist 1 H',
      x: 0.02534917341218555,
      y: -0.05638830964586626,
      z: 0,
      vx: 6.873935828136686,
      vy: 3.0877221824366523,
      vz: 0
    }
  ]
};
