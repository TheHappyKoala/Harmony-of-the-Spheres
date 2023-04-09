import React, {
  ReactElement,
  Fragment,
  useState,
  useEffect,
  useCallback
} from "react";
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
    categoryDescription: string;
    type: string;
    pageType: string;
  };
  location: any;
}

export default ({ data, pageContext, location }: IndexProps): ReactElement => {
  const categories = data.categories.group;
  const scenarios = data.scenarios.edges;

  const [savedScenarios, setSavedScenarios] = useState([]);

  useEffect(() => {
    const savedScenariosNamespace = "saved scenarios";

    const savedScenariosObject = window.localStorage.getItem(
      savedScenariosNamespace
    );

    if (savedScenariosObject !== null) {
      setSavedScenarios(JSON.parse(savedScenariosObject));
    }
  }, []);

  const setSavedScenarioToLoadCallback = useCallback(event => {
    window.localStorage.setItem(
      "scenario-to-load",
      event.target.getAttribute("data-saved-scenario")
    );
  }, []);

  return (
    <Fragment>
      <Img
        fluid={data.file.childImageSharp.fluid}
        style={{ position: "fixed", top: 0, bottom: 0, width: "100%" }}
      />
      <Header
        pageTitle={pageContext.currentPageName}
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
            <Link to={`/new-scenarios`}>
              <NavItem active={pageContext.currentPageName === "New Scenarios"}>
                New Scenarios
              </NavItem>
            </Link>
            <Link to={"/misc/create-new-gravity-simulation"}>
              <NavItem>Create New Simulation</NavItem>
            </Link>
            <Link to={"/saved-scenarios"}>
              <NavItem>Saved Scenarios</NavItem>
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
                    kebabCase(category.fieldValue)
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
          <h2>{`${pageContext.currentPageName} Scenarios`}</h2>
        </section>
        <div className="scenarios-gallery">
          {pageContext.type !== "Saved Scenarios"
            ? scenarios.map(({ node }) => (
                <Link to={`/${kebabCase(node.type)}/${kebabCase(node.name)}`}>
                  <div className="scenario-link">
                    <Img
                      fixed={node.fields.scenarioImage.childImageSharp.fixed}
                    />
                    <p className="scenario-name">{node.name}</p>
                  </div>
                </Link>
              ))
            : savedScenarios.map(savedScenario => (
                <Link to="/saved-scenario">
                  <div
                    className="scenario-link"
                    data-saved-scenario={savedScenario.name}
                    onClick={setSavedScenarioToLoadCallback}
                  >
                    <p className="scenario-name">{savedScenario.name}</p>
                  </div>
                </Link>
              ))}
        </div>
      </section>
    </Fragment>
  );
};

export const pageQuery = graphql`
  query($type: String, $limit: Int, $skip: Int, $background: String) {
    scenarios: allScenariosJson(
      filter: { type: { eq: $type } }
      sort: { order: ASC, fields: [sortOrder] }
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
