import getIntegrator from "../integrators";
import {
  planFlight,
  propagateOrbitalElements,
  keplerToState,
  stateToKepler
} from "./lambert";
import { getObjFromArrByKeyValuePair } from "../../utils";
import { getOrbit } from "../../physics/utils";

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

export default function worker(self) {
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
      primary,
      a,
      e,
      i,
      w,
      o
    }
  }) => {
    const system = getIntegrator("RKN12", {
      g,
      dt,
      tol,
      minDt: 0.00000000000000000000000000000001,
      maxDt: 0.0001,
      masses,
      elapsedTime
    });

    const [spacecraft] = system.masses;
    let targetMass = getObjFromArrByKeyValuePair(system.masses, "name", target);

    let primaryM = getObjFromArrByKeyValuePair(system.masses, "name", primary)
      .m;

    const pm = getObjFromArrByKeyValuePair(system.masses, "name", primary);

    const orbElem1 = stateToKepler(
      {
        x: targetMass.x,
        y: targetMass.y,
        z: targetMass.z
      },
      {
        x: targetMass.vx,
        y: targetMass.vy,
        z: targetMass.vz
      },
      39.5 * primaryM
    );

    const orbElem2 = propagateOrbitalElements(
      orbElem1,
      arrival,
      39.5 * primaryM
    );
    const newStateVectors = keplerToState(orbElem2, 39.5 * primaryM);

    //To speed things up, don't include masses that don't significantly perturb our target

    for (let i = 0; i < system.masses.length; i++) {
      const name = system.masses[i].name;

      if (name !== target && name !== primary && name !== target.perturber) {
        system.masses.splice(i, 1);
        i--;
      }
    }

    const trajectoryGenerator = () => {
      return new Promise(resolve => {
        const interval = setInterval(() => {
          for (let i = 0; i < 15; i++) system.iterate();

          if (system.elapsedTime >= arrival) {
            targetMass = getObjFromArrByKeyValuePair(
              system.masses,
              "name",
              target
            );

            clearInterval(interval);

            targetMass.x = newStateVectors.posRel.x;
            targetMass.y = newStateVectors.posRel.y;
            targetMass.z = newStateVectors.posRel.z;

            resolve(
              planFlight(
                system.elapsedTime - departure,
                spacecraft,
                getOrbit(targetMass, { ...spacecraft, a, e, i, w, o }, g),
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
}
