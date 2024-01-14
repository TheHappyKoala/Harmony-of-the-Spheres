import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { ScenarioType } from "../types/scenario";
import { setScenario } from "../state/creators";

const useHydrateStore = (scenario: ScenarioType): void => {
  const dispatch = useDispatch();

  useMemo(() => {
    if (scenario) {
      dispatch(setScenario(scenario));
    }
  }, [dispatch]);
};

export default useHydrateStore;
