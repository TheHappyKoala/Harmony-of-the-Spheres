const fs = require("fs");
const jpeg = require("jpeg-js");
const neatCsv = require("neat-csv");

const utils = require("./utils");
const determineWorldType = require("./determineWorldType");
const generateScenarioDescription = require("./generateScenarioDescription");
const PlanetTextureGenerator = require("./PlanetTextureGenerator");
const {
  graphicalQuantities,
  physicalQuantities,
  worldTypes
} = require("./constants");

const stellarMassRadiusData = require("./stellarMassRadiusData");

const SUN_RADIUS = 9767.441860465116;

const createExoplanetScenarios = async () => {
  const { readFile } = fs.promises;

  const csvData = await readFile("exoplanet-archive/data.csv");

  const data = await neatCsv(csvData);

  const sortedScenarios = data.sort((a, b) => {
    const nameA = a.hostname.toUpperCase();
    const nameB = b.hostname.toUpperCase();

    return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
  });

  const scenarios = utils
    .chunkScenarios(sortedScenarios, [[]], 0, sortedScenarios[0]["hostname"])
    .map(scenario =>
      scenario.map(planet =>
        Object.fromEntries(
          Object.entries(planet).map(([key, value]) => [
            key,
            isNaN(value) ? value : parseFloat(value)
          ])
        )
      )
    )
    .filter(scenario =>
      scenario.every(
        planet => !isNaN(planet.pl_orbsmax) && !isNaN(planet.st_mass)
      )
    );

  const processedPlanets = utils.map(scenarios, 0, scenario => {
    let hasHabitableWorld = 0;

    const habitableZoneBounds = utils.getHabitableZoneBounds(
      scenario[0].st_mass
    );

    const obj = {
      sortedOrder: 0,
      hasHabitableWorld,
      discoveryFacility: scenario[0].discoverymethod,
      particlesFun: false,
      type: "Exoplanets",
      pl_pnum: scenario[0].sy_pnum,
      publishDate: new Date().getTime(),
      hasPublishDate: true,
      g: physicalQuantities.G,
      dt: physicalQuantities.DEFAULT_DT,
      distMax: 50,
      distMin: -50,
      rotatingReferenceFrame: scenario[0].hostname,
      cameraPosition: "Free",
      particles: { max: 20000, size: 10, rings: [] },
      massBeingModified: "Mars",
      primary: scenario[0].hostname,
      maximumDistance: { name: "Phobos to Mars * 100", value: 0.00626747 },
      distanceStep: { name: "Phobos to Mars / 10", value: 0.00000626747 },
      systemBarycenter: true,
      barycenter: false,
      barycenterMassOne: scenario[0].hostname,
      barycenterMassTwo: scenario[0].hostname,
      tol: 1e-4,
      maxDt: 1e-3,
      minDt: 1e-6,
      isLoaded: false,
      playing: false,
      integrator: "PEFRL",
      customCameraToBodyDistanceFactor: false,
      barycenterZ:
        utils.getWidestOrbit(scenario) * graphicalQuantities.SCALE * 3,
      elapsedTime: 0,
      useBarnesHut: false,
      theta: 0.5,
      collisions: false,
      habitableZone: false,
      mapMode: true,
      referenceOrbits: false,
      softeningConstant: 0,
      logarithmicDepthBuffer: true,
      scale: graphicalQuantities.SCALE,
      trails: false,
      labels: true,
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
          name: scenario[0].hostname,
          m: scenario[0].st_mass,
          radius: scenario[0].st_rad
            ? scenario[0].st_rad * SUN_RADIUS
            : (() => {
                for (let i = 0; i < stellarMassRadiusData.length; i++) {
                  if (scenario[0].st_mass > stellarMassRadiusData[i].mass) {
                    return stellarMassRadiusData[i].radius * SUN_RADIUS;
                  }
                }
              })(),
          temperature: scenario[0].st_teff,
          massType: "star"
        },
        ...utils.map(scenario, 0, planet => {
          const [mass, radius] = utils.getPlanetProperties(
            planet.pl_bmassj,
            planet.pl_radj
          );

          const planetTemperature = !planet.pl_eqt
            ? utils.calculatePlanetTemperature(
                scenario[0].st_mass,
                planet.pl_orbsmax
              )
            : planet.pl_eqt;

          const worldType = determineWorldType(
            mass,
            planetTemperature,
            habitableZoneBounds,
            planet.pl_orbsmax,
            planet.pl_dens
          );

          let atmosphere;

          switch (worldType) {
            case worldTypes.DESERT_WORLD:
              atmosphere = "coral";
              break;

            case worldTypes.LAVA_WORLD:
              atmosphere = "black";
              break;

            case worldTypes.HABITABLE_WORLD:
            case worldTypes.OCEAN_WORLD:
            case worldTypes.ICY_WORLD:
            case worldTypes.ICE_GIANT:
              atmosphere = "dodgerblue";
              break;

            case worldTypes.SUDARSKY_CLASS_ONE:
              atmosphere = "bisque";
              break;

            case worldTypes.SUDARSKY_CLASS_TWO:
              atmosphere = "grey";
              break;

            case worldTypes.SUDARSKY_CLASS_THREE:
              atmosphere = "dodgerblue";
              break;

            case worldTypes.SUDARSKY_CLASS_FOUR:
              atmosphere = "grey";
              break;

            case worldTypes.SUDARSKY_CLASS_FIVE:
              atmosphere = "darkolivegreen";
              break;
          }

          const filePath = `./static/textures/${planet.hostname}-${planet.pl_letter}.jpg`;

          const isGasGiant = mass > 0.000015015;

          const isHabitableWorld = utils.isHabitableWorld(worldType);

          if (isHabitableWorld) {
            hasHabitableWorld++;
          }

          if (
            !fs.existsSync(filePath) &&
            !isNaN(planet.pl_orbsmax) &&
            !isNaN(planet.st_mass)
          ) {
            console.log(`${planet.hostname}-${planet.pl_letter}`);

            const planetTexture = new PlanetTextureGenerator(
              {
                worldType
              },
              isGasGiant,
              graphicalQuantities.TEXTURE_RESOLUTION,
              graphicalQuantities.OCTAVES
            );

            const frameData = Buffer.from(planetTexture.data);

            const rawImageData = {
              data: frameData,
              width: graphicalQuantities.TEXTURE_RESOLUTION,
              height: graphicalQuantities.TEXTURE_RESOLUTION
            };

            const jpegImageData = jpeg.encode(
              rawImageData,
              graphicalQuantities.JPG_IMAGE_QUALITY
            );

            fs.writeFileSync(filePath, jpegImageData.data);
          }

          return {
            name: `${planet.hostname}-${planet.pl_letter}`,
            texture: `${planet.hostname}-${planet.pl_letter}`,
            m: mass,
            worldType: worldType,
            atmosphere,
            discoveryFacility: scenario[0].discoverymethod,
            potentiallyHabitableWorld: utils.isHabitableWorld(worldType),
            radius,
            a: planet.pl_orbsmax,
            e:
              planet.pl_orbeccen === null
                ? 0.0000001
                : planet.pl_orbeccen !== 0
                ? planet.pl_orbeccen
                : 0.0000001,
            w: !planet.pl_orblper
              ? Math.random() * (360 - 0) + 0
              : planet.pl_orblper,
            i: planet.pl_orbincl === null ? 0 : planet.pl_orbincl,
            o: 0,
            orbitalPeriod: planet.pl_orbper,
            temperature: planetTemperature,
            exoplanet: true,
            bump: !isGasGiant,
            color: utils.getRandomColor(),
            clouds: utils.isWorldWithClouds(worldType),
            customCameraPosition: { x: 2, y: 2, z: 0 }
          };
        })
      ],
      hallOfFame: false,
      scenarioDescription: generateScenarioDescription(
        scenario,
        habitableZoneBounds
      ),
      description: `3D visualisation and gravity simulation of the exoplanetary system ${
        scenario[0].hostname
      }, which contains ${scenario[0].sy_pnum} exoplanets${
        hasHabitableWorld
          ? `${
              hasHabitableWorld === 1
                ? ", of which 1 is potentially habitable,"
                : `, of which ${hasHabitableWorld} are potentially habitable,`
            }`
          : ""
      } and was discovered by the ${scenario[0].disc_facility}.`,
      name: `${scenario[0].hostname} - System With ${
        scenario[0].sy_pnum === 1
          ? "1 Exoplanet"
          : `${scenario[0].sy_pnum} Exoplanets`
      } ${
        hasHabitableWorld
          ? `${
              hasHabitableWorld === 1
                ? "of Which 1 Is Potentially Habitable"
                : `of Which ${hasHabitableWorld} Are Potentially Habitable`
            }`
          : ""
      }`
    };

    obj.cameraFocus = !hasHabitableWorld
      ? "Barycenter"
      : obj.masses.find(mass => mass.potentiallyHabitableWorld).name;

    obj.fileName = `${scenario[0].hostname} - System With ${
      scenario[0].sy_pnum === 1
        ? "1 Exoplanet"
        : `${scenario[0].sy_pnum} Exolanets`
    } ${
      hasHabitableWorld
        ? `${
            hasHabitableWorld === 1
              ? "of Which 1 Is Potentially Habitable"
              : `of Which ${hasHabitableWorld} Are Potentially Habitable`
          }`
        : ""
    }`;

    return obj;
  });

  utils.map(processedPlanets, 0, scenario => {
    const filePath = `./src/data/scenarios/${scenario.fileName}.json`;

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(scenario));
    } else {
      const scenarioJSON = JSON.parse(fs.readFileSync(filePath, "utf8"));
      scenarioJSON.scenarioDescription = scenario.scenarioDescription;
      scenarioJSON.masses[0].radius = scenario.masses[0].radius;
      if (scenarioJSON.masses[0].temperature === null)
        scenarioJSON.masses[0].temperature = (() => {
          for (let i = 0; i < stellarMassRadiusData.length; i++) {
            if (scenarioJSON.masses[0].m > stellarMassRadiusData[i].mass) {
              return stellarMassRadiusData[i].temp;
            }
          }
        })();
      scenarioJSON.masses = scenario.masses;
      fs.writeFileSync(filePath, JSON.stringify(scenarioJSON));
    }
  });
};

createExoplanetScenarios();
