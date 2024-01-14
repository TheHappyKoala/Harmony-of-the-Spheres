import Euler from "./euler";
import RK4 from "./rk4";
import { FixedTimeStepIntegratorConfigType } from "../../types/physics";

export const integrators = ["Euler", "RK4"];

const getIntegrator = (
  integrator: string,
  config: FixedTimeStepIntegratorConfigType,
) => {
  switch (integrator) {
    case "Euler":
      return new Euler(config);

    case "RK4":
      return new RK4(config);

    default:
      return new Euler(config);
  }
};

export default getIntegrator;
