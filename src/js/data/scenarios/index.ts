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
import forAllMankind from './forAllMankind';
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
      luminosity: 'luminosity' in template ? template.luminosity : 0,
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
  forAllMankind: 'forAllMankind' in scenario ? scenario.forAllMankind : false,
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

export const processExoplanetArchiveData = (data: any[]) => {
  const sunRadius = 9767.441860465116;
  const jupiterMass = 9.543e-4;
  const jupiterRadius = 976.7441860465117;
  const dt = 0.0000075;
  const g = 39.5;
  const yearOverDays = 0.00273973;
  const starRadius =
    (data[0].st_rad == null ? 0.5 : data[0].st_rad) * sunRadius;

  return {
    habitableZone: true,
    referenceOrbits: true,
    dt,
    exoPlanetArchive: false,
    tol: dt * 0.000000000000000001,
    maxDt: dt * 4,
    minDt: 2 * dt * 0.000000000001 - dt,
    barycenterMassOne: data[0].pl_hostname,
    barycenterMassTwo: data[0].pl_letter,
    rotatingReferenceFrame: data[0].pl_hostname,
    cameraPosition: 'Free',
    cameraFocus: 'Origo',
    freeOrigo: {
      x: 850402.9676702506,
      y: 526245.3241717573,
      z: 384930.22925721033
    },
    primary: data[0].pl_hostname,
    massBeingModified: data[0].pl_hostname,
    masses: elementsToVectors(
      {
        m: data[0].st_mass,
        radius: starRadius === 0 ? sunRadius : starRadius,
        type: 'star',
        name: data[0].pl_hostname,
        color: '#bfcfff',
        trailVertices: 1000,
        temperature: isNaN(data[0].st_teff) ? 3000 : data[0].st_teff
      },
      data.map((entry: any) => {
        return {
          name: entry.pl_letter,
          noTexture: true,
          m: entry.pl_bmassj * jupiterMass,
          radius: (entry.pl_rad == null ? 0.1 : entry.pl_rad) * jupiterRadius,
          a: entry.pl_orbsmax == null ? 0.2 : entry.pl_orbsmax,
          e: entry.pl_orbeccen == null ? 0 : entry.pl_orbeccen,
          w: entry.pl_orblper == null ? 0 : entry.pl_orblper,
          i: entry.pl_orbinc == null ? 0 : entry.pl_orbinc,
          color: getRandomColor(),
          trailVertices: calculateOrbitalVertices(
            entry.pl_orbper * yearOverDays,
            dt
          )
        };
      }),
      g
    )
  };
};

export const scenarios = [
  voyagerNeptune,
  shoemakerLevy9,
  saturn,
  uranianSystem,
  hd98800,
  collisionsTest,
  innerSolarSystem,
  forAllMankind,
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
