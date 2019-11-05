import { AppState } from "../reducers";
import { ScenariosActionTypes, ADD_SCENARIO } from "../types/scenarios";
import { AppActionTypes } from "../types/app";
import { boot, setLoading } from "../creators/app";
import { Action, Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import cachedFetch from "../../cachedFetch";
import { removeDuplicatesByKey } from "../../utils";

export const addScenario = (
  payload: ScenarioSeed | ScenarioState
): ScenariosActionTypes => ({
  type: ADD_SCENARIO,
  payload
});

export const fetchScenarios = (
  payload: ExoplanetArchiveQuery[]
): ThunkAction<void, AppState, void, Action> => async (
  dispatch: Dispatch<ScenariosActionTypes | AppActionTypes>
) => {
  dispatch(
    setLoading({
      loading: true,
      whatIsLoading: "Loading not one world, but thousands"
    })
  );

  //How long scenarios are cached in local storage
  //Need to introduce on command cache busting

  const cacheDuration = 6.048e8;

  //Then get the custom made scenarios

  const data = await cachedFetch(
    `${
      process.env.NODE_ENV === "production"
        ? "./data/"
        : "http://localhost:9000/"
    }list.json`,
    undefined,
    cacheDuration
  );

  //Dispatch them

  data.forEach((scenario: ScenarioSeed) => dispatch(addScenario(scenario)));

  //Fetch exoplanet scenarios

  for (let entry of payload) {
    const data: ExoplanetScenarioSeed[] = await cachedFetch(
      `https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?&table=exoplanets&select=pl_hostname,pl_pnum&${entry.query} and st_mass>0 and st_rad>0&format=json`,
      undefined,
      cacheDuration
    );

    //Sort our exoplanetary systems by the number of planets they contain in descending order

    const sortedData = data.sort(
      (entryA, entryB) => entryB.pl_pnum - entryA.pl_pnum
    );

    removeDuplicatesByKey(sortedData, "pl_hostname").forEach(
      (scenario: ExoplanetScenarioSeed) =>
        dispatch(
          addScenario({
            name: scenario.pl_hostname,
            type: entry.alias,
            exoPlanetArchive: true
          })
        )
    );
  }

  //And we're ready to go

  dispatch(boot(true));

  dispatch(
    setLoading({
      loading: false,
      whatIsLoading: ""
    })
  );
};
