import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/layout";
import Button from "../components/button";

import { bannerWrapper, bannerText } from "./index.module.css";

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
      <section className={bannerWrapper}>
        <p className={bannerText}>{description}</p>
        <Link to="/scenarios/all">
          <Button callback={() => {}}>
            <span>Explore Scenarios</span>
          </Button>
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
