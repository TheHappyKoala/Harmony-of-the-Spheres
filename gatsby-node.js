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
            id
            name
            type
            discoveryFacility
            hasHabitableWorld
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

  const habitableSystems = results.data.allScenariosJson.edges.filter(
    ({ node }) => node.hasHabitableWorld
  );
  const numberOfHabitableSystems = habitableSystems.length;
  const numPagesHabitableSystems = Math.ceil(
    numberOfHabitableSystems / scenariosPerPage
  );

  [...new Array(numPagesHabitableSystems)].forEach((page, i) => {
    const pagePath = `/exoplanets/potentially-habitable-worlds`;
    createPage({
      path: i === 0 ? pagePath : `${pagePath}/${i + 1}`,
      component: require.resolve(
        `./src/templates/HabitablePlanetsNavigation.tsx`
      ),
      context: {
        pagePath,
        limit: scenariosPerPage,
        skip: i * scenariosPerPage,
        numPages: numPagesHabitableSystems,
        currentPage: i + 1,
        background: "Potentially Habitable Worlds.jpg",
        currentPageName: "Potentially Habitable Worlds",
        type: "Exoplanets"
      }
    });
  });

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
        currentPage: i + 1,
        currentPageName: "Hall of Fame",
        type: "Exoplanets"
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
        numPages,
        currentPage: i + 1,
        currentPageName: "All"
      }
    });
  });

  results.data.allScenariosJson.group.forEach(({ fieldValue }, i) => {
    const numberOfScenariosPerCategory = results.data.allScenariosJson.edges.filter(
      ({ node }) => node.type.indexOf(fieldValue) !== -1
    ).length;
    const numPages = Math.ceil(numberOfScenariosPerCategory / scenariosPerPage);

    const images = ["Exoplanets", "Solar System", "Misc", "Spaceflight"];

    if (fieldValue !== "Exoplanets") {
      [...new Array(numPages)].forEach((scenario, i) => {
        const pagePath = `/${_.kebabCase(fieldValue)}`;
        createPage({
          path: i === 0 ? pagePath : `${pagePath}/${i + 1}`,
          component: require.resolve(`./src/templates/Navigation.tsx`),
          context: {
            pagePath,
            type: fieldValue,
            limit: scenariosPerPage,
            background: `${images.find(image => fieldValue === image)}.jpg`,
            skip: i * scenariosPerPage,
            numPages,
            currentPage: i + 1,
            currentPageName: fieldValue
          }
        });
      });
    } else {
      [...new Array(numPages)].forEach((scenario, i) => {
        const pagePath = `/${_.kebabCase(fieldValue)}/all`;
        createPage({
          path: i === 0 ? pagePath : `${pagePath}/${i + 1}`,
          component: require.resolve(`./src/templates/Navigation.tsx`),
          context: {
            pagePath,
            type: fieldValue,
            limit: scenariosPerPage,
            background: `${images.find(image => fieldValue === image)}.jpg`,
            skip: i * scenariosPerPage,
            numPages,
            currentPage: i + 1,
            currentPageName: fieldValue
          }
        });
      });
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
          "Transit",
          "Radial Velocity",
          "Imaging",
          "Microlensing"
        ];

        createPage({
          path: i === 0 ? pagePath : `${pagePath}/${i + 1}`,
          component: require.resolve(`./src/templates/ExoplanetNavigation.tsx`),
          context: {
            pagePath,
            type: "Exoplanets",
            discoveryFacility: fieldValue,
            limit: scenariosPerPage,
            skip: i * scenariosPerPage,
            background: `${images.find(image => fieldValue === image)}.jpg`,
            numPages,
            currentPage: i + 1,
            currentPageName: fieldValue
          }
        });
      });
    }
  );

  results.data.allScenariosJson.edges.forEach(({ node }, i) =>
    createPage({
      path: `/${_.kebabCase(node.type)}/${_.kebabCase(node.name)}`,
      component: require.resolve(`./src/templates/Scenario.tsx`),
      context: {
        id: node.id
      }
    })
  );
};

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;

  const filePath = `./src/images/scenarios/${node.name}.png`;

  if (node.internal.type === "ScenariosJson") {
    createNodeField({
      node,
      name: `scenarioImage`,
      value: `../../images/scenarios/${
        node.type !== "Exoplanets" || fs.existsSync(filePath)
          ? node.name
          : "exoplanet"
      }.png`
    });
  }
};
