import Euler from './Euler';
import RK4 from './RK4';

export const integrators = ['RK4', 'Euler'];

export default function(integrator, config) {
  switch (integrator) {
    case 'RK4':
      return new RK4(config);
    case 'Euler':
      return new Euler(config);
    default:
      return new RK4(config);
  }
}
