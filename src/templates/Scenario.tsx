import React, { ReactElement } from "react";
import { graphql } from "gatsby";

interface ScenarioProps {
  data: any;
}

export default ({ data }: ScenarioProps): ReactElement => {
  return <h1>{data.scenariosJson.name}</h1>;
};

export const pageQuery = graphql`
  query($id: String) {
    scenariosJson(id: { eq: $id }) {
      name
    }
  }
`;
