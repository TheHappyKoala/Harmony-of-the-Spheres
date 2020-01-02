const fetch = require("node-fetch");

const map = (array, index, callback, output = []) =>
  index === array.length
    ? output
    : map(array, index + 1, callback, [callback(array[index]), ...output]);

const SUN_RADIUS = 9767.441860465116;
const JUPITER_MASS = 9.543e-4;
const JUPITER_RADIUS = 976.7441860465117;
const G = 39.5;
const DT = 0.00005;
const SCALE = 2100000;

const chunkScenarios = (data, scenarios, i, currentScenarioName) => {
  if (i === data.length) {
    return scenarios;
  } else {
    if (data[i]["pl_hostname"] === currentScenarioName) {
      scenarios[scenarios.length - 1].push(data[i]);
    } else {
      scenarios.push([data[i]]);
    }

    i += 1;

    return chunkScenarios(data, scenarios, i, data[i - 1]["pl_hostname"]);
  }
};

const createExoplanetScenarios = async () => {
  const url =
    "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?&table=exoplanets&select=pl_hostname,st_mass,st_teff,st_rad,pl_letter,pl_bmassj,pl_radj,pl_orbper,pl_orbsmax,pl_orbeccen,pl_orblper,pl_facility,pl_orbincl&where=pl_pnum>6 and st_mass>0 and st_rad>0&format=json";

  const response = await fetch(url);

  const data = await response.json();

  const sortedScenarios = data.sort(entry => entry["pl_hostname"]);

  const scenarios = chunkScenarios(
    sortedScenarios,
    [[]],
    0,
    sortedScenarios[0]["pl_hostname"]
  );

  const processedMasses = map(scenarios, 0, scenario =>
    map(scenario, 0, mass => mass)
  );

  console.log(processedMasses);
};

createExoplanetScenarios();
