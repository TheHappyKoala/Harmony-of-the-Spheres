import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/layout";

type Props = {
  data: {
    site: {
      siteMetadata: {
        description: string;
      };
    };
  };
};

const Home = ({
  data: {
    site: {
      siteMetadata: { description },
    },
  },
}: Props) => {
  return (
    <Layout>
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
  }
`;

export default Home;
