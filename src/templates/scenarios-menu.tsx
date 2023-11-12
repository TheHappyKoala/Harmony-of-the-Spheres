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
    subCategory: string;
  };
};

const ScenarioMenu = ({
  data: { categoryTree, scenariosJson, background },
  pageContext: { category, subCategory },
}: Props) => {
  const backgroundImage = getImage(background) as IGatsbyImageData;

  const subCategories = categoryTree?.find(({ name }) => name === category)
    ?.subCategories;

  return (
    <Layout currentPage="scenarios">
      <GatsbyImage
        image={backgroundImage}
        className="background-image"
        alt="Website background image"
      />
      <section>
        <NavigationMenu modifierCssClassName="navigation-menu--scenarios-menu">
          {categoryTree.map((categoryBranch) => (
            <Link
              to={`/${kebabCase(categoryBranch.name)}${
                categoryBranch.subCategories.length ? "/all" : ""
              }`}
            >
              <NavigationMenuItem active={category === categoryBranch.name}>
                {categoryBranch.name}
              </NavigationMenuItem>
            </Link>
          ))}
        </NavigationMenu>{" "}
        {subCategories?.length ? (
          <NavigationMenu modifierCssClassName="navigation-menu--scenarios-menu navigation-menu--scenarios-menu-border-bottom">
            <Link to={`/${kebabCase(category)}/all`}>
              <NavigationMenuItem active={subCategory === "all"}>
                All
              </NavigationMenuItem>
            </Link>
            {subCategories.map((subCategoryEntry) => (
              <Link
                to={`/${kebabCase(category)}/${kebabCase(subCategoryEntry)}`}
              >
                <NavigationMenuItem active={subCategory === subCategoryEntry}>
                  {subCategoryEntry}
                </NavigationMenuItem>
              </Link>
            ))}
          </NavigationMenu>
        ) : null}
      </section>
      <section className="scenarios-list">
        {scenariosJson.scenarios.map(({ scenario }) => (
          <Link
            to={`/${kebabCase(category)}${
              scenario.category.subCategory
                ? `/${kebabCase(scenario.category.subCategory)}/${kebabCase(
                    scenario.name,
                  )}`
                : `/${kebabCase(scenario.name)}`
            }`}
          >
            <div className="scenarios-list__scenarios-list-item">
              {scenario.name}
            </div>
          </Link>
        ))}
      </section>
    </Layout>
  );
};

export const pageQuery = graphql`
  query (
    $category: String
    $subCategoryRegex: String = "//"
    $backgroundImage: String
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
        gatsbyImageData(
          placeholder: BLURRED
          formats: [AUTO, WEBP, AVIF]
          layout: FULL_WIDTH
        )
      }
    }
  }
`;

export default ScenarioMenu;
