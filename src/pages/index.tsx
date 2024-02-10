import React from "react";
import { graphql, Link } from "gatsby";
import { getImage, GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import Layout from "../components/layout";
import "../css/index.less";

type Props = {
  data: {
    background: IGatsbyImageData;
    site: {
      siteMetadata: {
        description: string;
      };
    };
  };
};

const Home = ({
  data: {
    background,
    site: {
      siteMetadata: { description },
    },
  },
}: Props) => {
  const backgroundImage = getImage(background) as IGatsbyImageData;

  return (
    <Layout>
      <GatsbyImage
        image={backgroundImage}
        className="background-image"
        alt="Website background image"
      />
      <section className="home-page-banner">
        <p className="home-page-banner__description">{description}</p>
        <Link to="/scenarios/all">
          <div className="home-page-banner__explore-button">
            <span>Explore Scenarios</span>{" "}
            <i className="fa-solid fa-angles-right" />
          </div>
        </Link>
      </section>
    </Layout>
  );
};

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        description
      }
    }

    background: file(relativePath: { eq: "backgrounds/Home.jpg" }) {
      childImageSharp {
        gatsbyImageData(
          placeholder: BLURRED
          formats: [AUTO, WEBP, AVIF]
          layout: FULL_WIDTH
        )
      }
    }
  }
`;

export default Home;
