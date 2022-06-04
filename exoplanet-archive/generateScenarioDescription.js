const utils = require("./utils");
const stellarMassRadiusData = require("./stellarMassRadiusData");

const generateStarMarkup = star => {
  const { st_rad, st_teff, st_mass, st_met, hostname, st_age } = star;

  const starDimensions = 100 * st_rad;

  return `<div class="celestial-object-wrapper" id="${hostname}">
  <section>
  <h2>Star</h2>
  <div class="size-comparison-wrapper">
  <div class="celestial-sphere" style="width: 100px; height: 100px; background-color: rgb(${Object.values(utils.colorTemperatureToRGB(5778)).join(", ")});">
    <label>Sun</label>
  </div>
  <div class="celestial-sphere" style="width: ${starDimensions}px; height: ${starDimensions}px; background-color: rgb(${Object.values(utils.colorTemperatureToRGB(st_teff)).join(", ")})">
<label>${hostname}</label>
</div>
</div>
  </section>
  <table cellspacing="0">
  <tr>
    <td>Mass</td>
    <td>${st_mass} solar masses</td>
  </tr>
  <tr>
    <td>Radius</td>
    <td>${st_rad} solar radiae</td>
  </tr>
  <tr>
    <td>Temperature</td>
    <td>${isNaN(st_teff) ? '-': st_teff} kelvin</td>
  </tr>
  <tr>
    <td>Stellar Metallicity</td>
    <td>${isNaN(st_met) ? '-': st_met} decimal exponent</td>
  </tr>
  <tr>
    <td>Age</td>
    <td>${isNaN(st_age) ? '-': st_age} billion years</td>
  </tr>
</table>
</div>`;
};

const generatePlanetDescription = (planet, habitableZoneBounds) => {
  const masso = planet.pl_bmassj ? planet.pl_bmassj * 318 : false;

  const isRegularRockyPlanet =
    masso && masso < 1.5 && planet.pl_dens >= 3.5
      ? `At less than 1.5 Earth masses, ${planet.hostname} ${planet.pl_letter} is a terrestrial planet, much like the terrestrial planets we find in our solar system, namely Mercury, Venus, Earth and Mars.`
      : "";

  const superEarth =
    masso && masso > 1.5 && masso < 5 && planet.pl_dens >= 3.5
      ? `At ${masso.toFixed(3)} Earth masses, ${planet.hostname} ${
          planet.pl_letter
        } is a so called Super Earth. Super Earths could be terrestrial worlds like Earth, but they could also be ocean worlds or terrestrial worlds wrapped in a substantial atmosphere, in which case some refer to them as Mini Neptunes.`
      : "";

  const iceGiant =
    masso && masso > 5 && masso < 50
      ? `At more than 10 Earth masses, ${planet.hostname} ${planet.pl_letter} is an ice giant, a planet that is made up mostly of volatiles like water, amonia and methane, and enveloped by a dense hydrogen and helium atmosphere, much like Uranus and Neptune.`
      : "";

  const gasGiant =
    masso && masso > 50
      ? `At more than 50 Earth masses, ${planet.hostname} ${planet.pl_letter} is a gas giant, a planet whose mass is mostly made up of hydrogen and helium, like Jupiter and Saturn.`
      : "";

  const habitable =
    masso &&
    habitableZoneBounds[0] < planet.pl_orbsmax &&
    habitableZoneBounds[1] > planet.pl_orbsmax &&
    planet.pl_dens >= 3.5 &&
    masso < 5
      ? `${planet.hostname} ${planet.pl_letter} orbits within the habitable zone of its parent star and could, potentially, be a habitable planet with stable bodies of liquid water on its surface, like Earth.`
      : "";

  const ocean =
    masso &&
    habitableZoneBounds[1] > planet.pl_orbsmax &&
    planet.pl_dens < 3.5 &&
    masso < 5
      ? `With a mass below 5 Earth masses, a density of ${planet.pl_dens}, and a semi-major axis of ${planet.pl_orbsmax} astronomical units, ${planet.hostname} ${planet.pl_letter} could, potentially, be an ocean world - a planet with no dry land.`
      : "";

  const icy =
    masso && habitableZoneBounds[1] < planet.pl_orbsmax && masso < 5
      ? `With a mass below 5 Earth masses, and a semi-major axis of ${planet.pl_orbsmax} astronomical units, which is outside the habitable zone of ${planet.hostname}, ${planet.hostname} ${planet.pl_letter} is likely an icy world.`
      : "";

  return `<p>${isRegularRockyPlanet} ${superEarth} ${ocean} ${icy} ${iceGiant} ${gasGiant} ${habitable}</p>`;
};

const generatePlanetsMarkup = (scenario, habitableZoneBounds) =>
  scenario
    .map(planet => {
      const {
        pl_rade,
        pl_bmasse,
        pl_letter,
        pl_orbper,
        hostname,
        pl_dens,
        pl_orbsmax,
        pl_orbeccen,
        disc_facility,
        disc_telescope,
        disc_instrument,
        discoverymethod,
        disc_pubdate,
        disc_refname,
      } = planet;
      const planetName = `${hostname}-${pl_letter}`;

    const planetDimensions = 10 * pl_rade;

      return ` 
    <div class="celestial-object-wrapper" id="${hostname}-${pl_letter}">
      <section>
        <h2>${planetName}</h2>
        ${generatePlanetDescription(planet, habitableZoneBounds)}
        <div class="size-comparison-wrapper">
          <div class="celestial-sphere" style="width: 10px; height: 10px;">
            <label>Earth</label>
          </div>
          <div class="celestial-sphere" style="width: ${planetDimensions}px; height: ${planetDimensions}px;">
            <label>${planetName}</label>
          </div>
        </div>
        <table cellspacing="0">
          <tr>
            <td>Mass</td>
            <td>${pl_bmasse.toFixed(3)} Earth masses</td>
          </tr>
          <tr>
            <td>Density</td>
            <td>${pl_dens.toFixed(3)} grams per cubic centimeter</td>
          </tr>
          <tr>
            <td>Radius</td>
            <td>${pl_rade.toFixed(3)} Earth radiae</td>
          </tr>
          <tr>
            <td>Semi-major Axis</td>
            <td>${pl_orbsmax} AU</td>
          </tr>
          <tr>
            <td>Eccentricity</td>
            <td>${pl_orbeccen}</td>
          </tr>
          <tr>
            <td>Orbital Period</td>
            <td>${pl_orbper.toFixed(3)} days</td>
          </tr>
          <tr>
            <td>Discovery Method</td>
            <td>${discoverymethod}</td>
          </tr>
          <tr>
            <td>Discovery Facility</td>
            <td>${disc_facility}</td>
          </tr>
          <tr>
            <td>Discovery Telescope</td>
            <td>${disc_telescope}</td>
          </tr>
          <tr>
            <td>Discovery Instrument</td>
            <td>${disc_instrument}</td>
          </tr>
          <tr>
            <td>Discovery Date</td>
            <td>${disc_pubdate}</td>
          </tr>
          <tr>
            <td>Reference</td>
            <td>${disc_refname}</td>
          </tr>
        </table>
      </section>
    </div></a>`
    })
    .join(" ");

module.exports = (scenario, habitableZoneBounds) => {
  const mainTitle = `<h1 id="system">The ${scenario[0].hostname} Exoplanetary System</h1>`;

  const { hostname, sy_pnum, sy_dist, st_rad, st_mass } = scenario[0];

  return `
  <ul class="exoplanets-navigation-menu">
  <li><button href="#system">System</button>
  <li><button href="#${hostname}">Star</button>
  ${scenario.map((planet) => `<li><button href="#${hostname}-${planet.pl_letter}">${planet.pl_letter}</button></li>`).join(" ")}
  </ul>
  ${mainTitle}
  <p>The ${hostname} system contains ${sy_pnum} exoplanet${sy_pnum > 1 ? "s" : ""}. ${
    !isNaN(sy_dist)
      ? `It is located ${(sy_dist * 3.26156).toFixed(
          2
        )} light years away from the solar system.`
      : ""
  }</p>
    ${generateStarMarkup({ ...scenario[0], st_rad: !st_rad ? (() => {
      for (let i = 0; i < stellarMassRadiusData.length; i++) {
        if (st_mass > stellarMassRadiusData[i].mass) {
          return stellarMassRadiusData[i].radius;
        }
      }
    })() : st_rad})}
    ${generatePlanetsMarkup(scenario, habitableZoneBounds)}
  `;
};