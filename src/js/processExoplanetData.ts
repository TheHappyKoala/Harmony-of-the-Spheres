import { elementsToVectors } from './Physics/utils';
import { getRandomColor } from './utils';

export default (
  data: {
    pl_letter: string;
    pl_hostname: string;
    st_mass: number;
    st_rad: number;
    pl_bmassj: number;
    pl_rad: number;
    pl_orbsmax: number;
    pl_orbeccen: number;
    pl_orblper: number;
    pl_orbbper: number;
    pl_orbinc: number;
  }[]
) => {
  //Constants that we'll be working with

  const sunRadius = 9767.441860465116;
  const jupiterMass = 9.543e-4;
  const jupiterRadius = 976.7441860465117;
  const g = 39.5;
  const dt = 0.00005;
  const scale = 2100000;

  //Does not include the star around which the planets orbit

  const masses = data
    .map((entry): Exoplanet | void => {
      //Where there is no eccentricity data, we can set a default of 0
      //Same holds true for the inclination of an orbit and the argument of periapsis
      //However, for planets with no semi-major axis data, it is pointless to include the planet
      //The few masses that lack semi-major axis data were discovered through microlensing events or using
      //The radial velocity method

      if (entry.pl_orbsmax)
        return {
          name: entry.pl_letter,
          noTexture: true,
          m:
            entry.pl_bmassj == null
              ? 0.0000000000001
              : entry.pl_bmassj * jupiterMass,
          radius: (entry.pl_rad == null ? 0.1 : entry.pl_rad) * jupiterRadius,
          a: entry.pl_orbsmax,
          e: entry.pl_orbeccen == null ? 0 : entry.pl_orbeccen,
          w: entry.pl_orblper == null ? 0 : entry.pl_orblper,
          i: entry.pl_orbinc == null ? 0 : entry.pl_orbinc,
          o: 0,
          color: getRandomColor()
        };
    })

    //Filter out the poor puppies that didn't have a semi-major axis value
    //and thus had a return value of undefined

    .filter(planet => typeof planet !== 'undefined');

  //Get the largest semi-major axis of da planets in da system
  //We will use it to set a suitable "height" for the camera
  //So that all of the planets are on show when the scenario renders

  const widestOrbit = Math.max(...masses.map((mass: Exoplanet) => mass.a));

  const [primary] = data;

  return {
    habitableZone: true,
    forAllMankind: false,
    referenceOrbits: true,
    dt,
    exoPlanetArchive: false,
    tol: 0.00000000001,
    maxDt: dt * 4,
    minDt: 2 * dt * 0.000000000001 - dt,
    systemBarycenter: true,
    barycenter: true,
    barycenterMassOne: primary.pl_hostname,
    barycenterMassTwo: primary.pl_hostname,
    rotatingReferenceFrame: 'Barycenter',

    //We want to give the user a sense of perspective by showing the orbits of Mercury and Earth
    //If the semi-major axis of the widest orbit is bigger than 3.5 au, that will be the height of the camera
    //Otherwise we set it to 3.5 au (the height at which Earth's orbit is included in the viewport)

    barycenterZ: Math.max(widestOrbit * 3 * scale, scale * 3.5),

    primary: primary.pl_hostname,
    massBeingModified: primary.pl_hostname,
    isLoaded: false,
    playing: false,
    g: 39.5,
    cameraFocus: 'Barycenter',
    integrator: 'PEFRL',
    customCameraToBodyDistanceFactor: false,
    trajectoryRendevouz: {
      x: 0,
      y: 0,
      z: 0,
      p: {
        x: 0,
        y: 0,
        z: 0,
        t: 0
      }
    },
    elapsedTime: 0,
    drawLineEvery: 6,
    useBarnesHut: false,
    theta: 0.5,
    collisions: true,
    softeningConstant: 0,
    logarithmicDepthBuffer: false,
    scale: 2100000,
    trails: true,
    labels: true,
    particles: {
      max: 1000,
      size: 15,
      rings: <{
        primary?: string;
        tilt?: [number, number, number];
        number?: number;
        minD?: number;
        maxD?: number;
      }>[]
    },
    sizeAttenuation: true,
    maximumDistance: 0,
    distMax: 50,
    distMin: -50,
    velMax: 5,
    velMin: -5,
    velStep: 1.85765499287888e-6,
    isMassBeingAdded: false,
    a: 0,
    e: 0,
    w: 0,
    i: 0,
    o: 0,
    masses: elementsToVectors(
      {
        m: primary.st_mass,
        radius: primary.st_rad * sunRadius,
        type: 'star',
        name: primary.pl_hostname,
        color: getRandomColor(),
        trailVertices: 100,

        //Once I've gotten to writing an equation that relates the color of stars to their mass
        //the temperature value will not be hard coded any longer

        temperature: 3000
      },
      masses,
      g
    )
  };
};
