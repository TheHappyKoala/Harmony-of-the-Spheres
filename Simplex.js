//JavaScript port of Stefan Gustavson's implementation of Ken Perlin's simplex noise
//https://github.com/stegu/webgl-noise

module.exports = class {
  constructor() {
    this.F3 = 1 / 3;
    this.G3 = 1 / 6;

    this.aGrad3 = [
      [1, 1, 0],
      [-1, 1, 0],
      [1, -1, 0],
      [-1, -1, 0],
      [1, 0, 1],
      [-1, 0, 1],
      [1, 0, -1],
      [-1, 0, -1],
      [0, 1, 1],
      [0, -1, 1],
      [0, 1, -1],
      [0, -1, -1]
    ];

    this.aPerm;

    this.g;
    this.n0;
    this.n1;
    this.n2;
    this.n3;
    this.s;
    this.i;
    this.j;
    this.k;
    this.t;
    this.x0;
    this.y0;
    this.z0;
    this.i1;
    this.j1;
    this.k1;
    this.i2;
    this.j2;
    this.k2;
    this.x1;
    this.y1;
    this.z1;
    this.x2;
    this.y2;
    this.z2;
    this.x3;
    this.y3;
    this.z3;
    this.ii;
    this.jj;
    this.kk;
    this.gi0;
    this.gi1;
    this.gi2;
    this.gi3;
    this.t0;
    this.t1;
    this.t2;
    this.t3;

    this.oRng = Math;
    this.iOctaves = 1;
    this.fPersistence = 0.5;
    this.fFreq;
    this.fPers;
    this.aOctavesFreq; 
    this.aOctavesPers; 
    this.fPersMax; 

    this.setPerm();
    this.octavesFreqPers();
  }

  octavesFreqPers() {
    let fFreq; 
    let fPers;

    this.aOctavesFreq = [];
    this.aOctavesPers = [];

    this.fPersMax = 0;

    for (var i = 0; i < this.iOctaves; i++) {
      fFreq = Math.pow(2, i);
      fPers = Math.pow(this.fPersistence, i);

      this.fPersMax += fPers;
      this.aOctavesFreq.push(fFreq);
      this.aOctavesPers.push(fPers);
    }

    this.fPersMax = 1 / this.fPersMax;
  }

  dot(g, x, y, z) {
    return g[0] * x + g[1] * y + g[2] * z;
  }

  setPerm() {
    let i;
    const p = [];

    for (i = 0; i < 256; i++) p[i] = Math.floor(this.oRng.random() * 256);
    
    this.aPerm = [];

    for (i = 0; i < 512; i++) this.aPerm[i] = p[i & 255];
    
  }

  noise(x, y, z) {
    this.s = (x + y + z) * this.F3; 
    this.i = Math.floor(x + this.s);
    this.j = Math.floor(y + this.s);
    this.k = Math.floor(z + this.s);
    this.t = (this.i + this.j + this.k) * this.G3;

    this.x0 = x - (this.i - this.t); 
    this.y0 = y - (this.j - this.t); 
    this.z0 = z - (this.k - this.t);

    if (this.x0 >= this.y0) {
      if (this.y0 >= this.z0) {
        this.i1 = 1;
        this.j1 = 0;
        this.k1 = 0;
        this.i2 = 1;
        this.j2 = 1;
        this.k2 = 0;
      } else if (this.x0 >= this.z0) {
        this.i1 = 1;
        this.j1 = 0;
        this.k1 = 0;
        this.i2 = 1;
        this.j2 = 0;
        this.k2 = 1;
      } else {
        this.i1 = 0;
        this.j1 = 0;
        this.k1 = 1;
        this.i2 = 1;
        this.j2 = 0;
        this.k2 = 1;
      }
    } else {
      if (this.y0 < this.z0) {
        this.i1 = 0;
        this.j1 = 0;
        this.k1 = 1;
        this.i2 = 0;
        this.j2 = 1;
        this.k2 = 1;
      } else if (this.x0 < this.z0) {
        this.i1 = 0;
        this.j1 = 1;
        this.k1 = 0;
        this.i2 = 0;
        this.j2 = 1;
        this.k2 = 1;
      } else {
        this.i1 = 0;
        this.j1 = 1;
        this.k1 = 0;
        this.i2 = 1;
        this.j2 = 1;
        this.k2 = 0;
      }
    }

    this.x1 = this.x0 - this.i1 + this.G3; 
    this.y1 = this.y0 - this.j1 + this.G3;
    this.z1 = this.z0 - this.k1 + this.G3;
    this.x2 = this.x0 - this.i2 + this.F3; 
    this.y2 = this.y0 - this.j2 + this.F3;
    this.z2 = this.z0 - this.k2 + this.F3;
    this.x3 = this.x0 - 0.5; 
    this.y3 = this.y0 - 0.5;
    this.z3 = this.z0 - 0.5;

    this.ii = this.i & 255;
    this.jj = this.j & 255;
    this.kk = this.k & 255;

    this.t0 = 0.6 - this.x0 * this.x0 - this.y0 * this.y0 - this.z0 * this.z0;

    if (this.t0 < 0) {
      this.n0 = 0;
    } else {
      this.t0 *= this.t0;
      this.gi0 =
        this.aPerm[this.ii + this.aPerm[this.jj + this.aPerm[this.kk]]] % 12;
      this.n0 =
        this.t0 *
        this.t0 *
        this.dot(this.aGrad3[this.gi0], this.x0, this.y0, this.z0);
    }

    this.t1 = 0.6 - this.x1 * this.x1 - this.y1 * this.y1 - this.z1 * this.z1;

    if (this.t1 < 0) {
      this.n1 = 0;
    } else {
      this.t1 *= this.t1;
      this.gi1 =
        this.aPerm[
          this.ii +
            this.i1 +
            this.aPerm[this.jj + this.j1 + this.aPerm[this.kk + this.k1]]
        ] % 12;
      this.n1 =
        this.t1 *
        this.t1 *
        this.dot(this.aGrad3[this.gi1], this.x1, this.y1, this.z1);
    }

    this.t2 = 0.6 - this.x2 * this.x2 - this.y2 * this.y2 - this.z2 * this.z2;

    if (this.t2 < 0) {
      this.n2 = 0;
    } else {
      this.t2 *= this.t2;
      this.gi2 =
        this.aPerm[
          this.ii +
            this.i2 +
            this.aPerm[this.jj + this.j2 + this.aPerm[this.kk + this.k2]]
        ] % 12;
      this.n2 =
        this.t2 *
        this.t2 *
        this.dot(this.aGrad3[this.gi2], this.x2, this.y2, this.z2);
    }

    this.t3 = 0.6 - this.x3 * this.x3 - this.y3 * this.y3 - this.z3 * this.z3;

    if (this.t3 < 0) {
      this.n3 = 0;
    } else {
      this.t3 *= this.t3;
      this.gi3 =
        this.aPerm[
          this.ii + 1 + this.aPerm[this.jj + 1 + this.aPerm[this.kk + 1]]
        ] % 12;
      this.n3 =
        this.t3 *
        this.t3 *
        this.dot(this.aGrad3[this.gi3], this.x3, this.y3, this.z3); 
    }

    return 32 * (this.n0 + this.n1 + this.n2 + this.n3);
  }

  generateNoise(x, y, z) {
    let fResult = 0;

    for (this.g = 0; this.g < this.iOctaves; this.g++) {
      this.fFreq = this.aOctavesFreq[this.g];
      this.fPers = this.aOctavesPers[this.g];
      fResult +=
        this.fPers *
        this.noise(this.fFreq * x, this.fFreq * y, this.fFreq * z);
    }

    return (fResult * this.fPersMax + 1) * 0.5;
  }

  noiseDetail(octaves, falloff) {
    this.iOctaves = octaves;
    this.fPersistence = falloff || this.fPersistence;

    this.octavesFreqPers();
  }

  setRng(r) {
    this.oRng = r;

    setPerm();
  }
};
