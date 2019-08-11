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
    const [spacecraft] = system.masses;
    let targetMass = getObjFromArrByKeyValuePair(system.masses, 'name', target);
    for (let i = 0; i < system.masses.length; i++) {
        const name = system.masses[i].name;
        if (name !== target && name !== primary && name !== target.perturber) {
            system.masses.splice(i, 1);
            i--;
        }
    }
    let primaryAtDeparture = (primaryAtDeparture = getObjFromArrByKeyValuePair(system.masses, 'name', primary));
    const trajectoryGenerator = () => {
        return new Promise(resolve => {
            const interval = setInterval(() => {
                for (let i = 0; i < 15; i++)
                    system.iterate();
                if (system.elapsedTime >= arrival) {
                    targetMass = getObjFromArrByKeyValuePair(system.masses, 'name', target);
                    clearInterval(interval);
                    resolve(planFlight(system.elapsedTime - departure, spacecraft, targetMass, primaryAtDeparture));
                }
            }, 16);
        });
    };
    const [velocities] = yield trajectoryGenerator();
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
                p: Object.assign({}, targetMass, { t: system.elapsedTime })
            }
        ]
    });
});
//# sourceMappingURL=trajectoryCruncher.js.map