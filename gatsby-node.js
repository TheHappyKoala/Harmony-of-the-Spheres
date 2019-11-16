const path = require(`path`);

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;

  const results = await graphql(`
    {
      allScenariosJson {
        group(field: type) {
          fieldValue
        }
        edges {
          node {
            id
            name
            type
          }
        }
      }
    }
  `);

  const scenariosPerPage = 4;

  const numPages = Math.ceil(
    results.data.allScenariosJson.edges.length / scenariosPerPage
  );

  const allScenarios = [...new Array(numPages)].forEach((page, i) =>
    createPage({
      path: i === 0 ? `/` : `/${i + 1}`,
      component: require.resolve(`./src/templates/Navigation.tsx`),
      context: {
        limit: scenariosPerPage,
        skip: i * scenariosPerPage,
        numPages,
        currentPage: i + 1
      }
    })
  );

  results.data.allScenariosJson.group.forEach(({ fieldValue }, i) => {
    const numberOfScenariosPerCategory = results.data.allScenariosJson.edges.filter(
      ({ node }) => node.type.indexOf(fieldValue) !== -1
    ).length;
    const numPages = Math.ceil(numberOfScenariosPerCategory / scenariosPerPage);

    const allScenarios = [...new Array(numPages)].forEach((scenario, i) =>
      createPage({
        path:
          i === 0
            ? `/${fieldValue.toLowerCase()}`
            : `/${fieldValue.toLowerCase()}/${i + 1}`,
        component: require.resolve(`./src/templates/Navigation.tsx`),
        context: {
          type: fieldValue,
          limit: scenariosPerPage,
          skip: i * scenariosPerPage,
          numPages,
          currentPage: i + 1
        }
      })
    );
  });

  results.data.allScenariosJson.edges.forEach(({ node }, i) =>
    createPage({
      path: `/${node.type.toLowerCase()}/${node.name.toLowerCase()}`,
      component: require.resolve(`./src/templates/Scenario.tsx`),
      context: {
        id: node.id
      }
    })
  );
};
