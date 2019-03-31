import Euler from './Euler';

export default class extends Euler {
  generatePositionVectors(p, v, dt) {
    const pFinal = [];
    const vLen = v.length;

    for (let i = 0; i < vLen; i++) {
      let vI = v[i];
      let pI = p[i];
      pFinal[i] = {
        x: pI.x + dt * vI.vx,
        y: pI.y + dt * vI.vy,
        z: pI.z + dt * vI.vz
      };
    }

    return pFinal;
  }

  generateVelocityVectors(p, v, dt) {
    const vFinal = [];
    const vLen = v.length;

    const a = this.generateAccelerationVectors(p);

    for (let i = 0; i < vLen; i++) {
      let vI = v[i];
      let aI = a[i];

      vFinal[i] = {
        vx: vI.vx + dt * aI.x,
        vy: vI.vy + dt * aI.y,
        vz: vI.vz + dt * aI.z
      };
    }

    return vFinal;
  }

  iterate() {
    const s = this.getStateVectors(this.masses);

    const pCoeffs = [
      0.74409614601461,
      -0.425227929490565,
      0.2762016693478,
      -0.0029155067911599275,
      -1.4465510537023341,
      1.4478689195210459,
      1.4451324786403945,
      -1.5386047235397915,
      -1.5386047235397915,
      1.4451324786403945,
      1.4478689195210459,
      -1.4465510537023341,
      -0.0029155067911599275,
      0.2762016693478,
      -0.425227929490565,
      0.74409614601461
    ];
    const vCoeffs = [
      1.48819229202922,
      -2.33864815101035,
      2.89105148970595,
      -2.89688250328827,
      0.00378039588360192,
      2.89195744315849,
      -0.00169248587770116,
      -3.075516961201882,
      -0.00169248587770116,
      2.89195744315849,
      0.00378039588360192,
      -2.89688250328827,
      2.89105148970595,
      -2.33864815101035,
      1.48819229202922
    ];

    let p = s;
    let v = s;
    const coeffsLen = vCoeffs.length;
    for (let i = 0; i < coeffsLen; i++) {
      p = this.generatePositionVectors(p, v, this.dt * pCoeffs[i]);
      v = this.generateVelocityVectors(p, v, this.dt * vCoeffs[i]);
    }
    p = this.generatePositionVectors(p, v, this.dt * pCoeffs[coeffsLen]);
    this.updateStateVectors(p, v);

    this.incrementElapsedTime();
  }
}
