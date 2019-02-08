import { getDistanceParams } from '../utils';

/*
 * Takes an array of masses, the scenario scale and a callback
 * Iterates through the array of masses and performs a radius check to see if any of them have collided
 * If two masses have collided, the smaller of the two masses that collided is done away with and the callback is invoked
*/

export default function(masses, scale, callback) {
  let massesLen = masses.length;

  for (let i = 0; i < massesLen; i++) {
    const massI = masses[i];

    for (let j = 0; j < massesLen; j++) {
      if (i !== j) {
        const massJ = masses[j];

        const dParams = getDistanceParams(massI, massJ);

        const d = Math.sqrt(dParams.dSquared) * scale;

        if (d < massI.radius + massJ.radius) {
          let survivor;
          let looser;
          let looserIndex;

          if (massI.m > massJ.m || massI.m === massJ.m) {
            survivor = massI;
            looser = massJ;
            looserIndex = j;
          } else {
            survivor = massJ;
            looser = massI;
            looserIndex = i;
          }

          /*
           * For simplicity's sake, the looser's mass is added to that of the survivor of the collision
          */

          survivor.m = massI.m + massJ.m;

          masses.splice(looserIndex, 1);

          callback(looser, survivor);

          massesLen--;

          looserIndex--;
        }
      }
    }
  }
}
