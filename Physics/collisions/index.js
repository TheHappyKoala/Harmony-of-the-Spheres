import { getDistanceParams } from '../utils';
import H3 from '../vectors';
export default class {
    static doCollisions(masses, scale, callback) {
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
                        }
                        else {
                            survivor = massJ;
                            looser = massI;
                            looserIndex = i;
                        }
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
    static getClosestPointOnSphere(point, radius, rotation) {
        return point
            .normalise()
            .multiplyByScalar(radius)
            .rotate({ x: 1, y: 0, z: 0 }, -rotation.x)
            .rotate({ x: 0, y: 1, z: 0 }, -rotation.y)
            .rotate({ x: 0, y: 0, z: 1 }, -rotation.z);
    }
    static convertKineticEnergyToVelocityComponent(mass, fragmentMass, c, component) {
        return (Math.sign(mass[component]) *
            Math.sqrt(2 * this.getComponentKineticEnergy(mass, component) / fragmentMass) *
            c);
    }
    static getComponentKineticEnergy(mass, component) {
        return 0.5 * mass.m * (mass[component] * mass[component]);
    }
    static getDeflectedVelocity(survivor, looser) {
        const v = new H3().set({ x: looser.vx, y: looser.vy, z: 0 });
        const d = new H3().set({
            x: looser.x - survivor.x,
            y: looser.y - survivor.y,
            z: 0
        });
        const vLen = v.getLength();
        v.divideByScalar(vLen);
        d.normalise();
        const alpha = d.x * v.x + d.y * v.y;
        const g = 2 * alpha * vLen;
        d.multiplyByScalar(g);
        return {
            x: looser.vx - d.x,
            y: looser.vy - d.y,
            z: -looser.vz
        };
    }
}
//# sourceMappingURL=index.js.map