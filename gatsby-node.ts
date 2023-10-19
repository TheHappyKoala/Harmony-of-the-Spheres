import type { GatsbyNode } from "gatsby";
import path from "path";
import {
  ScenarioCategoryType,
  ScenariosCategoryTreeType,
  ScenarioCategoryBranchType,
} from "./src/types/scenario";
import { kebabCase } from "./src/utils/text-utils";

type FetchedScenariosArray = {
  scenario: {
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
};

export const createPages: GatsbyNode["createPages"] = async ({
  actions,
  graphql,
}) => {
  const { createPage } = actions;

  const { data } = await graphql<FetchedScenariosJsonType>(`
    {
      scenariosJson: allScenariosJson {
        scenarios: edges {
          scenario: node {
            category {
              name
              subCategory
            }
          }
        }
      }
    }
  `);

  const categoryTree = data?.scenariosJson.scenarios.reduce(
    (
      accumulator: ScenariosCategoryTreeType,
      {
        scenario: {
          category: { name },
        },
      }: { scenario: { category: ScenarioCategoryType } },
      _index: number,
      array,
    ) => {
      const hasCategoryBeenAdded = accumulator.find(
        (category: ScenarioCategoryBranchType) => category.name === name,
      );

      if (!hasCategoryBeenAdded) {
        const subCategories = array.reduce(
          (
            accumulator: string[],
            {
              scenario: { category },
            }: { scenario: { category: ScenarioCategoryType } },
          ) => {
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

  categoryTree?.forEach(
    (scenarioCategoryBranch: ScenarioCategoryBranchType) => {
      const component = path.resolve("./src/templates/scenarios-menu.tsx");
      const { name, subCategories } = scenarioCategoryBranch;
      const withSubCategories = subCategories.length;

      createPage({
        path: `/${kebabCase(name)}${withSubCategories ? "/all" : ""}`,
        component,
        context: {
          categoryTree,
          category: name,
        },
        defer: true,
      });

      if (withSubCategories) {
        subCategories.forEach((subCategory: string) => {
          createPage({
            path: `/${kebabCase(name)}/${kebabCase(subCategory)}`,
            component,
            context: {
              categoryTree,
              category: name,
              subCategory,
              subCategoryRegex: `/${subCategory}/g`,
            },
            defer: true,
          });
        });
      }
    },
  );
};
