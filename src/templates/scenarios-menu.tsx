import React from "react";
import { graphql, Link } from "gatsby";
import { getImage, GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import Layout from "../components/layout";
import NavigationMenu from "../components/navigation-menu";
import NavigationMenuItem from "../components/navigation-menu/navigation-menu-item";
import { kebabCase } from "../utils/text-utils";
import { ScenariosCategoryTreeType } from "../types/category";
import { ScenarioCategoryType } from "../types/scenario";
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
    categoryTree: ScenariosCategoryTreeType;
    background: IGatsbyImageData;
  };
  pageContext: {
    category: string;
  };
};

const ScenarioMenu = ({
  data: { categoryTree, scenariosJson, background },
  pageContext: { category },
}: Props) => {
  const backgroundImage = getImage(background) as IGatsbyImageData;

  return (
    <Layout>
      <GatsbyImage
        image={backgroundImage}
        className="background-image"
        alt="Website background image"
      />
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
        {scenariosJson.scenarios.map(({ scenario }) => (
          <div>{scenario.name}</div>
        ))}
      </section>
    </Layout>
  );
};

export const pageQuery = graphql`
  query (
    $category: String
    $subCategoryRegex: String = "//"
    $backgroundImage: String = "Solar System.jpg"
  ) {
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

    categoryTree {
      name
      subCategories
    }

    background: file(relativePath: { eq: $backgroundImage }) {
      childImageSharp {
        gatsbyImageData(quality: 90, layout: FULL_WIDTH)
      }
    }
  }
`;

export default ScenarioMenu;
