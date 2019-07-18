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
import cruithne from './cruithne';
import plutoSystem from './thePlutonianSystem';
import planetNine from './planetNine';
import shoemakerLevy9 from './shoemakerLevy9';
import rh120 from './rh120';
import hd98800 from './hd98800';
import venusPentagram from './venusPentagram';
import uranianSystem from './Uranus';
import lunarFreeReturn from './lunarFreeReturn';
import starOfDavid from './starOfDavid';
import shenanigans from './shenanigans';
import innerSolarSystem from './innerSolarSystem';
import collisionsTest from './collisionsTest';
import masses from '../masses';
import { MassTemplate } from '../../action-types/scenario';
import { scenarioDefaults } from './defaults';
import { MassType } from '../../Physics/types';
import { ScenarioProps } from '../../action-types/scenario';
import {
  calculateOrbitalVertices,
  elementsToVectors
} from '../../Physics/utils';
import { getRandomColor, getObjFromArrByKeyValuePair } from '../../utils';

const computeDerivedMassesData = (
  scenarioMasses: MassType[],
  massTemplates: MassTemplate[],
  dt: number
) =>
  scenarioMasses.map((mass: MassType) => {
    const template = getObjFromArrByKeyValuePair(
      massTemplates,
      'name',
      mass.name
    );

    return {
      ...mass,
      m: 'm' in template ? template.m : 'm' in mass ? mass.m : 1e-9999,
      temperature: 'temperature' in template ? template.temperature : 0,
      spacecraft: 'spacecraft' in template ? template.spacecraft : false,
      radius:
        'radius' in template
          ? template.radius
          : 'radius' in mass ? mass.radius : 1.2,
      trailVertices:
        'trailVertices' in mass
          ? mass.trailVertices
          : 'orbitalPeriod' in template
            ? calculateOrbitalVertices(template.orbitalPeriod, dt)
            : calculateOrbitalVertices(mass.orbitalPeriod, dt),
      tilt: 'tilt' in template ? template.tilt : 0,
      atmosphere: 'atmosphere' in template ? template.atmosphere : false,
      clouds: 'clouds' in template ? template.clouds : false,
      type:
        'type' in template ? template.type : 'type' in mass ? mass.type : false,
      texture:
        'noTexture' in template
          ? 'no texture'
          : 'name' in template ? template.name : mass.name,
      bump: 'bump' in template ? template.bump : false,
      color: 'color' in template ? template.color : getRandomColor()
    };
  });

const computeDerivedScenarioData = (
  scenario: { [x: string]: any },
  scenarioDefaults: any
) => ({
  ...scenarioDefaults,
  ...scenario,
  tol: 'tol' in scenario ? scenario.tol : scenario!.dt * 0.000000000000000001,
  maxDt: 'maxDt' in scenario ? scenario.maxDt : scenario!.dt * 4,
  minDt:
    'minDt' in scenario
      ? scenario.minDt
      : scenario!.dt + scenario!.dt * 0.000000000001 - scenario!.dt,
  barycenterMassOne:
    'barycenterMassOne' in scenario
      ? scenario.barycenterMassOne
      : scenario!.masses[0].name,
  barycenterMassTwo:
    'barycenterMassTwo' in scenario
      ? scenario.barycenterMassTwo
      : scenario!.masses[1].name,
  masses:
    'elementsToVectors' in scenario
      ? computeDerivedMassesData(
          elementsToVectors(
            getObjFromArrByKeyValuePair(masses, 'name', scenario.primary),
            scenario.masses,
            scenario.g
          ),
          masses,
          scenario.dt
        )
      : computeDerivedMassesData(scenario!.masses, masses, scenario!.dt),
  particles: {
    ...scenarioDefaults.particles,
    ...scenario.particles
  }
});

export const scenarios = [
  voyagerNeptune,
  shoemakerLevy9,
  saturn,
  uranianSystem,
  hd98800,
  collisionsTest,
  innerSolarSystem,
  lunarFreeReturn,
  shenanigans,
  venusPentagram,
  oumuamua,
  earthMoonSystem,
  jovianSystem,
  threeBodyCoreography,
  tess,
  plutoSystem,
  martianSystem,
  centaurs,
  saturnFull,
  cruithne,
  starOfDavid,
  planetNine,
  rh120
];

export default (scenario: string, scenarios: any[]): ScenarioProps | any => {
  const selectedScenario: ScenarioProps = getObjFromArrByKeyValuePair(
    scenarios,
    'name',
    scenario
  );

  if (selectedScenario.exoPlanetArchive === true) return selectedScenario;

  return computeDerivedScenarioData(
    JSON.parse(JSON.stringify(selectedScenario)),
    scenarioDefaults
  );
};
