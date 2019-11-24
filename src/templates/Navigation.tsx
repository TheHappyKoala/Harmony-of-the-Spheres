import React, { ReactElement, Fragment } from "react";
import { graphql, Link } from "gatsby";
import kebabCase from "lodash/kebabCase";
import Starfield from "../components/Starfield";
import Head from "../components/Head";
import Nav from "../components/Nav";
import NavItem from "../components/NavItem";
import Pagination from "../components/Pagination";
import "./Navigation.less";

interface IndexProps {
  data: {
    scenarios: {
      edges: {
        node: {
          type: string;
          name: string;
        };
      }[];
    };
    categories: {
      group: { fieldValue: string }[];
    };
  };
  pageContext: {
    limit: number;
    skip: number;
    numPages: number;
    currentPage: number;
    currentPageName: string;
    pagePath: string;
  };
}

export default ({ data, pageContext }: IndexProps): ReactElement => {
  const categories = data.categories.group;
  const scenarios = data.scenarios.edges;

  console.log(pageContext);

  return (
    <Fragment>
      <Head />
      <Starfield />
      <section className="scenarios-wrapper">
        <Nav>
          <NavItem active={pageContext.currentPageName === "All"}>
            <Link to={`/`}>All</Link>
          </NavItem>
          {categories.map(category => (
            <Link to={`/${kebabCase(category.fieldValue)}`}>
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
        <div className="scenarios-gallery">
          {scenarios.map(({ node }) => (
            <Link to={`/${kebabCase(node.type)}/${kebabCase(node.name)}`}>
              <div className="scenario-link">
                <img
                  src={`/images/scenarios/${node.name}.png`}
                  className="scenario-image"
                />
                <p className="scenario-name">{node.name}</p>
              </div>
            </Link>
          ))}
        </div>
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
      </section>
    </Fragment>
  );
};

export const pageQuery = graphql`
  query($type: String, $limit: Int, $skip: Int) {
    scenarios: allScenariosJson(
      filter: { type: { eq: $type } }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          type
          name
        }
      }
    }
    categories: allScenariosJson {
      group(field: type) {
        fieldValue
      }
    }
  }
`;
