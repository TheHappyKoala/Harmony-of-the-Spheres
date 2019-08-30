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
  dt: number,
  drawLineEvery: number
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
            ? calculateOrbitalVertices(
                template.orbitalPeriod,
                dt,
                drawLineEvery
              )
            : calculateOrbitalVertices(mass.orbitalPeriod, dt, drawLineEvery),
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
  drawLineEvery:
    'drawLineEvery' in scenario
      ? scenario.drawLineEvery
      : scenarioDefaults.drawLineEvery,
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
          scenario.dt,
          scenarioDefaults!.drawLineEvery
        )
      : computeDerivedMassesData(
          scenario!.masses,
          masses,
          scenario!.dt,
          scenarioDefaults!.drawLineEvery
        ),
  particles: {
    ...scenarioDefaults.particles,
    ...scenario.particles
  }
});

export const processExoplanetArchiveData = (data: any[]) => {
  //Constants that we'll be working with

  const sunRadius = 9767.441860465116;
  const jupiterMass = 9.543e-4;
  const jupiterRadius = 976.7441860465117;
  const g = 39.5;
  const dt = 0.00005;
  const yearOverDays = 0.00273973;
  const scale = 2100000;

  //Does not include the star around which the planets orbit

  const masses = data
    .map((entry: any) => {
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
          color: getRandomColor(),
          trailVertices: calculateOrbitalVertices(
            entry.pl_orbper * yearOverDays,
            dt
          )
        };
    })

    //Filter out the poor puppies that didn't have a semi-major axis value
    //and thus had a return value of undefined

    .filter(planet => typeof planet !== 'undefined');

  //Get the largest semi-major axis of da planets in da system
  //We will use it to set a suitable "height" for the camera
  //So that all of the planets are on show when the scenario renders

  const widestOrbit = Math.max(...masses.map(mass => mass.a));

  const [primary] = data;
  const [firstPlanet] = masses;

  return {
    habitableZone: true,
    referenceOrbits: true,
    dt,
    exoPlanetArchive: false,
    tol: 0.00000000001,
    maxDt: dt * 4,
    minDt: 2 * dt * 0.000000000001 - dt,
    systemBarycenter: true,
    barycenter: true,
    barycenterMassOne: primary.pl_hostname,
    barycenterMassTwo: firstPlanet.name,
    rotatingReferenceFrame: 'Barycenter',

    //We want to give the user a sense of perspective by showing the orbits of Mercury and Earth
    //If the semi-major axis of the widest orbit is bigger than 3.5 au, that will be the height of the camera
    //Otherwise we set it to 3.5 au (the height at which Earth's orbit is included in the viewport)

    barycenterZ: Math.max(widestOrbit * 3 * scale, scale * 3.5),

    primary: primary.pl_hostname,
    massBeingModified: primary.pl_hostname,
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

export const scenarios = [
  voyagerNeptune,
  shoemakerLevy9,
  saturn,
  uranianSystem,
  hd98800,
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
