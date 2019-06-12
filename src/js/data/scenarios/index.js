import jovianSystem from './jovianSystem';
import centaurs from './centaurs';
import voyagerNeptune from './voyagerNeptune';
import saturnFull from './saturnFull';
import saturn from './saturn';
import threeBodyCoreography from './threeBodyCoreography';
import earthMoonSystem from './earthMoonSystem';
import oumuamua from './oumuamua';
import tess from './tess';
import martianSystem from './martianSystem';
import newHorizons from './newHorizons';
import cruithne from './cruithne';
import plutoSystem from './thePlutonianSystem';
import trappist1 from './trappist1';
import planetNine from './planetNine';
import shoemakerLevy9 from './shoemakerLevy9';
import rh120 from './rh120';
import ulysses from './ulysses';
import hd98800 from './hd98800';
import kepler1658 from './kepler1658';
import venusPentagram from './venusPentagram';
import uranianSystem from './Uranus';
import lunarFreeReturn from './lunarFreeReturn';
import starOfDavid from './starOfDavid';
import shenanigans from './shenanigans';
import innerSolarSystem from './innerSolarSystem';
import collisionsTest from './collisionsTest';
import kepler11 from './kepler11';
import the24sextantisSystem from './the24sextantisSystem';
import masses from '../masses';
import {
  calculateOrbitalVertices,
  elementsToVectors
} from '../../Physics/utils';
import {
  getRandomColor,
  getObjFromArrByKeyValuePair,
  subtractDateFromAnotherDate,
  convertMillisecondsToYears
} from '../../utils';

/*
 * Takes an array of masses and populates them with values and when there are none defaults
*/

const processMasses = (scenarioMasses, massTemplates, dt) =>
  scenarioMasses.map(mass => {
    const template = getObjFromArrByKeyValuePair(
      massTemplates,
      'name',
      mass.name
    );

    return {
      ...mass,
      m:
        template === undefined
          ? mass.m === undefined ? 3.362126177097e-15 : mass.m
          : template.m,
      radius:
        template === undefined
          ? mass.radius === undefined ? 1.2 : mass.radius
          : template.radius,
      trailVertices:
        mass.trailVertices !== undefined
          ? mass.trailVertices
          : template === undefined
            ? calculateOrbitalVertices(mass.orbitalPeriod, dt)
            : calculateOrbitalVertices(template.orbitalPeriod, dt),
      tilt: template === undefined ? false : template.tilt,
      atmosphere: template === undefined ? false : template.atmosphere,
      clouds: template === undefined ? false : template.clouds,
      type:
        (template === undefined && mass.type === 'asteroid') ||
        (template === undefined && mass.type === 'star')
          ? mass.type
          : template.type,
      texture:
        template === undefined
          ? null
          : template.noTexture === true ? 'no texture' : template.name,
      bump: template === undefined ? null : template.bump,
      asteroidTexture: template === undefined ? null : template.asteroidTexture,
      color:
        template === undefined
          ? mass.color === undefined ? getRandomColor() : mass.color
          : template.color === undefined ? getRandomColor() : template.color
    };
  });

/*
 * Takes a scenario and populates it with defaults
*/

const processScenario = scenario => ({
  ...scenario,
  isLoaded: false,
  playing: false,
  tcmsData:
    scenario.tcmsData !== undefined
      ? scenario.tcmsData.map(tcmData => ({
          ...tcmData,
          t:
            tcmData.t instanceof Date
              ? convertMillisecondsToYears(
                  subtractDateFromAnotherDate(
                    new Date(tcmData.t),
                    new Date(scenario.missionStart)
                  )
                )
              : tcmData.t
        }))
      : false,
  integrator: scenario.integrator !== undefined ? scenario.integrator : 'RKN12',
  logarithmicDepthBuffer:
    scenario.logarithmicDepthBuffer !== undefined
      ? scenario.logarithmicDepthBuffer
      : false,
  useBarnesHut:
    scenario.useBarnesHut !== undefined ? scenario.useBarnesHut : false,
  theta: scenario.theta !== undefined ? scenario.theta : 0.5,
  tol: scenario.tol !== undefined ? scenario.tol : scenario.dt * 0.00000001,
  maxDt:
    scenario.maxDt !== undefined
      ? scenario.maxDt
      : scenario.dt + scenario.dt * 10,
  minDt:
    scenario.minDt !== undefined
      ? scenario.minDt
      : scenario.dt + scenario.dt * 0.000000000001 - scenario.dt,
  particles:
    scenario.particles === undefined
      ? {
          max: 20000,
          size: 70,
          rings: [],
          hsl: [0.5, 0.7, 0.5]
        }
      : {
          ...scenario.particles,
          size: scenario.particles.size ? scenario.particles.size : 70,
          hsl: scenario.particles.hsl ? scenario.particles.hsl : [0.5, 0.7, 0.5]
        },
  softeningConstant:
    scenario.softeningConstant !== undefined ? scenario.softeningConstant : 0,
  collisions: true,
  barycenter: scenario.barycenter !== undefined ? scenario.barycenter : true,
  systemBarycenter:
    scenario.systemBarycenter !== undefined ? scenario.systemBarycenter : true,
  barycenterMassOne:
    scenario.barycenterMassOne !== undefined
      ? scenario.barycenterMassOne
      : scenario.masses[0] !== undefined ? scenario.masses[0].name : '',
  barycenterMassTwo:
    scenario.barycenterMassTwo !== undefined
      ? scenario.barycenterMassTwo
      : scenario.masses[1] !== undefined ? scenario.masses[1].name : '',
  elapsedTime: 0,
  trails: scenario.trails !== undefined ? scenario.trails : true,
  labels: scenario.labels !== undefined ? scenario.labels : true,
  background: scenario.background !== undefined ? scenario.background : true,
  sizeAttenuation:
    scenario.sizeAttenuation !== undefined ? scenario.sizeAttenuation : true,
  twinklingParticles:
    scenario.twinklingParticles !== undefined
      ? scenario.twinklingParticles
      : false,
  scale: scenario.scale !== undefined ? scenario.scale : 2100000,
  distMax: 50,
  distMin: -50,
  velMax: 5,
  velMin: -5,
  velStep: 1.85765499287888e-6,
  masses:
    scenario.elementsToVectors === true
      ? processMasses(
          elementsToVectors(
            getObjFromArrByKeyValuePair(masses, 'name', scenario.primary),
            scenario.masses,
            scenario.g
          ),
          masses,
          scenario.dt
        )
      : processMasses(scenario.masses, masses, scenario.dt)
});

/*
 * Array that contains all the scenarios included in Harmony of the Spheres
*/

export const scenarios = [
  voyagerNeptune,
  shoemakerLevy9,
  saturn,
  uranianSystem,
  hd98800,
  collisionsTest,
  trappist1,
  innerSolarSystem,
  lunarFreeReturn,
  kepler11,
  the24sextantisSystem,
  shenanigans,
  venusPentagram,
  oumuamua,
  kepler1658,
  earthMoonSystem,
  jovianSystem,
  threeBodyCoreography,
  tess,
  plutoSystem,
  martianSystem,
  centaurs,
  saturnFull,
  newHorizons,
  cruithne,
  starOfDavid,
  planetNine,
  rh120,
  ulysses
];

/*
 * Takes the name of a scenario
 * Filters the scenarios array by name
 * Returns a clone of the scenario populated with defaults
*/

export default function(scenario) {
  const selectedScenario = getObjFromArrByKeyValuePair(
    scenarios,
    'name',
    scenario
  );

  return processScenario(JSON.parse(JSON.stringify(selectedScenario)));
}
