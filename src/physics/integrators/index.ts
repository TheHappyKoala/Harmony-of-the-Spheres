import Euler from "./euler";
import { FixedTimeStepIntegratorConfigType } from "../../types/physics";

export const integrators = ["Euler"];

const getIntegrator = (
  integrator: string,
  config: FixedTimeStepIntegratorConfigType,
) => {
  switch (integrator) {
    case "Euler":
      return new Euler(config);

    default:
      return new Euler(config);
  }
};

export default getIntegrator;
