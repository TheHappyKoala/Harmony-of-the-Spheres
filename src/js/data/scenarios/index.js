import jovianSystem from './jovianSystem';
import threeBodyCoreography from './threeBodyCoreography';
import earthMoonSystem from './earthMoonSystem';
import oumuamua from './oumuamua';
import martianSystem from './martianSystem';
import newHorizons from './newHorizons';
import cruithne from './cruithne';

export const scenarios = [
  jovianSystem,
  threeBodyCoreography,
  earthMoonSystem,
  oumuamua,
  martianSystem,
  newHorizons,
  cruithne
];

export default function(scenario) {
  const selectedScenario = scenarios.filter(
    entry => entry.name.indexOf(scenario) > -1
  );

  return JSON.parse(JSON.stringify(selectedScenario[0]));
}
