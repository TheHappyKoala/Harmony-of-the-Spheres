import React, { ReactElement, Fragment } from "react";
import { graphql, Link } from "gatsby";
import Img from "gatsby-image";
import kebabCase from "lodash/kebabCase";
import Nav from "../components/Nav";
import NavItem from "../components/NavItem";
import Pagination from "../components/Pagination";
import Header from "../components/Header";
import "./Navigation.less";

interface IndexProps {
  data: {
    scenarios: {
      edges: {
        node: {
          type: string;
          discoveryFacility: string;
          name: string;
          fields: {
            scenarioImage: {
              childImageSharp: {
                fixed: any;
              };
            };
          };
        };
      }[];
    };
    file: {
      childImageSharp: {
        fluid: any;
      };
    };
    categories: {
      group: { fieldValue: string }[];
    };
  };
  pageContext: {
    limit: number;
    skip: number;
    discoveryFacility: string;
    numPages: number;
    currentPage: number;
    currentPageName: string;
    pagePath: string;
    type: string;
    categoryDescription: string;
    pageType: string;
  };
  location: any;
}

export default ({ data, pageContext, location }: IndexProps): ReactElement => {
  const categories = data.categories.group;
  const scenarios = data.scenarios.edges;

  return (
    <Fragment>
      <Img
        fluid={data.file.childImageSharp.fluid}
        style={{ position: "fixed", top: 0, bottom: 0, width: "100%" }}
      />
      <Header
        pageTitle={`Exoplanets ${pageContext.currentPageName}`}
        pageDescription={pageContext.categoryDescription}
        location={location}
        pageType={pageContext.pageType}
        image={`https://www.gravitysimulator.org/images/social/${pageContext.currentPageName}.jpg`}
      />
      <section className="scenarios-wrapper">
        <nav>
          <Nav
            css={{
              borderLeft: "none",
              borderRight: "none",
              borderTop: "none",
              fontWeight: "bold"
            }}
          >
            <Link to={`/`}>
              <NavItem active={pageContext.currentPageName === "All"}>
                All
              </NavItem>
            </Link>
            {categories.map(category => (
              <Link
                to={
                  category.fieldValue !== "Exoplanets"
                    ? `/${kebabCase(category.fieldValue)}`
                    : `/${kebabCase(category.fieldValue)}/hall-of-fame`
                }
              >
                <NavItem
                  active={
                    kebabCase(pageContext.currentPageName) ===
                      kebabCase(category.fieldValue) ||
                    category.fieldValue === "Exoplanets"
                  }
                >
                  {category.fieldValue}
                </NavItem>
              </Link>
            ))}
          </Nav>
        </nav>

        {pageContext.type === "Exoplanets" && (
          <Nav
            css={{
              borderLeft: "none",
              borderRight: "none",
              borderTop: "none",
              fontWeight: "bold"
            }}
          >
            <Link to={`/exoplanets/hall-of-fame`}>
              <NavItem active={pageContext.currentPageName === "Hall of Fame"}>
                Hall of Fame
              </NavItem>
            </Link>

            {["Transit", "Radial Velocity", "Imaging"].map(
              discoveryFacility => (
                <Link to={`/exoplanets/${kebabCase(discoveryFacility)}`}>
                  <NavItem
                    active={
                      kebabCase(pageContext.currentPageName) ===
                      kebabCase(discoveryFacility)
                    }
                  >
                    {discoveryFacility}
                  </NavItem>
                </Link>
              )
            )}
          </Nav>
        )}

        {pageContext.numPages > 1 && (
          <Pagination
            pagination={{
              start: pageContext.skip,
              end: pageContext.currentPage * pageContext.limit,
              count: pageContext.numPages,
              page: pageContext.currentPage,
              path: pageContext.pagePath
            }}
            itemsPerPage={pageContext.limit}
          />
        )}
        <section className="navigation-scenarios-title">
          <h2>{`Exoplanets - Detected Using the ${pageContext.currentPageName} Method`}</h2>
        </section>
        <div className="scenarios-gallery">
          {scenarios.map(({ node }) => (
            <Link to={`/${kebabCase(node.type)}/${kebabCase(node.name)}`}>
              <div className="scenario-link">
                <Img fixed={node.fields.scenarioImage.childImageSharp.fixed} />
                <p className="scenario-name">{node.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </Fragment>
  );
};

export const pageQuery = graphql`
  query(
    $discoveryFacility: String
    $limit: Int
    $skip: Int
    $background: String
  ) {
    scenarios: allScenariosJson(
      filter: { discoveryFacility: { eq: $discoveryFacility } }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          type
          discoveryFacility
          name
          pl_pnum
          fields {
            scenarioImage {
              childImageSharp {
                fixed(width: 250, height: 150) {
                  ...GatsbyImageSharpFixed
                }
              }
            }
          }
        }
      }
    }
    categories: allScenariosJson {
      group(field: type) {
        fieldValue
      }
    }
    file(relativePath: { eq: $background }) {
      childImageSharp {
        fluid(maxWidth: 2000) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`;
