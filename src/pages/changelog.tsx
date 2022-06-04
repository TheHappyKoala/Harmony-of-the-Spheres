import React, { ReactElement, Fragment } from "react";
import { graphql } from "gatsby";
import Img from "gatsby-image";
import Header from "../components/Header";
import "./credits.less";

interface IndexProps {
  data: {
    background: {
      childImageSharp: {
        fluid: any;
      };
    };
  };
}

export default ({ data }: IndexProps): ReactElement => {

  return (
    <Fragment>
      <Img
        fluid={data.background.childImageSharp.fluid}
        style={{ position: "fixed", top: 0, bottom: 0, width: "100%" }}
        alt="Colourful nebula"
      />
      <Header
        pageTitle="Changelog"
        pageDescription="Learn about the newest updates to Gravity Simulator."
        location={location}
      />
      <section className="credits-wrapper">
        <article>
          <h2>Changelog</h2>
          <ul>
            <li className="credits-list-item">
              <section className="contributor-details">
                <h3 className="italic">2022-06-01</h3>
                <p><b>Exoplanets Update</b></p>
                <p className="contributor-description">
                  New exoplanet scenarios have been added and the exoplanet wiki has been revamped, in addition to a better model for generating the colour of a star based on its temperature.{" "}
                </p>
              </section>
            </li>
          </ul>
        </article>
      </section>
    </Fragment>
  );
};

export const pageQuery = graphql`
  query {
    background: file(relativePath: { eq: "changelog.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 2000) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`;
