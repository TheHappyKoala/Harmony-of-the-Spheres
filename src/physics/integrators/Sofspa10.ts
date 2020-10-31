import Euler from "./Euler";

export default class extends Euler {
  generatePositionVectors(v: Vector[], dt: number, p: Vector[]): Vector[] {
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

  generateVelocityVectors(a: Vector[], dt: number, v: Vector[]): Vector[] {
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

    const vCoeffs = [
      0.07879572252168641926390768,
      0.31309610341510852776481247,
      0.02791838323507806610952027,
      -0.2295928415939070941512134,
      0.13096206107716486317465686,
      -0.26973340565451071434460973,
      0.07497334315589143566613711,
      0.11199342399981020488957508,
      0.36613344954622675119314812,
      -0.39910563013603589787862981,
      0.10308739852747107731580277,
      0.41143087395589023782070412,
      -0.00486636058313526176219566,
      -0.39203335370863990644808194,
      0.0519425029624496470371829,
      0.05066509075992449633587434,
      0.0496743706397298790545688,
      0.04931773575959453791768001,
      0.0496743706397298790545688,
      0.05066509075992449633587434,
      0.0519425029624496470371829,
      -0.39203335370863990644808194,
      -0.00486636058313526176219566,
      0.41143087395589023782070412,
      0.10308739852747107731580277,
      -0.39910563013603589787862981,
      0.36613344954622675119314812,
      0.11199342399981020488957508,
      0.07497334315589143566613711,
      -0.26973340565451071434460973,
      0.13096206107716486317465686,
      -0.2295928415939070941512134,
      0.02791838323507806610952027,
      0.31309610341510852776481247,
      0.07879572252168641926390768
    ];

    const pCoeffs = [
      vCoeffs[0] / 2,
      (vCoeffs[0] + vCoeffs[1]) / 2,
      (vCoeffs[1] + vCoeffs[2]) / 2,
      (vCoeffs[2] + vCoeffs[3]) / 2,
      (vCoeffs[3] + vCoeffs[4]) / 2,
      (vCoeffs[4] + vCoeffs[5]) / 2,
      (vCoeffs[5] + vCoeffs[6]) / 2,
      (vCoeffs[6] + vCoeffs[7]) / 2,
      (vCoeffs[7] + vCoeffs[8]) / 2,
      (vCoeffs[8] + vCoeffs[9]) / 2,
      (vCoeffs[9] + vCoeffs[10]) / 2,
      (vCoeffs[10] + vCoeffs[11]) / 2,
      (vCoeffs[11] + vCoeffs[12]) / 2,
      (vCoeffs[12] + vCoeffs[13]) / 2,
      (vCoeffs[13] + vCoeffs[14]) / 2,
      (vCoeffs[14] + vCoeffs[15]) / 2,
      (vCoeffs[15] + vCoeffs[16]) / 2,
      (vCoeffs[16] + vCoeffs[17]) / 2,
      (vCoeffs[16] + vCoeffs[17]) / 2,
      (vCoeffs[15] + vCoeffs[16]) / 2,
      (vCoeffs[14] + vCoeffs[15]) / 2,
      (vCoeffs[13] + vCoeffs[14]) / 2,
      (vCoeffs[12] + vCoeffs[13]) / 2,
      (vCoeffs[11] + vCoeffs[12]) / 2,
      (vCoeffs[10] + vCoeffs[11]) / 2,
      (vCoeffs[9] + vCoeffs[10]) / 2,
      (vCoeffs[8] + vCoeffs[9]) / 2,
      (vCoeffs[7] + vCoeffs[8]) / 2,
      (vCoeffs[6] + vCoeffs[7]) / 2,
      (vCoeffs[5] + vCoeffs[6]) / 2,
      (vCoeffs[4] + vCoeffs[5]) / 2,
      (vCoeffs[3] + vCoeffs[4]) / 2,
      (vCoeffs[2] + vCoeffs[3]) / 2,
      (vCoeffs[1] + vCoeffs[2]) / 2,
      (vCoeffs[0] + vCoeffs[1]) / 2,
      vCoeffs[0] / 2
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
