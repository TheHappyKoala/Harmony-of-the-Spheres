import React from "react";
import type { HeadFC } from "gatsby";
import Layout from "../components/layout";
import "../css/index.less";

const IndexPage = () => {
  return (
    <Layout>
      <h2>Hello</h2>
    </Layout>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Home Page</title>;
