import Euler from './Euler';
import RK4 from './RK4';

export const integrators = ['Euler', 'RK4'];

export default function(integrator, config) {
  switch (integrator) {
    case 'Euler':
      return new Euler(config);
    case 'RK4':
      return new RK4(config);
    default:
      return new RK4(config);
  }
}
