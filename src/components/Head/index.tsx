import React, { ReactElement } from "react";
import Helmet from "react-helmet";
import useSiteMeta from "../../hooks/useSiteMeta";

interface HeadProps {
  pageTitle: string;
  pageDescription?: string;
}

export default ({ pageTitle, pageDescription }: HeadProps): ReactElement => {
  const siteMeta = useSiteMeta();

  pageTitle = pageTitle !== undefined ? pageTitle : siteMeta.title;
  pageDescription =
    pageDescription !== undefined ? pageDescription : siteMeta.description;

  return (
    <Helmet>
      <html lang={siteMeta.lang} />
      <title>{`${siteMeta.title} | ${pageTitle}`}</title>
      <meta name="description" content={pageDescription} />
      <meta name="author" content={siteMeta.author} />
      <meta property="og:site_name" content={siteMeta.title} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:type" content="game" />
      <meta property="og:description" content={pageDescription} />
      <meta
        property="og:image"
        content={`https://www.gravitysimulator.org/images/scenarios/${pageTitle}.png}`}
      />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="627" />
      <meta property="og:image:type" content="image/png" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta
        name="twitter:image"
        content={`https://www.gravitysimulator.org/images/scenarios/${pageTitle}.png}`}
      />
      <meta name="twitter:site" content="@DarrellAHuffma1" />
      <meta name="twitter:creator" content="@DarrellAHuffma1" />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Rubik+Mono+One&display=swap"
        rel="stylesheet"
      />
    </Helmet>
  );
};
