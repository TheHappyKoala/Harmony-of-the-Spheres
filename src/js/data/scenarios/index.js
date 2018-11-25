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
      m: template === undefined ? 0 : template.m,
      radius: template === undefined ? 1.2 : template.radius,
      type: (template === undefined && mass.type === 'asteroid') ? 'asteroid' : template.type,
      texture: template === undefined ? null : template.name,
      color: template === undefined ? 'pink' : template.color
    };
  })
});

export const scenarios = [     
  jovianSystem,
  threeBodyCoreography,
  earthMoonSystem,
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
