import getIntegrator from '../Integrators';
import { planFlight } from './lambert';
import { getObjFromArrByKeyValuePair } from '../../utils';

/*

                                                   ,:
                                                 ,' |
                                                /   :
                                             --'   /
                                             \/ />/
                                             / <//_\
                                          __/   /
                                          )'-. /
                                          ./  :\
                                           /.' '
                                         '/'
                                         +
                                        '
                                      `.
                                  .-"-
                                 (    |
                              . .-'  '.
                             ( (.   )8:
                         .'    / (_  )
                          _. :(.   )8P  `
                      .  (  `-' (  `.   .
                       .  :  (   .a8a)
                      /_`( "a `a. )"'
                  (  (/  .  ' )=='
                 (   (    )  .8"   +
                   (`'8a.( _(   (
                ..-. `8P    ) `  )  +
              -'   (      -ab:  )
            '    _  `    (8P"Ya
          _(    (    )b  -`.  ) +
         ( 8)  ( _.aP" _a   \( \   *
       +  )/    (8P   (88    )  )
          (a:f   "     `"       `


*/

self.onmessage = async ({
  data: {
    integrator,
    g,
    dt,
    tol,
    minDt,
    maxDt,
    elapsedTime,
    masses,
    departure,
    arrival,
    target,
    primary
  }
}) => {
  const system = getIntegrator(integrator, {
    g,
    dt,
    tol,
    minDt,
    maxDt,
    masses,
    elapsedTime
  });

  const [spacecraft] = system.masses;
  let targetMass = getObjFromArrByKeyValuePair(system.masses, 'name', target);

  //To speed things up, don't include masses that don't significantly perturb our target

  for (let i = 0; i < system.masses.length; i++) {
    const name = system.masses[i].name;

    if (name !== target && name !== primary && name !== target.perturber) {
      system.masses.splice(i, 1);
      i--;
    }
  }

  let primaryM = getObjFromArrByKeyValuePair(system.masses, 'name', primary).m;

  const trajectoryGenerator = () => {
    return new Promise(resolve => {
      const interval = setInterval(() => {
        for (let i = 0; i < 15; i++) system.iterate();

        if (system.elapsedTime >= arrival) {
          targetMass = getObjFromArrByKeyValuePair(
            system.masses,
            'name',
            target
          );

          clearInterval(interval);

          resolve(
            planFlight(
              system.elapsedTime - departure,
              spacecraft,
              targetMass,
              g * primaryM
            )
          );
        }
      }, 16);
    });
  };

  const [velocities] = await trajectoryGenerator();

  self.postMessage({
    trajectory: [
      {
        x: velocities.initVel.x,
        y: velocities.initVel.y,
        z: velocities.initVel.z
      },
      {
        x: velocities.finalVel.x,
        y: velocities.finalVel.y,
        z: velocities.finalVel.z,
        p: { ...targetMass, t: system.elapsedTime }
      }
    ]
  });
};
