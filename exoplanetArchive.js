const fetch = require('node-fetch');

const createExoplanetScenarios = async () => {
  const url = "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?&table=exoplanets&select=pl_hostname,st_mass,st_teff,st_rad,pl_letter,pl_bmassj,pl_radj,pl_orbper,pl_orbsmax,pl_orbeccen,pl_orblper,pl_facility,pl_orbincl&where=pl_pnum%3E0%20and%20st_mass%3E0%20and%20st_rad%3E0&format=json";

  const response = await fetch(url)

  const data = await response.json()

  console.log(data)
}

createExoplanetScenarios();