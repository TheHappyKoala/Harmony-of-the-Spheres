const path = require(`path`);

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;

  const results = await graphql(`
    {
      allScenariosJson {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  `);

  results.data.allScenariosJson.edges.forEach(({ node }) =>
    console.log(node.id)
  );

  results.data.allScenariosJson.edges.forEach(({ node }) =>
    createPage({
      path: `/${node.name}`,
      component: require.resolve(`./src/templates/Scenario.tsx`),
      context: {
        id: node.id
      }
    })
  );
};
