const fetch = require("node-fetch");

const createExoplanetScenarios = async () => {
  const url =
    "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?&table=exoplanets&select=pl_hostname,st_mass,st_teff,st_rad,pl_letter,pl_bmassj,pl_radj,pl_orbper,pl_orbsmax,pl_orbeccen,pl_orblper,pl_facility,pl_orbincl&where=pl_pnum>6 and st_mass>0 and st_rad>0&format=json";

  const response = await fetch(url);

  const data = await response.json();

  const sortedScenarios = data.sort(entry => entry["pl_hostname"]);

  const chunkScenarios = (scenarios, i, currentScenarioName) => {
    if (i >= sortedScenarios.length) {
      return scenarios;
    } else {
      if (sortedScenarios[i]["pl_hostname"] === currentScenarioName) {
        scenarios[scenarios.length - 1].push(sortedScenarios[i]);
      } else {
        scenarios.push([sortedScenarios[i]]);
      }
      i++;
      return chunkScenarios(scenarios, i, sortedScenarios[i - 1]["pl_hostname"]);
    }
  };

  const scenarios = chunkScenarios([[]], 0, sortedScenarios[0]["pl_hostname"]);   
  
  console.log(scenarios)
};

createExoplanetScenarios();
