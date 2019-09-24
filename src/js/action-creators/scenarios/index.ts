import { AppState } from '../../reducers';
import {
  ScenariosActionTypes,
  ADD_SCENARIO
} from '../../action-types/scenarios';
import { AppActionTypes } from '../../action-types/app';
import { boot, setLoading } from '../../action-creators/app';
import { Action, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import cachedFetch from '../../cachedFetch';
import { removeDuplicatesByKey } from '../../utils';

export const addScenario = (payload: {
  name: string;
  type: string;
  [x: string]: any;
}): ScenariosActionTypes => ({
  type: ADD_SCENARIO,
  payload
});

export const saveScenario = (
  payload: string
): ThunkAction<void, AppState, void, Action> => (
  dispatch: Dispatch<ScenariosActionTypes>,
  getState: () => AppState
) => {
  const scenario = getState().scenario;

  const scenarioToSave: any = {
    ...scenario,
    name: payload,
    type: 'Saved Simulations',
    playing: false,
    isLoaded: false
  };

  const savedScenarios = JSON.parse(localStorage.getItem('scenarios'));

  localStorage.setItem(
    'scenarios',
    JSON.stringify([
      ...(Array.isArray(savedScenarios) ? savedScenarios : []),
      scenarioToSave
    ])
  );

  dispatch(addScenario(scenarioToSave));
};

export const fetchScenarios = (
  payload: any
): ThunkAction<void, AppState, void, Action> => async (
  dispatch: Dispatch<ScenariosActionTypes | AppActionTypes>
) => {
  dispatch(
    setLoading({
      loading: true,
      whatIsLoading: 'Loading not one world, but thousands'
    })
  );

  //How long scenarios are cached in local storage
  //Need to introduce on command cache busting

  const cacheDuration = 6.048e8;

  //Fetch exoplanet scenarios first

  for (let entry of payload) {
    const data: any[] = await cachedFetch(
      `https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?&table=exoplanets&select=pl_hostname,pl_pnum&${
        entry.query
      } and st_mass>0 and st_rad>0&format=json`,
      undefined,
      cacheDuration
    );

    //Sort our exoplanetary systems by the number of planets they contain in descending order

    const sortedData = data.sort(
      (entryA, entryB) => entryB.pl_pnum - entryA.pl_pnum
    );

    removeDuplicatesByKey(sortedData, 'pl_hostname').forEach((scenario: any) =>
      dispatch(
        addScenario({
          name: scenario.pl_hostname,
          type: entry.alias,
          exoPlanetArchive: true,
          fileName: ''
        })
      )
    );
  }

  //Then get the custom made scenarios

  const data = await cachedFetch(
    `${
      process.env.NODE_ENV === 'production'
        ? './data/'
        : 'http://localhost:9000/'
    }list.json`,
    undefined,
    cacheDuration
  );

  //Dispatch them

  data.forEach(
    (scenario: {
      name: string;
      type: string;
      exoPlanetArchive: boolean;
      fileName: string;
    }) => dispatch(addScenario(scenario))
  );

  //And we're ready to go

  dispatch(boot(true));

  dispatch(
    setLoading({
      loading: false,
      whatIsLoading: ''
    })
  );
};
