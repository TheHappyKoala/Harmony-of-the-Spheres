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
  location: any;
}

export default ({ data, location }: IndexProps): ReactElement => {
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
                <h3 className="italic">2022-12-12</h3>
                <p>
                  <b>Add Newly Discovered Exosystems</b>
                </p>
                <p className="contributor-description">
                  Added dozens of newly discovered exoplanetary systems.{" "}
                </p>
              </section>
            </li>
            <li className="credits-list-item">
              <section className="contributor-details">
                <h3 className="italic">2022-08-14</h3>
                <p>
                  <b>More Small Stuff</b>
                </p>
                <p className="contributor-description">
                  Added planetary atmospheres, which are very much a work in
                  progress, in addition to a couple of new exoplanet scenarios.
                  The contact form has been temporarily been disabled because of
                  the large amount of spam received over the past couple of
                  weeks.{" "}
                </p>
              </section>
            </li>
            <li className="credits-list-item">
              <section className="contributor-details">
                <h3 className="italic">2022-07-11</h3>
                <p>
                  <b>Bunch of Small Stuff</b>
                </p>
                <p className="contributor-description">
                  New high resolution textures have been added for all the
                  planets of the solar system, Earth's moon, the Galilean moons
                  and the dwarf planets Eris and Makemake. Since these textures
                  take much longer to load, a loading screen has been added, as
                  well. Moreover, light now decays according to the
                  inverse-square law and its colour depends on which part of the
                  spectrum most of a star's light is emitted.{" "}
                </p>
              </section>
            </li>
            <li className="credits-list-item">
              <section className="contributor-details">
                <h3 className="italic">2022-06-19</h3>
                <p>
                  <b>Add Button for Resetting Scenarios</b>
                </p>
                <p className="contributor-description">
                  A button for resetting scenarios has been added to the bottom
                  panel, which means that scenarios can be reset without having
                  to reload the website.{" "}
                </p>
              </section>
            </li>
            <li className="credits-list-item">
              <section className="contributor-details">
                <h3 className="italic">2022-06-15</h3>
                <p>
                  <b>Add Mass Bug Fix</b>
                </p>
                <p className="contributor-description">
                  The preceding update added a bug that caused the simulation to
                  crash when you tried to add a mass to a simulation with no
                  masses: this has now been fixed.{" "}
                </p>
              </section>
            </li>
            <li className="credits-list-item">
              <section className="contributor-details">
                <h3 className="italic">2022-06-11</h3>
                <p>
                  <b>Exoplanets and New Add Mass Functionality</b>
                </p>
                <p className="contributor-description">
                  Six exoplanet scenarios have been added, one of which
                  simulates a system with a grand total of three confirmed
                  planets. Some stellar mass templates have been added, and more
                  than that, it is now possible to choose not to use a mass
                  template and specify the mass and radius of the mass you are
                  adding yourself. Feedback on this feature would be much
                  welcome, and yes, textures will be added in a future release
                  for these custom masses!{" "}
                </p>
              </section>
            </li>
            <li className="credits-list-item">
              <section className="contributor-details">
                <h3 className="italic">2022-06-01</h3>
                <p>
                  <b>Exoplanets Update</b>
                </p>
                <p className="contributor-description">
                  New exoplanet scenarios have been added and the exoplanet wiki
                  has been revamped, in addition to a better model for
                  generating the colour of a star based on its temperature.{" "}
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
