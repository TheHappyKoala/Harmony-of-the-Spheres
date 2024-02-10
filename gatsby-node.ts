import type { GatsbyNode } from "gatsby";
import path from "path";
import {
  ScenariosCategoryTreeType,
  ScenarioCategoryBranchType,
} from "./src/types/category";
import { ScenarioType } from "./src/types/scenario";
import { kebabCase } from "./src/utils/text-utils";

type FetchedScenariosArray = {
  scenario: {
    name: string;
    category: {
      name: string;
      subCategory: string;
    };
  };
}[];

type FetchedScenariosJsonType = {
  scenariosJson: {
    scenarios: FetchedScenariosArray;
  };
  categoryTree: ScenariosCategoryTreeType;
};

export const createPages: GatsbyNode["createPages"] = async ({
  actions,
  graphql,
}) => {
  const { createPage } = actions;

  createPage({
    path: `/scenarios/all`,
    component: path.resolve("./src/templates/scenarios-menu/index.tsx"),
    context: {
      category: "all",
      subCategory: "all",
      backgroundImage: `backgrounds/Home.jpg`,
    },
    defer: true,
  });

  const { data } = await graphql<FetchedScenariosJsonType>(`
    {
      scenariosJson: allScenariosJson {
        scenarios: edges {
          scenario: node {
            name
            category {
              name
              subCategory
            }
          }
        }
      }

      categoryTree {
        name
        subCategories
      }
    }
  `);

  const categoryTree = data?.categoryTree;

  categoryTree?.forEach(
    (scenarioCategoryBranch: ScenarioCategoryBranchType) => {
      const component = path.resolve("./src/templates/scenarios-menu/index.tsx");
      const { name, subCategories } = scenarioCategoryBranch;
      const withSubCategories = subCategories.length;
      const categoryRegex = `/${name}/g`;

      createPage({
        path: `/scenarios/${kebabCase(name)}${withSubCategories ? "/all" : ""}`,
        component,
        context: {
          category: name,
          categoryRegex,
          subCategory: "all",
          backgroundImage: `backgrounds/${name}.jpg`,
        },
        defer: true,
      });

      if (withSubCategories) {
        subCategories.forEach((subCategory: string) => {
          createPage({
            path: `/scenarios/${kebabCase(name)}/${kebabCase(subCategory)}`,
            component,
            context: {
              category: name,
              categoryRegex,
              subCategory,
              subCategoryRegex: `/${subCategory}/g`,
              backgroundImage: `backgrounds/${name} - ${subCategory}.jpg`,
            },
            defer: true,
          });
        });
      }
    },
  );

  data?.scenariosJson.scenarios.forEach(({ scenario }) => {
    const component = path.resolve("./src/templates/planetary-scenario/index.tsx");
    const { category, name } = scenario;

    createPage({
      path: `/scenarios/${kebabCase(category.name)}${
        category.subCategory ? `/${kebabCase(category.subCategory)}` : ""
      }/${kebabCase(name)}`,
      component,
      context: {
        scenarioName: name,
      },
      defer: true,
    });
  });
};

export const createResolvers: GatsbyNode["createResolvers"] = ({
  createResolvers,
  getNodesByType,
}) => {
  const scenarios = getNodesByType(
    "ScenariosJson",
  ) as unknown as ScenarioType[];

  const categoryTree = scenarios.reduce(
    (
      accumulator: ScenariosCategoryTreeType,
      { category: { name } },
      _index: number,
      array,
    ) => {
      const hasCategoryBeenAdded = accumulator.find(
        (category: ScenarioCategoryBranchType) => category.name === name,
      );

      if (!hasCategoryBeenAdded) {
        const subCategories = array.reduce(
          (accumulator: string[], { category }) => {
            if (
              category.name === name &&
              category.subCategory &&
              !accumulator.includes(category.subCategory)
            ) {
              accumulator.push(category.subCategory);
            }

            return accumulator;
          },
          [],
        );

        const categoryBranch = { name, subCategories };

        accumulator.push(categoryBranch);
      }

      return accumulator;
    },
    [],
  );

  createResolvers({
    Query: {
      categoryTree: {
        resolve: async () => categoryTree,
      },
    },
  });
};

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] =
  ({ actions }) => {
    const { createTypes } = actions;

    createTypes(`
    type CategoryBranch {
      name: String
      subCategories: [String]
    }

    type Query implements Node {
      categoryTree: [CategoryBranch]
    }
`);
  };
