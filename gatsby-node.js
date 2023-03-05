const _ = require("lodash");
const fs = require("fs");

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;

  const results = await graphql(`
    {
      allScenariosJson {
        group(field: type) {
          fieldValue
        }
        discoveryFacilities: group(field: discoveryFacility) {
          fieldValue
        }
        edges {
          node {
            sortOrder
            publishDate
            id
            name
            type
            discoveryFacility
            hallOfFame
          }
        }
      }
    }
  `);

  const scenariosPerPage = 36;

  const numPages = Math.ceil(
    results.data.allScenariosJson.edges.length / scenariosPerPage
  );

  const hofSystems = results.data.allScenariosJson.edges.filter(
    ({ node }) => node.hallOfFame
  );
  const numberOfHofSystems = hofSystems.length;
  const numPagesHofSystems = Math.ceil(numberOfHofSystems / scenariosPerPage);

  [...new Array(numPagesHofSystems)].forEach((page, i) => {
    const pagePath = `/exoplanets/hall-of-fame`;
    createPage({
      path: i === 0 ? pagePath : `${pagePath}/${i + 1}`,
      component: require.resolve(
        `./src/templates/HallOfFamePlanetsNavigation.tsx`
      ),
      context: {
        pagePath,
        limit: scenariosPerPage,
        skip: i * scenariosPerPage,
        numPages: numPagesHofSystems,
        background: "Hall of Fame.jpg",
        categoryDescription:
          "Thousands of stars with exoplanets orbiting around them have been discovered. Simulate and discover the most remarkable of these exoplanetary systems.",
        currentPage: i + 1,
        currentPageName: "Hall of Fame",
        type: "Exoplanets",
        pageType: "navigation"
      }
    });
  });

  const systemsWithDate = results.data.allScenariosJson.edges.filter(
    ({ node }) => node.publishDate
  );
  const numberOfSystemsWithDate = systemsWithDate.length;
  const numPagesSystemsWithDate = Math.ceil(
    numberOfSystemsWithDate / scenariosPerPage
  );

  [...new Array(numPagesSystemsWithDate)].forEach((page, i) => {
    const pagePath = `/new-scenarios`;
    createPage({
      path: i === 0 ? pagePath : `${pagePath}/${i + 1}`,
      component: require.resolve(`./src/templates/ByDateNavigation.tsx`),
      context: {
        pagePath,
        limit: scenariosPerPage,
        skip: i * scenariosPerPage,
        numPages: numPagesSystemsWithDate,
        background: "Jupiter.jpg",
        categoryDescription:
          "Gravity simulator scenarios sorted according to the date they were added.",
        currentPage: i + 1,
        currentPageName: "New Scenarios",
        pageType: "navigation"
      }
    });
  });

  [...new Array(numPages)].forEach((page, i) => {
    const pagePath = `/`;
    createPage({
      path: i === 0 ? pagePath : `${pagePath}/${i + 1}`,
      component: require.resolve(`./src/templates/Navigation.tsx`),
      context: {
        pagePath: `/`,
        limit: scenariosPerPage,
        skip: i * scenariosPerPage,
        background: "All.jpg",
        categoryDescription:
          "3D Gravity Simulator. Simulate the solar system, exoplanets and even colliding galaxies. Add, delete and modify planets, and change the laws of physics.",
        numPages,
        currentPage: i + 1,
        currentPageName: "All",
        pageType: "main"
      }
    });
  });

  results.data.allScenariosJson.group.forEach(({ fieldValue }, i) => {
    const numberOfScenariosPerCategory = results.data.allScenariosJson.edges.filter(
      ({ node }) => node.type.indexOf(fieldValue) !== -1
    ).length;
    const numPages = Math.ceil(numberOfScenariosPerCategory / scenariosPerPage);

    const images = [
      {
        name: "Exoplanets",
        description:
          "3D gravity simulations, with procedural planet textures based on data from the Exoplanet Archive, of planets known to orbit stars other than our own, the Sun."
      },
      {
        name: "Solar System",
        description:
          "3D gravity simulations of the solar system and its planets, moons, asteroids and comets powered by data from NASA. Explore the schorched surface of Mercury and the icy plains of Pluto."
      },
      {
        name: "Misc",
        description:
          "3D gravity simulations of beautiful n-body choreograpies, galaxies colliding and various what-if scenarios."
      },
      {
        name: "Spaceflight",
        description:
          "3D gravity simulations of spacecraft and their trajectories and orbits. Discover spacecraft exploring the Moon, Mars, Jupiter, various asteroids and beyond."
      },
      {
        name: "Starship",
        description:
          "Take control of the Starship spacecraft and visit whichever planet, moon, asteroid or comet you like."
      }
    ];

    [...new Array(numPages)].forEach((scenario, i) => {
      const pagePath = `/${_.kebabCase(fieldValue)}`;
      createPage({
        path: i === 0 ? pagePath : `${pagePath}/${i + 1}`,
        component: require.resolve(`./src/templates/Navigation.tsx`),
        context: {
          pagePath,
          type: fieldValue,
          limit: scenariosPerPage,
          background: `${
            images.find(image => fieldValue === image.name).name
          }.jpg`,
          categoryDescription: images.find(image => fieldValue === image.name)
            .description,
          skip: i * scenariosPerPage,
          numPages,
          currentPage: i + 1,
          currentPageName: fieldValue,
          pageType: "navigation"
        }
      });
    });
  });

  createPage({
    path: "/saved-scenarios",
    component: require.resolve(`./src/templates/Navigation.tsx`),
    context: {
      pagePath: "/saved-scenarios",
      type: "Saved Scenarios",
      background: `Saved.jpg`,
      categoryDescription: "",
      currentPageName: "Saved",
      pageType: "navigation"
    }
  });

  results.data.allScenariosJson.discoveryFacilities.forEach(
    ({ fieldValue }, i) => {
      const numberOfScenariosPerCategory = results.data.allScenariosJson.edges.filter(
        ({ node }) =>
          node.discoveryFacility !== null &&
          node.discoveryFacility.indexOf(fieldValue) !== -1
      ).length;

      const numPages = Math.ceil(
        numberOfScenariosPerCategory / scenariosPerPage
      );

      [...new Array(numPages)].forEach((scenario, i) => {
        const pagePath = `/exoplanets/${_.kebabCase(fieldValue)}`;
        const images = [
          {
            name: "Transit",
            description:
              "3D simulations of exoplanets discovered with the transit method by spacecraft like Kepler, TESS,  and CoRoT, in addition to ground observatories like WASP."
          },
          {
            name: "Radial Velocity",
            description:
              "3D simulations of exoplanets discovered with the radial velocity method by ground based observatories like HARPS, and MINERVA."
          },
          {
            name: "Imaging",
            description:
              "3D simulations of exoplanets that have been imaged directly using observatories like the Keck Telescope and the Hubble Space Telescope."
          },
          {
            name: "Microlensing",
            description:
              "3D simulations of exoplanets that have been discovered with the gravitational microlensing method."
          }
        ];

        if (images.find(image => fieldValue === image.name))
          createPage({
            path: i === 0 ? pagePath : `${pagePath}/${i + 1}`,
            component: require.resolve(
              `./src/templates/ExoplanetNavigation.tsx`
            ),
            context: {
              pagePath,
              type: "Exoplanets",
              discoveryFacility: fieldValue,
              limit: scenariosPerPage,
              skip: i * scenariosPerPage,
              background: `${
                images.find(image => fieldValue === image.name).name
              }.jpg`,
              categoryDescription: images.find(
                image => fieldValue === image.name
              ).description,
              numPages,
              currentPage: i + 1,
              currentPageName: fieldValue,
              pageType: "navigation"
            }
          });
      });
    }
  );

  results.data.allScenariosJson.edges.forEach(({ node }, i) =>
    createPage({
      path: `/${_.kebabCase(node.type)}/${_.kebabCase(node.name)}`,
      component:
        node.type !== "Starship"
          ? require.resolve(`./src/templates/SimulatorContainer.tsx`)
          : require.resolve(`./src/templates/StarshipScenario.tsx`),
      context: {
        id: node.id,
        pageType: "simulator"
      }
    })
  );
};

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;

  const filePath = `./src/images/scenarios/${node.fileName}.png`;

  if (node.internal.type === "ScenariosJson") {
    createNodeField({
      node,
      name: `scenarioImage`,
      value: `../../images/scenarios/${
        fs.existsSync(filePath) ? node.fileName : "exoplanet"
      }.png`
    });
  }
};
