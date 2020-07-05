const fetch = require("node-fetch");
const jpeg = require("jpeg-js");
const fs = require("fs");

const Terrain = require("./Terrain");

const SUN_RADIUS = 9767.441860465116;
const JUPITER_MASS = 9.543e-4;
const JUPITER_RADIUS = 976.7441860465117;
const G = 39.5;
const DT = 0.00005;
const SCALE = 2100000;

const inferRadiusFromMass = mass => Math.pow(mass, 0.42);

const inferMassFromRadius = radius => Math.pow(radius, 2.4);

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";

  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];

  return color;
};

const map = (array, index, callback, output = []) =>
  index === array.length
    ? output
    : map(array, index + 1, callback, [callback(array[index]), ...output]);

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

const determineWorldType = (mass, temperature, hz, distance) => {
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

//https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?&table=exoplanets&select=pl_hostname,st_mass,st_teff,st_rad,pl_letter,pl_bmassj,pl_radj,pl_orbper,pl_orbsmax,pl_pnum,pl_orbeccen,pl_orblper,pl_facility,pl_orbincl,pl_pelink,pl_facility,pl_eqt&where=pl_pnum>6 and pl_orbsmax>0 and st_mass>0 and st_rad>0&format=json

const createExoplanetScenarios = async () => {
  const url = `https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?&table=exoplanets&select=pl_hostname,pl_rade,st_mass,st_age,pl_discmethod,st_teff,st_rad,st_dist,pl_letter,pl_bmassj,pl_name,pl_publ_date,pl_radj,pl_orbper,pl_orbsmax,pl_pnum,pl_orbeccen,pl_orblper,pl_masse,pl_facility,pl_orbincl,pl_pelink,pl_facility,pl_eqt&where=pl_pnum>0 and pl_orbsmax>0 and st_mass>0 and st_rad>0&format=json`;

  const response = await fetch(url);

  const data = await response.json();

  const sortedScenarios = data.sort((a, b) => {
    var textA = a.pl_hostname.toUpperCase();
    var textB = b.pl_hostname.toUpperCase();
    return textA < textB ? -1 : textA > textB ? 1 : 0;
  });

  const scenarios = chunkScenarios(
    sortedScenarios,
    [[]],
    0,
    sortedScenarios[0]["pl_hostname"]
  );

  const processedPlanets = map(scenarios, 0, scenario => {
    const widestOrbit = Math.max(...scenario.map(mass => mass.pl_orbsmax));

    let lum;

    const m = scenario[0].st_mass;

    if (m < 0.2) lum = 0.23 * Math.pow(m / 1, 2.3);
    else if (m < 0.85)
      lum = Math.pow(
        m / 1,
        -141.7 * Math.pow(m, 4) +
          232.4 * Math.pow(m, 3) -
          129.1 * Math.pow(m, 2) +
          33.29 * m +
          0.215
      );
    else if (m < 2) lum = Math.pow(m / 1, 4);
    else if (m < 55) lum = 1.4 * Math.pow(m / 1, 3.5);
    else lum = 32000 * (m / 1);

    //Once we have the luminosity of the star, we can calculate the bounds of the habitable zone
    //https://www.planetarybiology.com/calculating_habitable_zone.html

    let start;
    let end;

    if (m < 0.43) {
      start = Math.sqrt(lum / 1.1);
      end = Math.sqrt(lum / 0.28);
    } else if (m < 0.845) {
      start = Math.sqrt(lum / 1.1);
      end = Math.sqrt(lum / 0.18);
    } else {
      start = Math.sqrt(lum / 1.1);
      end = Math.sqrt(lum / 0.53);
    }

    const age =
      scenario[0].st_age !== null
        ? ` and is estimated to be ${scenario[0].st_age} billion years old, as compared to the Sun which is roughly 4.6 billion years old`
        : "";

    const scenarioDescription = `
      <h1>The ${scenario[0].pl_hostname} Exoplanetary System</h1>
      <br/>
      <h1>Overview</h1>
      <p>${scenario[0].pl_hostname} is a star with ${
      scenario[0].st_mass
    } times the mass of the Sun, and ${
      scenario[0].st_rad
    } times its radius. It is located ${(scenario[0].st_dist *
      3.26156).toFixed(2)} light years away from the solar system${age}.</p>
      <p>${scenario[0].pl_hostname} is known to have ${
      scenario[0].pl_pnum
    } exoplanets in orbit around it.</p>

    <br/>
        <h1>Exoplanets in the ${scenario[0].pl_hostname} system</h1>
        <br/>
        ${scenario
          .map(planet => {
            const masso =
              planet.pl_bmassj !== null ? planet.pl_bmassj * 318 : null;

            const mass =
              masso !== null
                ? `The mass of ${planet.pl_hostname} ${planet.pl_letter} is ${masso} times the mass of Earth.`
                : "";

            const radius =
              planet.pl_rade !== null
                ? `The radius of ${planet.pl_hostname} ${planet.pl_letter} is ${planet.pl_rade} that of Earth.`
                : "";

            const isRegularRockyPlanet =
              masso !== null && masso < 1.5
                ? `At less than 1.5 Earth masses, ${planet.pl_hostname} ${planet.pl_letter} is a regular terrestrial planet, much like the terrestrial planets we find in our solar system, namely Mercury, Venus, Earth and Mars.`
                : "";

            const superEarth =
              masso !== null && masso > 1.5 && masso < 10
                ? `At ${masso} Earth masses, ${planet.pl_hostname} ${planet.pl_letter} is a so called Super Earth. Super Earths could be terrestrial worlds like Earth, but they could also be ocean worlds or terrestrial worlds wrapped in a substantial atmosphere, in which case some refer to them as Mini Neptunes. No Super Earths are known to exist in our solar system, but if it exists, the so-called Planet Nine could very well be a super Earth, as it is hypothesized to have a mass between five and ten Earth masses.`
                : "";

            const iceGiant =
              masso !== null && masso > 10 && masso < 50
                ? `At more than 10 Earth masses, ${planet.pl_hostname} ${planet.pl_letter} is an ice giant, a planet that is made up mostly of volatiles like water, amonia and methane, and enveloped by a dense hydrogen and helium atmosphere, much like Uranus and Neptune in our solar system.`
                : "";

            const gasGiant =
              masso !== null && masso > 50
                ? `At more than 50 Earth masses, ${planet.pl_hostname} ${planet.pl_letter} is a gas giant, a planet whose mass is mostly made up of hydrogen and helium, like Jupiter and Saturn in our solar system.`
                : "";

            const habitable = masso !== null && start < planet.pl_orbsmax && end > planet.pl_orbsmax && masso < 10 ? `With a mass of ${masso} Earth masses and a semi-major axis of ${planet.pl_orbsmax} astronomical units, ${planet.pl_hostname} ${planet.pl_letter} could, potentially, be a habitable planet with stable bodies of liquid water on its surface, like Earth.` : "";

            return `
            <h1>${planet.pl_hostname} ${planet.pl_letter}</h1>
            <p>${planet.pl_hostname} ${
              planet.pl_letter
            } was discovered by the ${
              planet.pl_facility
            } observatory using the ${planet.pl_discmethod.toLowerCase()} method. Its semi-major axis is ${planet.pl_orbsmax.toFixed(2)} astronomical units, as compared to Earth's which is 1 astronomical unit. ${mass} ${radius} ${isRegularRockyPlanet} ${superEarth} ${iceGiant} ${gasGiant} ${habitable}</p>
            <br/>
`;
          })
          .join(" ")}
    `;

    return {
      name: scenario[0].pl_hostname,
      scenarioDescription,
      discoveryFacility: scenario[0].pl_facility,
      description: `3D visualisation and gravity simulation of the exoplanet system ${scenario[0].pl_hostname}, which contains ${scenario[0].pl_pnum} planets and was discovered by ${scenario[0].pl_facility}.`,
      particlesFun: false,
      type: "Exoplanets",
      pl_pnum: scenario[0].pl_pnum,
      g: G,
      dt: DT,
      distMax: 50,
      distMin: -50,
      rotatingReferenceFrame: scenario[0].pl_hostname,
      cameraFocus: "Barycenter",
      particles: { max: 20000, size: 10, rings: [] },
      massBeingModified: "Mars",
      primary: scenario[0].pl_hostname,
      maximumDistance: { name: "Phobos to Mars * 100", value: 0.00626747 },
      distanceStep: { name: "Phobos to Mars / 10", value: 0.00000626747 },
      scenarioWikiUrl: scenario[0].pl_pelink,
      systemBarycenter: true,
      barycenter: true,
      barycenterMassOne: scenario[0].pl_hostname,
      barycenterMassTwo: scenario[0].pl_hostname,
      tol: 1e-4,
      maxDt: 1e-3,
      minDt: 1e-6,
      drawLineEvery: 6,
      isLoaded: false,
      playing: false,
      integrator: "PEFRL",
      customCameraToBodyDistanceFactor: false,
      barycenterZ: widestOrbit * SCALE * 3,
      elapsedTime: 0,
      useBarnesHut: false,
      theta: 0.5,
      collisions: true,
      habitableZone: true,
      referenceOrbits: false,
      softeningConstant: 0,
      logarithmicDepthBuffer: false,
      scale: 2100000,
      trails: true,
      labels: true,
      trajectoryRendevouz: {
        x: 0,
        y: 0,
        z: 0,
        p: { x: 0, y: 0, z: 0, t: 0 }
      },
      velMax: 5,
      velMin: -5,
      velStep: 0.00000185765499287888,
      isMassBeingAdded: false,
      a: 0,
      e: 0,
      w: 0,
      i: 0,
      o: 0,
      masses: [
        {
          name: scenario[0].pl_hostname,
          m: scenario[0].st_mass,
          radius: scenario[0].st_rad * SUN_RADIUS,
          temperature: scenario[0].st_teff,
          massType: "star"
        },
        ...map(scenario, 0, planet => {
          const mass =
            planet.pl_bmassj === null
              ? planet.pl_radj === null
                ? 0.00000000001
                : inferMassFromRadius(planet.pl_radj) * JUPITER_MASS
              : planet.pl_bmassj * JUPITER_MASS;

          const resolution = 2048;

          const isGasGiant = mass > 0.00003003;

          var pi = Math.PI;
          var sigma = 5.6703 * Math.pow(10, -5);
          var L = 3.846 * Math.pow(10, 33) * Math.pow(scenario[0].st_mass, 3);
          var D = planet.pl_orbsmax * 1.496 * Math.pow(10, 13);
          var A = 50 / 100;
          var T = 0;
          var X = Math.sqrt(((1 - A) * L) / (16 * pi * sigma));
          var T_eff = Math.sqrt(X) * (1 / Math.sqrt(D));
          var T_eq = Math.pow(T_eff, 4) * (1 + (3 * T) / 4);
          var T_sur = T_eq / 0.9;
          var temp = Math.sqrt(Math.sqrt(T_sur));

          let lum;

          const m = scenario[0].st_mass;

          if (m < 0.2) lum = 0.23 * Math.pow(m / 1, 2.3);
          else if (m < 0.85)
            lum = Math.pow(
              m / 1,
              -141.7 * Math.pow(m, 4) +
                232.4 * Math.pow(m, 3) -
                129.1 * Math.pow(m, 2) +
                33.29 * m +
                0.215
            );
          else if (m < 2) lum = Math.pow(m / 1, 4);
          else if (m < 55) lum = 1.4 * Math.pow(m / 1, 3.5);
          else lum = 32000 * (m / 1);

          //Once we have the luminosity of the star, we can calculate the bounds of the habitable zone
          //https://www.planetarybiology.com/calculating_habitable_zone.html

          let start;
          let end;

          if (m < 0.43) {
            start = Math.sqrt(lum / 1.1);
            end = Math.sqrt(lum / 0.28);
          } else if (m < 0.845) {
            start = Math.sqrt(lum / 1.1);
            end = Math.sqrt(lum / 0.18);
          } else {
            start = Math.sqrt(lum / 1.1);
            end = Math.sqrt(lum / 0.53);
          }

          const worldType = determineWorldType(
            mass,
            planet.pl_eqt == null ? temp : planet.pl_eqt,
            [start, end],
            planet.pl_orbsmax
          );

          let bumpScale;

          switch (worldType) {
            case "deadWorld":
              bumpScale = 7;
              break;
            case "icyWorld":
              bumpScale = 2;
              break;
            case "desertWorld":
              bumpScale = 3;
              break;
            case "torturedWorld":
              bumpScale = 0.5;
              break;
          }

          const filePath = `./static/textures/${planet.pl_hostname}-${planet.pl_letter}.jpg`;

          if (!fs.existsSync(filePath)) {
            /*
            const terrain = new Terrain(
              {
                worldType
              },
              isGasGiant,
              resolution,
              10
            );

            const frameData = Buffer.from(terrain.data);

            const rawImageData = {
              data: frameData,
              width: resolution,
              height: resolution
            };

            const jpegImageData = jpeg.encode(rawImageData, 50);

            fs.writeFileSync(filePath, jpegImageData.data);
            */
          }

          return {
            name: `${planet.pl_hostname}-${planet.pl_letter}`,
            texture: `${planet.pl_hostname}-${planet.pl_letter}`,
            m: mass,
            discoveryFacility: planet.pl_facility,
            potentiallyHabitableWorld: worldType === "habitableWorld",
            radius:
              planet.pl_radj === null
                ? inferRadiusFromMass(mass) * JUPITER_RADIUS
                : planet.pl_radj * JUPITER_RADIUS,
            a: planet.pl_orbsmax,
            e: planet.pl_orbeccen === null ? 0 : planet.pl_orbeccen,
            w:
              planet.pl_orblper === null
                ? Math.random() * (360 - 0) + 0
                : planet.pl_orblper,
            i: planet.pl_orbinc === null ? 0 : planet.pl_orbinc,
            o: 0,
            orbitalPeriod: planet.pl_orbper,
            temperature: planet.pl_eqt === null ? temp : planet.pl_eqt,
            scenarioWikiUrl: planet.pl_pelink,
            exoplanet: true,
            bump: isGasGiant ? false : true,
            bumpScale: bumpScale,
            color: getRandomColor(),
            clouds: worldType === "habitableWorld" ? true : false
          };
        })
      ]
    };
  });

  map(processedPlanets, 0, scenario => {
    fs.writeFileSync(
      `./src/data/scenarios/${scenario.name}.json`,
      JSON.stringify(scenario)
    );
  });
};

createExoplanetScenarios();
