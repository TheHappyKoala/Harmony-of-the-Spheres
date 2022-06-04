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
        alt="Mars from orbit"
      />
      <Header
        pageTitle="Credits"
        pageDescription="Learn about the people that developed Gravity Simulator."
        location={location}
      />
      <section className="credits-wrapper">
        <article>
          <h2>Credits</h2>
          <ul>
            <li className="credits-list-item">
              <section className="contributor-details">
                <h3>Darrell A. Huffman</h3>
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
            <li className="credits-list-item">
              <section className="contributor-details">
                <h3>Hugo Granström</h3>
                <p className="italic">Collaborator and Developer</p>
                <p className="contributor-description">
                  Swedish science and programming enthusiast. Studying
                  Engineering Physics.{" "}
                  <a
                    href="https://hugogranstrom.com/"
                    target="blank"
                    className="credits-learn-more"
                  >
                    Learn More
                  </a>
                </p>
              </section>
            </li>
            <li className="credits-list-item">
              <section className="contributor-details">
                <h3>Paul West</h3>
                <p className="italic">Developer</p>
                <p className="contributor-description">
                  Possibly the most helpful and gracious fellow in the WebGL
                  community.{" "}
                  <a
                    href="https://discourse.threejs.org/u/prisoner849/summary"
                    target="blank"
                    className="credits-learn-more"
                  >
                    Learn More
                  </a>
                </p>
              </section>
            </li>
            <li className="credits-list-item">
              <section className="contributor-details">
                <h3>John Van Vliet</h3>
                <p className="italic">Planet and Moon Textures</p>
                <p className="contributor-description">
                  Makes maps of planets and moons, along with minor bodies and
                  asteroids.{" "}
                  <a
                    href="https://github.com/JohnVV"
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
        <article>
          <h2>Resources</h2>
          <ul>
            <li>
              <h3>HORIZONS</h3>
              <p>
                The Jet Propulsions Laboratory's HORIZONS system is used to
                generate ephemerides for solar-system bodies. All state vectors
                for solar system scenarios were obtained from HORIZONS.{" "}
                <a
                  href="https://ssd.jpl.nasa.gov/horizons.cgi#top"
                  target="blank"
                  className="credits-learn-more"
                >
                  Learn More
                </a>
              </p>
            </li>
            <li>
              <h3>NASA Exoplanet Archive</h3>
              <p>
                The NASA Exoplanet Archive is an online astronomical exoplanet
                and stellar catalog and data service that collates and
                cross-correlates astronomical data and information on exoplanets
                and their host stars, and provides tools to work with these
                data. All the orbital elements used to create the exoplanetary
                simulations were obtained from the Exoplanet Archive.{" "}
                <a
                  href="https://exoplanetarchive.ipac.caltech.edu/"
                  target="blank"
                  className="credits-learn-more"
                >
                  Learn More
                </a>
              </p>
            </li>
            <li>
              <h3>3D Asteroid Catalogue</h3>
              <p>
                3D Asteroid Catalogue is an interactive catalogue that contains
                3D models, orbital and physical parameters and current orbital
                position of known minor bodies. All asteroid models used in
                Gravity Simulator were obtained from the 3D asteroid Catalogue.{" "}
                <a
                  href="https://3d-asteroids.space/"
                  target="blank"
                  className="credits-learn-more"
                >
                  Learn More
                </a>
              </p>
            </li>
            <li>
              <h3>NASA 3D Resources</h3>
              <p>
                A growing collection of 3D models, textures, and images from
                inside NASA. All spacecraft 3D models used in Gravity Simulator,
                unless otherwise noted, were obtained from NASA 3D Resources.{" "}
                <a
                  href="https://nasa3d.arc.nasa.gov/"
                  target="blank"
                  className="credits-learn-more"
                >
                  Learn More
                </a>
              </p>
            </li>
            <li>
              <h3>Uncharted</h3>
              <p>
                A 3D visualization of Earth’s solar neighborhood out to 75 light
                years, rendered in the browser using WebGL. The procedural star
                shaders used in Gravity Simulator were written by Ben Podgursky
                for Uncharted.{" "}
                <a
                  href="https://github.com/bpodgursky/uncharted"
                  target="blank"
                  className="credits-learn-more"
                >
                  Learn More
                </a>
              </p>
            </li>
            <li>
              <h3>Poliastro</h3>
              <p>
                Poliastro is an open source pure Python package dedicated to
                problems arising in Astrodynamics and Orbital Mechanics, such as
                orbit propagation, solution of the Lambert's problem, conversion
                between position and velocity vectors and classical orbital
                elements and orbit plotting, focusing on interplanetary
                applications. The Lambert Solver in Gravity Simulator, which was
                written by Hugo Granström, is based the Poliastro
                implementation.{" "}
                <a
                  href="https://github.com/poliastro/poliastro"
                  target="blank"
                  className="credits-learn-more"
                >
                  Learn More
                </a>
              </p>
            </li>
            <li>
              <h3>Robert Vanderbei</h3>
              <p>
                Robert Vanderbei is a Professor in the Department of Operations
                Research and Financial Engineering at Princeton University. The
                state vectors for the scenarios that deal with n-body
                choreographies were obtained from his website.{" "}
                <a
                  href="https://vanderbei.princeton.edu/"
                  target="blank"
                  className="credits-learn-more"
                >
                  Learn More
                </a>
              </p>
            </li>
          </ul>
        </article>
      </section>
    </Fragment>
  );
};

export const pageQuery = graphql`
  query {
    background: file(relativePath: { eq: "credits.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 2000) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`;
