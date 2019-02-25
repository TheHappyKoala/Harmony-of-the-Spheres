import Euler from './Euler';
import RK4 from './RK4';
import Verlet from './Verlet';

export const integrators = ['RK4', 'Euler', 'Verlet'];

export default function(integrator, config) {
  switch (integrator) {
    case 'RK4':
      return new RK4(config);
    case 'Euler':
      return new Euler(config);
    case 'Verlet':
      return new Verlet(config);
    default:
      return new RK4(config);
  }
}
