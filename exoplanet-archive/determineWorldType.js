module.exports = (mass, temperature, hz, distance) => {
  if (mass < 0.00003003 && temperature > 1000) {
    return "torturedWorld";
  }

  if (
    (mass < 3.213e-7 && hz[0] > distance) ||
    (mass < 0.0000016065 && temperature > 700)
  ) {
    return "deadWorld";
  }

  if (hz[0] < distance && hz[1] > distance && mass < 0.00003003) {
    return "habitableWorld";
  } else if (mass < 0.00003003 && distance > hz[1]) {
    return "icyWorld";
  }

  if (mass > 0.00003003) {
    if (temperature < 80) {
      return "sudarskyClassZero";
    } else if (temperature < 150) {
      return "sudarskyClassOne";
    } else if (temperature < 250) {
      return "sudarskyClassTwo";
    } else if (temperature < 800) {
      return "sudarskyClassThree";
    } else if (temperature < 1400) {
      return "sudarskyClassFour";
    } else {
      return "sudarskyClassFive";
    }
  }

  return "desertWorld";
};
