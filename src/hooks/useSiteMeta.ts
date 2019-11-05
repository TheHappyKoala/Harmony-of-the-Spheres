import { useStaticQuery, graphql } from "gatsby";

export default (): {
  title: string;
  author: string;
  lang: string;
} => {
  const { site } = useStaticQuery(
    graphql`
      query SiteMetaQuery {
        site {
          siteMetadata {
            title
            author
            lang
          }
        }
      }
    `
  );

  return site.siteMetadata;
};
