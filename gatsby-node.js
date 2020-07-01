const _ = require("lodash");

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
          }
        }
      }
    }
  `);

  const scenariosPerPage = 24;

  const numPages = Math.ceil(
    results.data.allScenariosJson.edges.length / scenariosPerPage
  );

  [...new Array(numPages)].forEach((page, i) => {
    const pagePath = `/`;
    createPage({
      path: i === 0 ? pagePath : `${pagePath}/${i + 1}`,
      component: require.resolve(`./src/templates/Navigation.tsx`),
      context: {
        pagePath: `/`,
        limit: scenariosPerPage,
        skip: i * scenariosPerPage,
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
        createPage({
          path: i === 0 ? pagePath : `${pagePath}/${i + 1}`,
          component: require.resolve(`./src/templates/ExoplanetNavigation.tsx`),
          context: {
            pagePath,
            type: "Exoplanets",
            discoveryFacility: fieldValue,
            limit: scenariosPerPage,
            skip: i * scenariosPerPage,
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
  if (node.internal.type === "ScenariosJson") {
    createNodeField({
      node,
      name: `scenarioImage`,
      value: `../../images/scenarios/${
        node.type !== "Exoplanets" ? node.name : "exoplanet"
      }.png`
    });
  }
};
