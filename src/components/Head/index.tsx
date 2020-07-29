import React, { ReactElement } from "react";
import Helmet from "react-helmet";
import useSiteMeta from "../../hooks/useSiteMeta";

interface HeadProps {
  pageTitle: string;
  pageDescription: string;
  pathName: string;
  bodyCssClass: string;
}

export default ({
  pageTitle,
  pageDescription,
  pathName,
  bodyCssClass
}: HeadProps): ReactElement => {
  const siteMeta = useSiteMeta();

  return (
    <Helmet>
      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=UA-153406767-1"
      ></script>
      <script>{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'UA-153406767-1');
      `}</script>
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
        content={`https://www.gravitysimulator.org/images/scenarios/${pageTitle}.png`}
      />
      <meta property="og:image:width" content="400" />
      <meta property="og:image:height" content="250" />
      <link
        property="og:url"
        href={`https://gravitysimulator.org${pathName}`}
      ></link>
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      />
      <body className={bodyCssClass ? bodyCssClass : ""} />
    </Helmet>
  );
};
