var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import getIntegrator from '../Integrators';
import { planFlight } from './lambert';
import { getObjFromArrByKeyValuePair } from '../../utils';
self.onmessage = ({ data: { integrator, g, dt, tol, minDt, maxDt, elapsedTime, masses, departure, arrival, target, primary } }) => __awaiter(this, void 0, void 0, function* () {
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
                    primaryAtDeparture = getObjFromArrByKeyValuePair(system.masses, 'name', primary);
                }
                if (system.elapsedTime >= arrival) {
                    const targetPosition = getObjFromArrByKeyValuePair(system.masses, 'name', target);
                    futurePositions.push({
                        x: targetPosition.x,
                        y: targetPosition.y,
                        z: targetPosition.z,
                        t: system.elapsedTime
                    });
                    clearInterval(interval);
                    const [departurePosition, arrivalPosition] = futurePositions;
                    resolve(planFlight(arrival - departure, departurePosition, arrivalPosition, primaryAtDeparture));
                }
            }, 4);
        });
    };
    const [velocities] = yield trajectoryGenerator();
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
});
//# sourceMappingURL=trajectoryCruncher.js.map