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

  const futurePositions = [];
  let primaryAtDeparture;

  const trajectoryGenerator = () => {
    return new Promise(resolve => {
      const interval = setInterval(() => {
        system.iterate();

        if (system.elapsedTime >= departure && !futurePositions.length) {
          const [spacecraft] = system.masses;

          futurePositions.push({
            x: spacecraft.x,
            y: spacecraft.y,
            z: spacecraft.z,
            t: system.elapsedTime
          });

          primaryAtDeparture = getObjFromArrByKeyValuePair(
            system.masses,
            'name',
            primary
          );
        }

        if (system.elapsedTime >= arrival) {
          const targetPosition = getObjFromArrByKeyValuePair(
            system.masses,
            'name',
            target
          );

          futurePositions.push({
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
            t: system.elapsedTime
          });

          clearInterval(interval);

          const [departurePosition, arrivalPosition] = futurePositions;

          resolve(
            planFlight(
              arrival - departure,
              departurePosition,
              arrivalPosition,
              primaryAtDeparture
            )
          );
        }
      }, 4);
    });
  };

  const [velocities] = await trajectoryGenerator();

  self.postMessage({
    trajectory: [
      {
        x: velocities.initVel.x,
        y: velocities.initVel.y,
        z: velocities.initVel.z,
        t: futurePositions[0].t
      },
      {
        x: velocities.finalVel.x,
        y: velocities.finalVel.y,
        z: velocities.finalVel.z,
        t: futurePositions[1].t
      }
    ]
  });
};
