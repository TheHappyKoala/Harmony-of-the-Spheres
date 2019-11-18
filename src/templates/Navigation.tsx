import React, { ReactElement, Fragment } from "react";
import { graphql, Link } from "gatsby";
import Starfield from "../components/Starfield";
import Head from "../components/Head";
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
}

export default ({ data }: IndexProps): ReactElement => {
  const categories = data.categories.group;
  const scenarios = data.scenarios.edges;

  return (
    <Fragment>
      <Head />
      <Starfield />
      <header>
        <h1>Gravity Simulator</h1>
        <nav>
          <ul>
            <li>
              <Link to={`/`}>All</Link>
            </li>
            {categories.map(category => (
              <li>
                <Link to={`/${category.fieldValue.toLowerCase()}`}>
                  {category.fieldValue}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main>
        {scenarios.map(({ node }) => (
          <Link to={`/${node.type.toLowerCase()}/${node.name.toLowerCase()}`}>
            <div className="scenario-link">
              <img
                src={`/images/scenarios/${node.name}.png`}
                className="scenario-image"
              />
              <p className="scenario-name">{node.name}</p>
            </div>
          </Link>
        ))}
      </main>
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
