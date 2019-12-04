import React, { ReactElement, Fragment, useCallback } from "react";
import { graphql, navigate } from "gatsby";
import Img from "gatsby-image";
import Header from "../components/Header";
import Button from "../components/Button";
import "./credits.less";

interface IndexProps {
  data: {
    background: {
      childImageSharp: {
        fluid: any;
      };
    };
    darrell: {
      childImageSharp: {
        fixed: any;
      };
    };
    hugo: {
      childImageSharp: {
        fixed: any;
      };
    };
    prisoner: {
      childImageSharp: {
        fixed: any;
      };
    };
    john: {
      childImageSharp: {
        fixed: any;
      };
    };
  };
  location: any;
}

export default ({ data, location }: IndexProps): ReactElement => {
  const navigateBack = useCallback(() => {
    if (window.PREVIOUS_PATH == null) navigate(`/`);
    else window.history.back();
  }, []);

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
      <div className="credits-wrapper">
        <Button cssClassName="button credits-back" callback={navigateBack}>
          <Fragment>
            <i className={`fas fa-chevron-left fa-2x`} />
          </Fragment>
        </Button>
        <section className="contributors">
          <article>
            <div className="contributor-avatar">
              <Img
                fixed={data.darrell.childImageSharp.fixed}
                alt="Darrell Huffman avatar"
              />
            </div>
            <section className="contributor-details">
              <h3>Darrell A. Huffman</h3>
              <p className="italic">Maintainer and Developer</p>
              <p className="contributor-description">
                Environmental economist and software developer with a strong
                interest in science. Has no clue what he is doing.{" "}
                <a
                  href="https://thehappykoala.github.io/"
                  target="blank"
                  className="credits-learn-more"
                >
                  Learn More
                </a>
              </p>
            </section>
          </article>
          <article>
            <div className="contributor-avatar">
              <Img
                fixed={data.hugo.childImageSharp.fixed}
                alt="Hugo Granström avatar"
              />
            </div>
            <section className="contributor-details">
              <h3>Hugo Granström</h3>
              <p className="italic">Collaborator and Developer</p>
              <p className="contributor-description">
                Swedish science and programming enthusiast. Studying Engineering
                Physics.{" "}
                <a
                  href="https://hugogranstrom.com/"
                  target="blank"
                  className="credits-learn-more"
                >
                  Learn More
                </a>
              </p>
            </section>
          </article>
          <article>
            <div className="contributor-avatar">
              <Img
                fixed={data.prisoner.childImageSharp.fixed}
                alt="Prisoner849 avatar"
              />
            </div>
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
          </article>
          <article className="contributor-entry">
            <div className="contributor-avatar">
              <Img
                fixed={data.john.childImageSharp.fixed}
                alt="Johmn Van Vliet avatar"
              />
            </div>
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
          </article>
        </section>
      </div>
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
    darrell: file(relativePath: { eq: "darrell.jpg" }) {
      childImageSharp {
        fixed(width: 150, height: 165) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    hugo: file(relativePath: { eq: "hugo.jpg" }) {
      childImageSharp {
        fixed(width: 150, height: 165) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    prisoner: file(relativePath: { eq: "prisoner849.png" }) {
      childImageSharp {
        fixed(width: 150, height: 165) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    john: file(relativePath: { eq: "john.png" }) {
      childImageSharp {
        fixed(width: 150, height: 165) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`;
