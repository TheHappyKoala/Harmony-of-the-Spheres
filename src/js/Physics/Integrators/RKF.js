import Euler from './Euler';

export default class extends Euler {
  constructor(params) {
    super(params);
    //this.tol = params.tol;
    //this.max_dt = params.max_dt;
    //this.min_dt = params.min_dt;
    this.tol = 0.001;
    this.max_dt = 0.1;
    this.min_dt = 1e-5;
  }

  calculate_error(p1, p2) {
    let error = 0;
    const pLen = p1.length;

    for (let i = 0; i < pLen; i++) {
      error += Math.sqrt(
        Math.pow(p1[i].x - p2[i].x, 2) +
          Math.pow(p1[i].y - p2[i].y, 2) +
          Math.pow(p1[i].z - p2[i].z, 2)
      );
    }
    return error;
  }

  k2(s, k1v, k1r) {
    let k2v = [];
    let k2r = [];
    let temp_pos = [];
    const kLen = k1r.length;

    const a1 = 1 / 4;

    for (let i = 0; i < kLen; i++) {
      temp_pos[i] = {
        x: s[i].x + a1 * this.dt * k1r[i].vx,
        y: s[i].y + a1 * this.dt * k1r[i].vy,
        z: s[i].z + a1 * this.dt * k1r[i].vz
      };

      k2r[i] = {
        vx: s[i].vx + k1v[i].ax * this.dt * a1,
        vy: s[i].vy + k1v[i].ay * this.dt * a1,
        vz: s[i].vz + k1v[i].az * this.dt * a1
      };
    }
    k2v = this.generateAccelerationVectors(temp_pos);
    return [k2v, k2r];
  }

  k3(s, k1v, k2v, k1r, k2r) {
    let k3v = [];
    let k3r = [];
    let temp_pos = [];
    const kLen = k1r.length;

    const a1 = 3 / 32;
    const a2 = 9 / 32;

    for (let i = 0; i < kLen; i++) {
      temp_pos[i] = {
        x: s[i].x + this.dt * (a1 * k1r[i].vx + a2 * k2r[i].vx),
        y: s[i].y + this.dt * (a1 * k1r[i].vy + a2 * k2r[i].vy),
        z: s[i].z + this.dt * (a1 * k1r[i].vz + a2 * k2r[i].vz)
      };

      k3r[i] = {
        vx: s[i].vx + this.dt * (a1 * k1v[i].ax + a2 * k2v[i].ax),
        vy: s[i].vy + this.dt * (a1 * k1v[i].ay + a2 * k2v[i].ay),
        vz: s[i].vz + this.dt * (a1 * k1v[i].az + a2 * k2v[i].az)
      };
    }
    k3v = this.generateAccelerationVectors(temp_pos);
    return [k3v, k3r];
  }

  k4(s, k1v, k2v, k3v, k1r, k2r, k3r) {
    let k4v = [];
    let k4r = [];
    let temp_pos = [];
    const kLen = k1r.length;

    const a1 = 1932 / 2197;
    const a2 = -7200 / 2197;
    const a3 = 7296 / 2197;

    for (let i = 0; i < kLen; i++) {
      temp_pos[i] = {
        x:
          s[i].x + this.dt * (a1 * k1r[i].vx + a2 * k2r[i].vx + a3 * k3r[i].vx),
        y:
          s[i].y + this.dt * (a1 * k1r[i].vy + a2 * k2r[i].vy + a3 * k3r[i].vy),
        z: s[i].z + this.dt * (a1 * k1r[i].vz + a2 * k2r[i].vz + a3 * k3r[i].vz)
      };

      k4r[i] = {
        vx:
          s[i].vx +
          this.dt * (a1 * k1v[i].ax + a2 * k2v[i].ax + a3 * k3v[i].ax),
        vy:
          s[i].vy +
          this.dt * (a1 * k1v[i].ay + a2 * k2v[i].ay + a3 * k3v[i].ay),
        vz:
          s[i].vz + this.dt * (a1 * k1v[i].az + a2 * k2v[i].az + a3 * k3v[i].az)
      };
    }
    k4v = this.generateAccelerationVectors(temp_pos);
    return [k4v, k4r];
  }

  k5(s, k1v, k2v, k3v, k4v, k1r, k2r, k3r, k4r) {
    let k5v = [];
    let k5r = [];
    let temp_pos = [];
    const kLen = k1r.length;

    const a1 = 439 / 216;
    const a2 = -8;
    const a3 = 3680 / 513;
    const a4 = -845 / 4104;

    for (let i = 0; i < kLen; i++) {
      temp_pos[i] = {
        x:
          s[i].x +
          this.dt *
            (a1 * k1r[i].vx + a2 * k2r[i].vx + a3 * k3r[i].vx + a4 * k4r[i].vx),
        y:
          s[i].y +
          this.dt *
            (a1 * k1r[i].vy + a2 * k2r[i].vy + a3 * k3r[i].vy + a4 * k4r[i].vy),
        z:
          s[i].z +
          this.dt *
            (a1 * k1r[i].vz + a2 * k2r[i].vz + a3 * k3r[i].vz + a4 * k4r[i].vz)
      };

      k5r[i] = {
        vx:
          s[i].vx +
          this.dt *
            (a1 * k1v[i].ax + a2 * k2v[i].ax + a3 * k3v[i].ax + a4 * k4v[i].ax),
        vy:
          s[i].vy +
          this.dt *
            (a1 * k1v[i].ay + a2 * k2v[i].ay + a3 * k3v[i].ay + a4 * k4v[i].ay),
        vz:
          s[i].vz +
          this.dt *
            (a1 * k1v[i].az + a2 * k2v[i].az + a3 * k3v[i].az + a4 * k4v[i].az)
      };
    }
    k5v = this.generateAccelerationVectors(temp_pos);
    return [k5v, k5r];
  }

  k6(s, k1v, k2v, k3v, k4v, k5v) {
    let k6r = [];
    const kLen = k1v.length;

    const a1 = -8 / 27;
    const a2 = 2;
    const a3 = -3544 / 2565;
    const a4 = 1859 / 4104;
    const a5 = -11 / 40;

    for (let i = 0; i < kLen; i++) {
      k6r[i] = {
        vx:
          s[i].vx +
          this.dt *
            (a1 * k1v[i].ax +
              a2 * this.dt * k2v[i].ax +
              a3 * k3v[i].ax +
              a4 * k4v[i].ax +
              a5 * k5v[i].ax),
        vy:
          s[i].vy +
          this.dt *
            (a1 * k1v[i].ay +
              a2 * this.dt * k2v[i].ay +
              a3 * k3v[i].ay +
              a4 * k4v[i].ay +
              a5 * k5v[i].ay),
        vz:
          s[i].vz +
          this.dt *
            (a1 * k1v[i].az +
              a2 * this.dt * k2v[i].az +
              a3 * k3v[i].az +
              a4 * k4v[i].az +
              a5 * k5v[i].az)
      };
    }
    return k6r;
  }

  iterate() {
    const s = this.getStateVectors(this.masses);

    const k1v = this.generateAccelerationVectors(s);
    const k1r = s;

    const p = []; // order 4 solution
    const p2 = []; // order 5 solution
    const v = [];

    const mLen = this.masses.length;

    let error = 1e10; // just to get the loop running
    while (error > this.tol) {
      const [k2v, k2r] = this.k2(s, k1v, k1r);
      const [k3v, k3r] = this.k3(s, k1v, k2v, k1r, k2r);
      const [k4v, k4r] = this.k4(s, k1v, k2v, k3v, k1r, k2r, k3r);
      const [k5v, k5r] = this.k5(s, k1v, k2v, k3v, k4v, k1r, k2r, k3r, k4r);
      const k6r = this.k6(s, k1v, k2v, k3v, k4v, k5v);

      for (let i = 0; i < mLen; i++) {
        p[i] = {
          x:
            s[i].x +
            this.dt *
              (25 / 216 * k1r[i].vx +
                1408 / 2565 * k3r[i].vx +
                2197 / 4104 * k4r[i].vx -
                1 / 5 * k5r[i].vx),
          y:
            s[i].y +
            this.dt *
              (25 / 216 * k1r[i].vy +
                1408 / 2565 * k3r[i].vy +
                2197 / 4104 * k4r[i].vy -
                1 / 5 * k5r[i].vy),
          z:
            s[i].z +
            this.dt *
              (25 / 216 * k1r[i].vz +
                1408 / 2565 * k3r[i].vz +
                2197 / 4104 * k4r[i].vz -
                1 / 5 * k5r[i].vz)
        };

        p2[i] = {
          x:
            s[i].x +
            this.dt *
              (16 / 135 * k1r[i].vx +
                6656 / 12825 * k3r[i].vx +
                28561 / 56430 * k4r[i].vx -
                9 / 50 * k5r[i].vx +
                2 / 55 * k6r[i].vx),
          y:
            s[i].y +
            this.dt *
              (16 / 135 * k1r[i].vy +
                6656 / 12825 * k3r[i].vy +
                28561 / 56430 * k4r[i].vy -
                9 / 50 * k5r[i].vy +
                2 / 55 * k6r[i].vy),
          z:
            s[i].z +
            this.dt *
              (16 / 135 * k1r[i].vz +
                6656 / 12825 * k3r[i].vz +
                28561 / 56430 * k4r[i].vz -
                9 / 50 * k5r[i].vz +
                2 / 55 * k6r[i].vz)
        };

        v[i] = {
          vx:
            s[i].vx +
            this.dt *
              (25 / 216 * k1v[i].ax +
                1408 / 2565 * k3v[i].ax +
                2197 / 4104 * k4v[i].ax -
                1 / 5 * k5v[i].ax),
          vy:
            s[i].vy +
            this.dt *
              (25 / 216 * k1v[i].ay +
                1408 / 2565 * k3v[i].ay +
                2197 / 4104 * k4v[i].ay -
                1 / 5 * k5v[i].ay),
          vz:
            s[i].vz +
            this.dt *
              (25 / 216 * k1v[i].az +
                1408 / 2565 * k3v[i].az +
                2197 / 4104 * k4v[i].az -
                1 / 5 * k5v[i].az)
        };
      }
      error = this.calculate_error(p, p2);
      if (error != 0) {
        this.dt = this.dt * Math.pow(this.tol / (2 * error), 1 / 4);
      }
      if (this.dt < this.min_dt) {
        this.dt = this.min_dt;
      } else if (this.dt > this.max_dt) {
        this.dt = this.max_dt;
      }
    }
    this.updateStateVectors(p, v);
    this.incrementElapsedTime();
  }
}
