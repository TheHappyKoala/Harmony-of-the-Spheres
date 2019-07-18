import { AppState } from '../../reducers';
import filterScenarios from '../../data/scenarios';
import { getRandomColor, getObjFromArrByKeyValuePair } from '../../utils';
import {
  getOrbit,
  elementsToVectors,
  calculateOrbitalVertices
} from '../../Physics/utils';
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
      `https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?&table=exoplanets&select=pl_hostname,st_mass,st_teff,st_rad,pl_letter,pl_bmassj,pl_radj,pl_orbper,pl_orbsmax,pl_orbeccen,pl_orblper,pl_orbincl&where=pl_hostname like '${name}'&format=json`
    );

    const sunRadius = 9767.441860465116;
    const jupiterMass = 9.543e-4;
    const jupiterRadius = 976.7441860465117;
    const dt = 0.0000075;
    const yearOverDays = 0.00273973;
    const starRadius = data[0].st_rad * sunRadius;

    dispatch({
      type: GET_SCENARIO,
      scenario: {
        ...scenario,
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
          x: starRadius * 10,
          y: 0,
          z: starRadius * 4
        },
        primary: data[0].pl_hostname,
        massBeingModified: data[0].pl_hostname,
        masses: elementsToVectors(
          {
            m: data[0].st_mass,
            radius: starRadius,
            type: 'star',
            name: data[0].pl_hostname,
            color: '#bfcfff',
            trailVertices: 1000,
            temperature: data[0].st_teff
          },
          data.map((entry: any) => ({
            name: entry.pl_letter,
            noTexture: true,
            m: entry.pl_bmassj * jupiterMass,
            radius: entry.pl_radj * jupiterRadius,
            a: isNaN(entry.pl_orbsmax) ? Math.random() : entry.pl_orbsmax,
            e: isNaN(entry.pl_orbeccen) ? 0 : entry.pl_orbeccen,
            w: isNaN(entry.pl_orblper) ? 0 : entry.pl_orblper,
            i: isNaN(entry.pl_orbinc) ? 0 : entry.pl_orbinc,
            color: getRandomColor(),
            trailVertices: calculateOrbitalVertices(
              entry.pl_orbper * yearOverDays,
              dt
            )
          })),
          scenario.g
        )
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
  payload: MassProperty
): ScenarioActionTypes => ({
  type: MODIFY_MASS_PROPERTY,
  payload
});

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
