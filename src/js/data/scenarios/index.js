import jovianSystem from './jovianSystem';
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
import planetNine from './planetNine';
import rh120 from './rh120';
import ulysses from './ulysses';
import venusPentagram from './venusPentagram';
import lunarFreeReturn from './lunarFreeReturn';
import starOfDavid from './starOfDavid';
import shenanigans from './shenanigans';
import masses from '../masses';
import { calculateOrbitalVertices } from '../../Physics/utils';
import { getRandomColor, getObjFromArrByKeyValuePair } from '../../utils';

const processScenario = scenario => ({
  ...scenario,
  isLoaded: false,
  playing: false,
  integrator: 'RK4',
  elapsedTime: 0,
  trails: true,
  labels: true,
  background: true,
  sizeAttenuation: true,
  scale: 2100000,
  velMax: 5,
  velMin: -5,
  velStep: 1.85765499287888e-6,
  masses: scenario.masses.map(mass => {
    const template = masses.filter(
      entry => entry.name.indexOf(mass.name) > -1
    )[0];

    return {
      ...mass,
      m:
        template === undefined
          ? mass.m === undefined ? 0 : mass.m
          : template.m,
      radius:
        template === undefined
          ? mass.radius === undefined ? 1.2 : mass.radius
          : template.radius,
      trailVertices:
        mass.trailVertices !== undefined
          ? mass.trailVertices
          : template === undefined
            ? calculateOrbitalVertices(mass.orbitalPeriod, scenario.dt)
            : calculateOrbitalVertices(template.orbitalPeriod, scenario.dt),
      tilt: template === undefined ? false : template.tilt,
      atmosphere: template === undefined ? false : template.atmosphere,
      clouds: template === undefined ? false : template.clouds,
      type:
        (template === undefined && mass.type === 'asteroid') ||
        (template === undefined && mass.type === 'star')
          ? mass.type
          : template.type,
      texture: template === undefined ? null : template.name,
      bump: template === undefined ? null : template.bump,
      color:
        template === undefined
          ? mass.color === undefined ? getRandomColor() : mass.color
          : template.color === undefined ? getRandomColor() : template.color
    };
  })
});

export const scenarios = [
  voyagerNeptune,
  saturn,
  jovianSystem,
  lunarFreeReturn,
  shenanigans,
  venusPentagram,
  oumuamua,
  earthMoonSystem,
  threeBodyCoreography,
  tess,
  martianSystem,
  saturnFull,
  newHorizons,
  cruithne,
  starOfDavid,
  planetNine,
  rh120,
  ulysses
];

export default function(scenario) {
  const selectedScenario = getObjFromArrByKeyValuePair(
    scenarios,
    'name',
    scenario
  );

  return processScenario(JSON.parse(JSON.stringify(selectedScenario)));
}
