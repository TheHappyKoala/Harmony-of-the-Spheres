import { AppState } from '../../reducers';
import filterScenarios, {
  processExoplanetArchiveData
} from '../../data/scenarios';
import { getObjFromArrByKeyValuePair } from '../../utils';
import { getOrbit } from '../../Physics/utils';
import cachedFetch from '../../cachedFetch';
import { AppActionTypes } from '../../action-types/app';
import {
  ScenarioActionTypes,
  GET_SCENARIO,
  MODIFY_SCENARIO_PROPERTY,
  MODIFY_MASS_PROPERTY,
  AddMass,
  ADD_MASS,
  DELETE_MASS,
  ScenarioProperty,
  MassProperty
} from '../../action-types/scenario';
import { setLoading } from '../../action-creators/app';
import { Action, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { scenarioDefaults } from '../../data/scenarios/defaults';
import { findCurrentSOI } from '../../Physics/spacecraft/lambert';
import TrajectoryCruncher from 'worker-loader!../../Physics/spacecraft/trajectoryCruncher';

export const getScenario = (
  name: string
): ThunkAction<void, AppState, void, Action> => async (
  dispatch: Dispatch<ScenarioActionTypes | AppActionTypes>,
  getState: () => AppState
) => {
  const scenario = filterScenarios(name, getState().scenarios);

  dispatch(
    setLoading({
      loading: true,
      whatIsLoading: scenario.name
    })
  );

  let scenarioToBeDispatched;

  if (!scenario.exoPlanetArchive)
    scenarioToBeDispatched = await cachedFetch(
      `${
        process.env.NODE_ENV === 'production'
          ? './data/scenarios/'
          : 'http://localhost:9000/scenarios/'
      }${scenario.fileName}`
    );
  else
    scenarioToBeDispatched = {
      ...scenarioDefaults,
      ...scenario,
      ...processExoplanetArchiveData(
        await cachedFetch(
          `https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?&table=exoplanets&select=pl_hostname,st_mass,st_teff,st_rad,pl_letter,pl_bmassj,pl_radj,pl_orbper,pl_orbsmax,pl_orbeccen,pl_orblper,pl_facility,pl_orbincl&where=pl_hostname like '${name}'&format=json`
        )
      )
    };

  sessionStorage.setItem(
    'currentScenario',
    JSON.stringify(scenarioToBeDispatched)
  );

  dispatch({
    type: GET_SCENARIO,
    scenario: scenarioToBeDispatched
  });
};

export const modifyScenarioProperty = (
  ...scenarioProperties: ScenarioProperty[]
): ThunkAction<void, AppState, void, Action> => (
  dispatch: Dispatch<ScenarioActionTypes>
) =>
  scenarioProperties.forEach(scenarioProperty =>
    dispatch({
      type: MODIFY_SCENARIO_PROPERTY,
      payload: {
        key: scenarioProperty.key,
        value: scenarioProperty.value
      }
    })
  );

export const resetScenario = () =>
  modifyScenarioProperty(
    ...Object.entries(
      JSON.parse(sessionStorage.getItem('currentScenario'))
    ).map(([key, value]: [string, any]) => ({
      key,
      value
    })),
    {
      key: 'reset',
      value: true
    }
  );

export const modifyMassProperty = (
  ...massProperties: MassProperty[]
): ThunkAction<void, AppState, void, Action> => (
  dispatch: Dispatch<ScenarioActionTypes>
) =>
  massProperties.forEach(massProperty =>
    dispatch({
      type: MODIFY_MASS_PROPERTY,
      payload: massProperty
    })
  );

export const addMass = (
  payload: AddMass
): ThunkAction<void, AppState, void, Action> => (
  dispatch: Dispatch<ScenarioActionTypes>,
  getState: () => AppState
) => {
  const scenario = getState().scenario;

  const primary = getObjFromArrByKeyValuePair(
    scenario.masses,
    'name',
    payload.primary
  );

  dispatch({
    type: ADD_MASS,
    payload: getOrbit(primary, payload.secondary, scenario.g)
  });
};

export const deleteMass = (name: string): ScenarioActionTypes => ({
  type: DELETE_MASS,
  name
});

export const getTrajectory = (
  soiTree: SOITree,
  currentSOI: MassType,
  applyTrajectory = true
): ThunkAction<void, AppState, void, Action> => async (
  dispatch: Dispatch<ScenarioActionTypes | AppActionTypes>,
  getState: () => AppState
) => {
  const scenario = getState().scenario;

  const originalPlayState = scenario.playing ? true : false;
  const originalTrailsState = scenario.trails ? true : false;

  modifyScenarioProperty(
    {
      key: 'playing',
      value: false
    },
    {
      key: 'trails',
      value: false
    }
  )(dispatch, getState);

  dispatch(
    setLoading({
      loading: true,
      whatIsLoading: 'Generating trajectory'
    })
  );

  const trajectoryCruncher = new TrajectoryCruncher();

  const currentSOIChildOf = findCurrentSOI(
    getObjFromArrByKeyValuePair(scenario.masses, 'name', currentSOI.name),
    soiTree,
    scenario.masses
  );

  let referenceMass: MassType;

  if (currentSOIChildOf.name === scenario.trajectoryTarget)
    referenceMass = currentSOI;
  else
    referenceMass = findCurrentSOI(
      getObjFromArrByKeyValuePair(
        scenario.masses,
        'name',
        scenario.trajectoryTarget
      ),
      soiTree,
      scenario.masses
    );

  const rotatedScenario = scenario.masses.map((mass: MassType) => ({
    ...mass,
    x: referenceMass.x - mass.x,
    y: referenceMass.y - mass.y,
    z: referenceMass.z - mass.z,
    vx: referenceMass.vx - mass.vx,
    vy: referenceMass.vy - mass.vy,
    vz: referenceMass.vz - mass.vz
  }));

  const getTrajectory = () =>
    new Promise<{ x: number; y: number; z: number; p?: MassProperty }[]>(
      resolve => {
        trajectoryCruncher.addEventListener(
          'message',
          ({ data: { trajectory } }) => {
            resolve(trajectory);
          }
        );

        trajectoryCruncher.postMessage({
          integrator: scenario.integrator,
          g: scenario.g,
          dt: scenario.dt,
          tol: scenario.tol,
          minDt: scenario.minDt,
          maxDt: scenario.maxDt,
          elapsedTime: scenario.elapsedTime,
          masses: rotatedScenario,
          departure: scenario.elapsedTime,
          arrival:
            scenario.elapsedTime +
            (scenario.trajectoryTargetArrival - scenario.elapsedTime),
          target: scenario.trajectoryTarget,
          primary: referenceMass.name
        });
      }
    );

  const [trajectory, rendevouz] = await getTrajectory();

  const [spacecraft] = scenario.masses;

  trajectoryCruncher.terminate();

  if (applyTrajectory) {
    modifyScenarioProperty({
      key: 'masses',
      value: rotatedScenario
    })(dispatch, getState);

    modifyMassProperty(
      {
        name: spacecraft.name,
        key: 'vx',
        value: trajectory.x
      },
      {
        name: spacecraft.name,
        key: 'vy',
        value: trajectory.y
      },
      {
        name: spacecraft.name,
        key: 'vz',
        value: trajectory.z
      }
    )(dispatch, getState);
  }

  modifyScenarioProperty(
    { key: 'trajectoryRendevouz', value: rendevouz },
    { key: 'trails', value: originalTrailsState },
    { key: 'playing', value: originalPlayState }
  )(dispatch, getState);

  dispatch(
    setLoading({
      loading: false,
      whatIsLoading: ''
    })
  );
};
