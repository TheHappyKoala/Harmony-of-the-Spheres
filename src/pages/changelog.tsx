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
        alt="Mars from orbit"
      />
      <Header
        pageTitle="Changelog"
        pageDescription="Learn about the people that developed Gravity Simulator."
        location={location}
      />
      <section className="credits-wrapper">
        <article>
          <h2>Changelog</h2>
          <ul>
            <li className="credits-list-item">
              <section className="contributor-details">
                <h3 className="italic">2022-06-01</h3>
                <p className="italic">Maintainer and Developer</p>
                <p className="contributor-description">
                  Environmental economist and software developer with a strong
                  interest in science. Has no clue what he is doing.{" "}
                  <a
                    href="https://darrellhuffman.me"
                    target="blank"
                    className="credits-learn-more"
                  >
                    Learn More
                  </a>
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
