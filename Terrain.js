const THREE = require("three");
const Simplex = require("./Simplex");

function getRandomNumberInRange(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomRadian() {
  return Math.PI * 2 * Math.random();
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = class {
  constructor(mass, resolution, noiseDetail) {
    this.mass = mass;
    this.noiseScale = 0.007;
    this.resolution = resolution;

    this.terrainCallback = this[`get${this.mass.worldType}`].bind(this);

    this.size = this.resolution * this.resolution;

    this.data = new Uint8Array(4 * this.size);

    this.simplex = new Simplex();
    this.simplex.noiseDetail(noiseDetail);

    this.addTerrain();
  }

  getMercuryLikeWorld(elevation) {
    if (elevation < 0.25) {
      return [0.34 * elevation, 0.34 * elevation, 0.36 * elevation];
    } else if (elevation < 0.28) {
      return [0.36 * elevation, 0.36 * elevation, 0.36 * elevation];
    } else if (elevation < 0.32) {
      return [0.38 * elevation, 0.38 * elevation, 0.38 * elevation];
    } else if (elevation < 0.35) {
      return [0.4 * elevation, 0.4 * elevation, 0.4 * elevation];
    } else {
      return [0.45 * elevation, 0.45 * elevation, 0.45 * elevation];
    }
  }

  getMarsLikeWorld(elevation) {
    if (elevation < 0.1) {
      return [0.69 * elevation, 0.54 * elevation, 0.42 * elevation];
    } else if (elevation < 0.2) {
      return [0.64 * elevation, 0.5 * elevation, 0.37 * elevation];
    } else if (elevation < 0.3) {
      return [0.81 * elevation, 0.45 * elevation, 0.32 * elevation];
    } else if (elevation < 0.4) {
      return [0.61 * elevation, 0.31 * elevation, 0.21 * elevation];
    } else if (elevation < 0.5) {
      return [0.76 * elevation, 0.45 * elevation, 0.32 * elevation];
    } else if (elevation < 0.6) {
      return [0.96 * elevation, 0.57 * elevation, 0.39 * elevation];
    } else if (elevation < 0.6) {
      return [0.42 * elevation, 0.24 * elevation, 0.16 * elevation];
    } else {
      return [0.61 * elevation, 0.31 * elevation, 0.21 * elevation];
    }
  }

  getEarthLikeWorld(elevation) {
    if (elevation < 0.45) {
      return [0, 0, 0.8 * elevation];
    } else if (elevation < 0.48) {
      return [0.1 * elevation, 0.7 * elevation, 0.1 * elevation];
    } else if (elevation < 0.55) {
      return [0.5 * elevation, 0.8 * elevation, 0.1 * elevation];
    } else if (elevation < 0.67) {
      return [0.96 * elevation, 0.57 * elevation, 0.39 * elevation];
    } else {
      return [0.5 * elevation, 0.8 * elevation, 0.1 * elevation];
    }
  }

  getGanymedeLikeWorld(elevation) {
    if (elevation < 0.1) {
      return [0.3 * elevation, 0.25 * elevation, 0.22 * elevation];
    } else if (elevation < 0.2) {
      return [0.37 * elevation, 0.31 * elevation, 0.28 * elevation];
    } else if (elevation < 0.3) {
      return [0.65 * elevation, 0.86 * elevation, 0.88 * elevation];
    } else if (elevation < 0.4) {
      return [0.59 * elevation, 0.76 * elevation, 0.8 * elevation];
    } else if (elevation < 0.5) {
      return [0.93 * elevation, 0.95 * elevation, 0.95 * elevation];
    } else if (elevation < 0.6) {
      return [0.9 * elevation, 0.98 * elevation, 0.98 * elevation];
    } else if (elevation < 0.6) {
      return [0.6 * elevation, 0.6 * elevation, 0.6 * elevation];
    } else {
      return [0.95 * elevation, 0.95 * elevation, 0.95 * elevation];
    }
  }

  getRockyIceWorld(elevation) {
    if (elevation < 0.1) {
      return [0.95 * elevation, 0.95 * elevation, 0.95 * elevation];
    } else if (elevation < 0.2) {
      return [0.8 * elevation, 0.8 * elevation, 0.8 * elevation];
    } else if (elevation < 0.3) {
      return [0.85 * elevation, 0.85 * elevation, 0.85 * elevation];
    } else if (elevation < 0.4) {
      return [0.87 * elevation, 0.87 * elevation, 0.87 * elevation];
    } else if (elevation < 0.5) {
      return [0.93 * elevation, 0.93 * elevation, 0.93 * elevation];
    } else {
      return [1, 1, 1];
    }
  }

  getEuropaLikeWorld(elevation) {
    if (elevation < 0.55) {
      return [1, 1, 1];
    } else if (elevation < 0.58) {
      return [0.7 * elevation, 0.3 * elevation, 0.4 * elevation];
    } else {
      return [1, 1, 1];
    }
  }

  getVenusLikeWorld(elevation) {
    if (elevation < 0.1) {
      return [0.69 * elevation, 0.54 * elevation, 0.42 * elevation];
    } else if (elevation < 0.2) {
      return [0.64 * elevation, 0.5 * elevation, 0.37 * elevation];
    } else if (elevation < 0.3) {
      return [0.8 * elevation, 0.77 * elevation, 0.51 * elevation];
    } else if (elevation < 0.4) {
      return [0.88 * elevation, 0.67 * elevation, 0.48 * elevation];
    } else if (elevation < 0.5) {
      return [0.8 * elevation, 0.69 * elevation, 0.49 * elevation];
    } else if (elevation < 0.6) {
      return [0.99 * elevation, 0.98 * elevation, 0.75 * elevation];
    } else if (elevation < 0.7) {
      return [0.56 * elevation, 0.5 * elevation, 0.3 * elevation];
    } else {
      return [0.96 * elevation, 0.57 * elevation, 0.39 * elevation];
    }
  }

  getIceGiant(elevation) {
    return [0.6 * elevation, 0.15 * elevation, 0];
  }

  getGasGiant(elevation) {
    return [0.6 * elevation, 0.15 * elevation, 0];
  }

  generateTerrainPixel(i) {
    const fNX = ((i % this.resolution) + 0.5) / this.resolution;
    const fNY = ((i / this.resolution) << (0 + 0.5)) / this.resolution;

    const fRdx = fNX * 2 * Math.PI;
    const fRdy = fNY * Math.PI;

    const fYSin = Math.sin(fRdy + Math.PI);
    const a =
      ((0.5 * this.resolution) / (2 * Math.PI)) * Math.sin(fRdx) * fYSin;
    const b =
      ((0.5 * this.resolution) / (2 * Math.PI)) * Math.cos(fRdx) * fYSin;
    const c = ((0.5 * this.resolution) / (2 * Math.PI)) * Math.cos(fRdy);

    return this.simplex.generateNoise(
      123 + a * this.noiseScale,
      132 + b * this.noiseScale,
      312 + c * this.noiseScale
    );
  }

  addTerrain() {
    for (let i = 0; i < this.size; i++) {
      const elevation = this.generateTerrainPixel(i);

      const color = new THREE.Color().setRGB(
        ...this.terrainCallback(elevation)
      );

      this.data[i * 4] = color.r * 255;
      this.data[i * 4 + 1] = color.g * 255;
      this.data[i * 4 + 2] = color.b * 255;
      this.data[i * 4 + 3] = 0;
    }
  }
};
