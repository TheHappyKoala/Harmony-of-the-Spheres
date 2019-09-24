import Euler from './Euler';

export default class extends Euler {
  generatePositionVectors(v: Vector[], dt: number, p?: Vector[]): Vector[] {
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

  generateVelocityVectors(a: Vector[], dt: number, v?: Vector[]): Vector[] {
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

  iterate(): void {
    const s = this.getStateVectors(this.masses);

    const pCoeffs = [
      0.3708351821753065,
      0.16628476927529068,
      -0.1091730577518966,
      -0.19155388040992194,
      -0.13739914490621316,
      0.31684454977447707,
      0.3249590053210324,
      -0.24079742347807487,
      -0.24079742347807487,
      0.3249590053210324,
      0.31684454977447707,
      -0.13739914490621316,
      -0.19155388040992194,
      -0.1091730577518966,
      0.16628476927529068,
      0.3708351821753065
    ];
    const vCoeffs = [
      0.741670364350613,
      -0.4091008258000316,
      0.1907547102962384,
      -0.5738624711160822,
      0.2990641813036559,
      0.33462491824529816,
      0.3152930923967666,
      -0.7968879393529164,
      0.3152930923967666,
      0.33462491824529816,
      0.2990641813036559,
      -0.5738624711160822,
      0.1907547102962384,
      -0.4091008258000316,
      0.741670364350613
    ];

    let p = s.p;
    let v = s.v;

    const coeffsLen = vCoeffs.length;

    for (let i = 0; i < coeffsLen; i++) {
      p = this.generatePositionVectors(v, this.dt * pCoeffs[i], p);
      v = this.generateVelocityVectors(
        this.generateAccelerationVectors(p),
        this.dt * vCoeffs[i],
        v
      );
    }

    p = this.generatePositionVectors(v, this.dt * pCoeffs[coeffsLen], p);

    this.updateStateVectors(p, v);

    this.incrementElapsedTime();
  }
}
