import jovianSystem from './jovianSystem';
import threeBodyCoreography from './threeBodyCoreography';
import earthMoonSystem from './earthMoonSystem';
import oumuamua from './oumuamua';
import martianSystem from './martianSystem';
import newHorizons from './newHorizons';
import cruithne from './cruithne';
import planetNine from './planetNine';
import rh120 from './rh120';
import ulysses from './ulysses';
import venusPentagram from './venusPentagram';
import masses from '../masses';

const processScenario = scenario => ({
  ...scenario,
  playing: false,
  integrator: 'RK4',
  elapsedTime: 0,
  trails: true,
  labels: true,
  scale: 2100000,
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
      type:
        (template === undefined && mass.type === 'asteroid') ||
        (template === undefined && mass.type === 'star')
          ? mass.type
          : template.type,
      texture: template === undefined ? null : template.name,
      color:
        template === undefined
          ? mass.color === undefined ? 'pink' : mass.color
          : template.color
    };
  })
});

export const scenarios = [
  jovianSystem,
  threeBodyCoreography,
  earthMoonSystem,
  venusPentagram,
  oumuamua,
  martianSystem,
  newHorizons,
  cruithne,
  planetNine,
  rh120,
  ulysses
];

export default function(scenario) {
  const selectedScenario = scenarios.filter(
    entry => entry.name.indexOf(scenario) > -1
  );

  return processScenario(JSON.parse(JSON.stringify(selectedScenario[0])));
}
