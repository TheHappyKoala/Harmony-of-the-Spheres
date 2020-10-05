const { worldTypes } = require("./constants");

module.exports = (mass, temperature, hz, distance) => {
  if (mass < 0.000015015 && temperature > 1500) {
    return worldTypes.LAVA_WORLD;
  }

  if (
    (mass < 3.213e-7 && hz[0] > distance) ||
    (mass < 0.0000016065 && temperature > 700)
  ) {
    return worldTypes.DEAD_WORLD;
  }

  if (hz[0] < distance && hz[1] > distance && mass < 0.000015015) {
    return worldTypes.HABITABLE_WORLD;
  } else if (mass < 0.000015015 && distance > hz[1]) {
    return worldTypes.ICY_WORLD;
  }

  if (mass > 0.000015015) {
    if (temperature < 80) {
      return worldTypes.SUDARSKY_CLASS_ZERO;
    } else if (temperature < 150) {
      return worldTypes.SUDARSKY_CLASS_ONE;
    } else if (temperature < 250) {
      return worldTypes.SUDARSKY_CLASS_TWO;
    } else if (temperature < 800) {
      return worldTypes.SUDARSKY_CLASS_THREE;
    } else if (temperature < 1400) {
      return worldTypes.SUDARSKY_CLASS_FOUR;
    } else {
      return worldTypes.SUDARSKY_CLASS_FIVE;
    }
  }

  return worldTypes.DESERT_WORLD;
};
