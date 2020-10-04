const fetch = require("node-fetch");
const jpeg = require("jpeg-js");
const fs = require("fs");

const utils = require("./utils");
const determineWorldType = require("./determineWorldType");
const generateScenarioDescription = require("./generateScenarioDescription");
const PlanetTextureGenerator = require("./PlanetTextureGenerator");

const SUN_RADIUS = 9767.441860465116;
const JUPITER_MASS = 9.543e-4;
const JUPITER_RADIUS = 976.7441860465117;
const G = 39.5;
const DT = 0.00005;
const SCALE = 2100000;

//https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?&table=exoplanets&select=pl_hostname,st_mass,st_teff,st_rad,pl_letter,pl_bmassj,pl_radj,pl_orbper,pl_orbsmax,pl_pnum,pl_orbeccen,pl_orblper,pl_facility,pl_orbincl,pl_pelink,pl_facility,pl_eqt&where=pl_pnum>6 and pl_orbsmax>0 and st_mass>0 and st_rad>0&format=json

const createExoplanetScenarios = async () => {
  const url = `https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?&table=exoplanets&select=pl_hostname,pl_rade,st_mass,st_age,pl_discmethod,st_teff,st_rad,st_dist,pl_letter,pl_bmassj,pl_name,pl_publ_date,pl_radj,pl_orbper,pl_orbsmax,pl_pnum,pl_orbeccen,pl_orblper,pl_masse,pl_facility,pl_orbincl,pl_pelink,pl_facility,pl_eqt&where=pl_pnum>0 and st_teff>0 and pl_orbsmax>0 and st_mass>0 and st_rad>0&format=json`;

  const response = await fetch(url);

  const data = await response.json();

  const sortedScenarios = data.sort((a, b) => {
    var textA = a.pl_hostname.toUpperCase();
    var textB = b.pl_hostname.toUpperCase();
    return textA < textB ? -1 : textA > textB ? 1 : 0;
  });

  const scenarios = utils.chunkScenarios(
    sortedScenarios,
    [[]],
    0,
    sortedScenarios[0]["pl_hostname"]
  );

  const processedPlanets = utils.map(scenarios, 0, scenario => {
    const widestOrbit = Math.max(...scenario.map(mass => mass.pl_orbsmax));

    let hasHabitableWorld = false;

    const habitableZoneBounds = utils.getHabitableZoneBounds(
      scenario[0].st_mass
    );

    return {
      name: scenario[0].pl_hostname,
      scenarioDescription: generateScenarioDescription(
        scenario,
        habitableZoneBounds
      ),
      hasHabitableWorld,
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
        ...utils.map(scenario, 0, planet => {
          const mass =
            planet.pl_bmassj === null
              ? planet.pl_radj === null
                ? 0.00000000001
                : utils.inferPlanetProperty(planet.pl_radj, "radius", "mass")
              : planet.pl_bmassj * JUPITER_MASS;

          const resolution = 3000;

          const isGasGiant = mass > 0.000015015;

          const planetTemperature =
            planet.pl_eqt == null
              ? utils.calculatePlanetTemperature(
                  scenario[0].st_mass,
                  planet.pl_orbsmax
                )
              : planet.pl_eqt;

          const worldType = determineWorldType(
            mass,
            planetTemperature,
            habitableZoneBounds,
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
            const planetTexture = new PlanetTextureGenerator(
              {
                worldType
              },
              isGasGiant,
              resolution,
              15
            );

            const frameData = Buffer.from(planetTexture.data);

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
                ? utils.inferPlanetProperty(mass, "mass", "radius") *
                  JUPITER_RADIUS
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
            temperature: planetTemperature,
            scenarioWikiUrl: planet.pl_pelink,
            exoplanet: true,
            bump: isGasGiant ? false : true,
            bumpScale: bumpScale,
            color: utils.getRandomColor(),
            clouds: worldType === "habitableWorld" ? true : false
          };
        })
      ]
    };
  });

  utils.map(processedPlanets, 0, scenario => {
    const filePath = `./src/data/scenarios/${scenario.name}.json`;

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(scenario));
    }
  });
};

createExoplanetScenarios();
