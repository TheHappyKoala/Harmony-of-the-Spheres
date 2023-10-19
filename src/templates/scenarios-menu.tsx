import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/layout";
import NavigationMenu from "../components/navigation-menu";
import NavigationMenuItem from "../components/navigation-menu/navigation-menu-item";
import { kebabCase } from "../utils/text-utils";
import {
  ScenariosCategoryTreeType,
  ScenarioCategoryType,
} from "../types/scenario";
import "../css/index.less";

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
  };
  pageContext: {
    category: string;
    categoryTree: ScenariosCategoryTreeType;
    scenarioDataAlias: string;
  };
};

const IndexPage = ({
  data,
  pageContext: { categoryTree, category },
}: Props) => (
  <Layout>
    <section>
      <NavigationMenu>
        {categoryTree.map((categoryBranch) => (
          <Link
            to={`/${kebabCase(categoryBranch.name)}${
              categoryBranch.subCategories.length ? "/all" : ""
            }`}
          >
            <NavigationMenuItem>{categoryBranch.name}</NavigationMenuItem>
          </Link>
        ))}
      </NavigationMenu>{" "}
      {
        <NavigationMenu>
          {categoryTree
            ?.find(({ name }) => name === category)
            ?.subCategories.map((subCategory) => (
              <Link to={`/${kebabCase(category)}/${kebabCase(subCategory)}`}>
                <NavigationMenuItem>{subCategory}</NavigationMenuItem>
              </Link>
            ))}
        </NavigationMenu>
      }
    </section>
    <section>
      {data.scenariosJson.scenarios.map(({ scenario }) => (
        <div>{scenario.name}</div>
      ))}
    </section>
  </Layout>
);

export const pageQuery = graphql`
  query ($category: String, $subCategoryRegex: String = "//") {
    scenariosJson: allScenariosJson(
      filter: {
        category: {
          name: { eq: $category }
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
  }
`;

export default IndexPage;
