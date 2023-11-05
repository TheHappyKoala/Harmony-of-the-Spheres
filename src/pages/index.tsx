import React from "react";
import { graphql, Link } from "gatsby";
import { getImage, GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import Layout from "../components/layout";
import "../css/pages/home.less";

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
      <div className="home-page-banner-wrapper">
        <section className="container container--home-page-banner">
          <p className="container__home-page-banner-description">
            {description}
          </p>
          <Link to="/solar-system/all">
            <div className="container__home-page-banner-explore-scenarios-button">
              <span>Explore Scenarios</span>{" "}
              <i className="fa-solid fa-angles-right" />
            </div>
          </Link>
        </section>
      </div>
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

    background: file(relativePath: { eq: "Home.jpg" }) {
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
