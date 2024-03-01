import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../../components/layout";
import NavigationMenu from "../../components/navigation-menu";
import NavigationMenuItem from "../../components/navigation-menu/navigation-menu-item";
import { kebabCase } from "../../utils/text-utils";
import { ScenariosCategoryTreeType } from "../../types/category";
import { ScenarioCategoryType } from "../../types/scenario";

import {
  scenariosMenuWrapper,
  navigationMenuCssModifier,
  scenariosListWrapper,
  scenariosListItem,
  scenariosListItemTitle,
} from "./scenarios-menu.module.css";

type Props = {
  data: {
    scenariosJson: {
      scenarios: {
        scenario: {
          name: string;
          category: ScenarioCategoryType;
        };
      }[];
    };
    categoryTree: ScenariosCategoryTreeType;
  };
  pageContext: {
    category: string;
    subCategory: string;
  };
};

const ScenarioMenu = ({
  data: { categoryTree, scenariosJson },
  pageContext: { category, subCategory },
}: Props) => {
  const subCategories = categoryTree?.find(({ name }) => name === category)
    ?.subCategories;

  return (
    <Layout currentPage="scenarios">
      <section className={scenariosMenuWrapper}>
        <NavigationMenu cssModifier={navigationMenuCssModifier}>
          <NavigationMenuItem active={category === "all"}>
            <Link to={`/scenarios/all`}>All</Link>
          </NavigationMenuItem>
          {categoryTree.map((categoryBranch) => (
            <NavigationMenuItem active={category === categoryBranch.name}>
              <Link
                to={`/scenarios/${kebabCase(categoryBranch.name)}${
                  categoryBranch.subCategories.length ? "/all" : ""
                }`}
              >
                {categoryBranch.name}
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenu>{" "}
        {subCategories?.length ? (
          <NavigationMenu cssModifier={navigationMenuCssModifier}>
            <NavigationMenuItem active={subCategory === "all"}>
              <Link to={`/scenarios/${kebabCase(category)}/all`}>All</Link>
            </NavigationMenuItem>
            {subCategories.map((subCategoryEntry) => (
              <NavigationMenuItem active={subCategory === subCategoryEntry}>
                <Link
                  to={`/scenarios/${kebabCase(category)}/${kebabCase(
                    subCategoryEntry,
                  )}`}
                >
                  {subCategoryEntry}
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenu>
        ) : null}
      </section>
      <section className={scenariosListWrapper}>
        {scenariosJson.scenarios.map(({ scenario }) => (
          <Link
            to={`/scenarios/${kebabCase(category)}${
              scenario.category.subCategory
                ? `/${kebabCase(scenario.category.subCategory)}/${kebabCase(
                    scenario.name,
                  )}`
                : `/${kebabCase(scenario.name)}`
            }`}
          >
            <div className={scenariosListItem}>
              <span className={scenariosListItemTitle}>{scenario.name}</span>
            </div>
          </Link>
        ))}
      </section>
    </Layout>
  );
};

export const pageQuery = graphql`
  query ($categoryRegex: String = "//g", $subCategoryRegex: String = "//g") {
    scenariosJson: allScenariosJson(
      filter: {
        category: {
          name: { regex: $categoryRegex }
          subCategory: { regex: $subCategoryRegex }
        }
      }
    ) {
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
`;

export default ScenarioMenu;
