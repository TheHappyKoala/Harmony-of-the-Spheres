import Euler from './Euler';
export default class extends Euler {
    constructor({ g, dt, masses, elapsedTime }) {
        super({ g, dt, masses, elapsedTime });
        this.epsilon = 0.1786178958448091;
        this.lambda = -0.2123418310626054;
        this.chi = -0.6626458266981849e-1;
    }
    generatePositionVectors(v, dt, p) {
        super.generatePositionVectors(v, dt);
        const pFinal = [];
        const vLen = v.length;
        for (let i = 0; i < vLen; i++) {
            let vI = v[i];
            let pI = p[i];
            pFinal[i] = this.p
                .set({ x: pI.x, y: pI.y, z: pI.z })
                .addScaledVector(dt, vI)
                .toObject();
        }
        return pFinal;
    }
    generateVelocityVectors(a, dt, v) {
        super.generateVelocityVectors(a, dt);
        const vFinal = [];
        const vLen = v.length;
        for (let i = 0; i < vLen; i++) {
            let vI = v[i];
            let aI = a[i];
            vFinal[i] = this.v
                .set({ x: vI.x, y: vI.y, z: vI.z })
                .addScaledVector(dt, aI)
                .toObject();
        }
        return vFinal;
    }
    iterate() {
        const a1 = this.epsilon * this.dt;
        const a2 = (1 - 2 * this.lambda) * this.dt / 2;
        const a3 = this.chi * this.dt;
        const a4 = this.lambda * this.dt;
        const a5 = (1 - 2 * (this.chi + this.epsilon)) * this.dt;
        const s = this.getStateVectors(this.masses);
        const pCoeffs = [a1, a3, a5, a3, a1];
        const vCoeffs = [a2, a4, a4, a2];
        let p = s.p;
        let v = s.v;
        const coeffsLen = vCoeffs.length;
        for (let i = 0; i < coeffsLen; i++) {
            p = this.generatePositionVectors(v, pCoeffs[i], p);
            v = this.generateVelocityVectors(this.generateAccelerationVectors(p), vCoeffs[i], v);
        }
        p = this.generatePositionVectors(v, pCoeffs[coeffsLen], p);
        this.updateStateVectors(p, v);
        this.incrementElapsedTime();
    }
}
//# sourceMappingURL=PEFRL.js.map