const THREE = require("three");

const utils = require("./utils");
const Simplex = require("./Simplex");
const worldTemplates = require("./worldTemplates");

module.exports = class {
  constructor(mass, isGasGiant, resolution, noiseDetail) {
    this.mass = mass;
    this.isGasGiant = isGasGiant;
    this.resolution = resolution;

    this.noiseScale = utils.getRandomFloatInRange(0.0007, 0.007);

    const randomInteger = utils.getRandomInteger(
      0,
      worldTemplates[mass.worldType].length - 1
    );

    this.colors = worldTemplates[mass.worldType][randomInteger].data;

    this.size = this.resolution * this.resolution;

    this.data = new Uint8Array(4 * this.size);

    this.simplex = new Simplex();
    this.noiseDetail = noiseDetail;
    this.simplex.noiseDetail(noiseDetail, 0.7);

    this.addTerrain();
  }

  paintWorldPixel(elevation, colors) {
    const colorsLen = colors.length;

    for (let i = 0; i < colorsLen; i++) {
      if (colors[i] && elevation < colors[i][3]) {
        elevation = utils.clamp(elevation, colors[i][4], 1);

        return [
          colors[i][0] * elevation,
          colors[i][1] * elevation,
          colors[i][2] * elevation
        ];
      }
    }
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

    let x, y, z;

    if (!this.isGasGiant) {
      x = 123 + a * this.noiseScale;
      y = 132 + b * this.noiseScale;
      z = 312 + c * this.noiseScale;
    } else {
      x = 123 + c * this.noiseScale;
      y = (132 + b * this.noiseScale) / 30;
      z = (312 + a * this.noiseScale) / 15;
    }

    return this.simplex.generateNoise(x, y, z);
  }

  addTerrain() {
    for (let i = 0; i < this.size; i++) {
      let elevation = this.generateTerrainPixel(i);

      const color = new THREE.Color().setRGB(
        ...this.paintWorldPixel(elevation, this.colors)
      );

      this.data[i * 4] = color.r * 255;
      this.data[i * 4 + 1] = color.g * 255;
      this.data[i * 4 + 2] = color.b * 255;
      this.data[i * 4 + 3] = 0;
    }
  }
};
