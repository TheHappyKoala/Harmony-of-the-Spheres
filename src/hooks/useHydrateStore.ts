import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { ScenarioType } from "../types/scenario";
import { setScenario } from "../state/creators";

const useHydrateStore = (scenario: ScenarioType): void => {
  const dispatch = useDispatch();

  useMemo(() => {
    if (scenario) {
      const processedScenario = {
        ...scenario,
        masses: scenario.masses.map((mass) => {
          return {
            ...mass,
            position: {
              ...mass.position,
              x: -mass.position.x,
              y: -mass.position.z,
              z: mass.position.y,
            },
            velocity: {
              ...mass.velocity,
              x: -mass.velocity.x,
              y: -mass.velocity.z,
              z: mass.velocity.y,
            },
          };
        }),
      };

      dispatch(setScenario(processedScenario));
    }
  }, [dispatch]);
};

export default useHydrateStore;
