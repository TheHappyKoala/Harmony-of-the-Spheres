import { AppState } from '../../reducers';
import filterScenarios, {
  processExoplanetArchiveData
} from '../../data/scenarios';
import { getObjFromArrByKeyValuePair } from '../../utils';
import { getOrbit } from '../../Physics/utils';
import { orbitalInsertion } from '../../Physics/spacecraft/lambert';
import cachedFetch from '../../cachedFetch';
import { AppActionTypes, SET_LOADING } from '../../action-types/app';
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
import { Action, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { scenarioDefaults } from '../../data/scenarios/defaults';
import TrajectoryCruncher from 'worker-loader!../../Physics/spacecraft/trajectoryCruncher';

export const getScenario = (
  name: string
): ThunkAction<void, AppState, void, Action> => async (
  dispatch: Dispatch<ScenarioActionTypes | AppActionTypes>,
  getState: any
) => {
  const scenario = filterScenarios(name, getState().scenarios);

  dispatch({
    type: SET_LOADING,
    payload: {
      loading: true,
      whatIsLoading: scenario.name
    }
  });

  if (!scenario.exoPlanetArchive) {
    dispatch({
      type: GET_SCENARIO,
      scenario: scenario
    });
  } else {
    const data = await cachedFetch(
      `https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?&table=exoplanets&select=pl_hostname,st_mass,st_teff,st_rad,pl_letter,pl_bmassj,pl_radj,pl_orbper,pl_orbsmax,pl_orbeccen,pl_orblper,pl_facility,pl_orbincl&where=pl_hostname like '${name}'&format=json`
    );

    dispatch({
      type: GET_SCENARIO,
      scenario: {
        ...scenarioDefaults,
        ...scenario,
        ...processExoplanetArchiveData(data)
      }
    });
  }
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
  getState: any
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
  primary: string,
  applyTrajectory = true
): ThunkAction<void, AppState, void, Action> => async (
  dispatch: Dispatch<ScenarioActionTypes | AppActionTypes>,
  getState: any
) => {
  dispatch({
    type: MODIFY_SCENARIO_PROPERTY,
    payload: {
      key: 'playing',
      value: false
    }
  });

  dispatch({
    type: SET_LOADING,
    payload: {
      loading: true,
      whatIsLoading: 'Generating trajectory'
    }
  });

  const trajectoryCruncher = new TrajectoryCruncher();

  const scenario = getState().scenario;

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
          masses: scenario.masses,
          departure: scenario.elapsedTime,
          arrival:
            scenario.elapsedTime +
            (scenario.trajectoryTargetArrival - scenario.elapsedTime),
          target: scenario.trajectoryTarget,
          primary
        });
      }
    );

  const [trajectory, rendevouz] = await getTrajectory();

  const [spacecraft] = scenario.masses;

  trajectoryCruncher.terminate();

  if (applyTrajectory) {
    dispatch({
      type: MODIFY_MASS_PROPERTY,
      payload: {
        name: spacecraft.name,
        key: 'vx',
        value: trajectory.x
      }
    });
    dispatch({
      type: MODIFY_MASS_PROPERTY,
      payload: {
        name: spacecraft.name,
        key: 'vy',
        value: trajectory.y
      }
    });
    dispatch({
      type: MODIFY_MASS_PROPERTY,
      payload: {
        name: spacecraft.name,
        key: 'vz',
        value: trajectory.z
      }
    });
  }

  dispatch({
    type: MODIFY_SCENARIO_PROPERTY,
    payload: {
      key: 'trajectoryRendevouz',
      value: rendevouz
    }
  });

  modifyScenarioProperty({ key: 'trajectoryRendevouz', value: rendevouz });

  dispatch({
    type: SET_LOADING,
    payload: {
      loading: false,
      whatIsLoading: ''
    }
  });
};

export const getOrbitalBurn = (
  payload: { primary: string; periapsis: number; apoapsis: number },
  applyBurn = true
): ThunkAction<void, AppState, void, Action> => (
  dispatch: Dispatch<ScenarioActionTypes>,
  getState: any
) => {
  const scenario = getState().scenario;

  const primary = getObjFromArrByKeyValuePair(
    scenario.masses,
    'name',
    payload.primary
  );
  const orbit = orbitalInsertion(primary, payload, scenario.g);

  if (applyBurn) {
    const [spacecraft] = scenario.masses;

    dispatch({
      type: MODIFY_MASS_PROPERTY,
      payload: {
        name: spacecraft.name,
        key: 'vx',
        value: orbit.x
      }
    });
    dispatch({
      type: MODIFY_MASS_PROPERTY,
      payload: {
        name: spacecraft.name,
        key: 'vy',
        value: orbit.y
      }
    });
    dispatch({
      type: MODIFY_MASS_PROPERTY,
      payload: {
        name: spacecraft.name,
        key: 'vz',
        value: orbit.z
      }
    });
  }

  dispatch({
    type: MODIFY_SCENARIO_PROPERTY,
    payload: {
      key: 'orbitalInsertionV',
      value: { x: orbit.x, y: orbit.y, z: orbit.z }
    }
  });
};
